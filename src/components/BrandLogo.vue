<script setup>
defineProps({ size: { type: Number, default: 40 }, wordmark: { type: Boolean, default: true } })
</script>

<template>
  <span class="logo">
    <svg :width="size" :height="size" viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="12" class="logo__bg" />
      <path d="M12 20h24l-2.4 14a3 3 0 0 1-3 2.5H17.4a3 3 0 0 1-3-2.5z" class="logo__bag" />
      <path d="M17 20v-3a7 7 0 0 1 14 0v3" fill="none" class="logo__handle" stroke-width="3" stroke-linecap="round" />
      <path d="M24 31c-3.5-1-4.5-4-4-6 3 0 5.5 1.5 4 6zm0 0c3.5-1 4.5-4 4-6-3 0-5.5 1.5-4 6z" class="logo__leaf" />
    </svg>
    <span v-if="wordmark" class="logo__word">Fieldmarket</span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.logo__bg {
  fill: var(--color-primary);
}

.logo__bag {
  fill: var(--color-bg);
}

.logo__handle {
  stroke: var(--color-bg);
}

.logo__leaf {
  fill: var(--color-accent);
}

.logo__word {
  font-weight: 800;
  font-size: var(--text-lg);
  letter-spacing: -0.01em;
  color: var(--color-primary);
}
</style>
