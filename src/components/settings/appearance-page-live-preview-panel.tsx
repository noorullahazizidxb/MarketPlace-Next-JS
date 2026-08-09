"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import { ExternalLink, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import type { AdminPageId } from "@repo/types";
import { Badge, Button } from "@repo/ui";
import { resolvePreviewPage } from "./appearance-preview-registry";

type AppearancePageLivePreviewPanelProps = {
  pageScope: "global" | AdminPageId;
  previewStyle: CSSProperties;
  viewportWidthPx: number;
  fitMode?: "contain" | "width";
};

function getViewportHeight(width: number) {
  if (width <= 640) return 667;
  if (width <= 1024) return 900;
  return 900;
}

export function AppearancePageLivePreviewPanel({
  pageScope,
  previewStyle,
  viewportWidthPx,
}: AppearancePageLivePreviewPanelProps) {
  const page = pageScope === "global" ? null : resolvePreviewPage(pageScope);
  const logicalWidth = Number.isFinite(viewportWidthPx) ? viewportWidthPx : 1280;
  const logicalHeight = getViewportHeight(logicalWidth);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [reloadKey, setReloadKey] = React.useState(0);
  const [autoScale, setAutoScale] = React.useState(0.7);
  const [zoom, setZoom] = React.useState(1);
  const [loaded, setLoaded] = React.useState(false);

  const scale = Math.max(0.25, Math.min(1.35, autoScale * zoom));
  const applyPreviewTokens = React.useCallback(() => {
    const frameDocument = iframeRef.current?.contentWindow?.document;
    if (!frameDocument) return;

    const sourceRoot = document.documentElement;
    const targetRoot = frameDocument.documentElement;
    targetRoot.dataset.appearancePreview = "true";
    targetRoot.dataset.theme = sourceRoot.dataset.theme ?? "light";
    targetRoot.classList.toggle("dark", sourceRoot.classList.contains("dark"));
    targetRoot.classList.toggle("light", !sourceRoot.classList.contains("dark"));

    Object.entries(previewStyle).forEach(([property, value]) => {
      if (property.startsWith("--") && value != null) {
        targetRoot.style.setProperty(property, String(value));
      }
    });
  }, [previewStyle]);

  React.useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateScale = () => {
      const widthFit = frame.clientWidth / logicalWidth;
      const heightFit = Math.min(720, window.innerHeight * 0.68) / logicalHeight;
      const fit = Math.min(widthFit, heightFit, 1);
      setAutoScale(Number.isFinite(fit) && fit > 0 ? fit : 0.7);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [logicalHeight, logicalWidth]);

  React.useEffect(() => {
    if (loaded) applyPreviewTokens();
  }, [applyPreviewTokens, loaded]);

  React.useEffect(() => {
    setZoom(1);
    setLoaded(false);
  }, [pageScope, logicalWidth]);

  if (!page) {
    return (
      <section className="appearance-preview-panel">
        <div className="appearance-preview-empty">
          <p className="app-text-label">Full-page live preview</p>
          <p className="app-text-caption text-muted-foreground">
            Select a real application page above to open it in an isolated responsive frame.
          </p>
        </div>
      </section>
    );
  }

  const src = `${page.path}${page.path.includes("?") ? "&" : "?"}appearance-preview=1`;

  return (
    <section className="appearance-preview-panel">
      <div className="appearance-preview-toolbar">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="app-text-label truncate">{page.label}</p>
            <Badge variant="secondary" className="app-text-micro">
              {logicalWidth} × {logicalHeight}
            </Badge>
            <Badge variant="outline" className="app-text-micro">
              {Math.round(scale * 100)}%
            </Badge>
          </div>
          <p className="app-text-caption text-muted-foreground line-clamp-1">
            {page.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button type="button" size="icon" variant="ghost" onClick={() => setZoom((value) => Math.max(0.5, value - 0.1))} aria-label="Zoom out preview">
            <ZoomOut className="app-icon-sm" />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => setZoom((value) => Math.min(1.75, value + 0.1))} aria-label="Zoom in preview">
            <ZoomIn className="app-icon-sm" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => {
              setLoaded(false);
              setReloadKey((value) => value + 1);
            }}
            aria-label="Reload preview"
          >
            <RefreshCw className="app-icon-sm" />
          </Button>
          <Button type="button" size="icon" variant="ghost" asChild>
            <a href={page.path} target="_blank" rel="noreferrer" aria-label="Open page">
              <ExternalLink className="app-icon-sm" />
            </a>
          </Button>
        </div>
      </div>

      <div ref={frameRef} className="appearance-preview-stage">
        <div className="appearance-preview-canvas" style={{ width: logicalWidth * scale, height: logicalHeight * scale }}>
          <iframe
            key={`${page.id}:${reloadKey}`}
            ref={iframeRef}
            src={src}
            title={`${page.label} responsive theme preview`}
            className="appearance-preview-iframe"
            style={{ width: logicalWidth, height: logicalHeight, transform: `scale(${scale})` }}
            onLoad={() => {
              setLoaded(true);
              applyPreviewTokens();
            }}
          />
        </div>
      </div>
    </section>
  );
}
