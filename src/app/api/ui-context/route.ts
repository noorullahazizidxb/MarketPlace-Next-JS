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
