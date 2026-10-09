import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { N5CourseProgress } from "@/components/n5-course-progress";
import { n5Lessons, n5Stages } from "@/lib/learning/n5";

export const metadata = { title: "Giáo trình N5 · Học sâu, nhớ lâu" };

export default function N5Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 pb-28 pt-8 sm:px-8">
        <Link href="/learn" className="text-sm font-semibold text-teal-700">
          ← Lộ trình học
        </Link>
        <header className="mt-6 rounded-[28px] bg-[#153f3a] p-7 text-white sm:p-10">
          <p className="text-sm text-[#f5d99b]">GIÁO TRÌNH N5 · 25 BÀI</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Hiểu để dùng. Ôn để nhớ.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-teal-50/85">
            Mỗi buổi học khoảng 25 phút: nhớ lại bài cũ, hiểu mẫu câu, nghe và
            gọi tên hình, tự trả lời, rồi đặt câu về cuộc sống của bạn.
          </p>
        </header>
        <N5CourseProgress />
        <section className="my-8 rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="font-semibold">Mới bắt đầu? Học chữ và âm trước</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Học từng hàng, nghe, đọc và viết từ trí nhớ. Sau đó học trường âm,
            âm ngắt và âm ghép trước Bài 01.
          </p>
          <div className="mt-3 flex flex-wrap gap-5 text-sm font-semibold text-teal-700">
            <Link href="/kana">Hiragana & Katakana →</Link>
            <Link href="/sound-rules">Quy tắc âm →</Link>
            <Link href="/flashcards">Tự kiểm tra chữ →</Link>
          </div>
        </section>
        {n5Stages.map((stage) => (
          <section key={stage.title} className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">{stage.title}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {n5Lessons.slice(stage.start, stage.end).map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={`/n5/${lesson.slug}`}
                  className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-teal-600"
                >
                  <p className="font-jp text-sm text-teal-700">
                    {lesson.japaneseTitle} · {lesson.estimatedMinutes} phút
                  </p>
                  <h3 className="mt-2 font-semibold">{lesson.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    {lesson.description}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-teal-700">
                    {lesson.grammar.length} mẫu câu · {lesson.exercises.length}{" "}
                    câu luyện + tự đặt câu →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
        <p className="mt-8 text-sm leading-6 text-stone-500">
          Biên soạn theo thứ tự bài trong giáo trình bạn cung cấp. Các từ minh
          hoạ là nhóm từ trọng tâm để bắt đầu, chưa phải toàn bộ danh sách từ và
          kanji trong bản gốc. Sau mỗi chặng 5 bài, ôn xen kẽ câu của các bài đã
          học.
        </p>
      </div>
    </AppShell>
  );
}
