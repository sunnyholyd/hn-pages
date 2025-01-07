export const runtime = 'edge';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/app/components/Header";
import Scripts from "@/app/components/Scripts";
import { getMessages } from 'next-intl/server';
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hacker News中文",
  description: "Hacker News中文站，让你快速了解全球顶尖黑客都在关注什么。实时更新最新的科技新闻、创业资讯和技术讨论。每日精选 Hacker News 热门内容，提供中文摘要和评论总结。",
  keywords: "Hacker News, AI技术, 黑客新闻, 科技新闻, 创业资讯, 技术讨论, 中文摘要, 评论总结",
  openGraph: {
    title: "Hacker News中文",
    description: "最新科技新闻和评论的中文聚合平台，让你快速了解全球顶尖黑客都在关注什么。",
    type: "website",
    locale: "zh_CN",
    url: "https://news.sunnyd.top",
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  // const messages = await getMessages();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Scripts />
        <NextIntlClientProvider locale={locale} messages={messages}>
        <div className="max-w-6xl mx-auto">
          <Header />
          {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
