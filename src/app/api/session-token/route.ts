import { NextResponse } from "next/server";
import { getSession, type SessionData } from "@/lib/session";

export async function GET() {
  const session = await getSession<SessionData>();
  return NextResponse.json({ token: session?.token || null });
}
