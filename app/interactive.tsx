'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { calculateScrollProgress, completeCommand, nextAsciiIndex, parseCommand } from './utils';

const asciiVariants = [
  String.raw` █████╗ ██████╗ ████████╗███████╗███╗   ███╗
██╔══██╗██╔══██╗╚══██╔══╝██╔════╝████╗ ████║
███████║██████╔╝   ██║   █████╗  ██╔████╔██║
██╔══██║██╔══██╗   ██║   ██╔══╝  ██║╚██╔╝██║
██║  ██║██║  ██║   ██║   ███████╗██║ ╚═╝ ██║
╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝     ╚═╝

██╗███████╗ █████╗ ███████╗██╗   ██╗
██║██╔════╝██╔══██╗██╔════╝██║   ██║
██║███████╗███████║█████╗  ██║   ██║
██║╚════██║██╔══██║██╔══╝  ╚██╗ ██╔╝
██║███████║██║  ██║███████╗ ╚████╔╝
╚═╝╚══════╝╚═╝  ╚═╝╚══════╝  ╚═══╝`,
  String.raw`┌───┐ ┌──┐  ┌────┐ ┌────┐ ┌┐  ┌┐
│┌─┐│ │┌─┐│ └─┐┌─┘ │┌───┘ │└┐┌┘│
│████│ │██┌┘   ││   │███   │┌┘└┐│
│┌─┐│ │┌─┐│   ││   │┌──   ││  ││
││ ││ ││ ││   ││   │└───┐ ││  ││
└┘ └┘ └┘ └┘   └┘   └────┘ └┘  └┘

┌┐ ┌────┐ ┌───┐ ┌────┐ ┌┐  ┌┐
││ │┌───┘ │┌─┐│ │┌───┘ ││  ││
││ │████┐ │███│ │███   ││  ││
││ └───┐│ │┌─┐│ │┌──   └┐┐┌┌┘
││ ┌───┘│ ││ ││ │└───┐  └██┘
└┘ └────┘ └┘ └┘ └────┘   └┘`,
  String.raw`▓▓▓▓▓  ▓▓▓▓   ▓▓▓▓▓  ▓▓▓▓▓  ▓▓   ▓▓
▓   ▓  ▓   ▓    ▓    ▓      ▓▓ ▓▓▓▓
▓▓▓▓▓  ▓▓▓▓     ▓    ▓▓▓    ▓ ▓ ▓ ▓
▓   ▓  ▓  ▓     ▓    ▓      ▓   ▓ ▓
▓   ▓  ▓   ▓    ▓    ▓▓▓▓▓  ▓   ▓ ▓

▓  ▓▓▓▓▓  ▓▓▓▓▓  ▓▓▓▓▓  ▓   ▓
▓  ▓      ▓   ▓  ▓      ▓   ▓
▓  ▓▓▓▓▓  ▓▓▓▓▓  ▓▓▓     ▓ ▓
▓      ▓  ▓   ▓  ▓▓▓      ▓
▓  ▓▓▓▓▓  ▓   ▓  ▓▓▓▓▓    ▓`,
  String.raw`    /\     |\  |  -----  |===   |\  /|
   /  \    | \ |    |    |      | \/ |
  /----\   |--<     |    |===   |    |
 /      \  |   \    |    |      |    |
/        \ |    \   |    |====  |    |

|  /----  /\    |===  \        /
|  \___  /  \   |      \      /
|      \ /----\  |===    \ /\ /
|  ____/ /    \  |        \/  \/`,
];

export function BootSequence() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seen = window.sessionStorage.getItem('artem-portfolio-boot') === 'seen';
    const delay = reduced || seen ? 0 : 980;
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem('artem-portfolio-boot', 'seen');
      setVisible(false);
    }, delay);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="boot-sequence" role="status" aria-live="polite">
      <div className="boot-log">
        <p>[artem@portfolio]</p>
        <p>loading identity........... ok</p>
        <p>loading selected work...... ok</p>
        <p>loading interface.......... ok</p>
        <p className="boot-ready">ready<span className="cursor">_</span></p>
        <button
          type="button"
          onClick={() => {
            window.sessionStorage.setItem('artem-portfolio-boot', 'seen');
            setVisible(false);
          }}
        >
          пропустить →
        </button>
      </div>
    </div>
  );
}

export function AsciiName() {
  const [index, setIndex] = useState(0);
  const switchVariant = () => setIndex((current) => nextAsciiIndex(current, asciiVariants.length));

  return (
    <button className="ascii-button" type="button" onClick={switchVariant} aria-label="Сменить ASCII-композицию имени Артём Исаев">
      <span className="sr-only">Артём Исаев</span>
      <pre className="ascii-name" aria-hidden="true">{asciiVariants[index]}</pre>
      <span className="mobile-name" aria-hidden="true">ARTEM<br />ISAEV</span>
      <span className="ascii-hint" aria-hidden="true">[ click / enter — сменить композицию {index + 1}/{asciiVariants.length} ]</span>
    </button>
  );
}

export function StatusLine({ fallback = 'intro' }: { fallback?: string }) {
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState(fallback);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      setProgress(calculateScrollProgress(window.scrollY, root.scrollHeight, root.clientHeight));
      const sections = [...document.querySelectorAll<HTMLElement>('[data-section]')];
      const current = sections.filter((node) => node.getBoundingClientRect().top <= window.innerHeight * 0.45).at(-1);
      setSection(current?.dataset.section ?? fallback);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [fallback]);

  const filled = Math.round(progress / 10);
  return (
    <div className="status-line" role="status" aria-label={`Раздел ${section}, прокрутка ${progress}%`}>
      <span>[artem@portfolio]</span>
      <span>▸ {section}</span>
      <span className="status-track" aria-hidden="true">{'█'.repeat(filled)}{'░'.repeat(10 - filled)}</span>
      <span>{progress.toString().padStart(2, '0')}%</span>
      <span>KLG</span>
    </div>
  );
}

const commandMessages = {
  help: 'help · work · services · about · contact · theme · clear',
  work: 'Переход к выбранным работам.',
  services: 'Переход к услугам.',
  about: 'Переход к разделу об авторе.',
  contact: 'Переход к контактам.',
  theme: 'Контраст интерфейса переключён.',
  clear: '',
} as const;

export function TerminalConsole() {
  const [value, setValue] = useState('');
  const [output, setOutput] = useState('Введите help или используйте обычную навигацию выше.');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const runCommand = (event: FormEvent) => {
    event.preventDefault();
    const command = parseCommand(value);
    if (value.trim()) setHistory((items) => [value.trim(), ...items].slice(0, 12));
    setHistoryIndex(-1);
    if (command === 'unknown') {
      setOutput(`Команда «${value.trim()}» не найдена. Введите help.`);
      setValue('');
      return;
    }
    if (command === 'clear') setOutput('');
    else setOutput(commandMessages[command]);
    if (['work', 'services', 'about', 'contact'].includes(command)) document.getElementById(command)?.scrollIntoView({ behavior: 'smooth' });
    if (command === 'theme') {
      const root = document.documentElement;
      root.dataset.contrast = root.dataset.contrast === 'high' ? 'default' : 'high';
    }
    setValue('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab' && value) {
      event.preventDefault();
      setValue(completeCommand(value));
    }
    if (event.key === 'ArrowUp' && history.length) {
      event.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setValue(history[next]);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = Math.max(historyIndex - 1, -1);
      setHistoryIndex(next);
      setValue(next === -1 ? '' : history[next]);
    }
  };

  return (
    <div className="terminal-console">
      <p className="terminal-output" aria-live="polite">{output || '\u00a0'}</p>
      <form onSubmit={runCommand}>
        <label htmlFor="terminal-command">Команда</label>
        <span aria-hidden="true">artem@portfolio %</span>
        <input ref={inputRef} id="terminal-command" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown} autoComplete="off" spellCheck={false} placeholder="help" />
        <button type="submit">run ↵</button>
      </form>
      <p className="terminal-help">tab — дополнить · ↑↓ — история · enter — выполнить</p>
    </div>
  );
}
