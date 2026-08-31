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
  <div class="bg-white/95 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
    <div class="border-b border-slate-100 pb-4">
      <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <span>📖</span> Interpretación en Lenguaje Natural
      </h3>
      <p class="text-xs text-slate-500 mt-1">
        Asigna significado en lenguaje real a tus variables para leer tu razonamiento como una historia argumentativa.
      </p>
    </div>

    <!-- Asignación de Variables -->
    <div class="space-y-3">
      <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider">
        Significado de las Variables Proposicionales:
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="v in variablesDetectadas"
          :key="v"
          class="flex items-center gap-2.5 bg-slate-50/80 p-3 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-2xs"
        >
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-800 text-xs font-extrabold font-mono shadow-2xs">
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
    <div v-if="tieneContenido" class="p-5 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 rounded-2xl border border-blue-100/90 space-y-3.5 shadow-2xs">
      <h4 class="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
        <span>💬</span> Argumento Traducido en Prosa:
      </h4>

      <ul class="space-y-2 text-xs text-slate-700 leading-relaxed">
        <li
          v-for="(premisaTexto, idx) in premisasTraducidas"
          :key="idx"
          class="flex items-start gap-2.5 bg-white/70 p-2.5 rounded-xl border border-blue-100/60"
        >
          <span class="font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md text-[11px] shrink-0">
            Premisa {{ idx + 1 }}
          </span>
          <span class="pt-0.5 capitalize">{{ premisaTexto }}.</span>
        </li>
      </ul>

      <div
        v-if="conclusionTraducida"
        class="pt-3 border-t border-blue-200/70 flex items-start gap-2.5 text-xs font-semibold text-blue-950 bg-blue-100/50 p-3 rounded-xl"
      >
        <span class="font-extrabold text-blue-800 bg-blue-200/80 px-2 py-0.5 rounded-md text-[11px] shrink-0">
          ∴ Conclusión
        </span>
        <span class="pt-0.5">Por lo tanto, {{ conclusionTraducida.toLowerCase() }}.</span>
      </div>
    </div>

    <div v-else class="text-center py-6 text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
      Ingresa premisas y una conclusión en la pestaña de Simbología Formal para ver su traducción automática aquí.
    </div>
  </div>
</template>
