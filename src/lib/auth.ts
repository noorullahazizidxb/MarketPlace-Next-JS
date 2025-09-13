export const auth = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },
  setToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_token", token);
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
  },
};

type JwtPayload = {
  sub?: string;
  roles?: string[];
  name?: string;
  email?: string;
  [k: string]: any;
};

export function parseJwt(token: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = typeof window !== "undefined" ? atob(payload) : Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// useAuth moved to client-only file to avoid importing hooks on the server
