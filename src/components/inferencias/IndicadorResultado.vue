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
    descripcion: 'La conclusión se deduce correctamente de las premisas mediante derivación formal.',
    clasesIcono: 'bg-emerald-600 shadow-emerald-600/30',
    clasesTitulo: 'text-emerald-800',
    clasesBorde: 'border-l-emerald-600',
    clasesFondo: 'bg-gradient-to-r from-emerald-50/80 to-white'
  },
  invalida: {
    icono: X,
    titulo: 'Inferencia inválida (Refutada)',
    descripcion: 'El argumento no es válido. Se determinó un contraejemplo explícito que falsea la inferencia.',
    clasesIcono: 'bg-rose-600 shadow-rose-600/30',
    clasesTitulo: 'text-rose-800',
    clasesBorde: 'border-l-rose-600',
    clasesFondo: 'bg-gradient-to-r from-rose-50/80 to-white'
  },
  no_demostrable_directa: {
    icono: Compass,
    titulo: 'Inferencia válida (Método indirecto requerido)',
    descripcion: 'Argumento válido sin contraejemplos. Requiere métodos indirectos (Absurdo o Prueba Condicional).',
    clasesIcono: 'bg-indigo-600 shadow-indigo-600/30',
    clasesTitulo: 'text-indigo-800',
    clasesBorde: 'border-l-indigo-600',
    clasesFondo: 'bg-gradient-to-r from-indigo-50/80 to-white'
  },
  error: {
    icono: AlertTriangle,
    titulo: 'Error de sintaxis o procesamiento',
    descripcion: 'Ocurrió un problema al evaluar la expresión lógica.',
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
    <div
      v-if="estado"
      role="status"
      aria-live="polite"
      class="p-5 sm:p-6 rounded-3xl border shadow-sm transition-all duration-300 relative overflow-hidden"
      :class="[estado.clasesBorde, estado.clasesFondo]"
    >
      <div class="flex items-start sm:items-center gap-4 sm:gap-5">
        <div
          :class="[
            'flex h-13 w-13 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ring-4 ring-white/80',
            estado.clasesIcono
          ]"
          aria-hidden="true"
        >
          <component :is="estado.icono" :size="28" :stroke-width="2.5" />
        </div>

        <div class="min-w-0 flex-1">
          <h3 :class="['text-lg sm:text-xl font-extrabold tracking-tight leading-snug', estado.clasesTitulo]">
            {{ estado.titulo }}
          </h3>
          <p v-if="descripcion" class="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {{ descripcion }}
          </p>
        </div>
      </div>
    </div>
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
