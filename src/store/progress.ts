import { computed, reactive, watch } from 'vue';
import { exercises, topicLabels, topicKeyForExercise, type TopicKey } from '../data/exercises';

// Almacén reactivo simple que simula el progreso del estudiante.
// No hay backend todavía: se persiste en localStorage para que la sesión
// se sienta consistente al navegar entre pantallas y al recargar.
//
// El progreso se guarda por usuario (una clave de localStorage distinta
// por cada cuenta, más una clave "guest" para quienes no han iniciado
// sesión), para que cada persona vea únicamente su propio avance. El
// store de autenticación (`auth.ts`) llama a `setActiveProgressUser` cada
// vez que cambia la sesión activa.

const STORAGE_PREFIX = 'logilearn:progress:';

// El total de ejercicios se deriva del banco de ejercicios real, nunca de un
// número fijo, para que nunca se desincronice al agregar o quitar ejercicios.
export const totalExercises = exercises.length;

interface TopicStat {
  correct: number;
  total: number;
}

interface ActivityEntry {
  date: string; // YYYY-MM-DD
  label: string; // p.ej. "Tablas de verdad"
  correct: boolean;
}

interface DailyLogEntry {
  date: string; // YYYY-MM-DD
  correct: number;
  total: number;
}

interface ProgressState {
  completedExerciseIds: string[];
  correctAnswers: number;
  totalAnswers: number;
  topicStats: Partial<Record<TopicKey, TopicStat>>;
  points: number;
  streak: number;
  lastActiveDate: string | null;
  dailyLog: DailyLogEntry[];
  recentActivity: ActivityEntry[];
}

const MAX_DAILY_LOG = 14;
const MAX_RECENT_ACTIVITY = 8;
const POINTS_CORRECT = 10;
const POINTS_INCORRECT = 2;

function storageKeyFor(username: string | null): string {
  return `${STORAGE_PREFIX}${username ?? 'guest'}`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyState(): ProgressState {
  return {
    completedExerciseIds: [],
    correctAnswers: 0,
    totalAnswers: 0,
    topicStats: {},
    points: 0,
    streak: 0,
    lastActiveDate: null,
    dailyLog: [],
    recentActivity: [],
  };
}

function demoState(): ProgressState {
  // Estado inicial "de demostración" para que las pantallas no se vean vacías
  // la primera vez que alguien entra sin cuenta. Se construye recorriendo
  // ejercicios reales del banco (no IDs inventados), y a partir de aquí el
  // progreso evoluciona con las respuestas reales del usuario.
  const sample = exercises.slice(0, 13);
  const state = emptyState();
  sample.forEach((ex) => {
    state.completedExerciseIds.push(ex.id);
    const topic = topicKeyForExercise(ex);
    const stat = state.topicStats[topic] ?? { correct: 0, total: 0 };
    stat.total += 1;
    stat.correct += 1;
    state.topicStats[topic] = stat;
  });
  state.correctAnswers = 20;
  state.totalAnswers = 24;
  state.points = 20 * POINTS_CORRECT + 4 * POINTS_INCORRECT;
  state.streak = 2;
  state.lastActiveDate = todayIso();
  return state;
}

function loadState(key: string): ProgressState {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ProgressState>;
      // Se combina con el estado vacío para tolerar datos guardados por
      // versiones anteriores de la app que no tenían todos los campos.
      return { ...emptyState(), ...parsed };
    }
  } catch {
    // ignorar errores de almacenamiento (modo privado, SSR, etc.)
  }
  // Solo el invitado (sin cuenta) arranca con datos de demostración; una
  // cuenta nueva empieza siempre en cero.
  return key === storageKeyFor(null) ? demoState() : emptyState();
}

let activeKey = storageKeyFor(null);
const state = reactive<ProgressState>(loadState(activeKey));
let persistEnabled = true;

watch(
  state,
  (value) => {
    if (!persistEnabled) return;
    try {
      localStorage.setItem(activeKey, JSON.stringify(value));
    } catch {
      // ignorar
    }
  },
  { deep: true },
);

/** Cambia de "carpeta" de progreso al iniciar/cerrar sesión o registrarse. */
export function setActiveProgressUser(username: string | null) {
  activeKey = storageKeyFor(username);
  const next = loadState(activeKey);
  persistEnabled = false;
  state.completedExerciseIds = next.completedExerciseIds;
  state.correctAnswers = next.correctAnswers;
  state.totalAnswers = next.totalAnswers;
  state.topicStats = next.topicStats;
  state.points = next.points;
  state.streak = next.streak;
  state.lastActiveDate = next.lastActiveDate;
  state.dailyLog = next.dailyLog;
  state.recentActivity = next.recentActivity;
  persistEnabled = true;
}

/** Actualiza la racha de días consecutivos con actividad. */
function touchStreak() {
  const today = todayIso();
  if (state.lastActiveDate === today) return; // ya contamos hoy
  if (state.lastActiveDate) {
    const prev = new Date(state.lastActiveDate);
    const diffDays = Math.round((new Date(today).getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    state.streak = diffDays === 1 ? state.streak + 1 : 1;
  } else {
    state.streak = 1;
  }
  state.lastActiveDate = today;
}

function touchDailyLog(correct: boolean) {
  const today = todayIso();
  let entry = state.dailyLog.find((d) => d.date === today);
  if (!entry) {
    entry = { date: today, correct: 0, total: 0 };
    state.dailyLog.push(entry);
    if (state.dailyLog.length > MAX_DAILY_LOG) state.dailyLog.shift();
  }
  entry.total += 1;
  if (correct) entry.correct += 1;
}

/**
 * Registra una respuesta individual del usuario para un tema concreto.
 * Esta es la única vía por la que el progreso cambia: nunca se escriben
 * números fijos directamente en las vistas.
 */
export function recordAnswer(topic: TopicKey, correct: boolean) {
  state.totalAnswers += 1;
  if (correct) state.correctAnswers += 1;

  const stat = state.topicStats[topic] ?? { correct: 0, total: 0 };
  stat.total += 1;
  if (correct) stat.correct += 1;
  state.topicStats[topic] = stat;

  state.points += correct ? POINTS_CORRECT : POINTS_INCORRECT;

  state.recentActivity.unshift({ date: todayIso(), label: topicLabels[topic], correct });
  if (state.recentActivity.length > MAX_RECENT_ACTIVITY) state.recentActivity.pop();

  touchDailyLog(correct);
  touchStreak();
}

export function markExerciseCompleted(exerciseId: string, topic: TopicKey, wasCorrect: boolean) {
  if (!state.completedExerciseIds.includes(exerciseId)) {
    state.completedExerciseIds.push(exerciseId);
  }
  recordAnswer(topic, wasCorrect);
}

/**
 * Marca un ejercicio como completado sin registrar una respuesta adicional.
 * Se usa para cuestionarios de varias preguntas, donde cada pregunta ya
 * llamó a `recordAnswer` individualmente y solo falta marcar el ejercicio
 * contenedor como resuelto.
 */
export function markQuizExerciseCompleted(exerciseId: string) {
  if (!state.completedExerciseIds.includes(exerciseId)) {
    state.completedExerciseIds.push(exerciseId);
  }
}

export function resetProgress() {
  const fresh = emptyState();
  state.completedExerciseIds = fresh.completedExerciseIds;
  state.correctAnswers = fresh.correctAnswers;
  state.totalAnswers = fresh.totalAnswers;
  state.topicStats = fresh.topicStats;
  state.points = fresh.points;
  state.streak = fresh.streak;
  state.lastActiveDate = fresh.lastActiveDate;
  state.dailyLog = fresh.dailyLog;
  state.recentActivity = fresh.recentActivity;
}

export const completedCount = computed(() => state.completedExerciseIds.length);

export const progressPercent = computed(() =>
  totalExercises === 0 ? 0 : Math.min(100, Math.round((completedCount.value / totalExercises) * 100)),
);

export const accuracyPercent = computed(() =>
  state.totalAnswers === 0 ? 0 : Math.round((state.correctAnswers / state.totalAnswers) * 100),
);

export function isExerciseCompleted(exerciseId: string): boolean {
  return state.completedExerciseIds.includes(exerciseId);
}

export interface TopicProgress {
  key: TopicKey;
  label: string;
  correct: number;
  total: number;
  accuracy: number;
  exercisesTotal: number;
  exercisesCompleted: number;
  status: 'completado' | 'en-progreso' | 'pendiente';
}

const ALL_TOPICS = Object.keys(topicLabels) as TopicKey[];

/** Progreso desglosado por tema, calculado a partir de ejercicios reales y respuestas reales. */
export const topicProgress = computed<TopicProgress[]>(() =>
  ALL_TOPICS.map((key) => {
    const stat = state.topicStats[key] ?? { correct: 0, total: 0 };
    const topicExercises = exercises.filter((ex) => topicKeyForExercise(ex) === key);
    const exercisesCompleted = topicExercises.filter((ex) => state.completedExerciseIds.includes(ex.id)).length;
    const status: TopicProgress['status'] =
      exercisesCompleted === 0
        ? 'pendiente'
        : exercisesCompleted >= topicExercises.length
          ? 'completado'
          : 'en-progreso';
    return {
      key,
      label: topicLabels[key],
      correct: stat.correct,
      total: stat.total,
      accuracy: stat.total === 0 ? 0 : Math.round((stat.correct / stat.total) * 100),
      exercisesTotal: topicExercises.length,
      exercisesCompleted,
      status,
    };
  }),
);

/** Temas donde el usuario necesita reforzar: precisión baja con suficientes intentos. */
export const weakTopics = computed<TopicProgress[]>(() =>
  topicProgress.value
    .filter((t) => t.total >= 2 && t.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy),
);

/** Temas dominados: buena precisión y suficiente práctica. */
export const masteredTopics = computed<TopicProgress[]>(() =>
  topicProgress.value.filter((t) => t.total >= 3 && t.accuracy >= 85),
);

/** Tema recomendado para practicar ahora (el más débil con datos; si no hay datos, el más pendiente). */
export const recommendedTopic = computed<TopicProgress | null>(() => {
  if (weakTopics.value.length > 0) return weakTopics.value[0];
  const pending = topicProgress.value.find((t) => t.status === 'pendiente');
  if (pending) return pending;
  const inProgress = topicProgress.value.find((t) => t.status === 'en-progreso');
  return inProgress ?? null;
});

export const level = computed(() => {
  if (progressPercent.value >= 80) return { number: 4, label: 'Avanzado' };
  if (progressPercent.value >= 55) return { number: 3, label: 'Intermedio' };
  if (progressPercent.value >= 25) return { number: 2, label: 'Básico' };
  return { number: 1, label: 'Principiante' };
});

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}

/** Logros calculados en vivo a partir de las estadísticas reales, nunca fijos. */
export const achievements = computed<Achievement[]>(() => [
  {
    id: 'first-step',
    icon: '🎯',
    title: 'Primer paso',
    description: 'Completa tu primer ejercicio.',
    unlocked: completedCount.value >= 1,
  },
  {
    id: 'ten-exercises',
    icon: '📚',
    title: 'Constancia',
    description: 'Completa 10 ejercicios.',
    unlocked: completedCount.value >= 10,
  },
  {
    id: 'streak-3',
    icon: '🔥',
    title: 'Racha de 3 días',
    description: 'Practica 3 días seguidos.',
    unlocked: state.streak >= 3,
  },
  {
    id: 'accuracy-90',
    icon: '🏆',
    title: 'Precisión de experto',
    description: 'Alcanza 90% de precisión (mínimo 10 respuestas).',
    unlocked: state.totalAnswers >= 10 && accuracyPercent.value >= 90,
  },
  {
    id: 'truth-tables',
    icon: '▦',
    title: 'Maestro de tablas',
    description: 'Domina el tema de Tablas de verdad.',
    unlocked: topicProgress.value.some((t) => t.key === 'tablas-verdad' && t.total >= 3 && t.accuracy >= 85),
  },
  {
    id: 'all-topics',
    icon: '⭐',
    title: 'Todo terreno',
    description: 'Responde al menos una vez en cada tema.',
    unlocked: topicProgress.value.every((t) => t.total > 0),
  },
]);

export const progressState = state;
