export const runtime = 'edge';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/app/components/Header";
import Scripts from "@/app/components/Scripts";
import { getMessages } from 'next-intl/server';
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";

type Messages = {
  Metadata: {
    title: string;
    description: string;
    keywords: string;
    ogDescription: string;
  };
  [key: string]: any;
};

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const messages = (await getMessages()) as Messages;
  const localeForOG = locale === 'zh' ? 'zh_CN' : 'en_US';

  return {
    title: messages.Metadata.title,
    description: messages.Metadata.description,
    keywords: messages.Metadata.keywords,
    openGraph: {
      title: messages.Metadata.title,
      description: messages.Metadata.ogDescription,
      type: "website",
      locale: localeForOG,
      url: "https://news.sunnyd.top",
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  // const messages = await getMessages();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Scripts />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="max-w-4xl mx-auto">
            <Header />
            {children}
          </div>
        </NextIntlClientProvider>

        <hr className="max-w-4xl mx-auto my-4 border-gray-200" />

        <footer>
          <div className="max-w-4xl mx-auto my-2 flex justify-between items-center">
            <p>© 2025 SunnyD. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
