// Invented data for the fictional brand "Fieldmarket". No client or Slalom information.
const HOUR = 3600 * 1000
const DAY = 24 * HOUR

export const tiers = [
  { id: 'sprout', name: 'Sprout', from: 0 },
  { id: 'harvest', name: 'Harvest', from: 1500 },
  { id: 'orchard', name: 'Orchard', from: 4000 }
]

export const member = {
  id: 'm-1001',
  name: 'Priya',
  code: 'FM-4829-1037-5521',
  points: 2840,
  yearPoints: 3120,
  tierId: 'harvest',
  preferredStoreId: 's-1'
}

export const stores = [
  { id: 's-1', name: 'Fieldmarket Riverside', address: '12 Mill St', distanceKm: 0.4, hours: '7am to 10pm daily',
    sections: ['Produce', 'Bakery', 'Dairy', 'Deli', 'Frozen', 'Pantry', 'Household'] },
  { id: 's-2', name: 'Fieldmarket Hilltop', address: '88 Ridge Rd', distanceKm: 2.1, hours: '8am to 9pm daily',
    sections: ['Produce', 'Dairy', 'Pantry', 'Beverages', 'Household'] },
  { id: 's-3', name: 'Fieldmarket Old Town', address: '5 Market Sq', distanceKm: 3.6, hours: '7am to 8pm, Sun 9am to 6pm',
    sections: ['Produce', 'Bakery', 'Deli', 'Pantry'] },
  { id: 's-4', name: 'Fieldmarket Lakeside', address: '301 Shore Dr', distanceKm: 5.8, hours: '6am to 11pm daily',
    sections: ['Produce', 'Dairy', 'Frozen', 'Beverages', 'Household', 'Pantry'] },
  { id: 's-5', name: 'Fieldmarket Northgate', address: '9 Gate Ave', distanceKm: 8.2, hours: '8am to 9pm daily',
    sections: ['Produce', 'Bakery', 'Dairy', 'Frozen'] }
]

// expiresInHours is relative to "now" so the demo always has live, expiring, and expired offers.
// stores: 'all' or a list of store ids.
const rawOffers = [
  { id: 'o-1', title: '2x points on fresh produce', aisle: 'Produce', stores: 'all', expiresInHours: 70, reward: '2x points' },
  { id: 'o-2', title: '$1.50 off sourdough loaf', aisle: 'Bakery', stores: ['s-1', 's-3', 's-5'], expiresInHours: 5, reward: '$1.50 off' },
  { id: 'o-3', title: '20% off oat milk', aisle: 'Dairy', stores: 'all', expiresInHours: 20, reward: '20% off' },
  { id: 'o-4', title: 'Buy 2 get 1 free yogurt', aisle: 'Dairy', stores: ['s-1', 's-2', 's-4'], expiresInHours: 120, reward: 'B2G1' },
  { id: 'o-5', title: '500 bonus points on $40 deli spend', aisle: 'Deli', stores: ['s-1', 's-3'], expiresInHours: 200, reward: '500 pts' },
  { id: 'o-6', title: '$3 off frozen berries', aisle: 'Frozen', stores: ['s-1', 's-4', 's-5'], expiresInHours: 48, reward: '$3 off' },
  { id: 'o-7', title: '15% off pantry pasta', aisle: 'Pantry', stores: 'all', expiresInHours: 300, reward: '15% off' },
  { id: 'o-8', title: 'Free cold brew with any pastry', aisle: 'Beverages', stores: ['s-2', 's-4'], expiresInHours: 30, reward: 'Free drink' },
  { id: 'o-9', title: '$2 off dish soap', aisle: 'Household', stores: ['s-1', 's-2', 's-4'], expiresInHours: 96, reward: '$2 off' },
  { id: 'o-10', title: '3x points on bakery treats', aisle: 'Bakery', stores: ['s-1', 's-5'], expiresInHours: 10, reward: '3x points' },
  { id: 'o-11', title: '$4 off rotisserie chicken', aisle: 'Deli', stores: ['s-1', 's-3'], expiresInHours: 150, reward: '$4 off' },
  { id: 'o-12', title: '25% off sparkling water', aisle: 'Beverages', stores: ['s-2', 's-4'], expiresInHours: 60, reward: '25% off' },
  { id: 'o-13', title: '2x points on all frozen', aisle: 'Frozen', stores: 'all', expiresInHours: 240, reward: '2x points' },
  { id: 'o-14', title: '$1 off heirloom tomatoes', aisle: 'Produce', stores: ['s-1', 's-3'], expiresInHours: -12, reward: '$1 off' },
  { id: 'o-15', title: 'Free reusable bag at $30', aisle: 'Household', stores: 'all', expiresInHours: -40, reward: 'Free bag' }
]

export function buildOffers(now = Date.now()) {
  return rawOffers.map(({ expiresInHours, ...o }) => ({ ...o, expiresAt: now + expiresInHours * HOUR }))
}

// Seeded PRNG so the history is the same every run.
function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildTransactions(now = Date.now()) {
  const rand = mulberry32(303)
  const list = []
  for (let i = 0; i < 36; i++) {
    const store = stores[Math.floor(rand() * stores.length)]
    const total = Math.round((8 + rand() * 92) * 100) / 100
    list.push({
      id: `t-${i + 1}`,
      type: 'earn',
      label: store.name.replace('Fieldmarket ', ''),
      detail: `$${total.toFixed(2)} purchase`,
      points: Math.round(total),
      at: now - Math.floor(2 + i * 5 + rand() * 4) * DAY
    })
  }
  const redemptions = [
    { id: 't-r1', label: '$5 off coupon', points: -500, daysAgo: 22 },
    { id: 't-r2', label: 'Free coffee', points: -300, daysAgo: 71 },
    { id: 't-r3', label: '$10 off coupon', points: -900, daysAgo: 118 },
    { id: 't-r4', label: '$5 off coupon', points: -500, daysAgo: 160 }
  ]
  for (const r of redemptions) {
    list.push({ id: r.id, type: 'spend', label: r.label, detail: 'Redeemed', points: r.points, at: now - r.daysAgo * DAY })
  }
  return list.sort((a, b) => b.at - a.at)
}

export const rewards = [
  { id: 'rw-1', label: 'Free coffee', cost: 300 },
  { id: 'rw-2', label: '$5 off coupon', cost: 500 },
  { id: 'rw-3', label: '$10 off coupon', cost: 900 }
]
