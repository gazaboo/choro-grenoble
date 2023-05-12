import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SambaView from '../views/SambaView.vue'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/song/:theme/:instrument/:title',
    name: 'SongView',
    component: () => import('../views/SongView.vue')
  },
  {
    path: '/samba',
    name: 'SambaView',
    component: SambaView
  }


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
