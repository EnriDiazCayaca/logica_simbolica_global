import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/fundamentos',
    name: 'Fundamentos',
    component: () => import('@/pages/fundamentos/index.vue')
  },
  {
    path: '/tablas',
    name: 'Tablas',
    component: () => import('@/pages/tablas/index.vue')
  },
  {
    path: '/condicionales',
    name: 'Condicionales',
    component: () => import('@/pages/condicionales/index.vue')
  },
  {
    path: '/inferencias',
    name: 'Inferencias',
    component: () => import('@/pages/inferencias/index.vue')
  },
  {
    path: '/derivaciones',
    name: 'Derivaciones',
    component: () => import('@/pages/derivaciones/index.vue')
  },
  {
    path: '/conjuntos',
    name: 'Conjuntos',
    component: () => import('@/pages/conjuntos/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
