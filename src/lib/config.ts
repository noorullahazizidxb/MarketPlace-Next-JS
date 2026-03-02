export const config = {
  apiBase: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002/api",
  useMockData: String(process.env.NEXT_PUBLIC_USE_MOCK_DATA || "false").toLowerCase() === "true",
  themeFileRoute: "/api/themes/file",
};
