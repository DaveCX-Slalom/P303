<script setup>
import { computed, onMounted, ref } from 'vue'
import StateView from '../components/StateView.vue'
import OfferCard from '../components/OfferCard.vue'
import { useOffersStore } from '../stores/offers.js'

const store = useOffersStore()
const filter = ref('all') // all | clipped
const showExpired = ref(false)

onMounted(() => {
  if (store.status !== 'ready') store.load()
})

const list = computed(() => (filter.value === 'clipped' ? store.clipped : store.active))
const state = computed(() => {
  if (store.status !== 'ready') return store.status
  return list.value.length ? 'ready' : 'empty'
})
const emptyTitle = computed(() => (filter.value === 'clipped' ? 'No clipped offers yet' : 'No offers in this store'))
const emptyText = computed(() =>
  filter.value === 'clipped'
    ? 'Clip an offer and it will wait here for checkout.'
    : 'Try another store, or check back soon.'
)
</script>

<template>
  <section class="view">
    <header class="view__head">
      <div>
        <h1>Offers</h1>
        <p v-if="store.currentStore" class="sub">{{ store.currentStore.name }}</p>
      </div>
    </header>

    <StateView :state="state" :empty-title="emptyTitle" :empty-text="emptyText" :error-text="store.error" @retry="store.load">
      <p class="hint">Swipe an offer left to clip it, or use the button.</p>
      <ul class="list">
        <OfferCard v-for="o in list" :key="o.id" :offer="o" :clipped="store.isClipped(o.id)"
                   :soon="store.isSoon(o)" :countdown="store.countdown(o)" @toggle="store.toggleClip" />
      </ul>
    </StateView>

    <template v-if="store.status === 'ready' && store.expired.length">
      <button class="btn btn--ghost" :aria-expanded="showExpired" @click="showExpired = !showExpired">
        {{ showExpired ? 'Hide' : 'Show' }} expired ({{ store.expired.length }})
      </button>
      <ul v-if="showExpired" class="list">
        <OfferCard v-for="o in store.expired" :key="o.id" :offer="o" expired :countdown="store.countdown(o)" />
      </ul>
    </template>

    <div class="sticky-action" role="group" aria-label="Filter offers">
      <button class="btn" :class="{ 'btn--ghost': filter !== 'all' }" :aria-pressed="filter === 'all'" @click="filter = 'all'">
        All ({{ store.active.length }})
      </button>
      <button class="btn" :class="{ 'btn--ghost': filter !== 'clipped' }" :aria-pressed="filter === 'clipped'" @click="filter = 'clipped'">
        Clipped ({{ store.clipped.length }})
      </button>
    </div>
  </section>
</template>

<style scoped>
.sub,
.hint {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}

.list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
