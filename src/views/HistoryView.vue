<script setup>
import { computed, onMounted, ref } from 'vue'
import StateView from '../components/StateView.vue'
import { useMemberStore } from '../stores/member.js'
import { useConnectivityStore } from '../stores/connectivity.js'
import { api } from '../api/mock.js'

const store = useMemberStore()
const connectivity = useConnectivityStore()

const sheetOpen = ref(false)
const picked = ref(null)
const busy = ref(false)
const done = ref('')
const redeemError = ref('')
const rewards = api.getRewards()

onMounted(() => {
  store.loadHistory()
  if (!store.member) store.load()
})

const points = computed(() => store.member?.points ?? 0)

const groups = computed(() => {
  const fmt = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
  const map = new Map()
  for (const t of store.transactions) {
    const key = fmt.format(t.at)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(t)
  }
  return [...map.entries()]
})

const day = (at) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(at)

function open() {
  picked.value = null
  redeemError.value = ''
  done.value = ''
  sheetOpen.value = true
}

async function confirm() {
  if (!picked.value) return
  busy.value = true
  redeemError.value = ''
  try {
    const tx = await store.redeem(picked.value)
    done.value = `${tx.label} redeemed. Show your code at checkout.`
    picked.value = null
  } catch (e) {
    redeemError.value = e.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="view">
    <header class="view__head">
      <h1>History</h1>
      <p class="bal"><strong>{{ points.toLocaleString() }}</strong> pts</p>
    </header>

    <StateView :state="store.historyStatus" empty-title="No history yet" empty-text="Scan your code at checkout to start earning points."
               :error-text="store.historyError" @retry="store.loadHistory">
      <section v-for="[month, items] in groups" :key="month" class="group">
        <h2>{{ month }}</h2>
        <ul class="list card">
          <li v-for="t in items" :key="t.id" class="row">
            <div>
              <p class="row__label">{{ t.label }}</p>
              <p class="row__detail">{{ day(t.at) }} · {{ t.detail }}</p>
            </div>
            <p class="row__pts" :class="t.points < 0 ? 'is-spend' : 'is-earn'">
              {{ t.points > 0 ? '+' : '' }}{{ t.points }}
            </p>
          </li>
        </ul>
      </section>
    </StateView>

    <div class="sticky-action">
      <button class="btn btn--accent" @click="open">Redeem points</button>
    </div>

    <!-- Bottom sheet confirm: reachable one-handed -->
    <div v-if="sheetOpen" class="scrim" @click.self="sheetOpen = false">
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <h2 id="sheet-title">Redeem points</h2>
        <p class="row__detail">You have {{ points.toLocaleString() }} points.</p>

        <p v-if="done" class="ok" role="status">{{ done }}</p>
        <p v-if="!connectivity.online" class="err" role="alert">You're offline. Reconnect to redeem.</p>
        <p v-if="redeemError" class="err" role="alert">{{ redeemError }}</p>

        <ul class="rewards">
          <li v-for="r in rewards" :key="r.id">
            <button class="btn reward" :class="{ 'btn--ghost': picked?.id !== r.id }" :disabled="points < r.cost"
                    :aria-pressed="picked?.id === r.id" @click="picked = r">
              <span>{{ r.label }}</span><span>{{ r.cost }} pts</span>
            </button>
          </li>
        </ul>

        <div class="sheet__actions">
          <button class="btn btn--ghost" @click="sheetOpen = false">Close</button>
          <button class="btn btn--accent" :disabled="!picked || busy || !connectivity.online" @click="confirm">
            {{ busy ? 'Redeeming…' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bal {
  color: var(--color-primary);
  font-size: var(--text-lg);
}

.group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.row {
  min-height: var(--touch);
  padding: var(--space-3) var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
}

.row + .row {
  border-top: 1px solid var(--color-border);
}

.row__label {
  font-weight: 700;
}

.row__detail {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}

.row__pts {
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.is-earn {
  color: var(--color-primary);
}

.is-spend {
  color: var(--color-accent);
}

.scrim {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgb(27 42 33 / 55%);
}

.sheet {
  width: 100%;
  max-width: var(--column);
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--space-5) var(--space-4) calc(var(--space-5) + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: var(--color-bg);
  border-radius: var(--radius) var(--radius) 0 0;
}

.rewards {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.reward {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.sheet__actions {
  display: flex;
  gap: var(--space-3);
}

.sheet__actions > * {
  flex: 1;
}

.ok {
  color: var(--color-primary);
  font-weight: 700;
}

.err {
  color: var(--color-accent);
  font-weight: 700;
}
</style>
