import Stripe from "stripe";

/**
 * Live Stripe price ids (created in the "birclick" account). Overridable via env.
 * These are price ids, not secrets — safe to ship.
 */
export const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER || "price_1TkqKzLyS5gAbDs7SJ17yhPo",
  pro: process.env.STRIPE_PRICE_PRO || "price_1TkiqALyS5gAbDs7vvj3NTDC",
  team: process.env.STRIPE_PRICE_TEAM || "price_1TkqL0LyS5gAbDs77zWiydLH",
} as const;

export type PlanKey = keyof typeof PRICE_IDS;

/** Absolute site origin used for Checkout success/cancel redirects. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://foundrr.online";

/**
 * Construct the server-side Stripe client. Throws a clear error when the secret
 * key isn't configured. NEVER expose the secret to the client.
 */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set — add it to the Vercel project env.");
  }
  return new Stripe(key);
}
