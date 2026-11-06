<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StateView from '../components/StateView.vue'
import { useNotificationsStore } from '../stores/notifications.js'
import { useOffersStore } from '../stores/offers.js'
import { useMemberStore } from '../stores/member.js'

const notes = useNotificationsStore()
const offers = useOffersStore()
const member = useMemberStore()
const router = useRouter()

onMounted(() => {
  offers.ensure()
  member.load()
})

const state = computed(() => {
  if (offers.status !== 'ready') return offers.status
  return notes.items.length ? 'ready' : 'empty'
})

function open(item) {
  notes.markRead(item.id)
  router.push(item.to)
}

const permissionText = computed(
  () =>
    ({
      granted: 'Device alerts are on.',
      denied: 'Device alerts are blocked in your browser settings.',
      unsupported: 'This browser does not support device alerts.',
      default: 'Get a heads-up when an offer is about to expire.'
    })[notes.permission] ?? ''
)
</script>

<template>
  <section class="view">
    <header class="view__head">
      <h1>Inbox</h1>
      <button class="btn btn--ghost" :disabled="!notes.unread" @click="notes.markAllRead">Mark all read</button>
    </header>

    <StateView :state="state" art="inbox" empty-title="You're all caught up"
               :empty-text="member.settings.notifications ? 'New offers and reminders will show up here.' : 'Notifications are turned off in Settings.'"
               :error-text="offers.error" @retry="offers.load">
      <template #empty>
        <router-link v-if="!member.settings.notifications" to="/settings" class="btn link">Open settings</router-link>
      </template>
      <ul class="list">
        <li v-for="i in notes.items" :key="i.id">
          <button class="note card" :class="{ 'is-unread': !notes.isRead(i.id), 'is-urgent': i.urgent }" @click="open(i)">
            <span class="note__title">{{ i.title }}</span>
            <span class="note__body">{{ i.body }}</span>
            <span v-if="!notes.isRead(i.id)" class="sr-only">Unread</span>
          </button>
        </li>
      </ul>
    </StateView>

    <div class="alerts card">
      <h2>Device alerts</h2>
      <p>{{ permissionText }}</p>
      <button v-if="notes.permission === 'default'" class="btn" @click="notes.enableDeviceAlerts">Turn on alerts</button>
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

.note {
  width: 100%;
  min-height: var(--touch);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
  color: var(--color-ink);
}

.note.is-unread {
  border-left: 6px solid var(--color-primary);
}

.note.is-urgent.is-unread {
  border-left-color: var(--color-accent);
}

.note__title {
  font-weight: 800;
}

.note__body {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}

.link {
  display: grid;
  place-items: center;
  text-decoration: none;
}

.alerts {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.alerts p {
  color: var(--color-ink-muted);
}
</style>
