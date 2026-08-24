<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import ToggleSwitch from '../components/ToggleSwitch.vue';
import {
  parseProposition,
  collectVariables,
  buildTruthTable,
  classifyProposition,
  classificationLabel,
  classificationDescription,
  LogicParseError,
  type TruthTableResult,
  type PropositionClassification,
} from '../lib/logicEngine';

const proposition = ref('P ∧ Q → R');
const errorMessage = ref('');
const table = ref<TruthTableResult | null>(null);
const detectedVars = ref<string[]>([]);
const activeVars = reactive<Record<string, boolean>>({});

// Clasificación semántica (tautología / contradicción / contingencia), calculada
// SIEMPRE sobre la tabla completa (todas las variables), sin importar qué
// variables haya desactivado el usuario en la interfaz.
const classification = ref<PropositionClassification | null>(null);
const classificationCounts = ref<{ trueCount: number; falseCount: number; total: number } | null>(null);

const OPERATORS = [
  { symbol: '∧', label: 'AND' },
  { symbol: '∨', label: 'OR' },
  { symbol: '¬', label: 'NOT' },
  { symbol: '→', label: 'IMPLICACIÓN' },
  { symbol: '↔', label: 'BICONDICIONAL' },
];

function insertOperator(symbol: string) {
  proposition.value = `${proposition.value} ${symbol} `.replace(/\s+/g, ' ');
}

// Detecta variables al escribir, para poder mostrar los interruptores
// incluso antes de generar la tabla.
watch(
  proposition,
  (value) => {
    try {
      const ast = parseProposition(value);
      detectedVars.value = collectVariables(ast);
      detectedVars.value.forEach((v) => {
        if (!(v in activeVars)) activeVars[v] = true;
      });
    } catch {
      // se ignoran errores mientras el usuario escribe; solo se validan al generar
    }
  },
  { immediate: true },
);

function generateTable() {
  errorMessage.value = '';
  try {
    const ast = parseProposition(proposition.value);
    const vars = collectVariables(ast);
    detectedVars.value = vars;
    vars.forEach((v) => {
      if (!(v in activeVars)) activeVars[v] = true;
    });
    const active = vars.filter((v) => activeVars[v]);
    table.value = buildTruthTable(ast, active);

    const result = classifyProposition(ast);
    classification.value = result.classification;
    classificationCounts.value = {
      trueCount: result.trueCount,
      falseCount: result.falseCount,
      total: result.results.length,
    };
  } catch (err) {
    table.value = null;
    classification.value = null;
    classificationCounts.value = null;
    errorMessage.value =
      err instanceof LogicParseError
        ? err.message
        : 'No se pudo interpretar la proposición. Revisa la sintaxis.';
  }
}

const classificationText = computed(() => (classification.value ? classificationLabel[classification.value] : ''));
const classificationExplanation = computed(() =>
  classification.value ? classificationDescription[classification.value] : '',
);

const showExplanation = ref(false);

const explanationSteps = computed(() => {
  if (!table.value || table.value.subExpressions.length === 0) return [];
  const firstRow = table.value.rows[0];
  return table.value.subExpressions.map((_sub, idx) => ({
    index: idx + 1,
    text: `Se evaluó ${idx === table.value!.subExpressions.length - 1 ? 'finalmente' : ''} la subexpresión (${
      firstRow.steps[idx].label
    }), obteniendo ${firstRow.steps[idx].value ? 'V' : 'F'}.`,
  }));
});

// Genera la tabla de ejemplo al entrar a la vista.
generateTable();
</script>

<template>
  <section class="tt-page">
    <div class="container">
      <div class="tt-banner">
        <h1>Tablas de verdad</h1>
        <p>Analiza expresiones de lógica proposicional</p>
      </div>

      <div class="tt-input-card">
        <label class="tt-input-label" for="proposition">
          <span class="tt-input-icon" aria-hidden="true">✏️</span> Ingresa una proposición lógica
        </label>
        <input
          id="proposition"
          v-model="proposition"
          type="text"
          class="tt-input"
          placeholder="Ej: P ∧ Q → R"
          @keyup.enter="generateTable"
        />
        <button class="tt-generate-btn" @click="generateTable">
          <span aria-hidden="true">▦</span> Generar tabla
        </button>
        <p v-if="errorMessage" class="tt-error">{{ errorMessage }}</p>
      </div>

      <div class="tt-grid">
        <div class="tt-card">
          <h3 class="tt-card__title"><span aria-hidden="true">🅰️</span> Variables</h3>
          <div class="tt-variables">
            <ToggleSwitch
              v-for="v in detectedVars"
              :key="v"
              v-model="activeVars[v]"
              :label="v"
            />
            <p v-if="detectedVars.length === 0" class="tt-empty">Escribe una proposición para detectar variables.</p>
          </div>
        </div>

        <div class="tt-card">
          <h3 class="tt-card__title"><span aria-hidden="true">🔀</span> Operadores lógicos</h3>
          <div class="tt-operators">
            <button
              v-for="op in OPERATORS"
              :key="op.symbol"
              type="button"
              class="tt-operator"
              @click="insertOperator(op.symbol)"
            >
              <span class="tt-operator__symbol">{{ op.symbol }}</span>
              <span class="tt-operator__label">{{ op.label }}</span>
            </button>
          </div>
        </div>

        <div
          class="tt-card tt-card--result"
          v-if="table && classification"
          :class="`tt-card--${classification}`"
        >
          <h3 class="tt-card__title tt-card__title--result">
            <span aria-hidden="true">{{ classification === 'tautologia' ? '✅' : classification === 'contradiccion' ? '⛔' : '🔀' }}</span>
            Clasificación
          </h3>
          <p class="tt-result-caption">La proposición es una:</p>
          <p class="tt-result-value" :class="`is-${classification}`">
            {{ classificationText.toUpperCase() }}
          </p>
          <p class="tt-result-final" :class="`is-${classification}`">{{ classificationExplanation }}</p>
          <hr />
          <p class="tt-result-summary">
            Es verdadera (V) en <strong>{{ classificationCounts?.trueCount }} de {{ classificationCounts?.total }}</strong>
            combinaciones posibles de sus variables.
          </p>
        </div>
      </div>

      <div class="tt-table-card" v-if="table">
        <h3 class="tt-card__title"><span aria-hidden="true">▦</span> Tabla de verdad</h3>
        <div class="tt-table-scroll">
          <table class="tt-table">
            <thead>
              <tr>
                <th v-for="v in table.variables" :key="v">{{ v }}</th>
                <th v-for="(_sub, idx) in table.subExpressions" :key="'sub-' + idx">
                  {{ table.rows[0].steps[idx].label }}
                </th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rIdx) in table.rows" :key="rIdx">
                <td v-for="v in table.variables" :key="v" :class="row.assignment[v] ? 'is-true' : 'is-false'">
                  {{ row.assignment[v] ? 'V' : 'F' }}
                </td>
                <td
                  v-for="(_sub, idx) in table.subExpressions"
                  :key="'val-' + idx"
                  :class="row.steps[idx].value ? 'is-true' : 'is-false'"
                >
                  {{ row.steps[idx].value ? 'V' : 'F' }}
                </td>
                <td :class="row.result ? 'is-true' : 'is-false'" class="tt-table__result-cell">
                  {{ row.result ? 'V' : 'F' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="tt-explain-card" v-if="table">
        <h3 class="tt-card__title"><span aria-hidden="true">💡</span> ¿Cómo se resolvió?</h3>
        <ol class="tt-explain-list">
          <li v-for="step in explanationSteps" :key="step.index">{{ step.text }}</li>
          <li v-if="explanationSteps.length === 0">
            La expresión ya es una variable simple, así que su valor se toma directamente.
          </li>
        </ol>
        <button class="tt-explain-toggle" @click="showExplanation = !showExplanation">
          {{ showExplanation ? 'Ocultar explicación paso a paso' : 'Ver explicación paso a paso' }}
          <span aria-hidden="true">→</span>
        </button>
        <div v-if="showExplanation" class="tt-explain-detail">
          <p>
            Primero se evalúan las subexpresiones más internas y luego se combinan siguiendo la precedencia:
            ¬ &gt; ∧ &gt; ∨ &gt; → &gt; ↔. Cada fila de la tabla repite este proceso con una combinación distinta
            de valores de verdad para las variables activas.
          </p>
        </div>
      </div>

      <p class="tt-hint">
        <span aria-hidden="true">ℹ️</span> Puedes activar o desactivar variables y usar los operadores para
        construir tu proposición.
      </p>
    </div>
  </section>
</template>

<style scoped>
.tt-page {
  background: #f5f7fb;
  padding: 32px 0 64px;
  min-height: calc(100vh - 68px);
}

.tt-banner {
  background: var(--color-navy);
  color: var(--color-white);
  border-radius: 12px;
  padding: 18px 24px;
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 24px;
}

.tt-banner h1 {
  font-family: var(--font-heading);
  font-size: 18px;
  margin: 0;
}

.tt-banner p {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
}

.tt-input-card {
  background: var(--color-white);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(15, 45, 141, 0.06);
}

.tt-input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 12px;
  color: var(--color-text-dark);
}

.tt-input-icon {
  width: 26px;
  height: 26px;
  background: var(--color-blue-light);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tt-input {
  width: 100%;
  background: #eef2fb;
  border: none;
  border-radius: 10px;
  padding: 18px;
  font-size: 22px;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  color: var(--color-text-dark);
  margin-bottom: 16px;
}

.tt-input:focus {
  outline: 2px solid var(--color-blue);
}

.tt-generate-btn {
  display: block;
  margin: 0 auto;
  background: var(--color-blue);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.2s ease;
}

.tt-generate-btn:hover {
  background: var(--color-blue-hover);
}

.tt-error {
  color: #c0392b;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  margin: 12px 0 0;
}

.tt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.1fr;
  gap: 16px;
  margin-bottom: 20px;
  align-items: start;
}

.tt-card {
  background: var(--color-white);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(15, 45, 141, 0.06);
}

.tt-card--result {
  background: #f0faf3;
  transition: background 0.25s ease;
}

.tt-card--tautologia {
  background: #f0faf3;
}

.tt-card--contradiccion {
  background: #fdf0ef;
}

.tt-card--contingencia {
  background: #fef8ec;
}

.tt-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 16px;
}

.tt-card__title--result {
  color: #1f9d55;
}

.tt-variables {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tt-empty {
  font-size: 13px;
  color: var(--color-text-gray);
}

.tt-operators {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.tt-operator {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-white);
  padding: 10px 6px;
  text-align: center;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.tt-operator:hover {
  border-color: var(--color-blue);
  background: var(--color-blue-light);
}

.tt-operator__symbol {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-blue);
}

.tt-operator__label {
  display: block;
  font-size: 9px;
  color: var(--color-text-gray);
  margin-top: 2px;
}

.tt-result-caption {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-gray);
}

.tt-result-value {
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 800;
  margin: 4px 0;
  letter-spacing: 0.5px;
}

.tt-result-value.is-tautologia {
  color: #1f9d55;
}

.tt-result-value.is-contradiccion {
  color: #d64545;
}

.tt-result-value.is-contingencia {
  color: #b9860a;
}

.tt-result-final {
  display: block;
  font-weight: 600;
  font-size: 12.5px;
  line-height: 1.5;
  padding: 4px 0 10px;
  margin-bottom: 4px;
  color: var(--color-text-gray);
}

.tt-result-summary {
  font-size: 13px;
  color: var(--color-text-dark);
  margin: 12px 0 0;
}

.tt-table-card,
.tt-explain-card {
  background: var(--color-white);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(15, 45, 141, 0.06);
}

.tt-table-scroll {
  overflow-x: auto;
}

.tt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  text-align: center;
}

.tt-table th {
  background: #eef2fb;
  padding: 10px;
  font-weight: 700;
}

.tt-table td {
  padding: 9px;
  border-bottom: 1px solid #f0f0f5;
}

.tt-table td.is-true {
  color: #1f9d55;
  font-weight: 700;
}

.tt-table td.is-false {
  color: #d64545;
  font-weight: 700;
}

.tt-table__result-cell {
  background: #f7f9fd;
}

.tt-explain-list {
  margin: 0 0 16px;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--color-text-dark);
}

.tt-explain-toggle {
  background: var(--color-white);
  border: 1px solid var(--color-blue);
  color: var(--color-blue);
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 700;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease;
}

.tt-explain-toggle:hover {
  background: var(--color-blue-light);
}

.tt-explain-detail {
  margin-top: 14px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-gray);
  background: #f7f9fd;
  border-radius: 8px;
  padding: 14px;
}

.tt-hint {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-gray);
  background: var(--color-white);
  border-radius: 10px;
  padding: 14px;
  margin: 0;
}

@media (max-width: 960px) {
  .tt-grid {
    grid-template-columns: 1fr;
  }
}
</style>
