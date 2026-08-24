<script setup lang="ts">
import FeatureCard from './FeatureCard.vue';

interface Feature {
  title: string;
  description: string;
  icon: 'truth-table' | 'logic-laws' | 'exercises' | 'progress';
  to: string;
}

const features: Feature[] = [
  {
    title: 'Tablas de verdad',
    description: 'Genera y comprende tablas de verdad de cualquier proposición lógica.',
    icon: 'truth-table',
    to: '/tablas-de-verdad',
  },
  {
    title: 'Leyes Lógicas',
    description: 'Aprende las leyes fundamentales de la lógica proposicional con ejemplos.',
    icon: 'logic-laws',
    to: '/leyes-logicas',
  },
  {
    title: 'Ejercicios prácticos',
    description: 'Pon a prueba tus conocimientos con ejercicios interactivos y divertidos.',
    icon: 'exercises',
    to: '/ejercicios',
  },
  {
    title: 'Tu progreso',
    description: 'Sigue tu avance, gana logros y conviértete en un experto.',
    icon: 'progress',
    to: '/progreso',
  },
];
</script>

<template>
  <section class="features" id="aprender">
    <div class="container">
      <h2 class="features__heading">
        <span aria-hidden="true">⇄</span>
        Todo lo que necesitas para aprender lógica
        <span aria-hidden="true">⇄</span>
      </h2>

      <div class="features__grid">
        <RouterLink v-for="feature in features" :key="feature.title" :to="feature.to" class="features__link">
          <FeatureCard :title="feature.title" :description="feature.description" :icon="feature.icon" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  padding: 24px 0 64px;
}

.features__heading {
  text-align: center;
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 0 32px;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.features__link {
  display: block;
  color: inherit;
}

@media (max-width: 900px) {
  .features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .features__grid {
    grid-template-columns: 1fr;
  }
}
</style>
