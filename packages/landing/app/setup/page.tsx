import type { Metadata } from "next";
import Link from "next/link";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { AgentInstaller } from "@/components/AgentInstaller";
import { CodeBlock } from "@/components/CodeBlock";
import { OnThisPage, type TocItem } from "@/components/OnThisPage";
import { GITHUB_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Set up Founder in two minutes",
  description:
    "Install Founder, wire up your AI coding agent, and start supervising from anywhere. Copy-paste commands for Claude Code, Codex, Gemini CLI, Aider, and Amazon Q.",
  alternates: { canonical: "/setup" },
  openGraph: {
    title: "Set up Founder in two minutes",
    description:
      "Install Founder, wire up your AI coding agent, and start supervising from anywhere.",
    type: "article",
    url: "https://foundrr.online/setup",
    siteName: "Founder",
  },
};

/** Ordered, copy-able install steps. Each renders as a hairline-separated row. */
const INSTALL_STEPS: ReadonlyArray<{
  command: string;
  title: string;
  detail: string;
}> = [
  {
    title: "Clone the repo",
    command: "git clone https://github.com/sirbxueonline-arch/foundrr",
    detail: "Grab the source. It's open and MIT-licensed.",
  },
  {
    title: "Enter the directory",
    command: "cd foundrr",
    detail: "Everything below runs from the repo root.",
  },
  {
    title: "Install dependencies",
    command: "npm install",
    detail: "Pulls the workspace packages — daemon, dashboard, and landing.",
  },
  {
    title: "Build",
    command: "npm run build",
    detail: "Compiles the daemon and dashboard so the CLI is ready to run.",
  },
  {
    title: "Link the CLI",
    command: "npm link",
    detail: "Puts the global mc command on your PATH.",
  },
  {
    title: "Run setup",
    command: "mc setup",
    detail:
      "Generates your token, installs Claude Code hooks, and auto-enables telemetry recording. Safe to re-run.",
  },
  {
    title: "Start the daemon",
    command: "mc start",
    detail:
      "Prints your dashboard URL with a ?token=… on it. Open it in your browser.",
  },
];

/** Prerequisites surfaced as a quiet hairline list above the install steps. */
const PREREQS: ReadonlyArray<{ label: string; detail: string }> = [
  { label: "Node.js 18+", detail: "with npm — runs the daemon and dashboard" },
  { label: "Git", detail: "to clone the repository" },
  { label: "A terminal AI agent", detail: "Claude Code, Codex, Gemini & more" },
];

/** Anchors for the left "On this page" rail (scroll-spy). */
const TOC: readonly TocItem[] = [
  { id: "install", label: "Install Founder", step: "01" },
  { id: "agent", label: "Install your agent", step: "02" },
  { id: "supervise", label: "Supervise anywhere", step: "03" },
  { id: "telemetry", label: "Telemetry" },
];

/** Step 3 cards rendered as hairline-separated blocks, not heavy cards. */
const SUPERVISE_STEPS: ReadonlyArray<{
  title: string;
  command: string;
  body: React.ReactNode;
}> = [
  {
    title: "Pick your model",
    command: "mc config model <key>",
    body: "Set it from the CLI, or use the model picker in the dashboard header.",
  },
  {
    title: "Leash to your phone",
    command: "mc telegram link",
    body: (
      <>
        Link the shared bot, then message{" "}
        <code className="font-mono text-[0.85em] text-ink">
          @foundrremotebot
        </code>{" "}
        to get remote Approve / Deny on your phone.
      </>
    ),
  },
  {
    title: "LAN / Tailscale access",
    command: "HOST=0.0.0.0 mc start",
    body: "Bind to all interfaces so you can reach the dashboard from another device on your network.",
  },
];

function ExternalIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="inline-block"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6M10 14 21 3" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="transition-transform group-hover:translate-x-0.5"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/** Section heading — eyebrow + oversized thin headline, matching the home. */
function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink-faint">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-3xl font-light leading-[1.12] tracking-[-0.02em] text-ink sm:text-[2.6rem]">
        {title}
      </h2>
      {children ? (
        <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
          {children}
        </p>
      ) : null}
    </div>
  );
}

export default function SetupPage() {
  return (
    <>
      <Nav />
      <main className="bg-canvas">
        {/* ── Hero — clean Aqua, light canvas, oversized thin headline ─────── */}
        <section className="relative overflow-hidden bg-canvas">
          <div className="blob-field" aria-hidden>
            <span className="blob blob-a" />
            <span className="blob blob-b" />
          </div>

          <div className="relative mx-auto max-w-4xl px-5 pt-24 pb-16 sm:pt-32 sm:pb-20">
            <Reveal>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink-faint">
                Get started · ~2 min
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-7 font-display text-[2.4rem] font-light leading-[1.05] tracking-[-0.02em] text-ink sm:text-[4rem] sm:leading-[1.02]">
                Set up Founder in two minutes
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
                Clone, build, link, and start. Then point your AI coding agent at
                it and supervise from anywhere — your terminal, your phone, your
                LAN.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-signal px-5 py-2 text-sm font-medium text-[#1b1206] transition-transform hover:-translate-y-px"
                >
                  Get Founder
                </a>
                <a
                  href="#install"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-ink underline-offset-4 hover:underline"
                >
                  Start installing
                  <ArrowRightIcon />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Docs body: left contents rail · content column ───────────────── */}
        <div className="mx-auto grid max-w-6xl gap-x-12 border-t border-hairline px-5 lg:grid-cols-[13rem_minmax(0,1fr)]">
          {/* Left "On this page" rail — sticky, hairline, thin type (desktop). */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 py-16">
              <OnThisPage items={TOC} />
              <div className="mt-10 border-t border-hairline pt-6">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-faint">
                  Need help?
                </p>
                <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                  The CLI tells you exactly what to run next at every step.
                </p>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted transition-colors hover:text-ink"
                >
                  Open issues
                  <ExternalIcon />
                </a>
              </div>
            </div>
          </aside>

          {/* Center content column. */}
          <div className="min-w-0">
            {/* ── 1. Install Founder ─────────────────────────────────────── */}
            <section id="install" className="py-16 sm:py-20 scroll-mt-24">
              <Reveal>
                <SectionHeading eyebrow="Step 01" title="Install Founder">
                  Seven commands, top to bottom. Each step has a copy button —
                  paste it into your terminal and move on.
                </SectionHeading>
              </Reveal>

              {/* Prerequisites — quiet hairline list, no heavy box. */}
              <Reveal delay={0.05}>
                <div className="mt-10 border-t border-hairline pt-6">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-faint">
                    Prerequisites
                  </p>
                  <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                    {PREREQS.map((req) => (
                      <li key={req.label}>
                        <span className="block text-sm font-medium text-ink">
                          {req.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-ink-faint">
                          {req.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* Numbered steps — hairline-separated blocks, thin headings. */}
              <ol className="mt-6">
                {INSTALL_STEPS.map((step, i) => (
                  <Reveal
                    key={step.command}
                    as="li"
                    delay={Math.min(i, 4) * 0.04}
                    className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 border-t border-hairline py-7 sm:gap-x-8"
                  >
                    <span className="font-mono text-sm text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-medium text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-muted">
                        {step.detail}
                      </p>
                      <div className="mt-4">
                        <CodeBlock code={step.command} />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>

              {/* Heads-up note — the single amber accent confined to text. */}
              <Reveal>
                <p className="mt-8 border-t border-hairline pt-6 text-[0.95rem] leading-relaxed text-ink-muted">
                  <span className="font-medium text-ink">Heads up:</span> restart
                  Claude Code after your first{" "}
                  <code className="font-mono text-[0.85em] text-ink">mc start</code>{" "}
                  so the telemetry env applies and your tokens start recording.
                </p>
              </Reveal>
            </section>

            {/* ── 2. Install your AI agent (tabbed picker) ───────────────── */}
            <section
              id="agent"
              className="border-t border-hairline py-16 sm:py-20 scroll-mt-24"
            >
              <Reveal>
                <SectionHeading eyebrow="Step 02" title="Install your AI agent">
                  Don&apos;t have the agent installed? Founder tells you right in
                  the terminal. Pick yours below for the exact one-line install.
                </SectionHeading>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="mt-10">
                  <AgentInstaller />
                </div>
              </Reveal>
            </section>

            {/* ── 3. Pick your model & supervise from anywhere ───────────── */}
            <section
              id="supervise"
              className="border-t border-hairline py-16 sm:py-20 scroll-mt-24"
            >
              <Reveal>
                <SectionHeading
                  eyebrow="Step 03"
                  title="Pick your model & supervise from anywhere"
                >
                  Choose the agent you run, then leash it to your phone and reach
                  it over your network.
                </SectionHeading>
              </Reveal>

              <ol className="mt-10">
                {SUPERVISE_STEPS.map((step, i) => (
                  <Reveal
                    key={step.title}
                    as="li"
                    delay={i * 0.05}
                    className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 border-t border-hairline py-7 sm:gap-x-8"
                  >
                    <span className="font-mono text-sm text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-medium text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-muted">
                        {step.body}
                      </p>
                      <div className="mt-4">
                        <CodeBlock code={step.command} prompt="$" />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </section>

            {/* ── 4. Telemetry (transparent) ─────────────────────────────── */}
            <section
              id="telemetry"
              className="border-t border-hairline py-16 sm:py-20 scroll-mt-24"
            >
              <Reveal>
                <SectionHeading eyebrow="Transparent by design" title="Telemetry">
                  Founder shares anonymous usage — your install id, the model you
                  run, and token/cost counts. Never your code, file paths, or
                  prompts.
                </SectionHeading>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="mt-10 grid gap-x-10 gap-y-8 border-t border-hairline pt-8 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-faint">
                      On by default
                    </p>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
                      These anonymous counts power the public leaderboard on the
                      home page — the global token spend you can watch tick up in
                      real time. Nothing that could identify you or your work ever
                      leaves your machine.
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-faint">
                      Opt out anytime
                    </p>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
                      One command turns it off completely. Nothing is reported
                      after that.
                    </p>
                    <div className="mt-4">
                      <CodeBlock code="mc telemetry share off" prompt="$" />
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-hairline pt-8">
                  <Link
                    href="/"
                    className="text-sm font-medium text-ink underline-offset-4 hover:underline"
                  >
                    Back to home
                  </Link>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    Read the source
                    <ExternalIcon />
                  </a>
                </div>
              </Reveal>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
