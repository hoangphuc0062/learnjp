"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function credentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signIn(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/login?message=demo");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials(formData));

  if (error) redirect(`/login?message=${encodeURIComponent(error.message)}`);
  redirect("/");
}

export async function signUp(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/login?message=demo");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(credentials(formData));

  if (error) redirect(`/login?message=${encodeURIComponent(error.message)}`);
  redirect("/login?message=created");
}
