"use client";

import Link from "next/link";
import { useState } from "react";
import type { N5Lesson } from "@/lib/learning/n5";
import { readN5Progress, saveN5Progress } from "@/lib/learning/n5-review";
import { useN5Progress } from "./use-n5-progress";
import { N5Audio } from "./n5-audio";
import { N5Exercises } from "./n5-exercises";
import { N5Illustration } from "./n5-illustration";

const steps = [
  "Hiểu mẫu câu",
  "Nhớ từ qua hình",
  "Tự kiểm tra",
  "Dùng vào thực tế",
];

export function N5Study({
  lesson,
  previous,
  next,
}: {
  lesson: N5Lesson;
  previous?: string;
  next?: string;
}) {
  const [step, setStep] = useState(0);
  const [visibleWords, setVisibleWords] = useState<string[]>([]);
  const [mastered, setMastered] = useState(false);
  const { progress } = useN5Progress();
  const [draftOverride, setDraftOverride] = useState<string | null>(null);
  const draft = draftOverride ?? progress.drafts[lesson.slug] ?? "";
  const [selfChecked, setSelfChecked] = useState(false);
  const completed = progress.completed.includes(lesson.slug);
  const [message, setMessage] = useState("");
  function saveDraft(value: string) {
    setDraftOverride(value);
    setSelfChecked(false);
    const p = readN5Progress();
    p.drafts[lesson.slug] = value;
    if (!saveN5Progress(p))
      setMessage("Chưa lưu được câu tự viết trên trình duyệt.");
  }
  function complete() {
    const p = readN5Progress();
    if (!p.completed.includes(lesson.slug)) p.completed.push(lesson.slug);
    if (saveN5Progress(p)) {
      setMessage("Đã lưu bài học và lịch ôn trên trình duyệt này.");
    } else
      setMessage(
        "Chưa lưu được. Hãy kiểm tra quyền lưu dữ liệu của trình duyệt.",
      );
  }
  return (
    <>
      <header className="mt-6 rounded-[28px] bg-[#153f3a] p-7 text-white sm:p-9">
        <p className="font-jp text-2xl text-[#f5d99b]">
          {lesson.japaneseTitle}
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{lesson.title}</h1>
        <p className="mt-4 leading-7 text-teal-50/85">{lesson.intro}</p>
        <p className="mt-4 text-xs text-teal-50/60">
          25 phút · 5 phút hiểu · 7 phút từ vựng · 8 phút tự nhớ · 5 phút vận
          dụng
        </p>
      </header>
      {previous && (
        <aside className="mt-5 rounded-2xl bg-amber-50 p-5 text-sm leading-6">
          <strong>Nhớ lại trước khi học mới:</strong> không xem tài liệu, nói 2
          mẫu câu và 3 từ của bài trước. Chỗ chưa nhớ mới mở lại.{" "}
          <Link
            className="font-semibold text-teal-700"
            href={`/n5/${previous}`}
          >
            Xem bài trước →
          </Link>
        </aside>
      )}
      <nav
        aria-label="Các phần bài học"
        className="my-6 grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {steps.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-current={step === i ? "step" : undefined}
            onClick={() => setStep(i)}
            className={`min-h-12 rounded-xl px-3 py-3 text-sm font-semibold ${step === i ? "bg-teal-800 text-white" : "border border-stone-200 bg-white text-stone-600"}`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </nav>
      {step === 0 && (
        <section>
          <h2 className="text-2xl font-semibold">
            Hiểu ý trước, nhớ công thức sau
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Đọc tình huống, nhìn ví dụ, rồi che phần giải thích và tự nói mẫu
            câu giúp diễn đạt điều gì.
          </p>
          {lesson.grammar.map((g) => (
            <article
              key={g.pattern}
              className="mt-5 rounded-3xl border border-stone-200 bg-white p-6"
            >
              <h3 className="font-jp text-xl font-semibold text-teal-900">
                {g.pattern}
              </h3>
              <p className="mt-4 leading-7 text-stone-700">{g.explanation}</p>
              <div className="mt-5 border-l-2 border-teal-300 pl-4">
                <p lang="ja" className="font-jp text-xl leading-9">
                  {g.example}
                </p>
                <p className="mb-3 mt-2 text-sm text-stone-500">
                  {g.translation}
                </p>
                <N5Audio src={g.audio} text={g.example} />
              </div>
              <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6">
                <strong>Dễ nhầm:</strong> {g.pitfall}
              </p>
            </article>
          ))}
        </section>
      )}
      {step === 1 && (
        <section>
          <h2 className="text-2xl font-semibold">
            Nhìn hình → nhớ từ → nghe → nói lại
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Thử gọi tên hình trước khi bấm hiện. Nghe một lần, nhắc lại khi âm
            thanh kết thúc; nghe chậm nếu cần, rồi trở về tốc độ thường.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {lesson.vocabulary.map((v) => (
              <article
                key={v.id}
                className="rounded-3xl border border-stone-200 bg-white p-5"
              >
                <div className="mx-auto max-w-56">
                  <N5Illustration tile={v.illustration} label={v.meaning} />
                </div>
                {visibleWords.includes(v.id) ? (
                  <>
                    <p
                      lang="ja"
                      className="mt-5 font-jp text-3xl font-semibold"
                    >
                      {v.expression}
                    </p>
                    <p lang="ja" className="mt-2 font-jp text-teal-700">
                      {v.reading}
                    </p>
                    <p className="my-3 font-semibold">{v.meaning}</p>
                    <N5Audio src={v.audio} text={v.reading} />
                    <p lang="ja" className="mt-4 font-jp text-lg leading-8">
                      {v.example}
                    </p>
                    <p className="my-2 text-sm text-stone-500">
                      {v.exampleMeaning}
                    </p>
                    <N5Audio src={v.exampleAudio} text={v.example} />
                    <button
                      className="mt-4 text-sm font-semibold text-teal-700"
                      onClick={() =>
                        setVisibleWords((a) => a.filter((id) => id !== v.id))
                      }
                    >
                      Che lại để tự nhớ
                    </button>
                  </>
                ) : (
                  <button
                    className="mt-5 min-h-12 w-full rounded-full bg-teal-50 font-semibold text-teal-800"
                    onClick={() => setVisibleWords((a) => [...a, v.id])}
                  >
                    Tôi đã thử nhớ · hiện từ và nghe
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
      {/* Keep the exercise session mounted when learners revisit explanations. */}
      <div hidden={step !== 2}>
        <h2 className="text-2xl font-semibold">
          Tự trả lời trước khi xem đáp án
        </h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Gõ đúng phần được hỏi; câu sai hoặc đã xem đáp án sẽ xuất hiện lại
          cuối lượt. Với câu viết tự do ở phần tiếp theo, bạn tự đối chiếu mẫu
          câu.
        </p>
        <N5Exercises
          exercises={lesson.exercises}
          onMastered={() => setMastered(true)}
        />
      </div>
      {step === 3 && (
        <section className="rounded-3xl border border-stone-200 bg-white p-6">
          <h2 className="text-2xl font-semibold">
            Biến mẫu câu thành lời của bạn
          </h2>
          <p className="mt-4 leading-7">{lesson.production}</p>
          <label
            htmlFor="n5-draft"
            className="mt-5 block text-sm font-semibold"
          >
            Câu của tôi
          </label>
          <textarea
            id="n5-draft"
            lang="ja"
            value={draft}
            onChange={(e) => saveDraft(e.target.value)}
            rows={5}
            className="mt-2 w-full rounded-2xl border border-stone-300 p-4 font-jp text-lg"
            placeholder="Viết câu tiếng Nhật ở đây…"
          />
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Đọc to, kiểm tra trợ từ, dạng động từ và nghĩa. Bài tự viết được lưu
            để ôn; hệ thống chưa chấm ngữ pháp tự do.
          </p>
          <label className="mt-4 flex gap-3 text-sm leading-6">
            <input
              type="checkbox"
              checked={selfChecked}
              onChange={(e) => setSelfChecked(e.target.checked)}
            />{" "}
            Tôi đã đọc to và đối chiếu câu của mình với các mẫu trong bài.
          </label>
          <button
            onClick={complete}
            disabled={
              completed || !mastered || draft.trim().length < 5 || !selfChecked
            }
            className="mt-5 rounded-full bg-teal-800 px-6 py-3 font-semibold text-white disabled:opacity-40"
          >
            {completed ? "Đã hoàn thành" : "Hoàn thành và hẹn ôn lại"}
          </button>
          {!mastered && !completed && (
            <p className="mt-3 text-sm text-amber-800">
              Hoàn thành phần Tự kiểm tra trước khi đánh dấu bài đã học.
            </p>
          )}
          <p aria-live="polite" className="mt-3 text-sm text-teal-700">
            {message}
          </p>
        </section>
      )}
      <div className="mt-7 flex justify-between gap-4">
        {step > 0 ? (
          <button
            className="rounded-full border border-stone-300 px-5 py-3 text-sm"
            onClick={() => setStep(step - 1)}
          >
            ← Phần trước
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button
            className="rounded-full bg-[#f5d99b] px-5 py-3 text-sm font-semibold text-teal-950"
            onClick={() => setStep(step + 1)}
          >
            Phần tiếp theo →
          </button>
        ) : (
          next && (
            <Link
              className="rounded-full bg-[#f5d99b] px-5 py-3 text-sm font-semibold text-teal-950"
              href={`/n5/${next}`}
            >
              Bài tiếp theo →
            </Link>
          )
        )}
      </div>
      <p className="mt-7 text-xs text-stone-500">
        Biên soạn từ {lesson.source}. Từ minh hoạ được chọn để luyện mẫu câu;
        phát âm tổng hợp bằng giọng Nhật Kyoko.
      </p>
    </>
  );
}
