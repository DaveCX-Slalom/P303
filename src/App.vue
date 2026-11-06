<script setup>
import { computed, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import OfflineBanner from './components/OfflineBanner.vue'
import TabBar from './components/TabBar.vue'
import { useMemberStore } from './stores/member.js'

const route = useRoute()
const member = useMemberStore()
const fullscreen = computed(() => !!route.meta.fullscreen)

watch(
  () => route.meta.title,
  (t) => (document.title = t ? `${t} | Loyalty Pocket` : 'Loyalty Pocket'),
  { immediate: true }
)

// Theme: "system" follows the device; light and dark are forced with data-theme on <html>.
watchEffect(() => {
  const t = member.settings.theme
  const root = document.documentElement
  if (t === 'light' || t === 'dark') root.dataset.theme = t
  else delete root.dataset.theme
  const dark = t === 'dark' || (t !== 'light' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#101a14' : '#1f5f3a')
})
</script>

<template>
  <a href="#main" class="skip">Skip to content</a>
  <div class="shell">
    <OfflineBanner />
    <main id="main" class="shell__main" :class="{ 'is-fullscreen': fullscreen }" tabindex="-1">
      <router-view />
    </main>
    <TabBar v-if="!fullscreen" />
  </div>
</template>

<style>
.shell {
  position: relative;
  max-width: var(--column);
  min-height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.shell__main {
  flex: 1;
  padding-bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
}

.shell__main.is-fullscreen {
  padding-bottom: 0;
}

.shell__main:focus {
  outline: none;
}

.skip {
  position: absolute;
  left: var(--space-3);
  top: -80px;
  z-index: 50;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  background: var(--color-ink);
  color: var(--color-bg);
  font-weight: 700;
}

.skip:focus {
  top: var(--space-3);
}
</style>
