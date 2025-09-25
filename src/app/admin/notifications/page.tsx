"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useApiGet } from "@/lib/api-hooks";
import { api } from "@/lib/axiosClient";
import {
  Eye,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Mail,
  Info,
  Shield,
  AlertTriangle,
  X,
} from "lucide-react";

// --- AutoCompleteUsers component ------------------------------------------------
function AutoCompleteUsers({
  id,
  disabled,
  selected,
  onChange,
  placeholder,
}: {
  id?: string;
  disabled?: boolean;
  selected: any[];
  onChange: (list: any[]) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const key = q.trim() ? (["users", q, "autocomplete"] as const) : null;
  // call autocomplete endpoint on every keystroke
  const { data, isLoading } = useApiGet<any | null>(
    key,
    q ? `/users?q=${encodeURIComponent(q)}&autocomplete=true` : "/users"
  );

  // backend may return an envelope with data.autocomplete.suggestions (string[])
  const suggestionStrings: string[] = data && (data as any).autocomplete && Array.isArray((data as any).autocomplete.suggestions)
    ? (data as any).autocomplete.suggestions
    : [];

  // fallback when endpoint returns full user objects or hits
  const suggestionUsers: any[] = Array.isArray(data)
    ? data
    : data && Array.isArray((data as any).hits)
    ? (data as any).hits
    : data && Array.isArray((data as any).data)
    ? (data as any).data
    : [];

  async function addUser(u: any) {
    // if suggestion is a string, resolve it to full user via api.get
    if (typeof u === "string") {
      try {
        const res = await api.get<any>(`/users?q=${encodeURIComponent(u)}`);
        let users: any[] = [];
        if (Array.isArray(res)) users = res;
        else if (res && Array.isArray(res.hits)) users = res.hits;
        else if (res && Array.isArray(res.data)) users = res.data;
        const found = users[0] || { id: u, fullName: u, email: "" };
        if (selected.find((s) => String(s.id) === String(found.id) || String(s.userId) === String(found.id))) {
          setQ("");
          return;
        }
        onChange([...selected, found]);
      } catch (e) {
        const fallback = { id: u, fullName: u };
        if (!selected.find((s) => String(s.id) === String(fallback.id))) onChange([...selected, fallback]);
      } finally {
        setQ("");
      }
      return;
    }
    // user object path
    if (selected.find((s) => s.id === u.id || s.userId === u.id)) return;
    onChange([...selected, u]);
    setQ("");
  }

  function removeUser(idToRemove: string | number) {
    onChange(
      selected.filter((s) => String(s.id || s.userId) !== String(idToRemove))
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2 p-2 border rounded-xl bg-[hsl(var(--card))]">
        {selected.map((s) => (
          <span
            key={s.id || s.userId}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--muted))]"
          >
            <span className="text-sm">
              {s.fullName || s.name || s.email || s.userId}
            </span>
            <button
              onClick={() => removeUser(s.id || s.userId)}
              aria-label="remove"
              className="opacity-70 hover:opacity-100"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          disabled={!!disabled}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="flex-1 h-9 min-w-[12rem] bg-transparent outline-none"
        />
      </div>
      {q.trim().length > 0 && !disabled && (
        <div className="absolute left-0 right-0 mt-2 z-50 rounded-xl border bg-[hsl(var(--card))] shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-3 text-sm subtle">Loading…</div>
          ) : (suggestionStrings.length === 0 && suggestionUsers.length === 0) ? (
            <div className="p-3 text-sm subtle">No users</div>
          ) : (
            <ul>
              {suggestionStrings.length > 0 &&
                suggestionStrings.map((s: string) => (
                  <li key={s}>
                    <button
                      className="w-full text-left p-3 hover:bg-[hsl(var(--muted))]/5"
                      onClick={() => addUser(s)}
                    >
                      <div className="font-medium">{s}</div>
                      <div className="text-xs subtle">{s}</div>
                    </button>
                  </li>
                ))}

              {suggestionUsers.length > 0 &&
                suggestionUsers.map((u: any) => (
                  <li key={u.id || u.userId || u._id || u.email}>
                    <button
                      className="w-full text-left p-3 hover:bg-[hsl(var(--muted))]/5"
                      onClick={() => addUser(u)}
                    >
                      <div className="font-medium">{u.fullName || u.name || u.email}</div>
                      <div className="text-xs subtle">{u.email || u.userId}</div>
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

type Recipient = {
  id: number;
  notificationId: string;
  userId: string;
  role?: string | null;
  readAt?: string | null;
  deliveredAt?: string | null;
  deliveryError?: string | null;
  user?: any;
};

type Notification = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  title: string;
  message?: string;
  channel?: string;
  targetType?: string;
  senderId?: string | null;
  listingId?: string | null;
  sentAt?: string | null;
  meta?: any;
  triggerEvent?: string | null;
  recipients?: Recipient[];
  sender?: any;
  listing?: any;
};

// Mock data (excerpt provided by user)
const MOCK: Notification[] = [
  {
    id: "cmftgvxkd006jtujsbi29vf0j",
    createdAt: "2025-09-21T09:00:27.949Z",
    updatedAt: "2025-09-21T09:00:27.949Z",
    title: "Notice 55",
    message: "adipiscing adipiscing sit dolor amet do",
    channel: "SYSTEM",
    targetType: "USER",
    senderId: null,
    listingId: null,
    sentAt: null,
    meta: null,
    triggerEvent: null,
    recipients: [
      {
        id: 56,
        notificationId: "cmftgvxkd006jtujsbi29vf0j",
        userId: "cmftgvrw50005tujskjv4o6gk",
        role: null,
        readAt: null,
        deliveredAt: null,
        deliveryError: null,
        user: {
          id: "cmftgvrw50005tujskjv4o6gk",
          email: "user5@example.com",
          phone: "+930000001005",
          fullName: "User5 Seed",
        },
      },
    ],
  },
  {
    id: "cmftgvxjj006itujsoae2yc20",
    createdAt: "2025-09-21T09:00:27.919Z",
    updatedAt: "2025-09-21T09:00:27.919Z",
    title: "Notice 54",
    message: "ipsum sit consectetur adipiscing amet do",
    channel: "SYSTEM",
    targetType: "USER",
    senderId: null,
    listingId: null,
    sentAt: null,
    meta: null,
    triggerEvent: null,
    recipients: [
      {
        id: 55,
        notificationId: "cmftgvxjj006itujsoae2yc20",
        userId: "cmftgvu3q001dtujs6e54fjl0",
        role: null,
        readAt: null,
        deliveredAt: null,
        deliveryError: null,
        user: {
          id: "cmftgvu3q001dtujs6e54fjl0",
          email: "user49@example.com",
          phone: "+930000001049",
          fullName: "User49 Seed",
        },
      },
    ],
  },
];

function ChannelIcon({ channel }: { channel?: string }) {
  const c = (channel || "").toUpperCase();
  if (c === "EMAIL") return <Mail className="size-4" />;
  if (c === "ALERT") return <AlertTriangle className="size-4" />;
  if (c === "SECURITY") return <Shield className="size-4" />;
  return <Info className="size-4" />;
}

export default function NotificationsAdminPage() {
  const [items, setItems] = useState<Notification[]>(MOCK);
  const [query, setQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<string | null>(null);
  const [targetFilter, setTargetFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [viewing, setViewing] = useState<Notification | null>(null);
  const [editing, setEditing] = useState<Notification | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Notification | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((n) => (channelFilter ? n.channel === channelFilter : true))
      .filter((n) => (targetFilter ? n.targetType === targetFilter : true))
      .filter(
        (n) =>
          !q ||
          n.title.toLowerCase().includes(q) ||
          (n.message || "").toLowerCase().includes(q) ||
          n.id.toLowerCase().includes(q)
      )
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [items, query, channelFilter, targetFilter]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  function toggleExpand(id: string) {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  }

  function markRecipientRead(notificationId: string, recipientId: number) {
    setItems((prev) =>
      prev.map((n) => {
        if (n.id !== notificationId) return n;
        return {
          ...n,
          recipients: n.recipients?.map((r) =>
            r.id === recipientId
              ? { ...r, readAt: new Date().toISOString() }
              : r
          ),
        } as Notification;
      })
    );
  }

  function resendToRecipient(notificationId: string, recipientId: number) {
    // Simulate resend: touch deliveredAt
    setItems((prev) =>
      prev.map((n) => {
        if (n.id !== notificationId) return n;
        return {
          ...n,
          recipients: n.recipients?.map((r) =>
            r.id === recipientId
              ? { ...r, deliveredAt: new Date().toISOString() }
              : r
          ),
        } as Notification;
      })
    );
  }

  function deleteNotification(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setConfirmDelete(null);
  }

  return (
    <div className="container-padded py-8">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Notifications
            </h1>
            <p className="text-sm subtle mt-1">
              Manage notifications, recipients and delivery state
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                aria-label="Search notifications"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, message, id..."
                className="h-10 w-64 max-w-[70vw] px-3 pr-10 rounded-xl border bg-[hsl(var(--card))]"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60">
                <Search className="size-4" />
              </div>
            </div>
            <select
              aria-label="Filter by channel"
              title="Filter by channel"
              value={channelFilter ?? ""}
              onChange={(e) => setChannelFilter(e.target.value || null)}
              className="h-10 rounded-xl border px-3 bg-[hsl(var(--card))]"
            >
              <option value="">All channels</option>
              <option value="SYSTEM">SYSTEM</option>
              <option value="EMAIL">EMAIL</option>
              <option value="ALERT">ALERT</option>
            </select>
            <select
              aria-label="Filter by target type"
              title="Filter by target"
              value={targetFilter ?? ""}
              onChange={(e) => setTargetFilter(e.target.value || null)}
              className="h-10 rounded-xl border px-3 bg-[hsl(var(--card))]"
            >
              <option value="">All targets</option>
              <option value="USER">USER</option>
              <option value="LISTING">LISTING</option>
            </select>
            <Button
              variant="accent"
              size="sm"
              onClick={() => setCreating(true)}
            >
              Create Notification
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs subtle">
          <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--muted))] px-3 py-1">
            Total: {total}
          </span>
          {channelFilter && (
            <button
              onClick={() => setChannelFilter(null)}
              className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] px-3 py-1"
            >
              Channel: {channelFilter} ✕
            </button>
          )}
          {targetFilter && (
            <button
              onClick={() => setTargetFilter(null)}
              className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] px-3 py-1"
            >
              Target: {targetFilter} ✕
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-[hsl(var(--card))] border-b">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Message</th>
              <th className="text-left p-3">Channel</th>
              <th className="text-left p-3">Target</th>
              <th className="text-left p-3">Sender</th>
              <th className="text-left p-3">Created At</th>
              <th className="text-left p-3">Sent At</th>
              <th className="text-left p-3">Trigger</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[hsl(var(--card))]">
            {current.map((n) => (
              <>
                <tr
                  key={n.id}
                  className="border-b hover:bg-[hsl(var(--muted))]/5 transition-colors"
                >
                  <td className="p-3 align-top">
                    <div className="font-semibold">{n.title}</div>
                    <div className="text-xs subtle">{n.id}</div>
                  </td>
                  <td className="p-3 align-top max-w-[28rem]">
                    <div className="line-clamp-2 text-sm">{n.message}</div>
                  </td>
                  <td className="p-3 align-top flex items-center gap-2">
                    <ChannelIcon channel={n.channel} />
                    <span className="text-sm">{n.channel}</span>
                  </td>
                  <td className="p-3 align-top">{n.targetType}</td>
                  <td className="p-3 align-top">
                    {n.sender?.fullName || n.senderId || "—"}
                  </td>
                  <td className="p-3 align-top">
                    {new Date(n.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 align-top">
                    {n.sentAt ? new Date(n.sentAt).toLocaleString() : "—"}
                  </td>
                  <td className="p-3 align-top">{n.triggerEvent || "—"}</td>
                  <td className="p-3 align-top">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewing(n)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditing(n)}
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete(n)}
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                      <button
                        onClick={() => toggleExpand(n.id)}
                        aria-label="expand recipients"
                        className="p-2 rounded-full hover:bg-[hsl(var(--muted))]"
                      >
                        {expanded[n.id] ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>

                {expanded[n.id] && (
                  <tr className="bg-[hsl(var(--card))]">
                    <td colSpan={9} className="p-4">
                      <div className="rounded-xl border p-3">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="font-medium">
                            Recipients ({n.recipients?.length ?? 0})
                          </div>
                          <div className="text-xs subtle">
                            Actions: mark read / resend
                          </div>
                        </div>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-xs subtle">
                              <th className="text-left p-2">ID</th>
                              <th className="text-left p-2">User</th>
                              <th className="text-left p-2">Role</th>
                              <th className="text-left p-2">Read At</th>
                              <th className="text-left p-2">Delivered At</th>
                              <th className="text-left p-2">Error</th>
                              <th className="p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {n.recipients && n.recipients.length ? (
                              n.recipients.map((r) => (
                                <tr
                                  key={r.id}
                                  className="border-t hover:bg-[hsl(var(--muted))]/5"
                                >
                                  <td className="p-2 align-top">{r.id}</td>
                                  <td className="p-2 align-top">
                                    <div className="font-medium">
                                      {r.user?.fullName || r.userId}
                                    </div>
                                    <div className="text-xs subtle">
                                      {r.user?.email || ""}
                                    </div>
                                  </td>
                                  <td className="p-2 align-top">
                                    {r.role || "—"}
                                  </td>
                                  <td className="p-2 align-top">
                                    {r.readAt
                                      ? new Date(r.readAt).toLocaleString()
                                      : "—"}
                                  </td>
                                  <td className="p-2 align-top">
                                    {r.deliveredAt
                                      ? new Date(r.deliveredAt).toLocaleString()
                                      : "—"}
                                  </td>
                                  <td className="p-2 align-top text-sm text-red-600">
                                    {r.deliveryError || ""}
                                  </td>
                                  <td className="p-2 align-top">
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          markRecipientRead(n.id, r.id)
                                        }
                                      >
                                        Mark read
                                      </Button>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() =>
                                          resendToRecipient(n.id, r.id)
                                        }
                                      >
                                        Resend
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={7}
                                  className="p-3 subtle text-center"
                                >
                                  No recipients
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm subtle">
          Showing {Math.min(page * perPage, total)} of {total}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <div className="px-3 py-1 rounded-xl border">
            {page} / {pages}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      {/* View modal */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent>
          {viewing && (
            <div>
              <h2 className="text-lg font-semibold">{viewing.title}</h2>
              <p className="text-sm subtle mt-1">ID: {viewing.id}</p>
              <div className="mt-4">
                <p className="whitespace-pre-wrap">{viewing.message}</p>
              </div>
              <div className="mt-4 flex gap-2 justify-end">
                <Button variant="secondary" onClick={() => setViewing(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit modal (simple inline edit) */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          {editing && (
            <EditForm
              notification={editing}
              onCancel={() => setEditing(null)}
              onSave={(updated) => {
                setItems((prev) =>
                  prev.map((p) => (p.id === updated.id ? updated : p))
                );
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm modal */}
      <Dialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <DialogContent>
          {confirmDelete && (
            <div>
              <h3 className="text-lg font-semibold">Delete notification?</h3>
              <p className="text-sm subtle mt-2">
                Are you sure you want to permanently delete{" "}
                <strong>{confirmDelete.title}</strong>?
              </p>
              <div className="mt-4 flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => deleteNotification(confirmDelete.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create notification modal */}
      <Dialog open={creating} onOpenChange={() => setCreating(false)}>
        <DialogContent>
          {creating && (
            <CreateForm
              onCancel={() => setCreating(false)}
              onCreate={(draft) => {
                const now = new Date().toISOString();
                const newNotification: Notification = {
                  id: generateId(),
                  createdAt: now,
                  updatedAt: now,
                  title: draft.title,
                  message: draft.message,
                  channel: draft.channel,
                  targetType: draft.targetType,
                  triggerEvent: draft.triggerEvent || null,
                  sentAt: draft.sendNow ? now : null,
                  meta: draft.metaJson || null,
                  recipients: draft.recipientIds.map((uid, i) => ({
                    id: Math.floor(Math.random() * 1000000) + i,
                    notificationId: "temp",
                    userId: uid,
                    role: null,
                    readAt: null,
                    deliveredAt: draft.sendNow ? now : null,
                    deliveryError: null,
                  })),
                };
                setItems((prev) => [newNotification, ...prev]);
                setCreating(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditForm({
  notification,
  onCancel,
  onSave,
}: {
  notification: Notification;
  onCancel: () => void;
  onSave: (n: Notification) => void;
}) {
  const [title, setTitle] = useState(notification.title);
  const [message, setMessage] = useState(notification.message || "");
  return (
    <div>
      <h3 className="text-lg font-semibold">Edit Notification</h3>
      <div className="mt-3 grid gap-3">
        <label className="text-sm font-medium">Title</label>
        <input
          title="Notification title"
          className="h-10 rounded-xl border px-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="text-sm font-medium">Message</label>
        <textarea
          title="Notification message"
          className="rounded-xl border p-3 min-h-[120px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="mt-4 flex gap-2 justify-end">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={() => onSave({ ...notification, title, message })}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

// Utility ID generator (lightweight, avoids external deps)
function generateId() {
  return (
    "n_" +
    Math.random().toString(36).slice(2, 8) +
    Date.now().toString(36).slice(-4)
  );
}

type CreateDraft = {
  title: string;
  message: string;
  channel: string;
  targetType: string;
  triggerEvent?: string;
  metaJson?: any;
  recipientIds: string[];
  sendNow: boolean;
};

function CreateForm({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (draft: CreateDraft) => void;
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("SYSTEM");
  const [targetType, setTargetType] = useState("USER");
  const [triggerEvent, setTriggerEvent] = useState("");
  const [metaRaw, setMetaRaw] = useState('{\n  "example": true\n}');
  const [recipientsRaw, setRecipientsRaw] = useState("");
  const [sendNow, setSendNow] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<any[]>([]);
  function submit() {
    const errs: string[] = [];
    if (!title.trim()) errs.push("Title is required");
    if (!message.trim()) errs.push("Message is required");
    let parsed: any = null;
    if (metaRaw.trim()) {
      try {
        parsed = JSON.parse(metaRaw);
      } catch (e: any) {
        errs.push("Meta JSON invalid: " + e.message);
      }
    }
    const recipientIds = selectedRecipients.map((u) =>
      String(u.id ?? u.userId ?? u._id ?? u.uuid ?? "")
    );
    if (targetType === "USER" && !recipientIds.length)
      errs.push("At least one recipient userId required for target type USER");
    setErrors(errs);
    if (errs.length) return;
    onCreate({
      title: title.trim(),
      message: message.trim(),
      channel,
      targetType,
      triggerEvent: triggerEvent.trim() || undefined,
      metaJson: parsed,
      recipientIds,
      sendNow,
    });
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto pr-2">
      <h3 className="text-lg font-semibold">Create Notification</h3>
      <p className="text-xs subtle mt-1">
        Fill details and deliver to recipients.
      </p>
      {errors.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-red-500">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      <div className="mt-4 grid gap-4">
        <div className="grid gap-1">
          <label className="text-xs font-medium" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="System maintenance"
            className="h-10 rounded-xl border px-3"
          />
        </div>
        <div className="grid gap-1">
          <label className="text-xs font-medium" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="We will perform maintenance at..."
            className="rounded-xl border p-3 min-h-[120px]"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="grid gap-1">
            <label className="text-xs font-medium" htmlFor="channel">
              Channel
            </label>
            <select
              id="channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="h-10 rounded-xl border px-3 bg-[hsl(var(--card))]"
            >
              <option value="SYSTEM">SYSTEM</option>
              <option value="EMAIL">EMAIL</option>
              <option value="ALERT">ALERT</option>
            </select>
          </div>
          <div className="grid gap-1">
            <label className="text-xs font-medium" htmlFor="target">
              Target Type
            </label>
            <select
              id="target"
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="h-10 rounded-xl border px-3 bg-[hsl(var(--card))]"
            >
              <option value="USER">USER</option>
              <option value="LISTING">LISTING</option>
            </select>
          </div>
          <div className="grid gap-1">
            <label className="text-xs font-medium" htmlFor="trigger">
              Trigger Event (optional)
            </label>
            <input
              id="trigger"
              value={triggerEvent}
              onChange={(e) => setTriggerEvent(e.target.value)}
              placeholder="USER_REGISTERED"
              className="h-10 rounded-xl border px-3"
            />
          </div>
        </div>
        <div className="grid gap-1">
          <label className="text-xs font-medium" htmlFor="recipients">
            Recipients
          </label>
          <AutoCompleteUsers
            id="recipients"
            disabled={targetType !== "USER"}
            selected={selectedRecipients}
            onChange={(list) => setSelectedRecipients(list)}
            placeholder={
              targetType === "USER"
                ? "Search users by name or email"
                : "Disabled for non-user targets"
            }
          />
        </div>
        <div className="grid gap-1">
          <label className="text-xs font-medium" htmlFor="meta">
            Meta JSON (optional)
          </label>
          <textarea
            id="meta"
            value={metaRaw}
            onChange={(e) => setMetaRaw(e.target.value)}
            className="rounded-xl border p-3 font-mono text-xs min-h-[140px]"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-xs font-medium select-none">
          <input
            type="checkbox"
            checked={sendNow}
            onChange={(e) => setSendNow(e.target.checked)}
            className="size-4 rounded border"
          />
          Send immediately
        </label>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 justify-end">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={submit}>
          Create
        </Button>
      </div>
    </div>
  );
}
