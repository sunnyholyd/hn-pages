import { MetadataRoute } from 'next'
import { MONTH_SET } from './commons/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://news.sunnyd.top'

  // 基础路由
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/monthly-top`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // 为每个月份生成对应的URL
  const monthlyRoutes = MONTH_SET.map(month => ({
    url: `${baseUrl}/monthly-top?month=${month}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1,
  }))

  return [...routes, ...monthlyRoutes]
} 