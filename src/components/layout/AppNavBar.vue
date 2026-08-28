<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

interface NavLink {
  label: string
  to: string
}

const navLinks: NavLink[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Aprender', to: '/aprender' },
  { label: 'Tablas de verdad', to: '/tablas' },
  { label: 'Leyes lógicas', to: '/leyes-logicas' },
  { label: 'Ejercicios', to: '/ejercicios' },
  { label: 'Progreso', to: '/progreso' },
]

const route = useRoute()

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

const mobileMenuOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

watch(() => route.fullPath, () => closeMobileMenu())
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-[#0F2D8C]/90 glass border-b border-white/10 backdrop-blur-xl">
    <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent pointer-events-none" />
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 py-3.5">
      <RouterLink to="/" class="flex items-center gap-2.5 shrink-0">
        <div class="w-9 h-9 rounded-[10px] bg-white/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5">
            <path d="M12 5.5C10.3 4.3 7.8 3.8 5.5 4c-.6.05-1 .55-1 1.15v12.2c0 .7.6 1.2 1.3 1.15 2-.15 4.2.3 6.2 1.5 2-1.2 4.2-1.65 6.2-1.5.7.05 1.3-.45 1.3-1.15V5.15c0-.6-.4-1.1-1-1.15-2.3-.2-4.8.3-6.5 1.5Z" stroke="white" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" />
            <path d="M12 5.5v13.5" stroke="white" stroke-width="1.4" stroke-linecap="round" />
            <path d="M8.4 15.2l2 1.7 3.6-4" stroke="#7fd7a3" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="leading-none">
          <span class="text-white text-sm font-semibold">Logi<strong class="font-extrabold">Learn</strong></span>
          <span class="block text-blue-200 text-[10px] mt-0.5">Leyes lógicas y tablas de verdad</span>
        </div>
      </RouterLink>

      <nav class="hidden md:flex items-center gap-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(link.to) ? 'bg-white/15 text-white' : 'text-blue-100 hover:text-white hover:bg-white/10'"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <button
        type="button"
        class="md:hidden flex flex-col gap-1 p-2"
        :aria-label="mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
        @click="toggleMobileMenu"
      >
        <span class="block w-5 h-0.5 bg-white rounded transition-transform" :class="mobileMenuOpen && 'rotate-45 translate-y-1.5'" />
        <span class="block w-5 h-0.5 bg-white rounded transition-opacity" :class="mobileMenuOpen && 'opacity-0'" />
        <span class="block w-5 h-0.5 bg-white rounded transition-transform" :class="mobileMenuOpen && '-rotate-45 -translate-y-1.5'" />
      </button>
    </div>

    <nav v-if="mobileMenuOpen" class="md:hidden border-t border-white/10 px-4 pb-3">
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
        :class="isActive(link.to) ? 'bg-white/15 text-white' : 'text-blue-100 hover:text-white hover:bg-white/10'"
        @click="closeMobileMenu"
      >
        {{ link.label }}
      </RouterLink>
    </nav>
  </header>
</template>
