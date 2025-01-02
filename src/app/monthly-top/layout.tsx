'use client';

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const monthSet = ['2025-01', '2024-12', '2024-11', '2024-10', '2024-09', '2024-08'];

export default function MonthlyTopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.push(`${pathname}?month=${monthSet[0]}`);
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
          >
            {monthSet.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        {children}
      </div>
    </main>
  );
}
