// Mock API with artificial latency so loading, empty, and error states are real.
// Demo switches via URL: ?mock=error | ?mock=empty | ?mock=error-offers | ?mock=empty-history ...
import { member, stores, buildOffers, buildTransactions, rewards, tiers } from './data.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function mockMode() {
  return new URLSearchParams(window.location.search).get('mock') || ''
}

async function call(kind, produce, empty) {
  await sleep(350 + Math.random() * 450)
  if (!navigator.onLine) throw new Error('You are offline')
  const mode = mockMode()
  if (mode === 'error' || mode === `error-${kind}`) throw new Error('Something went wrong on our side')
  if (mode === 'empty' || mode === `empty-${kind}`) return empty
  return produce()
}

export const api = {
  getMember: () => call('member', () => ({ ...member, tiers }), null),
  getOffers: () => call('offers', () => buildOffers(), []),
  getStores: () => call('stores', () => stores, []),
  getHistory: () => call('history', () => buildTransactions(), []),
  getRewards: () => rewards,
  // Applies queued clip/unclip changes made while offline.
  syncClips: (changes) => call('sync', () => ({ synced: changes.length }), { synced: 0 }),
  redeem: (reward) =>
    call('redeem', () => ({ id: `t-${Date.now()}`, type: 'spend', label: reward.label, detail: 'Redeemed', points: -reward.cost, at: Date.now() }), null)
}
