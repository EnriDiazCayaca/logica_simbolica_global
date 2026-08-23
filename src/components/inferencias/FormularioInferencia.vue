<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { InferenciaRequest } from '@/types/inferencias'
import Button from '@/components/ui/Button.vue'

const props = defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: InferenciaRequest): void
}>()

const premisasText = ref('')
const conclusionText = ref('')
const premisasRef = ref<HTMLTextAreaElement | null>(null)
const conclusionRef = ref<HTMLInputElement | null>(null)
const lastFocusedField = ref<'premisas' | 'conclusion'>('premisas')

const isFormEmpty = computed(() => {
  return premisasText.value.trim() === '' || conclusionText.value.trim() === ''
})

/**
 * Normaliza símbolos matemáticos o atajos comunes a las palabras clave del motor.
 */
const normalizarSintaxis = (linea: string): string => {
  return linea
    .replace(/<->|<=>|↔|⟺/g, ' SI_Y_SOLO_SI ')
    .replace(/->|=>|→|⟹/g, ' ENTONCES ')
    .replace(/\^|∧|&&/g, ' Y ')
    .replace(/∨|\|\|/g, ' O ')
    .replace(/~|¬|!/g, ' NO ')
    .replace(/⊕|⊻/g, ' O_EXCLUSIVA ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Inserta un token o símbolo en la posición actual del cursor del campo activo.
 */
const insertarToken = (token: string, esVariable = false) => {
  const isPremisas = lastFocusedField.value === 'premisas'
  const inputEl = isPremisas ? premisasRef.value : conclusionRef.value

  if (isPremisas) {
    if (inputEl) {
      const start = inputEl.selectionStart ?? premisasText.value.length
      const end = inputEl.selectionEnd ?? premisasText.value.length
      const before = premisasText.value.substring(0, start)
      const after = premisasText.value.substring(end)

      const needsSpaceBefore = before.length > 0 && !before.endsWith(' ') && !before.endsWith('\n') && token !== ')' && token !== '\n'
      const needsSpaceAfter = after.length > 0 && !after.startsWith(' ') && !after.startsWith('\n') && token !== '(' && token !== '\n'

      const toInsert = (needsSpaceBefore ? ' ' : '') + token + (needsSpaceAfter ? ' ' : '')
      premisasText.value = before + toInsert + after

      nextTick(() => {
        inputEl.focus()
        const newPos = start + toInsert.length
        inputEl.setSelectionRange(newPos, newPos)
      })
    } else {
      premisasText.value += (premisasText.value ? ' ' : '') + token
    }
  } else {
    if (token === '\n') return // No permitir salto de línea en la conclusión

    if (inputEl) {
      const start = inputEl.selectionStart ?? conclusionText.value.length
      const end = inputEl.selectionEnd ?? conclusionText.value.length
      const before = conclusionText.value.substring(0, start)
      const after = conclusionText.value.substring(end)

      const needsSpaceBefore = before.length > 0 && !before.endsWith(' ') && token !== ')'
      const needsSpaceAfter = after.length > 0 && !after.startsWith(' ') && token !== '('

      const toInsert = (needsSpaceBefore ? ' ' : '') + token + (needsSpaceAfter ? ' ' : '')
      conclusionText.value = before + toInsert + after

      nextTick(() => {
        inputEl.focus()
        const newPos = start + toInsert.length
        inputEl.setSelectionRange(newPos, newPos)
      })
    } else {
      conclusionText.value += (conclusionText.value ? ' ' : '') + token
    }
  }
}

/**
 * Carga un ejemplo predefinido para probar inmediatamente.
 */
const cargarEjemplo = (tipo: 'mpp' | 'mtt' | 'sd') => {
  if (tipo === 'mpp') {
    premisasText.value = 'P ENTONCES Q\nP'
    conclusionText.value = 'Q'
  } else if (tipo === 'mtt') {
    premisasText.value = 'P ENTONCES Q\nNO Q'
    conclusionText.value = 'NO P'
  } else if (tipo === 'sd') {
    premisasText.value = 'P O Q\nNO P'
    conclusionText.value = 'Q'
  }
}

const limpiarFormulario = () => {
  premisasText.value = ''
  conclusionText.value = ''
}

const handleSubmit = () => {
  if (isFormEmpty.value || props.isLoading) return

  const premisas = premisasText.value
    .split('\n')
    .map(p => normalizarSintaxis(p))
    .filter(p => p !== '')

  emit('submit', {
    premisas,
    conclusion: normalizarSintaxis(conclusionText.value)
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Ejemplos Rápidos -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        <span>Plantillas y Ejemplos Rápidos</span>
        <button
          type="button"
          @click="limpiarFormulario"
          class="text-neutral-400 hover:text-red-600 transition-colors lowercase"
        >
          limpiar campos
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          @click="cargarEjemplo('mpp')"
          class="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full border border-blue-200 transition-all shadow-xs"
        >
          ⚡ Modus Ponens (P → Q, P ⊢ Q)
        </button>
        <button
          type="button"
          @click="cargarEjemplo('mtt')"
          class="px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full border border-emerald-200 transition-all shadow-xs"
        >
          ⚡ Modus Tollens (P → Q, ¬Q ⊢ ¬P)
        </button>
        <button
          type="button"
          @click="cargarEjemplo('sd')"
          class="px-3 py-1 text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-full border border-amber-200 transition-all shadow-xs"
        >
          ⚡ Silogismo Disyuntivo (P ∨ Q, ¬P ⊢ Q)
        </button>
      </div>
    </div>

    <!-- Botonera de Símbolos y Proposiciones -->
    <div class="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
      <div class="text-xs font-semibold text-neutral-600 flex items-center justify-between">
        <span>Teclado Lógico (haz clic para insertar en el campo activo):</span>
        <span class="text-[11px] font-normal text-blue-600">
          Insertando en: <strong>{{ lastFocusedField === 'premisas' ? 'Premisas' : 'Conclusión' }}</strong>
        </span>
      </div>

      <!-- Fila 1: Variables proposicionales -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="text-xs font-medium text-neutral-400 mr-1">Variables:</span>
        <button
          v-for="v in ['P', 'Q', 'R', 'S', 'T']"
          :key="v"
          type="button"
          @click="insertarToken(v, true)"
          class="h-8 min-w-[32px] px-2.5 bg-white hover:bg-blue-50 text-blue-700 font-bold text-sm rounded-lg border border-neutral-300 shadow-xs hover:border-blue-400 active:scale-95 transition-all"
        >
          {{ v }}
        </button>
      </div>

      <!-- Fila 2: Conectivos y operadores -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="text-xs font-medium text-neutral-400 mr-1">Operadores:</span>
        <button
          type="button"
          @click="insertarToken('NO')"
          title="Negación (NO / ¬)"
          class="h-8 px-2.5 bg-white hover:bg-neutral-100 text-neutral-800 font-medium text-xs rounded-lg border border-neutral-300 shadow-xs active:scale-95 transition-all flex items-center gap-1"
        >
          <span class="font-bold text-red-600 text-sm">¬</span> NO
        </button>
        <button
          type="button"
          @click="insertarToken('Y')"
          title="Conjunción (Y / ∧)"
          class="h-8 px-2.5 bg-white hover:bg-neutral-100 text-neutral-800 font-medium text-xs rounded-lg border border-neutral-300 shadow-xs active:scale-95 transition-all flex items-center gap-1"
        >
          <span class="font-bold text-blue-600 text-sm">∧</span> Y
        </button>
        <button
          type="button"
          @click="insertarToken('O')"
          title="Disyunción (O / ∨)"
          class="h-8 px-2.5 bg-white hover:bg-neutral-100 text-neutral-800 font-medium text-xs rounded-lg border border-neutral-300 shadow-xs active:scale-95 transition-all flex items-center gap-1"
        >
          <span class="font-bold text-amber-600 text-sm">∨</span> O
        </button>
        <button
          type="button"
          @click="insertarToken('ENTONCES')"
          title="Condicional / Implicación (ENTONCES / →)"
          class="h-8 px-2.5 bg-white hover:bg-neutral-100 text-neutral-800 font-medium text-xs rounded-lg border border-neutral-300 shadow-xs active:scale-95 transition-all flex items-center gap-1"
        >
          <span class="font-bold text-emerald-600 text-sm">→</span> ENTONCES
        </button>
        <button
          type="button"
          @click="insertarToken('SI_Y_SOLO_SI')"
          title="Bicondicional (SI_Y_SOLO_SI / ↔)"
          class="h-8 px-2.5 bg-white hover:bg-neutral-100 text-neutral-800 font-medium text-xs rounded-lg border border-neutral-300 shadow-xs active:scale-95 transition-all flex items-center gap-1"
        >
          <span class="font-bold text-purple-600 text-sm">↔</span> SI_Y_SOLO_SI
        </button>
        <button
          type="button"
          @click="insertarToken('(')"
          class="h-8 w-8 bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-sm rounded-lg border border-neutral-300 shadow-xs active:scale-95 transition-all"
        >
          (
        </button>
        <button
          type="button"
          @click="insertarToken(')')"
          class="h-8 w-8 bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-sm rounded-lg border border-neutral-300 shadow-xs active:scale-95 transition-all"
        >
          )
        </button>
        <button
          v-if="lastFocusedField === 'premisas'"
          type="button"
          @click="insertarToken('\n')"
          title="Agregar nueva línea de premisa"
          class="h-8 px-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-medium text-xs rounded-lg shadow-xs active:scale-95 transition-all"
        >
          ↵ Nueva Premisa
        </button>
      </div>
    </div>

    <!-- Campo de Premisas -->
    <div class="space-y-2">
      <label for="premisas" class="block text-sm font-medium text-neutral-700 flex justify-between items-center">
        <span>Premisas (una por cada línea)</span>
        <span class="text-xs text-neutral-400 font-normal">Acepta palabras clave o símbolos (→, ∧, ¬, etc.)</span>
      </label>
      <textarea
        id="premisas"
        ref="premisasRef"
        v-model="premisasText"
        @focus="lastFocusedField = 'premisas'"
        rows="4"
        :disabled="isLoading"
        placeholder="Ej: P ENTONCES Q&#10;P&#10;(o usando símbolos: P -> Q)"
        class="w-full font-mono text-sm rounded-xl border border-neutral-200 px-4 py-3 placeholder-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-all shadow-xs"
      ></textarea>
    </div>

    <!-- Campo de Conclusión -->
    <div class="space-y-2">
      <label for="conclusion" class="block text-sm font-medium text-neutral-700 flex justify-between items-center">
        <span>Conclusión a Demostrar</span>
        <span class="text-xs text-neutral-400 font-normal">Ej: Q</span>
      </label>
      <input
        id="conclusion"
        ref="conclusionRef"
        v-model="conclusionText"
        @focus="lastFocusedField = 'conclusion'"
        type="text"
        :disabled="isLoading"
        placeholder="Ej: Q"
        class="w-full font-mono text-sm rounded-xl border border-neutral-200 px-4 py-3 placeholder-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-all shadow-xs"
      />
    </div>

    <!-- Botón de Envío -->
    <div class="flex items-center justify-between pt-2">
      <p class="text-xs text-neutral-500">
        💡 Tip: También puedes escribir <code class="bg-neutral-100 px-1 py-0.5 rounded text-neutral-700">-></code>, <code class="bg-neutral-100 px-1 py-0.5 rounded text-neutral-700">^</code>, <code class="bg-neutral-100 px-1 py-0.5 rounded text-neutral-700">v</code>, <code class="bg-neutral-100 px-1 py-0.5 rounded text-neutral-700">~</code>
      </p>
      <Button
        type="submit"
        variant="primary"
        size="md"
        :disabled="isFormEmpty || isLoading"
      >
        <span v-if="isLoading" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando...
        </span>
        <span v-else class="flex items-center gap-1.5 font-semibold">
          Demostrar Inferencia &rarr;
        </span>
      </Button>
    </div>
  </form>
</template>
