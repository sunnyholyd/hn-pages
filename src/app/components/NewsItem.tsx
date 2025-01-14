import React from 'react';
import { News } from '../commons/types';
import { USER_URL_PREFIX, ITEM_URL_PREFIX } from '../commons/constants';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface NewsItemProps {
  news: News;
  defaultExpanded: boolean;
}


export default function NewsItem({ news, defaultExpanded }: NewsItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const t = useTranslations('NewsItem');

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="py-4">
      <Link 
        href={`/news/${news.id}`}
        className="block hover:bg-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <div className="flex items-center">
          <span className='mr-2'> {isExpanded ? ' ▲ ' : ' ▼ '} </span>
          {/* <Link href={'news/' + news.id} onClick={(e) => e.stopPropagation()} className="text-lg font-semibold  */}
          {/* text-blue-600 hover:underline">{news.title}</Link> */}
          <span className="text-lg font-semibold text-blue-600 hover:underline">{news.title}</span>
        </div>
        <p className="text-sm text-gray-600">
          {news.score} points | by <a href={USER_URL_PREFIX + news.by} onClick={(e) => e.stopPropagation()} className="hover:underline">{news.by}</a> | <a href={ITEM_URL_PREFIX + news.id} onClick={(e) => e.stopPropagation()} className="hover:underline">{news.descendants} comments</a>
        </p>
      </Link>

      {isExpanded && news.intro && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <p className='text-sm text-gray-800'>{news.intro}</p>
        </div>
      )}

      {/* {isExpanded && news.valuable_information.length > 0 && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <h4 className="text-sm font-semibold mb-2">{t('commentsSummary')}</h4>
          <ul className="list-disc list-inside">
            {news.valuable_information.map((info, index) => (
              <li key={index} className="text-sm text-gray-800 mb-1">{info}</li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};
