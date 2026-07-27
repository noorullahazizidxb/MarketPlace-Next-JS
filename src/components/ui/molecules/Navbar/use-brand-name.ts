"use client";

import { useEffect, useState } from "react";
import { DEFAULT_BRAND_NAME, resolveBrandName } from "./navbar.constants";

export function useBrandName(): string {
  const [brandName, setBrandName] = useState(DEFAULT_BRAND_NAME);

  useEffect(() => {
    setBrandName(resolveBrandName(window.location.hostname));
  }, []);

  return brandName;
}
