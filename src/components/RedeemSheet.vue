<script setup>
import { computed, ref } from 'vue'
import Sheet from './Sheet.vue'
import ConfettiBurst from './ConfettiBurst.vue'
import { api } from '../api/mock.js'
import { useMemberStore } from '../stores/member.js'
import { useConnectivityStore } from '../stores/connectivity.js'

const props = defineProps({ preselect: { type: Object, default: null } })
defineEmits(['close'])

const member = useMemberStore()
const connectivity = useConnectivityStore()

const rewards = api.getRewards()
const picked = ref(props.preselect && member.rewardState(props.preselect).ok ? props.preselect : null)
const busy = ref(false)
const done = ref('')
const error = ref('')
const celebrate = ref(0)

const points = computed(() => member.member?.points ?? 0)

async function confirm() {
  if (!picked.value) return
  busy.value = true
  error.value = ''
  try {
    const tx = await member.redeem(picked.value)
    done.value = `${tx.label} redeemed. Show your code at checkout.`
    picked.value = null
    celebrate.value++
  } catch (e) {
    error.value = e.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <Sheet title="Redeem points" @close="$emit('close')">
    <p class="muted">You have <strong>{{ points.toLocaleString() }}</strong> points.</p>
    <p v-if="done" class="ok" role="status">{{ done }}</p>
    <p v-if="!connectivity.online" class="err" role="alert">You're offline. Reconnect to redeem.</p>
    <p v-if="error" class="err" role="alert">{{ error }}</p>

    <ul class="rewards">
      <li v-for="r in rewards" :key="r.id">
        <button class="btn reward" :class="{ 'btn--ghost': picked?.id !== r.id }" :disabled="!member.rewardState(r).ok"
                :aria-pressed="picked?.id === r.id" @click="picked = r">
          <span class="reward__name">{{ r.label }}<small v-if="!member.rewardState(r).ok">{{ member.rewardState(r).reason }}</small></span>
          <span>{{ r.cost.toLocaleString() }} pts</span>
        </button>
      </li>
    </ul>

    <template #actions>
      <button class="btn btn--ghost" @click="$emit('close')">Close</button>
      <button class="btn btn--accent" :disabled="!picked || busy || !connectivity.online" @click="confirm">
        {{ busy ? 'Redeeming…' : 'Confirm' }}
      </button>
    </template>
    <ConfettiBurst v-if="celebrate" :key="celebrate" />
  </Sheet>
</template>

<style scoped>
.muted {
  color: var(--color-ink-muted);
}

.rewards {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.reward {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  text-align: left;
  padding-block: var(--space-2);
}

.reward__name {
  display: flex;
  flex-direction: column;
}

.reward__name small {
  font-weight: 400;
}

.ok {
  color: var(--color-primary);
  font-weight: 700;
}

.err {
  color: var(--color-accent);
  font-weight: 700;
}
</style>
