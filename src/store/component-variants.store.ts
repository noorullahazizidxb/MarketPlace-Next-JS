"use client";

import { create } from "zustand";
import {
  fetchUiContextState,
  resolveUiContextUrl,
} from "@/lib/theme/ui-context/context-store";
import type { ComponentVariantSettings } from "@/lib/theme/types";

const DEFAULT_VARIANTS: ComponentVariantSettings = {
  listingCard: "grid",
  navbar: "standard",
  footer: "standard",
  sidebar: "default",
  blogCard: "card",
  storiesBar: "bubble",
  skeletonTheme: "shimmer",
  captchaVariant: "classic",
  cardRadius: "default",
  tableRadius: "default",
};

const VARIANT_OPTIONS = {
  listingCard: ["grid", "horizontal", "editorial", "minimal"],
  navbar: ["standard", "glass", "minimal", "fullwidth"],
  footer: ["standard", "compact", "editorial", "minimal"],
  sidebar: ["default", "glass", "minimal", "brand"],
  blogCard: ["card", "horizontal", "editorial", "compact"],
  storiesBar: ["bubble", "cards", "strip"],
  skeletonTheme: ["shimmer", "pulse", "wave"],
  captchaVariant: ["classic", "tiles", "slider"],
  cardRadius: ["default", "none", "sm", "md", "lg", "xl"],
  tableRadius: ["default", "none", "sm", "md", "lg", "xl"],
} satisfies {
  [K in keyof ComponentVariantSettings]: readonly string[];
};

type ComponentVariantsStore = {
  variants: ComponentVariantSettings;
  previewVariants: ComponentVariantSettings | null;
  error: string | null;
  initialize: () => void;
  updateVariant: <K extends keyof ComponentVariantSettings>(
    key: K,
    value: ComponentVariantSettings[K],
  ) => Promise<void>;
  resetVariants: () => Promise<void>;
  applyPreviewVariants: (variants: Partial<ComponentVariantSettings>) => void;
};

let initialization: Promise<void> | null = null;
let persistenceQueue: Promise<void> = Promise.resolve();
let channel: BroadcastChannel | null = null;
let revision = 0;

function normalizeVariants(
  incoming?: Partial<ComponentVariantSettings> | null,
): ComponentVariantSettings {
  const normalized = { ...DEFAULT_VARIANTS };

  for (const key of Object.keys(VARIANT_OPTIONS) as Array<
    keyof ComponentVariantSettings
  >) {
    const value = incoming?.[key];
    if (
      typeof value === "string" &&
      (VARIANT_OPTIONS[key] as readonly string[]).includes(value)
    ) {
      Object.assign(normalized, { [key]: value });
    }
  }

  return normalized;
}

function publishVariants(variants: ComponentVariantSettings) {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;

  channel ??= new BroadcastChannel("marketplace-component-variants");
  channel.postMessage({ type: "component-variants:update", variants });
}

function persistVariants(variants: ComponentVariantSettings) {
  const request = persistenceQueue.catch(() => undefined).then(async () => {
    const response = await fetch(resolveUiContextUrl(), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ componentVariants: variants }),
    });

    if (!response.ok) {
      throw new Error("Could not save component appearance settings.");
    }
  });

  persistenceQueue = request;
  return request;
}

export const useComponentVariantsStore = create<ComponentVariantsStore>(
  (set, get) => ({
    variants: DEFAULT_VARIANTS,
    previewVariants: null,
    error: null,
    initialize: () => {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        channel ??= new BroadcastChannel("marketplace-component-variants");
        channel.onmessage = (event: MessageEvent) => {
          if (event.data?.type !== "component-variants:update") return;
          set({ variants: normalizeVariants(event.data.variants) });
        };
      }

      if (initialization) return;
      const initialRevision = revision;
      initialization = fetchUiContextState()
        .then((context) => {
          if (revision === initialRevision) {
            set({ variants: normalizeVariants(context.componentVariants) });
          }
        })
        .catch(() => {
          set({ error: "Could not load component appearance settings." });
        });
    },
    updateVariant: async (key, value) => {
      const variants = normalizeVariants({ ...get().variants, [key]: value });
      revision += 1;
      set({ variants, error: null });
      publishVariants(variants);

      try {
        await persistVariants(variants);
        set({ error: null });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Could not save component appearance settings.",
        });
      }
    },
    resetVariants: async () => {
      revision += 1;
      set({ variants: DEFAULT_VARIANTS, error: null });
      publishVariants(DEFAULT_VARIANTS);

      try {
        await persistVariants(DEFAULT_VARIANTS);
        set({ error: null });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Could not save component appearance settings.",
        });
      }
    },
    applyPreviewVariants: (variants) => {
      set({ previewVariants: normalizeVariants(variants) });
    },
  }),
);
