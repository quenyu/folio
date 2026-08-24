import Link from 'next/link';
import { DocumentStatus, PortfolioAscii } from './home-interactive';
import { process, profile, projects, services } from './data';

const projectCopy = {
  'techdelo-40': ['Каталог аренды спецтехники: ', 'фильтры, карточки техники и заявка', ' в одном понятном сценарии.'],
  poluton: ['Сайт specialty coffee: бренд-система, ', 'меню и быстрый предзаказ', '.'],
  'gran-auto': ['Сайт кузовного центра: услуги, примеры работ и ', 'предварительная оценка по фото', '.'],
} as const;

export const separators = {
  robot: ['  _[]_', ' [o  o]', ' |====|'].join('\n'),
  rabbit: [' (\\_/)', ' (o.o)', 'c(")(")'].join('\n'),
  cat: [' /\\v/\\', '(=o.o=)', ' (   )'].join('\n'),
} as const;

function AsciiSeparator({ variant }: { variant: keyof typeof separators }) {
  return <pre className="ascii-separator" aria-hidden="true">{separators[variant]}</pre>;
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
          <p className="intro-copy intro-copy--dim">Исследую задачу и объединяю <mark>структуру, дизайн и разработку</mark>: от Figma до запуска адаптивного сайта.</p>
          <nav className="intro-links" aria-label="Контакты">
            <a href={profile.contacts.telegram.href} target="_blank" rel="noreferrer">telegram</a>
            <a href={profile.contacts.github.href} target="_blank" rel="noreferrer">github</a>
          </nav>
          <AsciiSeparator variant="robot" />
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

          <AsciiSeparator variant="rabbit" />

          <section className="doc-section about-doc" id="about" data-section="about" aria-labelledby="about-title">
            <h2 id="about-title">{'// about'}</h2>
            <p>Я <mark>Артём Исаев</mark>, web designer и frontend developer из Калуги. Изучаю задачу, проектирую понятную структуру, собираю дизайн в Figma и запускаю адаптивный сайт.</p>
          </section>

          <AsciiSeparator variant="cat" />

          <section className="doc-section contact-doc" id="contact" data-section="contact" aria-labelledby="contact-title">
            <h2 id="contact-title">{'// contact'}</h2>
            <p className="contact-doc__lead">Открыт к новым проектам. Быстрее всего отвечаю в Telegram.</p>
            <dl>
              <div><dt>telegram</dt><dd><a href={profile.contacts.telegram.href} target="_blank" rel="noreferrer">{profile.contacts.telegram.label} ↗</a></dd></div>
              <div><dt>github</dt><dd><a href={profile.contacts.github.href} target="_blank" rel="noreferrer">{profile.contacts.github.label} ↗</a></dd></div>
              {profile.contacts.email ? <div><dt>email</dt><dd><a href={profile.contacts.email.href}>{profile.contacts.email.label}</a></dd></div> : null}
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
