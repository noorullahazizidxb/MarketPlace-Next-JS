/** Base URL of the marketplace REST API for server-side (route handler) calls. */
export function getApiBase() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.API_BASE ||
    "http://localhost:3002/api"
  ).replace(/\/$/, "");
}

/** POST JSON to the backend and return the parsed envelope (never throws). */
export async function postBackend<T = any>(
  path: string,
  body: unknown,
  { timeoutMs = 8000, token }: { timeoutMs?: number; token?: string | null } = {},
): Promise<{ ok: boolean; status: number; body: T | null }> {
  try {
    const response = await fetch(`${getApiBase()}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body ?? {}),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
    const json = (await response.json().catch(() => null)) as T | null;
    return { ok: response.ok, status: response.status, body: json };
  } catch {
    return { ok: false, status: 0, body: null };
  }
}
