import { NextResponse } from "next/server";

export async function GET() {
  // In development expose all env vars for debugging; in production only NEXT_PUBLIC_*
  const dev = process.env.NODE_ENV === "development";
  const keys = Object.keys(process.env).filter((k) => (dev ? true : k.startsWith("NEXT_PUBLIC_")));
  const out: Record<string, string> = {};
  for (const k of keys) {
    out[k] = process.env[k] ?? "";
  }
  return NextResponse.json(out);
}
