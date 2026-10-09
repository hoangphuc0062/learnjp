import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  if (code && isSupabaseConfigured()) {
    const { error } = await (await createClient()).auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(url.searchParams.get("next") === "/reset-password" ? "/reset-password" : "/", url.origin));
  }
  return NextResponse.redirect(new URL("/login?message=Liên kết xác thực không hợp lệ hoặc đã hết hạn.", url.origin));
}
