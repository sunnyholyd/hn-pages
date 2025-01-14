import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import cache from '@/app/utils/cache';

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const env = getRequestContext().env;
  const searchParams = request.nextUrl.searchParams
  const locale = searchParams.get('locale') || 'en';

  const newsList = await cache.getNewsList(env, locale);

  return Response.json(newsList);
  
}

