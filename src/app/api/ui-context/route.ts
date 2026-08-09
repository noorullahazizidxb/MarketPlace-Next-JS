import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { defaultUiContextState } from "@/lib/theme/ui-context-defaults";
import type { UiContextState } from "@/lib/theme/types";

const DATA_DIR = path.join(process.cwd(), ".data");
const UI_CONTEXT_FILE = path.join(DATA_DIR, "ui-context.json");

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

async function ensureUiContextFile() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(UI_CONTEXT_FILE, "utf-8");
  } catch {
    const initial = normalizeUiContextState({
      updatedAt: new Date().toISOString(),
    });
    await writeFile(
      UI_CONTEXT_FILE,
      `${JSON.stringify(initial, null, 2)}\n`,
      "utf-8",
    );
  }
}

async function readUiContextState(): Promise<UiContextState> {
  await ensureUiContextFile();

  try {
    const raw = await readFile(UI_CONTEXT_FILE, "utf-8");
    return normalizeUiContextState(
      JSON.parse(raw) as Partial<UiContextState>,
    );
  } catch {
    const fallback = normalizeUiContextState({
      updatedAt: new Date().toISOString(),
    });
    await writeUiContextState(fallback);
    return fallback;
  }
}

async function writeUiContextState(state: UiContextState) {
  await ensureUiContextFile();
  await writeFile(
    UI_CONTEXT_FILE,
    `${JSON.stringify(state, null, 2)}\n`,
    "utf-8",
  );
}

export async function GET() {
  const state = await readUiContextState();

  return NextResponse.json(state, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

export async function PATCH(req: Request) {
  try {
    const incoming = (await req.json()) as Partial<UiContextState>;
    const current = await readUiContextState();
    const next = mergeUiContextState(current, {
      ...incoming,
      updatedAt: new Date().toISOString(),
    });

    await writeUiContextState(next);
    return NextResponse.json(next);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to persist ui context";

    return NextResponse.json({ message }, { status: 500 });
  }
}
