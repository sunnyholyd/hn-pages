import React from 'react';
import { Details } from '../commons/types';
import { useTranslations } from 'next-intl';
import { ITEM_URL_PREFIX } from '../commons/constants';
export default function NewsDetails({ summary, hnItem }: Details) {
  const t = useTranslations('NewsDetails');

  return (
    <div className="py-4">
      <h2 className="text-lg font-semibold text-blue-600">{summary.title}</h2>
      <div className="space-y-4 mt-2">

        {/* 原始的文章链接 */}
        <div className="p-2 bg-gray-100 rounded">
          <h3 className="text-sm font-semibold mb-2">{t('originalStory')}</h3>
          <p className="text-sm text-blue-600">
            <a href={hnItem.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {hnItem.title}
            </a>
          </p>
        </div>

        {/* Introduction */}
        <div className="p-2 bg-gray-100 rounded">
          <h3 className="text-sm font-semibold mb-2">{t('introduction')}</h3>
          <p className="text-sm text-gray-800">{summary.introduction}</p>
        </div>


        {/* Tags */}
        {summary.tags.length > 0 && (
          <div className="p-2">
            <div className="flex flex-wrap gap-2">
              {summary.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Original Comments */}
        <div className="p-2 bg-gray-100 rounded">
          <h3 className="text-sm font-semibold mb-2">{t('userComments')}</h3>
          <p className="text-sm text-blue-600">
            <a href={ITEM_URL_PREFIX + hnItem.id} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {t('totalComments')}: {hnItem.descendants}
            </a>
          </p>

        </div>

        <div className="flex gap-2 justify-center">
          {/* Positive Comments Summary */}
          {summary.positiveCommentsSummary && (
            <div className="p-2 bg-gray-100 rounded">
              <h3 className="text-sm font-semibold mb-2">{t('positiveComments')}</h3>
              <p className="text-sm text-gray-800">{summary.positiveCommentsSummary}</p>
            </div>
          )}

          <div className="flex items-center">
            <span> VS </span>
          </div>

          {/* Negative Comments Summary */}
          {summary.negativeCommentsSummary && (
            <div className="p-2 bg-gray-100 rounded">
              <h3 className="text-sm font-semibold mb-2">{t('negativeComments')}</h3>
              <p className="text-sm text-gray-800">{summary.negativeCommentsSummary}</p>
            </div>
          )}
        </div>

        {/* Valuable Information */}
        {summary.valuableInformation.length > 0 && (
          <div className="p-2 bg-gray-100 rounded">
            <h3 className="text-sm font-semibold mb-2">{t('valuableInformation')}</h3>
            <ul className="list-disc list-inside">
              {summary.valuableInformation.map((info, index) => (
                <li key={index} className="text-sm text-gray-800 mb-1">
                  {info}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Extra Information */}
        {summary.extra && (
          <div className="p-2 bg-gray-100 rounded">
            <h3 className="text-sm font-semibold mb-2">{t('extraInfo')}</h3>
            <p className="text-sm text-gray-800">{summary.extra}</p>
          </div>
        )}
      </div>
    </div>
  );
} 