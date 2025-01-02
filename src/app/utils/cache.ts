import { News } from "../common/types";
import dbManager from "./dbManager";
import { fetchNewsList } from "./newsUtils";

export async function updateNewsCache(cachedNewsList: News[] | null, db: D1Database): Promise<News[]> {
  const itemList = await dbManager.selectShowList(db);
  const newsList = await fetchNewsList(db, itemList);
  
  cachedNewsList = newsList;
  return newsList;
}