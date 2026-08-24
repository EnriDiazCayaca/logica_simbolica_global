<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  completedCount,
  totalExercises,
  progressPercent,
  accuracyPercent,
  topicProgress,
  weakTopics,
  masteredTopics,
  recommendedTopic,
  level,
  achievements,
  progressState,
} from '../store/progress';
import { isAuthenticated, currentUsername } from '../store/auth';

const router = useRouter();

// --- Gráfico de evolución: se construye a partir del registro diario real
// (progressState.dailyLog), nunca de números de ejemplo. Muestra el % de
// precisión de cada día con actividad registrada.
const chartDays = computed(() =>
  progressState.dailyLog.map((d) => ({
    date: d.date,
    label: new Date(d.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', ''),
    accuracy: d.total === 0 ? 0 : Math.round((d.correct / d.total) * 100),
  })),
);

const chartPath = computed(() => {
  const points = chartDays.value;
  if (points.length < 2) return '';
  const w = 260;
  const h = 140;
  const stepX = w / (points.length - 1);
  return points
    .map((p, idx) => {
      const x = idx * stepX;
      const y = h - (p.accuracy / 100) * h;
      return `${idx === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
});

const chartPoints = computed(() => {
  const points = chartDays.value;
  if (points.length < 2) return [];
  const w = 260;
  const h = 140;
  const stepX = w / (points.length - 1);
  return points.map((p, idx) => ({ x: idx * stepX, y: h - (p.accuracy / 100) * h }));
});

const statusLabel: Record<string, string> = {
  completado: 'Completado',
  'en-progreso': 'En progreso',
  pendiente: 'Pendiente',
};

function goPractice(topicKey: string) {
  router.push({ path: '/ejercicios', query: { tema: topicKey } });
}

function goLearn() {
  router.push('/aprender');
}

const recommendations = computed(() => {
  const list: string[] = [];
  if (recommendedTopic.value) {
    list.push(`Tema recomendado ahora: "${recommendedTopic.value.label}".`);
  }
  if (weakTopics.value.length > 0 && weakTopics.value[0].key !== recommendedTopic.value?.key) {
    list.push(`Refuerza "${weakTopics.value[0].label}": tu precisión ahí es de ${weakTopics.value[0].accuracy}%.`);
  }
  const pending = topicProgress.value.filter((t) => t.status === 'pendiente');
  if (pending.length > 0) {
    list.push(`Todavía no practicas "${pending[0].label}". Empieza cuando quieras.`);
  }
  if (accuracyPercent.value > 0 && accuracyPercent.value < 90) {
    list.push(`Mantén una precisión mayor al 90% (actual: ${accuracyPercent.value}%) repasando tus errores recientes.`);
  }
  if (list.length === 0) {
    list.push('¡Vas muy bien! Sigue practicando para mantener tu racha y precisión.');
  }
  return list.slice(0, 3);
});
</script>

<template>
  <section class="pg-page">
    <div class="container">
      <h1>Progreso del estudiante</h1>
      <p class="pg-subtitle" v-if="isAuthenticated">
        Visualiza tu avance en lógica proposicional, {{ currentUsername }}
      </p>
      <p class="pg-subtitle" v-else>Visualiza tu avance en lógica proposicional</p>

      <p v-if="!isAuthenticated" class="pg-guest-banner">
        Estás viendo un progreso de invitado guardado solo en este navegador.
        <RouterLink to="/login">Inicia sesión o crea una cuenta</RouterLink> para guardar tu propio avance.
      </p>

      <div class="pg-stats">
        <div class="pg-stat">
          <p class="pg-stat__value">{{ progressPercent }}%</p>
          <p class="pg-stat__label">Progreso</p>
        </div>
        <div class="pg-stat">
          <p class="pg-stat__value">{{ completedCount }}/{{ totalExercises }}</p>
          <p class="pg-stat__label">Ejercicios</p>
        </div>
        <div class="pg-stat">
          <p class="pg-stat__value">🔥 {{ progressState.streak }}</p>
          <p class="pg-stat__label">Racha de días</p>
        </div>
        <div class="pg-stat">
          <p class="pg-stat__value">⭐ {{ progressState.points }}</p>
          <p class="pg-stat__label">Puntos</p>
        </div>
        <div class="pg-stat">
          <p class="pg-stat__value">Nivel {{ level.number }}</p>
          <p class="pg-stat__label">{{ level.label }}</p>
        </div>
      </div>

      <div class="pg-panels">
        <div class="pg-panel">
          <svg v-if="chartPoints.length > 1" viewBox="0 0 300 170" class="pg-chart">
            <line
              v-for="(n, i) in [0, 20, 40, 60, 80, 100]"
              :key="i"
              x1="30"
              :y1="140 - (n / 100) * 140"
              x2="290"
              :y2="140 - (n / 100) * 140"
              stroke="rgba(15,45,141,0.08)"
            />
            <text v-for="(n, i) in [0, 20, 40, 60, 80, 100]" :key="'t' + i" x="0" :y="144 - (n / 100) * 140" font-size="11" fill="#14142b">{{ n }}</text>
            <g transform="translate(30, 0)">
              <path :d="chartPath" fill="none" stroke="#14142b" stroke-width="2.5" />
              <circle v-for="(p, idx) in chartPoints" :key="idx" :cx="p.x" :cy="p.y" r="4.5" fill="#14142b" />
            </g>
            <g transform="translate(30, 155)">
              <text
                v-for="(day, idx) in chartDays"
                :key="day.date"
                :x="(idx * 260) / (chartDays.length - 1)"
                y="0"
                font-size="12"
                font-weight="700"
                text-anchor="middle"
                fill="#14142b"
              >
                {{ day.label }}
              </text>
            </g>
          </svg>
          <p v-else class="pg-panel__empty">
            Completa ejercicios en distintos días para ver aquí tu evolución de precisión.
          </p>
        </div>

        <div class="pg-panel pg-panel--level">
          <h3>Nivel actual</h3>
          <div class="pg-gauge">
            <div class="pg-gauge__fill" :style="{ width: progressPercent + '%' }"></div>
            <div class="pg-gauge__thumb" :style="{ left: progressPercent + '%' }"></div>
          </div>
          <p class="pg-gauge__value">{{ progressPercent }}%</p>
          <p class="pg-gauge__accuracy">Precisión general: {{ accuracyPercent }}%</p>
        </div>
      </div>

      <!-- Progreso por tema -->
      <h2 class="pg-section-title">Progreso por tema</h2>
      <div class="pg-topics">
        <div v-for="t in topicProgress" :key="t.key" class="pg-topic">
          <div class="pg-topic__head">
            <p class="pg-topic__label">{{ t.label }}</p>
            <span class="pg-topic__status" :class="`pg-topic__status--${t.status}`">{{ statusLabel[t.status] }}</span>
          </div>
          <div class="pg-topic__bar">
            <div
              class="pg-topic__fill"
              :style="{ width: (t.exercisesTotal === 0 ? 0 : (t.exercisesCompleted / t.exercisesTotal) * 100) + '%' }"
            ></div>
          </div>
          <p class="pg-topic__meta">
            {{ t.exercisesCompleted }}/{{ t.exercisesTotal }} ejercicios
            <span v-if="t.total > 0"> · {{ t.accuracy }}% de precisión ({{ t.correct }}/{{ t.total }} respuestas)</span>
          </p>
        </div>
      </div>

      <div class="pg-two-col">
        <!-- Progreso reciente -->
        <div class="pg-card pg-card--light">
          <h3>Tu progreso reciente</h3>
          <ul v-if="progressState.recentActivity.length > 0" class="pg-activity">
            <li v-for="(a, idx) in progressState.recentActivity" :key="idx" class="pg-activity__item">
              <span :class="a.correct ? 'pg-activity__icon pg-activity__icon--ok' : 'pg-activity__icon pg-activity__icon--bad'">
                {{ a.correct ? '✔' : '✕' }}
              </span>
              <span class="pg-activity__label">{{ a.label }}</span>
              <span class="pg-activity__date">{{ a.date }}</span>
            </li>
          </ul>
          <p v-else class="pg-empty-text">Todavía no has respondido ningún ejercicio. ¡Empieza ahora!</p>
        </div>

        <!-- Temas a reforzar -->
        <div class="pg-card pg-card--light">
          <h3>Temas que necesitas reforzar</h3>
          <ul v-if="weakTopics.length > 0" class="pg-weak-list">
            <li v-for="t in weakTopics" :key="t.key">
              <span>{{ t.label }} · {{ t.accuracy }}%</span>
              <button type="button" class="pg-mini-btn" @click="goPractice(t.key)">Practicar</button>
            </li>
          </ul>
          <p v-else class="pg-empty-text">No tienes temas débiles detectados por ahora. ¡Buen trabajo!</p>
        </div>
      </div>

      <div class="pg-bottom">
        <div class="pg-card">
          <h3>Temas dominados:</h3>
          <ul v-if="masteredTopics.length > 0">
            <li v-for="t in masteredTopics" :key="t.key">✔ {{ t.label }} ({{ t.accuracy }}%)</li>
          </ul>
          <p v-else class="pg-empty-text pg-empty-text--dark">Aún no dominas ningún tema. Sigue practicando.</p>
        </div>

        <div class="pg-medal" aria-hidden="true">🏅</div>

        <div class="pg-card">
          <h3>Recomendaciones:</h3>
          <ul class="pg-card__plain">
            <li v-for="(rec, idx) in recommendations" :key="idx">• {{ rec }}</li>
          </ul>
          <button type="button" class="pg-mini-btn pg-mini-btn--light" @click="goLearn">Ir a Aprender</button>
        </div>
      </div>

      <!-- Logros -->
      <h2 class="pg-section-title">Logros</h2>
      <div class="pg-achievements">
        <div
          v-for="a in achievements"
          :key="a.id"
          class="pg-achievement"
          :class="{ 'pg-achievement--locked': !a.unlocked }"
        >
          <span class="pg-achievement__icon" aria-hidden="true">{{ a.icon }}</span>
          <p class="pg-achievement__title">{{ a.title }}</p>
          <p class="pg-achievement__desc">{{ a.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pg-page {
  background: var(--color-white);
  padding: 32px 0 64px;
  min-height: calc(100vh - 68px);
}

.pg-page h1 {
  font-family: var(--font-heading);
  font-size: 26px;
  margin: 0 0 6px;
  color: var(--color-text-dark);
}

.pg-subtitle {
  color: var(--color-text-gray);
  font-size: 14px;
  margin: 0 0 24px;
}

.pg-guest-banner {
  background: var(--color-blue-light);
  color: var(--color-text-dark);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  margin: -12px 0 24px;
}

.pg-guest-banner a {
  font-weight: 700;
  color: var(--color-blue);
  text-decoration: underline;
}

.pg-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.pg-stat {
  background: var(--color-navy);
  color: var(--color-white);
  border-radius: 10px;
  padding: 18px;
  text-align: center;
}

.pg-stat__value {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 4px;
}

.pg-stat__label {
  font-size: 12.5px;
  margin: 0;
  opacity: 0.9;
}

.pg-panels {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.pg-panel {
  background: #a9dcf7;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
}

.pg-panel__empty {
  text-align: center;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-text-dark);
  padding: 0 20px;
}

.pg-panel--level {
  flex-direction: column;
  gap: 12px;
}

.pg-panel--level h3 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 20px;
}

.pg-chart {
  width: 100%;
  height: auto;
}

.pg-gauge {
  position: relative;
  width: 100%;
  height: 22px;
  border-radius: 999px;
  background: linear-gradient(90deg, #1fb955, #16181c);
  overflow: visible;
}

.pg-gauge__fill {
  display: none;
}

.pg-gauge__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #f0d6e0;
  border: 2px solid var(--color-white);
}

.pg-gauge__value {
  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 800;
  margin: 0;
}

.pg-gauge__accuracy {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-dark);
}

.pg-section-title {
  font-family: var(--font-heading);
  font-size: 18px;
  color: var(--color-text-dark);
  margin: 28px 0 14px;
}

.pg-topics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 8px;
}

.pg-topic {
  background: #f2f5fb;
  border-radius: 10px;
  padding: 14px 16px;
}

.pg-topic__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.pg-topic__label {
  margin: 0;
  font-weight: 700;
  font-size: 13.5px;
  color: var(--color-text-dark);
}

.pg-topic__status {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.pg-topic__status--completado {
  background: #d4f5e0;
  color: #1f9d55;
}

.pg-topic__status--en-progreso {
  background: #fde7cc;
  color: #c47a12;
}

.pg-topic__status--pendiente {
  background: #e6e6e6;
  color: var(--color-text-gray);
}

.pg-topic__bar {
  background: var(--color-blue-light);
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-bottom: 8px;
}

.pg-topic__fill {
  background: linear-gradient(90deg, #6d93ea, var(--color-blue));
  height: 100%;
  transition: width 0.3s ease;
}

.pg-topic__meta {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-gray);
}

.pg-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}

.pg-card--light {
  background: #f2f5fb;
  color: var(--color-text-dark);
}

.pg-card--light h3 {
  color: var(--color-text-dark);
}

.pg-activity {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pg-activity__item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.pg-activity__icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: var(--color-white);
  flex-shrink: 0;
}

.pg-activity__icon--ok {
  background: #1f9d55;
}

.pg-activity__icon--bad {
  background: #d64545;
}

.pg-activity__label {
  flex-grow: 1;
}

.pg-activity__date {
  font-size: 11px;
  color: var(--color-text-gray);
}

.pg-weak-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pg-weak-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
}

.pg-mini-btn {
  background: var(--color-blue);
  color: var(--color-white);
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  transition: background 0.2s ease;
}

.pg-mini-btn:hover {
  background: var(--color-blue-hover);
}

.pg-mini-btn--light {
  margin-top: 12px;
  background: var(--color-white);
  color: var(--color-navy);
}

.pg-empty-text {
  font-size: 13px;
  color: var(--color-text-gray);
  margin: 0;
}

.pg-empty-text--dark {
  color: rgba(255, 255, 255, 0.8);
}

.pg-bottom {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
}

.pg-card {
  background: var(--color-navy);
  color: var(--color-white);
  border-radius: 12px;
  padding: 20px;
}

.pg-card h3 {
  margin: 0 0 12px;
  font-size: 15px;
}

.pg-card ul {
  margin: 0;
  padding-left: 0;
  list-style: none;
  font-size: 13.5px;
  line-height: 1.9;
}

.pg-card__plain li {
  list-style: none;
}

.pg-medal {
  font-size: 46px;
  text-align: center;
}

.pg-achievements {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 8px;
}

.pg-achievement {
  background: #fff7e6;
  border: 1px solid #f0d9a6;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  transition: opacity 0.2s ease;
}

.pg-achievement--locked {
  background: #f2f2f2;
  border-color: var(--color-border);
  opacity: 0.55;
}

.pg-achievement__icon {
  font-size: 26px;
  display: block;
  margin-bottom: 6px;
}

.pg-achievement__title {
  margin: 0 0 4px;
  font-weight: 700;
  font-size: 13.5px;
  color: var(--color-text-dark);
}

.pg-achievement__desc {
  margin: 0;
  font-size: 11.5px;
  color: var(--color-text-gray);
}

@media (max-width: 900px) {
  .pg-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .pg-panels,
  .pg-bottom,
  .pg-two-col,
  .pg-topics,
  .pg-achievements {
    grid-template-columns: 1fr;
  }
  .pg-medal {
    order: -1;
  }
}
</style>
