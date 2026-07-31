"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "../atoms/shadcn/button";
import { Card, CardContent } from "../atoms/shadcn/card";
import { Logo } from "../atoms/logo";

export function SidebarNotification() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <Card className="mb-3 py-0 border-border bg-muted dark:border-border dark:bg-muted">
      <CardContent className="p-4 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-muted dark:hover:bg-muted"
          onClick={() => setIsVisible(false)}
        >
          <X className="app-icon-xs" />
          <span className="sr-only">Close notification</span>
        </Button>

        <div className="pr-6">
          <h3 className="flex items-center gap-3 app-text-heading-sm text-muted-foreground dark:text-muted-foreground mb-2 mt-1">
            <Logo size={42} className="-mt-1" />
            <div>
              Welcome to{" "}
              <a
                href="https://OTA Tickets.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                OTA Tickets
              </a>
            </div>
          </h3>
          <p className="app-text-body text-muted-foreground dark:text-muted-foreground leading-relaxed">
            Explore our premium Shadcn UI{" "}
            <a
              href="https://OTA Tickets.com/blocks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              blocks
            </a>{" "}
            to build your next project faster.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
