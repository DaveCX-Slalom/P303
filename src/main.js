import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router.js'
import './assets/tokens.css'
import './assets/base.css'

createApp(App).use(createPinia()).use(router).mount('#app')
