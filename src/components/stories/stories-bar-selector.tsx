"use client";

import { useComponentVariants } from "@/hooks/use-component-variants";
import StoriesBar from "./StoriesBar";
import { StoriesBarCards, StoriesBarStrip } from "./stories-bar-variants";

export type StoriesBarVariant = "bubble" | "cards" | "strip";

export function StoriesBarSelector({
  variantOverride,
  className,
}: {
  variantOverride?: StoriesBarVariant;
  className?: string;
}) {
  const { variants } = useComponentVariants();
  const variant: StoriesBarVariant =
    variantOverride ?? (variants as any).storiesBar ?? "bubble";

  if (variant === "cards") return <StoriesBarCards className={className} />;
  if (variant === "strip") return <StoriesBarStrip className={className} />;
  return <StoriesBar />;
}
