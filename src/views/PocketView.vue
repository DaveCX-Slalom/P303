<script setup>
import { onMounted, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import QRCode from 'qrcode'
import StateView from '../components/StateView.vue'
import { useMemberStore } from '../stores/member.js'

const store = useMemberStore()
const bright = useStorage('fm-bright', true) // high-contrast code screen
const qr = ref('')

watch(
  () => store.member?.code,
  async (code) => {
    if (code) qr.value = await QRCode.toDataURL(code, { margin: 2, width: 560, errorCorrectionLevel: 'M' })
  },
  { immediate: true }
)

onMounted(store.load)
</script>

<template>
  <section class="view">
    <header class="view__head">
      <h1>{{ store.member ? `Hi, ${store.member.name}` : 'Your pocket' }}</h1>
      <router-link to="/settings" class="icon-link" aria-label="Settings">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
        </svg>
      </router-link>
    </header>

    <StateView :state="store.status" :error-text="store.error" @retry="store.load">
      <div v-if="store.member" class="code card" :class="{ 'is-bright': bright }">
        <img v-if="qr" :src="qr" class="code__qr" :alt="`QR code for member ${store.member.code}`" width="280" height="280" />
        <p class="code__num" aria-label="Member code">{{ store.member.code }}</p>
      </div>

      <div v-if="store.member" class="points card">
        <p class="points__label">Points</p>
        <p class="points__num">{{ store.member.points.toLocaleString() }}</p>
        <p class="points__tier"><strong>{{ store.tier?.name }}</strong> member</p>
        <template v-if="store.nextTier">
          <div class="bar" role="progressbar" :aria-valuenow="Math.round(store.tierProgress * 100)" aria-valuemin="0" aria-valuemax="100"
               :aria-label="`Progress to ${store.nextTier.name}`">
            <div class="bar__fill" :style="{ width: store.tierProgress * 100 + '%' }" />
          </div>
          <p class="points__next">{{ store.pointsToNextTier.toLocaleString() }} more to reach {{ store.nextTier.name }}</p>
        </template>
      </div>
    </StateView>

    <div class="sticky-action">
      <button class="btn btn--ghost" :aria-pressed="bright" @click="bright = !bright">
        Brightness mode: {{ bright ? 'On' : 'Off' }}
      </button>
      <router-link to="/history" class="btn btn--link">Use points</router-link>
    </div>
  </section>
</template>

<style scoped>
.icon-link {
  width: var(--touch);
  height: var(--touch);
  display: grid;
  place-items: center;
  color: var(--color-primary);
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
  max-width: 320px;
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
}

.points__next {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}

.btn--link {
  display: grid;
  place-items: center;
  text-decoration: none;
}
</style>
