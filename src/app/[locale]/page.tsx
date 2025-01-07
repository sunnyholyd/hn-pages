'use client';

import React, { useEffect, useState } from 'react';
import NewsList from '@/app/components/NewsList';
import { News } from '@/app/common/types';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');
  const [newsList, setNewsList] = useState<News[]>([]);

  useEffect(() => {
    fetch('/api/show')
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
