<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Card from '@/components/ui/Card.vue'
import {
  extraerVariablesDeTexto,
  traducirTextoANatural
} from '@/lib/transcription/naturalTranslator'

interface Props {
  premisas: string[]
  conclusion: string
}

const props = defineProps<Props>()

// Diccionario de significados asignados a cada variable
const significados = ref<Record<string, string>>({
  P: 'llueve',
  Q: 'la calle se moja',
  R: 'el suelo está resbaloso',
  S: 'hay tráfico'
})

// Detectar todas las variables presentes en premisas y conclusión
const variablesDetectadas = computed(() => {
  const textoCompleto = [...props.premisas, props.conclusion].join(' ')
  const vars = extraerVariablesDeTexto(textoCompleto)
  return vars.length > 0 ? vars : ['P', 'Q']
})

// Asegurar que cada variable detectada tenga una entrada reactiva
watch(
  variablesDetectadas,
  (nuevasVars) => {
    nuevasVars.forEach((v) => {
      if (!significados.value[v]) {
        significados.value[v] = `sucede ${v}`
      }
    })
  },
  { immediate: true }
)

// Traducción de cada premisa
const premisasTraducidas = computed(() => {
  return props.premisas
    .filter((p) => p.trim() !== '')
    .map((p) => traducirTextoANatural(p, significados.value))
})

// Traducción de la conclusión
const conclusionTraducida = computed(() => {
  return traducirTextoANatural(props.conclusion, significados.value)
})

const tieneContenido = computed(() => {
  return props.premisas.some((p) => p.trim() !== '') || props.conclusion.trim() !== ''
})
</script>

<template>
  <Card class="space-y-6">
    <div class="border-b border-neutral-100 pb-4">
      <h3 class="text-lg font-bold text-neutral-800 flex items-center gap-2">
        <span>📖</span> Interpretación en Lenguaje Natural
      </h3>
      <p class="text-xs text-neutral-500 mt-1">
        Asigna significado en lenguaje real a tus variables para leer tu razonamiento como una historia argumentativa.
      </p>
    </div>

    <!-- Asignación de Variables -->
    <div class="space-y-3">
      <label class="block text-xs font-semibold text-neutral-600 uppercase tracking-wider">
        Significado de las Variables Proposicionales:
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="v in variablesDetectadas"
          :key="v"
          class="flex items-center gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-2xs"
        >
          <span class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-xs font-bold font-mono">
            {{ v }}
          </span>
          <span class="text-xs text-neutral-400 font-semibold">=</span>
          <input
            v-model="significados[v]"
            type="text"
            :placeholder="`Significado de ${v}...`"
            class="w-full bg-transparent text-xs text-neutral-800 focus:outline-none placeholder-neutral-400"
          />
        </div>
      </div>
    </div>

    <!-- Texto Narrativo Traducido -->
    <div v-if="tieneContenido" class="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
      <h4 class="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
        <span>💬</span> Argumento Traducido:
      </h4>

      <ul class="space-y-1.5 text-xs text-neutral-700">
        <li
          v-for="(premisaTexto, idx) in premisasTraducidas"
          :key="idx"
          class="flex items-start gap-2"
        >
          <span class="font-bold text-blue-700 flex-shrink-0">P{{ idx + 1 }}:</span>
          <span>{{ premisaTexto }}.</span>
        </li>
      </ul>

      <div
        v-if="conclusionTraducida"
        class="pt-2 mt-2 border-t border-blue-200/60 flex items-start gap-2 text-xs font-medium text-blue-950"
      >
        <span class="font-extrabold text-blue-700 flex-shrink-0">∴ Conclusión:</span>
        <span>Por lo tanto, {{ conclusionTraducida.toLowerCase() }}.</span>
      </div>
    </div>

    <div v-else class="text-center py-4 text-xs text-neutral-400">
      Ingresa premisas y una conclusión para ver su traducción en lenguaje natural aquí.
    </div>
  </Card>
</template>
