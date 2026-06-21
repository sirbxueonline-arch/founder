import type { Metadata } from "next";

import { getStripe } from "@/lib/stripe";
import { getLicenseBySubscription } from "@/lib/license";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Foundrr — Welcome", robots: { index: false } };

async function keyForSession(sessionId: string | undefined): Promise<string | null> {
  if (!sessionId) return null;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;
    if (!subId) return null;
    const lic = await getLicenseBySubscription(subId);
    return lic?.license_key ?? null;
  } catch {
    return null;
  }
}

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const key = await keyForSession(session_id);

  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main className="mx-auto max-w-2xl px-5 py-24 text-center sm:py-32">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink-faint">
          Welcome aboard
        </p>
        <h1 className="mt-4 font-display text-4xl font-light tracking-[-0.02em] text-ink sm:text-5xl">
          You&apos;re in.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink-muted">
          Here&apos;s your Foundrr license key. Paste it into the dashboard under{" "}
          <strong className="font-medium text-ink">Settings → License</strong> to unlock your plan.
        </p>

        {key ? (
          <div className="mt-8 inline-flex items-center rounded-lg border border-hairline bg-canvas-raised px-5 py-3">
            <code className="select-all font-mono text-base tracking-wide text-ink">{key}</code>
          </div>
        ) : (
          <p className="mt-8 text-sm text-ink-muted">
            Your key is being generated — refresh this page in a few seconds.
          </p>
        )}

        <p className="mx-auto mt-6 max-w-md text-sm text-ink-faint">
          Save this key somewhere safe — it&apos;s tied to your subscription and unlocks Foundrr on
          any machine.
        </p>

        <div className="mt-10">
          <a
            href="/setup"
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
          >
            Set up Foundrr →
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
