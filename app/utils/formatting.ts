export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function formatRoundDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}
