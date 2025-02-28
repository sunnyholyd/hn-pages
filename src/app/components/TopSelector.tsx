'use client';

import { MONTH_SET, TAG_SET } from "@/app/commons/constants";
import { useRouter } from "next/navigation";
interface TopSelectorProps {
  pathname: string;
  month: string;
  tag: string;
}

export default function TopSelector({ pathname, month, tag }: TopSelectorProps) {
  const router = useRouter();
  return (
    <div className="flex items-center space-x-4 py-4">
      <span className="text-gray-700">选择月份：</span>
      <select 
        className="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-orange-500"
        onChange={(e) => {
          router.push(`${pathname}?month=${e.target.value}&tag=${tag}`);

        }}
        defaultValue={month}
      >
        {MONTH_SET.map((month) => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      <span className="text-gray-700">选择标签：</span>
      <select 
        className="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-orange-500"
        onChange={(e) => {
          router.push(`${pathname}?month=${month}&tag=${e.target.value}`);
        }}
        defaultValue={tag}
      >
        <option value="">All</option>
        {TAG_SET.map((tag) => (
          <option key={tag} value={tag}>{tag}</option>
        ))}

      </select>
    </div>
  );
} 