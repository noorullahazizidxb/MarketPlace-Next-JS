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
    const res = await fetch(`${config.apiBase}/blogs/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("blog fetch failed");
    const json = (await res.json()) as Record<string, unknown> & {
      data?: Record<string, unknown>;
    };
    const blog = (json.data || json) as Record<string, unknown>;
    const title =
      (typeof blog.title === "string" && blog.title) ||
      (typeof blog.name === "string" && blog.name) ||
      "Blog post";
    const rawDesc =
      (typeof blog.excerpt === "string" && blog.excerpt) ||
      (typeof blog.summary === "string" && blog.summary) ||
      (typeof blog.content === "string" && blog.content) ||
      "";
    const description =
      rawDesc.replace(/<[^>]+>/g, " ").trim().slice(0, 155) ||
      `${title} — article on ${SITE_NAME}.`;
    const image =
      typeof blog.coverImage === "string"
        ? blog.coverImage
        : typeof blog.imageUrl === "string"
          ? blog.imageUrl
          : undefined;
    return pageMetadata({
      title,
      description,
      path: `/blogs/${id}`,
      image,
      keywords: [title, "blog", "DevMinds Marketplace", "DevMinds"],
    });
  } catch {
    return pageMetadata({
      title: "Blog post",
      description: `Read this article on ${SITE_NAME}.`,
      path: `/blogs/${id}`,
    });
  }
}

export default async function BlogDetailLayout({ children, params }: Props) {
  const { id } = await params;
  let articleLd: Record<string, unknown> | undefined;
  try {
    const res = await fetch(`${config.apiBase}/blogs/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const json = (await res.json()) as Record<string, unknown> & {
        data?: Record<string, unknown>;
      };
      const blog = (json.data || json) as Record<string, unknown>;
      const title =
        (typeof blog.title === "string" && blog.title) || "Blog post";
      const description =
        typeof blog.content === "string"
          ? blog.content
          : typeof blog.excerpt === "string"
            ? blog.excerpt
            : "";
      articleLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description.replace(/<[^>]+>/g, " ").slice(0, 5000),
        url: absoluteUrl(`/blogs/${id}`),
        author: {
          "@type": "Person",
          name: "Noorullah Azizi",
        },
        publisher: {
          "@type": "Organization",
          name: "DevMinds",
        },
      };
    }
  } catch {
    articleLd = undefined;
  }

  return (
    <>
      {articleLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
      ) : null}
      {children}
    </>
  );
}
