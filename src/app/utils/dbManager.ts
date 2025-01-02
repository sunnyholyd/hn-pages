import { HnItem, SimpleComment } from "../common/types";
import * as Constants from '../common/constants';
import { ShowListItem, ShepherdItem } from '../common/types';
import { ShepherdItemImpl } from "../common/SheperdItemImpl";

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
  selectShepherdItem
}