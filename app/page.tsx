/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { AsciiName, BootSequence, StatusLine, TerminalConsole } from './interactive';
import { process, profile, projects, services } from './data';

export default function Home() {
  return (
    <>
      <BootSequence />
      <a className="skip-link" href="#content">Перейти к содержанию</a>

      <header className="site-header">
        <a className="terminal-id" href="#top" aria-label="В начало страницы">[artem@portfolio]</a>
        <nav aria-label="Основная навигация">
          <a href="#work">работы</a>
          <a href="#services">услуги</a>
          <a href="#about">обо мне</a>
          <a href="#contact">контакт</a>
        </nav>
      </header>

      <main id="content">
        <section className="hero" id="top" data-section="intro" aria-labelledby="hero-title">
          <p className="command" aria-hidden="true">artem@isaev ~ % ./portfolio<span className="cursor">_</span></p>
          <h1 id="hero-title"><AsciiName /></h1>

          <div className="hero-meta">
            <p className="eyebrow">web designer + frontend developer</p>
            <p className="hero-copy">Проектирую и разрабатываю сайты для бизнеса: от исследования и структуры до адаптивного frontend и запуска.</p>
            <div className="hero-actions">
              <a className="primary-link" href="#work"><span aria-hidden="true">▸</span> посмотреть работы</a>
              <a href="#contact"><span aria-hidden="true">▸</span> обсудить проект</a>
            </div>
          </div>
        </section>

        <section className="section work-section" id="work" data-section="selected-work" aria-labelledby="work-title">
          <div className="section-intro">
            <h2 className="section-label" id="work-title">{'// selected work'}</h2>
            <p>Три самостоятельных проекта: от исследования и структуры до работающего production-интерфейса.</p>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <article className="project-item" key={project.slug}>
                <Link className="project-row" href={`/work/${project.slug}`} aria-describedby={`${project.slug}-summary`}>
                  <span className="project-index">{project.index}</span>
                  <span className="project-title">{project.title}</span>
                  <span className="project-meta">{project.category}<br />{project.role}</span>
                  <span className="project-arrow" aria-hidden="true">↗</span>
                </Link>
                <p className="project-summary" id={`${project.slug}-summary`}>{project.summary}</p>
                <a className="live-link" href={project.liveUrl} target="_blank" rel="noreferrer">production ↗</a>
                <figure className="project-preview" aria-hidden="true">
                  <img src={project.cover.src} alt="" width={project.cover.width} height={project.cover.height} loading="lazy" />
                  <figcaption>{project.index} / {project.slug}</figcaption>
                </figure>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="services" data-section="services" aria-labelledby="services-title">
          <div className="section-intro">
            <h2 className="section-label" id="services-title">{'// services'}</h2>
            <p>Подключаюсь к задаче целиком или на отдельном этапе — без лишней студийной прослойки.</p>
          </div>
          <div className="service-list">
            {services.map(([index, title, description]) => (
              <details key={index}>
                <summary><span>{index}</span><strong>{title}</strong><span aria-hidden="true">+</span></summary>
                <p>{description}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section process-section" id="process" data-section="process" aria-labelledby="process-title">
          <div className="section-intro">
            <h2 className="section-label" id="process-title">{'// process'}</h2>
            <p>Пять шагов от неопределённой задачи до проверенного интерфейса.</p>
          </div>
          <ol className="process-list">
            {process.map(([index, text]) => <li key={index}><span>{index}</span><p>{text}</p></li>)}
          </ol>
        </section>

        <section className="section about-section" id="about" data-section="about" aria-labelledby="about-title">
          <div className="section-intro">
            <h2 className="section-label" id="about-title">{'// about'}</h2>
            <p>Дизайн и код — части одного решения.</p>
          </div>
          <div className="about-copy">
            <p>Я Артём Исаев, web designer и frontend developer из Калуги. Проектирую сайты для локального бизнеса и B2B-компаний: исследую задачу, собираю понятную структуру, создаю дизайн в Figma и реализую адаптивный frontend.</p>
            <dl>
              <div><dt>focus</dt><dd>business websites</dd></div>
              <div><dt>based</dt><dd>{profile.location}, RU</dd></div>
              <div><dt>mode</dt><dd>design → production</dd></div>
            </dl>
          </div>
        </section>

        <section className="section terminal-section" data-section="terminal" aria-labelledby="terminal-title">
          <div className="section-intro">
            <h2 className="section-label" id="terminal-title">{'// optional terminal'}</h2>
            <p>Дополнительный путь. Весь контент остаётся доступен обычными ссылками и прокруткой.</p>
          </div>
          <TerminalConsole />
        </section>

        <section className="section contact-section" id="contact" data-section="contact" aria-labelledby="contact-title">
          <h2 className="section-label" id="contact-title">{'// contact'}</h2>
          <p className="contact-lead">Есть задача или старый сайт, который нужно переделать? Напишите — сначала разберёмся, что действительно нужно бизнесу.</p>
          <div className="contact-links">
            <a className="primary-link" href={profile.telegram} target="_blank" rel="noreferrer"><span aria-hidden="true">▸</span> Telegram</a>
            <a href={profile.github} target="_blank" rel="noreferrer"><span aria-hidden="true">▸</span> GitHub</a>
          </div>
          {!profile.email && <p className="contact-note">Email не опубликован: адрес не удалось подтвердить в открытом профиле.</p>}
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2026 Артём Исаев · Калуга</p>
        <p>Дизайн, код и проверка — в одних руках.</p>
      </footer>
      <StatusLine />
    </>
  );
}
