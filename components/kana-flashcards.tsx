"use client";

import { useMemo, useState } from "react";
import {
  ArrowCounterClockwise,
  Check,
  Eye,
  Shuffle,
  X,
} from "@phosphor-icons/react";

import type { KanaCharacter } from "@/lib/learning/types";

type ScriptFilter = "hiragana" | "katakana";
type StudyMode = "ordered" | "random";

function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

export function KanaFlashcards({ kana }: { kana: KanaCharacter[] }) {
  const [script, setScript] = useState<ScriptFilter>("hiragana");
  const [mode, setMode] = useState<StudyMode | null>(null);
  const [round, setRound] = useState(0);
  const [reviewPool, setReviewPool] = useState<KanaCharacter[] | null>(null);
  const [missedCards, setMissedCards] = useState<KanaCharacter[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const cards = useMemo(() => {
    void round;
    const filtered = reviewPool ?? kana.filter((item) => item.script === script);
    if (reviewPool) return filtered;
    return mode === "random" ? shuffle(filtered) : filtered;
  }, [kana, mode, reviewPool, round, script]);

  const finished = index >= cards.length;
  const card = cards[index];

  function start(nextMode: StudyMode) {
    setMode(nextMode);
    setRound((value) => value + 1);
    setReviewPool(null);
    setMissedCards([]);
    setIndex(0);
    setRevealed(false);
  }

  function reset(nextScript = script) {
    setScript(nextScript);
    setMode(null);
    setReviewPool(null);
    setMissedCards([]);
    setIndex(0);
    setRevealed(false);
  }

  function answer(result: "known" | "missed") {
    const nextMissed =
      result === "missed"
        ? missedCards.some(
            (item) =>
              item.script === card.script && item.character === card.character,
          )
          ? missedCards
          : [...missedCards, card]
        : missedCards;

    if (result === "missed") {
      setMissedCards(nextMissed);
    }

    setRevealed(false);

    const isLastCard = index + 1 >= cards.length;
    if (!isLastCard) {
      setIndex((value) => value + 1);
      return;
    }

    if (nextMissed.length > 0) {
      setReviewPool(nextMissed);
      setMissedCards([]);
      setIndex(0);
      setRound((value) => value + 1);
      return;
    }

    setIndex(cards.length);
  }

  return (
    <section className="rounded-[28px] border border-stone-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
            Flashcard nhận mặt chữ
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-950">
            Nhìn chữ, tự nhớ cách đọc rồi mới lật thẻ
          </h2>
        </div>

        {mode && (
          <div className="flex flex-col gap-2 sm:items-end">
          <div className="grid grid-cols-2 rounded-2xl bg-stone-100 p-1 text-sm font-bold">
            <button
              type="button"
              onClick={() => reset("hiragana")}
              className={`rounded-xl px-4 py-2 transition ${
                script === "hiragana"
                  ? "bg-white text-teal-800 shadow-sm"
                  : "text-stone-500"
              }`}
            >
              Hiragana
            </button>
            <button
              type="button"
              onClick={() => reset("katakana")}
              className={`rounded-xl px-4 py-2 transition ${
                script === "katakana"
                  ? "bg-white text-teal-800 shadow-sm"
                  : "text-stone-500"
              }`}
            >
              Katakana
            </button>
          </div>
        </div>
        )}
      </div>

      {!mode ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => start("ordered")}
            className="rounded-[28px] border border-stone-200 bg-[#fffefa] p-7 text-left transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-sm"
          >
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              Mode 1
            </span>
            <span className="mt-3 block text-xl font-semibold text-stone-950">
              Theo tuần tự
            </span>
            <span className="mt-2 block text-sm leading-6 text-stone-500">
              Học lần lượt từ あ → い → う... theo đúng thứ tự bảng chữ cái.
            </span>
          </button>

          <button
            type="button"
            onClick={() => start("random")}
            className="rounded-[28px] border border-stone-200 bg-[#fffefa] p-7 text-left transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-sm"
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              <Shuffle className="size-4" /> Mode 2
            </span>
            <span className="mt-3 block text-xl font-semibold text-stone-950">
              Ngẫu nhiên
            </span>
            <span className="mt-2 block text-sm leading-6 text-stone-500">
              Xáo 46 chữ để kiểm tra khả năng nhận mặt chữ thật sự.
            </span>
          </button>
        </div>
      ) : finished ? (
        <div className="mt-6 rounded-[28px] bg-[#fbfaf6] p-8 text-center sm:p-10">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#e5f1ed] text-teal-800">
            <Check className="size-8" weight="bold" />
          </div>
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-stone-950">
            Hoàn thành phiên học
          </h3>
          <p className="mt-2 text-sm text-stone-500">
            Bạn đã nhớ hết các chữ trong phiên này.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => reset(script)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-stone-200 bg-white px-5 text-sm font-bold text-stone-700 hover:bg-stone-50"
            >
              <ArrowCounterClockwise className="size-4" /> Chọn mode và học lại
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>
              {index + 1} / {cards.length}
            </span>
            <span>
              {reviewPool
                ? `Đang ôn tuần tự ${reviewPool.length} chữ chưa thuộc`
                : mode === "random"
                  ? "Mode ngẫu nhiên"
                  : "Mode tuần tự"}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-teal-700 transition-all"
              style={{ width: `${((index + (revealed ? 0.5 : 0)) / cards.length) * 100}%` }}
            />
          </div>

          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            className="mt-5 flex min-h-[360px] w-full flex-col items-center justify-center rounded-[32px] border border-stone-200 bg-[#fffefa] p-8 text-center shadow-[0_18px_60px_rgba(63,48,31,0.07)] transition hover:border-stone-300 sm:min-h-[420px]"
          >
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
              {revealed ? "Cách đọc" : "Bạn đọc chữ này là gì?"}
            </span>
            <span className="mt-7 font-jp text-8xl font-semibold leading-none text-stone-950 sm:text-9xl">
              {card.character}
            </span>
            {revealed ? (
              <span className="mt-8 text-3xl font-bold tracking-tight text-teal-800">
                {card.romaji}
              </span>
            ) : (
              <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-stone-100 px-5 py-3 text-sm font-bold text-stone-600">
                <Eye className="size-4" /> Chạm để xem đáp án
              </span>
            )}
          </button>

          {revealed && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => answer("missed")}
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700"
              >
                <X className="size-4" weight="bold" /> Chưa nhớ
              </button>
              <button
                type="button"
                onClick={() => answer("known")}
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-teal-200 bg-teal-50 px-4 text-sm font-bold text-teal-800"
              >
                <Check className="size-4" weight="bold" /> Nhớ rồi
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
