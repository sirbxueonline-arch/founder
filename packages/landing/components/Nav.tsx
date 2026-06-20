import Link from "next/link";

import { GITHUB_URL } from "@/lib/config";

/** Diamond ◆ wordmark used across the site. Root-relative so it works on /setup too. */
function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Foundrr home">
      <span
        className="inline-block h-2 w-2 rotate-45 bg-ink"
        aria-hidden
      />
      <span className="text-[0.95rem] font-medium tracking-tight text-ink">
        Foundrr
      </span>
    </Link>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-[color-mix(in_srgb,var(--canvas)_82%,transparent)] backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Wordmark />

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-6 sm:flex">
            <Link
              href="/#features"
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              How it works
            </Link>
            <Link
              href="/setup"
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              Setup
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              GitHub
            </a>
          </div>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pill-signal inline-flex items-center justify-center rounded-full bg-signal px-4 py-1.5 text-sm font-medium text-[#1b1206]"
          >
            Get Foundrr
          </a>
        </div>
      </nav>
    </header>
  );
}
