import { NextResponse, type NextRequest } from "next/server";

import { verifyLicense } from "@/lib/license";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/license/verify   body: { key }
 * The dashboard/daemon calls this on launch + daily. Returns the entitlement for
 * a key. `valid` is true only for active/trialing subscriptions; the daemon
 * caches the verdict with a grace window so a brief outage never locks a paying
 * user out.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let key: string | undefined;
  try {
    const body = (await req.json()) as { key?: unknown };
    key = typeof body.key === "string" ? body.key.trim().toUpperCase() : undefined;
  } catch {
    key = undefined;
  }
  if (!key) {
    return NextResponse.json({ valid: false, error: "Missing license key" }, { status: 400 });
  }

  try {
    const lic = await verifyLicense(key);
    const active = !!lic && (lic.status === "active" || lic.status === "trialing");
    return NextResponse.json({
      valid: active,
      plan: active && lic ? lic.plan : null,
      status: lic?.status ?? "not_found",
      seats: lic?.seats ?? 0,
      periodEnd: lic?.current_period_end ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "verify failed";
    return NextResponse.json({ valid: false, error: message }, { status: 500 });
  }
}
