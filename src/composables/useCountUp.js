import { ref, watch } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

// Animates a number toward its target. Jumps straight there when reduced motion is preferred.
export function useCountUp(source, duration = 800) {
  const value = ref(0)
  const reduced = usePreferredReducedMotion()
  let raf = 0

  watch(
    source,
    (target) => {
      cancelAnimationFrame(raf)
      if (target == null) return
      if (reduced.value === 'reduce' || typeof requestAnimationFrame === 'undefined') {
        value.value = target
        return
      }
      const from = value.value
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        value.value = Math.round(from + (target - from) * eased)
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    },
    { immediate: true }
  )
  return value
}
