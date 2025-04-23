'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NewsList from "@/app/components/NewsList";
import { useLocale } from "next-intl";
import TopSelector from "@/app/components/TopSelector";
import Loading from "@/app/components/Loading";
import { MONTH_SET } from "@/app/commons/constants";

export const runtime = 'edge';

export default function Page({
  searchParams,
}: {
  searchParams: { month: string, tag: string };
}) {
  const locale = useLocale();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { month, tag } = searchParams;

  useEffect(() => {
    const fetchData = async () => {
      if (month || tag) {
        setIsLoading(true);
        try {
          const result = await fetch(`/api/top?month=${month}&tag=${tag}&locale=${locale}`);
          const data: any = await result.json();
          setData(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [month, tag, locale]);

  return (
    <div>
      <div className="text-sm text-gray-600 border-b">
        <div className="py-2">
          {month}月 热门TOP10排行榜，根据评论数进行排名，看看全世界的极客们最关心最在意的是什么。
        </div>
      </div>
      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <NewsList newsList={data} />
        )}
      </div>
    </div>
  );
}
