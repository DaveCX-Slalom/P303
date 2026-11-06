<script setup>
import { computed, onMounted } from 'vue'
import StateView from '../components/StateView.vue'
import { useOffersStore } from '../stores/offers.js'
import { useMemberStore } from '../stores/member.js'

const store = useOffersStore()
const member = useMemberStore()

onMounted(() => {
  if (store.status !== 'ready') store.load()
})

const state = computed(() => {
  if (store.status !== 'ready') return store.status
  return store.stores.length ? 'ready' : 'empty'
})

const sorted = computed(() => [...store.stores].sort((a, b) => a.distanceKm - b.distanceKm))
const selectedId = computed(() => member.settings.preferredStoreId)

// Clipped offers grouped by aisle section for the selected store (a section list, not a map).
const bySection = computed(() => {
  const groups = {}
  for (const o of store.clipped) (groups[o.aisle] ||= []).push(o)
  return Object.entries(groups)
})

function useNearest() {
  if (sorted.value.length) member.settings = { ...member.settings, preferredStoreId: sorted.value[0].id }
}
function choose(id) {
  member.settings = { ...member.settings, preferredStoreId: id }
}
</script>

<template>
  <section class="view">
    <h1>Stores</h1>

    <StateView :state="state" empty-title="No stores found" empty-text="We couldn't find any stores near you." :error-text="store.error" @retry="store.load">
      <ul class="list">
        <li v-for="s in sorted" :key="s.id" class="store card" :class="{ 'is-selected': s.id === selectedId }">
          <div>
            <h2>{{ s.name }}</h2>
            <p class="meta">{{ s.address }} · {{ s.distanceKm }} km</p>
            <p class="meta">{{ s.hours }}</p>
          </div>
          <button class="btn" :class="{ 'btn--ghost': s.id !== selectedId }" :aria-pressed="s.id === selectedId" @click="choose(s.id)">
            {{ s.id === selectedId ? 'My store ✓' : 'Choose' }}
          </button>
        </li>
      </ul>

      <section v-if="store.currentStore" class="aisles card">
        <h2>Your clipped offers by section</h2>
        <p v-if="!bySection.length" class="meta">Nothing clipped for {{ store.currentStore.name }} yet.</p>
        <dl v-else>
          <template v-for="[aisle, items] in bySection" :key="aisle">
            <dt>{{ aisle }}</dt>
            <dd v-for="o in items" :key="o.id">{{ o.title }}</dd>
          </template>
        </dl>
        <p class="meta">All sections here: {{ store.currentStore.sections.join(', ') }}</p>
      </section>
    </StateView>

    <div class="sticky-action">
      <button class="btn" :disabled="!sorted.length" @click="useNearest">Use nearest store</button>
    </div>
  </section>
</template>

<style scoped>
.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.store {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.store.is-selected {
  border: 2px solid var(--color-primary);
}

.meta {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}

.aisles {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

dt {
  margin-top: var(--space-2);
  font-weight: 800;
  color: var(--color-primary);
}

dd {
  margin: 0;
}
</style>
