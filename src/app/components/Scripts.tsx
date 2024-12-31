export default function Scripts() {
  return (
    <>
      <script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Hacker News中文",
            "url": "https://news.sunnyd.top",
            "description": "实时动态的更新Hacker News中文信息，让你快速了解全球顶尖黑客都在关注什么。实时更新最新的科技新闻、创业资讯和技术讨论, 提供中文摘要和评论总结。",
          }),
        }}
      />
      <script 
        async 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2171077611482039" 
        crossOrigin="anonymous"
      />
    </>
  );
} 