const monthKey = (d) => `${d.getFullYear()}-${d.getMonth()}`

// Last `count` calendar months (oldest first) with points earned and redeemed.
export function monthlySeries(transactions, count = 6, now = Date.now()) {
  const base = new Date(now)
  const months = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1)
    months.push({ key: monthKey(d), label: d.toLocaleString(undefined, { month: 'short' }), earned: 0, spent: 0 })
  }
  for (const t of transactions) {
    const m = months.find((x) => x.key === monthKey(new Date(t.at)))
    if (!m) continue
    if (t.points > 0) m.earned += t.points
    else m.spent += Math.abs(t.points)
  }
  return months
}

export function filterTransactions(transactions, kind) {
  if (kind === 'earn') return transactions.filter((t) => t.points > 0)
  if (kind === 'spend') return transactions.filter((t) => t.points < 0)
  return transactions
}

export function groupByMonth(transactions, locale) {
  const fmt = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
  const map = new Map()
  for (const t of transactions) {
    const key = fmt.format(t.at)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(t)
  }
  return [...map.entries()]
}
