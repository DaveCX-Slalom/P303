import { describe, expect, it } from 'vitest'
import { filterTransactions, groupByMonth, monthlySeries } from '../src/utils/history.js'
import { rewardState } from '../src/utils/rewards.js'
import { groupBySection } from '../src/utils/list.js'
import { tiers } from '../src/api/data.js'

const now = new Date(2026, 10, 15).getTime() // 15 Nov 2026
const tx = (id, points, y, m, d = 10) => ({ id, points, at: new Date(y, m, d).getTime(), label: id, detail: '' })

describe('monthlySeries', () => {
  it('returns the last N months oldest first, summing earned and redeemed', () => {
    const list = [tx('a', 50, 2026, 10), tx('b', 20, 2026, 10), tx('c', -300, 2026, 10), tx('d', 80, 2026, 8), tx('old', 999, 2025, 0)]
    const s = monthlySeries(list, 4, now)
    expect(s).toHaveLength(4)
    expect(s.at(-1)).toMatchObject({ earned: 70, spent: 300 })
    expect(s[1]).toMatchObject({ earned: 80, spent: 0 }) // September
    expect(s.reduce((n, m) => n + m.earned, 0)).toBe(150) // the 2025 one is out of range
  })
  it('crosses a year boundary correctly', () => {
    const s = monthlySeries([tx('x', 10, 2026, 0)], 3, new Date(2026, 1, 5).getTime())
    expect(s.map((m) => m.earned)).toEqual([0, 10, 0]) // Dec, Jan, Feb
  })
})

describe('transactions', () => {
  const list = [tx('e', 5, 2026, 9), tx('s', -5, 2026, 9), tx('e2', 7, 2026, 10)]
  it('filters by earned and redeemed', () => {
    expect(filterTransactions(list, 'earn').map((t) => t.id)).toEqual(['e', 'e2'])
    expect(filterTransactions(list, 'spend').map((t) => t.id)).toEqual(['s'])
    expect(filterTransactions(list, 'all')).toHaveLength(3)
  })
  it('groups by month keeping order', () => {
    expect(groupByMonth(list, 'en-US').map(([m, items]) => [m, items.length])).toEqual([['October 2026', 2], ['November 2026', 1]])
  })
})

describe('rewardState', () => {
  const coffee = { cost: 300 }
  const box = { cost: 3500, minTier: 'orchard' }
  it('allows a reward the member can afford', () => {
    expect(rewardState(coffee, 2840, 'harvest', tiers)).toEqual({ ok: true, reason: '' })
  })
  it('says how many points are missing', () => {
    expect(rewardState({ cost: 500 }, 120, 'sprout', tiers)).toEqual({ ok: false, reason: '380 more points needed' })
  })
  it('locks tier-gated rewards even when affordable', () => {
    expect(rewardState(box, 9000, 'harvest', tiers)).toEqual({ ok: false, reason: 'Orchard members only' })
    expect(rewardState(box, 9000, 'orchard', tiers).ok).toBe(true)
  })
})

describe('shopping list grouping', () => {
  it('orders sections by the store walking order, unknown last', () => {
    const items = [{ section: 'Dairy' }, { section: '' }, { section: 'Produce' }, { section: 'Mystery' }]
    expect(groupBySection(items, ['Produce', 'Bakery', 'Dairy']).map(([s]) => s)).toEqual(['Produce', 'Dairy', 'Mystery', 'Other'])
  })
})
