import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axiosClient";
import { getSession } from "@/lib/session";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const session = await getSession<any>();
    const token = session?.token;
    const data = await api.post(`/blogs/${id}/shares`, {}, {
      Authorization: token ? `Bearer ${token}` : undefined,
    });
    return NextResponse.json({ success: true, entity: "Share", data });
  } catch (e: any) {
    const message = e?.message || "Failed to share blog";
    return new NextResponse(message, { status: 500 });
  }
}
