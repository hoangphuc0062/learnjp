"use client";

import { useEffect, useRef, useState } from "react";
import { SpeakerHigh } from "@phosphor-icons/react";
import { publicCourseAsset } from "@/lib/supabase/storage";

export function N5Audio({ src, text }: { src: string; text: string }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState(false);
  useEffect(
    () => () => {
      audio.current?.pause();
    },
    [],
  );
  async function play(slow: boolean) {
    audio.current?.pause();
    // Stop other word/phrase players so pronunciation does not overlap.
    document.querySelectorAll("audio").forEach((player) => player.pause());
    if (!audio.current) return;
    audio.current.currentTime = 0;
    audio.current.playbackRate = slow ? 0.75 : 1;
    try {
      await audio.current.play();
      setError(false);
    } catch {
      setError(true);
    }
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <audio ref={audio} src={publicCourseAsset(src)} preload="none" />
      <button
        type="button"
        onClick={() => play(false)}
        aria-label={`Nghe: ${text}`}
        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-teal-50 px-4 text-sm font-semibold text-teal-800"
      >
        <SpeakerHigh size={18} /> Nghe
      </button>
      <button
        type="button"
        onClick={() => play(true)}
        aria-label={`Nghe chậm: ${text}`}
        className="min-h-10 rounded-full border border-stone-200 px-4 text-sm text-stone-600"
      >
        Chậm
      </button>
      {error && (
        <span role="status" className="text-xs text-red-700">
          Chưa phát được âm thanh. Bấm nghe để thử lại.
        </span>
      )}
    </div>
  );
}
