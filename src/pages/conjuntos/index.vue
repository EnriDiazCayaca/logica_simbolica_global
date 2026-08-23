<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import {
  union, interseccion, diferencia, complemento,
  potencia, verificarPertenencia, sonDisjuntos, esSubconjunto
} from '@/lib/sets/operations'

// --- Estado reactivo ---
const universoInput = ref('1, 2, 3, 4, 5, 6, 7, 8, 9, 10')
const conjuntoAInput = ref('1, 2, 3, 4')
const conjuntoBInput = ref('3, 4, 5, 6')
const operacionSeleccionada = ref<string>('union')
const elementoPertenencia = ref('')

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

// --- Resultado de la operación ---
const resultado = computed(() => {
  switch (operacionSeleccionada.value) {
    case 'union': return union(A.value, B.value)
    case 'interseccion': return interseccion(A.value, B.value)
    case 'diferencia': return diferencia(A.value, B.value)
    case 'diferencia-ba': return diferencia(B.value, A.value)
    case 'complemento-a': return complemento(U.value, A.value)
    case 'complemento-b': return complemento(U.value, B.value)
    case 'potencia-a': return potencia(A.value)
    default: return new Set()
  }
})

const resultadoTexto = computed(() => {
  if (operacionSeleccionada.value === 'potencia-a') {
    const p = potencia(A.value)
    const partes: string[] = []
    p.forEach(sub => {
      partes.push(`{${[...sub].join(', ')}}`)
    })
    return `{ ${partes.join(', ')} }  (${p.size} subconjuntos)`
  }
  return `{ ${[...resultado.value].join(', ')} }`
})

// --- Propiedades ---
const propiedades = computed(() => [
  { nombre: 'A ⊆ B', valor: esSubconjunto(A.value, B.value) },
  { nombre: 'B ⊆ A', valor: esSubconjunto(B.value, A.value) },
  { nombre: 'A = B', valor: esSubconjunto(A.value, B.value) && esSubconjunto(B.value, A.value) },
  { nombre: 'Disjuntos', valor: sonDisjuntos(A.value, B.value) },
])

const pertenenciaResultado = computed(() => {
  if (!elementoPertenencia.value.trim()) return null
  const el = elementoPertenencia.value.trim()
  return {
    enA: verificarPertenencia(el, A.value),
    enB: verificarPertenencia(el, B.value),
    enU: verificarPertenencia(el, U.value),
  }
})

// --- Regiones del Venn ---
const soloA = computed(() => diferencia(A.value, B.value))
const soloB = computed(() => diferencia(B.value, A.value))
const ambos = computed(() => interseccion(A.value, B.value))

// --- Colores del diagrama según la operación ---
const vennColores = computed(() => {
  const op = operacionSeleccionada.value
  const resaltado = 'fill-blue-500 opacity-60'
  const normal = 'fill-blue-200 opacity-40'
  switch (op) {
    case 'union': return { izq: resaltado, der: resaltado, centro: resaltado }
    case 'interseccion': return { izq: normal, der: normal, centro: resaltado }
    case 'diferencia': return { izq: resaltado, der: normal, centro: normal }
    case 'diferencia-ba': return { izq: normal, der: resaltado, centro: normal }
    case 'complemento-a': return { izq: normal, der: resaltado, centro: normal }
    case 'complemento-b': return { izq: resaltado, der: normal, centro: normal }
    default: return { izq: normal, der: normal, centro: normal }
  }
})

const operaciones = [
  { key: 'union', label: 'A ∪ B', desc: 'Unión' },
  { key: 'interseccion', label: 'A ∩ B', desc: 'Intersección' },
  { key: 'diferencia', label: 'A − B', desc: 'Diferencia' },
  { key: 'diferencia-ba', label: 'B − A', desc: 'Diferencia' },
  { key: 'complemento-a', label: "A'", desc: 'Complemento' },
  { key: 'complemento-b', label: "B'", desc: 'Complemento' },
  { key: 'potencia-a', label: 'P(A)', desc: 'Potencia' },
]
</script>

<template>
  <div class="min-h-screen bg-neutral-50 p-4 md:p-8">
    <div class="max-w-5xl mx-auto space-y-6">

      <!-- Título -->
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold text-neutral-900">
          🔵 Teoría de Conjuntos
        </h1>
        <p class="text-neutral-500">Equipo Linus — Calculadora Interactiva</p>
      </div>

      <!-- Inputs -->
      <Card>
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-neutral-900">📝 Define tus conjuntos</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Universo U</label>
              <input
                v-model="universoInput"
                class="w-full px-3 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1, 2, 3, ..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Conjunto A</label>
              <input
                v-model="conjuntoAInput"
                class="w-full px-3 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1, 2, 3"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Conjunto B</label>
              <input
                v-model="conjuntoBInput"
                class="w-full px-3 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="3, 4, 5"
              />
            </div>
          </div>
        </div>
      </Card>

      <!-- Operaciones -->
      <Card>
        <h2 class="text-lg font-semibold text-neutral-900 mb-3">⚙️ Selecciona una operación</h2>
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
      </Card>

      <!-- Diagrama y Resultado -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Diagrama de Venn -->
        <Card>
          <h2 class="text-lg font-semibold text-neutral-900 mb-3">📊 Diagrama de Venn</h2>
          <svg viewBox="0 0 300 200" class="w-full h-auto">
            <!-- Círculo A (izquierda) -->
            <circle cx="110" cy="100" r="70" :class="vennColores.izq" stroke="#2563eb" stroke-width="2" />
            <!-- Círculo B (derecha) -->
            <circle cx="190" cy="100" r="70" :class="vennColores.der" stroke="#2563eb" stroke-width="2" />

            <!-- Intersección resaltada -->
            <clipPath id="clipA">
              <circle cx="110" cy="100" r="70" />
            </clipPath>
            <circle cx="190" cy="100" r="70" :class="vennColores.centro" clip-path="url(#clipA)" />

            <!-- Etiquetas -->
            <text x="75" y="100" text-anchor="middle" class="fill-neutral-800 text-xs font-semibold">
              {{ [...soloA].join(', ') }}
            </text>
            <text x="150" y="100" text-anchor="middle" class="fill-neutral-900 text-xs font-bold">
              {{ [...ambos].join(', ') }}
            </text>
            <text x="225" y="100" text-anchor="middle" class="fill-neutral-800 text-xs font-semibold">
              {{ [...soloB].join(', ') }}
            </text>

            <!-- Labels A y B -->
            <text x="70" y="30" text-anchor="middle" class="fill-blue-700 text-sm font-bold">A</text>
            <text x="230" y="30" text-anchor="middle" class="fill-blue-700 text-sm font-bold">B</text>
          </svg>
        </Card>

        <!-- Resultado -->
        <div class="space-y-4">
          <Card>
            <h2 class="text-lg font-semibold text-neutral-900 mb-2">✅ Resultado</h2>
            <p class="text-sm text-neutral-600 mb-1">
              {{ operaciones.find(o => o.key === operacionSeleccionada)?.desc }}:
              <strong>{{ operaciones.find(o => o.key === operacionSeleccionada)?.label }}</strong>
            </p>
            <div class="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-blue-800 font-mono text-sm break-all">
              {{ resultadoTexto }}
            </div>
          </Card>

          <!-- Propiedades -->
          <Card>
            <h2 class="text-lg font-semibold text-neutral-900 mb-3">🔍 Propiedades</h2>
            <div class="space-y-2">
              <div v-for="prop in propiedades" :key="prop.nombre" class="flex items-center justify-between">
                <span class="text-sm text-neutral-700">{{ prop.nombre }}</span>
                <Badge :variant="prop.valor ? 'green' : 'red'">
                  {{ prop.valor ? '✅ Sí' : '❌ No' }}
                </Badge>
              </div>
            </div>
          </Card>

          <!-- Pertenencia -->
          <Card>
            <h2 class="text-lg font-semibold text-neutral-900 mb-3">🔎 Verificar pertenencia</h2>
            <div class="flex gap-2">
              <input
                v-model="elementoPertenencia"
                class="flex-1 px-3 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe un elemento..."
              />
            </div>
            <div v-if="pertenenciaResultado" class="mt-3 space-y-1">
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
