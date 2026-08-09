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
  url: "https://noorullah-azizi.my.canva.site",
  image: "/brand/noorullah-azizi.jpg",
} as const;

export const BRAND = {
  logo: "/brand/devminds-logo.png",
  mark: "/brand/devminds-mark.png",
  ogImage: "/og-image.png",
  appleIcon: "/apple-touch-icon.png",
  favicon: "/favicon.svg",
} as const;

export const DEFAULT_DESCRIPTION =
  "DevMinds Marketplace — buy, sell, and rent across Afghanistan. Built by Noorullah Azizi, CEO of DevMinds.";

export const DEFAULT_KEYWORDS = [
  "DevMinds Marketplace",
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
};

export function pageMetadata({
  title,
  description,
  path = "/",
  keywords = [...DEFAULT_KEYWORDS],
  noIndex = false,
  image = BRAND.ogImage,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title,
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
      default: `${SITE_NAME} — Buy, Sell & Rent`,
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
    icons: {
      icon: BRAND.favicon,
      shortcut: BRAND.favicon,
      apple: BRAND.appleIcon,
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
    name: ORGANIZATION_NAME,
    url: SITE_URL,
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
    sameAs: [AUTHOR.url],
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
    sameAs: [AUTHOR.url],
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
