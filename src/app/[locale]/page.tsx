'use client';

import React, { useEffect, useState } from 'react';
import NewsList from '@/app/components/NewsList';
import { News } from '@/app/commons/types';
import { useLocale, useTranslations } from 'next-intl';
export default function Home() {
  const locale = useLocale();
  const [newsList, setNewsList] = useState<News[]>([]);

  useEffect(() => {
    fetch('/api/show?locale=' + locale)
      .then(response => response.json<News[]>())
      .then(newsList => {
        setNewsList(newsList);
      });
  }, []);


  return (
    <main>
      <div>
        <NewsList newsList={newsList} />
      </div>
    </main>
  );
}
