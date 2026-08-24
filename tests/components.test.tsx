import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AsciiName, StatusLine } from '../app/interactive';

describe('accessible interactive components', () => {
  it('renders the ASCII switcher as a named button with screen-reader text', () => {
    const markup = renderToStaticMarkup(<AsciiName />);
    expect(markup).toContain('aria-label="Сменить ASCII-композицию имени Артём Исаев"');
    expect(markup).toContain('Артём Исаев');
  });

  it('renders the status line as an announced status region', () => {
    const markup = renderToStaticMarkup(<StatusLine />);
    expect(markup).toContain('role="status"');
    expect(markup).toContain('KLG');
  });
});
