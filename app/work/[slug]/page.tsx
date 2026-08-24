/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, projects } from '../../data';
import { DocumentStatus } from '../../home-interactive';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — кейс Артёма Исаева`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — кейс Артёма Исаева`,
      description: project.summary,
      type: 'article',
      images: [{ url: project.cover.src, width: project.cover.width, height: project.cover.height, alt: project.cover.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — кейс Артёма Исаева`,
      description: project.summary,
      images: [project.cover.src],
    },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const nextProject = projects[(projects.findIndex((item) => item.slug === project.slug) + 1) % projects.length];

  return (
    <>
      <a className="skip-link" href="#case-content">Перейти к содержанию</a>
      <header className="site-header case-header">
        <Link className="terminal-id" href="/" prefetch={false}>artem@isaev ~ % cd /</Link>
        <nav aria-label="Навигация по кейсу">
          <Link href="/#work" prefetch={false}>← все работы</Link>
          <a href="#gallery">экраны</a>
          <a href="#result">итог</a>
        </nav>
      </header>

      <main id="case-content" className="case-page">
        <section className="case-hero" data-section={project.slug} aria-labelledby="case-title">
          <p className="command">work/{project.slug} ~ % open case-study</p>
          <p className="case-index">{project.index} / 03</p>
          <h1 id="case-title">{project.title}</h1>
          <p className="case-summary">{project.summary}</p>
          <dl className="case-meta">
            <div><dt>industry</dt><dd>{project.category}</dd></div>
            <div><dt>year</dt><dd>{project.year}</dd></div>
            <div><dt>role</dt><dd>{project.role}</dd></div>
            <div><dt>scope</dt><dd>{project.scope.join(' · ')}</dd></div>
            <div><dt>format</dt><dd>{project.format}</dd></div>
          </dl>
          <p className="case-disclosure">Исследование, структура, визуальная система и frontend выполнены Артёмом целиком; подробности и ограничения перечислены ниже.</p>
          <div className="case-actions">
            <a className="primary-link" href={project.liveUrl} target="_blank" rel="noreferrer">▸ открыть production ↗</a>
            <a href={project.githubUrl} target="_blank" rel="noreferrer">▸ GitHub ↗</a>
            {project.figmaUrl && <a href={project.figmaUrl} target="_blank" rel="noreferrer">▸ Figma ↗</a>}
          </div>
        </section>

        <section className="case-cover" aria-label="Обложка проекта">
          <div className="desktop-frame">
            <img src={project.cover.src} alt={project.cover.alt} width={project.cover.width} height={project.cover.height} />
          </div>
          <div className="mobile-frame">
            <img src={project.mobile.src} alt={project.mobile.alt} width={project.mobile.width} height={project.mobile.height} />
          </div>
        </section>

        <section className="case-block" data-section="context" aria-labelledby="context-title">
          <p className="section-label">{'// 01 context'}</p>
          <div>
            <h2 id="context-title">Контекст и проблема</h2>
            <p>{project.context}</p>
            <p>{project.problem}</p>
          </div>
        </section>

        <section className="case-block" data-section="strategy" aria-labelledby="strategy-title">
          <p className="section-label">{'// 02 strategy'}</p>
          <div>
            <h2 id="strategy-title">Аудитория и цели</h2>
            <p>{project.audience}</p>
            <ul className="case-list">{project.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
          </div>
        </section>

        <section className="case-block" data-section="ux" aria-labelledby="ux-title">
          <p className="section-label">{'// 03 ux'}</p>
          <div>
            <h2 id="ux-title">IA и пользовательский путь</h2>
            <div className="ia-flow" aria-label="Информационная архитектура">{project.ia.map((item, index) => <span key={item}>{item}{index < project.ia.length - 1 && <b aria-hidden="true">→</b>}</span>)}</div>
            <p>{project.flow}</p>
            <ul className="case-list">{project.ux.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </section>

        <section className="case-block visual-block" data-section="art-direction" aria-labelledby="visual-title">
          <p className="section-label">{'// 04 art direction'}</p>
          <div>
            <h2 id="visual-title">Визуальная система</h2>
            <p>{project.artDirection}</p>
            <p><span className="muted">typography:</span> {project.typography}</p>
            <ul className="color-list">{project.colors.map((color) => <li key={color}><span aria-hidden="true" />{color}</li>)}</ul>
          </div>
        </section>

        <section className="case-gallery" id="gallery" data-section="screens" aria-labelledby="gallery-title">
          <div className="section-intro">
            <h2 className="section-label" id="gallery-title">{'// 05 screens'}</h2>
            <p>Настоящие экраны из production build.</p>
          </div>
          <div className="gallery-grid">
            {project.gallery.map((image, index) => (
              <figure className={image.width < 500 ? 'gallery-mobile' : ''} key={image.src}>
                <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
                <figcaption>{String(index + 1).padStart(2, '0')} — {image.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="case-block" data-section="frontend" aria-labelledby="frontend-title">
          <p className="section-label">{'// 06 frontend'}</p>
          <div>
            <h2 id="frontend-title">Responsive и реализация</h2>
            <p>{project.responsive}</p>
            <p>{project.implementation}</p>
          </div>
        </section>

        <section className="case-block" id="result" data-section="verification" aria-labelledby="verification-title">
          <p className="section-label">{'// 07 verification'}</p>
          <div>
            <h2 id="verification-title">Accessibility и проверка</h2>
            <div className="verification-columns">
              <div><h3>Accessibility</h3><ul className="case-list">{project.accessibility.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><h3>Testing</h3><ul className="case-list">{project.testing.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </div>
          </div>
        </section>

        <section className="case-block limitations" data-section="limitations" aria-labelledby="limitations-title">
          <p className="section-label">{'// 08 limitations'}</p>
          <div>
            <h2 id="limitations-title">Ограничения</h2>
            <ul className="case-list">{project.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </section>

        <Link className="next-project" href={`/work/${nextProject.slug}`} prefetch={false}>
          <span>следующий проект / {nextProject.index}</span>
          <strong>{nextProject.title}</strong>
          <span aria-hidden="true">→</span>
        </Link>
      </main>

      <footer className="site-footer"><p>© 2026 Артём Исаев · Калуга</p><Link href="/#contact" prefetch={false}>обсудить проект →</Link></footer>
      <DocumentStatus fallback={project.slug} />
    </>
  );
}
