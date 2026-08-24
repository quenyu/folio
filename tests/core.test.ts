import { describe, expect, it } from 'vitest';
import { profile, projects } from '../app/data';
import { calculateScrollProgress, completeCommand, nextAsciiIndex, parseCommand } from '../app/utils';

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
});

describe('terminal commands', () => {
  it('normalizes and parses supported commands', () => {
    expect(parseCommand('  WORK ')).toBe('work');
    expect(parseCommand('matrix')).toBe('unknown');
  });

  it('autocompletes the first matching command', () => {
    expect(completeCommand('ser')).toBe('services');
    expect(completeCommand('xyz')).toBe('xyz');
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
