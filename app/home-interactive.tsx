'use client';

import { useEffect, useState } from 'react';
import { calculateScrollProgress, nextAsciiIndex } from './utils';

export const accentThemes = [
  '#8AAEE8',
  '#E6C44C',
  '#E18585',
  '#8FD79E',
  '#B585F2',
  '#D2D6E0',
] as const;

const defaultThemeIndex = 2;

const glyphs: Record<string, readonly string[]> = {
  A: ['01110', '11011', '11011', '11111', '11011', '11011', '11011'],
  R: ['11110', '11011', '11011', '11110', '11100', '11010', '11011'],
  T: ['11111', '00110', '00110', '00110', '00110', '00110', '00110'],
  E: ['11111', '11000', '11000', '11110', '11000', '11000', '11111'],
  M: ['11011', '11111', '11111', '11011', '11011', '11011', '11011'],
  I: ['11111', '00110', '00110', '00110', '00110', '00110', '11111'],
  S: ['01111', '11000', '11000', '01110', '00011', '00011', '11110'],
  V: ['11011', '11011', '11011', '11011', '11011', '01110', '00100'],
};

type Treatment = {
  core: (row: number, column: number, letter: number) => string;
  dust: readonly [string, string, string];
  seed: number;
};

const treatments: readonly Treatment[] = [
  {
    core: (row, column) => row < 2 || column === 0 ? '███' : '▓▓▓',
    dust: ['░  ', ' ░ ', '  ░'],
    seed: 3,
  },
  {
    core: (row, column) => (row + column) % 2 === 0 ? '▀██' : '▄██',
    dust: ['▒  ', ' ▒ ', '  ▒'],
    seed: 11,
  },
  {
    core: (row, column) => (row + column) % 2 === 0 ? '█▓█' : '▓█▓',
    dust: ['▒  ', ' ▒ ', '  ▒'],
    seed: 19,
  },
  {
    core: (row, column, letter) => (row + column + letter) % 3 === 0 ? '██▒' : '▒██',
    dust: ['░  ', ' ░ ', '  ░'],
    seed: 29,
  },
];

function hasCoreNeighbor(mask: readonly string[], row: number, column: number) {
  return [
    [row - 1, column],
    [row + 1, column],
    [row, column - 1],
    [row, column + 1],
  ].some(([nextRow, nextColumn]) => mask[nextRow]?.[nextColumn] === '1');
}

function renderWord(word: string, treatment: Treatment | null) {
  const letterGap = '   ';
  return Array.from({ length: 7 }, (_, row) =>
    [...word].map((letter, letterIndex) => {
      const mask = glyphs[letter];
      return mask[row].split('').map((cell, column) => {
        if (cell === '1') return treatment?.core(row, column, letterIndex) ?? '███';
        if (!treatment || !hasCoreNeighbor(mask, row, column)) return '   ';
        const hash = row * 17 + column * 13 + letterIndex * 7 + treatment.seed;
        return hash % 7 === 0 ? treatment.dust[hash % treatment.dust.length] : '   ';
      }).join('');
    }).join(letterGap),
  );
}

function buildArtwork(treatment: Treatment | null) {
  const top = renderWord('ARTEM', treatment);
  const bottom = renderWord('ISAEV', treatment);
  const rowWidth = top[0].length;
  const lines = [...top, ' '.repeat(rowWidth), ...bottom];
  if (lines.some((line) => line.length !== rowWidth)) throw new Error('ASCII artwork rows must have equal length');
  return lines.join('\n');
}

export const baseAscii = buildArtwork(null);
export const asciiVariants = treatments.map((treatment) => buildArtwork(treatment));

function ArtworkGrid({ art, className }: { art: string; className: string }) {
  const lines = art.split('\n');
  return (
    <span className={className} aria-hidden="true">
      {lines.flatMap((line, row) => [...line].map((character, column) => character === ' ' ? null : (
        <span key={`${row}-${column}`} style={{ gridColumnStart: column + 1, gridRowStart: row + 1 }}>{character}</span>
      )))}
    </span>
  );
}

export function PortfolioAscii() {
  const [step, setStep] = useState(0);
  const artIndex = step % asciiVariants.length;
  const themeIndex = (step + defaultThemeIndex) % accentThemes.length;
  const switchVariant = () => setStep((current) => nextAsciiIndex(current, 12));

  useEffect(() => {
    document.documentElement.style.setProperty('--ac', accentThemes[themeIndex]);
    document.documentElement.dataset.accent = String(themeIndex);
  }, [themeIndex]);

  return (
    <button
      className="portfolio-ascii"
      type="button"
      onClick={switchVariant}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          switchVariant();
        }
      }}
      aria-label={`Сменить ASCII-композицию и цветовую тему. Вариант ${artIndex + 1} из ${asciiVariants.length}, тема ${themeIndex + 1} из ${accentThemes.length}`}
    >
      <ArtworkGrid key={artIndex} art={asciiVariants[artIndex]} className="portfolio-ascii__grid portfolio-ascii__effect" />
      <span className="sr-only">Артём Исаев</span>
    </button>
  );
}

export function DocumentStatus({ fallback = 'intro' }: { fallback?: string }) {
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState(fallback);
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      setProgress(calculateScrollProgress(window.scrollY, root.scrollHeight, root.clientHeight));
      const sections = [...document.querySelectorAll<HTMLElement>('[data-section]')];
      const current = sections.filter((node) => node.getBoundingClientRect().top <= window.innerHeight * 0.42).at(-1);
      setSection(current?.dataset.section ?? fallback);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const updateClock = () => setTime(new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(new Date()));
    const initialClock = window.setTimeout(updateClock, 0);
    const clock = window.setInterval(updateClock, 30_000);
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.clearTimeout(initialClock);
      window.clearInterval(clock);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [fallback]);

  return (
    <div className="document-status" role="status" aria-label={`Раздел ${section}, прокрутка ${progress}%`}>
      <span>[artem@isaev] <b aria-hidden="true">▸</b> {section}</span>
      <span className="document-status__right">
        <span className="document-status__track" aria-hidden="true"><i style={{ width: `${progress}%` }} /></span>
        <span>{progress.toString().padStart(2, '0')}%</span>
        <time>{time}</time>
      </span>
    </div>
  );
}
