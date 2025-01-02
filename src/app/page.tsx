'use client';

import React, { useEffect, useState } from 'react';
import NewsList from './components/NewsList';
import { News } from './common/types';

export default function Home() {
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
