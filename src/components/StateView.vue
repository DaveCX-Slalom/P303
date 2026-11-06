<script setup>
// One place for the four states every view needs: loading, empty, error, ready (slot).
// Offline is handled globally by OfflineBanner plus cached data in the stores.
defineProps({
  state: { type: String, required: true }, // loading | empty | error | ready
  emptyTitle: { type: String, default: 'Nothing here yet' },
  emptyText: { type: String, default: '' },
  errorText: { type: String, default: 'Something went wrong.' }
})
defineEmits(['retry'])
</script>

<template>
  <div v-if="state === 'loading'" class="state" role="status" aria-live="polite">
    <div class="skeleton" />
    <div class="skeleton" />
    <div class="skeleton skeleton--short" />
    <span class="sr-only">Loading</span>
  </div>

  <div v-else-if="state === 'error'" class="state state--msg card" role="alert">
    <h2>Can't load this right now</h2>
    <p>{{ errorText }}</p>
    <button class="btn" @click="$emit('retry')">Try again</button>
  </div>

  <div v-else-if="state === 'empty'" class="state state--msg card">
    <h2>{{ emptyTitle }}</h2>
    <p v-if="emptyText">{{ emptyText }}</p>
    <slot name="empty" />
  </div>

  <slot v-else />
</template>

<style scoped>
.state {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.state--msg {
  padding: var(--space-5);
  align-items: flex-start;
}

.state--msg p {
  color: var(--color-ink-muted);
}

.skeleton {
  height: 88px;
  border-radius: var(--radius);
  background: linear-gradient(90deg, var(--color-surface-alt), var(--color-border), var(--color-surface-alt));
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite linear;
}

.skeleton--short {
  height: 56px;
  width: 60%;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}
</style>
