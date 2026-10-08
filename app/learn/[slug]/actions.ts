"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function completeLesson(slug: string) {
  if (!isSupabaseConfigured()) {
    return { saved: false, mode: "demo" as const };
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    return { saved: false, mode: "guest" as const };
  }

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (lessonError || !lesson) {
    return { saved: false, mode: "error" as const };
  }

  const now = new Date().toISOString();
  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: userId,
      lesson_id: lesson.id,
      progress_percent: 100,
      completed_at: now,
      updated_at: now,
    },
    { onConflict: "user_id,lesson_id" },
  );

  if (error) {
    return { saved: false, mode: "error" as const };
  }

  revalidatePath("/");
  revalidatePath("/learn");
  revalidatePath("/progress");
  revalidatePath(`/learn/${slug}`);

  return { saved: true, mode: "supabase" as const };
}
