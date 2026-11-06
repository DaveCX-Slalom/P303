<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BrandLogo from '../components/BrandLogo.vue'
import ArtIllustration from '../components/ArtIllustration.vue'

const router = useRouter()
const step = ref(0)
const slides = [
  { art: null, title: 'Your member code, always ready', text: 'Open the app and your code is right there, even with no signal in the store.' },
  { art: 'offers', title: 'The best offers, in your aisle', text: 'Clip with a swipe or a tap. Offers are sorted for the store you are in, with expiry countdowns.' },
  { art: 'rewards', title: 'Spend your points in seconds', text: 'See what your points can get you, then redeem with one confirm. Checkout mode puts it all on one screen.' }
]
const slide = computed(() => slides[step.value])
const last = computed(() => step.value === slides.length - 1)

function finish() {
  try {
    localStorage.setItem('fm-onboarded', '1')
  } catch {
    /* storage unavailable: the intro just shows again next time */
  }
  router.replace('/')
}
function next() {
  last.value ? finish() : step.value++
}
</script>

<template>
  <section class="welcome">
    <div class="welcome__top"><BrandLogo :size="44" /></div>

    <div class="welcome__body" aria-live="polite">
      <div class="welcome__art">
        <BrandLogo v-if="!slide.art" :size="96" :wordmark="false" />
        <ArtIllustration v-else :name="slide.art" />
      </div>
      <h1>{{ slide.title }}</h1>
      <p>{{ slide.text }}</p>
      <div class="dots" role="img" :aria-label="`Step ${step + 1} of ${slides.length}`">
        <span v-for="(s, i) in slides" :key="i" :class="{ 'is-on': i === step }" />
      </div>
    </div>

    <div class="welcome__actions">
      <button class="btn btn--ghost" @click="finish">Skip</button>
      <button class="btn" @click="next">{{ last ? 'Get started' : 'Next' }}</button>
    </div>
  </section>
</template>

<style scoped>
.welcome {
  min-height: 100vh;
  padding: var(--space-5) var(--space-4) calc(var(--space-5) + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.welcome__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  text-align: center;
}

.welcome__art {
  display: grid;
  place-items: center;
  min-height: 120px;
  transform: scale(1.4);
  margin-bottom: var(--space-4);
}

.welcome__body p {
  color: var(--color-ink-muted);
  max-width: 34ch;
}

.dots {
  display: flex;
  gap: var(--space-2);
}

.dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border);
}

.dots span.is-on {
  width: 28px;
  border-radius: 999px;
  background: var(--color-primary);
}

.welcome__actions {
  display: flex;
  gap: var(--space-3);
}

.welcome__actions > * {
  flex: 1;
}
</style>
