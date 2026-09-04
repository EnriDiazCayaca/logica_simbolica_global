<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import {
  union, interseccion, diferencia, complemento,
  potencia, verificarPertenencia, sonDisjuntos, esSubconjunto
} from '@/lib/sets/operations'
import { siteContent } from '@/content'

const t = siteContent.conjuntos
const modoLiteral = t.modoLiteral

// --- Estado reactivo ---
const universoInput = ref('1, 2, 3, 4, 5, 6, 7, 8, 9, 10')
const conjuntoAInput = ref('1, 2, 3, 4')
const conjuntoBInput = ref('3, 4, 5, 6')
const operacionSeleccionada = ref<string>('union')
const potenciaTarget = ref<string>('A')
const elementoPertenencia = ref('')

function labelForOp(op: any): string {
  return modoLiteral ? op.labelLiteral : op.label
}

// --- Parseo de inputs a Set ---
function parsearConjunto(input: string): Set<string> {
  if (!input.trim()) return new Set()
  return new Set(
    input.split(',').map(e => e.trim()).filter(e => e !== '')
  )
}

const U = computed(() => parsearConjunto(universoInput.value))
const A = computed(() => parsearConjunto(conjuntoAInput.value))
const B = computed(() => parsearConjunto(conjuntoBInput.value))

// --- Regiones del Diagrama de Venn ---
const soloA = computed(() => diferencia(A.value, B.value))
const soloB = computed(() => diferencia(B.value, A.value))
const ambos = computed(() => interseccion(A.value, B.value))
const soloU = computed(() => diferencia(U.value, union(A.value, B.value)))
const esDisjuntoGrafico = computed(() => sonDisjuntos(A.value, B.value))

// --- Opciones de Selección de Potencia P(...) ---
const opcionesPotencia = computed(() => t.operaciones.potenciaOpciones.map(o => ({ key: o.key, label: labelForOp(o), desc: o.desc })))
const operaciones = computed(() => t.operaciones.items.map(o => ({ key: o.key, label: labelForOp(o), desc: o.desc })))

// --- Conjunto base dinámico para Potencia ---
const conjuntoBasePotencia = computed(() => {
  switch (potenciaTarget.value) {
    case 'A': return A.value
    case 'B': return B.value
    case 'union': return union(A.value, B.value)
    case 'interseccion': return interseccion(A.value, B.value)
    case 'diferencia-ab': return diferencia(A.value, B.value)
    case 'diferencia-ba': return diferencia(B.value, A.value)
    case 'comp-a': return complemento(U.value, A.value)
    case 'comp-b': return complemento(U.value, B.value)
    default: return A.value
  }
})

// --- Resultado de la operación ---
const resultado = computed(() => {
  switch (operacionSeleccionada.value) {
    case 'union': return union(A.value, B.value)
    case 'interseccion': return interseccion(A.value, B.value)
    case 'diferencia': return diferencia(A.value, B.value)
    case 'diferencia-ba': return diferencia(B.value, A.value)
    case 'complemento-a': return complemento(U.value, A.value)
    case 'complemento-b': return complemento(U.value, B.value)
    case 'potencia': return potencia(conjuntoBasePotencia.value)
    default: return new Set()
  }
})

const totalSubconjuntos = computed(() => {
  if (operacionSeleccionada.value === 'potencia') {
    const baseSet = conjuntoBasePotencia.value
    return Math.pow(2, baseSet.size)
  }
  return 0
})

const resultadoTexto = computed(() => {
  if (operacionSeleccionada.value === 'potencia') {
    const baseSet = conjuntoBasePotencia.value
    if (baseSet.size > 10) {
      return t.resultado.advertenciaPotencia.replace('{n}', String(baseSet.size)).replace('{n}', String(baseSet.size)).replace('{total}', String(Math.pow(2, baseSet.size)))
    }
    const p = potencia(baseSet)
    const partes: string[] = []
    p.forEach(sub => {
      partes.push(`{${[...sub].join(', ')}}`)
    })
    return `{ ${partes.join(', ')} }`
  }
  return `{ ${[...resultado.value].join(', ')} }`
})

// --- Propiedades ---
const propiedades = computed(() => {
  const labels = t.propiedades.items
  const find = (k: string) => labels.find(x => x.key === k)
  return [
    { nombre: modoLiteral ? (find('subAB')?.labelLiteral ?? 'A ⊆ B') : (find('subAB')?.label ?? 'A ⊆ B'), valor: esSubconjunto(A.value, B.value) },
    { nombre: modoLiteral ? (find('subBA')?.labelLiteral ?? 'B ⊆ A') : (find('subBA')?.label ?? 'B ⊆ A'), valor: esSubconjunto(B.value, A.value) },
    { nombre: modoLiteral ? (find('igual')?.labelLiteral ?? 'A = B') : (find('igual')?.label ?? 'A = B'), valor: esSubconjunto(A.value, B.value) && esSubconjunto(B.value, A.value) },
    { nombre: modoLiteral ? (find('disjuntos')?.labelLiteral ?? 'Disjuntos') : (find('disjuntos')?.label ?? 'Disjuntos'), valor: sonDisjuntos(A.value, B.value) },
  ]
})

const pertenenciaResultado = computed(() => {
  if (!elementoPertenencia.value.trim()) return null
  const el = elementoPertenencia.value.trim()
  return {
    enA: verificarPertenencia(el, A.value),
    enB: verificarPertenencia(el, B.value),
    enU: verificarPertenencia(el, U.value),
  }
})

// --- Colores y Estilos del Diagrama de Venn según Operación ---
const vennColores = computed(() => {
  const op = operacionSeleccionada.value

  const base = {
    soloA: 'fill-blue-100/70 stroke-blue-400',
    soloB: 'fill-indigo-100/70 stroke-indigo-400',
    interseccion: 'fill-slate-200/60 opacity-60',
    universo: 'fill-slate-50 stroke-slate-300'
  }

  switch (op) {
    case 'union':
      return {
        soloA: 'fill-blue-400/85 stroke-blue-600 opacity-90',
        soloB: 'fill-blue-400/85 stroke-indigo-600 opacity-90',
        interseccion: 'fill-blue-400/85 opacity-90',
        universo: 'fill-slate-50 stroke-slate-300'
      }
    case 'interseccion':
      return {
        soloA: 'fill-blue-50/40 stroke-blue-300 opacity-40',
        soloB: 'fill-indigo-50/40 stroke-indigo-300 opacity-40',
        interseccion: 'fill-teal-500 opacity-100',
        universo: 'fill-slate-50 stroke-slate-300'
      }
    case 'diferencia':
      return {
        soloA: 'fill-blue-400/90 stroke-blue-600',
        soloB: 'fill-indigo-50/30 stroke-indigo-300 opacity-30',
        interseccion: 'fill-white opacity-100',
        universo: 'fill-slate-50 stroke-slate-300'
      }
    case 'diferencia-ba':
      return {
        soloA: 'fill-blue-50/30 stroke-blue-300 opacity-30',
        soloB: 'fill-indigo-400/90 stroke-indigo-600',
        interseccion: 'fill-white opacity-100',
        universo: 'fill-slate-50 stroke-slate-300'
      }
    case 'complemento-a':
      return {
        soloA: 'fill-white stroke-slate-300 opacity-100',
        soloB: 'fill-sky-300/70 stroke-sky-500 opacity-100',
        interseccion: 'fill-white opacity-100',
        universo: 'fill-sky-300/70 stroke-sky-500'
      }
    case 'complemento-b':
      return {
        soloA: 'fill-sky-300/70 stroke-sky-500 opacity-100',
        soloB: 'fill-white stroke-slate-300 opacity-100',
        interseccion: 'fill-white opacity-100',
        universo: 'fill-sky-300/70 stroke-sky-500'
      }
    case 'potencia': {
      switch (potenciaTarget.value) {
        case 'A':
          return {
            soloA: 'fill-blue-400/85 stroke-blue-600 opacity-90',
            soloB: 'fill-indigo-50/30 stroke-indigo-300 opacity-30',
            interseccion: 'fill-blue-400/85 opacity-90',
            universo: 'fill-slate-50 stroke-slate-300'
          }
        case 'B':
          return {
            soloA: 'fill-blue-50/30 stroke-blue-300 opacity-30',
            soloB: 'fill-indigo-400/85 stroke-indigo-600 opacity-90',
            interseccion: 'fill-indigo-400/85 opacity-90',
            universo: 'fill-slate-50 stroke-slate-300'
          }
        case 'union':
          return {
            soloA: 'fill-blue-400/85 stroke-blue-600 opacity-90',
            soloB: 'fill-blue-400/85 stroke-indigo-600 opacity-90',
            interseccion: 'fill-blue-400/85 opacity-90',
            universo: 'fill-slate-50 stroke-slate-300'
          }
        case 'interseccion':
          return {
            soloA: 'fill-blue-50/40 stroke-blue-300 opacity-40',
            soloB: 'fill-indigo-50/40 stroke-indigo-300 opacity-40',
            interseccion: 'fill-teal-500 opacity-100',
            universo: 'fill-slate-50 stroke-slate-300'
          }
        case 'diferencia-ab':
          return {
            soloA: 'fill-blue-400/90 stroke-blue-600',
            soloB: 'fill-indigo-50/30 stroke-indigo-300 opacity-30',
            interseccion: 'fill-white opacity-100',
            universo: 'fill-slate-50 stroke-slate-300'
          }
        case 'diferencia-ba':
          return {
            soloA: 'fill-blue-50/30 stroke-blue-300 opacity-30',
            soloB: 'fill-indigo-400/90 stroke-indigo-600',
            interseccion: 'fill-white opacity-100',
            universo: 'fill-slate-50 stroke-slate-300'
          }
        case 'comp-a':
          return {
            soloA: 'fill-white stroke-slate-300 opacity-100',
            soloB: 'fill-sky-300/70 stroke-sky-500 opacity-100',
            interseccion: 'fill-white opacity-100',
            universo: 'fill-sky-300/70 stroke-sky-500'
          }
        case 'comp-b':
          return {
            soloA: 'fill-sky-300/70 stroke-sky-500 opacity-100',
            soloB: 'fill-white stroke-slate-300 opacity-100',
            interseccion: 'fill-white opacity-100',
            universo: 'fill-sky-300/70 stroke-sky-500'
          }
        default:
          return base
      }
    }
    default:
      return base
  }
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 p-4 md:p-8">
    <div class="max-w-5xl mx-auto space-y-6">

      <!-- Encabezado -->
      <div class="flex items-center justify-between">
        <router-link to="/" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline">
          {{ t.navegacion.volver }}
        </router-link>
        <span class="text-xs font-semibold px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full">
          {{ t.navegacion.badge }}
        </span>
      </div>

      <!-- Título -->
      <div class="text-center space-y-1">
        <h1 class="text-3xl font-extrabold text-neutral-900 tracking-tight">
          {{ t.header.titulo }}
        </h1>
        <p class="text-neutral-500 text-sm">{{ t.header.subtitulo }}</p>
      </div>

      <!-- Inputs -->
      <Card>
        <div class="space-y-4">
          <h2 class="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">{{ t.define.titulo }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t.define.universo }}</label>
              <input
                v-model="universoInput"
                class="w-full px-3 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                :placeholder="t.define.placeholders.universo"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-1 font-semibold">{{ t.define.conjuntoA }}</label>
              <input
                v-model="conjuntoAInput"
                class="w-full px-3 py-2 border border-blue-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/20"
                :placeholder="t.define.placeholders.a"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-indigo-700 mb-1 font-semibold">{{ t.define.conjuntoB }}</label>
              <input
                v-model="conjuntoBInput"
                class="w-full px-3 py-2 border border-indigo-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50/20"
                :placeholder="t.define.placeholders.b"
              />
            </div>
          </div>
        </div>
      </Card>

      <!-- Operaciones -->
      <Card>
        <h2 class="text-lg font-bold text-neutral-900 mb-3 border-b border-neutral-100 pb-2">{{ t.operaciones.titulo }}</h2>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="op in operaciones"
            :key="op.key"
            :variant="operacionSeleccionada === op.key ? 'primary' : 'secondary'"
            size="sm"
            @click="operacionSeleccionada = op.key"
          >
            {{ op.label }}
          </Button>
        </div>

        <!-- Sub-selector para Conjunto Potencia P( ... ) -->
        <div v-if="operacionSeleccionada === 'potencia'" class="mt-4 pt-3 border-t border-neutral-100 space-y-2">
          <label class="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
            {{ t.operaciones.selectorPotenciaLabel }}
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opP in opcionesPotencia"
              :key="opP.key"
              @click="potenciaTarget = opP.key"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer',
                potenciaTarget === opP.key
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              ]"
            >
              {{ opP.label }}
            </button>
          </div>
        </div>
      </Card>

      <!-- Diagrama y Resultado -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Diagrama de Venn -->
        <Card>
          <div class="flex items-center justify-between mb-3 border-b border-neutral-100 pb-2">
            <h2 class="text-lg font-bold text-neutral-900">{{ t.diagrama.titulo }}</h2>
          </div>

          <svg viewBox="0 0 400 270" class="w-full h-auto drop-shadow-xs">
            <!-- Rectángulo Universo U -->
            <rect
              x="10" y="10" width="380" height="250" rx="12"
              :class="vennColores.universo"
              stroke-width="2" stroke-dasharray="6 4"
            />
            <text x="28" y="38" class="fill-slate-700 text-sm font-extrabold select-none">U</text>

            <!-- CASO A: CONJUNTOS DISJUNTOS (Círculos separados sin intersección) -->
            <g v-if="esDisjuntoGrafico">
              <circle
                cx="115" cy="135" r="65"
                :class="vennColores.soloA"
                stroke-width="2.5"
              />
              <circle
                cx="285" cy="135" r="65"
                :class="vennColores.soloB"
                stroke-width="2.5"
              />
              <text x="115" y="52" text-anchor="middle" class="fill-blue-700 text-base font-extrabold select-none">A</text>
              <text x="285" y="52" text-anchor="middle" class="fill-indigo-700 text-base font-extrabold select-none">B</text>
              <text x="115" y="140" text-anchor="middle" class="fill-neutral-900 text-xs font-bold select-none">
                {{ [...soloA].join(', ') || '∅' }}
              </text>
              <text x="285" y="140" text-anchor="middle" class="fill-neutral-900 text-xs font-bold select-none">
                {{ [...soloB].join(', ') || '∅' }}
              </text>
            </g>

            <!-- CASO B: CONJUNTOS CON INTERSECCIÓN (Círculos solapados) -->
            <g v-else>
              <circle
                cx="145" cy="135" r="75"
                :class="vennColores.soloA"
                stroke-width="2.5"
              />
              <circle
                cx="255" cy="135" r="75"
                :class="vennColores.soloB"
                stroke-width="2.5"
              />
              <clipPath id="clipA">
                <circle cx="145" cy="135" r="75" />
              </clipPath>
              <circle
                cx="255" cy="135" r="75"
                :class="vennColores.interseccion"
                clip-path="url(#clipA)"
              />
              <text x="100" y="48" class="fill-blue-700 text-base font-extrabold select-none">A</text>
              <text x="300" y="48" class="fill-indigo-700 text-base font-extrabold select-none">B</text>
              <text x="105" y="140" text-anchor="middle" class="fill-neutral-900 text-xs font-bold select-none">
                {{ [...soloA].join(', ') }}
              </text>
              <text x="200" y="140" text-anchor="middle" class="fill-neutral-900 text-xs font-extrabold select-none">
                {{ [...ambos].join(', ') }}
              </text>
              <text x="295" y="140" text-anchor="middle" class="fill-neutral-900 text-xs font-bold select-none">
                {{ [...soloB].join(', ') }}
              </text>
            </g>

            <!-- Elementos en Universo fuera de A y B -->
            <g transform="translate(25, 242)">
              <text class="fill-slate-600 text-xs font-semibold select-none">
                U: {{ [...soloU].length > 0 ? '{ ' + [...soloU].join(', ') + ' }' : '∅' }}
              </text>
            </g>
          </svg>
        </Card>

        <!-- Resultado -->
        <div class="space-y-4">
          <Card>
            <h2 class="text-lg font-bold text-neutral-900 mb-2 border-b border-neutral-100 pb-2">{{ t.resultado.titulo }}</h2>
            <p class="text-sm text-neutral-600 mb-2">
              <template v-if="operacionSeleccionada === 'potencia'">
                {{ opcionesPotencia.find(p => p.key === potenciaTarget)?.desc }}:
                <strong class="text-blue-700 font-mono">{{ opcionesPotencia.find(p => p.key === potenciaTarget)?.label }}</strong>
              </template>
              <template v-else>
                {{ operaciones.find(o => o.key === operacionSeleccionada)?.desc }}:
                <strong class="text-blue-700 font-mono">{{ operaciones.find(o => o.key === operacionSeleccionada)?.label }}</strong>
              </template>
            </p>
            <div class="bg-blue-50/70 border border-blue-200 text-blue-950 font-mono text-sm font-semibold rounded-xl p-4 break-all shadow-xs">
              {{ resultadoTexto }}
            </div>

            <!-- Total de subconjuntos en un recuadro independiente -->
            <div v-if="operacionSeleccionada === 'potencia'" class="mt-3 p-3 bg-blue-100/60 border border-blue-200 rounded-xl flex items-center justify-between">
              <span class="text-xs font-bold text-blue-900">{{ t.resultado.totalSubconjuntos }}</span>
              <span class="text-xs font-extrabold px-2.5 py-1 bg-blue-600 text-white rounded-lg font-mono shadow-2xs">
                {{ totalSubconjuntos }} {{ t.resultado.subconjuntosLabel }}
              </span>
            </div>
          </Card>

          <!-- Propiedades -->
          <Card>
            <h2 class="text-lg font-bold text-neutral-900 mb-3 border-b border-neutral-100 pb-2">{{ t.propiedades.titulo }}</h2>
            <div class="space-y-2.5">
              <div v-for="prop in propiedades" :key="prop.nombre" class="flex items-center justify-between py-1 border-b border-neutral-50 last:border-0">
                <span class="text-sm font-medium text-neutral-700">{{ prop.nombre }}</span>
                <Badge :variant="prop.valor ? 'green' : 'red'">
                  {{ prop.valor ? 'Sí' : 'No' }}
                </Badge>
              </div>
            </div>
          </Card>

          <!-- Pertenencia -->
          <Card>
            <h2 class="text-lg font-bold text-neutral-900 mb-3 border-b border-neutral-100 pb-2">{{ t.pertenencia.titulo }}</h2>
            <div class="flex gap-2">
              <input
                v-model="elementoPertenencia"
                class="flex-1 px-3 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="t.pertenencia.placeholder"
              />
            </div>
            <div v-if="pertenenciaResultado" class="mt-3 pt-2 border-t border-neutral-100">
              <div class="flex items-center gap-2 text-sm">
                <Badge :variant="pertenenciaResultado.enA ? 'green' : 'red'">
                  {{ pertenenciaResultado.enA ? '∈ A' : '∉ A' }}
                </Badge>
                <Badge :variant="pertenenciaResultado.enB ? 'green' : 'red'">
                  {{ pertenenciaResultado.enB ? '∈ B' : '∉ B' }}
                </Badge>
                <Badge :variant="pertenenciaResultado.enU ? 'green' : 'red'">
                  {{ pertenenciaResultado.enU ? '∈ U' : '∉ U' }}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

    </div>
  </div>
</template>
