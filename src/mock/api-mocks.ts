import type { HttpMethod } from "@/lib/axiosClient";
import {
  adminAdsPageFallback,
  adminContactsPageFallback,
  adminNotificationsPageFallback,
  adminPageFallback,
  blogDetailPageFallback,
  blogsPageFallback,
  listingsPageFallback,
  pendingsPageFallback,
  profilePageFallback,
  mockUsers,
} from "./index";

function asPath(url: string, params?: Record<string, any>) {
  const qs = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, String(value));
    }
  });

  const input = `${url}${qs.toString() ? `?${qs.toString()}` : ""}`;
  const parsed = new URL(input, "http://mock.local");
  return parsed;
}

function usersSearch(query: string) {
  const q = query.toLowerCase();
  return mockUsers.filter((user) => {
    return [user.fullName, user.name, user.email]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(q));
  });
}

export async function resolveMockRequest(url: string, params?: Record<string, any>) {
  const parsed = asPath(url, params);
  const path = parsed.pathname;

  if (path === "/listings") return listingsPageFallback.listings;
  if (path === "/categories") return listingsPageFallback.categories;
  if (path === "/stories") return listingsPageFallback.stories;
  if (path === "/ads") return adminAdsPageFallback.ads;
  if (path === "/contacts") return adminContactsPageFallback.contacts;
  if (path === "/admin/stats") return adminPageFallback.stats;
  if (path === "/notifications") return adminNotificationsPageFallback.notifications;
  if (path === "/listings/for-approval") return pendingsPageFallback.pendingListings;
  if (path === "/blogs") return blogsPageFallback.blogs;
  if (path === "/auth/profile") {
    return {
      user: profilePageFallback.usersById["u-1"],
    };
  }

  if (/^\/blogs\/.+/.test(path)) {
    const blogId = path.split("/")[2];
    return blogDetailPageFallback.blogsById[blogId] || null;
  }

  if (path === "/users") {
    const q = parsed.searchParams.get("q") || "";
    const autocomplete = parsed.searchParams.get("autocomplete") === "true";

    if (!q) return mockUsers;
    const users = usersSearch(q);

    if (autocomplete) {
      return {
        autocomplete: {
          suggestions: users.map((x) => x.fullName || x.name || x.email),
        },
      };
    }

    return users;
  }

  if (/^\/users\/.+/.test(path)) {
    const userId = path.split("/")[2];
    return profilePageFallback.usersById[userId] || profilePageFallback.usersById["u-1"];
  }

  if (/^\/listings\/.+/.test(path)) {
    const listingId = path.split("/")[2];
    return listingsPageFallback.listings.find((item) => String(item.id) === listingId) || null;
  }

  return [];
}

export async function resolveMockMutation(
  method: HttpMethod,
  url: string,
  body?: any,
  params?: Record<string, any>
) {
  const parsed = asPath(url, params);
  const path = parsed.pathname;

  if (path.includes("/blogs/") && path.endsWith("/likes")) {
    return { success: true, likes: 1 };
  }

  if (path.includes("/blogs/") && path.endsWith("/shares")) {
    return { success: true, shares: 1 };
  }

  if (path.includes("/blogs/") && path.endsWith("/comments")) {
    return {
      id: Date.now(),
      body: body?.body || "",
      authorId: "mock-user",
      createdAt: new Date().toISOString(),
    };
  }

  if (path === "/users/me" || path === "/users/me/photo") {
    return {
      success: true,
      user: profilePageFallback.usersById["u-1"],
    };
  }

  if (path.endsWith("/approve") || path.endsWith("/reject")) {
    return { success: true };
  }

  return {
    success: true,
    method,
    path,
    data: body ?? null,
    message: "Mock mutation handled",
  };
}
