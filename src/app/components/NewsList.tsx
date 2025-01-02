// components/NewsList.tsx
'use client';
import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import { News } from '../common/types';


export default function NewsList({ newsList }: { newsList: News[] }) {

  return (
    <div className="p-4">
      {newsList.map((news, index) => (
        <NewsItem key={news.id} news={news} defaultExpanded={index < 1} />
      ))}
    </div>
  );
};
