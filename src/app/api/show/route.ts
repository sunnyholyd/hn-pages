import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import dbManager from '@/app/utils/dbManager'
import type { ShowListItem , News} from '@/app/common/types'
import { updateNewsCache } from '@/app/utils/cache'
// 缓存变量
let cachedNewsList: News[] | null = null;

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  // 如果缓存不存在，等待首次更新
  if (!cachedNewsList) {
    console.log('cachedNewsList is null, start first updateCache.');
    cachedNewsList = await updateNewsCache(cachedNewsList, getRequestContext().env.DB);
  }
  
  return Response.json(cachedNewsList);
}

