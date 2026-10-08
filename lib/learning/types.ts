export type LessonSummary = {
  slug: string;
  title: string;
  japaneseTitle: string;
  description: string;
  level: string;
  estimatedMinutes: number;
  itemCount: number;
  status: "locked" | "ready" | "in_progress" | "completed";
  progress: number;
};

export type UnitSummary = {
  slug: string;
  title: string;
  description: string;
  symbol: string;
  progress: number;
  lessons: LessonSummary[];
};

export type VocabularyCard = {
  id: string;
  expression: string;
  reading: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
};

export type KanaCharacter = {
  character: string;
  script: "hiragana" | "katakana";
  romaji: string;
  rowName: string | null;
  vowel: "a" | "i" | "u" | "e" | "o" | null;
  category?: "basic" | "dakuten" | "handakuten" | "yoon" | "small" | "other";
  sortOrder: number;
};

export type LessonDetail = LessonSummary & {
  intro: string;
  learningPoints: string[];
  vocabulary: VocabularyCard[];
};
