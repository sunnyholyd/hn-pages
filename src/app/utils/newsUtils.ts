import { News } from "../commons/types";
import dbManager from "./dbManager";
import { AI_SUMMARY_TABLE, AI_CN_TABLE } from "../commons/constants";

export async function fetchNewsList(db: D1Database, itemList: { item_id: number }[], locale: string): Promise<News[]> {
  const newsList: News[] = [];

  const tableName = locale === 'en' ? AI_SUMMARY_TABLE: AI_CN_TABLE;
  for (const item of itemList) {
    // select hnitem
    const hnitem = await dbManager.selectHnItem(db, item.item_id);
    // select ai summary items
    const aiSummaryItem = await dbManager.selectAiSummaryItem(db, item.item_id, tableName);

    if (hnitem) {
      const news: News = {
        id: item.item_id,
        title: aiSummaryItem ? aiSummaryItem.title : hnitem.title,
        url: hnitem.url,
        score: hnitem.score,
        descendants: hnitem.descendants,
        by: hnitem.by,
        intro: aiSummaryItem ? aiSummaryItem.introduction : "",
        tags: aiSummaryItem ? aiSummaryItem.tags : [],
        positive_summary: aiSummaryItem ? aiSummaryItem.positiveCommentsSummary : "",
        negative_summary: aiSummaryItem ? aiSummaryItem.negativeCommentsSummary : "",
        valuable_information: aiSummaryItem ? aiSummaryItem.valuableInformation : [],
        extra: aiSummaryItem ? aiSummaryItem.extra : "",
      }
      newsList.push(news);
    }
  }

  return newsList;
} 