<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import type { InferenciaRequest } from '@/types/inferencias'
import Button from '@/components/ui/Button.vue'
import { AlertCircle } from '@lucide/vue'

const props = defineProps<{
  isLoading: boolean
  premisasIniciales?: string[]
  conclusionInicial?: string
}>()

const emit = defineEmits<{
  (e: 'submit', payload: InferenciaRequest): void
  (e: 'update:modelValue', payload: { premisas: string[]; conclusion: string }): void
}>()

const premisasText = ref(props.premisasIniciales?.join('\n') || '')
const conclusionText = ref(props.conclusionInicial || '')
const premisasRef = ref<HTMLTextAreaElement | null>(null)
const conclusionRef = ref<HTMLInputElement | null>(null)
const lastFocusedField = ref<'premisas' | 'conclusion'>('premisas')

watch(
  () => props.premisasIniciales,
  (nuevas) => {
    if (nuevas) premisasText.value = nuevas.join('\n')
  }
)
watch(
  () => props.conclusionInicial,
  (nueva) => {
    if (nueva !== undefined) conclusionText.value = nueva
  }
)

const isFormEmpty = computed(() => {
  return premisasText.value.trim() === '' || conclusionText.value.trim() === ''
})

// Emitir cambios para sincronizar con el traductor de lenguaje natural
watch([premisasText, conclusionText], () => {
  emit('update:modelValue', {
    premisas: premisasText.value.split('\n'),
    conclusion: conclusionText.value
  })
})

/**
 * Normaliza símbolos matemáticos a las palabras clave internas del motor lógico.
 */
const normalizarSintaxis = (linea: string): string => {
  return linea
    .replace(/<->|<=>|↔|⟺/g, ' SI_Y_SOLO_SI ')
    .replace(/->|=>|→|⟹/g, ' ENTONCES ')
    .replace(/\^|∧|&&/g, ' Y ')
    .replace(/∨|\|\|/g, ' O ')
    .replace(/~|¬|!/g, ' NO ')
    .replace(/△|∆|▲|⊕|⊻/g, ' O_EXCLUSIVA ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Validador en tiempo real (Linter para paréntesis no balanceados)
 */
const advertenciasSintaxis = computed<string[]>(() => {
  const advertencias: string[] = []
  const lineas = premisasText.value.split('\n').filter((l) => l.trim() !== '')

  lineas.forEach((linea, idx) => {
    const izq = (linea.match(/\(/g) || []).length
    const der = (linea.match(/\)/g) || []).length
    if (izq !== der) {
      advertencias.push(`Premisa ${idx + 1}: paréntesis sin cerrar (${izq} abiertos vs ${der} cerrados).`)
    }
  })

  if (conclusionText.value.trim()) {
    const izqC = (conclusionText.value.match(/\(/g) || []).length
    const derC = (conclusionText.value.match(/\)/g) || []).length
    if (izqC !== derC) {
      advertencias.push(`Conclusión: paréntesis sin cerrar (${izqC} abiertos vs ${derC} cerrados).`)
    }
  }

  return advertencias
})

/**
 * Conectivos y variables
 */
const CONECTIVOS = ['¬', '∧', '∨', '△', '→', '↔', '(', ')']
const GRUPO_VARS_1 = ['P', 'Q', 'R', 'S']
const GRUPO_VARS_2 = ['A', 'B', 'C', 'D']

/**
 * Inserta un símbolo con regla determinista de espaciado:
 * - Conectivos y paréntesis: ponen un espacio antes y después.
 * - Variables: NO ponen ningún espacio.
 * - Salto de línea: inserta \n sin espacios.
 */
const insertarSimbolo = (simbolo: string, esConectivo: boolean = false) => {
  const isPremisas = lastFocusedField.value === 'premisas'
  const inputEl = isPremisas ? premisasRef.value : conclusionRef.value
  const currentVal = isPremisas ? premisasText.value : conclusionText.value

  if (!isPremisas && simbolo === '\n') return

  let toInsert = simbolo
  if (esConectivo) {
    toInsert = ` ${simbolo} `
  }

  if (inputEl) {
    const start = inputEl.selectionStart ?? currentVal.length
    const end = inputEl.selectionEnd ?? currentVal.length
    const before = currentVal.substring(0, start)
    const after = currentVal.substring(end)

    const newVal = before + toInsert + after
    if (isPremisas) {
      premisasText.value = newVal
    } else {
      conclusionText.value = newVal
    }

    nextTick(() => {
      inputEl.focus({ preventScroll: true })
      const newPos = start + toInsert.length
      inputEl.setSelectionRange(newPos, newPos)
    })
  } else {
    const newVal = currentVal + toInsert
    if (isPremisas) {
      premisasText.value = newVal
    } else {
      conclusionText.value = newVal
    }
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
    .map((p) => normalizarSintaxis(p))
    .filter((p) => p !== '')

  emit('submit', {
    premisas,
    conclusion: normalizarSintaxis(conclusionText.value)
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Campo de Premisas -->
    <div class="space-y-1.5">
      <div class="flex justify-between items-center">
        <label for="premisas" class="block text-sm font-semibold text-neutral-800">
          Premisas (una por línea)
        </label>
        <button
          v-if="premisasText || conclusionText"
          type="button"
          @click="limpiarFormulario"
          class="text-xs text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
        >
          Limpiar
        </button>
      </div>
      <textarea
        id="premisas"
        ref="premisasRef"
        v-model="premisasText"
        @focus="lastFocusedField = 'premisas'"
        rows="4"
        :disabled="isLoading"
        placeholder="Ej: P → Q&#10;P"
        class="w-full font-mono text-sm rounded-xl border border-neutral-200 px-4 py-3 placeholder-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-all shadow-xs"
      ></textarea>
    </div>

    <!-- Campo de Conclusión -->
    <div class="space-y-1.5">
      <label for="conclusion" class="block text-sm font-semibold text-neutral-800">
        Conclusión a Demostrar
      </label>
      <input
        id="conclusion"
        ref="conclusionRef"
        v-model="conclusionText"
        @focus="lastFocusedField = 'conclusion'"
        type="text"
        :disabled="isLoading"
        placeholder="Ej: Q"
        class="w-full font-mono text-sm rounded-xl border border-neutral-200 px-4 py-2.5 placeholder-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-all shadow-xs"
      />
    </div>

    <!-- Linter de Sintaxis en Tiempo Real -->
    <div v-if="advertenciasSintaxis.length > 0" class="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1">
      <div class="flex items-center gap-1.5 font-bold text-amber-900">
        <AlertCircle :size="14" />
        <span>Aviso de sintaxis:</span>
      </div>
      <ul class="list-disc list-inside space-y-0.5 text-[11px]">
        <li v-for="(adv, aIdx) in advertenciasSintaxis" :key="aIdx">
          {{ adv }}
        </li>
      </ul>
    </div>

    <!-- Teclado Simbólico Estructurado (Exactamente 2 filas sin saltos residuales) -->
    <div class="p-2.5 sm:p-3 bg-neutral-100/75 rounded-xl border border-neutral-200/80 space-y-2">
      <!-- Fila 1: Grid estricto de 8 columnas simétricas (Nunca salta a otra línea) -->
      <div class="grid grid-cols-8 gap-1 sm:gap-1.5">
        <button
          v-for="op in CONECTIVOS"
          :key="op"
          type="button"
          @click="insertarSimbolo(op, true)"
          class="h-8 flex items-center justify-center bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-sm rounded-lg border border-neutral-300 shadow-2xs active:scale-95 transition-all cursor-pointer"
        >
          {{ op }}
        </button>
      </div>

      <!-- Fila 2: Variables a la izquierda y Botón Salto + Texto a la derecha -->
      <div class="flex items-center justify-between gap-1.5 pt-1.5 border-t border-neutral-200/80">
        <!-- Grupo de Variables: P, Q, R, S | A, B, C, D -->
        <div class="flex items-center gap-1 overflow-x-auto">
          <button
            v-for="v in GRUPO_VARS_1"
            :key="v"
            type="button"
            @click="insertarSimbolo(v, false)"
            class="h-7 w-7 sm:w-8 flex items-center justify-center bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs rounded-md border border-neutral-300 shadow-2xs hover:border-blue-400 active:scale-95 transition-all cursor-pointer flex-shrink-0"
          >
            {{ v }}
          </button>

          <span class="text-neutral-300 select-none px-0.5">|</span>

          <button
            v-for="v in GRUPO_VARS_2"
            :key="v"
            type="button"
            @click="insertarSimbolo(v, false)"
            class="h-7 w-7 sm:w-8 flex items-center justify-center bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs rounded-md border border-neutral-300 shadow-2xs hover:border-blue-400 active:scale-95 transition-all cursor-pointer flex-shrink-0"
          >
            {{ v }}
          </button>
        </div>

        <!-- Botón Salto a la derecha de la fila 2 -->
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <span class="text-[10px] text-neutral-400 italic hidden md:inline">
            (escribe más con tu teclado)
          </span>

          <button
            v-if="lastFocusedField === 'premisas'"
            type="button"
            @click="insertarSimbolo('\n', false)"
            title="Salto de línea"
            class="h-7 px-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-medium text-xs rounded-md shadow-2xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            ↵ Salto
          </button>
        </div>
      </div>
    </div>

    <!-- Botón de Envío -->
    <div class="flex justify-end pt-1">
      <Button
        type="submit"
        variant="primary"
        size="md"
        class="w-full sm:w-auto font-semibold"
        :disabled="isFormEmpty || isLoading"
      >
        <span v-if="isLoading" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Demostrando...
        </span>
        <span v-else class="flex items-center gap-1.5">
          Demostrar Inferencia &rarr;
        </span>
      </Button>
    </div>
  </form>
</template>
