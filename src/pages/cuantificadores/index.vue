<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  evaluarCuantificador,
  parsearDominio,
  obtenerPredicados,
  evaluarExpresionPredicado,
  aplicarLeyes,
  type TipoCuantificador,
  type ResultadoCuantificador,
} from '@/lib/cuantificadores/engine'
import { solveFormula as solveFormulaLeyes } from '@/lib/cuantificadores/lawsEngine'
import { parseDomain as parseDomainZ, ExpresionInvalidaError } from '@/lib/cuantificadores/quantifierEngine'
import { LEYES_LOGICAS } from '@/data/logicLaws'
import { siteContent } from '@/content'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

const t = siteContent.cuantificadores
const modoLiteral = t.modoLiteral

const pestanaActiva = ref<'cuantificadores' | 'leyes'>('cuantificadores')

const formulaResolver = ref('¬(A ∧ B)')
const pasosResolucionLeyes = ref<Array<{ ley: string; antes: string; despues: string }>>([])

function resolverAutomatico() {
  try {
    const steps = solveFormulaLeyes(formulaResolver.value)
    pasosResolucionLeyes.value = steps.slice(1).map((s, i) => ({
      ley: s.rule,
      antes: steps[i].formula,
      despues: s.formula,
    }))
    if (pasosResolucionLeyes.value.length === 0) {
      pasosResolucionLeyes.value = aplicarLeyes(formulaResolver.value)
    }
  } catch {
    pasosResolucionLeyes.value = aplicarLeyes(formulaResolver.value)
  }
}

function cargarEjemploLeyes() {
  formulaResolver.value = '¬(p ∧ q) ↔ r'
  resolverAutomatico()
}

onMounted(() => {
  resolverAutomatico()
})

const tipoCuantificador = ref<TipoCuantificador>('forall')
const dominioRaw = ref('1, 2, 3, 4, 5')
const predicadoSeleccionado = ref('esPar')
const expresionLibre = ref('x % 2 === 0')
const usarExpresionLibre = ref(false)
const resultado = ref<ResultadoCuantificador | null>(null)

const predicados = obtenerPredicados()

const SIMBOLOS = computed(() => modoLiteral ? t.simbolosLiteral : t.simbolos)
const errorDominio = ref('')

function insertarSimbolo(sym: string) {
  // Cuando es modo literal, insertamos el símbolo formal igualmente para que el parser lo entienda,
  // pero mostramos literal en UI. Mapeamos literal -> simbolo formal
  const idx = t.simbolosLiteral.indexOf(sym)
  const simboloFormal = idx >= 0 ? t.simbolos[idx] : sym
  const aInsertar = modoLiteral ? simboloFormal : sym
  if (usarExpresionLibre.value) {
    expresionLibre.value += ` ${aInsertar} `
  } else {
    dominioRaw.value += ` ${aInsertar}`
  }
}

function evaluar() {
  errorDominio.value = ''
  try {
    parseDomainZ(dominioRaw.value)
  } catch (e) {
    if (e instanceof ExpresionInvalidaError) {
      errorDominio.value = e.message
    }
  }
  const dominio = parsearDominio(dominioRaw.value)

  if (usarExpresionLibre.value) {
    const fn = (x: string) => evaluarExpresionPredicado(expresionLibre.value, x)
    resultado.value = evaluarCuantificador(tipoCuantificador.value, dominio, fn, 'expresión libre', expresionLibre.value)
  } else {
    const pred = predicados[predicadoSeleccionado.value] || predicados.esPar
    resultado.value = evaluarCuantificador(tipoCuantificador.value, dominio, pred.fn, pred.descripcion)
  }
}

function cargarEjemplo() {
  tipoCuantificador.value = 'forall'
  dominioRaw.value = '2, 4, 6, 8'
  usarExpresionLibre.value = false
  predicadoSeleccionado.value = 'esPar'
  evaluar()
}

function cargarEjemploRango() {
  tipoCuantificador.value = 'forall'
  dominioRaw.value = '0 < x < 9'
  usarExpresionLibre.value = true
  expresionLibre.value = 'x % 2 === 0'
  evaluar()
}

onMounted(() => {
  evaluar()
})

const headerIcono = computed(() => modoLiteral ? '∀∃' : t.header.icono)
</script>

<template>
  <section class="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-mono font-bold text-2xl">
            {{ headerIcono }}
          </div>
          <div>
            <h1 class="text-2xl font-bold">{{ t.header.titulo }}</h1>
            <p class="text-blue-100 text-sm mt-1">{{ modoLiteral ? t.header.subtituloLiteral : t.header.subtitulo }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-3">
        <button
          :class="[
            'py-3 px-5 rounded-xl font-bold text-sm transition-all',
            pestanaActiva === 'cuantificadores'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-blue-50 text-neutral-700 hover:bg-blue-100'
          ]"
          @click="pestanaActiva = 'cuantificadores'"
        >
          {{ modoLiteral ? t.pestanas.cuantificadoresLiteral : t.pestanas.cuantificadores }}
        </button>
        <button
          :class="[
            'py-3 px-5 rounded-xl font-bold text-sm transition-all',
            pestanaActiva === 'leyes'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-blue-50 text-neutral-700 hover:bg-blue-100'
          ]"
          @click="pestanaActiva = 'leyes'"
        >
          {{ t.pestanas.leyes }}
        </button>
      </div>

      <!-- Contenido: Cuantificadores -->
      <div v-if="pestanaActiva === 'cuantificadores'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Panel -->
        <div class="lg:col-span-5 space-y-4">
          <!-- Cuantificador -->
          <Card>
            <h3 class="text-sm font-bold text-neutral-700 mb-3">{{ t.panelCuantificador.titulo }}</h3>
            <div class="grid grid-cols-2 gap-3">
              <button
                :class="[
                  'py-3 px-4 rounded-xl font-semibold border flex items-center justify-center gap-2 transition-all',
                  tipoCuantificador === 'forall'
                    ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-sm'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100'
                ]"
                @click="tipoCuantificador = 'forall'"
              >
                <span class="text-xl font-bold font-mono">{{ modoLiteral ? '' : '∀' }}</span> {{ modoLiteral ? t.panelCuantificador.universalLiteral : t.panelCuantificador.universal }}
              </button>
              <button
                :class="[
                  'py-3 px-4 rounded-xl font-semibold border flex items-center justify-center gap-2 transition-all',
                  tipoCuantificador === 'exists'
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700 shadow-sm'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100'
                ]"
                @click="tipoCuantificador = 'exists'"
              >
                <span class="text-xl font-bold font-mono">{{ modoLiteral ? '' : '∃' }}</span> {{ modoLiteral ? t.panelCuantificador.existencialLiteral : t.panelCuantificador.existencial }}
              </button>
            </div>
          </Card>

          <!-- Dominio -->
          <Card>
            <h3 class="text-sm font-bold text-neutral-700 mb-2">{{ t.dominio.titulo }} <span class="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-900 text-white">{{ t.dominio.badge }}</span></h3>
            <input
              v-model="dominioRaw"
              type="text"
              :placeholder="t.dominio.placeholder"
              class="w-full bg-neutral-100 border-none rounded-xl px-4 py-2.5 text-sm font-mono text-neutral-900 focus:outline-2 focus:outline-blue-500"
            />
            <p v-if="errorDominio" class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">{{ errorDominio }}</p>
            <p class="text-xs text-neutral-400 mt-1">
              {{ t.dominio.ayuda }}
            </p>
          </Card>

          <!-- Predicado -->
          <Card>
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-bold text-neutral-700">{{ t.predicado.titulo }}</h3>
              <label class="flex items-center gap-2 cursor-pointer">
                <span class="text-xs text-neutral-500">{{ t.predicado.libreLabel }}</span>
                <button
                  type="button"
                  :class="[
                    'relative w-8 h-5 rounded-full transition-colors duration-200',
                    usarExpresionLibre ? 'bg-blue-600' : 'bg-neutral-300'
                  ]"
                  @click="usarExpresionLibre = !usarExpresionLibre"
                >
                  <span
                    :class="[
                      'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
                      usarExpresionLibre && 'translate-x-3'
                    ]"
                  />
                </button>
              </label>
            </div>
            <select
              v-if="!usarExpresionLibre"
              v-model="predicadoSeleccionado"
              class="w-full bg-neutral-100 border-none rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-2 focus:outline-blue-500"
            >
              <option v-for="(pred, clave) in predicados" :key="clave" :value="clave">
                {{ pred.descripcion }}
              </option>
            </select>
            <input
              v-else
              v-model="expresionLibre"
              type="text"
              :placeholder="t.predicado.placeholder"
              class="w-full bg-neutral-100 border-none rounded-xl px-4 py-2.5 text-sm font-mono text-neutral-900 focus:outline-2 focus:outline-blue-500"
            />
            <p v-if="usarExpresionLibre" class="text-xs text-neutral-400 mt-1">
              {{ t.predicado.ayuda }}
            </p>
          </Card>

          <!-- Símbolos -->
          <Card>
            <h3 class="text-sm font-bold text-neutral-700 mb-3">{{ t.simbolosTitulo }}</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="sym in SIMBOLOS"
                :key="sym"
                class="w-auto min-w-9 h-9 px-2 rounded-lg bg-neutral-100 border border-neutral-200 font-mono font-bold text-neutral-600 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-700 transition-all text-center text-xs"
                @click="insertarSimbolo(sym)"
              >
                {{ sym }}
              </button>
            </div>
          </Card>

          <!-- Botones -->
          <div class="flex flex-col gap-3">
            <Button class="w-full" @click="evaluar">{{ t.botones.evaluar }}</Button>
            <div class="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="sm" @click="cargarEjemplo">{{ t.botones.ejemploSimple }}</Button>
              <Button variant="secondary" size="sm" @click="cargarEjemploRango">{{ t.botones.ejemploRango }}</Button>
            </div>
          </div>
        </div>

        <!-- Right Panel -->
        <div class="lg:col-span-7 space-y-4">
          <!-- Resultado -->
          <Card v-if="resultado">
            <div
              :class="[
                'rounded-lg p-5',
                resultado.resultado ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
              ]"
            >
              <div class="flex items-center justify-between mb-2">
                <Badge :variant="resultado.resultado ? 'green' : 'red'">
                  {{ resultado.resultado ? t.resultado.verdadero : t.resultado.falso }}
                </Badge>
                <span class="font-mono text-lg font-bold text-neutral-800">
                  {{ resultado.tipo === 'forall' ? (modoLiteral ? t.resultado.formulaUniversalLiteral : t.resultado.formulaUniversal) : (modoLiteral ? t.resultado.formulaExistencialLiteral : t.resultado.formulaExistencial) }}
                </span>
              </div>
              <p class="text-sm text-neutral-700 mt-2 leading-relaxed">{{ resultado.resumen }}</p>
              <div
                v-if="resultado.contraejemplo !== undefined"
                class="mt-3 p-3 rounded-lg bg-red-100 border border-red-200 text-xs font-mono text-red-700"
              >
                {{ t.resultado.contraejemplo.replace('{x}', String(resultado.contraejemplo)).replace('{x}', String(resultado.contraejemplo)) }}
              </div>
              <div
                v-if="resultado.testigo !== undefined"
                class="mt-3 p-3 rounded-lg bg-emerald-100 border border-emerald-200 text-xs font-mono text-emerald-700"
              >
                {{ t.resultado.testigo.replace('{x}', String(resultado.testigo)).replace('{x}', String(resultado.testigo)) }}
              </div>
            </div>
          </Card>

          <!-- Trazabilidad -->
          <Card v-if="resultado">
            <div class="flex items-center justify-between mb-3 border-b border-neutral-200 pb-2">
              <h3 class="text-sm font-bold text-neutral-700">{{ t.trazabilidad.titulo }}</h3>
              <span class="text-xs text-neutral-400 font-mono">|D| = {{ resultado.dominio.length }}</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-neutral-200 text-neutral-500">
                    <th class="py-2 px-3 font-semibold">{{ t.trazabilidad.elemento }}</th>
                    <th class="py-2 px-3 font-semibold">{{ t.trazabilidad.evaluacion }}</th>
                    <th class="py-2 px-3 font-semibold">{{ t.trazabilidad.resultado }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(paso, idx) in resultado.trazabilidad"
                    :key="idx"
                    class="border-b border-neutral-100 hover:bg-neutral-50"
                  >
                    <td class="py-2 px-3 font-bold text-neutral-700">x = {{ paso.elemento }}</td>
                    <td class="py-2 px-3 text-neutral-500">{{ paso.explicacion }}</td>
                    <td
                      :class="[
                        'py-2 px-3 font-semibold',
                        paso.resultado ? 'text-emerald-600' : 'text-red-600'
                      ]"
                    >
                      {{ paso.resultado ? 'V' : 'F' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <!-- De Morgan -->
          <Card v-if="resultado">
            <h3 class="text-sm font-bold text-indigo-600 mb-2 border-b border-neutral-200 pb-2">
              {{ t.deMorgan.titulo }}
            </h3>
            <p class="text-xs text-neutral-500 mb-3">{{ resultado.deMorgan.regla }}</p>
            <div class="bg-neutral-50 border border-neutral-200 p-4 rounded-lg font-mono text-sm space-y-2">
              <div class="text-neutral-500">
                Original: <span class="text-neutral-800 font-semibold">{{ resultado.deMorgan.original }}</span>
              </div>
              <div class="text-indigo-600 font-bold">
                Equivalente Negado: <span class="text-indigo-700">{{ resultado.deMorgan.negado }}</span>
              </div>
            </div>
          </Card>

          <!-- Resolutor paso a paso -->
          <Card v-if="resultado && resultado.pasosResolucion.length > 0">
            <h3 class="text-sm font-bold text-amber-600 mb-3 border-b border-neutral-200 pb-2">
              {{ t.resolutor.titulo }}
            </h3>
            <div class="space-y-3">
              <div
                v-for="(paso, idx) in resultado.pasosResolucion"
                :key="idx"
                class="bg-amber-50 border border-amber-200 rounded-lg p-3"
              >
                <div class="flex items-center gap-2 mb-1">
                  <Badge variant="yellow">{{ paso.ley }}</Badge>
                  <span class="text-xs text-neutral-400">Paso {{ idx + 1 }}</span>
                </div>
                <p class="text-xs font-mono text-neutral-500 mt-1">Antes: {{ paso.antes }}</p>
                <p class="text-xs font-mono text-amber-700 font-semibold mt-1">Después: {{ paso.despues }}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Contenido: Distribución y Leyes -->
      <div v-if="pestanaActiva === 'leyes'" class="space-y-6">
        <!-- Resolutor interactivo -->
        <Card>
          <h3 class="text-sm font-bold text-amber-600 mb-2">{{ t.leyesHeader.titulo }} <span class="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">{{ t.leyesHeader.badge }}</span></h3>
          <p class="text-xs text-neutral-500 mb-3">
            {{ t.leyesHeader.descripcion }}
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <input
              v-model="formulaResolver"
              type="text"
              :placeholder="t.leyesHeader.placeholder"
              class="flex-1 bg-neutral-100 border-none rounded-xl px-4 py-2.5 text-sm font-mono text-neutral-900 focus:outline-2 focus:outline-blue-500"
            />
            <Button class="sm:w-auto" @click="resolverAutomatico">{{ t.leyesHeader.botonResolver }}</Button>
            <Button variant="secondary" class="sm:w-auto" @click="cargarEjemploLeyes">{{ t.leyesHeader.botonEjemplo }}</Button>
          </div>
          <div v-if="pasosResolucionLeyes.length > 0" class="mt-4 space-y-3">
            <div
              v-for="(paso, idx) in pasosResolucionLeyes"
              :key="idx"
              class="bg-amber-50 border border-amber-200 rounded-lg p-3"
            >
              <div class="flex items-center gap-2 mb-1">
                <Badge variant="yellow">{{ paso.ley }}</Badge>
                <span class="text-xs text-neutral-400">Paso {{ idx + 1 }}</span>
              </div>
              <p class="text-xs font-mono text-neutral-500 mt-1">Antes: {{ paso.antes }}</p>
              <p class="text-xs font-mono text-amber-700 font-semibold mt-1">Después: {{ paso.despues }}</p>
            </div>
            <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800 font-semibold">
              {{ t.leyesHeader.resultadoFinal }} {{ pasosResolucionLeyes[pasosResolucionLeyes.length - 1].despues }}
            </div>
          </div>
          <p v-else class="mt-4 text-xs text-neutral-400">
            {{ t.leyesHeader.vacio }}
          </p>
        </Card>

        <!-- Catálogo de leyes -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card v-for="ley in LEYES_LOGICAS" :key="ley.id">
            <div class="flex items-center gap-2 mb-3">
              <span class="bg-blue-600 text-white text-xs font-bold rounded-md px-2 py-0.5">{{ ley.id }}</span>
              <h3 class="text-sm font-bold text-neutral-900">{{ (modoLiteral && (ley as any).nombreLiteral) ? (ley as any).nombreLiteral : ley.nombre }}</h3>
            </div>
            <p class="text-xs text-neutral-600 leading-relaxed mb-4">{{ (modoLiteral && (ley as any).descripcionFormal) ? (ley as any).descripcionFormal : ley.descripcion }}</p>
            <div class="bg-blue-600 text-white rounded-lg p-3 font-mono text-sm font-semibold space-y-1">
              <p v-for="(formula, idx) in (modoLiteral && (ley as any).formulasLiteral ? (ley as any).formulasLiteral : ley.formulas)" :key="idx" class="m-0">{{ formula }}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>
