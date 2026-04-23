/**
 * Singleton QueryClient — shared between QueryProvider and utilities
 * that need to imperatively update the cache outside of React components.
 */
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Drop-in replacement for SWR's global `mutate`.
 *
 * mutate(key)              → invalidate (refetch)
 * mutate(key, data, false) → set cache data without refetch
 * mutate(key, updater, false) → set cache with updater fn, no refetch
 * mutate(filterFn, updater, false) → set cache for all matching keys (SWR filter pattern)
 */
export function mutate(
  key: any,
  data?: any,
  revalidate?: boolean
): void {
  // Filter-predicate form: first arg is a function (SWR filter pattern)
  if (typeof key === "function") {
    const predicate = key;
    if (data !== undefined) {
      queryClient.setQueriesData(
        { predicate: (query) => predicate(query.queryKey) },
        data
      );
    }
    if (revalidate !== false) {
      queryClient.invalidateQueries({ predicate: (query) => predicate(query.queryKey) });
    }
    return;
  }

  const qKey = Array.isArray(key) ? key : [key];
  if (data !== undefined) {
    queryClient.setQueryData(qKey, data);
  }
  if (revalidate !== false) {
    queryClient.invalidateQueries({ queryKey: qKey });
  }
}
