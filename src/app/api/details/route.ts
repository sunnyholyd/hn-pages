import { NextResponse } from "next/server";
import dbManager from "@/app/utils/dbManager";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = 'edge';

export async function GET(request: Request, { params }: { params: { id: number, locale: string } }) {
  const summary = await dbManager.selectLocaleAiSummaryItem(getRequestContext().env.DB, params.id, params.locale);
  const hnItem = await dbManager.selectHnItem(getRequestContext().env.DB, params.id);
  return NextResponse.json({summary, hnItem});
}