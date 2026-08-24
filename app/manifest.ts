import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Артём Исаев — portfolio',
    short_name: 'Артём Исаев',
    description: 'Web designer + frontend developer из Калуги.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080808',
    theme_color: '#080808',
    lang: 'ru',
    icons: [{ src: '/favicon.png', sizes: '64x64', type: 'image/png' }],
  };
}
