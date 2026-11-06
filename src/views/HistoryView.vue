<script setup>
import { computed, onMounted, ref } from 'vue'
import StateView from '../components/StateView.vue'
import BarChart from '../components/BarChart.vue'
import Sheet from '../components/Sheet.vue'
import RedeemSheet from '../components/RedeemSheet.vue'
import { useMemberStore } from '../stores/member.js'
import { filterTransactions, groupByMonth, monthlySeries } from '../utils/history.js'

const store = useMemberStore()
const kind = ref('all') // all | earn | spend
const redeemOpen = ref(false)
const detail = ref(null)

onMounted(() => {
  store.loadHistory()
  if (!store.member) store.load()
})

const points = computed(() => store.member?.points ?? 0)
const months = computed(() => monthlySeries(store.transactions, 6))
const filtered = computed(() => filterTransactions(store.transactions, kind.value))
const groups = computed(() => groupByMonth(filtered.value))
const state = computed(() => {
  if (store.historyStatus !== 'ready') return store.historyStatus
  return filtered.value.length ? 'ready' : 'empty'
})

const day = (at) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(at)
const fullDate = (at) => new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(at)
const kinds = [
  { id: 'all', label: 'All' },
  { id: 'earn', label: 'Earned' },
  { id: 'spend', label: 'Redeemed' }
]
</script>

<template>
  <section class="view">
    <header class="view__head">
      <h1>History</h1>
      <p class="bal"><strong>{{ points.toLocaleString() }}</strong> pts</p>
    </header>

    <StateView :state="state" art="history" empty-title="No history yet" empty-text="Scan your code at checkout to start earning points."
               :error-text="store.historyError" @retry="store.loadHistory">
      <div class="card chartcard">
        <h2>Last 6 months</h2>
        <BarChart :months="months" />
      </div>

      <div class="chips" role="group" aria-label="Filter transactions">
        <button v-for="k in kinds" :key="k.id" class="chip" :class="{ 'is-on': kind === k.id }" :aria-pressed="kind === k.id" @click="kind = k.id">{{ k.label }}</button>
      </div>

      <section v-for="[month, items] in groups" :key="month" class="group">
        <h2>{{ month }}</h2>
        <ul class="list card">
          <li v-for="t in items" :key="t.id">
            <button class="row" @click="detail = t">
              <span>
                <span class="row__label">{{ t.label }}</span>
                <span class="row__detail">{{ day(t.at) }} · {{ t.detail }}</span>
              </span>
              <span class="row__pts" :class="t.points < 0 ? 'is-spend' : 'is-earn'">{{ t.points > 0 ? '+' : '' }}{{ t.points }}</span>
            </button>
          </li>
        </ul>
      </section>
    </StateView>

    <div class="sticky-action">
      <button class="btn btn--accent" @click="redeemOpen = true">Redeem points</button>
      <router-link to="/rewards" class="btn btn--ghost link">Rewards</router-link>
    </div>

    <RedeemSheet v-if="redeemOpen" @close="redeemOpen = false" />

    <Sheet v-if="detail" :title="detail.label" @close="detail = null">
      <p class="detail__pts" :class="detail.points < 0 ? 'is-spend' : 'is-earn'">{{ detail.points > 0 ? '+' : '' }}{{ detail.points }} points</p>
      <dl class="detail">
        <dt>Date</dt><dd>{{ fullDate(detail.at) }}</dd>
        <dt>Type</dt><dd>{{ detail.points > 0 ? 'Earned at checkout' : 'Redeemed' }}</dd>
        <dt>Details</dt><dd>{{ detail.detail }}</dd>
        <dt>Reference</dt><dd>{{ detail.id.toUpperCase() }}</dd>
      </dl>
    </Sheet>
  </section>
</template>

<style scoped>
.bal {
  color: var(--color-primary);
  font-size: var(--text-lg);
}

.chartcard {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.chips {
  display: flex;
  gap: var(--space-2);
}

.chip {
  flex: 1;
  min-height: var(--touch);
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

.list li + li {
  border-top: 1px solid var(--color-border);
}

.row {
  width: 100%;
  min-height: var(--touch);
  padding: var(--space-3) var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  border: 0;
  background: none;
  text-align: left;
}

.row__label {
  display: block;
  font-weight: 700;
}

.row__detail {
  display: block;
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

.link {
  display: grid;
  place-items: center;
  text-decoration: none;
}

.detail__pts {
  font-size: var(--text-xl);
  font-weight: 800;
}

.detail {
  margin: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-2) var(--space-4);
}

.detail dt {
  color: var(--color-ink-muted);
}

.detail dd {
  margin: 0;
  font-weight: 700;
}
</style>
