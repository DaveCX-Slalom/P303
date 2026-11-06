import { createRouter, createWebHistory } from 'vue-router'
import PocketView from './views/PocketView.vue'
import OffersView from './views/OffersView.vue'
import StoresView from './views/StoresView.vue'
import HistoryView from './views/HistoryView.vue'
import SettingsView from './views/SettingsView.vue'
import CheckoutView from './views/CheckoutView.vue'
import RewardsView from './views/RewardsView.vue'
import ListView from './views/ListView.vue'
import InboxView from './views/InboxView.vue'
import WelcomeView from './views/WelcomeView.vue'

// `tab` says which bottom tab a page belongs to; `fullscreen` hides the tab bar.
export const routes = [
  { path: '/', name: 'pocket', component: PocketView, meta: { title: 'Pocket', tab: 'pocket' } },
  { path: '/offers', name: 'offers', component: OffersView, meta: { title: 'Offers', tab: 'offers' } },
  { path: '/list', name: 'list', component: ListView, meta: { title: 'Shopping list', tab: 'offers' } },
  { path: '/stores', name: 'stores', component: StoresView, meta: { title: 'Stores', tab: 'stores' } },
  { path: '/history', name: 'history', component: HistoryView, meta: { title: 'History', tab: 'history' } },
  { path: '/rewards', name: 'rewards', component: RewardsView, meta: { title: 'Rewards', tab: 'history' } },
  { path: '/inbox', name: 'inbox', component: InboxView, meta: { title: 'Inbox', tab: 'pocket' } },
  { path: '/settings', name: 'settings', component: SettingsView, meta: { title: 'Settings', tab: 'pocket' } },
  { path: '/checkout', name: 'checkout', component: CheckoutView, meta: { title: 'Checkout', fullscreen: true } },
  { path: '/welcome', name: 'welcome', component: WelcomeView, meta: { title: 'Welcome', fullscreen: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const seenIntro = () => {
  try {
    return localStorage.getItem('fm-onboarded') === '1'
  } catch {
    return true // no storage: never trap the member in the intro
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// First visit goes through the short intro. The member code is never blocked once it is seen or skipped.
router.beforeEach((to) => {
  if (!seenIntro() && to.name !== 'welcome') return { name: 'welcome' }
})

export default router
