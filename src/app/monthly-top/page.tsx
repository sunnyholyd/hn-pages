'use client';

import { useEffect, useState } from "react";
import NewsList from "../components/NewsList";

export const runtime = 'edge';

export default function Page({
  searchParams,
}: {
  searchParams: { month: string };
}) {
  const selectedMonth = searchParams.month;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/monthly-top?month=${selectedMonth}`);
      const data: any = await result.json();
      setData(data);
    };
    fetchData();
  }, [selectedMonth]);

  return (
    <div>
      <div className="text-sm text-gray-600 border-b">
        <div className="py-2">
          {selectedMonth} 月度热门文章
        </div>
      </div>
      <div>
        <NewsList newsList={data} />
      </div>
    </div>
  );
}
