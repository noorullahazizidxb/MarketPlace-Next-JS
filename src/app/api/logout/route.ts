import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

// Ensure this route is always treated as dynamic (no prerender attempt during build collection)
export const dynamic = "force-dynamic";

// Support POST (actual logout)
export async function POST() {
  await clearSession();
  return NextResponse.json({ ok: true });
}

// Graceful GET handler (some code or crawlers might hit it with GET). Returns method hint.
export async function GET() {
  return NextResponse.json({ ok: true, note: "Use POST to logout" });
}
