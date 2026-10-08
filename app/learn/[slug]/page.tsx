import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
} from "@phosphor-icons/react/dist/ssr";

import { AppShell } from "@/components/app-shell";
import { LessonCompleteButton } from "@/components/lesson-complete-button";
import { getLesson } from "@/lib/learning/data";

export const instant = false;

export default async function LessonPage({
  params,
}: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  const lesson = await getLesson(slug);
  if (!lesson) notFound();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-9">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="size-4" /> Lộ trình
        </Link>

        <header className="mt-7 rounded-[30px] bg-[#153f3a] px-6 py-8 text-white sm:px-9 sm:py-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-teal-50/75">
            <span className="rounded-full bg-white/10 px-2.5 py-1">
              {lesson.level}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" /> {lesson.estimatedMinutes} phút
            </span>
          </div>
          <p className="mt-7 font-jp text-4xl text-[#f5d99b] sm:text-5xl">
            {lesson.japaneseTitle}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {lesson.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-teal-50/75 sm:text-base">
            {lesson.intro}
          </p>
        </header>

        <section className="mt-6 rounded-[26px] border border-stone-200 bg-white p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
            Sau bài này bạn sẽ
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {lesson.learningPoints.map((point) => (
              <div
                key={point}
                className="flex gap-3 rounded-2xl bg-[#f8f6f0] p-4 text-sm leading-6 text-stone-700"
              >
                <CheckCircle
                  className="mt-0.5 size-5 shrink-0 text-teal-700"
                  weight="fill"
                />
                {point}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                Nội dung chính
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-950">
                Học theo ngữ cảnh
              </h2>
            </div>
            <p className="text-xs font-semibold text-stone-400">
              {lesson.vocabulary.length} mục
            </p>
          </div>

          <div className="grid gap-3">
            {lesson.vocabulary.map((item, index) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-[24px] border border-stone-200 bg-white p-5 sm:grid-cols-[56px_1fr] sm:p-6"
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-[#fff4d9] text-sm font-bold text-amber-800">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
                    <p className="font-jp text-3xl font-semibold text-stone-950">
                      {item.expression}
                    </p>
                    <p className="font-jp pb-1 text-sm text-teal-700">
                      {item.reading}
                    </p>
                  </div>
                  <p className="mt-2 font-semibold text-stone-800">
                    {item.meaning}
                  </p>
                  {item.example && (
                    <div className="mt-4 border-l-2 border-teal-200 pl-4">
                      <p className="font-jp text-base text-stone-800">
                        {item.example}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        {item.exampleMeaning}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-end">
          <Link
            href="/review"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-teal-800 px-6 text-sm font-bold text-white hover:bg-teal-900"
          >
            Ôn lại nội dung
            <ArrowRight className="size-4" weight="bold" />
          </Link>
          <LessonCompleteButton
            slug={lesson.slug}
            initialCompleted={lesson.progress >= 100}
          />
        </div>
      </div>
    </AppShell>
  );
}
