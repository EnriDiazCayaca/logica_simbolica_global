<script setup lang="ts">
import { useRouter } from 'vue-router';
import heroIllustration from '../assets/hero-illustration.jpg';

const router = useRouter();

// "Comenzar" lleva a la herramienta insignia (tablas de verdad interactivas),
// que es la puerta de entrada natural al resto del contenido.
function handleStart() {
  router.push('/tablas-de-verdad');
}

// "Ver ejemplos" hace scroll a la sección "Todo lo que necesitas..." en la
// misma página, ya que ahí se listan ejemplos de cada módulo.
function handleSeeExamples() {
  document.getElementById('aprender')?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
  <section class="hero" id="inicio">
    <div class="hero__container container">
      <div class="hero__content">
        <h1 class="hero__title">
          Aprende lógica<br />
          de forma visual<br />
          e interactiva
        </h1>

        <p class="hero__description">
          Explora tablas de verdad, leyes lógicas y ejercicios interactivos
          diseñados para que aprendas a razonar como un
          <strong>verdadero filósofo..</strong>
        </p>

        <div class="hero__actions">
          <button class="btn btn--primary" @click="handleStart">
            <span aria-hidden="true">🚀</span> COMENZAR !
          </button>
          <button class="btn btn--outline" @click="handleSeeExamples">
            <span aria-hidden="true">▶</span> Ver ejemplos
          </button>
        </div>

        <div class="hero__badges">
          <span class="badge">100% Gratuita</span>
          <span class="badge">Sigue tu progreso</span>
        </div>
      </div>

      <div class="hero__media">
        <img :src="heroIllustration" alt="Estudiante razonando sobre lógica proposicional" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: var(--color-white);
  padding: 56px 0 40px;
}

.hero__container {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  align-items: center;
  gap: 32px;
}

.hero__title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 44px;
  line-height: 1.15;
  margin: 0 0 20px;
  color: var(--color-text-dark);
}

.hero__description {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text-gray);
  max-width: 480px;
  margin: 0 0 28px;
}

.hero__description strong {
  color: var(--color-text-dark);
  font-weight: 700;
}

.hero__actions {
  display: flex;
  gap: 14px;
  margin-bottom: 18px;
}

.btn {
  border-radius: 8px;
  padding: 13px 22px;
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 2px solid transparent;
  transition: transform 0.15s ease, background 0.2s ease;
}

.btn--primary {
  background: var(--color-blue);
  color: var(--color-white);
}

.btn--primary:hover {
  background: var(--color-blue-hover);
}

.btn--outline {
  background: var(--color-white);
  color: var(--color-text-dark);
  border-color: var(--color-border);
}

.btn--outline:hover {
  border-color: var(--color-blue);
}

.hero__badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.badge {
  background: var(--color-blue-badge);
  color: var(--color-text-dark);
  font-weight: 700;
  font-size: 13px;
  padding: 12px 22px;
  border-radius: 8px;
}

.hero__media img {
  width: 100%;
  height: auto;
  border-radius: 16px;
}

@media (max-width: 900px) {
  .hero__container {
    grid-template-columns: 1fr;
  }

  .hero__title {
    font-size: 34px;
  }

  .hero__media {
    order: -1;
  }
}

@media (max-width: 480px) {
  .hero__actions,
  .hero__badges {
    flex-direction: column;
  }
}
</style>
