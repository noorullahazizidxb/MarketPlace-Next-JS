import React from "react";
import { NavbarAuthUser } from "./navbar.types";


export function AuthSkeleton() {
  return <div className="min-h-[var(--ctrl-h-sm)] w-32 animate-pulse rounded-lg bg-muted" />;
}

export function UserAvatar({ className = "app-text-body" }: { className?: string }) {
  return (
    <span className={className} role="img" aria-label="user">
      👤
    </span>
  );
}

export function UserInfoBlock({ user }: { user: NavbarAuthUser }) {
  return (
    <div className="flex min-w-0 flex-col space-y-1">
      <p className="truncate app-text-body">{user.fullName}</p>
      <p className="truncate app-text-caption text-muted-foreground">{user.email}</p>
      {user.companyName && (
        <p className="truncate app-text-caption text-muted-foreground">{user.companyName}</p>
      )}
    </div>
  );
}