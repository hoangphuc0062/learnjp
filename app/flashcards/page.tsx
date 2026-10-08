import { AppShell } from "@/components/app-shell";
import { KanaFlashcards } from "@/components/kana-flashcards";
import { getKana } from "@/lib/learning/data";

export const metadata = { title: "Flashcard Kana" };
export const instant = false;

export default async function FlashcardsPage() {
  const kana = await getKana();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-9">
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Flashcard Kana
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-4xl">
            Luyện nhớ mặt chữ
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-500 sm:text-base">
            Nhìn mặt chữ, tự nhớ cách đọc rồi lật đáp án. Những chữ chưa nhớ sẽ được gom lại để ôn lặp riêng.
          </p>
        </header>

        <div className="mt-8">
          <KanaFlashcards kana={kana} />
        </div>
      </div>
    </AppShell>
  );
}
