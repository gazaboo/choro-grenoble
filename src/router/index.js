import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/choro',
    name: 'ChoroView',
    component: () => import('../views/ChoroView.vue')

  },
  {
    path: '/song/:theme/:instrument/:title',
    name: 'SongView',
    component: () => import('../views/SongView.vue')
  },
  {
    path: '/samba',
    name: 'SambaView',
    component: () => import('../views/SambaView.vue')
  },
  {
    path: '/*',
    name: '404',
    component: HomeView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
