import cache from '@/app/utils/cache';
import { getRequestContext } from '@cloudflare/next-on-pages';
import type { NextRequest } from 'next/server'

export const runtime = 'edge';

// 获取月度top新闻
export async function GET(request: NextRequest) {
  const env = getRequestContext().env;
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month'); 
  const tag = searchParams.get('tag') || '';
  const locale = searchParams.get('locale') || 'en';
  if (!month) {
    return Response.json([]);
  }

  const newsList = await cache.getTopNews(month, tag, locale, env);
  return Response.json(newsList);

}
