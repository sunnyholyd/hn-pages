import { MONTH_SET } from "../commons/constants";
import { AiSummaryOutput, Details, HnItem, News } from "../commons/types";
import dbManager from "./dbManager";
import { fetchNewsList } from "./newsUtils";

export const CACHE_KEY_NEWS_LIST_PREFIX = "news_list_";
export const CACHE_KEY_HN_ITEM_PREFIX = "hn_item_";
export const CACHE_KEY_AI_SUMMARY_PREFIX = "ai_summary_";

// newsList
async function getNewsList(env: CloudflareEnv, locale: string): Promise<News[]> {
  const cachedNewsList = await env.HN_CACHE.get(CACHE_KEY_NEWS_LIST_PREFIX + locale);
  // 如果缓存不存在，等待首次更新
  if (!cachedNewsList) {
    console.log('cachedNewsList is null, start first updateCache.');
    const newsList = await updateNewsList(env, locale);
    return newsList;
  }
  return JSON.parse(cachedNewsList);
}

async function updateNewsList(env: CloudflareEnv, locale: string): Promise<News[]> {
  const db = env.DB;
  const itemList = await dbManager.selectShowList(db);
  const newsList = await fetchNewsList(db, itemList, locale);

  await env.HN_CACHE.put(CACHE_KEY_NEWS_LIST_PREFIX + locale, JSON.stringify(newsList));

  return newsList;
}

// hnItem
async function getHnItem(env: CloudflareEnv, id: number): Promise<HnItem | null> {
  const cachedNewsItem = await env.HN_CACHE.get(CACHE_KEY_HN_ITEM_PREFIX + id);
  if (!cachedNewsItem) {
    const newsItem = await dbManager.selectHnItem(env.DB, id);
    await env.HN_CACHE.put(CACHE_KEY_HN_ITEM_PREFIX + id, JSON.stringify(newsItem));
    return newsItem;
  }
  return JSON.parse(cachedNewsItem);
}

// aiSummary
async function getAiSummary(env: CloudflareEnv, id: number, locale: string): Promise<AiSummaryOutput | null> {
  const cachedAiSummary = await env.HN_CACHE.get(CACHE_KEY_AI_SUMMARY_PREFIX + id + locale);
  if (!cachedAiSummary) {
    const aiSummary = await dbManager.selectLocaleAiSummaryItem(env.DB, id, locale);
    await env.HN_CACHE.put(CACHE_KEY_AI_SUMMARY_PREFIX + id + locale, JSON.stringify(aiSummary));
    return aiSummary;
  }
  return JSON.parse(cachedAiSummary);
}

// details
async function getDetails(env: CloudflareEnv, id: number, locale: string = 'en'): Promise<Details | null> {
  const hnItem = await getHnItem(env, id);
  const summary = await getAiSummary(env, id, locale);
  if (!hnItem || !summary) {
    return null;
  }
  return {
    hnItem,
    summary
  }
}

// monthlyTop
async function getMonthlyTop(env: CloudflareEnv, month: string, locale: string): Promise<News[]> {
  const monthlyTopNews = await env.HN_CACHE.get(month, {cacheTtl: 21600});
  console.log("monthlyTopNews" + monthlyTopNews);
  if (monthlyTopNews) {
    console.log("monthlyTopNews hit cache, return from cache");
    return JSON.parse(monthlyTopNews);
  } else {
    console.log("monthlyTopNews is null, start query db");
    const newsList = await updateMonthlyTopCache(month, env, locale);
    return newsList;
  }
}

async function updateMonthlyTopCache(month: string, env: CloudflareEnv, locale: string) {
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
  const newsList = await fetchNewsList(env.DB, monthlyTopNews.map((item: any) => ({ item_id: item.id })), locale);

  // 如果是当前月份，缓存6小时，数据需要重新刷新
  if (month === MONTH_SET[0]) {
    await env.HN_CACHE.put(month, JSON.stringify(newsList), { expirationTtl: 60 * 60 * 6});
  } else {
    await env.HN_CACHE.put(month, JSON.stringify(newsList));
  }
  return newsList;
}

export default {
  getNewsList,
  updateNewsList,
  getHnItem,
  getAiSummary,
  getDetails,
  getMonthlyTop,
  updateMonthlyTopCache,
}