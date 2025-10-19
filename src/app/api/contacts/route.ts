import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axiosClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Forward to external API route
    const created = await api.post<any>("/contacts", body);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    const message = err?.message || "Failed to submit contact";
    return NextResponse.json({ message }, { status: 400 });
  }
}
