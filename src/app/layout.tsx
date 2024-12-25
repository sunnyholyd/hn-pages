import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
              "description": "实时动态的更新Hacker News中文信息，让你快速了解全球顶尖黑客都在关注什么。实时更新最新的科技新闻、创业资讯和技术讨论, 提供中文摘要和评论总结。",
            }),
          }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2171077611482039" crossOrigin="anonymous"></script>
      </body>
    </html>
  );
}
