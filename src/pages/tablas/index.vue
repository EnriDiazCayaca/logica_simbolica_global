<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Info as InfoIcon } from '@lucide/vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
import {
  parsearProposicion,
  recolectarVariables,
  recolectarSubExpresiones,
  evaluar,
  nodoATexto,
  clasificarProposicion,
  ErrorParseoLogico,
  generarFilas,
  type ClasificacionProposicion,
  type NodoExpresion,
} from '@/lib/truth-table/evaluator'

const proposicion = ref('P ∧ Q → R')
const errorMessage = ref('')
const mostrarExplicacion = ref(false)

const OPERADORES = [
  { simbolo: '∧', etiqueta: 'AND' },
  { simbolo: '∨', etiqueta: 'OR' },
  { simbolo: '¬', etiqueta: 'NOT' },
  { simbolo: '→', etiqueta: 'IMPL' },
  { simbolo: '↔', etiqueta: 'BICOND' },
]

interface ResultadoTabla {
  formula: string
  variables: string[]
  filas: { asignacion: Record<string, boolean>; pasos: { etiqueta: string; valor: boolean }[]; resultado: boolean }[]
  subExpresiones: NodoExpresion[]
  clasificacion: ClasificacionProposicion
  verdaderas: number
  falsas: number
}

const resultado = ref<ResultadoTabla | null>(null)
const variablesDetectadas = ref<string[]>([])
const variablesActivas = reactive<Record<string, boolean>>({})
const clasificacion = ref<ClasificacionProposicion | null>(null)
const conteoClasificacion = ref<{ verdaderas: number; falsas: number; total: number } | null>(null)

function insertarOperador(simbolo: string) {
  proposicion.value = `${proposicion.value} ${simbolo} `.replace(/\s+/g, ' ')
}

watch(
  proposicion,
  (valor) => {
    try {
      const nodo = parsearProposicion(valor)
      variablesDetectadas.value = recolectarVariables(nodo)
      variablesDetectadas.value.forEach((v) => {
        if (!(v in variablesActivas)) variablesActivas[v] = true
      })
    } catch {
      // ignorar mientras escribe
    }
  },
  { immediate: true },
)

function generarTabla() {
  errorMessage.value = ''
  try {
    const nodo = parsearProposicion(proposicion.value)
    const vars = recolectarVariables(nodo)
    variablesDetectadas.value = vars
    vars.forEach((v) => {
      if (!(v in variablesActivas)) variablesActivas[v] = true
    })
    const activas = vars.filter((v) => variablesActivas[v])
    const subExpresiones = recolectarSubExpresiones(nodo)
    const filas = generarFilas(nodo, activas)
    const verdaderas = filas.filter((f) => f.resultado).length
    const falsas = filas.length - verdaderas
    const clas = falsas === 0 ? 'tautologia' : verdaderas === 0 ? 'contradiccion' : 'contingencia'

    resultado.value = { formula: proposicion.value, variables: activas, filas, subExpresiones, clasificacion: clas, verdaderas, falsas }
    clasificacion.value = clas
    conteoClasificacion.value = { verdaderas, falsas, total: filas.length }
  } catch (err) {
    resultado.value = null
    clasificacion.value = null
    conteoClasificacion.value = null
    errorMessage.value =
      err instanceof ErrorParseoLogico
        ? err.message
        : 'No se pudo interpretar la proposición. Revisa la sintaxis.'
  }
}

const textoClasificacion = computed(() => {
  if (!clasificacion.value) return ''
  const mapa: Record<ClasificacionProposicion, string> = {
    tautologia: 'TAUTOLOGÍA',
    contradiccion: 'CONTRADICCIÓN',
    contingencia: 'CONTINGENCIA',
  }
  return mapa[clasificacion.value]
})

const explicacionClasificacion = computed(() => {
  if (!clasificacion.value) return ''
  const mapa: Record<ClasificacionProposicion, string> = {
    tautologia: 'Es verdadera (V) en absolutamente todas las combinaciones posibles de valores de verdad.',
    contradiccion: 'Es falsa (F) en absolutamente todas las combinaciones posibles de valores de verdad.',
    contingencia: 'Su valor de verdad depende de la combinación: en algunas es V y en otras es F.',
  }
  return mapa[clasificacion.value]
})

const pasosExplicacion = computed(() => {
  if (!resultado.value || resultado.value.subExpresiones.length === 0) return []
  const primeraFila = resultado.value.filas[0]
  return resultado.value.subExpresiones.map((_sub, idx) => ({
    index: idx + 1,
    texto: `Se evaluó ${idx === resultado.value!.subExpresiones.length - 1 ? 'finalmente' : ''} la subexpresión (${
      primeraFila.pasos[idx].etiqueta
    }), obteniendo ${primeraFila.pasos[idx].valor ? 'V' : 'F'}.`,
  }))
})

function claseFila(valor: boolean) {
  return valor ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'
}

function claseCelda(valor: boolean) {
  return valor ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'
}

// Genera tabla de ejemplo al entrar
generarTabla()
</script>

<template>
  <section class="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6">
        <h1 class="text-2xl font-bold">Tablas de Verdad</h1>
        <p class="text-blue-100 text-sm mt-1">Analiza expresiones de lógica proposicional</p>
      </div>

      <!-- Input Card -->
      <Card>
        <label for="proposition" class="block text-sm font-semibold text-neutral-700 mb-2">
          Ingresa una proposición lógica
        </label>
        <input
          id="proposition"
          v-model="proposicion"
          type="text"
          class="w-full bg-neutral-100 border-none rounded-xl px-5 py-4 text-2xl text-center font-mono text-neutral-900 focus:outline-2 focus:outline-blue-500 transition-all"
          placeholder="Ej: P ∧ Q → R"
          @keyup.enter="generarTabla"
        />
        <div class="mt-4 flex justify-center">
          <Button @click="generarTabla">Generar tabla</Button>
        </div>
        <p v-if="errorMessage" class="mt-3 text-red-600 text-sm font-semibold text-center">
          {{ errorMessage }}
        </p>
      </Card>

      <!-- Info Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Variables -->
        <Card>
          <h3 class="text-sm font-bold text-neutral-700 mb-4">Variables</h3>
          <div class="space-y-3">
            <ToggleSwitch
              v-for="v in variablesDetectadas"
              :key="v"
              v-model="variablesActivas[v]"
              :label="v"
            />
            <p v-if="variablesDetectadas.length === 0" class="text-sm text-neutral-400">
              Escribe una proposición para detectar variables.
            </p>
          </div>
        </Card>

        <!-- Operadores -->
        <Card>
          <h3 class="text-sm font-bold text-neutral-700 mb-4">Operadores lógicos</h3>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="op in OPERADORES"
              :key="op.simbolo"
              type="button"
              class="border border-neutral-200 rounded-lg py-2 px-1 text-center hover:border-blue-400 hover:bg-blue-50 transition-all"
              @click="insertarOperador(op.simbolo)"
            >
              <span class="block text-lg font-bold text-blue-600">{{ op.simbolo }}</span>
              <span class="block text-[9px] text-neutral-400 mt-0.5">{{ op.etiqueta }}</span>
            </button>
          </div>
        </Card>

        <!-- Clasificación -->
        <Card v-if="resultado && clasificacion">
          <div
            :class="[
              'rounded-lg p-4',
              clasificacion === 'tautologia' && 'bg-emerald-50',
              clasificacion === 'contradiccion' && 'bg-red-50',
              clasificacion === 'contingencia' && 'bg-amber-50',
            ]"
          >
            <h3 class="text-sm font-bold text-neutral-700 mb-2">Clasificación</h3>
            <p class="text-xs text-neutral-500 mb-1">La proposición es una:</p>
            <p
              :class="[
                'text-xl font-extrabold tracking-wide',
                clasificacion === 'tautologia' && 'text-emerald-600',
                clasificacion === 'contradiccion' && 'text-red-600',
                clasificacion === 'contingencia' && 'text-amber-600',
              ]"
            >
              {{ textoClasificacion }}
            </p>
            <p class="text-xs text-neutral-500 mt-1 leading-relaxed">{{ explicacionClasificacion }}</p>
            <hr class="my-3 border-neutral-200" />
            <p class="text-sm text-neutral-700">
              Es verdadera (V) en
              <strong>{{ conteoClasificacion?.verdaderas }} de {{ conteoClasificacion?.total }}</strong>
              combinaciones posibles.
            </p>
          </div>
        </Card>
      </div>

      <!-- Truth Table -->
      <Card v-if="resultado">
        <h3 class="text-sm font-bold text-neutral-700 mb-4">Tabla de verdad</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-center text-sm">
            <thead>
              <tr>
                <th
                  v-for="v in resultado.variables"
                  :key="v"
                  class="bg-blue-50 px-3 py-2.5 font-bold text-neutral-700"
                >
                  {{ v }}
                </th>
                <th
                  v-for="(_sub, idx) in resultado.subExpresiones"
                  :key="'sub-' + idx"
                  class="bg-blue-50 px-3 py-2.5 font-bold text-neutral-700"
                >
                  {{ resultado.filas[0].pasos[idx].etiqueta }}
                </th>
                <th class="bg-blue-100 px-3 py-2.5 font-bold text-neutral-700">Resultado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fila, rIdx) in resultado.filas" :key="rIdx">
                <td
                  v-for="v in resultado.variables"
                  :key="v"
                  :class="[claseCelda(fila.asignacion[v]), 'px-3 py-2 border-b border-neutral-100']"
                >
                  {{ fila.asignacion[v] ? 'V' : 'F' }}
                </td>
                <td
                  v-for="(_sub, idx) in resultado.subExpresiones"
                  :key="'val-' + idx"
                  :class="[claseCelda(fila.pasos[idx].valor), 'px-3 py-2 border-b border-neutral-100']"
                >
                  {{ fila.pasos[idx].valor ? 'V' : 'F' }}
                </td>
                <td
                  :class="[claseCelda(fila.resultado), 'px-3 py-2 border-b border-neutral-100 bg-blue-50/50 font-extrabold']"
                >
                  {{ fila.resultado ? 'V' : 'F' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- Explanation -->
      <Card v-if="resultado">
        <div class="flex items-center gap-2 mb-3">
          <InfoIcon class="w-5 h-5 text-blue-600" />
          <h3 class="text-sm font-bold text-neutral-700">¿Cómo se resolvió?</h3>
        </div>
        <ol class="list-decimal list-inside text-sm text-neutral-700 space-y-1 mb-4">
          <li v-for="paso in pasosExplicacion" :key="paso.index">{{ paso.texto }}</li>
          <li v-if="pasosExplicacion.length === 0">
            La expresión ya es una variable simple, así que su valor se toma directamente.
          </li>
        </ol>
        <button
          class="border border-blue-600 text-blue-600 rounded-lg px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 hover:bg-blue-50 transition-all"
          @click="mostrarExplicacion = !mostrarExplicacion"
        >
          {{ mostrarExplicacion ? 'Ocultar explicación' : 'Ver explicación paso a paso' }}
        </button>
        <div v-if="mostrarExplicacion" class="mt-4 text-sm text-neutral-500 bg-neutral-50 rounded-lg p-4 leading-relaxed">
          Primero se evalúan las subexpresiones más internas y luego se combinan siguiendo la precedencia:
          ¬ &gt; ∧ &gt; ∨ &gt; → &gt; ↔. Cada fila de la tabla repite este proceso con una combinación distinta
          de valores de verdad para las variables activas.
        </div>
      </Card>

      <p class="text-center text-sm text-neutral-400 bg-white rounded-xl py-3 px-4">
        Puedes activar o desactivar variables y usar los operadores para construir tu proposición.
      </p>
    </div>
  </section>
</template>
