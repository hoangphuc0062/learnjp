import lessons from "@/content/n5/lessons.json";

export type N5Lesson = (typeof lessons)[number];
export type N5Exercise = N5Lesson["exercises"][number];
export const n5Lessons = lessons;
export const n5Stages = [
  { title: "Làm quen và đời sống", start: 0, end: 5 },
  { title: "Hành động và miêu tả", start: 5, end: 10 },
  { title: "Mong muốn và giao tiếp", start: 10, end: 15 },
  { title: "Nối ý và chia động từ", start: 15, end: 20 },
  { title: "Diễn đạt ý tưởng", start: 20, end: 25 },
];

export function normalizeN5Answer(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[\s。！!？?、,.]/g, "")
    .trim();
}
