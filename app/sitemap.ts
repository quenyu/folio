import type { MetadataRoute } from 'next';
import { projects } from './data';

export const dynamic = 'force-static';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://artem-isaev-portfolio.malafar-ida78755z0x.chatgpt.site');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    ...projects.map((project) => ({ url: `${siteUrl}/work/${project.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 })),
  ];
}
