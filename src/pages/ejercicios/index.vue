<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ejercicios,
  etiquetasDificultad,
  puntosDificultad,
  etiquetasTema,
  claveTemaParaEjercicio,
  type Dificultad,
  type ClaveTema,
} from '@/data/exercises'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

const router = useRouter()
const tabActiva = ref<Dificultad | 'todos'>('todos')
const temaActivo = ref<ClaveTema | 'todos'>('todos')

const tabs: { id: Dificultad | 'todos'; etiqueta: string }[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'facil', etiqueta: 'Fácil' },
  { id: 'medio', etiqueta: 'Medio' },
  { id: 'dificil', etiqueta: 'Difícil' },
]

const tabsTema: { id: ClaveTema | 'todos'; etiqueta: string }[] = [
  { id: 'todos', etiqueta: 'Todos los temas' },
  ...(Object.entries(etiquetasTema) as [ClaveTema, string][]).map(([id, label]) => ({ id, etiqueta: label })),
]

const ejerciciosFiltrados = computed(() => {
  let lista = ejercicios
  if (tabActiva.value !== 'todos') {
    lista = lista.filter((ex) => ex.nivel === tabActiva.value)
  }
  if (temaActivo.value !== 'todos') {
    lista = lista.filter((ex) => claveTemaParaEjercicio(ex) === temaActivo.value)
  }
  return lista
})

function irAEjercicio(id: string) {
  router.push(`/ejercicios/${id}`)
}
</script>

<template>
  <section class="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-neutral-900 mb-2">Ejercicios Prácticos</h1>
      <p class="text-neutral-500 text-sm mb-6">
        Practica lógica proposicional mediante ejercicios interactivos.
      </p>

      <!-- Difficulty tabs -->
      <div class="flex gap-3 mb-4 flex-wrap">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'flex-1 min-w-[120px] py-3 px-4 rounded-xl font-bold text-sm transition-all',
            tabActiva === tab.id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-blue-50 text-neutral-700 hover:bg-blue-100'
          ]"
          @click="tabActiva = tab.id"
        >
          {{ tab.etiqueta }}
        </button>
      </div>

      <!-- Topic tabs -->
      <div class="flex gap-2 mb-6 flex-wrap">
        <button
          v-for="tab in tabsTema"
          :key="tab.id"
          :class="[
            'py-2 px-4 rounded-full text-xs font-semibold border transition-all',
            temaActivo === tab.id
              ? 'bg-neutral-900 text-white border-neutral-900'
              : 'bg-white text-neutral-700 border-neutral-200 hover:border-blue-400'
          ]"
          @click="temaActivo = tab.id"
        >
          {{ tab.etiqueta }}
        </button>
      </div>

      <!-- Exercise grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <Card v-for="ex in ejerciciosFiltrados" :key="ex.id" hoverable class="flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2 mb-1">
              <h3 class="text-base font-bold text-neutral-900">{{ ex.titulo }}</h3>
              <span v-if="ex.fuente" class="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded truncate max-w-[130px]" :title="ex.fuente">
                📖 {{ ex.fuente }}
              </span>
            </div>
            <p class="text-[11px] font-bold tracking-wide text-blue-600 mb-2 uppercase">
              {{ ex.categoria }}
            </p>
            <p class="text-sm text-neutral-500 mb-3">
              Nivel: <span aria-hidden="true">{{ puntosDificultad[ex.nivel] }}</span>
              {{ etiquetasDificultad[ex.nivel] }}
            </p>
            <p class="text-sm text-neutral-600 mb-4">{{ ex.descripcionCorta }}</p>
          </div>
          <Button variant="primary" size="sm" class="w-full mt-auto" @click="irAEjercicio(ex.id)">
            Resolver
          </Button>
        </Card>

        <p v-if="ejerciciosFiltrados.length === 0" class="text-neutral-400 text-sm col-span-full text-center py-8">
          No hay ejercicios que coincidan con estos filtros.
        </p>
      </div>
    </div>
  </section>
</template>
