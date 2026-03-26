"use client";
import React, { useMemo, useState } from "react";
import {
  Users,
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { useApiGet } from "@/lib/api-hooks";
import { BaseUser } from "./types";
import { cn } from "@/lib/cn";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import ExpandedUserRow from "./expanded-user-row";
import UserCreateWizard from "./user-create-wizard";
import { asset } from "@/lib/assets";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ExpandedRowWrapper: React.FC<{
  isExpanded: boolean;
  children: React.ReactNode;
}> = ({ isExpanded, children }) => (
  <AnimatePresence initial={false}>
    {isExpanded && (
      <motion.div
        key="expanded-row"
        initial="collapsed"
        animate="open"
        exit="collapsed"
        variants={{
          open: {
            height: "auto",
            opacity: 1,
            transition: {
              height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.3 },
            },
          },
          collapsed: {
            height: 0,
            opacity: 0,
            transition: {
              height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.2 },
            },
          },
        }}
        className="overflow-hidden"
        layout
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const UsersDashboard: React.FC = () => {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const { data, isLoading, error, mutate } = useApiGet<BaseUser[] | any>(
    ["admin-users"],
    "/users",
    {
      include:
        "roles,listings,notifications,auditLogs,feedbacks,representativeInfo",
    },
    { revalidateOnFocus: false }
  );

  const users: BaseUser[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data as BaseUser[];
    if (Array.isArray(data?.data)) return data.data as BaseUser[];
    if (Array.isArray(data?.hits)) return data.hits as BaseUser[];
    return [];
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return users
      .filter((u) => {
        if (!roleFilter) return true;
        const rolesArr = (u.roles || [])
          .map((r: any) =>
            typeof r === "string"
              ? r
              : r?.role || r?.name || String(r?.id) || ""
          )
          .filter(Boolean);
        return rolesArr.includes(roleFilter);
      })
      .filter((u) => {
        if (!q) return true;
        const base = [u.email, u.fullName, u.firstName, u.lastName, u.phone]
          .join(" ")
          .toLowerCase();
        if (base.includes(q)) return true;
        const nested = [
          ...(u.listings || []).map((l: any) => l?.title || ""),
          ...(u.notifications || []).map((n: any) => n?.title || ""),
          ...(u.feedbacks || []).map((f: any) => f?.message || f?.text || ""),
        ]
          .join(" ")
          .toLowerCase();
        return nested.includes(q);
      })
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  }, [users, query, roleFilter]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(page, pages);
  const current = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="container-padded py-8 space-y-8">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Users className="size-6 text-[hsl(var(--accent))]" /> Users
          </h1>
          <p className="subtle max-w-prose">
            Manage platform users, roles and related activity. Search also scans
            nested data.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search users, listings, notifications…"
              className="h-11 w-72 max-w-[80vw] rounded-xl border bg-[hsl(var(--card))] pl-4 pr-11 text-sm"
              aria-label="Search users"
            />
            <SearchIcon className="size-4 absolute right-4 top-1/2 -translate-y-1/2 opacity-60" />
          </div>
          <select
            aria-label="Filter by role"
            value={roleFilter ?? ""}
            onChange={(e) => {
              setRoleFilter(e.target.value || null);
              setPage(1);
            }}
            className="h-11 rounded-xl border bg-[hsl(var(--card))] px-3 text-sm"
          >
            <option value="">All roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
            <option value="REPRESENTATIVE">REPRESENTATIVE</option>
          </select>
          <Button
            variant="accent"
            size="sm"
            onClick={() => setOpenCreate(true)}
          >
            <UserPlus className="size-4" />
            <span>Create User</span>
          </Button>
        </div>
      </header>
      <div
        className={cn(
          "rounded-2xl border relative transition-filter",
          openCreate && "blur-sm grayscale-[25%]"
        )}
      >
        <div
          className="overflow-x-auto touch-scroll rounded-2xl"
          role="region"
          aria-label="Users table. Scroll horizontally on small screens."
        >
          <table className="w-full table-auto">
            <thead className="bg-[hsl(var(--card))]/90 backdrop-blur border-b sticky top-0 z-10">
              <tr className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Roles</th>
                <th className="px-4 py-3 text-center">Activity</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[hsl(var(--card))]">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 className="mx-auto size-6 animate-spin" />
                  </td>
                </tr>
              )}
              {error && !isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-red-500 text-sm"
                  >
                    {(error as any)?.message || "Failed to load users"}
                  </td>
                </tr>
              )}
              {!isLoading && !error && current.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center subtle text-sm">
                    No users match your filters.
                  </td>
                </tr>
              )}
              {current.map((u) => {
                const avatar = asset(u.photo) || "/favicon.svg";
                const isExpanded = expandedRow === u.id;
                return (
                  <React.Fragment key={u.id}>
                    <tr
                      className={cn(
                        "border-b transition-colors hover:bg-[hsl(var(--muted))]/5",
                        isExpanded && "bg-[hsl(var(--muted))]/10"
                      )}
                    >
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-3">
                          <Link
                            href={u.id ? `/profile/${u.id}` : "#"}
                            onClick={(e) => {
                              if (!u.id) e.preventDefault();
                            }}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                          >
                            <div className="relative size-10 rounded-xl overflow-hidden border border-[hsl(var(--border))] shrink-0">
                              <Image
                                src={avatar}
                                alt={u.fullName || u.email}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold truncate max-w-[160px]">
                                {u.fullName || u.firstName || u.email}
                              </div>
                              <div className="text-xs text-[hsl(var(--muted-foreground))] truncate max-w-[160px]">
                                {u.email}
                              </div>
                              {u.phone && (
                                <div className="text-xs text-[hsl(var(--muted-foreground))]/70 truncate">
                                  {u.phone}
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {(u.roles || []).map((r: any, idx: number) => {
                            const label =
                              typeof r === "string"
                                ? r
                                : r?.role || r?.name || String(r?.id) || "ROLE";
                            const key =
                              typeof r === "string"
                                ? `${label}-${idx}`
                                : `${r?.id || label}-${idx}`;
                            const colorMap: Record<string, string> = {
                              ADMIN: "bg-red-500/10 text-red-600 border-red-400/30 dark:text-red-400",
                              USER: "bg-blue-500/10 text-blue-600 border-blue-400/30 dark:text-blue-400",
                              REPRESENTATIVE: "bg-amber-500/10 text-amber-600 border-amber-400/30 dark:text-amber-400",
                            };
                            return (
                              <span
                                key={key}
                                className={cn(
                                  "px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide",
                                  colorMap[label] ?? "bg-[hsl(var(--muted))]/40 border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                                )}
                              >
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center justify-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                          <span className="flex flex-col items-center gap-0.5">
                            <span className="text-sm font-bold text-[hsl(var(--foreground))]">{(u.listings || []).length || 0}</span>
                            <span className="text-[10px] uppercase tracking-wide">Listings</span>
                          </span>
                          <span className="w-px h-6 bg-[hsl(var(--border))]" />
                          <span className="flex flex-col items-center gap-0.5">
                            <span className="text-sm font-bold text-[hsl(var(--foreground))]">{(u.notifications || []).length || 0}</span>
                            <span className="text-[10px] uppercase tracking-wide">Notifs</span>
                          </span>
                          <span className="w-px h-6 bg-[hsl(var(--border))]" />
                          <span className="flex flex-col items-center gap-0.5">
                            <span className="text-sm font-bold text-[hsl(var(--foreground))]">{(u.feedbacks || []).length || 0}</span>
                            <span className="text-[10px] uppercase tracking-wide">Feedbacks</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle text-sm text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-2 justify-center">
                          <Tooltip content={isExpanded ? "Collapse details" : "Expand details"} side="left">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-lg"
                              aria-label={isExpanded ? "Collapse row" : "Expand row"}
                              onClick={() =>
                                setExpandedRow(isExpanded ? null : u.id)
                              }
                            >
                              {isExpanded ? (
                                <ChevronLeft className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                    <tr className={!isExpanded ? "hidden" : ""}>
                      <td colSpan={5} className="p-0">
                        <ExpandedRowWrapper isExpanded={isExpanded}>
                          <ExpandedUserRow user={u} />
                        </ExpandedRowWrapper>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm subtle">
          Showing {Math.min(currentPage * perPage, total)} of {total} users
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="accent"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setPage(Math.max(1, currentPage - 1))}
          >
            Prev
          </Button>
          <div className="px-3 py-1 rounded-xl border text-sm bg-[hsl(var(--accent))/0.12] border-[hsl(var(--accent))/0.35] text-[hsl(var(--accent-foreground))]">
            {currentPage} / {pages}
          </div>
          <Button
            variant="accent"
            size="sm"
            disabled={currentPage === pages}
            onClick={() => setPage(Math.min(pages, currentPage + 1))}
          >
            Next
          </Button>
        </div>
      </div>
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="w-full max-w-3xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Create New User</DialogTitle>
          <UserCreateWizard
            onClose={() => setOpenCreate(false)}
            onCreated={() => mutate()}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersDashboard;
