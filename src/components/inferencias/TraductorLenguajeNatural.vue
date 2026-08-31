<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Languages, MessageSquare, Quote, Info } from '@lucide/vue'
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
  <div class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
    <div class="border-b border-slate-100 pb-3.5">
      <h3 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
        <Languages :size="18" class="text-indigo-600" />
        <span>Interpretación en Lenguaje Natural</span>
      </h3>
      <p class="text-xs text-slate-500 mt-0.5">
        Asigna enunciados cotidianos a las variables para interpretar el razonamiento en prosa.
      </p>
    </div>

    <!-- Asignación de Variables -->
    <div class="space-y-2.5">
      <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider">
        Significado de las Variables:
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div
          v-for="v in variablesDetectadas"
          :key="v"
          class="flex items-center gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-2xs"
        >
          <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-xs font-bold font-mono shadow-2xs">
            {{ v }}
          </span>
          <span class="text-xs text-slate-400 font-bold">=</span>
          <input
            v-model="significados[v]"
            type="text"
            :placeholder="`Significado de ${v}...`"
            class="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none placeholder-slate-400"
          />
        </div>
      </div>
    </div>

    <!-- Texto Narrativo Traducido -->
    <div v-if="tieneContenido" class="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/60 via-blue-50/40 to-slate-50 rounded-xl border border-indigo-100/80 space-y-3 shadow-2xs">
      <h4 class="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
        <MessageSquare :size="12" class="text-indigo-600" />
        <span>Argumento Traducido en Prosa:</span>
      </h4>

      <ul class="space-y-1.5 text-xs text-slate-700 leading-relaxed">
        <li
          v-for="(premisaTexto, idx) in premisasTraducidas"
          :key="idx"
          class="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-indigo-100/60 shadow-2xs"
        >
          <span class="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px] shrink-0 border border-indigo-100">
            Premisa {{ idx + 1 }}
          </span>
          <span class="pt-0.5 capitalize text-slate-800">{{ premisaTexto }}.</span>
        </li>
      </ul>

      <div
        v-if="conclusionTraducida"
        class="pt-2.5 border-t border-indigo-200/60 flex items-start gap-2 text-xs font-semibold text-indigo-950 bg-indigo-100/50 p-2.5 rounded-lg"
      >
        <span class="font-bold text-indigo-800 bg-indigo-200/80 px-2 py-0.5 rounded text-[10px] shrink-0">
          &there4; Conclusión
        </span>
        <span class="pt-0.5">Por lo tanto, {{ conclusionTraducida.toLowerCase() }}.</span>
      </div>
    </div>

    <div v-else class="text-center py-8 text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-1">
      <Info :size="20" class="mx-auto text-slate-300" />
      <p>Ingresa premisas y conclusión en Simbología Formal para ver la traducción aquí.</p>
    </div>
  </div>
</template>
