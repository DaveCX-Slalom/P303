<script setup>
import { computed, onMounted } from 'vue'
import StateView from '../components/StateView.vue'
import { useMemberStore } from '../stores/member.js'
import { useOffersStore } from '../stores/offers.js'

const member = useMemberStore()
const offers = useOffersStore()

onMounted(() => {
  if (offers.status !== 'ready') offers.load()
})

const state = computed(() => (offers.status === 'ready' && !offers.stores.length ? 'empty' : offers.status))

function setStore(e) {
  member.settings = { ...member.settings, preferredStoreId: e.target.value }
}
function setNotify(e) {
  member.settings = { ...member.settings, notifications: e.target.checked }
}
</script>

<template>
  <section class="view">
    <header class="view__head">
      <h1>Settings</h1>
      <router-link to="/" class="btn btn--ghost back">Back</router-link>
    </header>

    <StateView :state="state" empty-title="No stores to choose from" :error-text="offers.error" @retry="offers.load">
      <div class="card panel">
        <label class="field">
          <span>Preferred store</span>
          <select :value="member.settings.preferredStoreId" @change="setStore">
            <option v-for="s in offers.stores" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </label>

        <label class="field field--row">
          <span>Offer notifications</span>
          <input type="checkbox" role="switch" :checked="member.settings.notifications" @change="setNotify" />
        </label>
      </div>
    </StateView>
  </section>
</template>

<style scoped>
.back {
  display: grid;
  place-items: center;
  text-decoration: none;
}

.panel {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-weight: 700;
}

.field--row {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: var(--touch);
}

select {
  min-height: var(--touch);
  padding: 0 var(--space-3);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
}

input[type='checkbox'] {
  width: 28px;
  height: 28px;
  accent-color: var(--color-primary);
}
</style>
