"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { n5Lessons, type N5Exercise } from "@/lib/learning/n5";
import type { N5Progress } from "@/lib/learning/n5-review";
import { readN5Progress } from "@/lib/learning/n5-review";
import { useN5Progress } from "./use-n5-progress";
import { N5Exercises } from "./n5-exercises";

export function N5Review() {
  const { ready, progress } = useN5Progress();
  if (!ready) return <p className="mt-6">Đang đọc lịch ôn…</p>;
  return <N5ReviewSession initialProgress={progress} />;
}

function N5ReviewSession({ initialProgress }: { initialProgress: N5Progress }) {
  const [progress, setProgress] = useState(initialProgress);
  const [mode, setMode] = useState<"due" | "mixed">("due");
  const [round, setRound] = useState(0);
  const [now, setNow] = useState(Date.now);
  const exercises = useMemo(() => {
    const pool = n5Lessons
      .flatMap((l) => l.exercises)
      .filter(
        (e) =>
          progress.reviews[e.id] &&
          (mode === "mixed" || progress.reviews[e.id].due <= now),
      );
    // Deterministic interleaving makes each refresh reproducible and avoids lesson order.
    function order(e: N5Exercise) {
      return Array.from(e.id).reduce(
        (h, c) => (h * 31 + c.charCodeAt(0)) >>> 0,
        round + 1,
      );
    }
    return pool.sort((a, b) => order(a) - order(b)).slice(0, 20);
  }, [progress, mode, round, now]);
  return (
    <>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          className="rounded-full border border-stone-300 px-5 py-3 text-sm"
          onClick={() => {
            setProgress(readN5Progress());
            setNow(Date.now());
            setMode("due");
            setRound((r) => r + 1);
          }}
        >
          Câu đến hạn
        </button>
        <button
          className="rounded-full border border-stone-300 px-5 py-3 text-sm"
          onClick={() => {
            setProgress(readN5Progress());
            setNow(Date.now());
            setMode("mixed");
            setRound((r) => r + 1);
          }}
        >
          Luyện xen kẽ bài đã học
        </button>
      </div>
      {exercises.length ? (
        <N5Exercises key={`${mode}-${round}`} exercises={exercises} />
      ) : (
        <div className="mt-6 rounded-2xl bg-teal-50 p-6">
          <p className="font-semibold">Chưa có câu đến hạn trong lượt này.</p>
          <p className="mt-3 text-sm leading-6">
            Học và làm phần Tự kiểm tra để tạo lịch ôn. Nếu vừa quên một câu,
            câu đó sẽ đến hạn sau 10 phút; hãy bấm Câu đến hạn để cập nhật.
          </p>
          <Link
            href="/n5"
            className="mt-4 inline-block font-semibold text-teal-700"
          >
            Chọn bài học →
          </Link>
        </div>
      )}
      <p className="mt-5 text-xs leading-5 text-stone-500">
        Mỗi lượt tối đa 20 câu. Luyện sớm không tăng bậc lịch ôn. Sau lượt này,
        bấm Câu đến hạn để lấy các câu còn lại.
      </p>
    </>
  );
}
