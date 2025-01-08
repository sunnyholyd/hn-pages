import { AiSummaryOutput, WritableAiSummaryItem } from "@/app/commons/types";

export function toWritableAiSummaryItem(item_id: number, summaryOutput: AiSummaryOutput): WritableAiSummaryItem {
  return {
    id: item_id,
    seo_title: summaryOutput.title,
    intro: summaryOutput.introduction,
    tags: JSON.stringify(summaryOutput.tags),
    positive_summary: summaryOutput.positiveCommentsSummary,
    negative_summary: summaryOutput.negativeCommentsSummary,
    valuable_information: JSON.stringify(summaryOutput.valuableInformation),
    extra: summaryOutput.extra ? summaryOutput.extra : "",
  }

}

export function fromWritableAiSummaryItem(item: WritableAiSummaryItem): AiSummaryOutput {
  return {
    title: item.seo_title,
    introduction: item.intro,
    tags: JSON.parse(item.tags),
    positiveCommentsSummary: item.positive_summary,
    negativeCommentsSummary: item.negative_summary,
    valuableInformation: JSON.parse(item.valuable_information),
    extra: item.extra ? item.extra : "",
  }
}