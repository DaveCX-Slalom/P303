import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'

// Shared (module-level) so Pocket and Settings see the same install state.
const deferred = ref(null)
const installed = ref(false)
const dismissed = useStorage('fm-install-dismissed', false)

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred.value = e
  })
  window.addEventListener('appinstalled', () => {
    installed.value = true
    deferred.value = null
  })
}

export function useInstall() {
  const canInstall = computed(() => !!deferred.value && !installed.value)
  const standalone = computed(
    () => typeof window !== 'undefined' && (window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone === true)
  )
  async function install() {
    if (!deferred.value) return 'unavailable'
    deferred.value.prompt()
    const { outcome } = await deferred.value.userChoice
    deferred.value = null
    return outcome
  }
  return { canInstall, standalone, installed, dismissed, install }
}
