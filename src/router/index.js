import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/ChoroSongListView.vue')
  },
  {
    path: '/choro',
    name: 'ChoroSongListView',
    component: () => import('../views/ChoroSongListView.vue')

  },
  {
    path: '/mscore/:theme/:instrument/:title',
    name: 'ChoroSongMuseScoreView',
    component: () => import('../views/ChoroSongMuseScoreView.vue')
  },
  {
    path: '/mxml/:theme/:instrument/:title',
    name: 'ChoroSongOSMDView',
    component: () => import('../views/ChoroSongOSMDView.vue')
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
