<script setup>
import { computed } from 'vue'
import Sheet from './Sheet.vue'
import { useOffersStore } from '../stores/offers.js'
import { useListStore } from '../stores/list.js'

const props = defineProps({ offer: { type: Object, required: true } })
defineEmits(['close'])

const offers = useOffersStore()
const list = useListStore()

const clipped = computed(() => offers.isClipped(props.offer.id))
const onList = computed(() => list.hasOffer(props.offer.id))
const expired = computed(() => props.offer.expiresAt <= offers.now)
const where = computed(() =>
  props.offer.stores === 'all'
    ? 'All Fieldmarket stores'
    : offers.stores.filter((s) => props.offer.stores.includes(s.id)).map((s) => s.name.replace('Fieldmarket ', '')).join(', ')
)
</script>

<template>
  <Sheet :title="offer.title" @close="$emit('close')">
    <p class="reward"><strong>{{ offer.reward }}</strong> · {{ offer.aisle }}</p>
    <p class="time" :class="{ 'is-soon': offers.isSoon(offer) }">{{ offers.countdown(offer) }}</p>

    <section v-if="offer.products?.length">
      <h3>Applies to</h3>
      <ul><li v-for="p in offer.products" :key="p">{{ p }}</li></ul>
    </section>

    <section>
      <h3>Where</h3>
      <p>{{ where }}</p>
    </section>

    <section>
      <h3>Terms</h3>
      <ul class="terms"><li v-for="t in offer.terms" :key="t">{{ t }}</li></ul>
    </section>

    <template #actions>
      <button class="btn btn--ghost" :disabled="onList" @click="list.addFromOffer(offer)">
        {{ onList ? 'On your list ✓' : 'Add to list' }}
      </button>
      <button v-if="!expired" class="btn" :class="{ 'btn--ghost': clipped }" :aria-pressed="clipped" @click="offers.toggleClip(offer.id)">
        {{ clipped ? 'Clipped ✓' : 'Clip offer' }}
      </button>
    </template>
  </Sheet>
</template>

<style scoped>
.reward {
  font-size: var(--text-lg);
  color: var(--color-primary);
}

.time {
  color: var(--color-ink-muted);
  font-weight: 700;
}

.time.is-soon {
  color: var(--color-accent);
}

h3 {
  font-size: var(--text-base);
  margin-bottom: var(--space-1);
}

ul {
  margin: 0;
  padding-left: var(--space-5);
}

.terms {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}
</style>
