import Link from 'next/link';
import { DocumentStatus, PortfolioAscii } from './home-interactive';
import { process, profile, projects, services } from './data';

const projectCopy = {
  'techdelo-40': ['Каталог аренды спецтехники: ', 'фильтры, detail pages и заявка', ' в одном production-интерфейсе.'],
  poluton: ['Сайт specialty coffee с бренд-системой, ', 'меню и предзаказом', ', доступными без WebGL.'],
  'gran-auto': ['Сайт кузовного центра с услугами, сравнениями и ', 'оценкой по фото', ' в пяти шагах.'],
} as const;

function AsciiBreak({ variant = 'cat' }: { variant?: 'cat' | 'key' | 'signal' }) {
  const art = {
    cat: ' /\\_/\\\n( o.o )\n > ^ <',
    key: '  ┌─┐\n──┤ │\n  └─┘',
    signal: '  .  \n .|. \n--+--\n  |',
  }[variant];
  return <pre className="ascii-break" aria-hidden="true">{art}</pre>;
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#content">Перейти к содержанию</a>

      <div className="shell">
        <header className="terminal-intro" id="top" data-section="intro">
          <p className="terminal-prompt"><span>artem@isaev</span> ~ % ./portfolio<span className="block-cursor" aria-hidden="true" /></p>
          <h1 className="sr-only">Артём Исаев — веб-дизайнер и frontend-разработчик</h1>
          <PortfolioAscii />
          <p className="role-label">web designer + frontend developer</p>
          <p className="intro-copy">Проектирую и разрабатываю сайты для локального бизнеса и B2B-компаний.</p>
          <p className="intro-copy intro-copy--dim">Исследую задачу, собираю <mark>структуру, дизайн и frontend</mark>, а затем довожу интерфейс до запуска.</p>
          <nav className="intro-links" aria-label="Контакты">
            <a href={profile.telegram} target="_blank" rel="noreferrer">telegram</a>
            <a href={profile.github} target="_blank" rel="noreferrer">github</a>
          </nav>
          <AsciiBreak />
        </header>

        <main id="content">
          <section className="doc-section work-index" id="work" data-section="selected-work" aria-labelledby="work-title">
            <h2 id="work-title">{'// selected work'}</h2>
            <div className="work-list">
              {projects.map((project) => {
                const [lead, highlight, tail] = projectCopy[project.slug as keyof typeof projectCopy];
                return (
                  <article className="work-entry" key={project.slug}>
                    <div className="work-entry__heading">
                      <span className="work-entry__index">{project.index}</span>
                      <Link href={`/work/${project.slug}`} prefetch={false}>{project.title}</Link>
                      <span className="work-entry__meta">{project.year} · {project.category.split('·')[0].trim()}</span>
                    </div>
                    <p>{lead}<mark>{highlight}</mark>{tail}</p>
                    <Link className="text-cta" href={`/work/${project.slug}`} prefetch={false}><span aria-hidden="true">▸</span> открыть кейс</Link>
                  </article>
                );
              })}
            </div>
          </section>

          <AsciiBreak variant="key" />

          <section className="doc-section" id="services" data-section="services" aria-labelledby="services-title">
            <h2 id="services-title">{'// services'}</h2>
            <ol className="compact-list service-index">
              {services.map(([index, title, description]) => (
                <li key={index}>
                  <span>{index}</span>
                  <div><h3>{title}</h3><p>{description}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <section className="doc-section" id="process" data-section="process" aria-labelledby="process-title">
            <h2 id="process-title">{'// process'}</h2>
            <ol className="compact-list process-log">
              {process.map(([index, title, description]) => (
                <li key={index}>
                  <span>{index}</span>
                  <div><h3>{title}</h3><p>{description}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <AsciiBreak variant="signal" />

          <section className="doc-section about-doc" id="about" data-section="about" aria-labelledby="about-title">
            <h2 id="about-title">{'// about'}</h2>
            <p>Я <mark>Артём Исаев</mark>, web designer и frontend developer из Калуги. Исследую задачу, проектирую понятную структуру, собираю визуальную систему в Figma и реализую адаптивный frontend — от первой схемы до production build.</p>
          </section>

          <section className="doc-section contact-doc" id="contact" data-section="contact" aria-labelledby="contact-title">
            <h2 id="contact-title">{'// contact'}</h2>
            <dl>
              <div><dt>telegram</dt><dd><a href={profile.telegram} target="_blank" rel="noreferrer">t.me/wqeqadas ↗</a></dd></div>
              <div><dt>github</dt><dd><a href={profile.github} target="_blank" rel="noreferrer">github.com/quenyu ↗</a></dd></div>
              <div><dt>based</dt><dd>{profile.location}, RU</dd></div>
            </dl>
          </section>
        </main>

        <footer className="document-footer">
          <p>© 2026 Артём Исаев · Калуга</p>
          <a href="#top">reload ↑</a>
        </footer>
      </div>

      <DocumentStatus />
    </>
  );
}
