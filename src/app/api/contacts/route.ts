import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axiosClient";
import {
  RecaptchaVerificationError,
  verifyRecaptchaToken,
} from "@/lib/recaptcha-server";

function clientIp(req: NextRequest): string | undefined {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || undefined;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ message: "Invalid contact payload" }, { status: 400 });
    }
    const record = body as Record<string, unknown>;
    await verifyRecaptchaToken(record.recaptchaToken, "contact", clientIp(req));
    const payload = { ...record };
    delete payload.recaptchaToken;
    const created = await api.post<any>("/contacts", payload);
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof RecaptchaVerificationError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : "Failed to submit contact";
    return NextResponse.json({ message }, { status: 400 });
  }
}
