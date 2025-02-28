import type { Metadata } from "next";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { notFound } from "next/navigation";
import cache from "@/app/utils/cache";

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: { id: string, locale: string } }): Promise<Metadata> {
  const summary = await cache.getAiSummary(getRequestContext().env, parseInt(params.id), params.locale);
  if (!summary) {
    notFound();
  }

  return {
    title: summary.title,
    description: summary.introduction,
    keywords: summary.tags.join(', '),
    openGraph: {
      title: summary.title,
      description: summary.introduction,
      type: "article",
      locale: params.locale === 'zh' ? 'zh_CN' : 'en_US',
      url: `https://news.sunnyd.top/news/${params.id}`,
      siteName: summary.title,
    },
    twitter: {
      card: 'summary',
      title: summary.title,
      description: summary.introduction,
    }
  };
}

export default async function NewsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string; locale: string };
}>) {

  return (
    <main>
      <div>
        {children}
      </div>
    </main>
  );
} 