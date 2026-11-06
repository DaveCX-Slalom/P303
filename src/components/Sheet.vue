<script setup>
// Accessible bottom sheet: focus moves in, Tab is trapped, Esc and scrim close it, focus returns to the opener.
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({ title: { type: String, required: true } })
const emit = defineEmits(['close'])

const root = ref(null)
let opener = null
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

function onKey(e) {
  if (e.key === 'Escape') {
    emit('close')
    return
  }
  if (e.key !== 'Tab' || !root.value) return
  const els = [...root.value.querySelectorAll(FOCUSABLE)]
  if (!els.length) return
  const first = els[0]
  const last = els[els.length - 1]
  const active = document.activeElement
  if (!root.value.contains(active) || active === root.value) {
    // Focus escaped (for example the focused button became disabled): bring it back in.
    e.preventDefault()
    ;(e.shiftKey ? last : first).focus()
  } else if (e.shiftKey && active === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

// If the focused control disables itself, focus drops to <body>; put it back on the sheet.
function onFocusOut() {
  setTimeout(() => {
    if (root.value && document.activeElement === document.body) root.value.focus()
  }, 0)
}

onMounted(() => {
  opener = document.activeElement
  document.body.style.overflow = 'hidden'
  // Document-level so Esc and Tab work wherever focus is.
  document.addEventListener('keydown', onKey)
  nextTick(() => root.value?.focus())
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
  opener?.focus?.()
})
</script>

<template>
  <div class="scrim" @click.self="emit('close')">
    <div ref="root" class="sheet" role="dialog" aria-modal="true" :aria-label="title" tabindex="-1" @focusout="onFocusOut">
      <div class="sheet__grab" aria-hidden="true" />
      <div class="sheet__head">
        <h2>{{ title }}</h2>
        <button class="sheet__x" aria-label="Close" @click="emit('close')">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
      <div class="sheet__body" tabindex="0"><slot /></div>
      <div class="sheet__actions">
        <slot name="actions">
          <button class="btn btn--ghost" @click="emit('close')">Close</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgb(8 14 10 / 60%);
  animation: fade 0.18s ease-out;
}

.sheet {
  width: 100%;
  max-width: var(--column);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom));
  background: var(--color-bg);
  color: var(--color-ink);
  border-radius: var(--radius) var(--radius) 0 0;
  animation: rise 0.22s ease-out;
}

.sheet:focus {
  outline: none;
}

.sheet__grab {
  align-self: center;
  width: 40px;
  height: 5px;
  border-radius: 999px;
  background: var(--color-border);
}

.sheet__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.sheet__x {
  flex: none;
  width: var(--touch);
  height: var(--touch);
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: var(--color-surface-alt);
}

.sheet__body {
  overflow-y: auto;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.sheet__actions {
  display: flex;
  gap: var(--space-3);
}

.sheet__actions > :deep(*) {
  flex: 1;
}

@keyframes rise {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
}
</style>
