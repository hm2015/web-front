import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // {
    //   path: '/gears',
    //   name: 'gears',
    //   component: () => import('../views/GearsView.vue'),
    // },
    // {
    //   path: '/journal',
    //   name: 'journal',
    //   component: () => import('../views/JournalView.vue'),
    // },
    // {
    //   path: '/support',
    //   name: 'support',
    //   component: () => import('../views/SupportView.vue'),
    // },
  ],
})

export default router
