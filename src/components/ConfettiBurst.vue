<script setup>
// Short celebratory burst. Not rendered at all when the member prefers reduced motion.
import { ref, onMounted } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

const reduced = usePreferredReducedMotion()
const visible = ref(true)
const colors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-ink)', 'var(--color-surface-alt)']
const pieces = Array.from({ length: 28 }, (_, i) => ({
  left: 8 + ((i * 37) % 85),
  delay: (i % 7) * 0.05,
  drift: ((i * 53) % 60) - 30,
  color: colors[i % colors.length],
  rot: (i * 47) % 360
}))

onMounted(() => setTimeout(() => (visible.value = false), 1800))
</script>

<template>
  <div v-if="visible && reduced !== 'reduce'" class="confetti" aria-hidden="true">
    <span v-for="(p, i) in pieces" :key="i" :style="{ left: p.left + '%', background: p.color, animationDelay: p.delay + 's', '--drift': p.drift + 'px', '--rot': p.rot + 'deg' }" />
  </div>
</template>

<style scoped>
.confetti {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  overflow: hidden;
}

span {
  position: absolute;
  top: -12px;
  width: 9px;
  height: 14px;
  border-radius: 2px;
  animation: fall 1.6s ease-in forwards;
}

@keyframes fall {
  to {
    transform: translate(var(--drift), 105vh) rotate(calc(var(--rot) + 540deg));
    opacity: 0.9;
  }
}
</style>
