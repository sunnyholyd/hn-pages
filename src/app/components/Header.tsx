import React from 'react';
import Link from 'next/link';

export default function Header() {
  const navs = [
    { label: '月度热门', path: '/monthly-top' },
  ];

  return (
    <header className="bg-orange-500">
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center">
          {/* 左侧主标题 */}
          <Link href="/" className="text-white font-bold text-xl mr-8">
            Hacker News
          </Link>

          {/* 导航 */}
          <nav className="flex items-center space-x-4">
            <Link href="/" className="text-white/90 hover:text-white text-sm">
              News
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
      </div>
    </header>
  );
}
