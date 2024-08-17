import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hacker News中文",
  description: "Hacker News 中文站，实时更新最新的科技新闻、创业资讯和技术讨论。每日精选 Hacker News 热门内容，提供中文摘要和评论总结。",
  keywords: "Hacker News, 科技新闻, 创业资讯, 技术讨论, 中文摘要, 评论总结",
  openGraph: {
    title: "Hacker News中文",
    description: "最新科技新闻和评论的中文聚合平台",
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
        {children}
        <script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Hacker News中文",
              "url": "https://news.sunnyd.top",
              "description": "Hacker News 中文站，实时更新最新的科技新闻、创业资讯和技术讨论, 提供中文摘要和评论总结。",
            }),
          }}
        />
      </body>
    </html>
  );
}
