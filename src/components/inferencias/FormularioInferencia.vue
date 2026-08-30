<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import type { InferenciaRequest } from '@/types/inferencias'
import { normalizarExpresion } from '@/lib/solver/parser'
import Button from '@/components/ui/Button.vue'

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

const premisasCursor = ref(0)
const conclusionCursor = ref(0)

const guardarPosicionCursor = (campo: 'premisas' | 'conclusion') => {
  lastFocusedField.value = campo
  const inputEl = campo === 'premisas' ? premisasRef.value : conclusionRef.value
  if (inputEl && inputEl.selectionStart !== null) {
    if (campo === 'premisas') {
      premisasCursor.value = inputEl.selectionStart
    } else {
      conclusionCursor.value = inputEl.selectionStart
    }
  }
}

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
 * (Delegado a la función compartida del parser para evitar duplicación.)
 */
const normalizarSintaxis = (linea: string): string => normalizarExpresion(linea)

/**
 * Conectivos y variables
 */
const CONECTIVOS = ['¬', '∧', '∨', '△', '→', '↔', '(', ')']
const CONECTIVOS_CON_ESPACIO = ['∧', '∨', '△', '→', '↔']
const GRUPO_VARS_1 = ['P', 'Q', 'R', 'S']
const GRUPO_VARS_2 = ['A', 'B', 'C', 'D']

interface EjemploRapido {
  nombre: string
  premisas: string[]
  conclusion: string
  tipo: 'valido' | 'falacia'
}

const EJEMPLOS_RAPIDOS: EjemploRapido[] = [
  {
    nombre: 'Modus Ponens',
    premisas: ['P → Q', 'P'],
    conclusion: 'Q',
    tipo: 'valido'
  },
  {
    nombre: 'Silogismo Hipotético',
    premisas: ['P → Q', 'Q → R'],
    conclusion: 'P → R',
    tipo: 'valido'
  },
  {
    nombre: 'Dilema Constructivo',
    premisas: ['P → Q', 'R → S', 'P ∨ R'],
    conclusion: 'Q ∨ S',
    tipo: 'valido'
  },
  {
    nombre: 'Falacia Afirm. Consecuente',
    premisas: ['P → Q', 'Q'],
    conclusion: 'P',
    tipo: 'falacia'
  }
]

const cargarEjemplo = (ej: EjemploRapido) => {
  premisasText.value = ej.premisas.join('\n')
  conclusionText.value = ej.conclusion
  premisasCursor.value = premisasText.value.length
  conclusionCursor.value = conclusionText.value.length
}

/**
 * Inserta un símbolo con regla determinista de espaciado:
 * - Conectivos binarios (∧, ∨, △, →, ↔): ponen un espacio antes y después de forma inteligente.
 * - Paréntesis, negación (¬), variables y salto de línea: NO ponen ningún espacio adicional.
 * - En dispositivos móviles, evita forzar .focus() para impedir que salte el teclado virtual por defecto.
 */
const insertarSimbolo = (simbolo: string) => {
  const isPremisas = lastFocusedField.value === 'premisas'
  const inputEl = isPremisas ? premisasRef.value : conclusionRef.value
  const currentVal = isPremisas ? premisasText.value : conclusionText.value

  if (!isPremisas && simbolo === '\n') return

  let start = isPremisas ? premisasCursor.value : conclusionCursor.value
  if (inputEl && inputEl.selectionStart !== null) {
    start = inputEl.selectionStart
  }
  let end = isPremisas ? premisasCursor.value : conclusionCursor.value
  if (inputEl && inputEl.selectionEnd !== null) {
    end = inputEl.selectionEnd
  }

  if (start < 0 || start > currentVal.length) {
    start = currentVal.length
    end = currentVal.length
  }

  const before = currentVal.substring(0, start)
  const after = currentVal.substring(end)

  let toInsert = simbolo
  if (CONECTIVOS_CON_ESPACIO.includes(simbolo)) {
    const spaceBefore = before.length > 0 && !before.endsWith(' ') && !before.endsWith('\n') && !before.endsWith('(') ? ' ' : ''
    const spaceAfter = after.startsWith(' ') || after.startsWith(')') || after.startsWith('\n') ? '' : ' '
    toInsert = `${spaceBefore}${simbolo}${spaceAfter}`
  }

  const newVal = before + toInsert + after
  const newPos = start + toInsert.length

  if (isPremisas) {
    premisasText.value = newVal
    premisasCursor.value = newPos
  } else {
    conclusionText.value = newVal
    conclusionCursor.value = newPos
  }

  nextTick(() => {
    if (inputEl) {
      inputEl.setSelectionRange(newPos, newPos)
      const esDispositivoTactil = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
      if (!esDispositivoTactil) {
        inputEl.focus({ preventScroll: true })
      }
    }
  })
}

const limpiarFormulario = () => {
  premisasText.value = ''
  conclusionText.value = ''
  premisasCursor.value = 0
  conclusionCursor.value = 0
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
    <!-- Ejemplos Rápidos Didácticos -->
    <div class="space-y-2 pb-2 border-b border-slate-100">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <span>⚡</span> Ejemplos de prueba rápida:
        </span>
        <span class="text-[10px] text-slate-400">1 clic para cargar</span>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="ej in EJEMPLOS_RAPIDOS"
          :key="ej.nombre"
          type="button"
          @click="cargarEjemplo(ej)"
          class="px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer select-none active:scale-95 shadow-2xs flex items-center gap-1.5"
          :class="[
            ej.tipo === 'valido'
              ? 'bg-blue-50/80 border-blue-200/90 text-blue-700 hover:bg-blue-100 hover:border-blue-300'
              : 'bg-amber-50/80 border-amber-200/90 text-amber-800 hover:bg-amber-100 hover:border-amber-300'
          ]"
        >
          <span
            class="h-1.5 w-1.5 rounded-full"
            :class="ej.tipo === 'valido' ? 'bg-emerald-500' : 'bg-amber-500'"
          ></span>
          <span>{{ ej.nombre }}</span>
        </button>
      </div>
    </div>

    <!-- Campo de Premisas -->
    <div class="space-y-1.5">
      <div class="flex justify-between items-center">
        <label for="premisas" class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <span>📋</span> Premisas Iniciales
        </label>
        <button
          v-if="premisasText || conclusionText"
          type="button"
          @click="limpiarFormulario"
          class="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
        >
          Limpiar campos
        </button>
      </div>
      <textarea
        id="premisas"
        ref="premisasRef"
        v-model="premisasText"
        @focus="guardarPosicionCursor('premisas')"
        @click="guardarPosicionCursor('premisas')"
        @keyup="guardarPosicionCursor('premisas')"
        @select="guardarPosicionCursor('premisas')"
        rows="4"
        :disabled="isLoading"
        placeholder="Ej: P → Q&#10;P"
        class="w-full font-mono text-base rounded-2xl border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-50/50 hover:bg-white focus:bg-white transition-all shadow-xs leading-relaxed"
      ></textarea>
      <p class="text-[11px] text-slate-400 italic">Escribe una premisa por línea. Puedes usar símbolos matemáticos o palabras clave (Y, O, ENTONCES, NO).</p>
    </div>

    <!-- Campo de Conclusión -->
    <div class="space-y-1.5">
      <label for="conclusion" class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
        <span>🎯</span> Conclusión a Demostrar
      </label>
      <div class="relative flex items-center">
        <span class="absolute left-3.5 text-blue-600 font-serif font-bold text-lg select-none pointer-events-none">
          &there4;
        </span>
        <input
          id="conclusion"
          ref="conclusionRef"
          v-model="conclusionText"
          @focus="guardarPosicionCursor('conclusion')"
          @click="guardarPosicionCursor('conclusion')"
          @keyup="guardarPosicionCursor('conclusion')"
          @select="guardarPosicionCursor('conclusion')"
          type="text"
          :disabled="isLoading"
          placeholder="Ej: Q"
          class="w-full font-mono text-base rounded-2xl border border-slate-200 pl-8 pr-4 py-2.5 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-50/50 hover:bg-white focus:bg-white transition-all shadow-xs leading-relaxed"
        />
      </div>
    </div>

    <!-- Teclado Simbólico Estructurado (2 filas fijas simétricas) -->
    <div class="p-3 bg-slate-100/80 rounded-2xl border border-slate-200/90 space-y-2.5">
      <div class="flex items-center justify-between px-0.5">
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          ⌨️ Teclado Simbólico Rápido
        </span>
        <span class="text-[10px] text-slate-400 italic">
          (inserta en el cursor)
        </span>
      </div>

      <!-- Fila 1: Grid estricto de 8 columnas simétricas para Conectivos -->
      <div class="grid grid-cols-8 gap-1.5">
        <button
          v-for="op in CONECTIVOS"
          :key="op"
          type="button"
          @mousedown.prevent
          @click="insertarSimbolo(op)"
          class="h-9 flex items-center justify-center bg-white hover:bg-slate-50 hover:border-blue-400 text-slate-800 font-bold text-sm sm:text-base rounded-xl border border-slate-200 shadow-2xs active:scale-95 transition-all cursor-pointer select-none leading-none"
        >
          {{ op }}
        </button>
      </div>

      <!-- Fila 2: Variables a la izquierda y Botón Salto a la derecha -->
      <div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
        <!-- Grupo de Variables: P, Q, R, S | A, B, C, D con espacio vertical adecuado -->
        <div class="flex items-center gap-1 overflow-x-auto py-1 px-0.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent [scrollbar-width:thin] min-h-[38px]">
          <button
            v-for="v in GRUPO_VARS_1"
            :key="v"
            type="button"
            @mousedown.prevent
            @click="insertarSimbolo(v)"
            class="h-7.5 w-7.5 sm:w-8 sm:h-7.5 flex items-center justify-center bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm rounded-lg border border-slate-200 shadow-2xs hover:border-blue-400 active:scale-95 transition-all cursor-pointer flex-shrink-0 select-none leading-none"
          >
            {{ v }}
          </button>

          <span class="text-slate-300 select-none px-1 text-xs flex-shrink-0">|</span>

          <button
            v-for="v in GRUPO_VARS_2"
            :key="v"
            type="button"
            @mousedown.prevent
            @click="insertarSimbolo(v)"
            class="h-7.5 w-7.5 sm:w-8 sm:h-7.5 flex items-center justify-center bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm rounded-lg border border-slate-200 shadow-2xs hover:border-blue-400 active:scale-95 transition-all cursor-pointer flex-shrink-0 select-none leading-none"
          >
            {{ v }}
          </button>
        </div>

        <!-- Botón Salto a la derecha de la fila 2 -->
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <button
            v-if="lastFocusedField === 'premisas'"
            type="button"
            @mousedown.prevent
            @click="insertarSimbolo('\n')"
            title="Insertar salto de línea en premisas"
            class="h-7.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg shadow-2xs active:scale-95 transition-all cursor-pointer whitespace-nowrap select-none flex items-center gap-1"
          >
            <span>↵</span>
            <span>Salto</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Botón de Envío -->
    <div class="flex justify-end pt-1">
      <button
        type="submit"
        :disabled="isFormEmpty || isLoading"
        class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-sm"
      >
        <span v-if="isLoading" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Demostrando Deducción...
        </span>
        <span v-else class="flex items-center gap-1.5">
          <span>Demostrar Inferencia</span>
          <span>&rarr;</span>
        </span>
      </button>
    </div>
  </form>
</template>
