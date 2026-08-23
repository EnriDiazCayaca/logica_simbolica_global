<script setup lang="ts">
import { computed, type Component } from 'vue'
import { AlertTriangle, Check, X } from '@lucide/vue'
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
}

const ESTADOS: Record<Exclude<ResultadoInferencia, 'pendiente'>, EstadoVisual> = {
  valida: {
    icono: Check,
    titulo: 'Inferencia válida',
    descripcion: 'La conclusión se deduce correctamente de las premisas.',
    clasesIcono: 'bg-green-600',
    clasesTitulo: 'text-green-600',
    clasesBorde: 'border-l-green-600'
  },
  invalida: {
    icono: X,
    titulo: 'Inferencia inválida',
    descripcion: 'La conclusión no se deduce de las premisas.',
    clasesIcono: 'bg-orange-600',
    clasesTitulo: 'text-orange-600',
    clasesBorde: 'border-l-orange-600'
  },
  error: {
    icono: AlertTriangle,
    titulo: 'Error en la inferencia',
    descripcion: '',
    clasesIcono: 'bg-red-600',
    clasesTitulo: 'text-red-600',
    clasesBorde: 'border-l-red-600'
  }
}

const estado = computed<EstadoVisual | null>(() => {
  if (props.resultado === 'pendiente') return null
  return ESTADOS[props.resultado]
})

const descripcion = computed<string>(() => {
  if (!estado.value) return ''
  if (props.resultado === 'error') {
    return props.mensaje?.trim() || 'Ocurrió un problema al evaluar la inferencia.'
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
      class="border-l-4"
      :class="estado.clasesBorde"
    >
      <div class="flex items-center gap-4 sm:gap-5">
        <div
          :class="[
            'flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-white sm:h-16 sm:w-16',
            estado.clasesIcono
          ]"
          aria-hidden="true"
        >
          <component :is="estado.icono" :size="30" :stroke-width="2.5" />
        </div>

        <div class="min-w-0">
          <p :class="['text-2xl font-bold md:text-4xl', estado.clasesTitulo]">
            {{ estado.titulo }}
          </p>
          <p v-if="descripcion" class="mt-1 text-sm text-neutral-600 sm:text-base">
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
