"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { n5Lessons } from "@/lib/learning/n5";
import {
  emptyN5Progress,
  N5_PROGRESS_EVENT,
  readN5Progress,
} from "@/lib/learning/n5-review";

export function N5CourseProgress() {
  const [progress, setProgress] = useState(emptyN5Progress);
  const [now, setNow] = useState(0);
  useEffect(() => {
    function refresh() {
      setProgress(readN5Progress());
      setNow(Date.now());
    }
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener("storage", refresh);
    window.addEventListener(N5_PROGRESS_EVENT, refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(N5_PROGRESS_EVENT, refresh);
    };
  }, []);
  const due = Object.values(progress.reviews).filter(
    (r) => r.due <= now,
  ).length;
  const next = n5Lessons.find((l) => !progress.completed.includes(l.slug));
  return (
    <section className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-semibold text-teal-900">
          Đã học {progress.completed.length}/25 bài · {due} câu đến hạn
        </p>
        <Link
          href="/n5/on-tap"
          className="rounded-full bg-teal-800 px-5 py-3 text-sm font-semibold text-white"
        >
          Ôn tập hôm nay →
        </Link>
      </div>
      {next && (
        <Link
          href={`/n5/${next.slug}`}
          className="mt-3 inline-block text-sm text-teal-800"
        >
          Bài tiếp theo: {next.title} →
        </Link>
      )}
      <p className="mt-3 text-xs leading-5 text-stone-500">
        Tiến độ N5 và lịch ôn lưu trên trình duyệt này. Ôn lại sau 1, 3, 7, 14,
        30 ngày; câu quên quay lại sau 10 phút. Chưa đồng bộ giữa thiết bị.
      </p>
    </section>
  );
}
