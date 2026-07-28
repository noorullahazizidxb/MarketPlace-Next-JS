"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import type { AdminPageId } from "@repo/types";
import { Badge } from "@repo/ui";
import {
    resolvePreviewLoader,
    resolvePreviewPageLabel,
} from "./appearance-preview-registry";

type AppearancePageLivePreviewPanelProps = {
    pageScope: "global" | AdminPageId;
    previewStyle: CSSProperties;
    /**
     * Logical CSS width of the selected viewport (e.g. 320 for XS, 1280 for XL).
     * The preview page is laid out at this width, then scaled to fit the panel.
     */
    viewportWidthPx: number;
    /**
     * `contain` — fit width and height (Typography / denser control column).
     * `width` — scale to column width so the wider 70% preview grows; vertical overflow scrolls.
     */
    fitMode?: "contain" | "width";
};

const FALLBACK_VIEWPORT_WIDTH_PX = 1280;

function resolveLogicalViewportWidth(viewportWidthPx: number): number {
    return Number.isFinite(viewportWidthPx) && viewportWidthPx > 0
        ? viewportWidthPx
        : FALLBACK_VIEWPORT_WIDTH_PX;
}

export function AppearancePageLivePreviewPanel({
    pageScope,
    previewStyle,
    viewportWidthPx,
    fitMode = "contain",
}: AppearancePageLivePreviewPanelProps) {
    const selectedPage = pageScope === "global" ? null : pageScope;
    const loader = selectedPage ? resolvePreviewLoader(selectedPage) : null;
    const logicalWidth = resolveLogicalViewportWidth(viewportWidthPx);

    const PagePreview = React.useMemo(() => {
        if (!loader) return null;
        return React.lazy(loader);
    }, [loader]);

    const previewStyleKey = React.useMemo(
        () =>
            Object.entries(previewStyle)
                .sort(([left], [right]) => left.localeCompare(right))
                .map(([key, value]) => `${key}:${String(value)}`)
                .join(";"),
        [previewStyle],
    );

    const frameRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [scale, setScale] = React.useState(0.5);
    const [scaledHeight, setScaledHeight] = React.useState<number | undefined>(undefined);

    React.useLayoutEffect(() => {
        if (!selectedPage || !PagePreview) return;

        const frame = frameRef.current;
        if (!frame) return;

        const updateScale = () => {
            const content = contentRef.current;
            if (!content) return;

            const frameWidth = frame.clientWidth;
            const frameHeight = frame.clientHeight;

            // Measure natural height without the active transform.
            // Layout width is locked to the selected viewport so the page
            // reflows as it would at that breakpoint.
            const prevTransform = content.style.transform;
            content.style.transform = "none";
            const contentHeight = Math.max(content.scrollHeight, 1);
            content.style.transform = prevTransform;

            if (frameWidth <= 0) return;

            // Zoom out when the selected viewport is wider than the panel;
            // never zoom in past 1 so small viewports render at true size.
            const widthScale = frameWidth / logicalWidth;
            const nextScale =
                fitMode === "width"
                    ? Math.min(widthScale, 1)
                    : frameHeight > 0
                      ? Math.min(widthScale, frameHeight / contentHeight, 1)
                      : Math.min(widthScale, 1);

            const safeScale = Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 0.5;
            setScale(safeScale);
            setScaledHeight(fitMode === "width" ? contentHeight * safeScale : undefined);
        };

        updateScale();

        const observer = new ResizeObserver(() => {
            updateScale();
        });
        observer.observe(frame);
        if (contentRef.current) observer.observe(contentRef.current);

        return () => observer.disconnect();
    }, [selectedPage, PagePreview, previewStyleKey, fitMode, logicalWidth]);

    return (
        <section className="flex min-w-0 flex-col gap-2 rounded-xl border border-border/60 bg-background/85 p-3">
            <div className="flex items-center gap-2">
                <p className="app-text-label">Page-Based Live Preview</p>
                <Badge variant={selectedPage ? "secondary" : "outline"} className="ml-auto px-1.5 app-text-micro">
                    {selectedPage ? "Active" : "Inactive"}
                </Badge>
                {selectedPage && (
                    <Badge variant="outline" className="px-1.5 app-text-micro font-mono">
                        {logicalWidth}px
                    </Badge>
                )}
            </div>

            {!selectedPage && (
                <p className="app-text-caption text-muted-foreground">
                    Select a page override to activate this preview container.
                </p>
            )}

            {selectedPage && !PagePreview && (
                <p className="app-text-caption text-muted-foreground">
                    No widget preview is registered for {resolvePreviewPageLabel(selectedPage)}.
                </p>
            )}

            {selectedPage && PagePreview && (
                <>
                    <p className="app-text-caption text-muted-foreground">
                        Live source page: {resolvePreviewPageLabel(selectedPage)} · viewport{" "}
                        {logicalWidth}px
                        {scale < 1 ? ` · zoomed to ${Math.round(scale * 100)}%` : null}
                    </p>
                    <div
                        ref={frameRef}
                        className={
                            fitMode === "width"
                                ? "relative min-w-0 w-full overflow-x-hidden overflow-y-auto rounded-xl border border-border/50 bg-background/60"
                                : "relative min-w-0 w-full overflow-hidden rounded-xl border border-border/50 bg-background/60"
                        }
                        style={{ height: "min(70vh, calc(100vh - 8rem))" }}
                    >
                        <div
                            className="relative w-full"
                            style={
                                scaledHeight
                                    ? { height: scaledHeight }
                                    : fitMode === "contain"
                                      ? { height: "100%" }
                                      : undefined
                            }
                        >
                            <div
                                key={`${selectedPage}:${previewStyleKey}:${fitMode}:${logicalWidth}`}
                                ref={contentRef}
                                className="origin-top-left"
                                style={{
                                    ...previewStyle,
                                    width: logicalWidth,
                                    maxWidth: logicalWidth,
                                    transform: `scale(${scale})`,
                                    transformOrigin: "top left",
                                }}
                            >
                                <React.Suspense
                                    fallback={
                                        <p className="app-text-caption text-muted-foreground p-2">
                                            Loading preview...
                                        </p>
                                    }
                                >
                                    <PagePreview />
                                </React.Suspense>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
