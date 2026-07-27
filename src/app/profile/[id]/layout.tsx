import type { Metadata } from "next";
import { pageMetadata, SITE_NAME } from "@/lib/site-config";
import { config } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${config.apiBase}/users/${encodeURIComponent(id)}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) throw new Error("user fetch failed");
    const json = (await res.json()) as Record<string, unknown> & {
      data?: Record<string, unknown>;
    };
    const user = (json.data || json) as Record<string, unknown>;
    const name =
      (typeof user.fullName === "string" && user.fullName) ||
      (typeof user.name === "string" && user.name) ||
      (typeof user.email === "string" && user.email) ||
      "User";
    return pageMetadata({
      title: `${name} — profile`,
      description: `View ${name}'s public profile on ${SITE_NAME}.`,
      path: `/profile/${id}`,
      noIndex: false,
    });
  } catch {
    return pageMetadata({
      title: "User profile",
      description: `Public user profile on ${SITE_NAME}.`,
      path: `/profile/${id}`,
    });
  }
}

export default function PublicProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
