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

  if (newsList.length > 0) {
    await env.HN_CACHE.put(CACHE_KEY_NEWS_LIST_PREFIX + locale, JSON.stringify(newsList), { expirationTtl: 600 });
  }

  return newsList;
}

// hnItem
async function getHnItem(env: CloudflareEnv, id: number): Promise<HnItem | null> {
  const cachedNewsItem = await env.HN_CACHE.get(CACHE_KEY_HN_ITEM_PREFIX + id);
  if (!cachedNewsItem) {
    const newsItem = await dbManager.selectHnItem(env.DB, id);
    if (newsItem) {
      await env.HN_CACHE.put(CACHE_KEY_HN_ITEM_PREFIX + id, JSON.stringify(newsItem), { expirationTtl: 600 });
    }
    return newsItem;
  }
  return JSON.parse(cachedNewsItem);
}

// aiSummary
async function getAiSummary(env: CloudflareEnv, id: number, locale: string): Promise<AiSummaryOutput | null> {
  const cachedAiSummary = await env.HN_CACHE.get(CACHE_KEY_AI_SUMMARY_PREFIX + id + locale);
  if (!cachedAiSummary) {
    const aiSummary = await dbManager.selectLocaleAiSummaryItem(env.DB, id, locale);
    if (aiSummary) {
      await env.HN_CACHE.put(CACHE_KEY_AI_SUMMARY_PREFIX + id + locale, JSON.stringify(aiSummary), { expirationTtl: 600 });
    }
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

// topNews
async function getTopNews(month: string, tag: string, locale: string, env: CloudflareEnv): Promise<News[]> {
  const monthlyTopNews = await env.HN_CACHE.get(month + "_" + tag + "_" + locale, { cacheTtl: 60 * 60 * 24 });

  if (monthlyTopNews) {
    console.log("monthlyTopNews hit cache, return from cache");
    return JSON.parse(monthlyTopNews);
  } else {
    console.log("monthlyTopNews is null, start query db");
    const newsList = await updateTopNewsCache(month, tag, locale, env);
    return newsList;
  }
}

async function updateTopNewsCache(month: string, tag: string, locale: string, env: CloudflareEnv) {
  const sql = `
  WITH filtered_stories AS (
  SELECT 
    h.id,
    h.title,
    h.descendants,
    h.url,
    h.score,
    strftime('%Y-%m', datetime(CAST(h.time AS INTEGER), 'unixepoch')) as month
  FROM hn_items h
  WHERE h.type = 'story'
    AND h.deleted = 0 
    AND h.dead = 0
    AND strftime('%Y-%m', datetime(CAST(h.time AS INTEGER), 'unixepoch')) = ?
),
tagged_stories AS (
  SELECT 
    fs.*,
    a.tags
  FROM filtered_stories fs
  LEFT JOIN ai_summary_items a ON fs.id = a.id
  WHERE ( ? IS NULL OR a.tags GLOB '*' || ? || '*')
),
ranked_stories AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (
      PARTITION BY month
      ORDER BY descendants DESC
    ) as rank
  FROM tagged_stories
)
SELECT 
  month,
  id,
  title,
  descendants as comment_count,
  score,
  url,
  tags
FROM ranked_stories
WHERE rank <= 10
ORDER BY month DESC, descendants DESC;`
  const monthlyTopNews = await dbManager.query(env.DB, sql, [month, tag, tag]);
  const newsList = await fetchNewsList(env.DB, monthlyTopNews.map((item: any) => ({ item_id: item.id })), locale);

  if (newsList.length > 0) {
    // 如果是当前月份，缓存6小时，数据需要重新刷新
    if (month === MONTH_SET[0]) {
      await env.HN_CACHE.put(month + "_" + tag + "_" + locale, JSON.stringify(newsList), { expirationTtl: 60 * 60 * 24 });
    } else {
      await env.HN_CACHE.put(month + "_" + tag + "_" + locale, JSON.stringify(newsList));
    }
  }
  return newsList;
}

export default {
  getNewsList,
  updateNewsList,
  getHnItem,
  getAiSummary,
  getDetails,
  getTopNews,
  updateTopNewsCache,
}