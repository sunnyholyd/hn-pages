import React from 'react';
import Header from './components/Header';
import NewsList from './components/NewsList';

export default function Home() {
  return (
    <main>
      <div>
        <NewsList />
      </div>
    </main>
  );
}
