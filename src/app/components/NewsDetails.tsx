import React from 'react';
import { Details } from '../commons/types';
import { useTranslations } from 'next-intl';
import { ITEM_URL_PREFIX } from '../commons/constants';
import InfoSection from './InfoSection';

export default function NewsDetails({ summary, hnItem }: Details) {
  const t = useTranslations('NewsDetails');

  return (
    <div className="py-4">
      <h2 className="text-lg font-semibold text-blue-600">{summary.title}</h2>
      <div className="space-y-4 mt-2">
        
        <InfoSection title={t('originalStory')}>
          <p className="text-sm text-blue-600">
            <a href={hnItem.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {hnItem.title}
            </a>
          </p>
        </InfoSection>

        <InfoSection title={t('introduction')}>
          <p className="text-sm text-gray-800">{summary.introduction}</p>
        </InfoSection>

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

        <InfoSection title={t('userComments')}>
          <p className="text-sm text-blue-600">
            <a href={ITEM_URL_PREFIX + hnItem.id} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {t('totalComments')}: {hnItem.descendants}
            </a>
          </p>
        </InfoSection>

        <div className="flex gap-2 justify-center">
          {summary.positiveCommentsSummary && (
            <InfoSection title={t('positiveComments')}>
              <p className="text-sm text-gray-800">{summary.positiveCommentsSummary}</p>
            </InfoSection>
          )}

          <div className="flex items-center">
            <span> VS </span>
          </div>

          {summary.negativeCommentsSummary && (
            <InfoSection title={t('negativeComments')}>
              <p className="text-sm text-gray-800">{summary.negativeCommentsSummary}</p>
            </InfoSection>
          )}
        </div>

        {summary.valuableInformation.length > 0 && (
          <InfoSection title={t('valuableInformation')}>
            <ul className="list-disc list-inside">
              {summary.valuableInformation.map((info, index) => (
                <li key={index} className="text-sm text-gray-800 mb-1">
                  {info}
                </li>
              ))}
            </ul>
          </InfoSection>
        )}

        {summary.extra && (
          <InfoSection title={t('extraInfo')}>
            <p className="text-sm text-gray-800">{summary.extra}</p>
          </InfoSection>
        )}
      </div>
    </div>
  );
} 