"use client";

import { useComponentVariants } from "@/hooks/use-component-variants";
import { Skeleton, Block } from "./SkeletonPrimitives";
import { SkeletonPulse, BlockPulse } from "./skeleton-themes";
import { SkeletonWave, BlockWave } from "./skeleton-themes";

export type SkeletonTheme = "shimmer" | "pulse" | "wave";

/**
 * Theme-aware Skeleton that switches animation style based on
 * the active `skeletonTheme` component variant from ui-context.
 */
export function ThemedSkeleton({
  className,
  style,
  theme: themeProp,
}: {
  className?: string;
  style?: React.CSSProperties;
  theme?: SkeletonTheme;
}) {
  const { variants } = useComponentVariants();
  const theme: SkeletonTheme =
    themeProp ?? (variants as any).skeletonTheme ?? "shimmer";

  if (theme === "pulse")
    return <SkeletonPulse className={className} style={style} />;
  if (theme === "wave")
    return <SkeletonWave className={className} style={style} />;
  return <Skeleton className={className} style={style} />;
}

export function ThemedBlock({
  lines = 3,
  theme: themeProp,
}: {
  lines?: number;
  theme?: SkeletonTheme;
}) {
  const { variants } = useComponentVariants();
  const theme: SkeletonTheme =
    themeProp ?? (variants as any).skeletonTheme ?? "shimmer";

  if (theme === "pulse") return <BlockPulse lines={lines} />;
  if (theme === "wave") return <BlockWave lines={lines} />;
  return <Block lines={lines} />;
}
