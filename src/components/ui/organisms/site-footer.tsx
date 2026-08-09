import { ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

interface SiteFooterProps {
  content?: {
    product: string;
    consoleLabel: string;
    description: string;
  };
}

const defaultContent = {
  product: "DevMinds Marketplace",
  consoleLabel: "Operations Console",
  description:
    "Secure tools for managing listings, members, moderation, and platform quality.",
};

export function SiteFooter({ content = defaultContent }: SiteFooterProps) {
  return (
    <footer className="border-t border-border/70 bg-background/80">
      <div className="px-[var(--space-page-x)] py-[var(--space-section)]">
        <div className="app-premium-surface flex flex-col gap-[var(--space-gap)] p-[var(--space-card)] sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 app-text-heading-sm text-foreground transition-colors hover:text-primary"
            >
              <ShieldCheck className="app-icon-sm text-primary" aria-hidden />
              {content.product}
            </Link>
            <p className="mt-1 app-text-caption text-muted-foreground">
              {content.description}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 app-text-caption text-muted-foreground">
            <Sparkles className="app-icon-xs text-primary" aria-hidden />
            {content.consoleLabel}
          </span>
        </div>
      </div>
    </footer>
  );
}
