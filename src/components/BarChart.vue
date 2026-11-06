<script setup>
// Earned vs redeemed points per month. SVG bars plus a visually hidden table for screen readers.
import { computed } from 'vue'

const props = defineProps({
  months: { type: Array, required: true } // [{ label, earned, spent }]
})

const W = 320
const H = 150
const PAD = { top: 12, bottom: 24 }
const max = computed(() => Math.max(1, ...props.months.flatMap((m) => [m.earned, m.spent])))
const slot = computed(() => W / Math.max(1, props.months.length))
const bh = (v) => ((H - PAD.top - PAD.bottom) * v) / max.value

const summary = computed(() => {
  const earned = props.months.reduce((n, m) => n + m.earned, 0)
  const spent = props.months.reduce((n, m) => n + m.spent, 0)
  return `Points by month. ${earned} earned and ${spent} redeemed over ${props.months.length} months.`
})
</script>

<template>
  <figure class="chart">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="summary" class="chart__svg">
      <line :x1="0" :x2="W" :y1="H - PAD.bottom" :y2="H - PAD.bottom" class="chart__axis" />
      <g v-for="(m, i) in months" :key="m.label">
        <rect :x="i * slot + slot * 0.14" :y="H - PAD.bottom - bh(m.earned)" :width="slot * 0.34" :height="bh(m.earned)" rx="3" class="chart__earned" />
        <rect :x="i * slot + slot * 0.52" :y="H - PAD.bottom - bh(m.spent)" :width="slot * 0.34" :height="bh(m.spent)" rx="3" class="chart__spent" />
        <text :x="i * slot + slot / 2" :y="H - 7" text-anchor="middle" class="chart__label">{{ m.label }}</text>
      </g>
    </svg>
    <figcaption class="chart__legend">
      <span><i class="dot dot--earned" /> Earned</span>
      <span><i class="dot dot--spent" /> Redeemed</span>
    </figcaption>
    <table class="sr-only">
      <caption>Points earned and redeemed by month</caption>
      <thead><tr><th>Month</th><th>Earned</th><th>Redeemed</th></tr></thead>
      <tbody>
        <tr v-for="m in months" :key="m.label"><td>{{ m.label }}</td><td>{{ m.earned }}</td><td>{{ m.spent }}</td></tr>
      </tbody>
    </table>
  </figure>
</template>

<style scoped>
.chart {
  margin: 0;
}

.chart__svg {
  width: 100%;
  height: auto;
  display: block;
}

.chart__axis {
  stroke: var(--color-border);
  stroke-width: 1;
}

.chart__earned {
  fill: var(--color-primary);
}

.chart__spent {
  fill: var(--color-accent);
}

.chart__label {
  fill: var(--color-ink-muted);
  font-size: 11px;
  font-family: var(--font-sans);
}

.chart__legend {
  display: flex;
  justify-content: center;
  gap: var(--space-5);
  margin-top: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-ink-muted);
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 3px;
  margin-right: 4px;
}

.dot--earned {
  background: var(--color-primary);
}

.dot--spent {
  background: var(--color-accent);
}
</style>
