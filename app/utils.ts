export const commands = ['help', 'work', 'services', 'about', 'contact', 'theme', 'clear'] as const;
export type PortfolioCommand = (typeof commands)[number];

export function parseCommand(value: string): PortfolioCommand | 'unknown' {
  const normalized = value.trim().toLowerCase();
  return commands.includes(normalized as PortfolioCommand) ? (normalized as PortfolioCommand) : 'unknown';
}

export function completeCommand(value: string) {
  const normalized = value.trim().toLowerCase();
  return commands.find((command) => command.startsWith(normalized)) ?? value;
}

export function calculateScrollProgress(scrollY: number, scrollHeight: number, clientHeight: number) {
  const available = Math.max(1, scrollHeight - clientHeight);
  return Math.min(100, Math.max(0, Math.round((scrollY / available) * 100)));
}

export function nextAsciiIndex(current: number, total: number) {
  if (total <= 0) return 0;
  return (current + 1) % total;
}
