import { describe, expect, it } from 'vitest';
import { process, profile, projects, services } from '../app/data';
import { accentThemes, asciiCoreVariants, asciiCycleLength, asciiVariantNames, asciiVariants } from '../app/home-interactive';
import { separators } from '../app/page';
import { calculateScrollProgress, nextAsciiIndex } from '../app/utils';

describe('portfolio content', () => {
  it('contains exactly three ordered, unique projects', () => {
    expect(projects.map((project) => project.index)).toEqual(['01', '02', '03']);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(3);
  });

  it('keeps every project connected to confirmed production and GitHub URLs', () => {
    expect(projects.map(({ liveUrl, githubUrl }) => [liveUrl, githubUrl])).toEqual([
      ['https://techdelo-40.vercel.app', 'https://github.com/quenyu/techdelo-40'],
      ['https://poluton-coffee.vercel.app', 'https://github.com/quenyu/poluton-coffee'],
      ['https://gran-auto.vercel.app', 'https://github.com/quenyu/gran-auto'],
    ]);
    expect(projects.every((project) => !project.liveUrl.includes('-demo') && !project.githubUrl.includes('-demo'))).toBe(true);
    expect(projects.every((project) => project.format === 'самостоятельный проект')).toBe(true);
  });

  it('keeps homepage project copy in the validated project records', () => {
    expect(projects.map((project) => project.homeCopy.join(''))).toEqual([
      'Каталог аренды спецтехники: фильтры, карточки техники и заявка в одном понятном сценарии.',
      'Сайт specialty coffee: бренд-система, меню и быстрый предзаказ.',
      'Сайт кузовного центра: услуги, примеры работ и предварительная оценка по фото.',
    ]);
  });

  it('does not invent an email contact', () => {
    expect(profile.contacts.email).toBeNull();
    expect(profile.contacts.telegram).toEqual({ label: 't.me/wqeqadas', href: 'https://t.me/wqeqadas' });
    expect(profile.contacts.github).toEqual({ label: 'github.com/quenyu', href: 'https://github.com/quenyu' });
  });

  it('uses concise, client-readable service and process copy', () => {
    expect(services).toEqual([
      ['01', 'Лендинг / корпоративный сайт', 'Исследую задачу, собираю структуру, создаю дизайн в Figma и готовый интерфейс для услуги или компании.'],
      ['02', 'Редизайн и UX-структура', 'Проверяю существующий сайт, перестраиваю навигацию и аккуратно переношу полезный контент.'],
      ['03', 'Frontend-реализация', 'Собираю быстрый и надёжный сайт с рабочими страницами, формами и интерактивными состояниями.'],
      ['04', 'Адаптив и запуск', 'Проверяю сайт на основных экранах, исправляю ошибки и публикую готовую версию.'],
    ]);
    expect(process).toEqual([
      ['01', 'research', 'Бизнес, аудитория, задача и ограничения.'],
      ['02', 'structure', 'Структура сайта и путь пользователя.'],
      ['03', 'design', 'Прототип, визуальная система и ключевые экраны.'],
      ['04', 'build + launch', 'Адаптивная разработка, проверка и публикация.'],
    ]);
  });

  it('uses the required accent order with muted coral as the default offset', () => {
    expect(accentThemes).toEqual(['#8AAEE8', '#E6C44C', '#E18585', '#8FD79E', '#B585F2', '#D2D6E0']);
  });

  it('preserves the three required separators exactly', () => {
    expect(separators.robot).toBe('  _[]_\n [o  o]\n |====|');
    expect(separators.rabbit).toBe(' (\\_/)\n (o.o)\nc(")(")');
    expect(separators.cat).toBe(' /\\v/\\\n(=o.o=)\n (   )');
  });

  it('uses four distinct, named ASCII constructions with rectangular intact cores', () => {
    expect(asciiVariantNames).toEqual(['heavy', 'stencil', 'outline', 'scanline']);
    expect(new Set(asciiCoreVariants)).toHaveLength(4);
    expect(asciiVariants).toHaveLength(4);
    for (const [variantIndex, variant] of asciiVariants.entries()) {
      const lines = variant.split('\n');
      const core = asciiCoreVariants[variantIndex];
      expect(lines).toHaveLength(15);
      expect(new Set(lines.map((line) => line.length))).toEqual(new Set([87]));
      for (let index = 0; index < core.length; index += 1) {
        if (core[index] !== ' ' && core[index] !== '\n') expect(variant[index]).not.toBe(' ');
      }
    }
  });

  it('derives the full ASCII/theme cycle rather than using an unexplained bound', () => {
    expect(asciiCycleLength).toBe(12);
  });
});

describe('interface calculations', () => {
  it('clamps scroll progress', () => {
    expect(calculateScrollProgress(500, 2000, 1000)).toBe(50);
    expect(calculateScrollProgress(-20, 1000, 1000)).toBe(0);
    expect(calculateScrollProgress(4000, 2000, 1000)).toBe(100);
  });

  it('cycles ASCII variants without overflow', () => {
    expect(nextAsciiIndex(3, 4)).toBe(0);
    expect(nextAsciiIndex(0, 0)).toBe(0);
  });
});
