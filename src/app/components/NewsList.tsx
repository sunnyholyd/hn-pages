// components/NewsList.tsx
'use client';
import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import { News } from '../common/types';


export default function NewsList() {
  const [newsList, setNewsList] = useState<News[]>([]);

  useEffect(() => {
    fetch('/api/show')
      .then(response => response.json<News[]>())
      .then(newsList => {
        setNewsList(newsList);
      });
  }, []);


  return (
    <div className="p-4">
      {newsList.map((news, index) => (
        <NewsItem key={news.id} news={news} defaultExpanded={index < 1} />
      ))}
    </div>
  );
};
