import { createRouter, createWebHistory } from 'vue-router'
import Flow from '../views/Flow.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Flow
    }
  ]
})

export default router
