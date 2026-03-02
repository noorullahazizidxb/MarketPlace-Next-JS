import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axiosClient";
import { getSession } from "@/lib/session";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getSession<any>();
    const token = session?.token;
    const data = await api.post(`/blogs/${id}/likes`, {}, {
      Authorization: token ? `Bearer ${token}` : undefined,
    });
    return NextResponse.json({ success: true, entity: "Like", data });
  } catch (e: any) {
    const message = e?.message || "Failed to like blog";
    return new NextResponse(message, { status: 500 });
  }
}
