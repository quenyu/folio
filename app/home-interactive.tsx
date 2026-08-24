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

type Glyph = 'A' | 'R' | 'T' | 'E' | 'M' | 'I' | 'S' | 'V';
type GlyphSet = Record<Glyph, readonly string[]>;

const heavyGlyphs: GlyphSet = {
  A: ['0011100', '0110110', '1100011', '1100011', '1111111', '1100011', '1100011'],
  R: ['1111100', '1100110', '1100110', '1111100', '1110000', '1101100', '1100110'],
  T: ['1111111', '0011100', '0011100', '0011100', '0011100', '0011100', '0011100'],
  E: ['1111111', '1100000', '1100000', '1111110', '1100000', '1100000', '1111111'],
  M: ['1100011', '1110111', '1111111', '1101011', '1100011', '1100011', '1100011'],
  I: ['1111111', '0011100', '0011100', '0011100', '0011100', '0011100', '1111111'],
  S: ['0011110', '0110001', '1100000', '0111110', '0000011', '1000011', '0111110'],
  V: ['1100011', '1100011', '1100011', '1100011', '0110110', '0110110', '0011100'],
};

const stencilGlyphs: GlyphSet = {
  A: ['0111110', '1100011', '1100011', '1110111', '1100011', '1100011', '1100011'],
  R: ['1111110', '1100011', '1100011', '1111110', '1101100', '1100110', '1100011'],
  T: ['1110111', '0011100', '0011100', '0011100', '0011100', '0011100', '0011100'],
  E: ['1111111', '1100000', '1100000', '1110110', '1100000', '1100000', '1111111'],
  M: ['1100011', '1110111', '1111111', '1101011', '1100011', '1100011', '1100011'],
  I: ['0111110', '0001000', '0001000', '0001000', '0001000', '0001000', '0111110'],
  S: ['0011110', '1100001', '1100000', '0111110', '0000011', '1000011', '0111110'],
  V: ['1100011', '1100011', '1100011', '1100011', '0100010', '0110110', '0011100'],
};

const outlineGlyphs: GlyphSet = {
  A: ['0011100', '0100010', '1000001', '1000001', '1111111', '1000001', '1000001'],
  R: ['1111100', '1000010', '1000010', '1111100', '1010000', '1001000', '1000100'],
  T: ['1111111', '0001000', '0001000', '0001000', '0001000', '0001000', '0001000'],
  E: ['1111111', '1000000', '1000000', '1111100', '1000000', '1000000', '1111111'],
  M: ['1000001', '1100011', '1010101', '1010101', '1001001', '1000001', '1000001'],
  I: ['1111111', '0001000', '0001000', '0001000', '0001000', '0001000', '1111111'],
  S: ['0011110', '0100001', '1000000', '0111110', '0000001', '1000010', '0111100'],
  V: ['1000001', '1000001', '1000001', '1000001', '0100010', '0100010', '0011100'],
};

const scanlineGlyphs: GlyphSet = {
  A: ['0001000', '0010100', '0100010', '1000001', '1111111', '1000001', '1000001'],
  R: ['1111000', '1000100', '1000100', '1111000', '1010000', '1001000', '1000100'],
  T: ['1111111', '0001000', '0001000', '0001000', '0001000', '0001000', '0001000'],
  E: ['1111111', '1000000', '1000000', '1111100', '1000000', '1000000', '1111111'],
  M: ['1000001', '1100011', '1010101', '1001001', '1000001', '1000001', '1000001'],
  I: ['0011100', '0001000', '0001000', '0001000', '0001000', '0001000', '0011100'],
  S: ['0011110', '0100001', '1000000', '0111110', '0000001', '1000010', '0111100'],
  V: ['1000001', '1000001', '1000001', '1000001', '0100010', '0100010', '0010100'],
};

type AsciiDefinition = {
  name: 'heavy' | 'stencil' | 'outline' | 'scanline';
  glyphs: GlyphSet;
  core: (row: number, column: number, letter: number) => string;
  dust: readonly [string, string, string];
  seed: number;
};

const asciiDefinitions: readonly AsciiDefinition[] = [
  { name: 'heavy', glyphs: heavyGlyphs, core: (row, column) => (row + column) % 5 === 0 ? '▓█' : '██', dust: ['░ ', ' ░', '▒ '], seed: 3 },
  { name: 'stencil', glyphs: stencilGlyphs, core: (row, column, letter) => (column + letter) % 3 === 1 ? '█│' : row === 3 ? '▓█' : '██', dust: ['· ', ' │', '╵ '], seed: 11 },
  { name: 'outline', glyphs: outlineGlyphs, core: (row, column) => (row + column) % 2 === 0 ? '█▓' : '▓█', dust: ['░ ', '▒ ', ' ░'], seed: 19 },
  { name: 'scanline', glyphs: scanlineGlyphs, core: (row) => row % 2 === 0 ? '▀▀' : '▄▄', dust: ['─ ', ' ─', '· '], seed: 29 },
];

function hasCoreNeighbor(mask: readonly string[], row: number, column: number) {
  return [
    [row - 1, column],
    [row + 1, column],
    [row, column - 1],
    [row, column + 1],
  ].some(([nextRow, nextColumn]) => mask[nextRow]?.[nextColumn] === '1');
}

function renderWord(word: readonly Glyph[], definition: AsciiDefinition, coreOnly: boolean) {
  const letterGap = '    ';
  return Array.from({ length: 7 }, (_, row) =>
    word.map((letter, letterIndex) => {
      const mask = definition.glyphs[letter];
      return mask[row].split('').map((cell, column) => {
        if (cell === '1') return coreOnly ? '██' : definition.core(row, column, letterIndex);
        if (coreOnly || !hasCoreNeighbor(mask, row, column)) return '  ';
        const hash = row * 17 + column * 13 + letterIndex * 7 + definition.seed;
        return hash % 11 === 0 ? definition.dust[hash % definition.dust.length] : '  ';
      }).join('');
    }).join(letterGap).padEnd(87, ' '),
  );
}

function buildArtwork(definition: AsciiDefinition, coreOnly: boolean) {
  const top = renderWord(['A', 'R', 'T', 'E', 'M'], definition, coreOnly);
  const bottom = renderWord(['I', 'S', 'A', 'E', 'V'], definition, coreOnly);
  const rowWidth = top[0].length;
  const lines = [...top, ' '.repeat(rowWidth), ...bottom];
  if (lines.some((line) => line.length !== rowWidth)) throw new Error('ASCII artwork rows must have equal length');
  return lines.join('\n');
}

export const asciiVariantNames = asciiDefinitions.map(({ name }) => name);
export const asciiCoreVariants = asciiDefinitions.map((definition) => buildArtwork(definition, true));
export const baseAscii = asciiCoreVariants[0];
export const asciiVariants = asciiDefinitions.map((definition) => buildArtwork(definition, false));

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
