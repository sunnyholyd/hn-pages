export interface HnItem {
  by: string;
  id: number;
  time: number;
  type: string;
  parent?: number;
  title?: string;
  text?: string;
  kids?: number[];
  dead?: boolean;
  deleted?: boolean;
  descendants?: number;
  score?: number;
  url?: string;

  getWritableHnItem(): any;
}

export interface SimpleComment {
  by: string;              // 评论者的用户名
  text?: string;           // 评论内容
  children?: SimpleComment[];       // 回复的子评论列表
}

export interface ShepherdItem {
  id: number;
  title: string;
  text?: string;
  intro: string;
  cmt_summary: string[];

  getWritableShepherdItem(): any;
}

export interface ShowListItem {
  id: number;
  item_id: number;
}

export interface News {
  id: number;
  title?: string;
  by: string;
  url?: string;
  score?: number;
  descendants?: number;
  intro: string;
  cmt_summary: string[];
}
