
import { News } from "../common/types";
import dbManager from "./dbManager";

export async function updateNewsCache(cachedNewsList: News[] | null, db: D1Database): Promise<News[]> {
  const itemList = await dbManager.selectShowList(db);
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

  cachedNewsList = newsList;
  return newsList;
}