<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  totalEjercicios,
  conteoCompletados,
  porcentajeProgreso,
  porcentajePrecision,
  progresoPorTema,
  temasDebiles,
  temaRecomendado,
  nivel,
  estadoProgreso,
} from '@/store/progress'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import OrbitalHeader from '@/components/ui/OrbitalHeader.vue'

const router = useRouter()

const estadoLabel: Record<string, string> = {
  completado: 'Completado',
  'en-progreso': 'En progreso',
  pendiente: 'Pendiente',
}

const chartDays = computed(() =>
  estadoProgreso.registroDiario.map((d) => ({
    fecha: d.fecha,
    label: new Date(d.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', ''),
    accuracy: d.total === 0 ? 0 : Math.round((d.correctas / d.total) * 100),
  })),
)

const chartPath = computed(() => {
  const points = chartDays.value
  if (points.length < 2) return ''
  const w = 260
  const h = 140
  const stepX = w / (points.length - 1)
  return points
    .map((p, idx) => {
      const x = idx * stepX
      const y = h - (p.accuracy / 100) * h
      return `${idx === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
})

const chartPoints = computed(() => {
  const points = chartDays.value
  if (points.length < 2) return []
  const w = 260
  const h = 140
  const stepX = w / (points.length - 1)
  return points.map((p, idx) => ({ x: idx * stepX, y: h - (p.accuracy / 100) * h }))
})

function goPractice(topicKey: string) {
  router.push({ path: '/ejercicios', query: { tema: topicKey } })
}
</script>

<template>
  <section class="min-h-screen bg-[#f8fafc] py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto space-y-6">
      <OrbitalHeader icon="◈" kicker="Tu Trayectoria · Analytics" title="Mi Progreso" subtitle="Resumen de tu avance en lógica simbólica, precisión y temas por reforzar.">
        <template #chips>
          <span class="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-white/80">Progreso · Precisión</span>
          <span class="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-white/80">Nivel · Racha</span>
          <span class="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-white/80">◈ Stats</span>
        </template>
      </OrbitalHeader>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p class="text-xs text-neutral-500 mb-1">Ejercicios</p>
          <p class="text-2xl font-bold text-neutral-900">{{ conteoCompletados }}<span class="text-sm font-normal text-neutral-400">/{{ totalEjercicios }}</span></p>
        </Card>
        <Card>
          <p class="text-xs text-neutral-500 mb-1">Progreso</p>
          <p class="text-2xl font-bold text-neutral-900">{{ porcentajeProgreso }}%</p>
          <div class="w-full bg-neutral-200 rounded-full h-1.5 mt-2">
            <div class="bg-blue-600 h-1.5 rounded-full transition-all" :style="{ width: porcentajeProgreso + '%' }" />
          </div>
        </Card>
        <Card>
          <p class="text-xs text-neutral-500 mb-1">Precisión</p>
          <p class="text-2xl font-bold text-neutral-900">{{ porcentajePrecision }}%</p>
        </Card>
        <Card>
          <p class="text-xs text-neutral-500 mb-1">Nivel</p>
          <p class="text-2xl font-bold text-neutral-900">{{ nivel.numero }}<span class="text-sm font-normal text-neutral-400"> · {{ nivel.etiqueta }}</span></p>
        </Card>
      </div>

      <!-- Gráfico + Recomendaciones -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <h3 class="text-sm font-bold text-neutral-700 mb-3">Evolución de precisión</h3>
          <div v-if="chartDays.length >= 2" class="bg-neutral-50 rounded-lg p-3">
            <svg viewBox="0 0 260 140" class="w-full h-auto">
              <path :d="chartPath" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <circle v-for="(pt, i) in chartPoints" :key="i" :cx="pt.x" :cy="pt.y" r="3" fill="#2563EB" />
            </svg>
            <div class="flex justify-between text-[10px] text-neutral-400 mt-1 px-1">
              <span v-for="d in chartDays" :key="d.fecha">{{ d.label }}</span>
            </div>
          </div>
          <p v-else class="text-xs text-neutral-400 text-center py-8">Aún no hay datos suficientes para el gráfico.</p>
        </Card>

        <Card>
          <h3 class="text-sm font-bold text-neutral-700 mb-3">Recomendaciones</h3>
          <ul class="space-y-2">
            <li v-if="temaRecomendado" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p class="text-xs text-blue-700 font-semibold">Tema recomendado: {{ temaRecomendado.etiqueta }}</p>
              <p class="text-xs text-blue-500 mt-0.5">Precisión actual: {{ temaRecomendado.precision }}%</p>
              <Button size="sm" class="mt-2" @click="goPractice(temaRecomendado.clave)">Practicar ahora</Button>
            </li>
            <li v-if="temasDebiles.length > 0" class="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p class="text-xs text-amber-700 font-semibold">Refuerza: {{ temasDebiles[0].etiqueta }}</p>
              <p class="text-xs text-amber-500 mt-0.5">Precisión: {{ temasDebiles[0].precision }}%</p>
              <Button size="sm" variant="secondary" class="mt-2" @click="goPractice(temasDebiles[0].clave)">Reforzar</Button>
            </li>
            <li v-if="!temaRecomendado && temasDebiles.length === 0" class="text-xs text-neutral-400 text-center py-4">
              ¡Comienza ejercicios para ver recomendaciones!
            </li>
          </ul>
        </Card>
      </div>

      <!-- Progreso por tema -->
      <Card>
        <h3 class="text-sm font-bold text-neutral-700 mb-4 border-b border-neutral-200 pb-2">Progreso por tema</h3>
        <div class="space-y-3">
          <div v-for="tema in progresoPorTema" :key="tema.clave" class="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-semibold text-neutral-800 truncate">{{ tema.etiqueta }}</span>
                <Badge :variant="tema.estado === 'completado' ? 'green' : tema.estado === 'en-progreso' ? 'blue' : 'yellow'">
                  {{ estadoLabel[tema.estado] }}
                </Badge>
              </div>
              <div class="flex items-center gap-3 text-xs text-neutral-500">
                <span>{{ tema.ejerciciosCompletados }}/{{ tema.ejerciciosTotal }} ejercicios</span>
                <span v-if="tema.total > 0">Precisión: {{ tema.precision }}%</span>
              </div>
              <div class="w-full bg-neutral-200 rounded-full h-1 mt-2">
                <div
                  class="h-1 rounded-full transition-all"
                  :class="tema.estado === 'completado' ? 'bg-emerald-500' : tema.estado === 'en-progreso' ? 'bg-blue-500' : 'bg-neutral-300'"
                  :style="{ width: (tema.ejerciciosTotal > 0 ? (tema.ejerciciosCompletados / tema.ejerciciosTotal) * 100 : 0) + '%' }"
                />
              </div>
            </div>
            <Button size="sm" variant="secondary" @click="goPractice(tema.clave)">Practicar</Button>
          </div>
        </div>
      </Card>

      <!-- Actividad reciente -->
      <Card v-if="estadoProgreso.actividadReciente.length > 0">
        <h3 class="text-sm font-bold text-neutral-700 mb-3 border-b border-neutral-200 pb-2">Actividad reciente</h3>
        <div class="space-y-2">
          <div v-for="(act, idx) in estadoProgreso.actividadReciente" :key="idx" class="flex items-center gap-3 text-xs py-1.5">
            <span :class="act.correcta ? 'text-emerald-500' : 'text-red-500'" class="font-bold text-sm">{{ act.correcta ? '✓' : '✗' }}</span>
            <span class="text-neutral-600 flex-1">{{ act.etiqueta }}</span>
            <span class="text-neutral-400">{{ act.fecha }}</span>
          </div>
        </div>
      </Card>
    </div>
  </section>
</template>
