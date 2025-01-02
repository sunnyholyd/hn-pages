import { News } from "../common/types";
import dbManager from "./dbManager";

export async function fetchNewsList(db: D1Database, itemList: { item_id: number }[]): Promise<News[]> {
  const newsList: News[] = [];
  
  for (const item of itemList) {
    // select hnitem
    const hnitem = await dbManager.selectHnItem(db, item.item_id);
    // select shepherditems 
    const shepherditem = await dbManager.selectShepherdItem(db, item.item_id);
    
    if (hnitem) {
      const news: News = {
        id: item.item_id,
        title: shepherditem ? shepherditem.title : hnitem.title,
        url: hnitem.url,
        score: hnitem.score,
        descendants: hnitem.descendants,
        by: hnitem.by,
        intro: shepherditem ? shepherditem.intro : "",
        cmt_summary: shepherditem ? shepherditem.cmt_summary : [],
      }
      newsList.push(news);
    }
  }

  return newsList;
} 