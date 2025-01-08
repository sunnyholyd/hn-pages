'use client';

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { MONTH_SET } from "../commons/constants";

export default function MonthlyTopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const month = new URLSearchParams(window.location.search).get('month') || MONTH_SET[0];

  useEffect(() => {
    router.push(`${pathname}?month=${month}`);
  }, [pathname]);

  return (
    <main>
      <div>
        <div className="flex items-center space-x-4 py-4">
          <span className="text-gray-700">选择月份：</span>
          <select 
            className="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-orange-500"
            onChange={(e) => {
              router.push(`${pathname}?month=${e.target.value}`);
            }}
            defaultValue={month}
          >
            {MONTH_SET.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        {children}
      </div>
    </main>
  );
}
