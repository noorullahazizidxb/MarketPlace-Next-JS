"use client";

import {
  Home,
  List,
  Settings,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { AppSidebar, type SidebarNavGroup } from "@/components/ui/organisms/app-sidebar";
import BlogCard from "@/components/blogs/BlogCard";
import Footer from "@/components/layout/footer";
import { Topbar } from "@/components/layout/topbar";
import { StoriesBarSelector } from "@/components/stories/stories-bar-selector";
import { ThemedSkeleton } from "@/components/skeletons/themed-skeleton";
import { MathCaptcha } from "@/components/ui/atoms/math-captcha";
import { ListingCardSelector } from "@/components/ui/organisms/listing-card-selector";
import { SidebarProvider } from "@/components/ui/atoms/shadcn/sidebar";
import type {
  BlogCardVariant,
  CaptchaVariant,
  FooterVariant,
  ListingCardVariant,
  NavbarVariant,
  SidebarVariantStyle,
  SkeletonTheme,
  StoriesBarVariant,
} from "@/lib/theme/types";

type ComponentVariantPreviewProps =
  | { kind: "listingCard"; variant: ListingCardVariant }
  | { kind: "navbar"; variant: NavbarVariant; opacity?: number }
  | { kind: "footer"; variant: FooterVariant }
  | { kind: "sidebar"; variant: SidebarVariantStyle }
  | { kind: "blogCard"; variant: BlogCardVariant }
  | { kind: "storiesBar"; variant: StoriesBarVariant }
  | { kind: "skeletonTheme"; variant: SkeletonTheme }
  | { kind: "captchaVariant"; variant: CaptchaVariant };

const previewListing = {
  id: "appearance-preview",
  title: "Mirrorless camera for creators",
  description: "Excellent condition with a fast prime lens.",
  price: 680,
  currency: "USD",
  imageUrl: "/brand/marketplace-logo-on-light.png",
  location: "Kabul, Afghanistan",
  category: { name: "Electronics" },
  averageRating: 4.8,
  reviewCount: 32,
  promoted: true,
};

const previewBlog = {
  id: "appearance-preview",
  title: "A better way to discover local businesses",
  excerpt: "Meet the makers and sellers building their communities.",
  content: "Discover local businesses and community sellers.",
  createdAt: "2025-01-15T00:00:00.000Z",
  image: "/brand/marketplace-logo-on-light.png",
  category: { name: "Community" },
  readingTime: 4,
  author: { name: "DevMinds Journal" },
  counts: { likes: 24, shares: 8, comments: 5 },
};

const previewNavGroups: SidebarNavGroup[] = [
  {
    label: "Marketplace",
    items: [
      { title: "Home", url: "/listings", icon: Home },
      { title: "Listings", url: "/listings", icon: List },
      { title: "Settings", url: "/settings/appearance", icon: Settings },
    ],
  },
];

function ScaledPreview({
  width,
  height,
  scale,
  children,
}: {
  width: number;
  height: number;
  scale: number;
  children: ReactNode;
}) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <div
        style={{
          width,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function ComponentVariantPreview(props: ComponentVariantPreviewProps) {
  const { kind, variant } = props;
  switch (kind) {
    case "listingCard":
      return (
        <ListingCardSelector
          listing={previewListing}
          variantOverride={variant}
        />
      );
    case "navbar":
      return (
        <ScaledPreview width={900} height={96} scale={0.28}>
          <Topbar
            variantOverride={variant}
            opacityOverride={props.kind === "navbar" ? props.opacity : undefined}
            preview
          />
        </ScaledPreview>
      );
    case "footer":
      return (
        <ScaledPreview width={900} height={100} scale={0.26}>
          <Footer variantOverride={variant} />
        </ScaledPreview>
      );
    case "sidebar":
      return (
        <SidebarProvider
          defaultOpen
          className="h-44 min-h-0 w-full"
          style={{ "--sidebar-width": "220px" } as CSSProperties}
        >
          <AppSidebar
            appearanceVariantOverride={variant}
            collapsible="none"
            className="h-full"
            user={{
              name: "Marketplace Admin",
              email: "admin@example.com",
              avatar: "",
            }}
            navGroups={previewNavGroups}
            homeUrl="/listings"
          />
        </SidebarProvider>
      );
    case "blogCard":
      return (
        <BlogCard
          blog={previewBlog}
          appearanceVariant={variant}
          preview
        />
      );
    case "storiesBar":
      return <StoriesBarSelector variantOverride={variant} />;
    case "skeletonTheme":
      return (
        <div className="space-y-2 p-2">
          <ThemedSkeleton theme={variant} className="h-4 w-full" />
          <ThemedSkeleton theme={variant} className="h-3 w-2/3" />
          <ThemedSkeleton theme={variant} className="h-3 w-1/2" />
        </div>
      );
    case "captchaVariant":
      return <MathCaptcha variant={variant} />;
  }
}
