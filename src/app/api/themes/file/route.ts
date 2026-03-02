import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const THEME_DIR = path.join(process.cwd(), "theme-data");
const ACTIVE_THEME_FILE = path.join(THEME_DIR, "active-theme.json");
const DEFAULT_THEME_FILE = path.join(THEME_DIR, "default-theme.json");

async function readJson(filePath: string) {
  const text = await readFile(filePath, "utf-8");
  return JSON.parse(text);
}

async function writeJson(filePath: string, value: any) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
}

async function ensureThemeFiles() {
  await mkdir(THEME_DIR, { recursive: true });

  let defaultTheme: any = null;
  try {
    defaultTheme = await readJson(DEFAULT_THEME_FILE);
  } catch {
    defaultTheme = [];
    await writeJson(DEFAULT_THEME_FILE, defaultTheme);
  }

  try {
    await readJson(ACTIVE_THEME_FILE);
  } catch {
    await writeJson(ACTIVE_THEME_FILE, defaultTheme);
  }
}

async function loadThemeWithFallback() {
  await ensureThemeFiles();

  try {
    const active = await readJson(ACTIVE_THEME_FILE);
    if (Array.isArray(active) && active.length > 0) return active;
    if (active && typeof active === "object") return [active];
  } catch {}

  try {
    const fallback = await readJson(DEFAULT_THEME_FILE);
    if (Array.isArray(fallback) && fallback.length > 0) return fallback;
    if (fallback && typeof fallback === "object") return [fallback];
  } catch {}

  return [];
}

export async function GET() {
  const payload = await loadThemeWithFallback();
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

export async function PUT(req: Request) {
  try {
    await ensureThemeFiles();

    const incoming = await req.json();
    const current = await loadThemeWithFallback();
    const currentFirst = Array.isArray(current) ? current[0] : current;

    let nextPayload: any[];

    if (Array.isArray(incoming)) {
      nextPayload = incoming;
    } else if (incoming && typeof incoming === "object") {
      nextPayload = [
        {
          ...(currentFirst || {}),
          ...incoming,
          id: incoming.id ?? currentFirst?.id ?? "active-file-theme",
          name: incoming.name ?? currentFirst?.name ?? "Marketplace Active",
          updatedAt: new Date().toISOString(),
        },
      ];
    } else {
      return NextResponse.json(
        { message: "Invalid theme payload" },
        { status: 400 }
      );
    }

    await writeJson(ACTIVE_THEME_FILE, nextPayload);
    return NextResponse.json(nextPayload);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Failed to persist theme file" },
      { status: 500 }
    );
  }
}
