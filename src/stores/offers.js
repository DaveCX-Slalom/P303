import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { api } from '../api/mock.js'
import { useConnectivityStore } from './connectivity.js'
import { useMemberStore } from './member.js'
import { availableAt, countdownLabel, filterOffers, isExpired, isSoon as soon, rankOffers, sortOffers } from '../utils/offers.js'

export const useOffersStore = defineStore('offers', () => {
  const connectivity = useConnectivityStore()
  const memberStore = useMemberStore()

  const offers = ref([])
  const stores = ref([])
  const status = ref('loading') // loading | ready | error
  const error = ref('')
  const loadedOnce = ref(false)
  const now = ref(Date.now())
  setInterval(() => (now.value = Date.now()), 30000)

  const clippedIds = useStorage('fm-clipped', [])
  const queue = useStorage('fm-queue', []) // [{ id, clipped }] waiting to sync

  // Browse controls (kept here so they survive switching tabs)
  const query = ref('')
  const section = ref('')
  const soonOnly = ref(false)
  const sort = ref('best') // best | ending | az

  async function load() {
    status.value = 'loading'
    try {
      const [o, s] = await Promise.all([api.getOffers(), api.getStores()])
      offers.value = o
      stores.value = s
      status.value = 'ready'
      loadedOnce.value = true
    } catch (e) {
      status.value = 'error'
      error.value = e.message
    }
  }

  // Load once; views call this on mount so deep links and tab switches both work.
  function ensure() {
    if (!loadedOnce.value && status.value !== 'error') return load()
    if (status.value === 'error') return load()
  }

  const currentStore = computed(
    () => stores.value.find((s) => s.id === memberStore.settings.preferredStoreId) || stores.value[0]
  )
  const storeId = computed(() => currentStore.value?.id)

  const active = computed(() => rankOffers(offers.value, storeId.value, now.value))
  const clipped = computed(() => active.value.filter((o) => clippedIds.value.includes(o.id)))
  const expired = computed(() => offers.value.filter((o) => isExpired(o, now.value) && availableAt(o, storeId.value)))
  const sections = computed(() => [...new Set(active.value.map((o) => o.aisle))].sort())
  const bestOffer = computed(() => active.value.find((o) => !clippedIds.value.includes(o.id)) || null)
  const clippedBySection = computed(() => {
    const counts = {}
    for (const o of clipped.value) counts[o.aisle] = (counts[o.aisle] || 0) + 1
    return counts
  })

  const filtersActive = computed(() => !!(query.value.trim() || section.value || soonOnly.value))
  function clearFilters() {
    query.value = ''
    section.value = ''
    soonOnly.value = false
  }
  const browse = (base) =>
    sortOffers(filterOffers(base, { query: query.value, section: section.value, soonOnly: soonOnly.value }, now.value), sort.value)

  const isClipped = (id) => clippedIds.value.includes(id)
  const isSoon = (o) => soon(o, now.value)
  const countdown = (o) => countdownLabel(o, now.value)
  const offerById = (id) => offers.value.find((o) => o.id === id)

  function toggleClip(id) {
    const next = !isClipped(id)
    clippedIds.value = next ? [...clippedIds.value, id] : clippedIds.value.filter((x) => x !== id)
    if (!connectivity.online) {
      queue.value = [...queue.value.filter((q) => q.id !== id), { id, clipped: next }]
    } else {
      api.syncClips([{ id, clipped: next }]).catch(() => {
        queue.value = [...queue.value.filter((q) => q.id !== id), { id, clipped: next }]
      })
    }
  }

  async function flushQueue() {
    if (!queue.value.length) return
    const pending = [...queue.value]
    try {
      await api.syncClips(pending)
      queue.value = queue.value.filter((q) => !pending.some((p) => p.id === q.id))
    } catch {
      /* stays queued; retried on the next reconnect */
    }
  }

  watch(() => connectivity.online, (isOnline) => isOnline && flushQueue())

  return {
    offers, stores, status, error, now, currentStore, storeId, active, clipped, expired, sections, bestOffer,
    clippedBySection, queue, query, section, soonOnly, sort, filtersActive, clearFilters, browse,
    isClipped, isSoon, countdown, offerById, toggleClip, load, ensure, flushQueue
  }
})
