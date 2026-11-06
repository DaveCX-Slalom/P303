import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { buildOffers, stores } from '../src/api/data.js'

// Instant API so store logic is tested without the artificial latency.
const syncClips = vi.fn(async (changes) => ({ synced: changes.length }))
vi.mock('../src/api/mock.js', () => ({
  api: {
    getOffers: async () => buildOffers(),
    getStores: async () => stores,
    getMember: async () => null,
    getHistory: async () => [],
    getRewards: () => [],
    redeem: async () => null,
    syncClips: (c) => syncClips(c)
  }
}))

// useOnline() is read-only, so drive connectivity the way a browser does: with window events.
// Each change yields a tick so Vue's watchers observe it, as they would with a real network change.
const tick = () => new Promise((r) => setTimeout(r, 0))
const goOffline = async () => {
  Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })
  window.dispatchEvent(new Event('offline'))
  await tick()
}
const goOnline = async () => {
  Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
  window.dispatchEvent(new Event('online'))
  await tick()
}

const setup = async () => {
  const { useOffersStore } = await import('../src/stores/offers.js')
  const { useConnectivityStore } = await import('../src/stores/connectivity.js')
  const offers = useOffersStore()
  const connectivity = useConnectivityStore()
  await goOnline()
  await offers.load()
  return { offers, connectivity }
}

let pinia
beforeEach(() => {
  localStorage.clear()
  syncClips.mockReset()
  syncClips.mockImplementation(async (changes) => ({ synced: changes.length }))
  pinia = createPinia()
  setActivePinia(pinia)
})

// Stop every store's watchers and window listeners so a finished test can't react to the next one's events.
afterEach(() => pinia._e.stop())

describe('offers store', () => {
  it('loads and ranks offers for the preferred store', async () => {
    const { offers } = await setup()
    expect(offers.status).toBe('ready')
    expect(offers.active.length).toBeGreaterThan(5)
    expect(offers.active.every((o) => o.expiresAt > offers.now)).toBe(true)
    expect(offers.expired.length).toBeGreaterThan(0)
  })

  it('clips and unclips, and syncs immediately when online', async () => {
    const { offers } = await setup()
    const id = offers.active[0].id
    offers.toggleClip(id)
    expect(offers.isClipped(id)).toBe(true)
    expect(offers.clipped.map((o) => o.id)).toContain(id)
    expect(syncClips).toHaveBeenCalledWith([{ id, clipped: true }])
    offers.toggleClip(id)
    expect(offers.isClipped(id)).toBe(false)
    expect(offers.queue).toHaveLength(0)
  })

  it('queues clips while offline and flushes them on reconnect', async () => {
    const { offers, connectivity } = await setup()
    await goOffline()
    const [a, b] = offers.active
    offers.toggleClip(a.id)
    offers.toggleClip(b.id)
    offers.toggleClip(b.id) // changed their mind: queue keeps only the latest state per offer
    expect(syncClips).not.toHaveBeenCalled()
    expect(offers.queue).toEqual([{ id: a.id, clipped: true }, { id: b.id, clipped: false }])
    await goOnline()
    await vi.waitFor(() => expect(offers.queue).toHaveLength(0))
    expect(syncClips).toHaveBeenCalledTimes(1)
  })

  it('keeps clips queued when the sync fails, so nothing is lost', async () => {
    const { offers, connectivity } = await setup()
    await goOffline()
    offers.toggleClip(offers.active[0].id)
    syncClips.mockRejectedValueOnce(new Error('boom'))
    await goOnline()
    await new Promise((r) => setTimeout(r, 20))
    expect(offers.queue).toHaveLength(1)
  })

  it('browse() applies the search, section, and sort controls', async () => {
    const { offers } = await setup()
    offers.query = 'yogurt'
    expect(offers.browse(offers.active).map((o) => o.id)).toEqual(['o-4'])
    offers.clearFilters()
    expect(offers.filtersActive).toBe(false)
    offers.section = 'Dairy'
    expect(offers.browse(offers.active).every((o) => o.aisle === 'Dairy')).toBe(true)
  })

  it('best offer is the top-ranked one that is not clipped yet', async () => {
    const { offers } = await setup()
    const first = offers.bestOffer
    offers.toggleClip(first.id)
    expect(offers.bestOffer.id).not.toBe(first.id)
  })
})

describe('shopping list store', () => {
  it('adds, dedupes offer items, toggles, and clears checked', async () => {
    await setup()
    const { useListStore } = await import('../src/stores/list.js')
    const { useOffersStore } = await import('../src/stores/offers.js')
    const list = useListStore()
    const offer = useOffersStore().active[0]
    list.add('  bananas  ', 'Produce')
    list.add('   ')
    list.addFromOffer(offer)
    list.addFromOffer(offer)
    expect(list.items).toHaveLength(2)
    expect(list.items[0].text).toBe('bananas')
    expect(list.remaining).toBe(2)
    list.toggle(list.items[0].id)
    expect(list.remaining).toBe(1)
    list.clearDone()
    expect(list.items).toHaveLength(1)
  })
})
