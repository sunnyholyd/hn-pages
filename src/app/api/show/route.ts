import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import dbManager from '@/app/utils/dbManager'
import type { ShowListItem , News} from '@/app/commons/types'
import { CACHE_KEY_NEWS_LIST_PREFIX, updateNewsCache } from '@/app/utils/cache'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const env = getRequestContext().env;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';

  const cachedNewsList = await env.HN_CACHE.get(CACHE_KEY_NEWS_LIST_PREFIX + locale);
  // 如果缓存不存在，等待首次更新
  if (!cachedNewsList) {
    console.log('cachedNewsList is null, start first updateCache.');
    const newsList = await updateNewsCache(env, locale);
    return Response.json(newsList);
  }

  return Response.json(JSON.parse(cachedNewsList));
  
}

