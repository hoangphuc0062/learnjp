"use client";

import { useState } from "react";
import type { N5Exercise } from "@/lib/learning/n5";
import { normalizeN5Answer } from "@/lib/learning/n5";
import {
  readN5Progress,
  saveN5Progress,
  scheduleN5Review,
} from "@/lib/learning/n5-review";
import { N5Audio } from "./n5-audio";
import { N5Illustration } from "./n5-illustration";

export function N5Exercises({
  exercises,
  onMastered,
}: {
  exercises: N5Exercise[];
  onMastered?: () => void;
}) {
  const [pool, setPool] = useState(exercises);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<
    "correct" | "incorrect" | "revealed" | null
  >(null);
  const [missed, setMissed] = useState<N5Exercise[]>([]);
  const [finished, setFinished] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const exercise = pool[index];
  function evaluate(reveal = false) {
    const correct =
      !reveal &&
      exercise.answers.some(
        (a) => normalizeN5Answer(a) === normalizeN5Answer(answer),
      );
    setResult(reveal ? "revealed" : correct ? "correct" : "incorrect");
    if (!correct)
      setMissed((items) =>
        items.some((i) => i.id === exercise.id) ? items : [...items, exercise],
      );
    const progress = readN5Progress();
    progress.reviews[exercise.id] = scheduleN5Review(
      progress.reviews[exercise.id],
      correct,
    );
    setStorageError(!saveN5Progress(progress));
  }
  function next() {
    setAnswer("");
    setResult(null);
    if (index + 1 < pool.length) {
      setIndex(index + 1);
      return;
    }
    if (missed.length) {
      setPool(missed);
      setMissed([]);
      setIndex(0);
      return;
    }
    setFinished(true);
    onMastered?.();
  }
  if (!exercises.length)
    return <p className="mt-5 text-stone-600">Chưa có câu cần ôn.</p>;
  if (finished)
    return (
      <div role="status" className="mt-6 rounded-2xl bg-teal-50 p-6">
        <h3 className="text-xl font-semibold text-teal-900">
          Bạn đã tự trả lời được cả lượt này.
        </h3>
        <p className="mt-3 leading-6 text-stone-600">
          Ngày mai thử lại trước khi đọc bài. Nhớ đúng hôm nay là bước đầu; nhớ
          lại sau vài ngày giúp kiểm tra độ bền của trí nhớ.
        </p>
        {storageError && (
          <p className="mt-3 text-red-700">
            Trình duyệt chưa lưu được lịch ôn.
          </p>
        )}
      </div>
    );
  return (
    <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-5 sm:p-7">
      <p className="text-xs font-semibold text-teal-700">
        CÂU {index + 1}/{pool.length} ·{" "}
        {exercise.kind === "vocabulary"
          ? "GỌI TÊN HÌNH"
          : exercise.kind === "listening"
            ? "NGHE HIỂU"
            : exercise.kind === "reading"
              ? "ĐỌC HIỂU"
              : exercise.kind === "order"
                ? "SẮP XẾP CÂU"
                : "TỰ NHỚ MẪU CÂU"}
      </p>
      {exercise.illustration !== undefined && (
        <div className="mx-auto mt-5 max-w-48">
          <N5Illustration
            tile={exercise.illustration}
            label={exercise.prompt}
          />
        </div>
      )}
      {exercise.passage && (
        <p
          lang="ja"
          className="mt-5 rounded-2xl bg-stone-50 p-5 font-jp text-xl leading-10"
        >
          {exercise.passage}
        </p>
      )}
      {exercise.audio && (
        <div className="mt-5">
          <N5Audio src={exercise.audio} text="từ trong bài tập nghe" />
        </div>
      )}
      <h3 className="mt-5 text-xl font-semibold leading-8">
        {exercise.prompt}
      </h3>
      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!result && answer.trim()) evaluate();
        }}
      >
        {exercise.choices ? (
          <fieldset className="grid gap-3">
            <legend className="mb-3 text-sm text-stone-600">
              Chọn một đáp án
            </legend>
            {exercise.choices.map((choice) => (
              <label
                key={choice}
                className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${answer === choice ? "border-teal-600 bg-teal-50" : "border-stone-200"}`}
              >
                <input
                  type="radio"
                  name="n5-choice"
                  value={choice}
                  checked={answer === choice}
                  disabled={!!result}
                  onChange={() => setAnswer(choice)}
                />
                {choice}
              </label>
            ))}
          </fieldset>
        ) : (
          <>
            <label htmlFor="n5-answer" className="text-sm text-stone-600">
              Đáp án tiếng Nhật (kanji hoặc cách đọc với câu từ vựng)
            </label>
            <input
              id="n5-answer"
              autoComplete="off"
              value={answer}
              disabled={!!result}
              onChange={(e) => setAnswer(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 px-4 font-jp text-xl disabled:bg-stone-50"
            />
          </>
        )}
        {!result && (
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              disabled={!answer.trim()}
              className="rounded-full bg-teal-800 px-6 py-3 font-semibold text-white disabled:opacity-40"
            >
              Kiểm tra
            </button>
            <button
              type="button"
              onClick={() => evaluate(true)}
              className="rounded-full border border-stone-300 px-5 py-3 text-stone-600"
            >
              Chưa nhớ · xem giải thích
            </button>
          </div>
        )}
      </form>
      {result && (
        <div
          aria-live="polite"
          className={`mt-5 rounded-2xl p-5 ${result === "correct" ? "bg-teal-50" : "bg-amber-50"}`}
        >
          <p className="font-semibold">
            {result === "correct"
              ? "Đúng rồi."
              : "Câu này sẽ quay lại để bạn tự nhớ."}
          </p>
          <p className="mt-2 font-jp text-xl">
            {exercise.answers.join(" ／ ")}
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-700">
            {exercise.explanation}
          </p>
          <button
            type="button"
            onClick={next}
            className="mt-4 rounded-full bg-teal-800 px-6 py-3 font-semibold text-white"
          >
            Tiếp tục →
          </button>
        </div>
      )}
      {storageError && (
        <p role="status" className="mt-3 text-sm text-red-700">
          Chưa lưu được lịch ôn. Kiểm tra quyền lưu dữ liệu của trình duyệt.
        </p>
      )}
    </section>
  );
}
