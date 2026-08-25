import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Tablas from '../pages/tablas/index.vue'
import Ejercicios from '../pages/ejercicios/index.vue'
import EjercicioRunner from '../pages/ejercicios/[id].vue'
import LeyesLogicas from '../pages/leyes-logicas/index.vue'
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
      path: '/ejercicios',
      name: 'ejercicios',
      component: Ejercicios
    },
    {
      path: '/ejercicios/:id',
      name: 'ejercicio-detalle',
      component: EjercicioRunner
    },
    {
      path: '/leyes-logicas',
      name: 'leyes-logicas',
      component: LeyesLogicas
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
