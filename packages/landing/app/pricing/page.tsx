import type { Metadata } from "next";

import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Foundrr — Pricing",
  description:
    "Foundrr plans: a managed leash, agent-safety Guard, fleet benchmarking, and team governance.",
  alternates: { canonical: "/pricing" },
};

interface Tier {
  name: string;
  plan: "starter" | "pro" | "team";
  price: string;
  cadence: string;
  blurb: string;
  features: ReadonlyArray<string>;
  highlight?: boolean;
}

const TIERS: ReadonlyArray<Tier> = [
  {
    name: "Starter",
    plan: "starter",
    price: "$3",
    cadence: "per month",
    blurb: "Your leash, made reliable — and your history, saved.",
    features: [
      "Managed leash relay — priority, guaranteed delivery",
      "Push notifications (not just Telegram)",
      "Cloud history sync (1 machine)",
      "Guard: dangerous-command blocking",
      "Your personal cost benchmarks",
    ],
  },
  {
    name: "Pro",
    plan: "pro",
    price: "$7",
    cadence: "per month",
    blurb: "Full agent safety + intelligence for the power solo dev.",
    features: [
      "Everything in Starter, unlimited machines",
      "Guard (full): prompt-injection + secret-exfil detection, auto-quarantine, live rule updates",
      "Session replay — searchable, exportable",
      "AI session insights + anomaly detection",
      "Fleet benchmarking + cost-saving recommendations",
      "Slack / Discord approve · Linear / GitHub links",
    ],
    highlight: true,
  },
  {
    name: "Team",
    plan: "team",
    price: "$12",
    cadence: "per seat / month",
    blurb: "Govern your whole team's agents.",
    features: [
      "Everything in Pro",
      "Approval audit log (exportable)",
      "Roles + SSO / SAML",
      "Org-wide Guard policies",
      "Shared dashboard + per-seat cost rollups",
    ],
  },
];

function Check() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="mt-0.5 shrink-0"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink-faint">Pricing</p>
          <h1 className="mt-4 font-display text-4xl font-light tracking-[-0.02em] text-ink sm:text-5xl">
            Supervise your agents. Safely.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
            A reliable leash, agent-safety Guard, and benchmarks from the whole Foundrr fleet — the
            things you can&apos;t build alone.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col rounded-2xl border bg-canvas-raised p-7"
              style={{
                borderColor: tier.highlight
                  ? "color-mix(in srgb, var(--signal) 55%, var(--hairline))"
                  : "var(--hairline)",
              }}
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-medium text-ink">{tier.name}</h2>
                {tier.highlight ? (
                  <span className="rounded-full bg-signal px-2 py-0.5 text-[0.625rem] font-medium text-[#1b1206]">
                    Most popular
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-light text-ink">{tier.price}</span>
                <span className="text-sm text-ink-faint">{tier.cadence}</span>
              </div>
              <p className="mt-2 text-sm text-ink-muted">{tier.blurb}</p>

              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-[0.9rem] text-ink-muted">
                    <span className="text-signal-ink">
                      <Check />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <a
                  href={`/api/checkout?plan=${tier.plan}`}
                  className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
                >
                  Get {tier.name}
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-ink-faint">
          Secure checkout by Stripe. Cancel anytime. Prices in USD.
        </p>
      </main>
      <Footer />
    </>
  );
}
