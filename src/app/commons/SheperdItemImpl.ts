import { ShepherdItem } from "./types";

export class ShepherdItemImpl implements ShepherdItem {
  id!: number;
  title!: string;
  intro!: string;
  cmt_summary!: string[];

  constructor(seph: Partial<ShepherdItem>) {
    Object.assign(this, seph);
    if (typeof this.cmt_summary === "string") {
      this.cmt_summary = JSON.parse(this.cmt_summary);
    }
  }

  getWritableShepherdItem() {
    return {
      id: this.id,
      title: this.title,
      intro: this.intro,
      cmt_summary: JSON.stringify(this.cmt_summary),
    };
  }
}
