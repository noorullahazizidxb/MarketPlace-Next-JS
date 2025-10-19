"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
        style={{ overflow: "hidden" }}
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
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users, listings, notifications…"
              className="h-11 w-72 max-w-[80vw] rounded-xl border bg-[hsl(var(--card))] pl-4 pr-11 text-sm"
              aria-label="Search users"
            />
            <SearchIcon className="size-4 absolute right-4 top-1/2 -translate-y-1/2 opacity-60" />
          </div>
          <select
            aria-label="Filter by role"
            value={roleFilter ?? ""}
            onChange={(e) => setRoleFilter(e.target.value || null)}
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
          <table className="w-full min-w-[1100px] table-auto">
            <thead className="bg-[hsl(var(--card))]/90 backdrop-blur border-b sticky top-0 z-10">
              <tr className="text-xs text-foreground/70">
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Roles</th>
                <th className="p-3 text-left">Listings</th>
                <th className="p-3 text-left">Notifications</th>
                <th className="p-3 text-left">Audit Logs</th>
                <th className="p-3 text-left">Feedbacks</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[hsl(var(--card))]">
              {isLoading && (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <Loader2 className="mx-auto size-6 animate-spin" />
                  </td>
                </tr>
              )}
              {error && !isLoading && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-6 text-center text-red-500 text-sm"
                  >
                    {(error as any)?.message || "Failed to load users"}
                  </td>
                </tr>
              )}
              {!isLoading && !error && current.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center subtle text-sm">
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
                      <td className="p-3 align-top">
                        <div className="flex items-center gap-3">
                          <Link
                            href={u.id ? `/profile/${u.id}` : "#"}
                            onClick={(e) => {
                              if (!u.id) e.preventDefault();
                            }}
                            className="flex items-center gap-3"
                          >
                            <div className="relative size-10 rounded-xl overflow-hidden border border-[hsl(var(--border))]">
                              <Image
                                src={avatar}
                                alt={u.fullName || u.email}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">
                                {u.fullName || u.firstName || u.email}
                              </div>
                              <div className="text-2xs subtle truncate">
                                {u.email}
                              </div>
                              <div className="text-2xs subtle truncate">
                                {u.phone || "—"}
                              </div>
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td className="p-3 align-top whitespace-nowrap">
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          {(u.roles || []).map((r: any, idx: number) => {
                            const label =
                              typeof r === "string"
                                ? r
                                : r?.role || r?.name || String(r?.id) || "ROLE";
                            const key =
                              typeof r === "string"
                                ? `${label}-${idx}`
                                : `${r?.id || label}-${idx}`;
                            return (
                              <span
                                key={key}
                                className="px-2 py-0.5 rounded-full bg-[hsl(var(--muted))/0.4] border border-[hsl(var(--border))] text-2xs"
                              >
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3 align-top text-center text-2xs">
                        {(u.listings || []).length || 0}
                      </td>
                      <td className="p-3 align-top text-center text-2xs">
                        {(u.notifications || []).length || 0}
                      </td>
                      <td className="p-3 align-top text-center text-2xs">
                        {(u.auditLogs || []).length || 0}
                      </td>
                      <td className="p-3 align-top text-center text-2xs">
                        {(u.feedbacks || []).length || 0}
                      </td>
                      <td className="p-3 align-top text-2xs whitespace-nowrap">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="p-3 align-top">
                        <div className="flex items-center gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
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
                        </div>
                      </td>
                    </tr>
                    <tr className={!isExpanded ? "hidden" : ""}>
                      <td colSpan={8} className="p-0">
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
          Showing {Math.min(page * perPage, total)} of {total} users
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <div className="px-3 py-1 rounded-xl border text-sm">
            {page} / {pages}
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={page === pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="w-full max-w-3xl p-0 overflow-hidden">
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
