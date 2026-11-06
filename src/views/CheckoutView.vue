<script setup>
// Full-screen, always high-contrast: the member code big, plus the offers clipped for this store.
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useWakeLock } from '@vueuse/core'
import StateView from '../components/StateView.vue'
import { useMemberStore } from '../stores/member.js'
import { useOffersStore } from '../stores/offers.js'
import { useMemberQr } from '../composables/useMemberQr.js'

const store = useMemberStore()
const offers = useOffersStore()
const qr = useMemberQr(computed(() => store.member?.code), 720)
const { request, release } = useWakeLock()

onMounted(() => {
  store.load()
  offers.ensure()
  request('screen').catch(() => {})
})
onBeforeUnmount(() => release().catch(() => {}))
</script>

<template>
  <section class="checkout">
    <StateView :state="store.status" :error-text="store.error" @retry="store.load">
      <div v-if="store.member" class="checkout__code">
        <p class="checkout__hint">Scan at the register</p>
        <img v-if="qr" :src="qr" :alt="`QR code for member ${store.member.code}`" class="checkout__qr" width="360" height="360" />
        <p class="checkout__num" aria-label="Member code">{{ store.member.code }}</p>
        <p class="checkout__pts">{{ store.member.points.toLocaleString() }} points · {{ store.tier?.name }}</p>
      </div>

      <div class="checkout__offers">
        <h2>{{ offers.clipped.length }} clipped offer{{ offers.clipped.length === 1 ? '' : 's' }} ready</h2>
        <ul v-if="offers.clipped.length">
          <li v-for="o in offers.clipped" :key="o.id"><strong>{{ o.reward }}</strong> {{ o.title }}</li>
        </ul>
        <p v-else-if="offers.status === 'ready'">Nothing clipped for {{ offers.currentStore?.name }}.</p>
        <p v-else-if="offers.status === 'error'">Offers could not load, but your code still works.</p>
      </div>
    </StateView>

    <div class="checkout__done">
      <router-link to="/" class="btn">Done</router-link>
    </div>
  </section>
</template>

<style scoped>
.checkout {
  min-height: 100vh;
  padding: var(--space-4) var(--space-4) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background: var(--color-bright-bg);
  color: var(--color-bright-ink);
}

.checkout :deep(.card),
.checkout :deep(.state--msg) {
  color: var(--color-ink);
}

.checkout__code {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.checkout__hint {
  font-weight: 800;
  font-size: var(--text-lg);
}

.checkout__qr {
  width: min(88vw, 400px);
  height: auto;
  image-rendering: pixelated;
}

.checkout__num {
  font-size: var(--text-xl);
  font-weight: 800;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
}

.checkout__pts {
  font-weight: 700;
}

.checkout__offers {
  border-top: 3px solid var(--color-bright-ink);
  padding-top: var(--space-3);
}

.checkout__offers ul {
  margin: var(--space-2) 0 0;
  padding-left: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.checkout__done {
  position: sticky;
  bottom: 0;
  margin-top: auto;
  padding: var(--space-3) 0 calc(var(--space-4) + env(safe-area-inset-bottom));
  background: var(--color-bright-bg);
}

.checkout__done .btn {
  display: grid;
  place-items: center;
  text-decoration: none;
  background: var(--color-bright-ink);
  border-color: var(--color-bright-ink);
  color: var(--color-bright-bg);
}
</style>
