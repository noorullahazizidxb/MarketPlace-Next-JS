import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axiosClient";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const session = await getSession<any>();
    const token = session?.token;
    const body = await req.json().catch(() => ({}));
    const data = await api.post(`/blogs/${id}/comments`, body, {
      Authorization: token ? `Bearer ${token}` : undefined,
    });
    return NextResponse.json({ success: true, entity: "Comment", data });
  } catch (e: any) {
    const message = e?.message || "Failed to post comment";
    return new NextResponse(message, { status: 500 });
  }
}
