<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StateView from '../components/StateView.vue'
import InstallPrompt from '../components/InstallPrompt.vue'
import { useMemberStore } from '../stores/member.js'
import { useOffersStore } from '../stores/offers.js'
import { useInstall } from '../composables/useInstall.js'

const member = useMemberStore()
const offers = useOffersStore()
const router = useRouter()
const { dismissed } = useInstall()

onMounted(() => offers.ensure())

const state = computed(() => (offers.status === 'ready' && !offers.stores.length ? 'empty' : offers.status))
const themes = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' }
]

function patch(p) {
  member.settings = { ...member.settings, ...p }
}
function replayIntro() {
  try {
    localStorage.removeItem('fm-onboarded')
  } catch {
    /* storage unavailable */
  }
  router.push('/welcome')
}
</script>

<template>
  <section class="view">
    <header class="view__head">
      <h1>Settings</h1>
      <router-link to="/" class="btn btn--ghost back">Back</router-link>
    </header>

    <InstallPrompt />

    <StateView :state="state" art="stores" empty-title="No stores to choose from" :error-text="offers.error" @retry="offers.load">
      <div class="card panel">
        <label class="field">
          <span>Preferred store</span>
          <select :value="member.settings.preferredStoreId" @change="patch({ preferredStoreId: $event.target.value })">
            <option v-for="s in offers.stores" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </label>

        <label class="field field--row">
          <span>Offer notifications</span>
          <input type="checkbox" role="switch" :checked="member.settings.notifications" @change="patch({ notifications: $event.target.checked })" />
        </label>

        <fieldset class="field">
          <legend>Appearance</legend>
          <div class="seg" role="group" aria-label="Appearance">
            <button v-for="t in themes" :key="t.id" class="seg__btn" :class="{ 'is-on': member.settings.theme === t.id }"
                    :aria-pressed="member.settings.theme === t.id" @click="patch({ theme: t.id })">{{ t.label }}</button>
          </div>
        </fieldset>
      </div>
    </StateView>

    <div class="card panel">
      <button class="btn btn--ghost" @click="replayIntro">Replay intro</button>
      <button v-if="dismissed" class="btn btn--ghost" @click="dismissed = false">Show install tip again</button>
    </div>

    <p class="foot">Fieldmarket is a fictional brand. All data in this app is invented and for illustration only.</p>
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
  border: 0;
  padding: 0;
  margin: 0;
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

.seg {
  display: flex;
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.seg__btn {
  flex: 1;
  min-height: var(--touch);
  border: 0;
  background: var(--color-surface);
  font-weight: 700;
}

.seg__btn.is-on {
  background: var(--color-primary);
  color: var(--color-primary-ink);
}

.foot {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}
</style>
