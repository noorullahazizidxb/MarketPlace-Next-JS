import type { Story } from "@/types/social";
import { asset, DEFAULT_LISTING_IMAGE, firstAssetUrl } from "@/lib/assets";

export type StoryLike = Pick<Story, "id" | "title"> & {
  images?: Array<string | { url?: string | null } | null | undefined> | null;
};

/** Shared cover resolver for StoriesBar variants (DRY). */
export function resolveStoryCoverUrl(story: StoryLike | null | undefined) {
  return firstAssetUrl(story?.images, DEFAULT_LISTING_IMAGE) || DEFAULT_LISTING_IMAGE;
}

export function resolveStoryCoverSrc(story: StoryLike | null | undefined) {
  return asset(resolveStoryCoverUrl(story)) || DEFAULT_LISTING_IMAGE;
}

/**
 * Bubble thumb sizing — button, ring, and Image sizes stay in lockstep.
 * Instagram-style circular rings: 72px mobile / 80px sm+.
 */
export const STORY_BUBBLE = {
  widthClass: "w-[4.5rem] shrink-0 sm:w-20",
  sizeClass: "size-[4.5rem] sm:size-20",
  sizes: "(max-width: 640px) 72px, 80px",
} as const;
