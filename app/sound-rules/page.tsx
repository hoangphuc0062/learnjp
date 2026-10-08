import { AppShell } from "@/components/app-shell";
import { getSoundRuleKana } from "@/lib/learning/data";

export const metadata = { title: "Quy tắc âm tiếng Nhật" };
export const instant = false;

const examples = {
  sokuon: [
    ["がっこう", "gakkou", "trường học"],
    ["きって", "kitte", "tem thư"],
    ["ベッド", "beddo", "giường"],
  ],
  longVowel: [
    ["おばさん", "obasan", "cô / dì"],
    ["おばあさん", "obaasan", "bà"],
    ["ケーキ", "keeki", "bánh kem"],
    ["スーパー", "suupaa", "siêu thị"],
  ],
};

export default async function SoundRulesPage() {
  const kana = await getSoundRuleKana();
  const dakuten = kana.filter((item) => item.category === "dakuten");
  const handakuten = kana.filter((item) => item.category === "handakuten");

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-9">
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Phát âm nền tảng</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-4xl">Biến âm, âm ngắt và trường âm</h1>
          <p className="mt-3 text-sm leading-6 text-stone-500 sm:text-base">
            Đây là ba nhóm quy tắc làm cách đọc thay đổi rõ rệt dù mặt chữ chỉ thêm một dấu hoặc một ký tự nhỏ.
          </p>
        </header>

        <div className="mt-8 grid gap-5">
          <section className="rounded-[28px] border border-stone-200 bg-white p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">01 · Biến âm</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950">Dakuten ゛và Handakuten ゜</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-500">
              Dakuten làm đổi hàng K→G, S→Z, T→D, H→B. Handakuten đổi hàng H→P.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[...dakuten, ...handakuten]
                .filter((item) => item.script === "hiragana")
                .map((item) => (
                  <div key={item.character} className="rounded-2xl border border-stone-200 bg-[#fffefa] p-4 text-center">
                    <div className="font-jp text-4xl font-semibold text-stone-950">{item.character}</div>
                    <div className="mt-2 text-sm font-bold text-teal-700">{item.romaji}</div>
                  </div>
                ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-stone-200 bg-white p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">02 · Âm ngắt</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950">っ / ッ · Sokuon</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-500">
              Chữ っ hoặc ッ nhỏ tạo một nhịp ngắt ngắn và làm phụ âm ngay sau được nhân đôi khi viết romaji.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {examples.sokuon.map(([jp, romaji, meaning]) => (
                <div key={jp} className="rounded-2xl bg-[#fbfaf6] p-5">
                  <div className="font-jp text-3xl font-semibold text-stone-950">{jp}</div>
                  <div className="mt-2 font-semibold text-teal-700">{romaji}</div>
                  <div className="mt-1 text-sm text-stone-500">{meaning}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-stone-200 bg-white p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">03 · Trường âm</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950">Kéo dài nguyên âm</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-500">
              Trường âm kéo dài nguyên âm thêm một nhịp. Hiragana thường dùng nguyên âm bổ sung như あ・い・う; Katakana thường dùng dấu ー.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {examples.longVowel.map(([jp, romaji, meaning]) => (
                <div key={jp} className="rounded-2xl bg-[#fbfaf6] p-5">
                  <div className="font-jp text-3xl font-semibold text-stone-950">{jp}</div>
                  <div className="mt-2 font-semibold text-teal-700">{romaji}</div>
                  <div className="mt-1 text-sm text-stone-500">{meaning}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Độ dài âm có thể đổi nghĩa: <span className="font-jp font-semibold">おばさん</span> (cô/dì) và <span className="font-jp font-semibold">おばあさん</span> (bà) là hai từ khác nhau.
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
