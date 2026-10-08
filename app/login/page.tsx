import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signIn, signUp } from "./actions";

export const metadata = { title: "Đăng nhập" };
export const instant = false;

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const { message } = await searchParams;
  const configured = isSupabaseConfigured();
  const notice =
    message === "demo"
      ? "Chưa gắn Supabase nên ứng dụng đang chạy ở chế độ demo."
      : message === "created"
        ? "Đã tạo tài khoản. Bạn có thể đăng nhập sau khi xác nhận email nếu project yêu cầu."
        : message;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="size-4" /> Về trang học
        </Link>
        <div className="rounded-[30px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_rgba(63,48,31,0.08)] sm:p-8">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#153f3a] font-jp text-xl font-semibold text-[#f5d99b]">
            学
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-stone-950">
            Đồng bộ hành trình học
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            Đăng nhập để lưu tiến độ, lịch ôn và tiếp tục trên thiết bị khác.
          </p>

          {!configured && (
            <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              Supabase chưa được cấu hình. Bạn vẫn có thể dùng toàn bộ giao diện
              với dữ liệu demo.
            </div>
          )}
          {notice && configured && (
            <div className="mt-5 rounded-2xl bg-stone-100 px-4 py-3 text-sm text-stone-700">
              {notice}
            </div>
          )}

          <form className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-stone-700">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 font-normal outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                placeholder="ban@example.com"
              />
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              Mật khẩu
              <input
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="current-password"
                className="mt-2 h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 font-normal outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                placeholder="Tối thiểu 6 ký tự"
              />
            </label>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                formAction={signIn}
                className="h-12 rounded-2xl bg-teal-800 px-4 text-sm font-bold text-white hover:bg-teal-900"
              >
                Đăng nhập
              </button>
              <button
                formAction={signUp}
                className="h-12 rounded-2xl border border-stone-200 px-4 text-sm font-bold text-stone-700 hover:bg-stone-50"
              >
                Tạo tài khoản
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
