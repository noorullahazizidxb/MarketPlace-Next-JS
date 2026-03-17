type ListingLike = {
  id?: string | number;
  title?: string | null;
  description?: string | null;
  location?: string | null;
  address?: string | null;
  category?: { name?: string | null } | null;
};

type UserLike = {
  id?: string | number;
  userId?: string | number;
  email?: string | null;
  phone?: string | null;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

type BlogLike = {
  id?: string | number;
  title?: string | null;
  content?: string | null;
  excerpt?: string | null;
  description?: string | null;
  author?: { fullName?: string | null; username?: string | null; name?: string | null } | null;
};

export function normalizeSearchText(value: unknown) {
  return typeof value === "string" ? value.trim().toLocaleLowerCase() : "";
}

function includesTerm(value: unknown, term: string) {
  if (!term) return true;
  return normalizeSearchText(value).includes(term);
}

export function filterListingsByQuery<T extends ListingLike>(listings: T[], query: string, limit?: number) {
  const term = normalizeSearchText(query);
  const results = !term
    ? listings
    : listings.filter((listing) =>
      [
        listing.title,
        listing.description,
        listing.location,
        listing.address,
        listing.category?.name,
        listing.id,
      ].some((value) => includesTerm(value, term))
    );

  return typeof limit === "number" ? results.slice(0, limit) : results;
}

export function filterUsersByQuery<T extends UserLike>(users: T[], query: string, limit?: number) {
  const term = normalizeSearchText(query);
  const results = !term
    ? users
    : users.filter((user) =>
      [user.fullName, user.firstName, user.lastName, user.email, user.phone, user.id, user.userId].some((value) => includesTerm(value, term))
    );

  return typeof limit === "number" ? results.slice(0, limit) : results;
}

export function filterBlogsByQuery<T extends BlogLike>(blogs: T[], query: string, limit?: number) {
  const term = normalizeSearchText(query);
  const results = !term
    ? blogs
    : blogs.filter((blog) =>
      [
        blog.title,
        blog.excerpt,
        blog.description,
        blog.content,
        blog.author?.fullName,
        blog.author?.username,
        blog.author?.name,
      ].some((value) => includesTerm(value, term))
    );

  return typeof limit === "number" ? results.slice(0, limit) : results;
}

export function buildSuggestions(values: Array<string | null | undefined>, limit = 10) {
  return [...new Set(values.map((value) => (typeof value === "string" ? value.trim() : "")).filter(Boolean))].slice(0, limit);
}