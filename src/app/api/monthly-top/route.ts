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

  const sql = `WITH monthly_stories AS (
  SELECT 
    id,
    title,
    descendants,
    url,
    score,
    strftime('%Y-%m', datetime(CAST(time AS INTEGER), 'unixepoch')) as month,
    ROW_NUMBER() OVER (
      PARTITION BY strftime('%Y-%m', datetime(CAST(time AS INTEGER), 'unixepoch'))
      ORDER BY descendants DESC
    ) as rank
  FROM hn_items
  WHERE type = 'story'
    AND deleted = 0 
    AND dead = 0
    AND strftime('%Y-%m', datetime(CAST(time AS INTEGER), 'unixepoch')) = ?
)
SELECT 
  month,
  id,
  title,
  descendants,
  score,
  url
FROM monthly_stories
WHERE rank <= 10
ORDER BY descendants DESC;`

  if (!month) {
    return Response.json([]);
  }

  // get from kv cache
  const monthlyTopNews = await env.HN_CACHE.get(month);
  console.log("monthlyTopNews" + monthlyTopNews);
  if (monthlyTopNews) {
    console.log("monthlyTopNews hit cache, return from cache");
    return Response.json(JSON.parse(monthlyTopNews));
  } else {
    console.log("monthlyTopNews is null, start query db");
    const result = await dbManager.query(getRequestContext().env.DB, sql, [month]);
    const newsList = await fetchNewsList(getRequestContext().env.DB, result.map((item: any) => ({ item_id: item.id })));
    await env.HN_CACHE.put(month, JSON.stringify(newsList));
    return Response.json(newsList);
  }
}
