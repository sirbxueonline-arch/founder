/**
 * StatusPill — maps an AgentStatus to a labelled, color-coded pill.
 *   active  → signal (amber)   running now
 *   waiting → signal (amber)   needs attention / blocked on a prompt
 *   idle    → muted            quiet, no work in flight
 *   error   → alert            something failed
 *   ended   → faint            session closed
 */
import type { AgentStatus } from "@mission-control/shared";

interface StatusPillProps {
  status: AgentStatus;
}

interface PillStyle {
  label: string;
  color: string;
}

const STYLES: Record<AgentStatus, PillStyle> = {
  active: { label: "ACTIVE", color: "var(--color-signal)" },
  waiting: { label: "WAITING", color: "var(--color-signal)" },
  idle: { label: "IDLE", color: "var(--color-muted)" },
  error: { label: "ERROR", color: "var(--color-alert)" },
  ended: { label: "ENDED", color: "var(--color-faint)" },
};

export function StatusPill({ status }: StatusPillProps) {
  const { label, color } = STYLES[status];
  // Amber statuses are "live" — give them the breathing pulse (the one place the
  // pill spends boldness). Idle/ended/error stay calm hairline chips. Aqua-style:
  // a thin border + whitespace, not a heavy filled box.
  const isLive = status === "active" || status === "waiting";
  return (
    <span
      className={`mono inline-flex items-center rounded-full px-2 py-0.5 text-[0.625rem] font-medium tracking-wider${
        isLive ? " pulse-dot" : ""
      }`}
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 55%, transparent)`,
        borderWidth: 1,
        backgroundColor: "transparent",
      }}
    >
      {label}
    </span>
  );
}
