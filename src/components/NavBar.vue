<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isAuthenticated, currentUsername, logout } from '../store/auth';

interface NavLink {
  label: string;
  to: string;
}

// Nota de diseño: en las capturas, el enlace "Progreso" solo aparece en la
// pantalla del dashboard de progreso. Como es una sección real de la app,
// se incluyó de forma permanente en el menú para que la navegación sea
// consistente en todas las pantallas.
//
// "Aprender" antes apuntaba a un simple ancla (`/#aprender`) sin contenido
// propio. Ahora es una vista real (recorrido guiado por concepto + repaso
// inteligente), así que enlaza a su propia ruta.
const navLinks: NavLink[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Aprender', to: '/aprender' },
  { label: 'Tablas de verdad', to: '/tablas-de-verdad' },
  { label: 'Leyes lógicas', to: '/leyes-logicas' },
  { label: 'Ejercicios', to: '/ejercicios' },
  { label: 'Progreso', to: '/progreso' },
];

const route = useRoute();
const router = useRouter();

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/';
  return route.path.startsWith(to);
}

function handleLogout() {
  logout();
  router.push('/');
}

// --- Menú móvil: reemplaza a navbar__links (oculto por CSS) por debajo de
// 1000px. Se cierra automáticamente al navegar a otra ruta.
const mobileMenuOpen = ref(false);

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

watch(
  () => route.fullPath,
  () => closeMobileMenu(),
);

function handleMobileLogout() {
  closeMobileMenu();
  handleLogout();
}
</script>

<template>
  <header class="navbar">
    <div class="navbar__container container">
      <RouterLink to="/" class="navbar__brand">
        <div class="navbar__logo">
          <!-- Logo: libro abierto (aprendizaje) con una marca de verificación
               (razonamiento válido), en trazo limpio de un solo color. -->
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 5.5C10.3 4.3 7.8 3.8 5.5 4c-.6.05-1 .55-1 1.15v12.2c0 .7.6 1.2 1.3 1.15 2-.15 4.2.3 6.2 1.5 2-1.2 4.2-1.65 6.2-1.5.7.05 1.3-.45 1.3-1.15V5.15c0-.6-.4-1.1-1-1.15-2.3-.2-4.8.3-6.5 1.5Z"
              stroke="white"
              stroke-width="1.4"
              stroke-linejoin="round"
              stroke-linecap="round"
            />
            <path d="M12 5.5v13.5" stroke="white" stroke-width="1.4" stroke-linecap="round" />
            <path
              d="M8.4 15.2l2 1.7 3.6-4"
              stroke="#7fd7a3"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="navbar__title">
          <span class="navbar__name">Logi<strong>Learn</strong></span>
          <span class="navbar__subtitle">Leyes lógicas y tablas de verdad</span>
        </div>
      </RouterLink>

      <nav class="navbar__links">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="navbar__link"
          :class="{ 'navbar__link--active': isActive(link.to) }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div v-if="isAuthenticated" class="navbar__session">
        <span class="navbar__user">👤 {{ currentUsername }}</span>
        <button type="button" class="navbar__cta navbar__cta--ghost" @click="handleLogout">
          Cerrar sesión
        </button>
      </div>
      <RouterLink v-else to="/login" class="navbar__cta navbar__cta--desktop-only">Iniciar sesión</RouterLink>

      <button
        type="button"
        class="navbar__toggle"
        :class="{ 'navbar__toggle--open': mobileMenuOpen }"
        :aria-expanded="mobileMenuOpen"
        aria-controls="navbar-mobile-panel"
        :aria-label="mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'"
        @click="toggleMobileMenu"
      >
        <span class="navbar__toggle-bar"></span>
        <span class="navbar__toggle-bar"></span>
        <span class="navbar__toggle-bar"></span>
      </button>
    </div>

    <nav
      v-if="mobileMenuOpen"
      id="navbar-mobile-panel"
      class="navbar__mobile-panel"
      aria-label="Navegación principal (móvil)"
    >
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="navbar__mobile-link"
        :class="{ 'navbar__mobile-link--active': isActive(link.to) }"
        @click="closeMobileMenu"
      >
        {{ link.label }}
      </RouterLink>

      <div class="navbar__mobile-session">
        <template v-if="isAuthenticated">
          <span class="navbar__user">👤 {{ currentUsername }}</span>
          <button type="button" class="navbar__cta navbar__cta--ghost" @click="handleMobileLogout">
            Cerrar sesión
          </button>
        </template>
        <RouterLink v-else to="/login" class="navbar__cta" @click="closeMobileMenu">Iniciar sesión</RouterLink>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  background: var(--color-navy);
  width: 100%;
}

.navbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 14px;
  padding-bottom: 14px;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.navbar__logo {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.navbar__logo svg {
  width: 21px;
  height: 21px;
}

.navbar__title {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.navbar__name {
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: 17px;
  color: var(--color-white);
}

.navbar__name strong {
  font-weight: 700;
}

.navbar__subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.navbar__link {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-white);
  white-space: nowrap;
  transition: opacity 0.2s ease;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
}

.navbar__link:hover {
  opacity: 0.75;
}

.navbar__link--active {
  border-bottom-color: var(--color-white);
  font-weight: 700;
}

.navbar__session {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.navbar__user {
  color: var(--color-white);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.navbar__cta {
  background: var(--color-blue);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.2s ease;
}

.navbar__cta:hover {
  background: var(--color-blue-hover);
}

.navbar__cta--ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.navbar__cta--ghost:hover {
  background: rgba(255, 255, 255, 0.12);
}

.navbar__toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
}

.navbar__toggle-bar {
  display: block;
  width: 20px;
  height: 2px;
  border-radius: 2px;
  background: var(--color-white);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.navbar__toggle--open .navbar__toggle-bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.navbar__toggle--open .navbar__toggle-bar:nth-child(2) {
  opacity: 0;
}

.navbar__toggle--open .navbar__toggle-bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.navbar__mobile-panel {
  display: none;
}

@media (max-width: 1000px) {
  .navbar__links,
  .navbar__session,
  .navbar__cta--desktop-only {
    display: none;
  }

  .navbar__toggle {
    display: inline-flex;
  }

  .navbar__mobile-panel {
    display: flex;
    flex-direction: column;
    background: var(--color-navy-dark);
    padding: 8px 24px 20px;
    gap: 4px;
  }

  .navbar__mobile-link {
    color: var(--color-white);
    font-size: 15px;
    font-weight: 600;
    padding: 12px 6px;
    border-radius: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .navbar__mobile-link:last-of-type {
    border-bottom: none;
  }

  .navbar__mobile-link--active {
    color: #7fd7a3;
  }

  .navbar__mobile-session {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
    padding-top: 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
  }

  .navbar__mobile-session .navbar__cta {
    width: 100%;
    text-align: center;
  }
}
</style>
