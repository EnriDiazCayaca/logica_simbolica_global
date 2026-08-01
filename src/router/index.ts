import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Fundamentos from '../pages/fundamentos/index.vue'
import Tablas from '../pages/tablas/index.vue'
import Cuantificadores from '../pages/cuantificadores/index.vue'
import Inferencias from '../pages/inferencias/index.vue'
import OperacionesConjuntos from '../pages/operaciones_conjuntos/index.vue'
import Conjuntos from '../pages/conjuntos/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/fundamentos',
      name: 'fundamentos',
      component: Fundamentos
    },
    {
      path: '/tablas',
      name: 'tablas',
      component: Tablas
    },
    {
      path: '/cuantificadores',
      name: 'cuantificadores',
      component: Cuantificadores
    },
    {
      path: '/inferencias',
      name: 'inferencias',
      component: Inferencias
    },
    {
      path: '/operaciones_conjuntos',
      name: 'operaciones_conjuntos',
      component: OperacionesConjuntos
    },
    {
      path: '/conjuntos',
      name: 'conjuntos',
      component: Conjuntos
    }
  ]
})

export default router
