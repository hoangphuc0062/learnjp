import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import { AppShell } from "@/components/app-shell";
import { getKana } from "@/lib/learning/data";
import type { KanaCharacter } from "@/lib/learning/types";

export const metadata = { title: "Bảng chữ cái Nhật" };
export const instant = false;

const rowOrder = ["vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w", "n-final"];
const rowLabels: Record<string, string> = {
  vowel: "あ",
  k: "か",
  s: "さ",
  t: "た",
  n: "な",
  h: "は",
  m: "ま",
  y: "や",
  r: "ら",
  w: "わ",
  "n-final": "ん",
};

function KanaTable({ title, subtitle, kana }: { title: string; subtitle: string; kana: KanaCharacter[] }) {
  const byRow = new Map<string, KanaCharacter[]>();

  kana.forEach((item) => {
    const key = item.rowName ?? "other";
    const current = byRow.get(key) ?? [];
    current.push(item);
    byRow.set(key, current);
  });

  return (
    <section className="overflow-hidden rounded-[28px] border border-stone-200 bg-white">
      <div className="border-b border-stone-100 bg-[#fbfaf6] p-5 sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-stone-950">{title}</h2>
        <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
      </div>

      <div className="overflow-x-auto p-4 sm:p-6">
        <div className="min-w-[620px] space-y-2">
          {rowOrder.map((rowName) => {
            const items = byRow.get(rowName) ?? [];
            if (!items.length) return null;

            return (
              <div key={rowName} className="grid grid-cols-[52px_repeat(5,minmax(92px,1fr))] gap-2">
                <div className="grid min-h-24 place-items-center rounded-2xl bg-stone-100 font-jp text-lg font-semibold text-stone-500">
                  {rowLabels[rowName]}
                </div>
                {items.map((item) => (
                  <div key={item.character} className="grid min-h-24 place-items-center rounded-2xl border border-stone-200 bg-white px-2 py-3 text-center">
                    <div>
                      <div className="font-jp text-3xl font-semibold text-stone-950">{item.character}</div>
                      <div className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-teal-700">{item.romaji}</div>
                    </div>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 5 - items.length) }).map((_, index) => (
                  <div key={`empty-${index}`} className="min-h-24 rounded-2xl border border-dashed border-stone-200 bg-stone-50/50" />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default async function KanaPage() {
  const kana = await getKana();
  const hiragana = kana.filter((item) => item.script === "hiragana");
  const katakana = kana.filter((item) => item.script === "katakana");

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-9">
        <Link href="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-stone-900">
          <ArrowLeft className="size-4" /> Quay lại lộ trình
        </Link>

        <header className="mt-6 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Kana cơ bản</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-4xl">Hiragana & Katakana</h1>
          <p className="mt-3 text-sm leading-6 text-stone-500 sm:text-base">
            92 ký tự cơ bản gồm 46 Hiragana và 46 Katakana. Học theo từng hàng âm để nhớ mặt chữ và romaji nhanh hơn.
          </p>
        </header>

        <div className="mt-8 grid gap-5">
          <KanaTable title="Hiragana · ひらがな" subtitle="Dùng trong từ thuần Nhật, trợ từ và đuôi ngữ pháp." kana={hiragana} />
          <KanaTable title="Katakana · カタカナ" subtitle="Thường dùng cho từ mượn, tên nước ngoài và từ cần nhấn mạnh." kana={katakana} />
        </div>
      </div>
    </AppShell>
  );
}
