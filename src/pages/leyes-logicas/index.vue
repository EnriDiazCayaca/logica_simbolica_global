<script setup lang="ts">
import { computed, ref } from 'vue'
import { LEYES_LOGICAS } from '@/data/logicLaws'
import Card from '@/components/ui/Card.vue'
import { siteContent } from '@/content'
import { Search, Scale, Repeat, GitBranch, ArrowLeftRight, GitFork, Magnet, CircleOff, BadgeCheck, Split, Maximize2, ArrowRightLeft, Upload, BookMarked } from '@lucide/vue'

const t = siteContent.leyesPage
const modoLiteral = t.modoLiteral
const busqueda = ref('')

const leyesFiltradas = computed(() => {
  const termino = busqueda.value.trim().toLowerCase()
  if (!termino) return LEYES_LOGICAS
  return LEYES_LOGICAS.filter(
    (ley) =>
      ley.nombre.toLowerCase().includes(termino) ||
      ley.descripcion.toLowerCase().includes(termino) ||
      (modoLiteral && (ley as any).formulasLiteral?.some((f: string) => f.toLowerCase().includes(termino))) ||
      ley.formulas.some((f) => f.toLowerCase().includes(termino)),
  )
})

function formulasDisplay(ley: any): string[] {
  if (modoLiteral && ley.formulasLiteral) return ley.formulasLiteral as string[]
  return ley.formulas as string[]
}

function nombreDisplay(ley: any): string {
  if (modoLiteral && ley.nombreLiteral) return ley.nombreLiteral as string
  return ley.nombre as string
}

function descDisplay(ley: any): string {
  if (modoLiteral && ley.descripcionFormal) return ley.descripcionFormal as string
  // Si es modo literal, profesor puede haber puesto descripcion ya literal; respetamos descripcion
  // descripcionFormal es rigor extra, si existe la mostramos como tooltip? Aquí priorizamos descripcion
  return ley.descripcion as string
}

const iconMap: Record<number, any> = {
  1: Repeat,
  2: GitBranch,
  3: ArrowLeftRight,
  4: GitFork,
  5: Magnet,
  6: CircleOff,
  7: BadgeCheck,
  8: Split,
  9: Maximize2,
  10: ArrowRightLeft,
  11: Upload,
  12: BookMarked,
}

function iconForLey(id: number) {
  return iconMap[id] ?? Scale
}
</script>

<template>
  <section class="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 mb-1">{{ t.titulo }}</h1>
          <p class="text-neutral-500 text-sm">
            {{ t.subtitulo }}
          </p>
        </div>
        <div class="flex items-center gap-2 border border-neutral-300 rounded-lg px-3 py-2 w-full sm:w-auto sm:min-w-[320px]">
          <Search :size="16" class="text-neutral-400 shrink-0" aria-hidden="true" />
          <input
            v-model="busqueda"
            type="text"
            :placeholder="t.placeholder"
            class="border-none outline-none text-sm w-full font-[inherit]"
          />
        </div>
      </div>

      <p v-if="leyesFiltradas.length === 0" class="text-neutral-400 text-sm mb-6">
        {{ t.empty.replace('{q}', busqueda) }}
      </p>

      <!-- Laws grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card v-for="ley in leyesFiltradas" :key="ley.id">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <component :is="iconForLey(ley.id)" :size="14" class="text-blue-600" aria-hidden="true" />
            </div>
            <span class="bg-blue-600 text-white text-xs font-bold rounded-md px-2 py-0.5">
              {{ ley.id }}
            </span>
            <h3 class="text-sm font-bold text-neutral-900 leading-tight">{{ nombreDisplay(ley) }}</h3>
          </div>
          <p class="text-xs text-neutral-600 leading-relaxed mb-4">{{ descDisplay(ley) }}</p>
          <div class="bg-blue-600 text-white rounded-lg p-3 font-mono text-sm font-semibold space-y-1">
            <p v-for="(formula, idx) in formulasDisplay(ley)" :key="idx" class="m-0">{{ formula }}</p>
          </div>
          <p v-if="(ley as any).nota" class="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3 leading-relaxed">
            {{ (ley as any).nota }}
          </p>
        </Card>
      </div>
    </div>
  </section>
</template>
