<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import OfflineBanner from './components/OfflineBanner.vue'
import TabBar from './components/TabBar.vue'

const route = useRoute()
watch(
  () => route.meta.title,
  (t) => (document.title = t ? `${t} | Loyalty Pocket` : 'Loyalty Pocket'),
  { immediate: true }
)
</script>

<template>
  <div class="shell">
    <OfflineBanner />
    <main class="shell__main">
      <router-view />
    </main>
    <TabBar />
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
</style>
