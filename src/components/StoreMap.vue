<script setup>
// Simple floor plan: store sections on a grid with the entrance at the bottom.
// Sections that hold one of the member's clipped offers are highlighted with a count.
import { computed } from 'vue'

const props = defineProps({
  sections: { type: Array, required: true },
  highlights: { type: Object, default: () => ({}) } // { Produce: 2 }
})

const COLS = 3
const CW = 92
const CH = 58
const GAP = 8
const cells = computed(() =>
  props.sections.map((name, i) => ({
    name,
    x: 8 + (i % COLS) * (CW + GAP),
    y: 8 + Math.floor(i / COLS) * (CH + GAP),
    count: props.highlights[name] || 0
  }))
)
const rows = computed(() => Math.ceil(props.sections.length / COLS))
const W = 8 * 2 + COLS * CW + (COLS - 1) * GAP
const H = computed(() => 8 + rows.value * (CH + GAP) + 34)

const label = computed(() => {
  const hot = cells.value.filter((c) => c.count)
  return hot.length
    ? `Store map. Clipped offers in: ${hot.map((c) => `${c.name} (${c.count})`).join(', ')}.`
    : 'Store map. No clipped offers in this store yet.'
})
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="map" role="img" :aria-label="label">
    <rect x="1" y="1" :width="W - 2" :height="H - 2" rx="12" class="map__floor" />
    <g v-for="c in cells" :key="c.name">
      <rect :x="c.x" :y="c.y" :width="CW" :height="CH" rx="8" :class="['map__cell', { 'is-hot': c.count }]" />
      <text :x="c.x + CW / 2" :y="c.y + CH / 2 + 4" text-anchor="middle" :class="['map__text', { 'is-hot': c.count }]">{{ c.name }}</text>
      <g v-if="c.count">
        <circle :cx="c.x + CW - 8" :cy="c.y + 8" r="11" class="map__badge" />
        <text :x="c.x + CW - 8" :y="c.y + 12" text-anchor="middle" class="map__count">{{ c.count }}</text>
      </g>
    </g>
    <rect :x="W / 2 - 80" :y="H - 30" width="160" height="22" rx="11" class="map__door" />
    <text :x="W / 2" :y="H - 15" text-anchor="middle" class="map__doortext">Entrance · Checkout</text>
  </svg>
</template>

<style scoped>
.map {
  width: 100%;
  height: auto;
  display: block;
}

.map__floor {
  fill: var(--color-surface-alt);
  stroke: var(--color-border);
}

.map__cell {
  fill: var(--color-surface);
  stroke: var(--color-border);
  stroke-width: 1.5;
}

.map__cell.is-hot {
  fill: var(--color-primary);
  stroke: var(--color-primary);
}

.map__text {
  fill: var(--color-ink);
  font: 700 12px var(--font-sans);
}

.map__text.is-hot {
  fill: var(--color-primary-ink);
}

.map__badge {
  fill: var(--color-accent);
}

.map__count {
  fill: var(--color-accent-ink);
  font: 800 12px var(--font-sans);
}

.map__door {
  fill: var(--color-ink);
}

.map__doortext {
  fill: var(--color-bg);
  font: 700 11px var(--font-sans);
}
</style>
