import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  LockSimple,
  PlayCircle,
} from "@phosphor-icons/react/dist/ssr";

import { AppShell } from "@/components/app-shell";
import { getUnits } from "@/lib/learning/data";

export const metadata = { title: "Lộ trình học" };
export const instant = false;

export default async function LearnPage() {
  const units = await getUnits();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-9">
        <header className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Lộ trình
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-4xl">
            Từ bảng chữ cái đến JLPT N5
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-500 sm:text-base">
            Học theo thứ tự gợi ý để xây nền chắc. Bạn vẫn có thể mở trước bài
            chưa học nếu muốn xem nội dung.
          </p>
        </header>

        <Link href="/n5" className="mt-7 block rounded-[24px] border border-teal-200 bg-teal-50 p-6">
          <p className="text-xs font-bold tracking-wide text-teal-700">GIÁO TRÌNH CỦA BẠN</p>
          <h2 className="mt-2 text-xl font-semibold text-teal-950">25 bài N5 · Học sâu, nhớ lâu</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">Giải thích dễ hiểu, từ vựng có hình và phát âm, bài tập tự nhớ và lịch ôn cách quãng.</p>
          <p className="mt-3 text-sm font-bold text-teal-800">Mở giáo trình →</p>
        </Link>

        <div className="mt-9 space-y-5">
          {units.map((unit, unitIndex) => (
            <section
              key={unit.slug}
              className="overflow-hidden rounded-[28px] border border-stone-200 bg-white"
            >
              <div className="grid gap-4 border-b border-stone-100 bg-[#fbfaf6] p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
                <div className="flex gap-4">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#e6f0ed] font-jp text-xl font-semibold text-teal-800">
                    {unit.symbol}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">
                      Chặng {unitIndex + 1}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-950">
                      {unit.title}
                    </h2>
                    <p className="mt-1 text-sm text-stone-500">
                      {unit.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:min-w-36">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
                    <div
                      className="h-full rounded-full bg-teal-700"
                      style={{ width: `${unit.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-500">
                    {unit.progress}%
                  </span>
                </div>
              </div>

              <div className="divide-y divide-stone-100">
                {unit.lessons.map((lesson, lessonIndex) => {
                  const completed = lesson.status === "completed";
                  const locked = lesson.status === "locked";
                  return (
                    <Link
                      key={lesson.slug}
                      href={`/learn/${lesson.slug}`}
                      className="group grid gap-3 p-5 transition hover:bg-stone-50 sm:grid-cols-[44px_1fr_auto] sm:items-center sm:gap-4"
                    >
                      <div className="hidden size-10 place-items-center rounded-full border border-stone-200 text-sm font-bold text-stone-500 sm:grid">
                        {completed ? (
                          <CheckCircle
                            className="size-5 text-teal-700"
                            weight="fill"
                          />
                        ) : (
                          lessonIndex + 1
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-jp text-sm font-semibold text-teal-700">
                            {lesson.japaneseTitle}
                          </p>
                          {locked && (
                            <LockSimple className="size-3.5 text-stone-400" />
                          )}
                        </div>
                        <h3 className="mt-1 font-semibold text-stone-950">
                          {lesson.title}
                        </h3>
                        <p className="mt-1 text-sm leading-5 text-stone-500">
                          {lesson.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <span className="text-xs font-semibold text-stone-400">
                          {lesson.estimatedMinutes} phút
                        </span>
                        {lesson.status === "in_progress" ? (
                          <PlayCircle
                            className="size-6 text-teal-700"
                            weight="fill"
                          />
                        ) : (
                          <ArrowRight className="size-5 text-stone-300 transition group-hover:translate-x-1 group-hover:text-stone-600" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
