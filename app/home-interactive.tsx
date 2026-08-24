'use client';

import { useEffect, useState } from 'react';
import { calculateScrollProgress, nextAsciiIndex } from './utils';

const accentThemes = ['#E18585', '#8AAEE8', '#E6C44C', '#8FD79E', '#B585F2', '#D2D6E0'] as const;

const glyphs: Record<string, string[]> = {
  A: ['01110', '11011', '11011', '11111', '11011', '11011', '11011'],
  R: ['11110', '11011', '11011', '11110', '11100', '11010', '11011'],
  T: ['11111', '00110', '00110', '00110', '00110', '00110', '00110'],
  E: ['11111', '11000', '11000', '11110', '11000', '11000', '11111'],
  M: ['11011', '11111', '11111', '11011', '11011', '11011', '11011'],
  I: ['11111', '00110', '00110', '00110', '00110', '00110', '11111'],
  S: ['01111', '11000', '11000', '01110', '00011', '00011', '11110'],
  V: ['11011', '11011', '11011', '11011', '11011', '01110', '00100'],
};

const treatments = [
  ['█', '▓', '▒'],
  ['▓', '▒', '░'],
  ['▀', '▄', '▐'],
  ['▌', '▐', '█'],
] as const;

function renderWord(word: string, variant: number) {
  const [solid, edge, dust] = treatments[variant];
  return Array.from({ length: 7 }, (_, row) => {
    const offset = variant === 1 ? ' '.repeat((row + 1) % 3) : variant === 3 ? ' '.repeat(row % 2) : '';
    const letters = [...word].map((letter, letterIndex) =>
      glyphs[letter][row]
        .split('')
        .map((cell, column) => {
          if (cell === '0') return '   ';
          const eroded = (row * 7 + column * 3 + letterIndex * 5 + variant) % 11 === 0;
          const shaded = row > 4 || column === 4;
          const character = eroded ? dust : shaded ? edge : solid;
          return character.repeat(3);
        })
        .join(''),
    );
    const trail = variant === 0 && row > 2 ? dust.repeat(Math.max(0, row - 3)) : '';
    return `${offset}${letters.join(' ')}${trail}`;
  }).join('\n');
}

const asciiVariants = Array.from({ length: 4 }, (_, variant) =>
  `${renderWord('ARTEM', variant)}\n${renderWord('ISAEV', variant)}`,
);

export function PortfolioAscii() {
  const [step, setStep] = useState(0);
  const artIndex = step % asciiVariants.length;
  const themeIndex = step % accentThemes.length;
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
      <pre aria-hidden="true">{asciiVariants[artIndex]}</pre>
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
