"use client";

import { useState, useTransition } from "react";
import { CheckCircle } from "@phosphor-icons/react";

import { completeLesson } from "@/app/learn/[slug]/actions";

export function LessonCompleteButton({
  slug,
  initialCompleted,
}: {
  slug: string;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleComplete() {
    startTransition(async () => {
      const result = await completeLesson(slug);

      if (result.saved) {
        setCompleted(true);
        setMessage("Đã lưu tiến độ.");
        return;
      }

      if (result.mode === "guest") {
        setMessage("Đăng nhập để lưu tiến độ.");
      } else if (result.mode === "demo") {
        setCompleted(true);
        setMessage("Demo mode: tiến độ chỉ hiển thị tạm thời.");
      } else {
        setMessage("Chưa lưu được. Hãy thử lại.");
      }
    });
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <button
        type="button"
        onClick={handleComplete}
        disabled={isPending || completed}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#f5d99b] px-6 text-sm font-bold text-[#153f3a] transition hover:bg-[#ffe4a9] disabled:cursor-default disabled:opacity-70"
      >
        <CheckCircle className="size-5" weight="fill" />
        {isPending
          ? "Đang lưu…"
          : completed
            ? "Đã hoàn thành"
            : "Hoàn thành bài"}
      </button>
      {message && (
        <p className="text-right text-xs font-medium text-stone-500">
          {message}
        </p>
      )}
    </div>
  );
}
