<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  evaluarCuantificador,
  parsearDominio,
  obtenerPredicados,
  evaluarExpresionPredicado,
  type TipoCuantificador,
  type ResultadoCuantificador,
} from '@/lib/cuantificadores/engine'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

const tipoCuantificador = ref<TipoCuantificador>('forall')
const dominioRaw = ref('1, 2, 3, 4, 5')
const predicadoSeleccionado = ref('esPar')
const expresionLibre = ref('x % 2 === 0')
const usarExpresionLibre = ref(false)
const resultado = ref<ResultadoCuantificador | null>(null)

const predicados = obtenerPredicados()

const SIMBOLOS = ['∀', '∃', '∈', '→', '∧', '∨', '¬', '≡', '∴']

function insertarSimbolo(sym: string) {
  if (usarExpresionLibre.value) {
    expresionLibre.value += ` ${sym} `
  } else {
    dominioRaw.value += ` ${sym}`
  }
}

function evaluar() {
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
</script>

<template>
  <section class="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-mono font-bold text-2xl">
            ∀∃
          </div>
          <div>
            <h1 class="text-2xl font-bold">Cuantificadores Lógicos</h1>
            <p class="text-blue-100 text-sm mt-1">Evalúa cuantificadores ∀ y ∃ sobre dominios finitos</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Panel -->
        <div class="lg:col-span-5 space-y-4">
          <!-- Cuantificador -->
          <Card>
            <h3 class="text-sm font-bold text-neutral-700 mb-3">Cuantificador Lógico</h3>
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
                <span class="text-xl font-bold font-mono">∀</span> Universal
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
                <span class="text-xl font-bold font-mono">∃</span> Existencial
              </button>
            </div>
          </Card>

          <!-- Dominio -->
          <Card>
            <h3 class="text-sm font-bold text-neutral-700 mb-2">Dominio de Discurso D</h3>
            <input
              v-model="dominioRaw"
              type="text"
              placeholder="1, 2, 3, 4, 5"
              class="w-full bg-neutral-100 border-none rounded-xl px-4 py-2.5 text-sm font-mono text-neutral-900 focus:outline-2 focus:outline-blue-500"
            />
            <p class="text-xs text-neutral-400 mt-1">
              Lista: <code class="text-neutral-500">1, 2, 3</code> · Rango: <code class="text-neutral-500">0 &lt; x &lt; 9</code>
            </p>
          </Card>

          <!-- Predicado -->
          <Card>
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-bold text-neutral-700">Predicado P(x)</h3>
              <label class="flex items-center gap-2 cursor-pointer">
                <span class="text-xs text-neutral-500">Libre</span>
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
              placeholder="x % 2 === 0"
              class="w-full bg-neutral-100 border-none rounded-xl px-4 py-2.5 text-sm font-mono text-neutral-900 focus:outline-2 focus:outline-blue-500"
            />
            <p v-if="usarExpresionLibre" class="text-xs text-neutral-400 mt-1">
              Usa <code>x</code> como variable. Operadores: <code>%, ===, !==, &&, ||</code>
            </p>
          </Card>

          <!-- Símbolos -->
          <Card>
            <h3 class="text-sm font-bold text-neutral-700 mb-3">Símbolos Rápidos</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="sym in SIMBOLOS"
                :key="sym"
                class="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 font-mono font-bold text-neutral-600 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-700 transition-all text-center"
                @click="insertarSimbolo(sym)"
              >
                {{ sym }}
              </button>
            </div>
          </Card>

          <!-- Botones -->
          <div class="flex flex-col gap-3">
            <Button class="w-full" @click="evaluar">Evaluar Cuantificador</Button>
            <div class="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="sm" @click="cargarEjemplo">Ejemplo simple</Button>
              <Button variant="secondary" size="sm" @click="cargarEjemploRango">Ejemplo rango</Button>
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
                  {{ resultado.resultado ? 'VERDADERO (V)' : 'FALSO (F)' }}
                </Badge>
                <span class="font-mono text-lg font-bold text-neutral-800">
                  {{ resultado.tipo === 'forall' ? '∀' : '∃' }}x P(x)
                </span>
              </div>
              <p class="text-sm text-neutral-700 mt-2 leading-relaxed">{{ resultado.resumen }}</p>
              <div
                v-if="resultado.contraejemplo !== undefined"
                class="mt-3 p-3 rounded-lg bg-red-100 border border-red-200 text-xs font-mono text-red-700"
              >
                Contraejemplo: x = {{ resultado.contraejemplo }} hace que P({{ resultado.contraejemplo }}) sea Falso.
              </div>
              <div
                v-if="resultado.testigo !== undefined"
                class="mt-3 p-3 rounded-lg bg-emerald-100 border border-emerald-200 text-xs font-mono text-emerald-700"
              >
                Testigo: x = {{ resultado.testigo }} satisface P({{ resultado.testigo }}).
              </div>
            </div>
          </Card>

          <!-- Trazabilidad -->
          <Card v-if="resultado">
            <div class="flex items-center justify-between mb-3 border-b border-neutral-200 pb-2">
              <h3 class="text-sm font-bold text-neutral-700">Trazabilidad por Elemento</h3>
              <span class="text-xs text-neutral-400 font-mono">|D| = {{ resultado.dominio.length }}</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-neutral-200 text-neutral-500">
                    <th class="py-2 px-3 font-semibold">Elemento x</th>
                    <th class="py-2 px-3 font-semibold">Evaluación</th>
                    <th class="py-2 px-3 font-semibold">Resultado</th>
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
              Leyes de De Morgan para Cuantificadores
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
              Resolutor Paso a Paso
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
    </div>
  </section>
</template>
