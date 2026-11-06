export const SOON_MS = 24 * 3600 * 1000

export const availableAt = (offer, storeId) => offer.stores === 'all' || offer.stores.includes(storeId)
export const isExpired = (offer, now) => offer.expiresAt <= now
export const isSoon = (offer, now) => !isExpired(offer, now) && offer.expiresAt - now < SOON_MS

// "Best match": store-specific offers first, then chain-wide, soonest expiry first within each.
export function rankOffers(offers, storeId, now) {
  return offers
    .filter((o) => !isExpired(o, now) && availableAt(o, storeId))
    .sort((a, b) => Number(b.stores !== 'all') - Number(a.stores !== 'all') || a.expiresAt - b.expiresAt)
}

export function filterOffers(list, { query = '', section = '', soonOnly = false } = {}, now = Date.now()) {
  const q = query.trim().toLowerCase()
  return list.filter((o) => {
    if (section && o.aisle !== section) return false
    if (soonOnly && !isSoon(o, now)) return false
    if (!q) return true
    return [o.title, o.aisle, o.reward, ...(o.products || [])].some((t) => t.toLowerCase().includes(q))
  })
}

export function sortOffers(list, mode) {
  const copy = [...list]
  if (mode === 'ending') return copy.sort((a, b) => a.expiresAt - b.expiresAt)
  if (mode === 'az') return copy.sort((a, b) => a.title.localeCompare(b.title))
  return copy // 'best' keeps the ranked order
}

export function countdownLabel(offer, now) {
  const ms = offer.expiresAt - now
  if (ms <= 0) return 'Expired'
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  if (h >= 48) return `${Math.floor(h / 24)} days left`
  if (h >= 1) return `${h}h ${m}m left`
  return `${m}m left`
}
