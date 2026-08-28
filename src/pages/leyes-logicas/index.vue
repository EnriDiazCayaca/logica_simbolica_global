<script setup lang="ts">
import { computed, ref } from 'vue'
import { LEYES_LOGICAS } from '@/data/logicLaws'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import OrbitalHeader from '@/components/ui/OrbitalHeader.vue'

const busqueda = ref('')

const leyesFiltradas = computed(() => {
  const termino = busqueda.value.trim().toLowerCase()
  if (!termino) return LEYES_LOGICAS
  return LEYES_LOGICAS.filter(
    (ley) =>
      ley.nombre.toLowerCase().includes(termino) ||
      ley.descripcion.toLowerCase().includes(termino) ||
      ley.formulas.some((f) => f.toLowerCase().includes(termino)),
  )
})
</script>

<template>
  <section class="min-h-screen bg-[#f8fafc] py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto space-y-6">
      <OrbitalHeader icon="≡" kicker="Biblioteca Formal · Equivalencias" title="Leyes Lógicas" subtitle="Consulta y aprende las reglas fundamentales de la lógica proposicional.">
        <template #chips>
          <span class="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-white/80">¬(p ∧ q) ≡ ¬p ∨ ¬q</span>
          <span class="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-white/80">p → q ≡ ¬p ∨ q</span>
          <span class="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-white/80">Distribución ≡ De Morgan</span>
        </template>
        <div class="flex items-center gap-2 bg-white/10 border border-white/15 rounded-lg px-3 py-2 w-full sm:w-auto sm:min-w-[320px] backdrop-blur">
          <span class="text-white/60">🔍</span>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar una ley lógica..."
            class="bg-transparent border-none outline-none text-sm w-full font-[inherit] text-white placeholder:text-white/50"
          />
        </div>
      </OrbitalHeader>

      <p v-if="leyesFiltradas.length === 0" class="text-neutral-400 text-sm mb-6">
        No se encontraron leyes que coincidan con "{{ busqueda }}".
      </p>

      <!-- Laws grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card v-for="ley in leyesFiltradas" :key="ley.id">
          <div class="flex items-center gap-2 mb-3">
            <span class="bg-blue-600 text-white text-xs font-bold rounded-md px-2 py-0.5">
              {{ ley.id }}
            </span>
            <h3 class="text-sm font-bold text-neutral-900">{{ ley.nombre }}</h3>
          </div>
          <p class="text-xs text-neutral-600 leading-relaxed mb-4">{{ ley.descripcion }}</p>
          <div class="bg-blue-600 text-white rounded-lg p-3 font-mono text-sm font-semibold space-y-1">
            <p v-for="(formula, idx) in ley.formulas" :key="idx" class="m-0">{{ formula }}</p>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
