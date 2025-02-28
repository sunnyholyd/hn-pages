'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MONTH_SET } from "@/app/commons/constants";
import TopSelector from "@/app/components/TopSelector";

export default function MonthlyTopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const month = searchParams.get('month') || MONTH_SET[0];
  const tag = searchParams.get('tag') || '';

  useEffect(() => {
    if (month || tag) {
      router.push(`${pathname}?month=${month}&tag=${tag}`);
    }
  }, [pathname, month, tag]);

  return (
    <main>
      <div>
        <TopSelector pathname={pathname} month={month} tag={tag} />
        {children}
      </div>
    </main>
  );
}
