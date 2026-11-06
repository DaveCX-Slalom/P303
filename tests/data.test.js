import { describe, expect, it } from 'vitest'
import { buildOffers, buildTransactions, member, rewards, stores, tiers } from '../src/api/data.js'

// The brief: 1 member, ~40 transactions, ~15 offers, 5 stores, 3 tiers.
describe('invented data matches the brief', () => {
  it('has the promised sizes', () => {
    expect(buildOffers()).toHaveLength(15)
    expect(stores).toHaveLength(5)
    expect(tiers).toHaveLength(3)
    expect(buildTransactions().length).toBeGreaterThanOrEqual(38)
    expect(buildTransactions().length).toBeLessThanOrEqual(42)
  })
  it('includes live, expiring-soon, and expired offers so every state can be shown', () => {
    const now = Date.now()
    const o = buildOffers(now)
    expect(o.some((x) => x.expiresAt <= now)).toBe(true)
    expect(o.some((x) => x.expiresAt > now && x.expiresAt - now < 24 * 3600 * 1000)).toBe(true)
    expect(o.some((x) => x.expiresAt - now > 48 * 3600 * 1000)).toBe(true)
  })
  it('only references stores that exist', () => {
    const ids = new Set(stores.map((s) => s.id))
    for (const o of buildOffers()) if (o.stores !== 'all') o.stores.forEach((id) => expect(ids.has(id)).toBe(true))
    expect(ids.has(member.preferredStoreId)).toBe(true)
  })
  it('is reproducible: the same history every time', () => {
    const a = buildTransactions(1_700_000_000_000).map((t) => [t.id, t.points])
    const b = buildTransactions(1_700_000_000_000).map((t) => [t.id, t.points])
    expect(a).toEqual(b)
  })
  it('has unique ids and a tier-gated reward to demonstrate locking', () => {
    const ids = buildOffers().map((o) => o.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(rewards.some((r) => r.minTier)).toBe(true)
  })
  it('contains no real brand, client, or Slalom information', () => {
    const blob = JSON.stringify({ stores, member, rewards, offers: buildOffers() }).toLowerCase()
    expect(blob).not.toMatch(/slalom/)
    expect(stores.every((s) => s.name.startsWith('Fieldmarket'))).toBe(true)
  })
})
