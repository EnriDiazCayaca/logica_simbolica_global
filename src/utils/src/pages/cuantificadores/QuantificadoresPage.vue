<template>
  <div class="quantifiers-page min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
    <!-- Header Badge -->
    <header class="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-mono font-bold text-2xl text-white shadow-lg shadow-blue-500/20">
          ∀∃
        </div>
        <div>
          <h1 class="text-2xl font-bold tracking-tight flex items-center gap-2">
            QuantifiWeb <span class="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full uppercase font-mono">Equipo 3</span>
          </h1>
          <p class="text-xs text-slate-400">
            Cuantificadores Lógicos sobre Dominios Finitos D & Leyes de De Morgan
          </p>
        </div>
      </div>

      <!-- Integrantes badge -->
      <div class="text-right text-xs text-slate-400 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
        <div class="font-semibold text-slate-200">Equipo 3 — Modus Innova:</div>
        <div class="text-cyan-400">Cristian (Sublíder), Danuska, Marlon, Guillermo, Noemí, Julio</div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Panel: Form Controls -->
      <section class="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <h2 class="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>⚙️</span> Configuración de la Expresión
        </h2>

        <!-- Select Quantifier -->
        <div class="mb-4">
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cuantificador Lógico</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="quantifier = 'forall'"
              :class="['p-3 rounded-xl font-semibold border flex items-center justify-center gap-2 transition-all', quantifier === 'forall' ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800/80']"
            >
              <span class="text-xl font-bold font-mono">∀</span> Universal (Para todo)
            </button>
            <button
              @click="quantifier = 'exists'"
              :class="['p-3 rounded-xl font-semibold border flex items-center justify-center gap-2 transition-all', quantifier === 'exists' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/10' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800/80']"
            >
              <span class="text-xl font-bold font-mono">∃</span> Existencial (Existe)
            </button>
          </div>
        </div>

        <!-- Domain Input -->
        <div class="mb-4">
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Dominio de Discurso D (Separado por comas)
          </label>
          <input
            v-model="rawDomain"
            type="text"
            placeholder="1, 2, 3, 4, 5"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p class="text-xs text-slate-500 mt-1">Ejemplo: <code class="text-slate-400">1, 2, 3, 4, 5</code> o <code class="text-slate-400">a, b, c</code></p>
        </div>

        <!-- Predicate Condition Selector -->
        <div class="mb-4">
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Predicado P(x) / Condición
          </label>
          <select
            v-model="selectedPredicate"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 font-sans text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="isEven">x es un número par (x % 2 === 0)</option>
            <option value="isOdd">x es un número impar (x % 2 !== 0)</option>
            <option value="isPrime">x es un número primo</option>
            <option value="isGreaterThanTwo">x es mayor que 2 (x > 2)</option>
            <option value="isPositive">x es número positivo (x > 0)</option>
          </select>
        </div>

        <!-- Quick Symbol Toolbar -->
        <div class="mb-6">
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Símbolos Rápidos</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="sym in ['∀', '∃', '∈', '→', '∧', '∨', '¬', '≡', '∴']"
              :key="sym"
              @click="insertSymbol(sym)"
              class="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 font-mono font-bold text-slate-300 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all text-center"
            >
              {{ sym }}
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-3">
          <button
            @click="evaluate"
            class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>🚀</span> Evaluar Cuantificador en D
          </button>
          <button
            @click="loadPresetExample"
            class="w-full py-2.5 px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-medium text-xs hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <span>🎲</span> Cargar Ejemplo Didáctico
          </button>
        </div>
      </section>

      <!-- Right Panel: Trace & De Morgan Result -->
      <section class="lg:col-span-7 flex flex-col gap-6">
        <!-- Status Card -->
        <div
          v-if="result"
          :class="[
            'border rounded-2xl p-6 shadow-xl transition-all',
            result.isSatisfied
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          ]"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border"
              :class="result.isSatisfied ? 'bg-emerald-900/60 border-emerald-600 text-emerald-400' : 'bg-rose-900/60 border-rose-600 text-rose-400'"
            >
              {{ result.isSatisfied ? '🟢 VERDADERO (V)' : '🔴 FALSO (F)' }}
            </span>
            <span class="font-mono text-xl font-bold">{{ result.symbol }}x P(x)</span>
          </div>

          <p class="text-sm font-medium mt-2 leading-relaxed">
            {{ result.summary }}
          </p>

          <!-- Counterexample / Witness Highlight -->
          <div v-if="result.counterExample !== undefined" class="mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs font-mono text-rose-300">
            ⚠️ <strong>Contraejemplo detectado:</strong> x = {{ result.counterExample }} hace que P({{ result.counterExample }}) sea Falso.
          </div>
          <div v-if="result.witness !== undefined" class="mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs font-mono text-emerald-300">
            ✨ <strong>Testigo de cumplimiento:</strong> x = {{ result.witness }} satisface P({{ result.witness }}).
          </div>
        </div>

        <!-- Trace Step Table -->
        <div v-if="result" class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 class="text-md font-bold text-slate-200 mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
            <span>📋 Trazabilidad por Elemento en D</span>
            <span class="text-xs font-normal text-slate-400 font-mono">|D| = {{ result.domain.length }}</span>
          </h3>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-mono">
              <thead>
                <tr class="border-b border-slate-800 text-slate-400">
                  <th class="py-2 px-3">Elemento x</th>
                  <th class="py-2 px-3">Evaluación</th>
                  <th class="py-2 px-3">Resultado</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(step, idx) in result.trace"
                  :key="idx"
                  class="border-b border-slate-800/50 hover:bg-slate-800/30"
                >
                  <td class="py-2 px-3 font-bold text-slate-300">x = {{ step.element }}</td>
                  <td class="py-2 px-3 text-slate-400">{{ step.explanation }}</td>
                  <td class="py-2 px-3 font-semibold" :class="step.result ? 'text-emerald-400' : 'text-rose-400'">
                    {{ step.result ? 'V ✅' : 'F ❌' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- De Morgan Transformer Box -->
        <div v-if="result" class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 class="text-md font-bold text-indigo-400 mb-2 flex items-center gap-2 border-b border-slate-800 pb-2">
            <span>🔄</span> Asistente de Negación (Leyes de De Morgan)
          </h3>
          <p class="text-xs text-slate-400 mb-3">{{ result.deMorgan.rule }}</p>
          <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-sm space-y-2">
            <div class="text-slate-400">Original: <span class="text-slate-200">{{ result.deMorgan.original }}</span></div>
            <div class="text-indigo-400 font-bold">Equivalente Negado: <span class="text-cyan-400">{{ result.deMorgan.negated }}</span></div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { evaluateQuantifier, type QuantifierType, type QuantifierResult } from '../../utils/quantifierEngine'

const quantifier = ref<QuantifierType>('forall')
const rawDomain = ref('1, 2, 3, 4, 5')
const selectedPredicate = ref('isEven')
const result = ref<QuantifierResult | null>(null)

const predicateFunctions: Record<string, { fn: (x: any) => boolean; desc: string }> = {
  isEven: { fn: (x: any) => Number(x) % 2 === 0, desc: 'x es un número par' },
  isOdd: { fn: (x: any) => Number(x) % 2 !== 0, desc: 'x es un número impar' },
  isPrime: {
    fn: (x: any) => {
      const n = Number(x)
      if (n <= 1) return false
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false
      }
      return true
    },
    desc: 'x es un número primo'
  },
  isGreaterThanTwo: { fn: (x: any) => Number(x) > 2, desc: 'x es mayor que 2' },
  isPositive: { fn: (x: any) => Number(x) > 0, desc: 'x es positivo' }
}

function parseDomain(input: string): any[] {
  return input
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => (isNaN(Number(s)) ? s : Number(s)))
}

function evaluate() {
  const domain = parseDomain(rawDomain.value)
  const pred = predicateFunctions[selectedPredicate.value] || predicateFunctions.isEven
  result.value = evaluateQuantifier(quantifier.value, domain, pred.fn, pred.desc)
}

function insertSymbol(sym: string) {
  rawDomain.value += ` ${sym}`
}

function loadPresetExample() {
  quantifier.value = 'forall'
  rawDomain.value = '2, 4, 6, 8'
  selectedPredicate.value = 'isEven'
  evaluate()
}

onMounted(() => {
  evaluate()
})
</script>
