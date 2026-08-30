import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Tablas from '../pages/tablas/index.vue'
import Cuantificadores from '../pages/cuantificadores/index.vue'
import Inferencias from '../pages/inferencias/index.vue'
import Conjuntos from '../pages/conjuntos/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/tablas',
      name: 'tablas',
      component: Tablas
    },
    {
      path: '/inferencias',
      name: 'inferencias',
      component: Inferencias
    },
    {
      path: '/cuantificadores',
      name: 'cuantificadores',
      component: Cuantificadores
    },
    {
      path: '/conjuntos',
      name: 'conjuntos',
      component: Conjuntos
    }
  ]
})

export default router
