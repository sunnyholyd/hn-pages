import { updateMonthlyTopCache } from '@/app/utils/cache';
import dbManager from '@/app/utils/dbManager';
import { fetchNewsList } from '@/app/utils/newsUtils';
import { getRequestContext } from '@cloudflare/next-on-pages';
import type { NextRequest } from 'next/server'

export const runtime = 'edge';

// 获取月度top新闻
export async function GET(request: NextRequest) {
  const env = getRequestContext().env;
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month'); 

  if (!month) {
    return Response.json([]);
  }

  // get from kv cache
  const monthlyTopNews = await env.HN_CACHE.get(month, {cacheTtl: 21600});
  console.log("monthlyTopNews" + monthlyTopNews);
  if (monthlyTopNews) {
    console.log("monthlyTopNews hit cache, return from cache");
    return Response.json(JSON.parse(monthlyTopNews));
  } else {
    console.log("monthlyTopNews is null, start query db");
    const newsList = await updateMonthlyTopCache(month, getRequestContext().env);
    return Response.json(newsList);
  }
}
