"use client";
import { create } from "zustand";

export type NotificationItem = {
  id: string;
  title: string;
  message?: string;
  read?: boolean;
  createdAt?: string;
};

type NotificationsSlice = {
  items: NotificationItem[];
  unreadCount: number;
  set: (items: NotificationItem[]) => void;
  add: (item: NotificationItem) => void;
  markRead: (id: string) => void;
  clear: () => void;
};

export const useNotificationsStore = create<NotificationsSlice>((set, get) => ({
  items: [],
  unreadCount: 0,
  set: (items) => set({ items, unreadCount: items.filter((i) => !i.read).length }),
  add: (item) => set((s) => ({ items: [item, ...s.items], unreadCount: s.unreadCount + (item.read ? 0 : 1) })),
  markRead: (id) => set((s) => {
    const items = s.items.map((i) => (i.id === id ? { ...i, read: true } : i));
    return { items, unreadCount: items.filter((i) => !i.read).length };
  }),
  clear: () => set({ items: [], unreadCount: 0 }),
}));
