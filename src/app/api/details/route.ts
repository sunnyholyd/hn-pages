import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import cache from "@/app/utils/cache";
import { NextRequest } from 'next/server'

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id');
  const locale = searchParams.get('locale');

  if (!id || !locale) {
    return NextResponse.json({ error: 'Missing id or locale' }, { status: 400 });
  }
  
  const details = await cache.getDetails(getRequestContext().env, Number(id), locale);
  return NextResponse.json(details);
}