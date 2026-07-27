import { Heart } from "lucide-react";
import Link from "next/link";

interface SiteFooterProps {
  content?: {
    madeWith: string;
    by: string;
    team: string;
    description: string;
  };
}

const defaultContent = {
  madeWith: "Made with",
  by: "by",
  team: "OTA Tickets Team",
  description:
    "Building beautiful, accessible blocks, templates and dashboards for modern web applications.",
};

export function SiteFooter({ content = defaultContent }: SiteFooterProps) {
  return (
    <footer className="border-t bg-background">
      <div className="px-[length:var(--space-page-x)] py-[length:var(--space-section)] lg:px-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex items-center gap-2 admin-typo-filter-label text-muted-foreground">
            <span>{content.madeWith}</span>
            <Heart className="admin-icon-sm fill-red-500 text-red-500" />
            <span>{content.by}</span>
            <Link
              href="https://OTA Tickets.com"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-text-label text-foreground hover:text-primary transition-colors"
            >
              {content.team}
            </Link>
          </div>
          <p className="admin-typo-eyebrow text-muted-foreground">{content.description}</p>
        </div>
      </div>
    </footer>
  );
}
