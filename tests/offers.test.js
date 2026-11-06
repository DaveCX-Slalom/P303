import { describe, expect, it } from 'vitest'
import { countdownLabel, filterOffers, isSoon, rankOffers, sortOffers } from '../src/utils/offers.js'

const H = 3600 * 1000
const now = 1_000_000_000_000
const offer = (id, over = {}) => ({ id, title: id, aisle: 'Produce', reward: '$1 off', stores: 'all', expiresAt: now + 100 * H, products: [], ...over })

describe('rankOffers', () => {
  it('puts store-specific offers before chain-wide ones, soonest expiry first', () => {
    const list = [
      offer('chain-soon', { expiresAt: now + 2 * H }),
      offer('store-late', { stores: ['s-1'], expiresAt: now + 90 * H }),
      offer('store-soon', { stores: ['s-1'], expiresAt: now + 10 * H })
    ]
    expect(rankOffers(list, 's-1', now).map((o) => o.id)).toEqual(['store-soon', 'store-late', 'chain-soon'])
  })
  it('drops expired offers and offers from other stores', () => {
    const list = [offer('old', { expiresAt: now - H }), offer('elsewhere', { stores: ['s-2'] }), offer('ok')]
    expect(rankOffers(list, 's-1', now).map((o) => o.id)).toEqual(['ok'])
  })
})

describe('expiry', () => {
  it('flags offers ending within 24h, not expired ones', () => {
    expect(isSoon(offer('a', { expiresAt: now + 23 * H }), now)).toBe(true)
    expect(isSoon(offer('b', { expiresAt: now + 25 * H }), now)).toBe(false)
    expect(isSoon(offer('c', { expiresAt: now - H }), now)).toBe(false)
  })
  it('formats the countdown', () => {
    expect(countdownLabel(offer('a', { expiresAt: now - 1 }), now)).toBe('Expired')
    expect(countdownLabel(offer('a', { expiresAt: now + 30 * 60000 }), now)).toBe('30m left')
    expect(countdownLabel(offer('a', { expiresAt: now + 5 * H + 5 * 60000 }), now)).toBe('5h 5m left')
    expect(countdownLabel(offer('a', { expiresAt: now + 72 * H }), now)).toBe('3 days left')
  })
})

describe('filterOffers / sortOffers', () => {
  const list = [
    offer('a', { title: 'Oat milk', aisle: 'Dairy', products: ['Oat milk'] }),
    offer('b', { title: 'Sourdough', aisle: 'Bakery', expiresAt: now + 5 * H }),
    offer('c', { title: 'Yogurt deal', aisle: 'Dairy', products: ['Greek yogurt'] })
  ]
  it('searches title, section, reward, and products case-insensitively', () => {
    expect(filterOffers(list, { query: 'YOGURT' }, now).map((o) => o.id)).toEqual(['c'])
    expect(filterOffers(list, { query: 'bakery' }, now).map((o) => o.id)).toEqual(['b'])
  })
  it('combines section and ending-soon filters', () => {
    expect(filterOffers(list, { section: 'Dairy' }, now)).toHaveLength(2)
    expect(filterOffers(list, { soonOnly: true }, now).map((o) => o.id)).toEqual(['b'])
    expect(filterOffers(list, { section: 'Dairy', soonOnly: true }, now)).toEqual([])
  })
  it('sorts without mutating the input', () => {
    const copy = [...list]
    expect(sortOffers(list, 'az').map((o) => o.title)).toEqual(['Oat milk', 'Sourdough', 'Yogurt deal'])
    expect(sortOffers(list, 'ending')[0].id).toBe('b')
    expect(list).toEqual(copy)
  })
})
