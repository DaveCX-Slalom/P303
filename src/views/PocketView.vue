<script setup>
import { computed, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import BrandLogo from '../components/BrandLogo.vue'
import StateView from '../components/StateView.vue'
import InstallPrompt from '../components/InstallPrompt.vue'
import { useMemberStore } from '../stores/member.js'
import { useOffersStore } from '../stores/offers.js'
import { useNotificationsStore } from '../stores/notifications.js'
import { useMemberQr } from '../composables/useMemberQr.js'
import { useCountUp } from '../composables/useCountUp.js'

const store = useMemberStore()
const offers = useOffersStore()
const notes = useNotificationsStore()
const bright = useStorage('fm-bright', true) // high-contrast code card

const qr = useMemberQr(computed(() => store.member?.code))
const points = useCountUp(computed(() => store.member?.points ?? null))

onMounted(() => {
  store.load()
  offers.ensure()
})
</script>

<template>
  <section class="view">
    <header class="view__head">
      <BrandLogo :size="36" />
      <div class="head__actions">
        <router-link to="/inbox" class="icon-link" :aria-label="notes.unread ? `Inbox, ${notes.unread} unread` : 'Inbox'">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4" />
          </svg>
          <span v-if="notes.unread" class="badge" aria-hidden="true">{{ notes.unread }}</span>
        </router-link>
        <router-link to="/settings" class="icon-link" aria-label="Settings">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
          </svg>
        </router-link>
      </div>
    </header>

    <h1 v-if="store.member">Hi, {{ store.member.name }}</h1>

    <InstallPrompt />

    <StateView :state="store.status" :error-text="store.error" @retry="store.load">
      <router-link v-if="offers.bestOffer" to="/offers" class="best card">
        <span class="best__eyebrow">Best for you right now</span>
        <span class="best__title">{{ offers.bestOffer.title }}</span>
        <span class="best__meta">{{ offers.bestOffer.reward }} · {{ offers.bestOffer.aisle }} · {{ offers.countdown(offers.bestOffer) }}</span>
      </router-link>
      <button v-if="offers.bestOffer" class="btn btn--accent best__clip" @click="offers.toggleClip(offers.bestOffer.id)">
        Clip this offer
      </button>

      <div v-if="store.member" class="code card" :class="{ 'is-bright': bright }">
        <img v-if="qr" :src="qr" class="code__qr" :alt="`QR code for member ${store.member.code}`" width="280" height="280" />
        <p class="code__num" aria-label="Member code">{{ store.member.code }}</p>
        <button class="code__toggle" :aria-pressed="bright" @click="bright = !bright">
          Brightness mode: {{ bright ? 'On' : 'Off' }}
        </button>
      </div>

      <div v-if="store.member" class="points card">
        <p class="points__label">Points</p>
        <p class="points__num" :aria-label="`${store.member.points} points`">{{ points.toLocaleString() }}</p>
        <p class="points__tier"><strong>{{ store.tier?.name }}</strong> member</p>
        <template v-if="store.nextTier">
          <div class="bar" role="progressbar" :aria-valuenow="Math.round(store.tierProgress * 100)" aria-valuemin="0" aria-valuemax="100"
               :aria-label="`Progress to ${store.nextTier.name}`">
            <div class="bar__fill" :style="{ width: store.tierProgress * 100 + '%' }" />
          </div>
          <p class="points__next">{{ store.pointsToNextTier.toLocaleString() }} more to reach {{ store.nextTier.name }}</p>
        </template>
        <router-link to="/rewards" class="points__link">See tier perks and rewards ›</router-link>
      </div>
    </StateView>

    <div class="sticky-action">
      <router-link to="/checkout" class="btn btn--link">Checkout mode</router-link>
      <router-link to="/rewards" class="btn btn--ghost btn--link">Use points</router-link>
    </div>
  </section>
</template>

<style scoped>
.head__actions {
  display: flex;
}

.icon-link {
  position: relative;
  width: var(--touch);
  height: var(--touch);
  display: grid;
  place-items: center;
  color: var(--color-primary);
}

.badge {
  position: absolute;
  top: 6px;
  right: 4px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--color-accent);
  color: var(--color-accent-ink);
  font-size: 12px;
  font-weight: 800;
  line-height: 20px;
  text-align: center;
}

.best {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: inherit;
  text-decoration: none;
  border-left: 6px solid var(--color-accent);
}

.best__eyebrow {
  font-size: var(--text-sm);
  font-weight: 800;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.best__title {
  font-size: var(--text-lg);
  font-weight: 800;
}

.best__meta {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}

.best__clip {
  margin-top: calc(var(--space-2) * -1);
}

.code {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.code.is-bright {
  background: var(--color-bright-bg);
  color: var(--color-bright-ink);
  border: 3px solid var(--color-bright-ink);
}

.code__qr {
  width: 100%;
  max-width: 240px;
  height: auto;
  image-rendering: pixelated;
  background: #fff;
}

.code__num {
  font-size: var(--text-lg);
  font-weight: 800;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
}

.code__toggle {
  min-height: var(--touch);
  padding: 0 var(--space-4);
  border: 2px solid currentColor;
  border-radius: var(--radius);
  background: transparent;
  font-weight: 700;
}

.points {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.points__label {
  color: var(--color-ink-muted);
  font-weight: 700;
}

.points__num {
  font-size: var(--text-numeral);
  font-weight: 800;
  line-height: 1;
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
}

.bar {
  margin-top: var(--space-3);
  height: 12px;
  border-radius: 999px;
  background: var(--color-surface-alt);
  overflow: hidden;
}

.bar__fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.8s ease-out;
}

.points__next {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}

.points__link {
  min-height: var(--touch);
  display: inline-flex;
  align-items: center;
  color: var(--color-primary);
  font-weight: 700;
}

.btn--link {
  display: grid;
  place-items: center;
  text-decoration: none;
}
</style>
