import type { ReactNode } from "react";

// Pre-warm the hero image so the browser fetches it with high priority
// before the JS bundle executes and the <Image priority> tag is rendered.
// React 19 automatically hoists <link> resource hints to <head>.
const LCP_IMAGE_SRC = encodeURIComponent(
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600"
);
const LCP_PRELOAD_HREF = `/_next/image?url=${LCP_IMAGE_SRC}&w=1920&q=75`;

export default function ListingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* React 19 hoists this to <head> automatically — gives LCP image high fetch priority from SSR */}
      <link rel="preload" as="image" href={LCP_PRELOAD_HREF} fetchPriority="high" />
      {children}
    </>
  );
}
