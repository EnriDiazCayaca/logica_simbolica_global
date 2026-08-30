<script setup lang="ts">
import { computed, type Component } from 'vue'
import { AlertTriangle, Check, X, Compass } from '@lucide/vue'
import type { ResultadoInferencia } from '@/types/inferencias'
import Card from '@/components/ui/Card.vue'

interface Props {
  resultado: ResultadoInferencia
  mensaje?: string
}

const props = defineProps<Props>()

interface EstadoVisual {
  icono: Component
  titulo: string
  descripcion: string
  clasesIcono: string
  clasesTitulo: string
  clasesBorde: string
  clasesFondo: string
}

const ESTADOS: Record<Exclude<ResultadoInferencia, 'pendiente'>, EstadoVisual> = {
  valida: {
    icono: Check,
    titulo: 'Inferencia válida (Demostrada)',
    descripcion: 'La conclusión se deduce correctamente de las premisas mediante deducción directa.',
    clasesIcono: 'bg-emerald-600 shadow-emerald-600/30',
    clasesTitulo: 'text-emerald-800',
    clasesBorde: 'border-l-emerald-600',
    clasesFondo: 'bg-gradient-to-r from-emerald-50/80 to-white'
  },
  invalida: {
    icono: X,
    titulo: 'Inferencia inválida (Refutada)',
    descripcion: 'La conclusión no se sigue de las premisas. Se encontró un contraejemplo explícito que falsea el argumento.',
    clasesIcono: 'bg-rose-600 shadow-rose-600/30',
    clasesTitulo: 'text-rose-800',
    clasesBorde: 'border-l-rose-600',
    clasesFondo: 'bg-gradient-to-r from-rose-50/80 to-white'
  },
  no_demostrable_directa: {
    icono: Compass,
    titulo: 'Inferencia válida (Método indirecto requerido)',
    descripcion: 'El argumento es lógicamente válido (sin contraejemplos), pero su prueba formal requiere técnicas avanzadas como Reducción al Absurdo o Prueba Condicional.',
    clasesIcono: 'bg-indigo-600 shadow-indigo-600/30',
    clasesTitulo: 'text-indigo-800',
    clasesBorde: 'border-l-indigo-600',
    clasesFondo: 'bg-gradient-to-r from-indigo-50/80 to-white'
  },
  error: {
    icono: AlertTriangle,
    titulo: 'Error de sintaxis o procesamiento',
    descripcion: 'Ocurrió un problema al evaluar la inferencia.',
    clasesIcono: 'bg-amber-600 shadow-amber-600/30',
    clasesTitulo: 'text-amber-800',
    clasesBorde: 'border-l-amber-600',
    clasesFondo: 'bg-gradient-to-r from-amber-50/80 to-white'
  }
}

const estado = computed<EstadoVisual | null>(() => {
  if (props.resultado === 'pendiente') return null
  return ESTADOS[props.resultado]
})

const descripcion = computed<string>(() => {
  if (!estado.value) return ''
  if (props.resultado === 'error' && props.mensaje?.trim()) {
    return props.mensaje.trim()
  }
  return estado.value.descripcion
})
</script>

<template>
  <Transition name="aparecer">
    <Card
      v-if="estado"
      role="status"
      aria-live="polite"
      class="border-l-4 shadow-sm"
      :class="[estado.clasesBorde, estado.clasesFondo]"
    >
      <div class="flex items-center gap-4 sm:gap-5">
        <div
          :class="[
            'flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-full text-white shadow-xs',
            estado.clasesIcono
          ]"
          aria-hidden="true"
        >
          <component :is="estado.icono" :size="26" :stroke-width="2.5" />
        </div>

        <div class="min-w-0">
          <p :class="['text-xl sm:text-2xl font-bold tracking-tight', estado.clasesTitulo]">
            {{ estado.titulo }}
          </p>
          <p v-if="descripcion" class="mt-0.5 text-xs sm:text-sm text-neutral-600 leading-snug">
            {{ descripcion }}
          </p>
        </div>
      </div>
    </Card>
  </Transition>
</template>

<style scoped>
.aparecer-enter-active,
.aparecer-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.aparecer-enter-from,
.aparecer-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
