import Link from "next/link";
import { ArrowRight, Fire, Sparkle } from "@phosphor-icons/react/dist/ssr";

import { AppShell } from "@/components/app-shell";
import { ProgressRing } from "@/components/progress-ring";
import { getDashboardData } from "@/lib/learning/data";

export const instant = false;

export default async function HomePage() {
  const data = await getDashboardData();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold tracking-wide text-teal-700">
              こんにちは、{data.displayName}
            </p>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-4xl">
              Hôm nay mình học một chút,
              <span className="block font-jp font-normal text-stone-500">
                毎日、少しずつ。
              </span>
            </h1>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm sm:flex">
            <Fire weight="fill" className="size-4 text-orange-500" />
            {data.streakDays} ngày
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.45fr_0.75fr]">
          <div className="overflow-hidden rounded-[28px] bg-[#153f3a] p-6 text-white shadow-[0_18px_60px_rgba(21,63,58,0.16)] sm:p-8">
            <div className="flex h-full flex-col justify-between gap-8 sm:flex-row sm:items-end">
              <div className="max-w-xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-teal-50">
                  <Sparkle weight="fill" className="size-4" />
                  Bài tiếp theo · {data.nextLesson.level}
                </div>
                <p className="mb-2 font-jp text-4xl leading-none text-[#f4d9a9] sm:text-5xl">
                  {data.nextLesson.japaneseTitle}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {data.nextLesson.title}
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-teal-50/75 sm:text-base">
                  {data.nextLesson.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium text-teal-50/80">
                  <span>{data.nextLesson.estimatedMinutes} phút</span>
                  <span>•</span>
                  <span>{data.nextLesson.itemCount} mục học</span>
                </div>
              </div>

              <Link
                href={`/learn/${data.nextLesson.slug}`}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#f5d99b] px-6 text-sm font-bold text-[#153f3a] transition hover:-translate-y-0.5 hover:bg-[#ffe4a9]"
              >
                Học tiếp
                <ArrowRight className="size-4" weight="bold" />
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_14px_50px_rgba(63,48,31,0.06)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-stone-500">
                  Mục tiêu hôm nay
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-stone-950">
                  {data.completedMinutes}/{data.dailyGoalMinutes} phút
                </p>
              </div>
              <ProgressRing
                value={data.dailyProgress}
                label={`${data.dailyProgress}%`}
              />
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-teal-700 transition-all"
                style={{ width: `${data.dailyProgress}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-500">
              {data.dailyProgress >= 100
                ? "Đã hoàn thành mục tiêu. Có thể ôn nhẹ thêm nếu bạn còn thời gian."
                : `Còn ${Math.max(data.dailyGoalMinutes - data.completedMinutes, 0)} phút để chạm mục tiêu hôm nay.`}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/review"
            className="group rounded-[24px] border border-stone-200 bg-[#fffaf0] p-5 transition hover:-translate-y-0.5 hover:border-amber-300"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-stone-500">
                Ôn đến hạn
              </span>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                SRS
              </span>
            </div>
            <p className="text-4xl font-semibold tracking-tight text-stone-950">
              {data.dueReviewCount}
            </p>
            <p className="mt-2 text-sm text-stone-500">
              từ và mẫu câu cần gặp lại
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-stone-900">
              Ôn ngay
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </Link>

          <div className="rounded-[24px] border border-stone-200 bg-white p-5">
            <p className="text-sm font-semibold text-stone-500">Tuần này</p>
            <p className="mt-6 text-4xl font-semibold tracking-tight text-stone-950">
              {data.weekMinutes}
            </p>
            <p className="mt-2 text-sm text-stone-500">
              phút tập trung học tiếng Nhật
            </p>
            <div
              className="mt-5 flex h-9 items-end gap-1.5"
              aria-label="Hoạt động 7 ngày"
            >
              {data.weekActivity.map((value, index) => (
                <div key={index} className="flex flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-teal-700/80"
                    style={{ height: `${Math.max(value, 8)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/progress"
            className="group rounded-[24px] border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal-300"
          >
            <p className="text-sm font-semibold text-stone-500">Lộ trình N5</p>
            <div className="mt-6 flex items-end justify-between gap-3">
              <p className="text-4xl font-semibold tracking-tight text-stone-950">
                {data.courseProgress}%
              </p>
              <p className="pb-1 text-xs font-medium text-stone-400">
                {data.completedLessons}/{data.totalLessons} bài
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-teal-700"
                style={{ width: `${data.courseProgress}%` }}
              />
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-stone-900">
              Xem tiến độ
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                Lộ trình hiện tại
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-950">
                Từ zero đến N5
              </h2>
            </div>
            <Link
              href="/learn"
              className="text-sm font-bold text-stone-600 hover:text-stone-950"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid gap-3">
            {data.units.slice(0, 3).map((unit) => (
              <div
                key={unit.slug}
                className="flex items-center gap-4 rounded-[22px] border border-stone-200 bg-white p-4 sm:p-5"
              >
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-stone-100 font-jp text-xl text-stone-800">
                  {unit.symbol}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate font-semibold text-stone-950">
                      {unit.title}
                    </h3>
                    <span className="shrink-0 text-xs font-semibold text-stone-400">
                      {unit.progress}%
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-stone-500">
                    {unit.description}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-teal-700"
                      style={{ width: `${unit.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
