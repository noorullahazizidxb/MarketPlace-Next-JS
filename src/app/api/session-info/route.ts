import { NextResponse } from "next/server";
import { getSession, getUserInfo } from "@/lib/session";

export async function GET() {
  // Prefer encrypted minimal user_info cookie for role gates
  const userInfo = await getUserInfo().catch(() => null);
  if (userInfo) return NextResponse.json({ user: userInfo });
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });
  return NextResponse.json({ user: session.user ?? null });
}