export function asset(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/?api\/?$/, "");
  return `${base}${url}`;
}
