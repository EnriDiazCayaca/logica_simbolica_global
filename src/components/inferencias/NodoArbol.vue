<script setup lang="ts">
import { computed } from 'vue'
import type { NodoExpresion } from '@/lib/solver/types'
import {
  META_OPERADOR,
  COLOR_NODO,
  COLOR_RAMA,
  COLOR_VARIABLE,
  COLOR_RAMA_VARIABLE,
  hijosDeNodo,
  type MetaOperador
} from '@/lib/solver/astVisual'
import { Network } from '@lucide/vue'

interface Props {
  nodo: NodoExpresion
  /** Etiqueta opcional sobre el chip (ej. "P1", "izq", "der"). */
  etiqueta?: string
  esRaiz?: boolean
  /** Raíz global del diagrama: texto a mostrar y lista explícita de hijos. */
  tituloRaiz?: string
  hijos?: { nodo: NodoExpresion; etiqueta?: string }[]
}

const props = defineProps<Props>()

const esRaizGlobal = computed(() => !!props.tituloRaiz)
const esVariable = computed(() => props.nodo.tipo === 'variable')
const meta = computed<MetaOperador | null>(() =>
  props.nodo.tipo !== 'operacion' ? null : META_OPERADOR[props.nodo.operador]
)

interface HijoRender {
  nodo: NodoExpresion
  etiqueta?: string
}

const hijosRender = computed<HijoRender[]>(() => {
  if (esRaizGlobal.value) {
    return (props.hijos ?? []).map((h) => ({ nodo: h.nodo, etiqueta: h.etiqueta }))
  }
  return hijosDeNodo(props.nodo).map((n) => ({ nodo: n }))
})

const tieneHijos = computed(() => hijosRender.value.length > 0)

const etiquetaPorDefecto = (idx: number, total: number): string =>
  total === 1 ? 'hijo' : idx === 0 ? 'izq' : 'der'

const claseNodo = computed(() => {
  if (esRaizGlobal.value)
    return 'bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700 text-white shadow-md ring-neutral-500/30'
  if (esVariable.value) return COLOR_VARIABLE
  return meta.value ? COLOR_NODO[meta.value.color] : COLOR_VARIABLE
})

const claseRama = computed(() => {
  if (esRaizGlobal.value) return 'text-neutral-400'
  if (esVariable.value) return COLOR_RAMA_VARIABLE
  return meta.value ? COLOR_RAMA[meta.value.color] : COLOR_RAMA_VARIABLE
})

const textoPrincipal = computed(() => {
  if (esVariable.value) return (props.nodo as { nombre: string }).nombre
  return meta.value ? meta.value.simbolo : '?'
})

const textoSecundario = computed(() => {
  if (esVariable.value) return 'Variable'
  return meta.value ? meta.value.nombre : ''
})
</script>

<template>
  <li class="arbol-li">
    <div
      class="arbol-nodo group relative inline-flex flex-col items-center"
      :class="{ 'arbol-raiz-nodo': esRaizGlobal }"
    >
      <span
        v-if="etiqueta"
        class="mb-1.5 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md"
        :class="[
          etiqueta.includes('Conclusión') || etiqueta.includes('∴')
            ? 'bg-blue-100 text-blue-800 border border-blue-200'
            : etiqueta.startsWith('P')
              ? 'bg-slate-100 text-slate-700 border border-slate-200'
              : 'text-slate-400 font-semibold'
        ]"
      >
        {{ etiqueta }}
      </span>

      <!-- Nodo raíz global del diagrama -->
      <div
        v-if="esRaizGlobal"
        class="flex items-center gap-2.5 rounded-2xl border px-5 py-3 shadow-md ring-1 ring-inset transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        :class="claseNodo"
      >
        <Network :size="20" class="opacity-90 text-blue-400" />
        <span class="flex flex-col leading-tight text-left">
          <span class="text-sm font-black tracking-wide">{{ tituloRaiz }}</span>
          <span class="text-[10px] font-semibold opacity-75">Premisas + Conclusión</span>
        </span>
      </div>

      <!-- Nodo normal: variable u operación -->
      <div
        v-else
        class="flex items-center gap-2 rounded-2xl border px-3.5 py-2 shadow-2xs ring-1 ring-inset transition-all duration-150 hover:-translate-y-1 hover:shadow-md cursor-default select-none"
        :class="claseNodo"
      >
        <span class="text-lg font-black leading-none font-serif">{{ textoPrincipal }}</span>
        <span class="flex flex-col leading-none text-left">
          <span class="text-[10px] font-bold opacity-85">{{ textoSecundario }}</span>
          <span
            v-if="!esVariable && meta"
            class="text-[9px] font-semibold opacity-60 uppercase tracking-wider"
          >{{ meta.corto }}</span>
        </span>
      </div>
    </div>

    <ul v-if="tieneHijos" class="arbol-ul" :class="claseRama">
      <NodoArbol
        v-for="(hijo, idx) in hijosRender"
        :key="idx"
        :nodo="hijo.nodo"
        :etiqueta="hijo.etiqueta ?? etiquetaPorDefecto(idx, hijosRender.length)"
      />
    </ul>
  </li>
</template>
