import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DocumentStatus, PortfolioAscii } from '../app/home-interactive';
import Home from '../app/page';

describe('accessible interactive components', () => {
  it('renders the ASCII switcher as a named button with screen-reader text', () => {
    const markup = renderToStaticMarkup(<PortfolioAscii />);
    expect(markup).toContain('aria-label="Сменить ASCII-композицию и цветовую тему. Вариант 1 из 4, тема 3 из 6"');
    expect(markup).toContain('Артём Исаев');
    expect(markup).toContain('portfolio-ascii');
  });

  it('renders the status line as an announced status region', () => {
    const markup = renderToStaticMarkup(<DocumentStatus />);
    expect(markup).toContain('role="status"');
    expect(markup).toContain('[artem@isaev]');
  });

  it('renders the approved commercial copy without homepage engineering jargon', () => {
    const markup = renderToStaticMarkup(<Home />);
    const text = markup.replace(/<[^>]+>/g, '');
    expect(markup).toContain('<mark>структуру, дизайн и разработку</mark>');
    expect(text).toContain('Каталог аренды спецтехники: фильтры, карточки техники и заявка в одном понятном сценарии.');
    expect(text).toContain('Сайт specialty coffee: бренд-система, меню и быстрый предзаказ.');
    expect(text).toContain('Сайт кузовного центра: услуги, примеры работ и предварительная оценка по фото.');
    expect(text).toContain('Открыт к новым проектам. Быстрее всего отвечаю в Telegram.');
    expect(text).not.toContain('detail pages');
    expect(text).not.toContain('production-интерфейс');
    expect(text).not.toContain('без WebGL');
    expect(text).not.toContain('production build');
  });
});
