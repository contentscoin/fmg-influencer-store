import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FMG 인플루언서 스토어",
  description:
    "FMG 인플루언서의 시그니처 골프볼을 만나보세요. 전용 할인코드로 특별한 가격에 구매하세요.",
  openGraph: {
    title: "FMG 인플루언서 스토어",
    description: "인플루언서 시그니처 골프볼 전용 스토어",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist-sans)]">
        {children}
      </body>
    </html>
  );
}
