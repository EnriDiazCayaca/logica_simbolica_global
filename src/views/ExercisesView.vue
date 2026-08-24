<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  exercises,
  difficultyLabel,
  difficultyDot,
  topicLabels,
  topicKeyForExercise,
  type Difficulty,
  type TopicKey,
} from '../data/exercises';
import { completedCount, totalExercises, progressPercent, isExerciseCompleted } from '../store/progress';

type FilterTab = 'todos' | Difficulty;
type TopicFilter = 'todos' | TopicKey;

const route = useRoute();
const router = useRouter();
const activeTab = ref<FilterTab>('todos');

// El filtro por tema se sincroniza con el query param `tema` (p.ej.
// /ejercicios?tema=leyes-logicas), para que los botones "Practicar" de
// Progreso y de Aprender puedan enlazar directamente a un tema concreto.
function readTopicFromQuery(): TopicFilter {
  const raw = route.query.tema;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value && value in topicLabels ? (value as TopicKey) : 'todos';
}

const activeTopic = ref<TopicFilter>(readTopicFromQuery());

watch(
  () => route.query.tema,
  () => {
    activeTopic.value = readTopicFromQuery();
  },
);

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'facil', label: 'Fácil' },
  { id: 'medio', label: 'Medio' },
  { id: 'dificil', label: 'Difícil' },
];

const topicTabs: { id: TopicFilter; label: string }[] = [
  { id: 'todos', label: 'Todos los temas' },
  ...(Object.entries(topicLabels) as [TopicKey, string][]).map(([id, label]) => ({ id, label })),
];

function selectTopic(id: TopicFilter) {
  activeTopic.value = id;
  router.replace({ query: { ...route.query, tema: id === 'todos' ? undefined : id } });
}

const filteredExercises = computed(() => {
  let list = exercises;
  if (activeTab.value !== 'todos') {
    list = list.filter((ex) => ex.level === activeTab.value);
  }
  if (activeTopic.value !== 'todos') {
    list = list.filter((ex) => topicKeyForExercise(ex) === activeTopic.value);
  }
  return list;
});

function goToExercise(id: string) {
  router.push(`/ejercicios/${id}`);
}
</script>

<template>
  <section class="ex-page">
    <div class="container">
      <h1>Ejercicios Prácticos</h1>
      <p class="ex-subtitle">Practica lógica proposicional mediante ejercicios interactivos y evalúa tu progreso.</p>

      <div class="ex-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="ex-tab"
          :class="{ 'ex-tab--active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="ex-topic-tabs">
        <button
          v-for="tab in topicTabs"
          :key="tab.id"
          type="button"
          class="ex-topic-tab"
          :class="{ 'ex-topic-tab--active': activeTopic === tab.id }"
          @click="selectTopic(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="ex-grid">
        <article v-for="ex in filteredExercises" :key="ex.id" class="ex-card">
          <h3>{{ ex.title }}</h3>
          <p class="ex-card__category">{{ ex.category }}</p>
          <p class="ex-card__level">
            Nivel : <span aria-hidden="true">{{ difficultyDot[ex.level] }}</span> {{ difficultyLabel[ex.level] }}
          </p>
          <p class="ex-card__description">Descripción: {{ ex.shortDescription }}</p>
          <span v-if="isExerciseCompleted(ex.id)" class="ex-card__done">✔ Completado</span>
          <button class="ex-card__btn" @click="goToExercise(ex.id)">Resolver</button>
        </article>
        <p v-if="filteredExercises.length === 0" class="ex-empty">
          No hay ejercicios que coincidan con estos filtros todavía.
        </p>
      </div>

      <div class="ex-progress">
        <p class="ex-progress__label">PROGRESO</p>
        <div class="ex-progress__bar">
          <div class="ex-progress__fill" :style="{ width: progressPercent + '%' }"></div>
          <span class="ex-progress__value">{{ progressPercent }}%</span>
        </div>
        <p class="ex-progress__count">
          EJERCICIOS COMPLETADOS: {{ completedCount }}/{{ totalExercises }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ex-page {
  background: var(--color-white);
  padding: 32px 0 64px;
  min-height: calc(100vh - 68px);
}

.ex-page h1 {
  font-family: var(--font-heading);
  font-size: 28px;
  margin: 0 0 8px;
  color: var(--color-text-dark);
}

.ex-subtitle {
  color: var(--color-text-gray);
  font-size: 14px;
  margin: 0 0 24px;
}

.ex-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.ex-tab {
  flex: 1;
  min-width: 120px;
  background: #dfe6f4;
  color: var(--color-text-dark);
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.2s ease, color 0.2s ease;
}

.ex-tab--active {
  background: var(--color-blue);
  color: var(--color-white);
}

.ex-topic-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.ex-topic-tab {
  background: var(--color-white);
  color: var(--color-text-dark);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 12.5px;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.ex-topic-tab:hover {
  border-color: var(--color-blue);
}

.ex-topic-tab--active {
  background: var(--color-navy);
  color: var(--color-white);
  border-color: var(--color-navy);
}

.ex-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.ex-card {
  background: #dbe6f7;
  border-radius: 12px;
  padding: 22px;
  display: flex;
  flex-direction: column;
}

.ex-card h3 {
  margin: 0 0 10px;
  font-size: 17px;
  color: var(--color-text-dark);
}

.ex-card__category {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--color-blue);
  margin: 0 0 10px;
}

.ex-card__level {
  font-size: 13px;
  margin: 0 0 10px;
  color: var(--color-text-dark);
}

.ex-card__description {
  font-size: 13px;
  color: var(--color-text-gray);
  margin: 0 0 16px;
  flex-grow: 1;
}

.ex-card__done {
  font-size: 12px;
  font-weight: 700;
  color: #1f9d55;
  margin-bottom: 10px;
}

.ex-card__btn {
  background: var(--color-blue);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.2s ease;
}

.ex-card__btn:hover {
  background: var(--color-blue-hover);
}

.ex-empty {
  color: var(--color-text-gray);
  font-size: 14px;
  grid-column: 1 / -1;
}

.ex-progress__label {
  text-align: center;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.ex-progress__bar {
  position: relative;
  background: var(--color-blue-light);
  border-radius: 999px;
  height: 30px;
  overflow: hidden;
}

.ex-progress__fill {
  background: linear-gradient(90deg, #6d93ea, var(--color-blue));
  height: 100%;
  transition: width 0.3s ease;
}

.ex-progress__value {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: 700;
  font-size: 13px;
  color: var(--color-text-dark);
}

.ex-progress__count {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin-top: 12px;
}

@media (max-width: 900px) {
  .ex-grid {
    grid-template-columns: 1fr;
  }
}
</style>
