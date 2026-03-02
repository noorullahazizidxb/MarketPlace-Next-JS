"use client";

import { FocusEvent, useMemo, useState } from "react";

function blurLeftContainer<T extends HTMLElement>(event: FocusEvent<T>) {
  const nextTarget = event.relatedTarget as Node | null;
  return !nextTarget || !event.currentTarget.contains(nextTarget);
}

export function useEngagedAutoplay() {
  const [isEngaged, setIsEngaged] = useState(false);

  const engagementProps = useMemo(
    () => ({
      onMouseEnter: () => setIsEngaged(true),
      onMouseLeave: () => setIsEngaged(false),
      onFocus: () => setIsEngaged(true),
      onBlur: <T extends HTMLElement>(event: FocusEvent<T>) => {
        if (blurLeftContainer(event)) setIsEngaged(false);
      },
      onTouchStart: () => setIsEngaged(true),
      onTouchEnd: () => setIsEngaged(false),
      onTouchCancel: () => setIsEngaged(false),
    }),
    []
  );

  return { isEngaged, setIsEngaged, engagementProps };
}
