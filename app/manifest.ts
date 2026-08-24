import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Артём Исаев — portfolio',
    short_name: 'Артём Исаев',
    description: 'Web designer + frontend developer из Калуги.',
    start_url: '/',
    display: 'standalone',
    background_color: '#040406',
    theme_color: '#040406',
    lang: 'ru',
    icons: [{ src: '/favicon.png', sizes: '64x64', type: 'image/png' }],
  };
}
