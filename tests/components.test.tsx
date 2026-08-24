import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DocumentStatus, PortfolioAscii } from '../app/home-interactive';

describe('accessible interactive components', () => {
  it('renders the ASCII switcher as a named button with screen-reader text', () => {
    const markup = renderToStaticMarkup(<PortfolioAscii />);
    expect(markup).toContain('aria-label="Сменить ASCII-композицию и цветовую тему. Вариант 1 из 4, тема 1 из 6"');
    expect(markup).toContain('Артём Исаев');
    expect(markup).toContain('portfolio-ascii');
  });

  it('renders the status line as an announced status region', () => {
    const markup = renderToStaticMarkup(<DocumentStatus />);
    expect(markup).toContain('role="status"');
    expect(markup).toContain('[artem@isaev]');
  });
});
