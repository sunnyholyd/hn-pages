import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Scripts from "./components/Scripts";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Scripts />
        <Header />
        {children}
      </body>
    </html>
  );
}
