export type ReviewRecord = { due: number; step: number; attempts: number };
export type N5Progress = {
  completed: string[];
  reviews: Record<string, ReviewRecord>;
  drafts: Record<string, string>;
};
export const N5_STORAGE_KEY = "manabu-n5-v1";
export const N5_PROGRESS_EVENT = "manabu-n5-progress";
export const reviewIntervals = [1, 3, 7, 14, 30];
export const emptyN5Progress = (): N5Progress => ({
  completed: [],
  reviews: {},
  drafts: {},
});

export function readN5Progress(): N5Progress {
  try {
    const value = JSON.parse(localStorage.getItem(N5_STORAGE_KEY) ?? "null");
    if (
      !value ||
      !Array.isArray(value.completed) ||
      !value.reviews ||
      !value.drafts
    )
      return emptyN5Progress();
    const reviews: Record<string, ReviewRecord> = {};
    for (const [id, record] of Object.entries(value.reviews)) {
      const r = record as Partial<ReviewRecord> | null;
      if (
        r &&
        Number.isFinite(r.due) &&
        Number.isInteger(r.step) &&
        r.step! >= -1 &&
        r.step! < reviewIntervals.length &&
        Number.isInteger(r.attempts)
      ) {
        reviews[id] = r as ReviewRecord;
      }
    }
    return {
      completed: value.completed.filter((v: unknown) => typeof v === "string"),
      reviews,
      drafts: typeof value.drafts === "object" ? value.drafts : {},
    };
  } catch {
    return emptyN5Progress();
  }
}

export function saveN5Progress(progress: N5Progress) {
  try {
    localStorage.setItem(N5_STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event(N5_PROGRESS_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function scheduleN5Review(
  previous: ReviewRecord | undefined,
  remembered: boolean,
  now = Date.now(),
): ReviewRecord {
  // Practice before the due date must not push a card through all intervals.
  const advance = previous && previous.due <= now;
  if (remembered && previous && previous.due > now) {
    return { ...previous, attempts: previous.attempts + 1 };
  }
  const step = remembered
    ? Math.min(
        Math.max(previous?.step ?? 0, 0) +
          (advance && previous.step >= 0 ? 1 : 0),
        reviewIntervals.length - 1,
      )
    : -1;
  return {
    step,
    due: remembered
      ? now + reviewIntervals[step] * 86_400_000
      : now + 10 * 60_000,
    attempts: (previous?.attempts ?? 0) + 1,
  };
}
