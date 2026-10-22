import { NextResponse } from "next/server";
import { getSession, type SessionData } from "@/lib/session";
import { defaultUiContextState } from "@/lib/theme/ui-context-defaults";
import type { UiContextState } from "@/lib/theme/types";

const BACKEND_ORIGIN =
  process.env.BACKEND_VERCEL_URL || "http://localhost:4000";
const BACKEND_URL = `${BACKEND_ORIGIN.replace(/\/+$/, "")}/api/ui-context`;

const cloneDefaultUiContextState = (): UiContextState =>
  JSON.parse(JSON.stringify(defaultUiContextState)) as UiContextState;

const mergeUiContextState = (
  base: UiContextState,
  incoming?: Partial<UiContextState> | null,
): UiContextState => ({
  version: incoming?.version ?? base.version,
  theme: { ...base.theme, ...incoming?.theme },
  sidebar: { ...base.sidebar, ...incoming?.sidebar },
  componentVariants: {
    ...base.componentVariants,
    ...incoming?.componentVariants,
  },
  updatedAt: incoming?.updatedAt ?? base.updatedAt ?? new Date().toISOString(),
});

let lastGoodState: UiContextState | null = null;
const RETRY_DELAYS_MS = [0, 200, 600];
const FETCH_TIMEOUT_MS = 6000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchStoredStateOnce(): Promise<UiContextState> {
  const response = await fetch(BACKEND_URL, {
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message || "Could not load UI context");
  }
  return mergeUiContextState(
    cloneDefaultUiContextState(),
    (body?.data ?? body) as Partial<UiContextState>,
  );
}

/** Reads the saved state with retries. Never substitutes defaults. */
async function readStoredState(): Promise<UiContextState> {
  let lastError: unknown;
  for (const delay of RETRY_DELAYS_MS) {
    if (delay) await sleep(delay);
    try {
      const state = await fetchStoredStateOnce();
      lastGoodState = state;
      return state;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Could not load UI context");
}

async function writeStoredState(
  state: UiContextState,
  token: string,
): Promise<UiContextState> {
  const response = await fetch(BACKEND_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(state),
    cache: "no-store",
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message || "Could not save UI context");
  }
  const persisted = mergeUiContextState(
    cloneDefaultUiContextState(),
    (body?.data ?? body) as Partial<UiContextState>,
  );
  lastGoodState = persisted;
  return persisted;
}

async function requireAdminSession() {
  const session = await getSession<SessionData>();
  const isAdmin = Array.isArray(session?.user?.roles) &&
    session.user.roles.some((role: { role?: string } | string) =>
      typeof role === "string" ? role === "ADMIN" : role?.role === "ADMIN",
    );
  if (!session?.token || !isAdmin) {
    return null;
  }
  return session;
}

export async function GET() {
  try {
    const state = await readStoredState();
    return NextResponse.json(state, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (error) {
    if (lastGoodState) {
      // Serve the last saved settings rather than failing to defaults.
      return NextResponse.json(lastGoodState, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "X-UI-Context-Stale": "1",
        },
      });
    }
    const message =
      error instanceof Error ? error.message : "Could not load UI context";
    return NextResponse.json({ message }, { status: 502 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const incoming = (await req.json()) as Partial<UiContextState>;
    const current = await readStoredState();
    const next = mergeUiContextState(current, {
      ...incoming,
      updatedAt: new Date().toISOString(),
    });
    const persisted = await writeStoredState(next, session.token);
    return NextResponse.json(persisted, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save UI context";
    return NextResponse.json({ message }, { status: 502 });
  }
}

export async function DELETE() {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const reset = cloneDefaultUiContextState();
    reset.updatedAt = new Date().toISOString();
    const persisted = await writeStoredState(reset, session.token);
    return NextResponse.json(persisted, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not reset UI context";
    return NextResponse.json({ message }, { status: 502 });
  }
}
