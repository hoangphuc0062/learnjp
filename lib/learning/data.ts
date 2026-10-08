import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

import { demoLessons, demoUnits, demoVocabulary } from "./demo-data";
import { fallbackKana } from "./kana";
import type {
  KanaCharacter,
  LessonDetail,
  LessonSummary,
  UnitSummary,
  VocabularyCard,
} from "./types";

export type DashboardData = {
  displayName: string;
  streakDays: number;
  dailyGoalMinutes: number;
  completedMinutes: number;
  dailyProgress: number;
  dueReviewCount: number;
  weekMinutes: number;
  weekActivity: number[];
  courseProgress: number;
  completedLessons: number;
  totalLessons: number;
  nextLesson: LessonSummary;
  units: UnitSummary[];
};

const demoDashboard: DashboardData = {
  displayName: "Phúc",
  streakDays: 6,
  dailyGoalMinutes: 25,
  completedMinutes: 12,
  dailyProgress: 48,
  dueReviewCount: 18,
  weekMinutes: 126,
  weekActivity: [38, 64, 52, 90, 42, 76, 58],
  courseProgress: 24,
  completedLessons: 3,
  totalLessons: 12,
  nextLesson: demoUnits[0].lessons[1],
  units: demoUnits,
};

function mapStatus(progress: number | null): LessonSummary["status"] {
  if ((progress ?? 0) >= 100) return "completed";
  if ((progress ?? 0) > 0) return "in_progress";
  return "ready";
}

export async function getDashboardData(): Promise<DashboardData> {
  if (!isSupabaseConfigured()) return demoDashboard;

  try {
    const supabase = await createClient();
    const { data: claimsData } = await supabase.auth.getClaims();
    const userId = claimsData?.claims?.sub;

    const { data: course } = await supabase
      .from("courses")
      .select("id, slug, title, level")
      .eq("slug", "jlpt-n5")
      .eq("is_published", true)
      .maybeSingle();

    if (!course) return demoDashboard;

    const { data: units } = await supabase
      .from("units")
      .select("id, slug, title, description, symbol, order_index")
      .eq("course_id", course.id)
      .order("order_index");

    const unitIds = (units ?? []).map((unit) => unit.id);
    const { data: lessons } = unitIds.length
      ? await supabase
          .from("lessons")
          .select(
            "id, unit_id, slug, title, japanese_title, description, level, estimated_minutes, item_count, order_index",
          )
          .in("unit_id", unitIds)
          .eq("is_published", true)
          .order("order_index")
      : { data: [] };

    let progressRows: { lesson_id: string; progress_percent: number }[] = [];
    let dueReviewCount = demoDashboard.dueReviewCount;
    let displayName = demoDashboard.displayName;

    if (userId) {
      const [{ data: progress }, { count }, { data: profile }] = await Promise.all([
        supabase
          .from("lesson_progress")
          .select("lesson_id, progress_percent")
          .eq("user_id", userId),
        supabase
          .from("review_state")
          .select("vocabulary_id", { count: "exact", head: true })
          .eq("user_id", userId)
          .lte("due_at", new Date().toISOString()),
        supabase
          .from("profiles")
          .select("display_name")
          .eq("user_id", userId)
          .maybeSingle(),
      ]);
      progressRows = progress ?? [];
      dueReviewCount = count ?? 0;
      displayName =
        profile?.display_name ||
        (claimsData.claims.email as string | undefined)?.split("@")[0] ||
        "Bạn";
    }

    const progressMap = new Map(
      progressRows.map((row) => [row.lesson_id, row.progress_percent]),
    );

    const mappedUnits: UnitSummary[] = (units ?? []).map((unit) => {
      const unitLessons = (lessons ?? []).filter(
        (lesson) => lesson.unit_id === unit.id,
      );
      const mappedLessons: LessonSummary[] = unitLessons.map((lesson) => {
        const progress = progressMap.get(lesson.id) ?? 0;
        return {
          slug: lesson.slug,
          title: lesson.title,
          japaneseTitle: lesson.japanese_title,
          description: lesson.description ?? "",
          level: lesson.level,
          estimatedMinutes: lesson.estimated_minutes,
          itemCount: lesson.item_count,
          status: mapStatus(progress),
          progress,
        };
      });
      const unitProgress = mappedLessons.length
        ? Math.round(
            mappedLessons.reduce((sum, lesson) => sum + lesson.progress, 0) /
              mappedLessons.length,
          )
        : 0;
      return {
        slug: unit.slug,
        title: unit.title,
        description: unit.description ?? "",
        symbol: unit.symbol,
        progress: unitProgress,
        lessons: mappedLessons,
      };
    });

    const allLessons = mappedUnits.flatMap((unit) => unit.lessons);
    const completedLessons = allLessons.filter(
      (lesson) => lesson.progress >= 100,
    ).length;
    const nextLesson =
      allLessons.find((lesson) => lesson.status !== "completed") ??
      allLessons[0] ??
      demoDashboard.nextLesson;

    return {
      ...demoDashboard,
      displayName,
      dueReviewCount,
      courseProgress: allLessons.length
        ? Math.round((completedLessons / allLessons.length) * 100)
        : 0,
      completedLessons,
      totalLessons: allLessons.length,
      nextLesson,
      units: mappedUnits.length ? mappedUnits : demoUnits,
    };
  } catch {
    return demoDashboard;
  }
}

export async function getUnits() {
  return (await getDashboardData()).units;
}

export async function getKana(): Promise<KanaCharacter[]> {
  if (!isSupabaseConfigured()) return fallbackKana;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kana")
      .select("character, script, romaji, row_name, vowel, sort_order")
      .eq("category", "basic")
      .order("script")
      .order("sort_order");

    if (!data?.length) return fallbackKana;

    return data.map((item) => ({
      character: item.character,
      script: item.script as KanaCharacter["script"],
      romaji: item.romaji,
      rowName: item.row_name,
      vowel: item.vowel as KanaCharacter["vowel"],
      sortOrder: item.sort_order,
    }));
  } catch {
    return fallbackKana;
  }
}

export async function getSoundRuleKana(): Promise<KanaCharacter[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kana")
      .select("character, script, romaji, row_name, vowel, category, sort_order")
      .in("category", ["dakuten", "handakuten", "small", "other"])
      .order("script")
      .order("sort_order");

    return (data ?? []).map((item) => ({
      character: item.character,
      script: item.script as KanaCharacter["script"],
      romaji: item.romaji,
      rowName: item.row_name,
      vowel: item.vowel as KanaCharacter["vowel"],
      category: item.category as NonNullable<KanaCharacter["category"]>,
      sortOrder: item.sort_order,
    }));
  } catch {
    return [];
  }
}

export async function getLesson(slug: string): Promise<LessonDetail | null> {
  if (!isSupabaseConfigured()) return demoLessons[slug] ?? null;

  try {
    const supabase = await createClient();
    const { data: lesson } = await supabase
      .from("lessons")
      .select(
        "id, slug, title, japanese_title, description, level, estimated_minutes, item_count, content",
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (!lesson) return demoLessons[slug] ?? null;

    const { data: claimsData } = await supabase.auth.getClaims();
    const userId = claimsData?.claims?.sub;
    let progress = 0;

    if (userId) {
      const { data: progressRow } = await supabase
        .from("lesson_progress")
        .select("progress_percent")
        .eq("user_id", userId)
        .eq("lesson_id", lesson.id)
        .maybeSingle();
      progress = progressRow?.progress_percent ?? 0;
    }

    const { data: links } = await supabase
      .from("lesson_vocabulary")
      .select(
        "order_index, vocabulary:vocabulary_id(id, expression, reading, meaning, example, example_meaning)",
      )
      .eq("lesson_id", lesson.id)
      .order("order_index");

    const vocabulary: VocabularyCard[] = (links ?? [])
      .map((link) =>
        Array.isArray(link.vocabulary)
          ? link.vocabulary[0]
          : link.vocabulary,
      )
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .map((item) => ({
        id: item.id,
        expression: item.expression,
        reading: item.reading,
        meaning: item.meaning,
        example: item.example ?? "",
        exampleMeaning: item.example_meaning ?? "",
      }));

    const content = (lesson.content ?? {}) as {
      intro?: string;
      learning_points?: string[];
    };

    return {
      slug: lesson.slug,
      title: lesson.title,
      japaneseTitle: lesson.japanese_title,
      description: lesson.description ?? "",
      level: lesson.level,
      estimatedMinutes: lesson.estimated_minutes,
      itemCount: lesson.item_count,
      status: mapStatus(progress),
      progress,
      intro: content.intro ?? lesson.description ?? "",
      learningPoints: content.learning_points ?? [],
      vocabulary,
    };
  } catch {
    return demoLessons[slug] ?? null;
  }
}

export async function getReviewCards(): Promise<VocabularyCard[]> {
  if (!isSupabaseConfigured()) return demoVocabulary;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("vocabulary")
      .select("id, expression, reading, meaning, example, example_meaning")
      .eq("is_published", true)
      .limit(12);

    if (!data?.length) return demoVocabulary;
    return data.map((item) => ({
      id: item.id,
      expression: item.expression,
      reading: item.reading,
      meaning: item.meaning,
      example: item.example ?? "",
      exampleMeaning: item.example_meaning ?? "",
    }));
  } catch {
    return demoVocabulary;
  }
}
