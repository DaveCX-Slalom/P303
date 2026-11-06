import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { api } from '../api/mock.js'
import { useConnectivityStore } from './connectivity.js'
import { useMemberStore } from './member.js'

const SOON_MS = 24 * 3600 * 1000

export const useOffersStore = defineStore('offers', () => {
  const connectivity = useConnectivityStore()
  const memberStore = useMemberStore()

  const offers = ref([])
  const stores = ref([])
  const status = ref('loading') // loading | ready | error
  const error = ref('')
  const now = ref(Date.now())
  setInterval(() => (now.value = Date.now()), 30000)

  const clippedIds = useStorage('fm-clipped', [])
  const queue = useStorage('fm-queue', []) // [{ id, clipped }] waiting to sync

  async function load() {
    status.value = 'loading'
    try {
      const [o, s] = await Promise.all([api.getOffers(), api.getStores()])
      offers.value = o
      stores.value = s
      status.value = 'ready'
    } catch (e) {
      status.value = 'error'
      error.value = e.message
    }
  }

  const currentStore = computed(
    () => stores.value.find((s) => s.id === memberStore.settings.preferredStoreId) || stores.value[0]
  )

  const inStore = (o) => o.stores === 'all' || o.stores.includes(currentStore.value?.id)

  // Active offers for this store: store-specific first, then chain-wide, soonest expiry first.
  const active = computed(() =>
    offers.value
      .filter((o) => o.expiresAt > now.value && inStore(o))
      .sort((a, b) => {
        const specific = Number(b.stores !== 'all') - Number(a.stores !== 'all')
        return specific || a.expiresAt - b.expiresAt
      })
  )
  const clipped = computed(() => active.value.filter((o) => clippedIds.value.includes(o.id)))
  const expired = computed(() => offers.value.filter((o) => o.expiresAt <= now.value && inStore(o)))

  const isClipped = (id) => clippedIds.value.includes(id)
  const isSoon = (o) => o.expiresAt - now.value < SOON_MS

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

  function countdown(o) {
    const ms = o.expiresAt - now.value
    if (ms <= 0) return 'Expired'
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    if (h >= 48) return `${Math.floor(h / 24)} days left`
    if (h >= 1) return `${h}h ${m}m left`
    return `${m}m left`
  }

  return {
    offers, stores, status, error, currentStore, active, clipped, expired, queue,
    isClipped, isSoon, toggleClip, countdown, load, flushQueue
  }
})
