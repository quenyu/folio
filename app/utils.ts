export function calculateScrollProgress(scrollY: number, scrollHeight: number, clientHeight: number) {
  const available = Math.max(1, scrollHeight - clientHeight);
  return Math.min(100, Math.max(0, Math.round((scrollY / available) * 100)));
}

export function nextAsciiIndex(current: number, total: number) {
  if (total <= 0) return 0;
  return (current + 1) % total;
}
