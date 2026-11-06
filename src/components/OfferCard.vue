<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  offer: { type: Object, required: true },
  clipped: Boolean,
  soon: Boolean,
  countdown: { type: String, required: true },
  expired: Boolean
})
const emit = defineEmits(['toggle', 'open'])

// Swipe left to clip/unclip. The button below is the non-gesture alternative.
const startX = ref(null)
const dx = ref(0)
const pop = ref(false)

watch(() => props.clipped, () => {
  pop.value = true
  setTimeout(() => (pop.value = false), 400)
})

function onStart(e) {
  startX.value = e.touches[0].clientX
}
function onMove(e) {
  if (startX.value === null) return
  dx.value = Math.max(-80, Math.min(0, e.touches[0].clientX - startX.value))
}
function onEnd() {
  if (dx.value <= -60 && !props.expired) emit('toggle', props.offer.id)
  startX.value = null
  dx.value = 0
}
</script>

<template>
  <li class="offer card" :class="{ 'is-clipped': clipped, 'is-expired': expired, 'is-pop': pop }"
      :style="{ transform: dx ? `translateX(${dx}px)` : '' }"
      @touchstart.passive="onStart" @touchmove.passive="onMove" @touchend="onEnd">
    <div class="offer__top">
      <span class="offer__reward">{{ offer.reward }}</span>
      <span class="offer__time" :class="{ 'is-soon': soon }">
        <template v-if="soon && !expired">Ends soon · </template>{{ countdown }}
      </span>
    </div>
    <button class="offer__open" @click="emit('open', offer)">
      <h3>{{ offer.title }}</h3>
      <p class="offer__meta">{{ offer.aisle }} · {{ offer.stores === 'all' ? 'All stores' : 'This store' }} · Details ›</p>
    </button>
    <button v-if="!expired" class="btn offer__btn" :class="{ 'btn--ghost': clipped }" @click="emit('toggle', offer.id)">
      {{ clipped ? 'Clipped ✓' : 'Clip offer' }}<span class="sr-only">: {{ offer.title }}</span>
    </button>
  </li>
</template>

<style scoped>
.offer {
  list-style: none;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  transition: transform 0.15s;
}

.offer.is-clipped {
  border-color: var(--color-primary);
}

.offer.is-pop {
  animation: pop 0.4s ease-out;
}

.offer.is-expired {
  opacity: 0.75;
}

.offer__top {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 700;
}

.offer__reward {
  padding: 2px var(--space-3);
  border-radius: 999px;
  background: var(--color-accent);
  color: var(--color-accent-ink);
}

.offer__time {
  color: var(--color-ink-muted);
}

.offer__time.is-soon {
  color: var(--color-accent);
}

.offer__open {
  min-height: var(--touch);
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
}

.offer__meta {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}

.offer__btn {
  margin-top: var(--space-2);
  align-self: stretch;
}

@keyframes pop {
  40% {
    transform: scale(1.025);
    box-shadow: 0 0 0 4px var(--color-primary);
  }
}
</style>
