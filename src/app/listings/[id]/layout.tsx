import type { Metadata } from "next";
import { absoluteUrl, pageMetadata, SITE_NAME } from "@/lib/site-config";
import { config } from "@/lib/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }> | { id: string };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${config.apiBase}/listings/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("listing fetch failed");
    const json = (await res.json()) as Record<string, unknown> & {
      data?: Record<string, unknown>;
    };
    const listing = (json.data || json) as Record<string, unknown>;
    const title =
      (typeof listing.title === "string" && listing.title) ||
      (typeof listing.name === "string" && listing.name) ||
      "Listing";
    const rawDesc =
      (typeof listing.description === "string" && listing.description) ||
      (typeof listing.summary === "string" && listing.summary) ||
      "";
    const description =
      rawDesc.replace(/<[^>]+>/g, " ").trim().slice(0, 155) ||
      `${title} on ${SITE_NAME}. Buy, sell, or rent with DevMinds Marketplace.`;
    const images = Array.isArray(listing.images) ? listing.images : [];
    const firstImage =
      images[0] && typeof images[0] === "object" && images[0] !== null
        ? (images[0] as { url?: string }).url
        : typeof listing.imageUrl === "string"
          ? listing.imageUrl
          : undefined;
    return pageMetadata({
      title,
      description,
      path: `/listings/${id}`,
      image: firstImage || undefined,
      keywords: [title, "listing", "DevMinds Marketplace", "DevMinds"],
    });
  } catch {
    return pageMetadata({
      title: "Listing details",
      description: `View this listing on ${SITE_NAME}.`,
      path: `/listings/${id}`,
    });
  }
}

export default async function ListingDetailLayout({ children, params }: Props) {
  const { id } = await params;
  let productLd: Record<string, unknown> | undefined;
  try {
    const res = await fetch(`${config.apiBase}/listings/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const json = (await res.json()) as Record<string, unknown> & {
        data?: Record<string, unknown>;
      };
      const listing = (json.data || json) as Record<string, unknown>;
      const title =
        (typeof listing.title === "string" && listing.title) || "Listing";
      const description =
        typeof listing.description === "string" ? listing.description : "";
      productLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: title,
        description: description.replace(/<[^>]+>/g, " ").slice(0, 5000),
        url: absoluteUrl(`/listings/${id}`),
      };
    }
  } catch {
    productLd = undefined;
  }

  return (
    <>
      {productLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
        />
      ) : null}
      {children}
    </>
  );
}
