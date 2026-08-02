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
): UiContextState => ({
  version: incoming?.version ?? base.version,
  theme: { ...base.theme, ...incoming?.theme },
  sidebar: { ...base.sidebar, ...incoming?.sidebar },
  updatedAt: incoming?.updatedAt ?? base.updatedAt ?? new Date().toISOString(),
});

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
