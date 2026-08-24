<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import { generarTabla, type ResultadoTabla } from '@/lib/truth-table/evaluator'

const formula = ref('P AND Q -> R')
const resultado = ref<ResultadoTabla | null>(null)
const error = ref('')

const operadores = [
  { simbolo: '∧', texto: 'AND' },
  { simbolo: '∨', texto: 'OR' },
  { simbolo: '¬', texto: 'NOT' },
  { simbolo: '→', texto: 'IMPLIES' },
  { simbolo: '↔', texto: 'IFF' },
]

function generar(): void {
  error.value = ''
  try {
    resultado.value = generarTabla(formula.value)
  } catch (e) {
    resultado.value = null
    error.value = e instanceof Error ? e.message : 'No se pudo interpretar la fórmula.'
  }
}

function insertar(simbolo: string): void {
  formula.value = `${formula.value} ${simbolo} `
}

const etiqueta = computed(() => {
  if (!resultado.value) return ''
  return {
    tautologia: 'TAUTOLOGÍA',
    contradiccion: 'CONTRADICCIÓN',
    contingencia: 'CONTINGENCIA',
  }[resultado.value.clasificacion]
})

generar()
</script>

<template>
  <main class="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6">
    <div class="mx-auto max-w-6xl space-y-6">
      <router-link to="/" class="text-sm font-medium text-blue-600 hover:underline">
        ← Volver al inicio
      </router-link>

      <section class="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div class="mb-6">
          <p class="mb-2 text-sm font-semibold text-blue-600">Sinergia · Tablas de verdad</p>
          <h1 class="text-3xl font-bold text-neutral-900">Motor de tablas de verdad</h1>
          <p class="mt-2 text-neutral-600">
            Escribe una fórmula proposicional y genera todas sus combinaciones de valores de verdad.
          </p>
        </div>

        <label for="formula" class="mb-2 block text-sm font-semibold text-neutral-900">
          Fórmula lógica
        </label>
        <div class="flex flex-col gap-3 sm:flex-row">
          <input
            id="formula"
            v-model="formula"
            class="min-w-0 flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-3 font-mono text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Ejemplo: p AND q"
            @keyup.enter="generar"
          />
          <Button size="lg" @click="generar">Generar tabla</Button>
        </div>
        <p v-if="error" class="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>

        <div class="mt-4 flex flex-wrap gap-2">
          <Button
            v-for="operador in operadores"
            :key="operador.simbolo"
            variant="secondary"
            size="sm"
            @click="insertar(operador.simbolo)"
          >
            {{ operador.simbolo }} {{ operador.texto }}
          </Button>
        </div>
      </section>

      <section v-if="resultado" class="grid gap-4 md:grid-cols-3">
        <article class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-neutral-500">Variables</p>
          <p class="mt-1 text-2xl font-bold text-neutral-900">{{ resultado.variables.join(', ') }}</p>
        </article>
        <article class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-neutral-500">Combinaciones</p>
          <p class="mt-1 text-2xl font-bold text-neutral-900">{{ resultado.filas.length }}</p>
        </article>
        <article class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-neutral-500">Clasificación</p>
          <p class="mt-1 text-2xl font-bold text-blue-600">{{ etiqueta }}</p>
        </article>
      </section>

      <section v-if="resultado" class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div class="border-b border-neutral-200 px-5 py-4">
          <h2 class="font-bold text-neutral-900">Tabla de verdad</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[600px] border-collapse text-center text-sm">
            <thead>
              <tr class="bg-neutral-50">
                <th v-for="variable in resultado.variables" :key="variable" class="border-b border-neutral-200 px-4 py-3 font-semibold">
                  {{ variable }}
                </th>
                <th v-for="(sub, index) in resultado.subExpresiones" :key="index" class="border-b border-neutral-200 px-4 py-3 font-semibold">
                  {{ sub.type === 'VAR' ? sub.value : 'Paso ' + (index + 1) }}
                </th>
                <th class="border-b border-neutral-200 px-4 py-3 font-semibold">Resultado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fila, rowIndex) in resultado.filas" :key="rowIndex" class="hover:bg-neutral-50">
                <td v-for="variable in resultado.variables" :key="variable" class="border-b border-neutral-100 px-4 py-3 font-semibold">
                  {{ fila.variables.get(variable) ? 'V' : 'F' }}
                </td>
                <td v-for="(paso, index) in fila.pasos" :key="index" class="border-b border-neutral-100 px-4 py-3">
                  {{ paso.value ? 'V' : 'F' }}
                </td>
                <td class="border-b border-neutral-100 px-4 py-3 font-bold text-blue-600">
                  {{ fila.resultado ? 'V' : 'F' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</template>
