import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useOffersStore } from './offers.js'
import { groupBySection } from '../utils/list.js'

export const useListStore = defineStore('list', () => {
  const offers = useOffersStore()
  const items = useStorage('fm-list', []) // [{ id, text, section, offerId?, done }]

  const uid = () => `i-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

  function add(text, section = '') {
    const t = text.trim()
    if (!t) return
    items.value = [...items.value, { id: uid(), text: t, section, done: false }]
  }
  function addFromOffer(offer) {
    if (hasOffer(offer.id)) return
    items.value = [...items.value, { id: uid(), text: offer.title, section: offer.aisle, offerId: offer.id, done: false }]
  }
  const hasOffer = (offerId) => items.value.some((i) => i.offerId === offerId)
  const toggle = (id) => (items.value = items.value.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))
  const remove = (id) => (items.value = items.value.filter((i) => i.id !== id))
  const clearDone = () => (items.value = items.value.filter((i) => !i.done))

  const remaining = computed(() => items.value.filter((i) => !i.done).length)
  const groups = computed(() => groupBySection(items.value, offers.currentStore?.sections ?? []))

  return { items, groups, remaining, add, addFromOffer, hasOffer, toggle, remove, clearDone }
})
