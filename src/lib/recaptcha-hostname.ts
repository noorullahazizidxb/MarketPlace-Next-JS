const APEX_HOST = "devminds.net";
const WWW_HOST = "www.devminds.net";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function normalizeHostname(hostname: string): string {
  const value = hostname.trim().toLowerCase().replace(/\.$/, "");
  const bracketed = value.match(/^\[([^\]]+)\](?::\d+)?$/);
  if (bracketed?.[1]) return bracketed[1];
  // IPv6 literals contain multiple colons; hostname:port has a single colon.
  if (value.split(":").length > 2) return value;
  return value.replace(/:\d+$/, "");
}

function isDevmindsHost(host: string): boolean {
  if (host === APEX_HOST || host === WWW_HOST) return true;
  return host.endsWith(`.${APEX_HOST}`) && host !== `.${APEX_HOST}`;
}

/**
 * Hostnames Google may return from siteverify for this product.
 * Apex, www, and any subdomain of devminds.net are allowed.
 * Loopback hosts are allowed only outside production.
 */
export function isAllowedRecaptchaHostname(
  hostname: string | null | undefined,
  options?: { allowLocal?: boolean },
): boolean {
  if (!hostname) return false;
  const host = normalizeHostname(hostname);
  if (!host || host.includes(" ")) return false;
  if (isDevmindsHost(host)) return true;
  const allowLocal = options?.allowLocal ?? process.env.NODE_ENV !== "production";
  return allowLocal && LOCAL_HOSTS.has(host);
}
