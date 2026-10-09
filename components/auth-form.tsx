import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signIn, signUp, signInWithGoogle, forgotPassword, resendVerification, resetPassword } from "@/app/login/actions";
import type { AuthMode } from "@/lib/auth/validation";

const titles: Record<AuthMode, string> = { login: "Đăng nhập", register: "Tạo tài khoản", forgot: "Quên mật khẩu", resend: "Xác minh email", reset: "Đặt lại mật khẩu" };
const actions = { login: signIn, register: signUp, forgot: forgotPassword, resend: resendVerification, reset: resetPassword };
type Props = { mode: AuthMode; searchParams: Promise<{ message?: string; email?: string }> };
export async function AuthForm({ mode, searchParams }: Props) {
  const { message, email } = await searchParams;
  const configured = isSupabaseConfigured();
  return <main className="grid min-h-screen place-items-center px-4 py-10"><div className="w-full max-w-md">
    <Link href="/" className="mb-6 inline-block text-sm font-medium text-teal-800">← Về trang học</Link>
    <section className="rounded-[30px] border border-stone-200 bg-white p-7 shadow-xl shadow-stone-200/40">
      <div className="grid size-12 place-items-center rounded-2xl bg-[#153f3a] font-jp text-xl text-[#f5d99b]">学</div>
      <h1 className="mt-5 text-3xl font-semibold">{titles[mode]}</h1>
      <p className="mt-2 text-sm text-stone-500">{mode === "login" ? "Đồng bộ tiến độ học tiếng Nhật của bạn." : mode === "register" ? "Tạo tài khoản để lưu hành trình học." : mode === "forgot" ? "Nhận liên kết đặt lại mật khẩu qua email." : mode === "resend" ? "Kiểm tra hộp thư hoặc yêu cầu gửi lại email." : "Nhập mật khẩu mới cho tài khoản."}</p>
      {!configured && <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Supabase chưa được cấu hình. Chế độ demo vẫn sử dụng được.</p>}
      {message && <p role="status" className="mt-5 rounded-xl bg-stone-100 p-3 text-sm text-stone-700">{message}</p>}
      <form action={actions[mode]} className="mt-6 space-y-4">
        {mode === "register" && <label className="block text-sm font-semibold">Tên hiển thị<input name="name" required minLength={2} maxLength={60} autoComplete="name" className="mt-2 h-12 w-full rounded-xl border border-stone-300 px-3" /></label>}
        {mode !== "reset" && <label className="block text-sm font-semibold">Email<input type="email" name="email" defaultValue={email ?? ""} required autoComplete="email" className="mt-2 h-12 w-full rounded-xl border border-stone-300 px-3" /></label>}
        {(mode === "login" || mode === "register" || mode === "reset") && <label className="block text-sm font-semibold">{mode === "reset" ? "Mật khẩu mới" : "Mật khẩu"}<input type="password" name="password" required minLength={mode === "login" ? 1 : 8} maxLength={mode === "login" ? undefined : 72} autoComplete={mode === "login" ? "current-password" : "new-password"} className="mt-2 h-12 w-full rounded-xl border border-stone-300 px-3" /></label>}
        {(mode === "register" || mode === "reset") && <label className="block text-sm font-semibold">Xác nhận mật khẩu<input type="password" name="confirmPassword" required autoComplete="new-password" className="mt-2 h-12 w-full rounded-xl border border-stone-300 px-3" /></label>}
        {(mode === "register" || mode === "reset") && <p className="text-xs leading-5 text-stone-500">Mật khẩu 8–72 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt và không chứa khoảng trắng.</p>}
        <button disabled={!configured} className="h-12 w-full rounded-xl bg-teal-800 font-semibold text-white disabled:opacity-50">{mode === "resend" ? "Gửi lại email" : mode === "forgot" ? "Gửi liên kết" : mode === "reset" ? "Lưu mật khẩu" : titles[mode]}</button>
      </form>
      {mode === "login" && <><form action={signInWithGoogle} className="mt-3"><button disabled={!configured} className="h-12 w-full rounded-xl border border-stone-300 font-semibold disabled:opacity-50">Tiếp tục với Google</button></form><div className="mt-5 flex justify-between text-sm text-teal-800"><Link href="/register">Tạo tài khoản</Link><Link href="/forgot-password">Quên mật khẩu?</Link></div></>}
      {mode !== "login" && <Link href="/login" className="mt-5 block text-center text-sm font-semibold text-teal-800">Quay lại đăng nhập</Link>}
    </section>
  </div></main>;
}
