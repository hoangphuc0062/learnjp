import { AppShell } from "@/components/app-shell";
import { ReviewDeck } from "@/components/review-deck";
import { getReviewCards } from "@/lib/learning/data";

export const metadata = { title: "Ôn tập" };
export const instant = false;

export default async function ReviewPage() {
  const cards = await getReviewCards();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-9">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Ôn tập cách quãng
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-4xl">
            Nhớ lâu bằng cách gặp lại đúng lúc
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base">
            Tự nhớ câu trả lời trước, sau đó lật thẻ và đánh giá đúng cảm giác
            của bạn.
          </p>
        </header>
        <ReviewDeck cards={cards} />
      </div>
    </AppShell>
  );
}
