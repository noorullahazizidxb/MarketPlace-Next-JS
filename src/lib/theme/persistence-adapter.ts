import { defaultUiContextState } from "@repo/constants";
import type { UiContextState } from "@repo/types";

const UI_CONTEXT_API_PATH = "/api/ui-context";
const LOCAL_STORAGE_KEY = "marketplace-ui-context";

const isBrowser = () => typeof window !== "undefined";

const cloneDefaultUiContextState = (): UiContextState =>
  JSON.parse(JSON.stringify(defaultUiContextState)) as UiContextState;

const mergeUiContextState = (
  base: UiContextState,
  incoming?: Partial<UiContextState> | null,
): UiContextState => {
  return {
    version: incoming?.version ?? base.version,
    theme: {
      ...base.theme,
      ...incoming?.theme,
    },
    sidebar: {
      ...base.sidebar,
      ...incoming?.sidebar,
    },
    landing: {
      ...base.landing,
      ...incoming?.landing,
      header: {
        ...base.landing.header,
        ...incoming?.landing?.header,
      },
      hero: {
        ...base.landing.hero,
        ...incoming?.landing?.hero,
        primaryCta: {
          ...base.landing.hero.primaryCta,
          ...incoming?.landing?.hero?.primaryCta,
        },
        secondaryCta: {
          ...base.landing.hero.secondaryCta,
          ...incoming?.landing?.hero?.secondaryCta,
        },
      },
      stats: {
        ...base.landing.stats,
        ...incoming?.landing?.stats,
        items: incoming?.landing?.stats?.items ?? base.landing.stats.items,
      },
      services: {
        ...base.landing.services,
        ...incoming?.landing?.services,
        items:
          incoming?.landing?.services?.items ?? base.landing.services.items,
      },
      story: {
        ...base.landing.story,
        ...incoming?.landing?.story,
      },
      faq: {
        ...base.landing.faq,
        ...incoming?.landing?.faq,
        items: incoming?.landing?.faq?.items ?? base.landing.faq.items,
      },
      cta: {
        ...base.landing.cta,
        ...incoming?.landing?.cta,
        primaryCta: {
          ...base.landing.cta.primaryCta,
          ...incoming?.landing?.cta?.primaryCta,
        },
        secondaryCta: {
          ...base.landing.cta.secondaryCta,
          ...incoming?.landing?.cta?.secondaryCta,
        },
      },
    },
    footer: {
      ...base.footer,
      ...incoming?.footer,
      columns: incoming?.footer?.columns ?? base.footer.columns,
      socialLinks: incoming?.footer?.socialLinks ?? base.footer.socialLinks,
      legalLinks: incoming?.footer?.legalLinks ?? base.footer.legalLinks,
    },
    updatedAt: incoming?.updatedAt ?? base.updatedAt ?? new Date().toISOString(),
  };
};

const normalizeUiContextState = (
  incoming?: Partial<UiContextState> | null,
): UiContextState => {
  return mergeUiContextState(cloneDefaultUiContextState(), incoming);
};

const readLocalStorageState = (): UiContextState | null => {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return normalizeUiContextState(JSON.parse(raw) as Partial<UiContextState>);
  } catch {
    return null;
  }
};

const writeLocalStorageState = (state: UiContextState) => {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota / privacy mode errors and rely on API persistence.
  }
};

export const resolveUiContextUrl = () => UI_CONTEXT_API_PATH;

/** Client fetch — source of truth is `/api/ui-context` → `.data/ui-context.json`. */
export const fetchUiContextState = async (): Promise<UiContextState> => {
  try {
    const response = await fetch(resolveUiContextUrl(), { cache: "no-store" });
    if (response.ok) {
      const data = normalizeUiContextState(
        (await response.json()) as Partial<UiContextState>,
      );
      writeLocalStorageState(data);
      return data;
    }
  } catch {
    // Fall through to local fallbacks.
  }

  const localState = readLocalStorageState();
  if (localState) {
    return localState;
  }

  return normalizeUiContextState();
};

export const patchUiContextState = async (
  partial: Partial<UiContextState>,
): Promise<UiContextState | null> => {
  const current = await fetchUiContextState();
  const nextState = mergeUiContextState(current, {
    ...partial,
    updatedAt: new Date().toISOString(),
  });

  writeLocalStorageState(nextState);

  try {
    const response = await fetch(resolveUiContextUrl(), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextState),
    });

    if (!response.ok) {
      return nextState;
    }

    const persisted = normalizeUiContextState(
      (await response.json()) as Partial<UiContextState>,
    );
    writeLocalStorageState(persisted);
    return persisted;
  } catch {
    return nextState;
  }
};
