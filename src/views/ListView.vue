<script setup>
import { computed, onMounted, ref } from 'vue'
import StateView from '../components/StateView.vue'
import { useListStore } from '../stores/list.js'
import { useOffersStore } from '../stores/offers.js'

const list = useListStore()
const offers = useOffersStore()
const text = ref('')

onMounted(() => offers.ensure())

const state = computed(() => {
  if (offers.status !== 'ready') return offers.status
  return list.items.length ? 'ready' : 'empty'
})
const suggestions = computed(() => offers.clipped.filter((o) => !list.hasOffer(o.id)))

// Guess the section from products named in offers, so "oat milk" lands under Dairy.
function guessSection(t) {
  const q = t.trim().toLowerCase()
  if (!q) return ''
  const hit = offers.offers.find((o) => o.products?.some((p) => p.toLowerCase().includes(q) || q.includes(p.toLowerCase())))
  return hit?.aisle ?? ''
}

function submit() {
  list.add(text.value, guessSection(text.value))
  text.value = ''
}
const hasDone = computed(() => list.items.some((i) => i.done))
</script>

<template>
  <section class="view">
    <header class="view__head">
      <div>
        <h1>Shopping list</h1>
        <p class="sub">{{ list.remaining }} to get · ordered by {{ offers.currentStore?.name ?? 'store' }}</p>
      </div>
      <button v-if="hasDone" class="btn btn--ghost" @click="list.clearDone">Clear checked</button>
    </header>

    <div v-if="suggestions.length && offers.status === 'ready'" class="suggest card">
      <h2>From your clipped offers</h2>
      <ul>
        <li v-for="o in suggestions" :key="o.id">
          <button class="btn btn--ghost" @click="list.addFromOffer(o)">+ {{ o.title }}</button>
        </li>
      </ul>
    </div>

    <StateView :state="state" art="list" empty-title="Your list is empty" empty-text="Add what you need below, or add items from your clipped offers." :error-text="offers.error" @retry="offers.load">
      <section v-for="[section, items] in list.groups" :key="section" class="group">
        <h2>{{ section }}</h2>
        <ul class="items card">
          <li v-for="i in items" :key="i.id" class="item">
            <label class="item__main">
              <input type="checkbox" :checked="i.done" @change="list.toggle(i.id)" />
              <span :class="{ 'is-done': i.done }">{{ i.text }}</span>
            </label>
            <button class="item__del" :aria-label="`Remove ${i.text}`" @click="list.remove(i.id)">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </li>
        </ul>
      </section>
    </StateView>

    <form class="sticky-action add" @submit.prevent="submit">
      <label class="sr-only" for="new-item">Add an item</label>
      <input id="new-item" v-model="text" type="text" placeholder="Add an item" autocomplete="off" />
      <button class="btn" type="submit" :disabled="!text.trim()">Add</button>
    </form>
  </section>
</template>

<style scoped>
.sub {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}

.suggest {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.suggest ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.suggest .btn {
  width: 100%;
  text-align: left;
}

.group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.items {
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  align-items: center;
}

.item + .item {
  border-top: 1px solid var(--color-border);
}

.item__main {
  flex: 1;
  min-height: var(--touch);
  padding: 0 var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.item__main input {
  width: 26px;
  height: 26px;
  accent-color: var(--color-primary);
}

.is-done {
  text-decoration: line-through;
  color: var(--color-ink-muted);
}

.item__del {
  width: var(--touch);
  height: var(--touch);
  display: grid;
  place-items: center;
  border: 0;
  background: none;
  color: var(--color-ink-muted);
}

.add input {
  flex: 1;
  min-width: 0;
  min-height: var(--touch);
  padding: 0 var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.add .btn {
  flex: none;
}
</style>
