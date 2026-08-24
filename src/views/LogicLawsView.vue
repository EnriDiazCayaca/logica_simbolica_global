<script setup lang="ts">
import { computed, ref } from 'vue';
import { logicLaws } from '../data/logicLaws';

const search = ref('');

const filteredLaws = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return logicLaws;
  return logicLaws.filter(
    (law) =>
      law.name.toLowerCase().includes(term) ||
      law.description.toLowerCase().includes(term) ||
      law.formulas.some((f) => f.toLowerCase().includes(term)),
  );
});
</script>

<template>
  <section class="laws-page">
    <div class="container">
      <div class="laws-header">
        <div>
          <h1>Leyes Lógicas</h1>
          <p>Consulta y aprende las reglas fundamentales de la lógica proposicional.</p>
        </div>
        <div class="laws-search">
          <span class="laws-search__icon" aria-hidden="true">🔍</span>
          <input v-model="search" type="text" placeholder="Buscar una ley lógica..." />
        </div>
      </div>

      <p v-if="filteredLaws.length === 0" class="laws-empty">
        No se encontraron leyes que coincidan con "{{ search }}".
      </p>

      <div class="laws-grid">
        <article v-for="law in filteredLaws" :key="law.id" class="law-card">
          <div class="law-card__header">
            <span class="law-card__number">{{ law.id }}.</span>
            <h3>{{ law.name }}</h3>
          </div>
          <p class="law-card__description">{{ law.description }}</p>
          <div class="law-card__formulas">
            <p v-for="(formula, idx) in law.formulas" :key="idx">{{ formula }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.laws-page {
  background: var(--color-white);
  padding: 32px 0 64px;
  min-height: calc(100vh - 68px);
}

.laws-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.laws-header h1 {
  font-family: var(--font-heading);
  font-size: 28px;
  margin: 0 0 8px;
  color: var(--color-text-dark);
}

.laws-header p {
  margin: 0;
  color: var(--color-text-gray);
  font-size: 14px;
}

.laws-search {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-text-dark);
  border-radius: 8px;
  padding: 10px 14px;
  min-width: 320px;
}

.laws-search input {
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
  font-family: inherit;
}

.laws-empty {
  color: var(--color-text-gray);
  font-size: 14px;
  margin-bottom: 20px;
}

.laws-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.law-card {
  background: #86b3f0;
  border-radius: 12px;
  padding: 18px 20px;
}

.law-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.law-card__number {
  background: var(--color-navy);
  color: var(--color-white);
  font-size: 12px;
  font-weight: 700;
  border-radius: 5px;
  padding: 2px 7px;
}

.law-card__header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-dark);
}

.law-card__description {
  font-size: 12.5px;
  line-height: 1.5;
  color: #1c2a4a;
  margin: 0 0 14px;
}

.law-card__formulas {
  background: var(--color-blue);
  color: var(--color-white);
  border-radius: 8px;
  padding: 12px 16px;
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 600;
}

.law-card__formulas p {
  margin: 0 0 4px;
}

.law-card__formulas p:last-child {
  margin-bottom: 0;
}

@media (max-width: 960px) {
  .laws-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .laws-search {
    min-width: 0;
    width: 100%;
  }
}

@media (max-width: 620px) {
  .laws-grid {
    grid-template-columns: 1fr;
  }
}
</style>
