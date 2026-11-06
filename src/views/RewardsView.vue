<script setup>
import { computed, onMounted, ref } from 'vue'
import StateView from '../components/StateView.vue'
import RedeemSheet from '../components/RedeemSheet.vue'
import { api } from '../api/mock.js'
import { useMemberStore } from '../stores/member.js'

const store = useMemberStore()
const rewards = api.getRewards()
const category = ref('All')
const redeeming = ref(null)

onMounted(store.load)

const categories = ['All', ...new Set(rewards.map((r) => r.category))]
const shown = computed(() => rewards.filter((r) => category.value === 'All' || r.category === category.value))
const tiers = computed(() => store.member?.tiers ?? [])
const currentIdx = computed(() => tiers.value.findIndex((t) => t.id === store.member?.tierId))
</script>

<template>
  <section class="view">
    <header class="view__head">
      <h1>Rewards</h1>
      <p v-if="store.member" class="bal"><strong>{{ store.member.points.toLocaleString() }}</strong> pts</p>
    </header>

    <StateView :state="store.status" art="rewards" :error-text="store.error" @retry="store.load">
      <section class="tiers" aria-labelledby="tiers-h">
        <h2 id="tiers-h">Tier perks</h2>
        <ol class="tierlist">
          <li v-for="(t, i) in tiers" :key="t.id" class="tier card" :class="{ 'is-current': i === currentIdx, 'is-locked': i > currentIdx }">
            <div class="tier__head">
              <h3>{{ t.name }}</h3>
              <span v-if="i === currentIdx" class="tag">Your tier</span>
              <span v-else-if="i > currentIdx" class="tag tag--muted">From {{ t.from.toLocaleString() }} pts a year</span>
              <span v-else class="tag tag--muted">Unlocked</span>
            </div>
            <ul v-if="t.perks"><li v-for="p in t.perks" :key="p">{{ p }}</li></ul>
          </li>
        </ol>
        <p v-if="store.nextTier" class="next">{{ store.pointsToNextTier.toLocaleString() }} more points this year to reach {{ store.nextTier.name }}.</p>
      </section>

      <section aria-labelledby="cat-h">
        <h2 id="cat-h">Rewards catalog</h2>
        <div class="chips" role="group" aria-label="Filter rewards">
          <button v-for="c in categories" :key="c" class="chip" :class="{ 'is-on': category === c }" :aria-pressed="category === c" @click="category = c">{{ c }}</button>
        </div>
        <ul class="catalog">
          <li v-for="r in shown" :key="r.id" class="reward card">
            <div>
              <h3>{{ r.label }}</h3>
              <p class="meta">{{ r.blurb }}</p>
              <p class="cost">{{ r.cost.toLocaleString() }} pts</p>
              <p v-if="!store.rewardState(r).ok" class="meta lock">{{ store.rewardState(r).reason }}</p>
            </div>
            <button class="btn" :class="{ 'btn--accent': store.rewardState(r).ok }" :disabled="!store.rewardState(r).ok" @click="redeeming = r">
              Redeem<span class="sr-only"> {{ r.label }}</span>
            </button>
          </li>
        </ul>
      </section>
    </StateView>

    <RedeemSheet v-if="redeeming" :preselect="redeeming" @close="redeeming = null" />
  </section>
</template>

<style scoped>
.bal {
  color: var(--color-primary);
  font-size: var(--text-lg);
}

h2 {
  margin-bottom: var(--space-2);
}

.tierlist,
.catalog {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.tier {
  padding: var(--space-4);
}

.tier.is-current {
  border: 2px solid var(--color-primary);
}

.tier__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.tag {
  padding: 2px var(--space-3);
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-primary-ink);
  font-size: var(--text-sm);
  font-weight: 800;
}

.tag--muted {
  background: var(--color-surface-alt);
  color: var(--color-ink-muted);
}

.tier ul {
  margin: 0;
  padding-left: var(--space-5);
}

.next,
.meta {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}

.next {
  margin-top: var(--space-2);
}

.chips {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  margin-bottom: var(--space-3);
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

.reward {
  padding: var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
}

.cost {
  font-weight: 800;
  color: var(--color-primary);
}

.lock {
  color: var(--color-accent);
  font-weight: 700;
}
</style>
