function readPublicEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value !== undefined) return value;
  }
  return undefined;
}

function parseBoolean(value: string | undefined, fallback = false) {
  if (value === undefined || value === "") return fallback;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off"].includes(normalized)) return false;
  return fallback;
}

export const config = {
  apiBase: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002/api",
  useMockData: String(process.env.NEXT_PUBLIC_USE_MOCK_DATA || "false").toLowerCase() === "true",
  elasticSearchEnabled: parseBoolean(
    readPublicEnv("NEXT_PUBLIC_ENABLE-ELASTIC-SEARCH", "NEXT_PUBLIC_ENABLE_ELASTIC_SEARCH"),
    true
  ),
  googleClientId: readPublicEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID"),
  facebookAppId: readPublicEnv("NEXT_PUBLIC_FACEBOOK_APP_ID"),
  googleAuthUrl: readPublicEnv("NEXT_PUBLIC_GOOGLE_AUTH_URL") || "/api/auth/google",
  facebookAuthUrl: readPublicEnv("NEXT_PUBLIC_FACEBOOK_AUTH_URL") || "/api/auth/facebook",
  themeFileRoute: "/api/themes/file",
};
