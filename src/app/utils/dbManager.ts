import { AiSummaryOutput, HnItem, SimpleComment, WritableAiSummaryItem } from "../commons/types";
import * as Constants from '../commons/constants';
import { ShowListItem, ShepherdItem } from '../commons/types';
import { ShepherdItemImpl } from "../commons/SheperdItemImpl";
import { fromWritableAiSummaryItem } from "../utils/typeUtils";
import { AI_CN_TABLE } from "../commons/constants";
import { AI_SUMMARY_TABLE } from "../commons/constants";

async function query(db: D1Database, sql: string, params?: any[]) {
  const stmt = params ? db.prepare(sql).bind(...params) : db.prepare(sql);
  const { results } = await stmt.all();
  return results;
}

async function limitSelect(db: D1Database, tableName: string, limit: number = 100) {
  const { results } = await db.prepare(`SELECT * FROM ${tableName} limit ${limit}`).all();
  return results;
}

async function selectShowList(db: D1Database, limit: number = 30) {
  const {results} = await db.prepare(`SELECT * FROM show_list limit ${limit}`).all<ShowListItem>();
  return results;
}

async function selectSingleStmt(db: D1Database, tableName: string, id: number) {
  const selectSql = "SELECT * FROM " + tableName + " WHERE id = ?"
  const stmt = db.prepare(selectSql).bind(id);
  return stmt;
}

async function selectShepherdItem(db: D1Database, id: number) {
  const stmt = selectSingleStmt(db, Constants.ITEMS_SHEPHERD_TABLE, id);
  const result = await (await stmt).first<ShepherdItem>();
  return result ? new ShepherdItemImpl(result) : null;
}
async function selectLocaleAiSummaryItem(db: D1Database, id: number, locale: string) {
  const tableName = locale === 'en' ? AI_SUMMARY_TABLE: AI_CN_TABLE;
  return selectAiSummaryItem(db, id, tableName);
}

async function selectAiSummaryItem(db: D1Database, id: number, tableName: string) {
  const stmt = selectSingleStmt(db, tableName, id);
  const result = await (await stmt).first<WritableAiSummaryItem>();
  return result ? fromWritableAiSummaryItem(result) : null;
}

async function selectHnItem(db: D1Database, id: number) {
  const stmt = selectSingleStmt(db, Constants.HN_ITEMS_TABLE, id);
  return (await stmt).first<HnItem>();
}

// select all comments from hn_items
async function selectAllComments(db: D1Database, parent_id: number): Promise<SimpleComment[]> {
  const {results} = await db.prepare(`SELECT * FROM hn_items WHERE parent = ? order by time asc`).bind(parent_id).all<HnItem>();

  const comments: SimpleComment[] = [];
  for (const hnItem of results) {
    const comment: SimpleComment = {
      text: hnItem.text,
      by: hnItem.by,
    }
    if (hnItem.kids && hnItem.kids.length > 0) {
      const kids = await selectAllComments(db, hnItem.id);
      comment.children = kids;
    }
    comments.push(comment);
  }
  return comments;
}


export default {
  query,
  limitSelect,
  selectHnItem,
  selectAllComments,
  selectShowList,
  selectShepherdItem,
  selectAiSummaryItem,
  selectLocaleAiSummaryItem
}
