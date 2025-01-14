import { MetadataRoute } from 'next'
import { MONTH_SET, LOCALES } from './commons/constants'
import dbManager from './utils/dbManager'
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://news.sunnyd.top'

  // 基础路由
  const routes = LOCALES.flatMap((locale: string) => [{
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
  },
  {
    url: `${baseUrl}/${locale}/monthly-top`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }
]);

  // 为每个月份生成对应的URL
  const monthlyRoutes = LOCALES.flatMap(
    locale => MONTH_SET.map(month => ({
    url: `${baseUrl}/${locale}/monthly-top?month=${month}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1,
  }))
  );

  // 获取所有新闻摘要ID
  const aiSummary = await dbManager.selectAllAiSummary(getRequestContext().env.DB)
  
  // 为每个新闻摘要生成中英文路由
  const newsRoutes = LOCALES.flatMap(locale => aiSummary.map(item => ({
      url: `${baseUrl}/${locale}/news/${item.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })));

  return [...routes, ...monthlyRoutes, ...newsRoutes]
} 