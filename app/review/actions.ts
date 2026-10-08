"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function saveReviewRating(
  vocabularyId: string,
  rating: "again" | "hard" | "good",
) {
  if (!isSupabaseConfigured()) {
    return { saved: false, mode: "demo" as const };
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return { saved: false, mode: "guest" as const };

  const intervalDays = rating === "again" ? 0 : rating === "hard" ? 2 : 5;
  const dueAt = new Date(Date.now() + intervalDays * 86_400_000).toISOString();

  const { error } = await supabase.from("review_state").upsert(
    {
      user_id: userId,
      vocabulary_id: vocabularyId,
      last_rating: rating,
      interval_days: intervalDays,
      due_at: dueAt,
      last_reviewed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,vocabulary_id" },
  );

  if (!error) {
    await supabase.from("review_attempts").insert({
      user_id: userId,
      vocabulary_id: vocabularyId,
      rating,
    });
  }

  return { saved: !error, mode: "supabase" as const };
}
