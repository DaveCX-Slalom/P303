import { defineStore } from 'pinia'
import { useOnline } from '@vueuse/core'

export const useConnectivityStore = defineStore('connectivity', () => {
  const online = useOnline()
  return { online }
})
