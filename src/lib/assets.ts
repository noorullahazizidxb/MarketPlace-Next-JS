export function asset(url?: unknown) {
  if (!url) return "";
  let s = "";
  if (typeof url === "string") s = url;
  else if (url instanceof URL) s = url.toString();
  else if (typeof (url as any)?.toString === "function") s = (url as any).toString();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  const base = (
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ""
  ).replace(/\/?api\/?$/, "");
  if (!base) return s.startsWith("/") ? s : `/${s}`;
  const left = base.endsWith("/") ? base.slice(0, -1) : base;
  const right = s.startsWith("/") ? s : `/${s}`;
  return `${left}${right}`;
}
