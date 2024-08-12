import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import dbManager from '@/app/utils/dbManager'
import type { ShowListItem , News} from '@/app/common/types'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  // select list
  const itemList = await dbManager.selectShowList(getRequestContext().env.DB);

  const newsList: News[] = [];
  for (const item of itemList) {
    console.log(item);
    // select hnitem
    const hnitem = await dbManager.selectHnItem(getRequestContext().env.DB, item.item_id);
    // select shepherditems 
    const shepherditem = await dbManager.selectShepherdItem(getRequestContext().env.DB, item.item_id);

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

  return Response.json(newsList);
}
