"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import { AppearanceLivePreview, Badge, type AppearancePreviewVariant } from "@repo/ui";
import type { AppearanceDensityTab } from "./appearance-preview-registry";

type AppearanceCategoryLivePreviewPanelProps = {
    category: AppearanceDensityTab;
    previewVariant: AppearancePreviewVariant;
    previewStyle: CSSProperties;
    maxWidth: string;
};

export function AppearanceCategoryLivePreviewPanel({
    category,
    previewVariant,
    previewStyle,
    maxWidth: _maxWidth,
}: AppearanceCategoryLivePreviewPanelProps) {
    const frameRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [scale, setScale] = React.useState(1);
    const [contentHeight, setContentHeight] = React.useState<number | undefined>(undefined);

    React.useLayoutEffect(() => {
        const frame = frameRef.current;
        if (!frame) return;

        const updateScale = () => {
            const content = contentRef.current;
            if (!content) return;

            const frameWidth = frame.clientWidth;
            if (frameWidth <= 0) return;

            // Measure natural width without current transform
            const prevTransform = content.style.transform;
            content.style.transform = "none";
            const naturalWidth = Math.max(content.scrollWidth, content.offsetWidth, 1);
            const naturalHeight = Math.max(content.scrollHeight, content.offsetHeight, 1);
            content.style.transform = prevTransform;

            const nextScale = Math.min(1, frameWidth / naturalWidth);
            setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
            setContentHeight(naturalHeight * (Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1));
        };

        updateScale();

        const observer = new ResizeObserver(() => {
            updateScale();
        });
        observer.observe(frame);
        if (contentRef.current) observer.observe(contentRef.current);

        return () => observer.disconnect();
    }, [category, previewVariant, previewStyle]);

    return (
        <section className="flex min-w-0 flex-col gap-2 overflow-hidden rounded-xl border border-border/60 bg-background/85 p-2.5">
            <div className="flex shrink-0 items-center gap-2">
                <p className="admin-text-label">Category Live Preview</p>
                <Badge variant="secondary" className="ml-auto px-1.5 admin-text-micro">
                    {category}
                </Badge>
            </div>

            <div
                ref={frameRef}
                className="relative min-w-0 w-full overflow-hidden"
                style={contentHeight ? { height: contentHeight } : undefined}
            >
                <div
                    ref={contentRef}
                    className="origin-top-left min-w-0 w-full"
                    style={{
                        ...previewStyle,
                        width: "100%",
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                    }}
                >
                    <AppearanceLivePreview
                        variant={previewVariant}
                        className="min-w-0 w-full max-w-full"
                    />
                </div>
            </div>
        </section>
    );
}
