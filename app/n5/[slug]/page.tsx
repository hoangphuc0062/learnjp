import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { N5Study } from "@/components/n5-study";
import { N5Review } from "@/components/n5-review";
import { n5Lessons } from "@/lib/learning/n5";

export function generateStaticParams() {
  return [
    ...n5Lessons.map((lesson) => ({ slug: lesson.slug })),
    { slug: "on-tap" },
  ];
}

export default async function N5LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "on-tap")
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 pb-28 pt-8 sm:px-8">
          <Link href="/n5" className="text-sm text-teal-700">
            ← Giáo trình N5
          </Link>
          <h1 className="mt-6 text-3xl font-semibold">Ôn tập hôm nay</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Tự nhớ trước khi xem đáp án. Câu ngữ pháp và từ vựng được trộn giữa
            các bài đã luyện.
          </p>
          <N5Review />
        </div>
      </AppShell>
    );
  const lesson = n5Lessons.find((l) => l.slug === slug);
  if (!lesson) notFound();
  const index = n5Lessons.indexOf(lesson);
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 pb-28 pt-8 sm:px-8">
        <Link href="/n5" className="text-sm font-semibold text-teal-700">
          ← Giáo trình N5
        </Link>
        <N5Study
          key={slug}
          lesson={lesson}
          previous={n5Lessons[index - 1]?.slug}
          next={n5Lessons[index + 1]?.slug}
        />
      </div>
    </AppShell>
  );
}
