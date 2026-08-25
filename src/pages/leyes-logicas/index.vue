<script setup lang="ts">
import { computed, ref } from 'vue'
import { LEYES_LOGICAS } from '@/data/logicLaws'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'

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
  <section class="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 mb-1">Leyes Lógicas</h1>
          <p class="text-neutral-500 text-sm">
            Consulta y aprende las reglas fundamentales de la lógica proposicional.
          </p>
        </div>
        <div class="flex items-center gap-2 border border-neutral-300 rounded-lg px-3 py-2 w-full sm:w-auto sm:min-w-[320px]">
          <span class="text-neutral-400">🔍</span>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar una ley lógica..."
            class="border-none outline-none text-sm w-full font-[inherit]"
          />
        </div>
      </div>

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
