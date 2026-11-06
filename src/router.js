import { createRouter, createWebHistory } from 'vue-router'
import PocketView from './views/PocketView.vue'
import OffersView from './views/OffersView.vue'
import StoresView from './views/StoresView.vue'
import HistoryView from './views/HistoryView.vue'
import SettingsView from './views/SettingsView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'pocket', component: PocketView, meta: { title: 'Pocket' } },
    { path: '/offers', name: 'offers', component: OffersView, meta: { title: 'Offers' } },
    { path: '/stores', name: 'stores', component: StoresView, meta: { title: 'Stores' } },
    { path: '/history', name: 'history', component: HistoryView, meta: { title: 'History' } },
    { path: '/settings', name: 'settings', component: SettingsView, meta: { title: 'Settings' } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0 })
})
