'use client';

import { AiSummaryOutput, Details, HnItem } from "@/app/commons/types";
import NewsDetails from "@/app/components/NewsDetails";
import { useLocale } from "next-intl";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";


export default function NewsDetailsPage({ params }: { params: { id: string } }) {
  const locale = useLocale();
  const [details, setDetails] = useState<Details | null>(null);

  useEffect(() => {
    fetch('/api/details?id=' + params.id + '&locale=' + locale)
      .then(response => response.json<Details>())
      .then(details => {
        setDetails(details);
      })
      .catch(error => {
        console.error('Error fetching summary:', error);
        redirect('/');
      });


  }, [params.id, locale]);


  return (
    <div>
      {details && <NewsDetails summary={details.summary} hnItem={details.hnItem} />}
    </div>
  )

}

