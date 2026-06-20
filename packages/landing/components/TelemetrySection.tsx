import { Counters } from "@/components/Counters";
import { Leaderboard } from "@/components/Leaderboard";
import { MeshWhisper } from "@/components/Ambient";
import type { LiveData } from "@/lib/useLiveData";

/**
 * Light big-stat / live telemetry section. Frames the real live global counters
 * and the restyled model leaderboard on the off-white canvas. Aqua-restrained:
 * oversized ink numerals over hairline rules, generous space. The data inside is
 * live and unchanged — only the surface is light.
 */
export function TelemetrySection({ initial }: { initial: LiveData }) {
  return (
    <section
      id="telemetry"
      className="relative overflow-hidden border-t border-hairline bg-canvas text-ink"
    >
      {/* Ambient: a whisper of light-on-light mesh — no dark layers. */}
      <MeshWhisper />

      <div className="relative mx-auto max-w-5xl px-5 py-24 sm:py-32">
        <div className="max-w-2xl">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink-faint">
            Live telemetry
          </p>
          <h2 className="mt-4 font-display text-3xl font-light leading-[1.12] tracking-[-0.02em] text-ink sm:text-5xl">
            Every token, metered live.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
            Anonymous aggregate usage from every install, in real time. These
            numbers are moving as you read.
          </p>
        </div>

        <div className="relative mt-16">
          <Counters initial={initial} />
        </div>

        <div className="mt-20 border-t border-hairline pt-12">
          <Leaderboard initial={initial} />
        </div>
      </div>
    </section>
  );
}
