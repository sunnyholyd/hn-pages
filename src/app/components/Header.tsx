'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('Header');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navs = [
    { label: 'Top', path: `/top` },
  ];

  const switchLocale = locale === 'en' ? 'zh' : 'en';

  // 移除当前路径中的语言前缀以获取基本路径
  const basePath = pathname.replace(/^\/[^\/]+/, '');
  
  // 获取当前URL的查询参数
  const queryString = searchParams.toString();
  const fullPath = queryString ? `${basePath ? basePath : '/'}?${queryString}` : (basePath ? basePath : '/');

  console.log("basePath", basePath);
  console.log("queryString", queryString);
  console.log("fullPath", fullPath);

  return (
    <header className="bg-orange-500">
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* 左侧主标题 */}
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl mr-8">
              {t('title')}
            </Link>

            {/* 导航 */}
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-white/90 hover:text-white text-sm">
                {t('news')}
              </Link>
              <span className="text-white/90 text-sm mx-2">·</span>
              {navs.map((nav) => (
                <React.Fragment key={nav.path}>
                  <Link
                    href={nav.path}
                    className="text-sm text-white/90 hover:text-white"
                  >
                    {nav.label}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* 右侧语言切换按钮 */}
          <div className="flex items-center">
            <Link
              href={fullPath}
              className="text-white/90 hover:text-white text-sm border border-white/30 rounded px-3 py-1"
              locale={switchLocale}
            >
              {switchLocale.toUpperCase()}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
