import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { profile } from './data';

const mono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://artem-isaev-portfolio.malafar-ida78755z0x.chatgpt.site',
  ),
  title: {
    default: 'Артём Исаев — web designer + frontend developer',
    template: '%s · Артём Исаев',
  },
  description: 'Проектирую и разрабатываю сайты для бизнеса: исследование, структура, дизайн в Figma, адаптивная разработка и запуск.',
  alternates: { canonical: '/' },
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon.png' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    title: 'Артём Исаев — web designer + frontend developer',
    description: 'Сайты для бизнеса: исследование, структура, дизайн в Figma, адаптивная разработка и запуск.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Артём Исаев — web designer + frontend developer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Артём Исаев — web designer + frontend developer',
    description: 'Сайты для бизнеса: от структуры до production.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    address: { '@type': 'PostalAddress', addressLocality: profile.location, addressCountry: 'RU' },
    sameAs: [profile.github, profile.telegram],
  };

  return (
    <html lang="ru">
      <body className={`${mono.className} ${mono.variable}`}>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }} />
      </body>
    </html>
  );
}
