// src/components/CommandForm/useOverlayGate.ts
"use client";
import * as React from "react";

/**
 * Show overlay unless the active window is shorter than `minOnMs` (prevents flash).
 * Hides immediately when `active` becomes false.
 */
export function useOverlayGate(active: boolean, minOnMs = 80) {
  const [shown, setShown] = React.useState(false);
  const showT = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (active) {
      // schedule show; if user releases quickly, we never paint
      if (showT.current == null) {
        showT.current = window.setTimeout(() => {
          setShown(true);
          showT.current = null;
        }, minOnMs);
      }
    } else {
      // cancel any scheduled show and hide immediately
      if (showT.current != null) {
        clearTimeout(showT.current);
        showT.current = null;
      }
      setShown(false);
    }
    return () => {
      if (showT.current != null) {
        clearTimeout(showT.current);
        showT.current = null;
      }
    };
  }, [active, minOnMs]);

  return shown;
}
