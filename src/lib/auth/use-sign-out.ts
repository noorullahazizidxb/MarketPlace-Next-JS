"use client";

import { useCallback, useState } from "react";
import { signOut } from "./session-client";

/** React binding for the shared sign-out flow (pending state for buttons). */
export function useSignOut() {
  const [isPending, setPending] = useState(false);
  const run = useCallback(async () => {
    setPending(true);
    await signOut();
  }, []);
  return { signOut: run, isPending } as const;
}
