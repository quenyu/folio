import { describe, expect, it } from 'vitest';
import { process, profile, projects, services } from '../app/data';
import { accentThemes, asciiVariants, baseAscii } from '../app/home-interactive';
import { separators } from '../app/page';
import { calculateScrollProgress, nextAsciiIndex } from '../app/utils';

describe('portfolio content', () => {
  it('contains exactly three ordered, unique projects', () => {
    expect(projects.map((project) => project.index)).toEqual(['01', '02', '03']);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(3);
  });

  it('keeps every project connected to confirmed production and GitHub URLs', () => {
    for (const project of projects) {
      expect(project.liveUrl).toMatch(/^https:\/\/.*\.vercel\.app$/);
      expect(project.githubUrl).toBe(`https://github.com/quenyu/${project.slug === 'techdelo-40' ? 'techdelo-40-demo' : project.slug === 'poluton' ? 'poluton-coffee-demo' : 'gran-auto'}`);
    }
  });

  it('does not invent an email contact', () => {
    expect(profile.email).toBeNull();
    expect(profile.telegram).toBe('https://t.me/wqeqadas');
  });

  it('keeps the homepage sections compact', () => {
    expect(services).toHaveLength(4);
    expect(process.map((step) => step[1])).toEqual(['research', 'structure', 'design', 'build + launch']);
  });

  it('uses the required accent order with muted coral as the default offset', () => {
    expect(accentThemes).toEqual(['#8AAEE8', '#E6C44C', '#E18585', '#8FD79E', '#B585F2', '#D2D6E0']);
  });

  it('preserves the three required separators exactly', () => {
    expect(separators.robot).toBe('  _[]_\n [o  o]\n |====|');
    expect(separators.rabbit).toBe(' (\\_/)\n (o.o)\nc(")(")');
    expect(separators.cat).toBe(' /\\v/\\\n(=o.o=)\n (   )');
  });

  it('keeps every ASCII variant rectangular with an intact core mask', () => {
    const baseLines = baseAscii.split('\n');
    expect(new Set(baseLines.map((line) => line.length))).toHaveLength(1);
    for (const variant of asciiVariants) {
      const lines = variant.split('\n');
      expect(new Set(lines.map((line) => line.length))).toHaveLength(1);
      expect(lines).toHaveLength(baseLines.length);
      for (let index = 0; index < baseAscii.length; index += 1) {
        if (baseAscii[index] !== ' ' && baseAscii[index] !== '\n') expect(variant[index]).not.toBe(' ');
      }
    }
  });
});

describe('interface calculations', () => {
  it('clamps scroll progress', () => {
    expect(calculateScrollProgress(500, 2000, 1000)).toBe(50);
    expect(calculateScrollProgress(-20, 1000, 1000)).toBe(0);
    expect(calculateScrollProgress(4000, 2000, 1000)).toBe(100);
  });

  it('cycles ASCII variants without overflow', () => {
    expect(nextAsciiIndex(3, 4)).toBe(0);
    expect(nextAsciiIndex(0, 0)).toBe(0);
  });
});
