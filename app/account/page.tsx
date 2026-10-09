import Link from "next/link";
export const instant = false;
import { redirect } from "next/navigation";
import { signOut } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
export default async function AccountPage() {
  if (!isSupabaseConfigured()) redirect("/login");
  const { data: { user } } = await (await createClient()).auth.getUser();
  if (!user) redirect("/login");
  return <main className="mx-auto max-w-xl px-5 py-20"><Link href="/" className="text-teal-800">← Về trang học</Link><h1 className="mt-8 text-3xl font-semibold">Tài khoản</h1><p className="mt-4 text-stone-600">{user.email}</p><form action={signOut} className="mt-8"><button className="rounded-xl bg-teal-800 px-6 py-3 font-semibold text-white">Đăng xuất</button></form></main>;
}
