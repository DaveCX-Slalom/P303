<script setup>
// Small spot illustrations for empty and error states. Decorative, so hidden from screen readers.
defineProps({ name: { type: String, default: 'offers' } })
</script>

<template>
  <svg class="art" viewBox="0 0 120 96" width="120" height="96" aria-hidden="true">
    <ellipse cx="60" cy="86" rx="38" ry="6" class="art__shadow" />
    <!-- offers: price tag -->
    <g v-if="name === 'offers'">
      <path d="M22 44 56 10h34v34L56 78z" class="art__main" />
      <circle cx="74" cy="28" r="6" class="art__bg" />
      <path d="M44 52l22-22" class="art__line" />
      <path d="M48 62l16-16" class="art__line" />
    </g>
    <!-- history: clock -->
    <g v-else-if="name === 'history'">
      <circle cx="60" cy="46" r="34" class="art__main" />
      <circle cx="60" cy="46" r="26" class="art__bg" />
      <path d="M60 28v19l13 8" class="art__stroke" />
    </g>
    <!-- stores: pin -->
    <g v-else-if="name === 'stores'">
      <path d="M60 80S30 54 30 36a30 30 0 0 1 60 0c0 18-30 44-30 44z" class="art__main" />
      <circle cx="60" cy="36" r="11" class="art__bg" />
    </g>
    <!-- list: checklist -->
    <g v-else-if="name === 'list'">
      <rect x="32" y="8" width="56" height="72" rx="8" class="art__main" />
      <path d="M42 28l5 5 9-10M42 50l5 5 9-10" class="art__strokebg" />
      <path d="M62 28h18M62 50h18" class="art__strokebg" />
    </g>
    <!-- inbox: bell -->
    <g v-else-if="name === 'inbox'">
      <path d="M36 62V44a24 24 0 0 1 48 0v18l6 8H30z" class="art__main" />
      <circle cx="60" cy="76" r="6" class="art__accent" />
    </g>
    <!-- rewards: gift -->
    <g v-else-if="name === 'rewards'">
      <rect x="30" y="34" width="60" height="42" rx="6" class="art__main" />
      <rect x="26" y="26" width="68" height="14" rx="5" class="art__accent" />
      <path d="M60 26v50" class="art__strokebg" />
    </g>
    <!-- error: cloud with cross -->
    <g v-else>
      <path d="M34 66a16 16 0 0 1 2-32 22 22 0 0 1 42-4 18 18 0 0 1 4 36z" class="art__main" />
      <path d="M52 44l16 16M68 44L52 60" class="art__strokebg" />
    </g>
  </svg>
</template>

<style scoped>
.art__shadow {
  fill: var(--color-surface-alt);
}

.art__main {
  fill: var(--color-primary);
}

.art__accent {
  fill: var(--color-accent);
}

.art__bg {
  fill: var(--color-bg);
}

.art__line,
.art__stroke,
.art__strokebg {
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.art__line {
  stroke: var(--color-bg);
}

.art__stroke {
  stroke: var(--color-primary);
}

.art__strokebg {
  stroke: var(--color-bg);
}
</style>
