"use client";

import { useState, useTransition } from "react";
import {
  ArrowCounterClockwise,
  Check,
  Eye,
  X,
} from "@phosphor-icons/react";

import { saveReviewRating } from "@/app/review/actions";
import type { VocabularyCard } from "@/lib/learning/types";

export function ReviewDeck({ cards }: { cards: VocabularyCard[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const [isPending, startTransition] = useTransition();

  if (!cards.length) {
    return (
      <div className="rounded-[28px] border border-stone-200 bg-white p-8 text-center text-stone-500">
        Hôm nay chưa có thẻ nào đến hạn.
      </div>
    );
  }

  if (done >= cards.length) {
    return (
      <div className="rounded-[30px] border border-stone-200 bg-white p-8 text-center sm:p-12">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#e5f1ed] text-teal-800">
          <Check className="size-8" weight="bold" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-stone-950">
          Xong phiên ôn hôm nay
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          Bạn đã xử lý {cards.length} thẻ. Ngày mai hệ thống sẽ ưu tiên những
          mục bạn thấy khó.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(0);
            setIndex(0);
            setRevealed(false);
          }}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-stone-200 px-5 text-sm font-bold text-stone-700 hover:bg-stone-50"
        >
          <ArrowCounterClockwise className="size-4" /> Ôn lại phiên này
        </button>
      </div>
    );
  }

  const card = cards[index % cards.length];

  function rate(rating: "again" | "hard" | "good") {
    startTransition(async () => {
      await saveReviewRating(card.id, rating);
      setDone((value) => value + 1);
      setIndex((value) => value + 1);
      setRevealed(false);
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-xs font-semibold text-stone-500">
        <span>
          {done + 1} / {cards.length}
        </span>
        <span>{isPending ? "Đang lưu…" : "Nhớ nghĩa trước khi lật thẻ"}</span>
      </div>
      <div className="min-h-[390px] rounded-[32px] border border-stone-200 bg-white p-7 shadow-[0_18px_60px_rgba(63,48,31,0.07)] sm:p-10">
        <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
          <p className="font-jp text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
            {card.expression}
          </p>
          <p className="mt-3 font-jp text-base text-teal-700">
            {card.reading}
          </p>
          {revealed ? (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-xl font-semibold text-stone-900">
                {card.meaning}
              </p>
              {card.example && (
                <div className="mx-auto mt-5 max-w-xl rounded-2xl bg-[#f8f6f0] px-5 py-4">
                  <p className="font-jp text-base text-stone-800">
                    {card.example}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {card.exampleMeaning}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-stone-100 px-5 text-sm font-bold text-stone-700 hover:bg-stone-200"
            >
              <Eye className="size-4" /> Xem đáp án
            </button>
          )}
        </div>
      </div>

      {revealed && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={() => rate("again")}
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 text-sm font-bold text-rose-700 disabled:opacity-50"
          >
            <X className="size-4" weight="bold" /> Quên
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => rate("hard")}
            className="flex min-h-14 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 px-3 text-sm font-bold text-amber-800 disabled:opacity-50"
          >
            Khó
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => rate("good")}
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-teal-200 bg-teal-50 px-3 text-sm font-bold text-teal-800 disabled:opacity-50"
          >
            <Check className="size-4" weight="bold" /> Nhớ
          </button>
        </div>
      )}
    </div>
  );
}
