import type { ComponentType } from "react";
import type { AdminPageId } from "@repo/types";

export type AppearanceDensityTab =
    | "typography"
    | "weights"
    | "icons"
    | "controls"
    | "spacing"
    | "sidebar"
    | "table"
    | "mobile"
    | "decorative"
    | "loading-motion";

type PreviewLoader = () => Promise<{ default: ComponentType }>;

const PAGE_LABELS: Partial<Record<AdminPageId, string>> = {
    "manage-users": "Users",
    companies: "Companies",
    contracts: "Contracts",
    subsystems: "Subsystems",
    "account-subsystems": "Acct. Subsystems",
    "markup-discount": "Markup",
    "user-treasury": "Treasury",
    "base-info": "Base Info",
    baggage: "Baggage",
    "fund-report": "Fund Report",
    "fund-requests": "Fund Requests",
    "currency-convert": "Currency",
    "two-step-users": "Two-step",
};

const PAGE_WIDGET_PREVIEW_LOADERS: Partial<Record<AdminPageId, PreviewLoader>> = {};

export const CATEGORY_WIDGET_PAGE_MAP: Record<AppearanceDensityTab, AdminPageId> = {
    typography: "manage-users",
    weights: "contracts",
    icons: "markup-discount",
    controls: "companies",
    spacing: "base-info",
    sidebar: "subsystems",
    table: "user-treasury",
    mobile: "currency-convert",
    decorative: "baggage",
    "loading-motion": "fund-report",
};

export const resolvePreviewLoader = (pageId: AdminPageId): PreviewLoader | null => {
    return PAGE_WIDGET_PREVIEW_LOADERS[pageId] ?? null;
};

export const resolvePreviewPageLabel = (pageId: AdminPageId): string => {
    return PAGE_LABELS[pageId] ?? pageId;
};
