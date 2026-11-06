<script setup>
const tabs = [
  { to: '/', label: 'Pocket', icon: 'M3 7h18v12H3zM3 7l3-4h12l3 4M15 13h2' },
  { to: '/offers', label: 'Offers', icon: 'M3 12l9-9h8v8l-9 9zM15 7h.01' },
  { to: '/stores', label: 'Stores', icon: 'M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z' },
  { to: '/history', label: 'History', icon: 'M12 7v5l3 2M3 12a9 9 0 109-9 9 9 0 00-7 3.5M3 4v4h4' }
]
</script>

<template>
  <nav class="tabbar" aria-label="Main">
    <router-link v-for="t in tabs" :key="t.to" :to="t.to" class="tab" :exact-active-class="t.to === '/' ? 'is-active' : ''" :active-class="t.to !== '/' ? 'is-active' : ''">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path :d="t.icon" />
      </svg>
      <span>{{ t.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--column);
  height: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  z-index: 10;
}

.tab {
  min-height: var(--touch);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--color-ink-muted);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 600;
}

.tab.is-active {
  color: var(--color-primary);
  box-shadow: inset 0 3px 0 var(--color-primary);
}
</style>
