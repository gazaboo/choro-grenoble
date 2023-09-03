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
    name: 'ChoroSongListView',
    component: () => import('../views/ChoroSongListView.vue')

  },
  {
    path: '/song/:theme/:instrument/:title',
    name: 'ChoroSongView',
    component: () => import('../views/ChoroSongView.vue')
  },
  {
    path: '/samba',
    name: 'SambaSongListView',
    component: () => import('../views/SambaSongListView.vue')
  },
  {
    path: '/samba/:title',
    name: 'GrilleSambaView',
    component: () => import('../views/GrilleSambaView.vue')
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
