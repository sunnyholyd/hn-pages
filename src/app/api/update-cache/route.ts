import { NextRequest } from 'next/server';
import { updateNewsCache } from '@/app/utils/cache';
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // 验证密钥（可选，但建议添加）
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CACHE_UPDATE_KEY}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    console.log('try to updateCache.');

    await updateNewsCache(null, getRequestContext().env.DB);
    return new Response('Cache updated successfully', { status: 200 });
  } catch (error) {
    console.error('Cache update failed:', error);
    return new Response('Cache update failed', { status: 500 });
  }
} 