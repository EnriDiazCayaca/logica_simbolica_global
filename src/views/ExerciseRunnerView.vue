<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import OptionPill from '../components/OptionPill.vue';
import {
  getExerciseById,
  buildFillTable,
  difficultyLabel,
  QUIZ_OPTIONS,
  CLASSIFY_OPTIONS,
  topicKeyForExercise,
  correctClassificationFor,
  type Exercise,
} from '../data/exercises';
import { evaluate, parseProposition, classificationLabel, type PropositionClassification } from '../lib/logicEngine';
import { markExerciseCompleted, markQuizExerciseCompleted, recordAnswer } from '../store/progress';
import { exercises } from '../data/exercises';

const props = defineProps<{ id: string }>();
const router = useRouter();

const exercise = computed<Exercise | undefined>(() => getExerciseById(props.id));
const topic = computed(() => (exercise.value ? topicKeyForExercise(exercise.value) : null));

// --- Estado general de la corrida del ejercicio ---
type Phase = 'answering' | 'result';
const phase = ref<Phase>('answering');
const lastCorrect = ref(false);

// --- Tablas de verdad (rellenar celdas) ---
const fillTable = computed(() => (exercise.value?.kind === 'truth-table' ? buildFillTable(exercise.value.proposition) : null));
const fillInputs = reactive<Record<number, string>>({});

function normalizeVF(value: string): 'V' | 'F' | null {
  const v = value.trim().toUpperCase();
  if (v === 'V' || v === 'VERDADERO') return 'V';
  if (v === 'F' || v === 'FALSO') return 'F';
  return null;
}

const fillAllCorrect = ref(false);

function checkFillTable() {
  if (!fillTable.value) return;
  let allCorrect = true;
  fillTable.value.rows.forEach((row, idx) => {
    const expected = row.result ? 'V' : 'F';
    const given = normalizeVF(fillInputs[idx] ?? '');
    if (given !== expected) allCorrect = false;
  });
  fillAllCorrect.value = allCorrect;
  lastCorrect.value = allCorrect;
  phase.value = 'result';
  if (topic.value) markExerciseCompleted(props.id, topic.value, allCorrect);
}

// --- Identificación de ley lógica ---
const selectedLawOption = ref<string | null>(null);

function checkLaw() {
  if (!exercise.value || exercise.value.kind !== 'law' || !selectedLawOption.value) return;
  const correct = selectedLawOption.value === exercise.value.correctOption;
  lastCorrect.value = correct;
  phase.value = 'result';
  if (topic.value) markExerciseCompleted(props.id, topic.value, correct);
}

// --- Identificación del tipo de conectivo (nivel básico) ---
const selectedIdentifyOption = ref<string | null>(null);

function checkIdentify() {
  if (!exercise.value || exercise.value.kind !== 'identify' || !selectedIdentifyOption.value) return;
  const correct = selectedIdentifyOption.value === exercise.value.correctOption;
  lastCorrect.value = correct;
  phase.value = 'result';
  if (topic.value) markExerciseCompleted(props.id, topic.value, correct);
}

// --- Clasificación: tautología / contradicción / contingencia ---
// La respuesta correcta se calcula en vivo con la lógica real de evaluación
// (nunca se compara contra un valor hardcodeado).
const selectedClassifyOption = ref<string | null>(null);

const correctClassification = computed<PropositionClassification | null>(() => {
  if (!exercise.value || exercise.value.kind !== 'classify') return null;
  return correctClassificationFor(exercise.value.proposition);
});

const correctClassificationLabel = computed(() =>
  correctClassification.value ? classificationLabel[correctClassification.value] : '',
);

function checkClassify() {
  if (!exercise.value || exercise.value.kind !== 'classify' || !selectedClassifyOption.value) return;
  const correct = selectedClassifyOption.value === correctClassificationLabel.value;
  lastCorrect.value = correct;
  phase.value = 'result';
  if (topic.value) markExerciseCompleted(props.id, topic.value, correct);
}

// --- Cuestionario (10 preguntas secuenciales) ---
const quizIndex = ref(0);
const quizSelected = ref<string | null>(null);
const quizScore = ref(0);
const quizFinished = ref(false);

const currentQuestion = computed(() => {
  if (exercise.value?.kind !== 'quiz') return null;
  return exercise.value.questions[quizIndex.value] ?? null;
});

const currentQuestionCorrectAnswer = computed(() => {
  if (!currentQuestion.value) return null;
  const ast = parseProposition(currentQuestion.value.proposition);
  return evaluate(ast, currentQuestion.value.assignment) ? 'VERDADERO' : 'FALSO';
});

function checkQuiz() {
  if (!quizSelected.value || !currentQuestion.value || !topic.value) return;
  const correct = quizSelected.value === currentQuestionCorrectAnswer.value;
  lastCorrect.value = correct;
  recordAnswer(topic.value, correct);
  if (correct) quizScore.value += 1;
  phase.value = 'result';
}

function nextQuestion() {
  if (!exercise.value || exercise.value.kind !== 'quiz' || !topic.value) return;
  if (quizIndex.value + 1 >= exercise.value.questions.length) {
    quizFinished.value = true;
    // El cuestionario en sí se marca "completado" sin sumar otra respuesta
    // (cada pregunta ya se registró individualmente en checkQuiz).
    markQuizExerciseCompleted(props.id);
    return;
  }
  quizIndex.value += 1;
  quizSelected.value = null;
  phase.value = 'answering';
}

// Reinicia el estado cuando cambia de ejercicio (navegación directa entre ids)
watch(
  () => props.id,
  () => {
    phase.value = 'answering';
    selectedLawOption.value = null;
    selectedIdentifyOption.value = null;
    selectedClassifyOption.value = null;
    quizIndex.value = 0;
    quizSelected.value = null;
    quizScore.value = 0;
    quizFinished.value = false;
    Object.keys(fillInputs).forEach((k) => delete fillInputs[Number(k)]);
  },
);

function goBack() {
  router.push('/ejercicios');
}

function retry() {
  phase.value = 'answering';
  selectedLawOption.value = null;
  selectedIdentifyOption.value = null;
  selectedClassifyOption.value = null;
  Object.keys(fillInputs).forEach((k) => delete fillInputs[Number(k)]);
}
</script>

<template>
  <section class="ex-run-page" v-if="exercise">
    <div class="container">
      <div class="ex-run-topbar">
        <button class="ex-run-back" @click="goBack">← Volver</button>
        <span class="ex-run-counter">Ejercicio {{ exercise.order }}/{{ exercises.length }}</span>
      </div>

      <div class="ex-run-banner">
        <span>{{ exercise.category }}</span>
        <span v-if="!(exercise.kind === 'quiz' && quizFinished)">NIVEL: {{ difficultyLabel[exercise.level].toUpperCase() }}</span>
      </div>

      <!-- ===================== TABLAS DE VERDAD ===================== -->
      <template v-if="exercise.kind === 'truth-table'">
        <div v-if="phase === 'answering'" class="ex-run-body">
          <p class="ex-run-question">Completa la siguiente tabla de verdad para la proposición:</p>
          <p class="ex-run-formula">({{ exercise.proposition }})</p>

          <table class="ex-run-table" v-if="fillTable">
            <thead>
              <tr>
                <th v-for="v in fillTable.variables" :key="v">{{ v.toLowerCase() }}</th>
                <th>{{ exercise.proposition.replace(/∨/g, 'v').toLowerCase() }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in fillTable.rows" :key="idx">
                <td v-for="v in fillTable.variables" :key="v">{{ row.assignment[v] ? 'V' : 'F' }}</td>
                <td>
                  <input v-model="fillInputs[idx]" type="text" maxlength="8" class="ex-run-cell-input" />
                </td>
              </tr>
            </tbody>
          </table>

          <p class="ex-run-hint">Ingresa V (Verdadero) o F (Falso) en cada casilla.</p>
          <button class="ex-run-check" @click="checkFillTable">Comprobar</button>
        </div>
      </template>

      <!-- ===================== LEYES LÓGICAS ===================== -->
      <template v-else-if="exercise.kind === 'law'">
        <div v-if="phase === 'answering'" class="ex-run-body">
          <p class="ex-run-question">¿Cuál ley lógica se aplica en la siguiente proposición?</p>
          <p class="ex-run-formula">{{ exercise.proposition }}</p>

          <div class="ex-run-options">
            <OptionPill
              v-for="opt in exercise.options"
              :key="opt"
              :label="opt"
              :selected="selectedLawOption === opt"
              @select="selectedLawOption = opt"
            />
          </div>

          <button class="ex-run-check" :disabled="!selectedLawOption" @click="checkLaw">Comprobar</button>
        </div>
      </template>

      <!-- ===================== IDENTIFICACIÓN (nivel básico) ===================== -->
      <template v-else-if="exercise.kind === 'identify'">
        <div v-if="phase === 'answering'" class="ex-run-body">
          <p class="ex-run-question">¿Qué tipo de proposición es la siguiente?</p>
          <p class="ex-run-formula">{{ exercise.proposition }}</p>

          <div class="ex-run-options">
            <OptionPill
              v-for="opt in exercise.options"
              :key="opt"
              :label="opt"
              :selected="selectedIdentifyOption === opt"
              @select="selectedIdentifyOption = opt"
            />
          </div>

          <button class="ex-run-check" :disabled="!selectedIdentifyOption" @click="checkIdentify">Comprobar</button>
        </div>
      </template>

      <!-- ===================== CLASIFICACIÓN ===================== -->
      <template v-else-if="exercise.kind === 'classify'">
        <div v-if="phase === 'answering'" class="ex-run-body">
          <p class="ex-run-question">Clasifica la siguiente proposición:</p>
          <p class="ex-run-formula">({{ exercise.proposition }})</p>

          <div class="ex-run-options">
            <OptionPill
              v-for="opt in CLASSIFY_OPTIONS"
              :key="opt"
              :label="opt"
              :selected="selectedClassifyOption === opt"
              @select="selectedClassifyOption = opt"
            />
          </div>

          <p class="ex-run-hint">Analiza la columna final de su tabla de verdad: ¿es siempre V, siempre F, o depende?</p>
          <button class="ex-run-check" :disabled="!selectedClassifyOption" @click="checkClassify">Comprobar</button>
        </div>
      </template>

      <!-- ===================== CUESTIONARIO ===================== -->
      <template v-else-if="exercise.kind === 'quiz'">
        <div v-if="!quizFinished && phase === 'answering' && currentQuestion" class="ex-run-body">
          <p class="ex-run-progress-text">Pregunta {{ quizIndex + 1 }} de {{ exercise.questions.length }}</p>
          <p class="ex-run-question">{{ currentQuestion.prompt }}</p>
          <p class="ex-run-formula">{{ currentQuestion.proposition }}</p>
          <p class="ex-run-assignment">{{ currentQuestion.assignmentText }}</p>

          <div class="ex-run-options">
            <OptionPill
              v-for="opt in QUIZ_OPTIONS"
              :key="opt"
              :label="opt"
              :selected="quizSelected === opt"
              @select="quizSelected = opt"
            />
          </div>

          <button class="ex-run-check" :disabled="!quizSelected" @click="checkQuiz">Comprobar</button>
        </div>

        <div v-else-if="quizFinished" class="ex-run-body ex-run-summary">
          <h2>¡Cuestionario completado!</h2>
          <p class="ex-run-score">
            Obtuviste <strong>{{ quizScore }} de {{ exercise.questions.length }}</strong> respuestas correctas.
          </p>
          <button class="ex-run-check" @click="goBack">Volver a ejercicios</button>
        </div>
      </template>

      <!-- ===================== PANTALLA DE RESULTADO (compartida) ===================== -->
      <div v-if="phase === 'result' && !(exercise.kind === 'quiz' && quizFinished)" class="ex-run-result">
        <p class="ex-run-result-title">RESULTADO DEL EJERCICIO</p>

        <div class="ex-run-result-icon" :class="lastCorrect ? 'is-correct' : 'is-incorrect'">
          {{ lastCorrect ? '✓' : '✕' }}
        </div>

        <h2>{{ lastCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta' }}</h2>
        <p class="ex-run-result-sub">
          {{ lastCorrect ? 'Excelente trabajo, has resuelto correctamente el ejercicio.' : 'No te preocupes, revisemos la solución.' }}
        </p>

        <div class="ex-run-result-box" v-if="exercise.kind === 'law'">
          <p>Pregunta: ¿Qué ley aplica en {{ exercise.proposition }}?</p>
          <p>Tu respuesta: {{ selectedLawOption }}</p>
          <p>Respuesta correcta: {{ exercise.correctOption }}</p>
        </div>
        <div class="ex-run-result-box" v-else-if="exercise.kind === 'identify'">
          <p>Pregunta: ¿Qué tipo de proposición es {{ exercise.proposition }}?</p>
          <p>Tu respuesta: {{ selectedIdentifyOption }}</p>
          <p>Respuesta correcta: {{ exercise.correctOption }}</p>
        </div>
        <div class="ex-run-result-box" v-else-if="exercise.kind === 'classify'">
          <p>Proposición: ({{ exercise.proposition }})</p>
          <p>Tu respuesta: {{ selectedClassifyOption }}</p>
          <p>Respuesta correcta: {{ correctClassificationLabel }}</p>
        </div>
        <div class="ex-run-result-box" v-else-if="exercise.kind === 'quiz' && currentQuestion">
          <p>Pregunta: ¿Cuál es el valor de ({{ currentQuestion.proposition }})?</p>
          <p>Tu respuesta: {{ quizSelected === 'VERDADERO' ? 'Verdadero' : quizSelected === 'FALSO' ? 'Falso' : quizSelected }}</p>
          <p>Respuesta correcta: {{ currentQuestionCorrectAnswer === 'VERDADERO' ? 'Verdadero' : 'Falso' }}</p>
        </div>
        <div class="ex-run-result-box" v-else-if="exercise.kind === 'truth-table'">
          <p>Proposición: ({{ exercise.proposition }})</p>
          <p>{{ fillAllCorrect ? 'Todas las celdas son correctas.' : 'Alguna de las celdas no coincide con la solución.' }}</p>
        </div>

        <div class="ex-run-result-box ex-run-result-box--explain" v-if="!lastCorrect">
          <p class="ex-run-result-box__label">Explicación:</p>
          <p v-if="exercise.kind === 'law'">{{ exercise.explanation }}</p>
          <p v-else-if="exercise.kind === 'quiz' && currentQuestion">{{ currentQuestion.explanation }}</p>
          <p v-else>Revisa cada fila de la tabla comparando los valores de las variables con el operador utilizado.</p>
        </div>

        <div class="ex-run-result-actions">
          <button v-if="exercise.kind === 'quiz'" class="ex-run-check" @click="nextQuestion">
            {{ quizIndex + 1 >= exercise.questions.length ? 'Ver resultado final' : 'Siguiente pregunta' }}
          </button>
          <template v-else>
            <button class="ex-run-secondary" @click="retry">Intentar de nuevo</button>
            <button class="ex-run-check" @click="goBack">Volver a ejercicios</button>
          </template>
        </div>
      </div>
    </div>
  </section>

  <section class="ex-run-page" v-else>
    <div class="container">
      <p class="ex-run-not-found">No se encontró este ejercicio.</p>
      <button class="ex-run-check" @click="goBack">Volver a ejercicios</button>
    </div>
  </section>
</template>

<style scoped>
.ex-run-page {
  background: #f5f7fb;
  padding: 24px 0 64px;
  min-height: calc(100vh - 68px);
}

.ex-run-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.ex-run-back,
.ex-run-counter {
  background: var(--color-blue);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 700;
  font-size: 13px;
}

.ex-run-banner {
  background: var(--color-blue);
  color: var(--color-white);
  border-radius: 10px;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.4px;
  margin-bottom: 24px;
}

.ex-run-body {
  background: var(--color-white);
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(15, 45, 141, 0.06);
}

.ex-run-question {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-dark);
  margin: 0 0 20px;
}

.ex-run-formula {
  text-align: center;
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 24px;
}

.ex-run-assignment {
  text-align: center;
  font-size: 14px;
  color: var(--color-text-gray);
  margin: -12px 0 24px;
}

.ex-run-progress-text {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-gray);
  margin: 0 0 12px;
}

.ex-run-table {
  width: 100%;
  max-width: 420px;
  margin: 0 auto 20px;
  border-collapse: collapse;
  text-align: center;
}

.ex-run-table th,
.ex-run-table td {
  border: 1px solid var(--color-text-dark);
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
}

.ex-run-cell-input {
  width: 60px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 6px 10px;
  text-align: center;
  font-family: inherit;
  font-size: 14px;
}

.ex-run-cell-input:focus {
  outline: 2px solid var(--color-blue);
}

.ex-run-hint {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-gray);
  margin-bottom: 20px;
}

.ex-run-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 560px;
  margin: 0 auto 24px;
}

.ex-run-check {
  display: block;
  margin: 0 auto;
  background: var(--color-blue);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 12px 30px;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.2s ease;
}

.ex-run-check:hover:not(:disabled) {
  background: var(--color-blue-hover);
}

.ex-run-check:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ex-run-secondary {
  background: var(--color-white);
  color: var(--color-blue);
  border: 1px solid var(--color-blue);
  border-radius: 8px;
  padding: 12px 30px;
  font-weight: 700;
  font-size: 14px;
}

.ex-run-summary {
  text-align: center;
}

.ex-run-summary h2 {
  font-family: var(--font-heading);
  margin: 0 0 12px;
}

.ex-run-score {
  color: var(--color-text-gray);
  margin-bottom: 20px;
}

.ex-run-result {
  background: var(--color-white);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(15, 45, 141, 0.06);
}

.ex-run-result-title {
  background: var(--color-blue);
  color: var(--color-white);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  border-radius: 8px;
  padding: 12px;
  margin: -32px -32px 24px;
}

.ex-run-result-icon {
  width: 84px;
  height: 84px;
  border-radius: 16px;
  border: 4px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 800;
  margin: 0 auto 18px;
}

.ex-run-result-icon.is-correct {
  color: #1f9d55;
}

.ex-run-result-icon.is-incorrect {
  color: #d64545;
}

.ex-run-result h2 {
  font-family: var(--font-heading);
  margin: 0 0 8px;
}

.ex-run-result-sub {
  color: var(--color-text-gray);
  margin: 0 0 24px;
  font-size: 14px;
}

.ex-run-result-box {
  background: var(--color-blue);
  color: var(--color-white);
  border-radius: 10px;
  padding: 16px 20px;
  text-align: left;
  font-size: 13.5px;
  line-height: 1.7;
  max-width: 480px;
  margin: 0 auto 16px;
}

.ex-run-result-box p {
  margin: 0;
}

.ex-run-result-box__label {
  font-weight: 700;
}

.ex-run-result-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.ex-run-not-found {
  text-align: center;
  margin-bottom: 20px;
}
</style>
