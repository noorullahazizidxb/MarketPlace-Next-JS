import { NextRequest, NextResponse } from "next/server";
import { setSession, setUserInfo } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const token = body?.token as string | undefined;
  const refreshToken = (body?.refreshToken as string | undefined) ?? null;
  const user = body?.user;
  if (!token) return NextResponse.json({ ok: false, message: "Missing session token" }, { status: 400 });
  await setSession({ token, refreshToken, user });
  await setUserInfo(user).catch(() => null as any);
  const isAdmin = Array.isArray(user?.roles) && user.roles.some((r: any) => r.role === "ADMIN");
  return NextResponse.json({ ok: true, isAdmin });
}
