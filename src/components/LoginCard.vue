<script setup lang="ts">
import { reactive, watch } from 'vue';

export type LoginCardMode = 'login' | 'register';

const props = defineProps<{ mode: LoginCardMode }>();

const emit = defineEmits<{
  submit: [payload: { username: string; password: string; confirmPassword?: string }];
  googleLogin: [];
  'update:mode': [mode: LoginCardMode];
}>();

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
});

// Limpia los campos al alternar entre iniciar sesión y crear cuenta, para
// que no queden datos de un formulario a medio llenar en el otro.
watch(
  () => props.mode,
  () => {
    form.username = '';
    form.password = '';
    form.confirmPassword = '';
  },
);

function handleSubmit() {
  emit('submit', {
    username: form.username,
    password: form.password,
    confirmPassword: props.mode === 'register' ? form.confirmPassword : undefined,
  });
}
</script>

<template>
  <div class="login-card">
    <div class="login-card__avatar">
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    </div>

    <div class="login-card__tabs">
      <button
        type="button"
        class="login-card__tab"
        :class="{ 'login-card__tab--active': mode === 'login' }"
        @click="emit('update:mode', 'login')"
      >
        Iniciar sesión
      </button>
      <button
        type="button"
        class="login-card__tab"
        :class="{ 'login-card__tab--active': mode === 'register' }"
        @click="emit('update:mode', 'register')"
      >
        Crear cuenta
      </button>
    </div>

    <form class="login-card__form" @submit.prevent="handleSubmit">
      <label class="login-card__label" for="username">Usuario:</label>
      <input
        id="username"
        v-model="form.username"
        type="text"
        class="login-card__input"
        autocomplete="username"
      />

      <label class="login-card__label" for="password">Contraseña:</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        class="login-card__input"
        :autocomplete="mode === 'register' ? 'new-password' : 'current-password'"
      />

      <template v-if="mode === 'register'">
        <label class="login-card__label" for="confirmPassword">Confirmar contraseña:</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          class="login-card__input"
          autocomplete="new-password"
        />
      </template>

      <button type="submit" class="login-card__submit">
        {{ mode === 'register' ? 'Crear cuenta' : 'Iniciar Sesión' }}
      </button>

      <button type="button" class="login-card__google" @click="emit('googleLogin')">
        Iniciar sesión con Google
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-card {
  background: #f5f7fb;
  border-radius: 16px;
  padding: 40px 48px 32px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.login-card__avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  border: 2.5px solid var(--color-text-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--color-text-dark);
}

.login-card__avatar svg {
  width: 46px;
  height: 46px;
}

.login-card__tabs {
  display: flex;
  gap: 8px;
  background: var(--color-blue-light);
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 24px;
}

.login-card__tab {
  flex: 1;
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-dark);
  opacity: 0.6;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.login-card__tab--active {
  background: var(--color-white);
  opacity: 1;
  box-shadow: 0 1px 4px rgba(15, 45, 141, 0.12);
}

.login-card__form {
  display: flex;
  flex-direction: column;
}

.login-card__label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin-bottom: 8px;
}

.login-card__input {
  background: var(--color-blue-light);
  border: none;
  border-radius: 6px;
  padding: 13px 14px;
  font-size: 14px;
  margin-bottom: 20px;
  font-family: inherit;
  color: var(--color-text-dark);
}

.login-card__input:focus {
  outline: 2px solid var(--color-blue);
  outline-offset: 1px;
}

.login-card__submit {
  background: var(--color-blue);
  color: var(--color-white);
  border: none;
  border-radius: 6px;
  padding: 13px;
  font-size: 15px;
  font-weight: 700;
  font-style: italic;
  margin-bottom: 14px;
  transition: background 0.2s ease;
}

.login-card__submit:hover {
  background: var(--color-blue-hover);
}

.login-card__google {
  background: var(--color-white);
  color: var(--color-text-dark);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 12px;
  font-size: 13px;
  font-weight: 700;
  transition: border-color 0.2s ease;
}

.login-card__google:hover {
  border-color: var(--color-blue);
}

@media (max-width: 560px) {
  .login-card {
    padding: 32px 24px 24px;
  }
}
</style>
