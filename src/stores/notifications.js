import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useOffersStore } from './offers.js'
import { useMemberStore } from './member.js'

export const useNotificationsStore = defineStore('notifications', () => {
  const offers = useOffersStore()
  const member = useMemberStore()
  const readIds = useStorage('fm-read', [])
  const permission = ref(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported')

  // Derived from live data, so nothing is stored except which ones were read.
  const items = computed(() => {
    if (!member.settings.notifications) return []
    const list = []
    for (const o of offers.active.filter((x) => offers.isSoon(x))) {
      list.push({
        id: `exp-${o.id}`, kind: 'expiry', urgent: true, to: '/offers',
        title: `${o.title} ends soon`,
        body: `${offers.countdown(o)} in ${o.aisle}.${offers.isClipped(o.id) ? ' You have it clipped.' : ''}`
      })
    }
    if (member.nextTier && member.pointsToNextTier > 0 && member.pointsToNextTier <= 1500) {
      list.push({
        id: 'tier-near', kind: 'tier', to: '/rewards',
        title: `${member.pointsToNextTier.toLocaleString()} points to ${member.nextTier.name}`,
        body: 'See what the next tier unlocks.'
      })
    }
    list.push({
      id: 'tip-checkout', kind: 'tip', to: '/checkout',
      title: 'Try checkout mode',
      body: 'Full-screen code and your clipped offers, ready at the register.'
    })
    return list
  })

  const unread = computed(() => items.value.filter((i) => !readIds.value.includes(i.id)).length)
  const isRead = (id) => readIds.value.includes(id)
  const markRead = (id) => !isRead(id) && (readIds.value = [...readIds.value, id])
  const markAllRead = () => (readIds.value = [...new Set([...readIds.value, ...items.value.map((i) => i.id)])])

  async function enableDeviceAlerts() {
    if (typeof Notification === 'undefined') return 'unsupported'
    permission.value = await Notification.requestPermission()
    if (permission.value === 'granted') {
      new Notification('Loyalty Pocket', { body: 'Device alerts are on. We will tell you when offers are about to expire.', icon: '/icon-192.png' })
    }
    return permission.value
  }

  return { items, unread, permission, isRead, markRead, markAllRead, enableDeviceAlerts }
})
