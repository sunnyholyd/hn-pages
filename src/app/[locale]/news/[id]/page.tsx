'use client';

import { AiSummaryOutput } from "@/app/commons/types";
import NewsDetails from "@/app/components/NewsDetails";
import { useLocale } from "next-intl";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewsDetailsPage({ params }: { params: { id: string } }) {
  const locale = useLocale();
  const [summary, setSummary] = useState<AiSummaryOutput | null>(null);

  useEffect(() => {
    fetch('/api/details?id=' + params.id + '&locale=' + locale)
      .then(response => response.json<AiSummaryOutput>())
      .then(summary => {
        setSummary(summary);
      })
      .catch(error => {
        console.error('Error fetching summary:', error);
        redirect('/');
      });
  }, [params.id, locale]);


  return (
    <div>
      {summary && <NewsDetails summary={summary} />}
    </div>
  )

}

