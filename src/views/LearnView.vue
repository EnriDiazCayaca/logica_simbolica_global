<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import OptionPill from '../components/OptionPill.vue';
import { logicLaws, type LogicLaw } from '../data/logicLaws';
import { exercises, type LawExercise, type IdentifyExercise } from '../data/exercises';
import { parseProposition, evaluate, collectVariables, LogicParseError } from '../lib/logicEngine';
import { recordAnswer, recommendedTopic, weakTopics, type TopicProgress } from '../store/progress';
import type { TopicKey } from '../data/exercises';

const router = useRouter();

// ---------------------------------------------------------------------------
// Catálogo de conceptos: conectores básicos + leyes lógicas. Cada concepto se
// explica en 4 pasos (Definición → Ejemplo → Ejercicio → Solución). Los
// ejemplos y ejercicios se resuelven en vivo con el motor lógico real
// (src/lib/logicEngine.ts) o reutilizando el banco de ejercicios existente;
// nada de esto está hardcodeado como texto fijo con una respuesta fija.
// ---------------------------------------------------------------------------

type ConceptGroup = 'conector' | 'ley';

interface Concept {
  id: string;
  group: ConceptGroup;
  title: string;
  symbol?: string;
  definition: string;
  proposition: string; // proposición usada para generar el ejemplo en vivo
  topic: TopicKey;
}

const CONNECTOR_CONCEPTS: Concept[] = [
  {
    id: 'c-negacion',
    group: 'conector',
    title: 'Negación',
    symbol: '¬',
    definition: 'Invierte el valor de verdad de una proposición. Si p es verdadera, ¬p es falsa, y viceversa.',
    proposition: '¬p',
    topic: 'identificacion',
  },
  {
    id: 'c-conjuncion',
    group: 'conector',
    title: 'Conjunción',
    symbol: '∧',
    definition: 'Une dos proposiciones y solo es verdadera cuando ambas lo son. Basta con que una sea falsa para que toda la conjunción sea falsa.',
    proposition: 'p ∧ q',
    topic: 'identificacion',
  },
  {
    id: 'c-disyuncion',
    group: 'conector',
    title: 'Disyunción',
    symbol: '∨',
    definition: 'Une dos proposiciones y es verdadera si al menos una de ellas lo es. Solo es falsa cuando ambas son falsas.',
    proposition: 'p ∨ q',
    topic: 'identificacion',
  },
  {
    id: 'c-condicional',
    group: 'conector',
    title: 'Condicional',
    symbol: '→',
    definition: 'Expresa "si p entonces q". Solo es falsa cuando el antecedente (p) es verdadero y el consecuente (q) es falso; en cualquier otro caso es verdadera.',
    proposition: 'p → q',
    topic: 'identificacion',
  },
  {
    id: 'c-bicondicional',
    group: 'conector',
    title: 'Bicondicional',
    symbol: '↔',
    definition: 'Expresa "p si y solo si q". Es verdadera cuando ambas proposiciones tienen el mismo valor de verdad (ambas V o ambas F).',
    proposition: 'p ↔ q',
    topic: 'identificacion',
  },
];

const LAW_CONCEPTS: Concept[] = logicLaws.map((law: LogicLaw) => ({
  id: `law-${law.id}`,
  group: 'ley',
  title: law.name,
  definition: law.description,
  proposition: law.formulas[0],
  topic: 'leyes-logicas',
}));

const concepts: Concept[] = [...CONNECTOR_CONCEPTS, ...LAW_CONCEPTS];

function lawFormulas(concept: Concept): string[] {
  if (concept.group !== 'ley') return [];
  const law = logicLaws.find((l) => `law-${l.id}` === concept.id);
  return law?.formulas ?? [];
}

// ---------------------------------------------------------------------------
// Emparejamiento con el banco de ejercicios real (sin inventar preguntas
// nuevas cuando ya existe una equivalente): para conectores, se busca un
// ejercicio "identify" cuya respuesta correcta coincida con el nombre del
// conector; para leyes, un ejercicio "law" cuya respuesta correcta coincida
// con el nombre de la ley (comparación por conjunto de palabras, sin tildes).
// ---------------------------------------------------------------------------

function normTokens(s: string): Set<string> {
  return new Set(
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w && w !== 'ley'),
  );
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

function matchedExercise(concept: Concept): IdentifyExercise | LawExercise | null {
  if (concept.group === 'conector') {
    const match = exercises.find(
      (e): e is IdentifyExercise => e.kind === 'identify' && e.correctOption === concept.title,
    );
    return match ?? null;
  }
  const target = normTokens(concept.title);
  const match = exercises.find(
    (e): e is LawExercise => e.kind === 'law' && setsEqual(normTokens(e.correctOption), target),
  );
  return match ?? null;
}

// ---------------------------------------------------------------------------
// Verificación en vivo de una fórmula "X ≡ Y": evalúa ambos lados con una
// asignación de muestra real (usando el motor lógico) en vez de asumir que
// la equivalencia es cierta. Sirve como respaldo cuando no hay un ejercicio
// de opción múltiple emparejado para una ley.
// ---------------------------------------------------------------------------

interface LiveVerification {
  left: string;
  right: string;
  leftValue: boolean;
  rightValue: boolean;
  assignmentText: string;
}

function tryLiveVerify(formula: string): LiveVerification | null {
  if (formula.includes(',')) return null;
  const parts = formula.split('≡').map((s) => s.trim());
  if (parts.length !== 2) return null;
  try {
    const leftAst = parseProposition(parts[0]);
    const rightAst = parseProposition(parts[1]);
    const vars = Array.from(new Set([...collectVariables(leftAst), ...collectVariables(rightAst)]));
    const assignment: Record<string, boolean> = {};
    let toggle = true;
    vars.forEach((v) => {
      if (v === 'V') assignment[v] = true;
      else if (v === 'F') assignment[v] = false;
      else {
        assignment[v] = toggle;
        toggle = !toggle;
      }
    });
    const leftValue = evaluate(leftAst, assignment);
    const rightValue = evaluate(rightAst, assignment);
    const assignmentText = vars
      .filter((v) => v !== 'V' && v !== 'F')
      .map((v) => `${v.toLowerCase()} = ${assignment[v] ? 'Verdadero' : 'Falso'}`)
      .join(', ');
    return { left: parts[0], right: parts[1], leftValue, rightValue, assignmentText };
  } catch (err) {
    if (err instanceof LogicParseError) return null;
    return null;
  }
}

// ---------------------------------------------------------------------------
// Ejemplo en vivo para conectores: evalúa la proposición del concepto con una
// asignación de muestra real, mostrando el resultado calculado (no un texto
// fijo).
// ---------------------------------------------------------------------------

interface ConnectorExample {
  proposition: string;
  assignmentText: string;
  result: boolean;
}

function buildConnectorExample(concept: Concept): ConnectorExample {
  const ast = parseProposition(concept.proposition);
  const vars = collectVariables(ast);
  const assignment: Record<string, boolean> = {};
  vars.forEach((v, idx) => {
    assignment[v] = idx % 2 === 0;
  });
  const result = evaluate(ast, assignment);
  const assignmentText = vars.map((v) => `${v.toLowerCase()} = ${assignment[v] ? 'Verdadero' : 'Falso'}`).join(', ');
  return { proposition: concept.proposition, assignmentText, result };
}

// ---------------------------------------------------------------------------
// Estado de navegación: concepto seleccionado y paso actual del recorrido
// guiado.
// ---------------------------------------------------------------------------

const groupLabel: Record<ConceptGroup, string> = { conector: 'Conectores básicos', ley: 'Leyes lógicas' };

const activeGroup = ref<ConceptGroup>('conector');
const selectedConceptId = ref<string | null>(CONNECTOR_CONCEPTS[0]?.id ?? null);
const step = ref(1);
const selectedOption = ref<string | null>(null);
const answered = ref(false);
const wasCorrect = ref(false);
const liveAnswered = ref(false);
const liveAnswerCorrect = ref<boolean | null>(null);
const viewedConceptIds = ref<Set<string>>(new Set());

const visibleConcepts = computed(() => concepts.filter((c) => c.group === activeGroup.value));

const selectedConcept = computed(() => concepts.find((c) => c.id === selectedConceptId.value) ?? null);

const connectorExample = computed<ConnectorExample | null>(() => {
  if (!selectedConcept.value || selectedConcept.value.group !== 'conector') return null;
  return buildConnectorExample(selectedConcept.value);
});

const liveVerification = computed<LiveVerification | null>(() => {
  if (!selectedConcept.value) return null;
  return tryLiveVerify(selectedConcept.value.proposition);
});

const quizExercise = computed(() => (selectedConcept.value ? matchedExercise(selectedConcept.value) : null));

function selectConcept(concept: Concept) {
  selectedConceptId.value = concept.id;
  step.value = 1;
  selectedOption.value = null;
  answered.value = false;
  wasCorrect.value = false;
  liveAnswered.value = false;
  liveAnswerCorrect.value = null;
}

watch(activeGroup, () => {
  const first = visibleConcepts.value[0];
  if (first) selectConcept(first);
});

function goToStep(n: number) {
  step.value = Math.max(1, Math.min(4, n));
}

function chooseOption(option: string) {
  if (answered.value || !quizExercise.value || !selectedConcept.value) return;
  selectedOption.value = option;
  answered.value = true;
  wasCorrect.value = option === quizExercise.value.correctOption;
  recordAnswer(selectedConcept.value.topic, wasCorrect.value);
  viewedConceptIds.value.add(selectedConcept.value.id);
}

function answerLiveCheck(userSaysTrue: boolean) {
  if (liveAnswered.value || !liveVerification.value || !selectedConcept.value) return;
  const actuallyEquivalent = liveVerification.value.leftValue === liveVerification.value.rightValue;
  const correct = userSaysTrue === actuallyEquivalent;
  liveAnswered.value = true;
  liveAnswerCorrect.value = correct;
  recordAnswer(selectedConcept.value.topic, correct);
  viewedConceptIds.value.add(selectedConcept.value.id);
}

function optionState(option: string): 'default' | 'correct' | 'incorrect' {
  if (!answered.value || !quizExercise.value) return 'default';
  if (option === quizExercise.value.correctOption) return 'correct';
  if (option === selectedOption.value) return 'incorrect';
  return 'default';
}

function goPracticeExercises(topic?: TopicKey) {
  if (topic) {
    router.push({ path: '/ejercicios', query: { tema: topic } });
  } else {
    router.push('/ejercicios');
  }
}

// ---------------------------------------------------------------------------
// Repaso inteligente: usa el store de progreso real (respuestas del usuario)
// para recomendar en qué concepto conviene enfocarse ahora.
// ---------------------------------------------------------------------------

function conceptForTopic(topic: TopicKey): Concept | null {
  if (topic === 'identificacion') return CONNECTOR_CONCEPTS[0] ?? null;
  if (topic === 'leyes-logicas') return LAW_CONCEPTS[0] ?? null;
  return null;
}

function practiceRecommendation(t: TopicProgress) {
  const concept = conceptForTopic(t.key);
  if (concept) {
    activeGroup.value = concept.group;
    selectConcept(concept);
    const el = document.getElementById('lv-guided');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    goPracticeExercises(t.key);
  }
}
</script>

<template>
  <section class="lv-page">
    <div class="container">
      <h1>Aprender</h1>
      <p class="lv-subtitle">
        Explora un concepto paso a paso: definición → ejemplo → ejercicio → solución. Todo se calcula en vivo con el
        motor lógico de LogiLearn.
      </p>

      <!-- Repaso inteligente: recomendación basada en el progreso real -->
      <div class="lv-recommend">
        <div class="lv-recommend__icon" aria-hidden="true">🧭</div>
        <div class="lv-recommend__body">
          <p class="lv-recommend__title">Repaso inteligente</p>
          <p v-if="recommendedTopic" class="lv-recommend__text">
            Según tus respuestas, te conviene reforzar
            <strong>{{ recommendedTopic.label }}</strong>
            <span v-if="recommendedTopic.total > 0"> (precisión actual: {{ recommendedTopic.accuracy }}%)</span>.
          </p>
          <p v-else class="lv-recommend__text">
            Aún no hay suficientes respuestas para recomendarte un tema. Elige un concepto abajo para empezar.
          </p>
          <div v-if="weakTopics.length > 0" class="lv-recommend__chips">
            <span v-for="t in weakTopics" :key="t.key" class="lv-chip" @click="practiceRecommendation(t)">
              Reforzar: {{ t.label }} · {{ t.accuracy }}%
            </span>
          </div>
        </div>
        <button v-if="recommendedTopic" type="button" class="lv-recommend__btn" @click="practiceRecommendation(recommendedTopic)">
          Practicar ahora
        </button>
      </div>

      <!-- Selector de grupo -->
      <div class="lv-tabs">
        <button
          v-for="g in (['conector', 'ley'] as ConceptGroup[])"
          :key="g"
          class="lv-tab"
          :class="{ 'lv-tab--active': activeGroup === g }"
          @click="activeGroup = g"
        >
          {{ groupLabel[g] }}
        </button>
      </div>

      <div class="lv-layout">
        <!-- Lista de conceptos -->
        <aside class="lv-list">
          <button
            v-for="c in visibleConcepts"
            :key="c.id"
            type="button"
            class="lv-list__item"
            :class="{ 'lv-list__item--active': selectedConceptId === c.id }"
            @click="selectConcept(c)"
          >
            <span class="lv-list__symbol" v-if="c.symbol" aria-hidden="true">{{ c.symbol }}</span>
            <span class="lv-list__title">{{ c.title }}</span>
            <span v-if="viewedConceptIds.has(c.id)" class="lv-list__check" aria-hidden="true">✔</span>
          </button>
        </aside>

        <!-- Recorrido guiado -->
        <div id="lv-guided" class="lv-guided" v-if="selectedConcept">
          <div class="lv-guided__header">
            <h2>{{ selectedConcept.title }}</h2>
            <div class="lv-steps">
              <button
                v-for="(label, idx) in ['Definición', 'Ejemplo', 'Ejercicio', 'Solución']"
                :key="label"
                type="button"
                class="lv-step-dot"
                :class="{ 'lv-step-dot--active': step === idx + 1, 'lv-step-dot--done': step > idx + 1 }"
                @click="goToStep(idx + 1)"
              >
                {{ idx + 1 }}. {{ label }}
              </button>
            </div>
          </div>

          <!-- Paso 1: Definición -->
          <div v-if="step === 1" class="lv-panel">
            <p class="lv-panel__text">{{ selectedConcept.definition }}</p>
            <ul v-if="selectedConcept.group === 'ley'" class="lv-formulas">
              <li v-for="f in lawFormulas(selectedConcept)" :key="f">{{ f }}</li>
            </ul>
            <p v-else class="lv-formulas__single">Notación usada en este ejemplo: <code>{{ selectedConcept.proposition }}</code></p>
          </div>

          <!-- Paso 2: Ejemplo -->
          <div v-if="step === 2" class="lv-panel">
            <template v-if="selectedConcept.group === 'conector' && connectorExample">
              <p class="lv-panel__text">
                Tomemos <code>{{ connectorExample.proposition }}</code> con {{ connectorExample.assignmentText }}.
              </p>
              <p class="lv-panel__result" :class="connectorExample.result ? 'lv-panel__result--true' : 'lv-panel__result--false'">
                Resultado: {{ connectorExample.result ? 'Verdadero' : 'Falso' }}
              </p>
            </template>
            <template v-else-if="liveVerification">
              <p class="lv-panel__text">
                Verifiquemos la fórmula con {{ liveVerification.assignmentText || 'los valores constantes definidos' }}:
              </p>
              <p class="lv-panel__result">
                <code>{{ liveVerification.left }}</code> = {{ liveVerification.leftValue ? 'Verdadero' : 'Falso' }}
                &nbsp;·&nbsp;
                <code>{{ liveVerification.right }}</code> = {{ liveVerification.rightValue ? 'Verdadero' : 'Falso' }}
              </p>
              <p class="lv-panel__result" :class="liveVerification.leftValue === liveVerification.rightValue ? 'lv-panel__result--true' : 'lv-panel__result--false'">
                {{ liveVerification.leftValue === liveVerification.rightValue ? 'Ambos lados coinciden: la equivalencia se cumple en este caso.' : 'Los lados no coinciden en este caso.' }}
              </p>
            </template>
            <p v-else class="lv-panel__text">
              Esta ley involucra valores constantes (V/F); revisa las fórmulas del paso anterior para verla en detalle.
            </p>
          </div>

          <!-- Paso 3: Ejercicio -->
          <div v-if="step === 3" class="lv-panel">
            <template v-if="quizExercise">
              <p class="lv-panel__text">
                {{ quizExercise.kind === 'identify' ? 'Identifica el tipo de proposición:' : 'Identifica la ley lógica que se debe utilizar:' }}
                <code>{{ quizExercise.proposition }}</code>
              </p>
              <div class="lv-options">
                <OptionPill
                  v-for="opt in quizExercise.options"
                  :key="opt"
                  :label="opt"
                  :selected="selectedOption === opt"
                  :state="optionState(opt)"
                  @select="chooseOption(opt)"
                />
              </div>
            </template>
            <template v-else-if="liveVerification">
              <p class="lv-panel__text">
                ¿Es correcta esta equivalencia?
                <code>{{ selectedConcept.proposition }}</code>
              </p>
              <div class="lv-truefalse">
                <button
                  type="button"
                  class="lv-tf-btn"
                  :class="{ 'lv-tf-btn--correct': liveAnswered && liveAnswerCorrect !== null && liveVerification.leftValue === liveVerification.rightValue }"
                  :disabled="liveAnswered"
                  @click="answerLiveCheck(true)"
                >
                  Verdadero
                </button>
                <button
                  type="button"
                  class="lv-tf-btn"
                  :class="{ 'lv-tf-btn--incorrect': liveAnswered && liveVerification.leftValue !== liveVerification.rightValue }"
                  :disabled="liveAnswered"
                  @click="answerLiveCheck(false)"
                >
                  Falso
                </button>
              </div>
              <p v-if="liveAnswered" class="lv-feedback" :class="liveAnswerCorrect ? 'lv-feedback--correct' : 'lv-feedback--incorrect'">
                {{ liveAnswerCorrect ? '¡Correcto!' : 'No es correcto.' }}
              </p>
            </template>
            <template v-else>
              <p class="lv-panel__text">
                Todavía no hay un ejercicio interactivo emparejado para esta ley en el banco actual. Puedes practicarla
                en la sección de ejercicios.
              </p>
              <button type="button" class="lv-secondary-btn" @click="goPracticeExercises(selectedConcept.topic)">Ir a Ejercicios</button>
            </template>
          </div>

          <!-- Paso 4: Solución -->
          <div v-if="step === 4" class="lv-panel">
            <template v-if="quizExercise && answered">
              <p class="lv-panel__result" :class="wasCorrect ? 'lv-panel__result--true' : 'lv-panel__result--false'">
                {{ wasCorrect ? '¡Respondiste correctamente!' : `La respuesta correcta era: ${quizExercise.correctOption}` }}
              </p>
              <p class="lv-panel__text">{{ quizExercise.explanation }}</p>
            </template>
            <template v-else-if="liveVerification && liveAnswered">
              <p class="lv-panel__text">
                Explicación: <code>{{ liveVerification.left }}</code> y <code>{{ liveVerification.right }}</code>
                {{ liveVerification.leftValue === liveVerification.rightValue ? 'producen el mismo valor de verdad, tal como establece esta ley.' : 'no coincidieron con esta asignación particular.' }}
              </p>
            </template>
            <template v-else>
              <p class="lv-panel__text">
                Completa el paso "Ejercicio" para ver aquí la explicación de la solución.
              </p>
            </template>
          </div>

          <div class="lv-nav">
            <button type="button" class="lv-nav__btn" :disabled="step === 1" @click="goToStep(step - 1)">← Anterior</button>
            <button type="button" class="lv-nav__btn lv-nav__btn--primary" :disabled="step === 4" @click="goToStep(step + 1)">Siguiente →</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lv-page {
  background: var(--color-white);
  padding: 32px 0 64px;
  min-height: calc(100vh - 68px);
}

.lv-page h1 {
  font-family: var(--font-heading);
  font-size: 28px;
  margin: 0 0 8px;
  color: var(--color-text-dark);
}

.lv-subtitle {
  color: var(--color-text-gray);
  font-size: 14px;
  margin: 0 0 20px;
  max-width: 640px;
}

.lv-recommend {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--color-navy);
  color: var(--color-white);
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 24px;
}

.lv-recommend__icon {
  font-size: 28px;
  flex-shrink: 0;
}

.lv-recommend__body {
  flex-grow: 1;
}

.lv-recommend__title {
  margin: 0 0 4px;
  font-weight: 800;
  font-family: var(--font-heading);
  font-size: 15px;
}

.lv-recommend__text {
  margin: 0;
  font-size: 13.5px;
  opacity: 0.92;
}

.lv-recommend__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.lv-chip {
  background: rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.lv-chip:hover {
  background: rgba(255, 255, 255, 0.24);
}

.lv-recommend__btn {
  background: var(--color-white);
  color: var(--color-navy);
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 700;
  font-size: 13.5px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.2s ease;
}

.lv-recommend__btn:hover {
  opacity: 0.85;
}

.lv-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.lv-tab {
  background: #dfe6f4;
  color: var(--color-text-dark);
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.2s ease, color 0.2s ease;
}

.lv-tab--active {
  background: var(--color-blue);
  color: var(--color-white);
}

.lv-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  align-items: start;
}

.lv-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f2f5fb;
  border-radius: 12px;
  padding: 12px;
}

.lv-list__item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-text-dark);
  text-align: left;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.lv-list__item:hover {
  border-color: var(--color-blue);
}

.lv-list__item--active {
  background: var(--color-blue);
  color: var(--color-white);
  border-color: var(--color-blue);
}

.lv-list__symbol {
  font-weight: 800;
  font-size: 15px;
  width: 20px;
  text-align: center;
}

.lv-list__title {
  flex-grow: 1;
}

.lv-list__check {
  color: #1f9d55;
  font-weight: 800;
}

.lv-list__item--active .lv-list__check {
  color: #b9f0cf;
}

.lv-guided {
  background: #eef3fc;
  border-radius: 12px;
  padding: 22px;
}

.lv-guided__header h2 {
  margin: 0 0 12px;
  font-family: var(--font-heading);
  font-size: 20px;
  color: var(--color-text-dark);
}

.lv-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.lv-step-dot {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-gray);
  transition: background 0.2s ease, color 0.2s ease;
}

.lv-step-dot--active {
  background: var(--color-blue);
  color: var(--color-white);
  border-color: var(--color-blue);
}

.lv-step-dot--done:not(.lv-step-dot--active) {
  color: #1f9d55;
  border-color: #1f9d55;
}

.lv-panel {
  background: var(--color-white);
  border-radius: 10px;
  padding: 20px;
  min-height: 140px;
}

.lv-panel__text {
  font-size: 14px;
  color: var(--color-text-dark);
  line-height: 1.6;
  margin: 0 0 12px;
}

.lv-panel__result {
  font-size: 14px;
  font-weight: 700;
  margin: 8px 0;
}

.lv-panel__result--true {
  color: #1f9d55;
}

.lv-panel__result--false {
  color: #d64545;
}

.lv-formulas {
  margin: 0;
  padding-left: 18px;
  font-size: 13.5px;
  color: var(--color-text-dark);
  line-height: 1.9;
}

.lv-formulas__single {
  font-size: 13.5px;
  color: var(--color-text-gray);
}

code {
  background: var(--color-blue-light);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: 'Inter', monospace;
  font-weight: 700;
}

.lv-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 420px;
}

.lv-truefalse {
  display: flex;
  gap: 12px;
}

.lv-tf-btn {
  flex: 1;
  background: var(--color-blue);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.lv-tf-btn:hover:not(:disabled) {
  background: var(--color-blue-hover);
}

.lv-tf-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.lv-tf-btn--correct {
  background: #1f9d55;
}

.lv-tf-btn--incorrect {
  background: #d64545;
}

.lv-feedback {
  margin-top: 12px;
  font-weight: 700;
  font-size: 13.5px;
}

.lv-feedback--correct {
  color: #1f9d55;
}

.lv-feedback--incorrect {
  color: #d64545;
}

.lv-secondary-btn {
  background: var(--color-navy);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 700;
  font-size: 13.5px;
}

.lv-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
}

.lv-nav__btn {
  background: #dfe6f4;
  color: var(--color-text-dark);
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 700;
  font-size: 13.5px;
  transition: background 0.2s ease;
}

.lv-nav__btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.lv-nav__btn--primary {
  background: var(--color-blue);
  color: var(--color-white);
}

.lv-nav__btn--primary:hover:not(:disabled) {
  background: var(--color-blue-hover);
}

@media (max-width: 900px) {
  .lv-layout {
    grid-template-columns: 1fr;
  }
  .lv-recommend {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
