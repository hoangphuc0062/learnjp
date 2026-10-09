"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Cards,
  ChartLineUp,
  House,
  ListDashes,
  SpeakerHigh,
  SignIn,
  Stack,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Hôm nay", icon: House },
  { href: "/learn", label: "Học", icon: BookOpen },
  { href: "/kana", label: "Bảng chữ cái", icon: ListDashes },
  { href: "/flashcards", label: "Flashcard", icon: Cards },
  { href: "/sound-rules", label: "Quy tắc âm", icon: SpeakerHigh },
  { href: "/review", label: "Ôn tập", icon: Stack },
  { href: "/progress", label: "Tiến độ", icon: ChartLineUp },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/learn" && pathname.startsWith("/n5"));
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-stone-200/80 bg-[#f2f0e9]/90 px-5 py-7 backdrop-blur lg:flex lg:flex-col">
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="grid size-10 place-items-center rounded-2xl bg-[#153f3a] font-jp text-lg font-semibold text-[#f5d99b]">
            学
          </div>
          <div>
            <p className="font-semibold tracking-tight text-stone-950">Manabu</p>
            <p className="text-xs text-stone-500">毎日、少しずつ</p>
          </div>
        </Link>

        <nav className="mt-10 space-y-1.5">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition",
                  active
                    ? "bg-white text-teal-800 shadow-sm"
                    : "text-stone-500 hover:bg-white/70 hover:text-stone-900",
                )}
              >
                <Icon className="size-5" weight={active ? "fill" : "regular"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[20px] border border-stone-200 bg-white/70 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
            Zero → Hero
          </p>
          <p className="mt-2 text-sm font-semibold text-stone-900">
            Đang học N5
          </p>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Xây nền thật chắc rồi mới tăng tốc.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-stone-800"
          >
            <SignIn className="size-4" /> Đăng nhập để đồng bộ
          </Link>
          <Link href="/account" className="mt-3 block text-xs font-bold text-teal-800">Tài khoản / Đăng xuất</Link>
        </div>
      </aside>

      <main className="min-w-0">{children}</main>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-7 rounded-[22px] border border-stone-200/80 bg-white/95 p-1.5 shadow-[0_16px_50px_rgba(35,37,34,0.14)] backdrop-blur lg:hidden">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition",
                active ? "bg-[#e8f1ee] text-teal-800" : "text-stone-500",
              )}
            >
              <Icon className="size-5" weight={active ? "fill" : "regular"} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
