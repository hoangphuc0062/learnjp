"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  emptyN5Progress,
  N5_PROGRESS_EVENT,
  N5_STORAGE_KEY,
  readN5Progress,
} from "@/lib/learning/n5-review";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(N5_PROGRESS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(N5_PROGRESS_EVENT, callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(N5_STORAGE_KEY) ?? "{}";
  } catch {
    return "{}";
  }
}
function serverSnapshot() {
  return null;
}

export function useN5Progress() {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return useMemo(
    () => ({
      ready: raw !== null,
      progress: raw === null ? emptyN5Progress() : readN5Progress(),
    }),
    [raw],
  );
}
