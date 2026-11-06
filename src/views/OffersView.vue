<script setup>
import { computed, onMounted, ref } from 'vue'
import StateView from '../components/StateView.vue'
import OfferCard from '../components/OfferCard.vue'
import OfferSheet from '../components/OfferSheet.vue'
import { useOffersStore } from '../stores/offers.js'
import { useListStore } from '../stores/list.js'

const store = useOffersStore()
const list = useListStore()
const view = ref('all') // all | clipped
const showExpired = ref(false)
const open = ref(null)

onMounted(() => store.ensure())

const shown = computed(() => store.browse(view.value === 'clipped' ? store.clipped : store.active))
const state = computed(() => {
  if (store.status !== 'ready') return store.status
  return shown.value.length ? 'ready' : 'empty'
})
const emptyTitle = computed(() => {
  if (store.filtersActive) return 'No offers match'
  return view.value === 'clipped' ? 'No clipped offers yet' : 'No offers in this store'
})
const emptyText = computed(() => {
  if (store.filtersActive) return 'Try a different search or clear the filters.'
  return view.value === 'clipped' ? 'Clip an offer and it will wait here for checkout.' : 'Try another store, or check back soon.'
})
</script>

<template>
  <section class="view">
    <header class="view__head">
      <div>
        <h1>Offers</h1>
        <p v-if="store.currentStore" class="sub">{{ store.currentStore.name }}</p>
      </div>
      <router-link to="/list" class="btn btn--ghost link">My list<span v-if="list.remaining"> ({{ list.remaining }})</span></router-link>
    </header>

    <div v-if="store.status === 'ready'" class="controls">
      <label class="search">
        <span class="sr-only">Search offers</span>
        <input v-model="store.query" type="search" placeholder="Search offers or products" autocomplete="off" />
      </label>

      <div class="chips" role="group" aria-label="Filter by section">
        <button class="chip" :class="{ 'is-on': !store.section }" :aria-pressed="!store.section" @click="store.section = ''">All sections</button>
        <button v-for="s in store.sections" :key="s" class="chip" :class="{ 'is-on': store.section === s }"
                :aria-pressed="store.section === s" @click="store.section = store.section === s ? '' : s">{{ s }}</button>
      </div>

      <div class="row">
        <button class="chip" :class="{ 'is-on': store.soonOnly }" :aria-pressed="store.soonOnly" @click="store.soonOnly = !store.soonOnly">Ending soon</button>
        <label class="sort">
          <span>Sort</span>
          <select v-model="store.sort">
            <option value="best">Best match</option>
            <option value="ending">Ending soonest</option>
            <option value="az">A to Z</option>
          </select>
        </label>
      </div>
    </div>

    <StateView :state="state" art="offers" :empty-title="emptyTitle" :empty-text="emptyText" :error-text="store.error" @retry="store.load">
      <template #empty>
        <button v-if="store.filtersActive" class="btn" @click="store.clearFilters">Clear filters</button>
      </template>
      <p class="hint">Swipe an offer left to clip it, or use the button. Tap an offer for details.</p>
      <ul class="list">
        <OfferCard v-for="o in shown" :key="o.id" :offer="o" :clipped="store.isClipped(o.id)"
                   :soon="store.isSoon(o)" :countdown="store.countdown(o)" @toggle="store.toggleClip" @open="open = $event" />
      </ul>
    </StateView>

    <template v-if="store.status === 'ready' && store.expired.length">
      <button class="btn btn--ghost" :aria-expanded="showExpired" @click="showExpired = !showExpired">
        {{ showExpired ? 'Hide' : 'Show' }} expired ({{ store.expired.length }})
      </button>
      <ul v-if="showExpired" class="list">
        <OfferCard v-for="o in store.expired" :key="o.id" :offer="o" expired :countdown="store.countdown(o)" @open="open = $event" />
      </ul>
    </template>

    <div class="sticky-action" role="group" aria-label="Show offers">
      <button class="btn" :class="{ 'btn--ghost': view !== 'all' }" :aria-pressed="view === 'all'" @click="view = 'all'">
        All ({{ store.active.length }})
      </button>
      <button class="btn" :class="{ 'btn--ghost': view !== 'clipped' }" :aria-pressed="view === 'clipped'" @click="view = 'clipped'">
        Clipped ({{ store.clipped.length }})
      </button>
    </div>

    <OfferSheet v-if="open" :offer="open" @close="open = null" />
  </section>
</template>

<style scoped>
.sub,
.hint {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}

.link {
  display: grid;
  place-items: center;
  text-decoration: none;
  padding: 0 var(--space-4);
}

.controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.search input {
  width: 100%;
  min-height: var(--touch);
  padding: 0 var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.chips {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding-bottom: var(--space-1);
}

.chip {
  flex: none;
  min-height: var(--touch);
  padding: 0 var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  font-weight: 700;
}

.chip.is-on {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-primary-ink);
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.sort {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 700;
}

.sort select {
  flex: 1;
  min-width: 0;
  min-height: var(--touch);
  padding: 0 var(--space-3);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
}

.list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
