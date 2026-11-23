import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://marketplace.devminds.net";

export const SITE_NAME = "DevMinds Marketplace";
export const ORGANIZATION_NAME = "DevMinds";

export const AUTHOR = {
  name: "Noorullah Azizi",
  role: "CEO of DevMinds · Senior Software Engineer || DevOps Engineer",
  email: "Noorullah.azizi2040@gmail.com",
  phone: "+93778807272",
  url: "https://noorullah-azizi.devminds.net",
  image: "/brand/noorullah-azizi.jpg",
} as const;

export const BRAND = {
  logo: "/brand/marketplace-logo-on-light.png",
  logoDark: "/brand/marketplace-logo-on-dark.png",
  mark: "/brand/marketplace-niche-icon-on-light.svg",
  markDark: "/brand/marketplace-niche-icon-on-dark.svg",
  ogImage: "/og-image.png",
  appleIcon: "/apple-touch-icon.png",
  appleIconDark: "/apple-touch-icon-dark.png",
  favicon: "/favicon.svg",
  faviconDark: "/favicon-dark.svg",
} as const;

export const DEVMINDS_SAME_AS = [
  "https://devminds.net",
  "https://noorullah-azizi.devminds.net",
  "https://github.com/noorullahazizidxb",
] as const;

export const DEFAULT_DESCRIPTION =
  "DevMinds Marketplace — the online marketplace to buy, sell, and rent across Afghanistan. Part of DevMinds, built by Noorullah Azizi.";

export const DEFAULT_KEYWORDS = [
  "DevMinds Marketplace",
  "marketplace",
  "online marketplace",
  "DevMinds",
  "marketplace Afghanistan",
  "buy sell rent",
  "classifieds",
  "listings",
  "blogs",
  "Noorullah Azizi",
  "CEO DevMinds",
] as const;

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
  /** Skip the "%s | DevMinds Marketplace" template. */
  absoluteTitle?: boolean;
};

export function pageMetadata({
  title,
  description,
  path = "/",
  keywords = [...DEFAULT_KEYWORDS],
  noIndex = false,
  image = BRAND.ogImage,
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: [...keywords],
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    creator: AUTHOR.name,
    publisher: ORGANIZATION_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: AUTHOR.name,
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    other: {
      author: AUTHOR.name,
      "author-role": AUTHOR.role,
      "author-email": AUTHOR.email,
      "author-phone": AUTHOR.phone,
      "author-portfolio": AUTHOR.url,
    },
  };
}

export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — Buy, Sell & Rent | Online Marketplace`,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: [...DEFAULT_KEYWORDS],
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    creator: AUTHOR.name,
    publisher: ORGANIZATION_NAME,
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      title: `${SITE_NAME} — Buy, Sell & Rent`,
      description: DEFAULT_DESCRIPTION,
      siteName: SITE_NAME,
      images: [
        {
          url: absoluteUrl(BRAND.ogImage),
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — Buy, Sell & Rent`,
      description: DEFAULT_DESCRIPTION,
      images: [absoluteUrl(BRAND.ogImage)],
      creator: AUTHOR.name,
    },
    robots: { index: true, follow: true },
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        {
          url: "/favicon-dark.ico",
          sizes: "48x48",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/favicon-dark.svg",
          type: "image/svg+xml",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/favicon-dark-16.png",
          sizes: "16x16",
          type: "image/png",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/favicon-dark-32.png",
          sizes: "32x32",
          type: "image/png",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/icon-dark-192.png",
          sizes: "192x192",
          type: "image/png",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/icon-dark-512.png",
          sizes: "512x512",
          type: "image/png",
          media: "(prefers-color-scheme: dark)",
        },
      ],
      shortcut: ["/favicon.ico"],
      apple: [
        { url: BRAND.appleIcon, sizes: "180x180" },
        {
          url: BRAND.appleIconDark,
          sizes: "180x180",
          media: "(prefers-color-scheme: dark)",
        },
      ],
    },
    other: {
      author: AUTHOR.name,
      "author-role": AUTHOR.role,
      "author-email": AUTHOR.email,
      "author-phone": AUTHOR.phone,
      "author-portfolio": AUTHOR.url,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://devminds.net/#organization",
    name: ORGANIZATION_NAME,
    url: "https://devminds.net",
    logo: absoluteUrl(BRAND.logo),
    email: AUTHOR.email,
    telephone: AUTHOR.phone,
    founder: {
      "@type": "Person",
      name: AUTHOR.name,
      jobTitle: AUTHOR.role,
      email: AUTHOR.email,
      telephone: AUTHOR.phone,
      url: AUTHOR.url,
      image: absoluteUrl(AUTHOR.image),
    },
    sameAs: [...DEVMINDS_SAME_AS],
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR.name,
    jobTitle: AUTHOR.role,
    email: AUTHOR.email,
    telephone: AUTHOR.phone,
    url: AUTHOR.url,
    image: absoluteUrl(AUTHOR.image),
    worksFor: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: SITE_URL,
    },
    sameAs: [...DEVMINDS_SAME_AS],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@type": "Organization", name: ORGANIZATION_NAME },
    author: { "@type": "Person", name: AUTHOR.name },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/listings?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
