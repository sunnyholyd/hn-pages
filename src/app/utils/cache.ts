import { MONTH_SET } from "../common/constants";
import { News } from "../common/types";
import dbManager from "./dbManager";
import { fetchNewsList } from "./newsUtils";

export async function updateNewsCache(cachedNewsList: News[] | null, db: D1Database): Promise<News[]> {
  const itemList = await dbManager.selectShowList(db);
  const newsList = await fetchNewsList(db, itemList);
  
  cachedNewsList = newsList;
  return newsList;
}

export async function updateMonthlyTopCache(month: string, env: CloudflareEnv) {
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

  const monthlyTopNews = await dbManager.query(env.DB, sql, [month]);
  const newsList = await fetchNewsList(env.DB, monthlyTopNews.map((item: any) => ({ item_id: item.id })));

  // 如果是当前月份，缓存6小时，数据需要重新刷新
  if (month === MONTH_SET[0]) {
    await env.HN_CACHE.put(month, JSON.stringify(newsList), { expirationTtl: 60 * 60 * 6});
  } else {
    await env.HN_CACHE.put(month, JSON.stringify(newsList));
  }
  return newsList;
}