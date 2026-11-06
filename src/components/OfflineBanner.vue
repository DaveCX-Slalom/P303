<script setup>
import { computed } from 'vue'
import { useConnectivityStore } from '../stores/connectivity.js'
import { useOffersStore } from '../stores/offers.js'

const connectivity = useConnectivityStore()
const offers = useOffersStore()
const pending = computed(() => offers.queue.length)
</script>

<template>
  <div v-if="!connectivity.online" class="offline" role="status">
    You're offline. Your member code still works.
    <span v-if="pending">{{ pending }} clipped change{{ pending > 1 ? 's' : '' }} will sync when you reconnect.</span>
  </div>
</template>

<style scoped>
.offline {
  position: sticky;
  top: 0;
  z-index: 20;
  padding: var(--space-3) var(--space-4);
  background: var(--color-ink);
  color: var(--color-bg);
  font-size: var(--text-sm);
  font-weight: 600;
}
</style>
