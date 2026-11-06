import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { StorageSerializers, useStorage } from '@vueuse/core'
import { api } from '../api/mock.js'

export const useMemberStore = defineStore('member', () => {
  // The member code is cached so it works with no signal.
  const cached = useStorage('fm-member', null, undefined, { serializer: StorageSerializers.object })
  const settings = useStorage('fm-settings', { preferredStoreId: 's-1', notifications: true })

  const member = ref(cached.value)
  const status = ref(cached.value ? 'ready' : 'loading') // loading | ready | error
  const error = ref('')

  const transactions = ref([])
  const historyStatus = ref('loading') // loading | ready | empty | error
  const historyError = ref('')

  async function load() {
    if (!member.value) status.value = 'loading'
    try {
      const fresh = await api.getMember()
      if (fresh) {
        member.value = fresh
        cached.value = fresh
        status.value = 'ready'
      } else if (!member.value) {
        status.value = 'error'
        error.value = 'We could not find your membership.'
      }
    } catch (e) {
      // Keep showing the cached code when a refresh fails.
      if (!member.value) {
        status.value = 'error'
        error.value = e.message
      }
    }
  }

  async function loadHistory() {
    historyStatus.value = 'loading'
    try {
      const list = await api.getHistory()
      transactions.value = list
      historyStatus.value = list.length ? 'ready' : 'empty'
    } catch (e) {
      historyStatus.value = 'error'
      historyError.value = e.message
    }
  }

  async function redeem(reward) {
    const tx = await api.redeem(reward)
    transactions.value = [tx, ...transactions.value]
    member.value = { ...member.value, points: member.value.points + tx.points }
    cached.value = member.value
    historyStatus.value = 'ready'
    return tx
  }

  const tier = computed(() => member.value?.tiers?.find((t) => t.id === member.value.tierId))
  const nextTier = computed(() => {
    const tiers = member.value?.tiers
    return tiers ? tiers[tiers.findIndex((t) => t.id === member.value.tierId) + 1] : null
  })
  const tierProgress = computed(() => {
    if (!tier.value || !nextTier.value) return 1
    const span = nextTier.value.from - tier.value.from
    return Math.min(1, Math.max(0, (member.value.yearPoints - tier.value.from) / span))
  })
  const pointsToNextTier = computed(() =>
    nextTier.value ? Math.max(0, nextTier.value.from - member.value.yearPoints) : 0
  )

  return {
    member, status, error, settings, transactions, historyStatus, historyError,
    tier, nextTier, tierProgress, pointsToNextTier, load, loadHistory, redeem
  }
})
