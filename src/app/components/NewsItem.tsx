import React from 'react';
import { News } from '../common/types';
import { USER_URL_PREFIX, ITEM_URL_PREFIX } from '../common/constants';

interface NewsItemProps {
  news: News;
}


export default function NewsItem({ news }: NewsItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="border-b border-gray-300 py-4">
      <div className="flex items-center">
        <button onClick={toggleExpanded} className='mr-2'>
          {isExpanded ? '▲' : '▼'}
        </button>

        <a href={news.url} className="text-lg font-semibold text-blue-600 hover:underline">{news.title}</a>
      </div>
      <p className="text-sm text-gray-600">
        {news.score} points | by <a href={USER_URL_PREFIX + news.by} className="hover:underline">{news.by}</a> | <a href={ITEM_URL_PREFIX + news.id} className="hover:underline">{news.descendants} comments</a>
      </p>

      {isExpanded && news.intro && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <p className='text-sm text-gray-800'>{news.intro}</p>
        </div>
      )}

      {isExpanded && news.cmt_summary.length > 0 && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <h4 className="text-sm font-semibold mb-2">评论摘要：</h4>
          <ul className="list-disc list-inside">
            {news.cmt_summary.map((summary, index) => (
              <li key={index} className="text-sm text-gray-800 mb-1">{summary}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
