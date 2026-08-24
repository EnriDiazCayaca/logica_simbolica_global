<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginCard, { type LoginCardMode } from '../components/LoginCard.vue';
import { login, register } from '../store/auth';

const router = useRouter();
const error = ref('');
const info = ref('');
const mode = ref<LoginCardMode>('login');
const submitting = ref(false);

function setMode(next: LoginCardMode) {
  mode.value = next;
  error.value = '';
  info.value = '';
}

async function handleSubmit(payload: { username: string; password: string; confirmPassword?: string }) {
  error.value = '';
  info.value = '';

  if (!payload.username || !payload.password) {
    error.value = 'Ingresa tu usuario y contraseña.';
    return;
  }

  if (mode.value === 'register' && payload.password !== payload.confirmPassword) {
    error.value = 'Las contraseñas no coinciden.';
    return;
  }

  submitting.value = true;
  const result =
    mode.value === 'register'
      ? await register(payload.username, payload.password)
      : await login(payload.username, payload.password);
  submitting.value = false;

  if (!result.success) {
    error.value = result.error ?? 'No se pudo completar la operación.';
    return;
  }

  router.push('/progreso');
}

function handleGoogleLogin() {
  // No hay backend ni credenciales OAuth configuradas todavía: en vez de
  // dejar el botón sin ninguna respuesta, se informa claramente al usuario
  // en lugar de simular un inicio de sesión que no existe.
  info.value = 'El inicio de sesión con Google estará disponible próximamente.';
}
</script>

<template>
  <section class="login-view">
    <div class="login-view__container container">
      <LoginCard :mode="mode" @update:mode="setMode" @submit="handleSubmit" @google-login="handleGoogleLogin" />
      <p v-if="error" class="login-view__error">{{ error }}</p>
      <p v-else-if="info" class="login-view__info">{{ info }}</p>
      <p v-if="submitting" class="login-view__info">Procesando...</p>
    </div>
  </section>
</template>

<style scoped>
.login-view {
  background: var(--color-navy);
  min-height: calc(100vh - 68px);
  display: flex;
  align-items: center;
  padding: 60px 0;
}

.login-view__container {
  width: 100%;
}

.login-view__error {
  text-align: center;
  color: #ffd9d9;
  font-size: 13px;
  font-weight: 600;
  margin-top: 16px;
}

.login-view__info {
  text-align: center;
  color: #d9e6ff;
  font-size: 13px;
  font-weight: 600;
  margin-top: 16px;
}
</style>
