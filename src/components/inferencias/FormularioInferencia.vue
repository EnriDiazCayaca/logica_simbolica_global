<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import type { InferenciaRequest } from '@/types/inferencias'
import Button from '@/components/ui/Button.vue'
import { AlertCircle, Sparkles } from '@lucide/vue'

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

// Si cambian las props externas, sincronizar
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
    .replace(/⊕|⊻/g, ' O_EXCLUSIVA ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Validador en tiempo real (Linter básico para paréntesis y conectivos)
 */
const advertenciasSintaxis = computed<string[]>(() => {
  const advertencias: string[] = []
  const lineas = premisasText.value.split('\n').filter((l) => l.trim() !== '')

  // Verificar balanceo de paréntesis en premisas
  lineas.forEach((linea, idx) => {
    const izq = (linea.match(/\(/g) || []).length
    const der = (linea.match(/\)/g) || []).length
    if (izq !== der) {
      advertencias.push(`Premisa ${idx + 1}: paréntesis sin cerrar (${izq} abiertos vs ${der} cerrados).`)
    }
  })

  // Verificar balanceo de paréntesis en conclusión
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
 * Cargar ejemplos académicos predefinidos
 */
const EJEMPLOS_PREDEFINIDOS = [
  {
    nombre: 'Modus Ponens (Válido)',
    premisas: 'P → Q\nP',
    conclusion: 'Q'
  },
  {
    nombre: 'Silogismo Hipotético (Multi-paso)',
    premisas: 'P → Q\nQ → R\nP',
    conclusion: 'R'
  },
  {
    nombre: 'Bicondicional (Válido)',
    premisas: 'P ↔ Q\nP',
    conclusion: 'Q'
  },
  {
    nombre: 'Afirmación del Consecuente (Falacia)',
    premisas: 'P → Q\nQ',
    conclusion: 'P'
  },
  {
    nombre: 'Dilema Inverso (Falacia Disyuntiva)',
    premisas: '(P → Q) ∧ (R → S)\nQ ∨ S',
    conclusion: 'P ∨ R'
  }
]

const cargarEjemplo = (ejemplo: { premisas: string; conclusion: string }) => {
  premisasText.value = ejemplo.premisas
  conclusionText.value = ejemplo.conclusion
}

/**
 * Inserta un símbolo matemático en la posición actual del cursor del campo activo.
 */
const insertarSimbolo = (simbolo: string) => {
  const isPremisas = lastFocusedField.value === 'premisas'
  const inputEl = isPremisas ? premisasRef.value : conclusionRef.value

  if (isPremisas) {
    if (inputEl) {
      const start = inputEl.selectionStart ?? premisasText.value.length
      const end = inputEl.selectionEnd ?? premisasText.value.length
      const before = premisasText.value.substring(0, start)
      const after = premisasText.value.substring(end)

      const needsSpaceBefore =
        before.length > 0 &&
        !before.endsWith(' ') &&
        !before.endsWith('\n') &&
        simbolo !== ')' &&
        simbolo !== '\n'
      const needsSpaceAfter =
        after.length > 0 &&
        !after.startsWith(' ') &&
        !after.startsWith('\n') &&
        simbolo !== '(' &&
        simbolo !== '\n'

      const toInsert =
        (needsSpaceBefore ? ' ' : '') + simbolo + (needsSpaceAfter ? ' ' : '')
      premisasText.value = before + toInsert + after

      nextTick(() => {
        inputEl.focus()
        const newPos = start + toInsert.length
        inputEl.setSelectionRange(newPos, newPos)
      })
    } else {
      premisasText.value += (premisasText.value ? ' ' : '') + simbolo
    }
  } else {
    if (simbolo === '\n') return

    if (inputEl) {
      const start = inputEl.selectionStart ?? conclusionText.value.length
      const end = inputEl.selectionEnd ?? conclusionText.value.length
      const before = conclusionText.value.substring(0, start)
      const after = conclusionText.value.substring(end)

      const needsSpaceBefore =
        before.length > 0 && !before.endsWith(' ') && simbolo !== ')'
      const needsSpaceAfter =
        after.length > 0 && !after.startsWith(' ') && simbolo !== '('

      const toInsert =
        (needsSpaceBefore ? ' ' : '') + simbolo + (needsSpaceAfter ? ' ' : '')
      conclusionText.value = before + toInsert + after

      nextTick(() => {
        inputEl.focus()
        const newPos = start + toInsert.length
        inputEl.setSelectionRange(newPos, newPos)
      })
    } else {
      conclusionText.value += (conclusionText.value ? ' ' : '') + simbolo
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
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <!-- Barra de Ejemplos Rápidos -->
    <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-neutral-100">
      <span class="text-xs font-bold text-neutral-600 flex items-center gap-1">
        <Sparkles :size="14" class="text-amber-500" /> Ejemplos Académicos:
      </span>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="(ej, idx) in EJEMPLOS_PREDEFINIDOS"
          :key="idx"
          type="button"
          @click="cargarEjemplo(ej)"
          class="px-2 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-blue-50 text-neutral-700 hover:text-blue-700 rounded-md border border-neutral-200 transition-colors cursor-pointer"
        >
          {{ ej.nombre }}
        </button>
      </div>
    </div>

    <!-- Panel de Botonera: Conectivos y Variables Claramente Separados -->
    <div class="space-y-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
      <div class="flex items-center justify-between text-xs font-semibold text-neutral-600">
        <span class="flex items-center gap-1.5">
          <span>⌨️</span> Teclado Simbólico
        </span>
        <span class="text-[11px] font-normal text-blue-600">
          Insertando en: <strong>{{ lastFocusedField === 'premisas' ? 'Premisas' : 'Conclusión' }}</strong>
        </span>
      </div>

      <!-- Sección 1: Conectivos Lógicos (Simbología Pura) -->
      <div class="space-y-1.5">
        <span class="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
          Conectivos Lógicos:
        </span>
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            @click="insertarSimbolo('¬')"
            title="Negación (¬)"
            class="h-9 px-3 bg-white hover:bg-neutral-100 text-red-600 font-bold text-base rounded-lg border border-neutral-300 shadow-xs hover:border-red-300 active:scale-95 transition-all"
          >
            ¬
          </button>
          <button
            type="button"
            @click="insertarSimbolo('∧')"
            title="Conjunción (∧)"
            class="h-9 px-3 bg-white hover:bg-neutral-100 text-blue-600 font-bold text-base rounded-lg border border-neutral-300 shadow-xs hover:border-blue-300 active:scale-95 transition-all"
          >
            ∧
          </button>
          <button
            type="button"
            @click="insertarSimbolo('∨')"
            title="Disyunción (∨)"
            class="h-9 px-3 bg-white hover:bg-neutral-100 text-amber-600 font-bold text-base rounded-lg border border-neutral-300 shadow-xs hover:border-amber-300 active:scale-95 transition-all"
          >
            ∨
          </button>
          <button
            type="button"
            @click="insertarSimbolo('→')"
            title="Condicional / Implicación (→)"
            class="h-9 px-3.5 bg-white hover:bg-neutral-100 text-emerald-600 font-bold text-base rounded-lg border border-neutral-300 shadow-xs hover:border-emerald-300 active:scale-95 transition-all"
          >
            →
          </button>
          <button
            type="button"
            @click="insertarSimbolo('↔')"
            title="Bicondicional (↔)"
            class="h-9 px-3.5 bg-white hover:bg-neutral-100 text-purple-600 font-bold text-base rounded-lg border border-neutral-300 shadow-xs hover:border-purple-300 active:scale-95 transition-all"
          >
            ↔
          </button>
          <button
            type="button"
            @click="insertarSimbolo('(')"
            title="Paréntesis izquierdo"
            class="h-9 w-9 bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-sm rounded-lg border border-neutral-300 shadow-xs active:scale-95 transition-all"
          >
            (
          </button>
          <button
            type="button"
            @click="insertarSimbolo(')')"
            title="Paréntesis derecho"
            class="h-9 w-9 bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-sm rounded-lg border border-neutral-300 shadow-xs active:scale-95 transition-all"
          >
            )
          </button>
          <button
            v-if="lastFocusedField === 'premisas'"
            type="button"
            @click="insertarSimbolo('\n')"
            title="Nueva línea para siguiente premisa"
            class="h-9 px-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-medium text-xs rounded-lg shadow-xs active:scale-95 transition-all"
          >
            ↵ Salto de Línea
          </button>
        </div>
      </div>

      <!-- Sección 2: Variables de Ejemplo -->
      <div class="pt-2 border-t border-neutral-200/80 flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-1.5">
          <span class="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mr-1">
            Variables de ejemplo:
          </span>
          <button
            v-for="v in ['P', 'Q', 'R', 'S']"
            :key="v"
            type="button"
            @click="insertarSimbolo(v)"
            class="h-7 min-w-[28px] px-2 bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs rounded-md border border-neutral-300 shadow-2xs hover:border-blue-400 active:scale-95 transition-all"
          >
            {{ v }}
          </button>
        </div>
        <span class="text-[11px] text-neutral-400 italic">
          (o escribe cualquier letra con tu teclado)
        </span>
      </div>
    </div>

    <!-- Campo de Premisas -->
    <div class="space-y-1.5">
      <div class="flex justify-between items-center">
        <label for="premisas" class="block text-sm font-semibold text-neutral-700">
          Premisas (una por cada línea)
        </label>
        <button
          v-if="premisasText || conclusionText"
          type="button"
          @click="limpiarFormulario"
          class="text-xs text-neutral-400 hover:text-red-600 transition-colors"
        >
          Limpiar campos
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
      <label for="conclusion" class="block text-sm font-semibold text-neutral-700">
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
        class="w-full font-mono text-sm rounded-xl border border-neutral-200 px-4 py-3 placeholder-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-all shadow-xs"
      />
    </div>

    <!-- Alertas del Linter de Sintaxis en Tiempo Real -->
    <div v-if="advertenciasSintaxis.length > 0" class="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1">
      <div class="flex items-center gap-1.5 font-bold text-amber-900">
        <AlertCircle :size="14" />
        <span>Aviso de sintaxis detectado:</span>
      </div>
      <ul class="list-disc list-inside space-y-0.5 text-[11px]">
        <li v-for="(adv, aIdx) in advertenciasSintaxis" :key="aIdx">
          {{ adv }}
        </li>
      </ul>
    </div>

    <!-- Botón de Envío -->
    <div class="flex justify-end pt-1">
      <Button
        type="submit"
        variant="primary"
        size="md"
        class="w-full sm:w-auto"
        :disabled="isFormEmpty || isLoading"
      >
        <span v-if="isLoading" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando Demostración...
        </span>
        <span v-else class="flex items-center gap-1.5 font-semibold">
          Demostrar Inferencia &rarr;
        </span>
      </Button>
    </div>
  </form>
</template>
