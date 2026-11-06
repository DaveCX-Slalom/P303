<script setup>
import { useInstall } from '../composables/useInstall.js'

const { canInstall, standalone, dismissed, install } = useInstall()
</script>

<template>
  <div v-if="canInstall && !standalone && !dismissed" class="install card" role="region" aria-label="Install app">
    <div>
      <p class="install__title">Add Loyalty Pocket to your home screen</p>
      <p class="install__text">Opens instantly in the store, even with no signal.</p>
    </div>
    <div class="install__actions">
      <button class="btn" @click="install">Install</button>
      <button class="btn btn--ghost" @click="dismissed = true">Not now</button>
    </div>
  </div>
</template>

<style scoped>
.install {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.install__title {
  font-weight: 800;
}

.install__text {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}

.install__actions {
  display: flex;
  gap: var(--space-2);
}

.install__actions > * {
  flex: 1;
}
</style>
