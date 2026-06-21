import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import { planForPrice, updateLicenseStatus, upsertLicense } from "@/lib/license";

// Signature verification needs the raw body + Node crypto → Node runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Upsert a license row from a Stripe subscription object. */
async function syncSubscription(sub: Stripe.Subscription, email: string | null): Promise<void> {
  const item = sub.items.data[0];
  await upsertLicense({
    subscriptionId: sub.id,
    customerId: typeof sub.customer === "string" ? sub.customer : (sub.customer?.id ?? null),
    email,
    plan: planForPrice(item?.price.id),
    status: sub.status,
    seats: item?.quantity ?? 1,
    currentPeriodEnd: item?.current_period_end ?? null,
  });
}

/**
 * POST /api/stripe/webhook
 * Verifies the Stripe signature, then issues/updates the license for the
 * subscription. checkout.session.completed mints the key right after purchase;
 * subscription.updated/deleted keep status in sync (renew, past_due, cancel).
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const body = await req.text();
  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await syncSubscription(event.data.object as Stripe.Subscription, null);
        break;
      case "customer.subscription.deleted":
        await updateLicenseStatus((event.data.object as Stripe.Subscription).id, "canceled");
        break;
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const subId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await syncSubscription(sub, session.customer_details?.email ?? null);
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    // Don't 500 to Stripe for a downstream hiccup — it would retry forever.
    // Log and ack; a production build would dead-letter these.
    console.error("stripe webhook handling failed", err);
  }

  return NextResponse.json({ received: true });
}
