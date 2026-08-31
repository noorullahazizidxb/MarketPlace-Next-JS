"use client";

import { useComponentVariants } from "@/hooks/use-component-variants";
import { ListingCard, type Listing } from "./listing-card";
import {
  ListingCardHorizontal,
  ListingCardEditorial,
  ListingCardMinimal,
} from "./listing-card-variants";
import type { ListingCardVariant } from "@/lib/theme/types";

interface ListingCardSelectorProps {
  listing: Listing;
  /** Override the variant stored in ui-context (e.g. for previews) */
  variantOverride?: ListingCardVariant;
  className?: string;
}

/**
 * Selects and renders the correct listing-card variant based on the active
 * ui-context componentVariants setting, or a parent override.
 */
export function ListingCardSelector({
  listing,
  variantOverride,
  className,
}: ListingCardSelectorProps) {
  const { variants } = useComponentVariants();
  const variant: ListingCardVariant =
    variantOverride ?? variants.listingCard ?? "grid";

  switch (variant) {
    case "horizontal":
      return <ListingCardHorizontal listing={listing} />;
    case "editorial":
      return <ListingCardEditorial listing={listing} />;
    case "minimal":
      return <ListingCardMinimal listing={listing} />;
    default:
      return <ListingCard listing={listing} className={className} />;
  }
}
