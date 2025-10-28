import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Draw from '../views/Draw.vue'
import Train from '../views/Train.vue'
import Manage from '../views/Manage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/draw',
    name: 'Draw',
    component: Draw
  },
  {
    path: '/train',
    name: 'Train',
    component: Train
  },
  {
    path: '/manage',
    name: 'Manage',
    component: Manage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router