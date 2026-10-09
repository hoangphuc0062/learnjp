"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authInputsFromForm, validateAuthInputs, type AuthMode } from "@/lib/auth/validation";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const paths: Record<AuthMode, string> = { login: "/login", register: "/register", forgot: "/forgot-password", resend: "/verify-email", reset: "/reset-password" };
function fail(mode: AuthMode, message: string): never { redirect(`${paths[mode]}?message=${encodeURIComponent(message)}`); }
async function origin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return new URL(process.env.NEXT_PUBLIC_SITE_URL).origin;
  const h = await headers();
  const host = h.get("host");
  if (!host) throw new Error("Missing host");
  return `${h.get("x-forwarded-proto") === "https" || !/^(localhost|127\.0\.0\.1)/.test(host) ? "https" : "http"}://${host}`;
}
function inputs(mode: AuthMode, form: FormData) {
  const values = authInputsFromForm(form);
  const validation = validateAuthInputs(mode, values);
  if (!validation.valid) fail(mode, Object.values(validation.errors)[0] ?? "Dữ liệu không hợp lệ.");
  if (!isSupabaseConfigured()) fail(mode, "Supabase chưa được cấu hình.");
  return values;
}

export async function signIn(formData: FormData) {
  const values = inputs("login", formData);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
  if (error) fail("login", "Email hoặc mật khẩu không đúng, hoặc email chưa được xác minh.");
  redirect("/");
}

export async function signUp(formData: FormData) {
  const values = inputs("register", formData);
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email: values.email, password: values.password, options: { data: { display_name: values.name }, emailRedirectTo: `${await origin()}/auth/callback` } });
  if (error) fail("register", error.message);
  redirect(`/verify-email?email=${encodeURIComponent(values.email)}&message=Kiểm tra email để xác minh tài khoản.`);
}

export async function signInWithGoogle() {
  if (!isSupabaseConfigured()) fail("login", "Supabase chưa được cấu hình.");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${await origin()}/auth/callback` } });
  if (error || !data.url) fail("login", "Không thể kết nối Google.");
  redirect(data.url);
}
export async function forgotPassword(form: FormData) {
  const values = inputs("forgot", form);
  const { error } = await (await createClient()).auth.resetPasswordForEmail(values.email, { redirectTo: `${await origin()}/auth/callback?next=/reset-password` });
  if (error) fail("forgot", "Không thể gửi email lúc này. Vui lòng thử lại sau.");
  fail("forgot", "Nếu email đã đăng ký, bạn sẽ nhận được liên kết đặt lại mật khẩu.");
}
export async function resendVerification(form: FormData) {
  const values = inputs("resend", form);
  const { error } = await (await createClient()).auth.resend({ type: "signup", email: values.email, options: { emailRedirectTo: `${await origin()}/auth/callback` } });
  if (error) fail("resend", "Không thể gửi lại email. Vui lòng thử lại sau.");
  fail("resend", "Nếu cần xác minh, email mới sẽ được gửi đến bạn.");
}
export async function resetPassword(form: FormData) {
  const values = inputs("reset", form);
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) fail("reset", "Phiên đã hết hạn. Hãy yêu cầu liên kết mới.");
  const { error } = await supabase.auth.updateUser({ password: values.password });
  if (error) fail("reset", "Không thể cập nhật mật khẩu.");
  await supabase.auth.signOut();
  redirect("/login?message=Đổi mật khẩu thành công.");
}
export async function signOut() {
  if (isSupabaseConfigured()) await (await createClient()).auth.signOut();
  redirect("/login");
}
