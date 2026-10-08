import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Noto_Sans_JP } from "next/font/google";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Manabu — Học JLPT mỗi ngày",
    template: "%s · Manabu",
  },
  description:
    "Ứng dụng tự học tiếng Nhật từ bảng chữ cái đến JLPT, có ôn tập cách quãng và theo dõi tiến độ.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geist.variable} ${jetbrainsMono.variable} ${notoSansJp.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
