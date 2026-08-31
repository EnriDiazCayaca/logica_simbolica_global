<script setup lang="ts">
import { computed, type Component } from 'vue'
import { AlertTriangle, CheckCircle2, XCircle, Compass } from '@lucide/vue'
import type { ResultadoInferencia } from '@/types/inferencias'

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
    icono: CheckCircle2,
    titulo: 'Inferencia válida (Demostrada)',
    descripcion: 'La conclusión se deduce correctamente de las premisas mediante derivación formal.',
    clasesIcono: 'bg-emerald-600 text-white',
    clasesTitulo: 'text-emerald-950',
    clasesBorde: 'border-emerald-200 ring-1 ring-emerald-500/10',
    clasesFondo: 'bg-gradient-to-r from-emerald-50/90 via-emerald-50/40 to-white'
  },
  invalida: {
    icono: XCircle,
    titulo: 'Inferencia inválida (Refutada)',
    descripcion: 'El argumento no es válido. Se determinó un contraejemplo explícito que falsea la inferencia.',
    clasesIcono: 'bg-rose-600 text-white',
    clasesTitulo: 'text-rose-950',
    clasesBorde: 'border-rose-200 ring-1 ring-rose-500/10',
    clasesFondo: 'bg-gradient-to-r from-rose-50/90 via-rose-50/40 to-white'
  },
  no_demostrable_directa: {
    icono: Compass,
    titulo: 'Inferencia válida (Método indirecto requerido)',
    descripcion: 'Argumento válido sin contraejemplos. Requiere métodos indirectos (Absurdo o Prueba Condicional).',
    clasesIcono: 'bg-indigo-600 text-white',
    clasesTitulo: 'text-indigo-950',
    clasesBorde: 'border-indigo-200 ring-1 ring-indigo-500/10',
    clasesFondo: 'bg-gradient-to-r from-indigo-50/90 via-indigo-50/40 to-white'
  },
  error: {
    icono: AlertTriangle,
    titulo: 'Error de sintaxis o procesamiento',
    descripcion: 'Ocurrió un problema al evaluar la expresión lógica.',
    clasesIcono: 'bg-amber-600 text-white',
    clasesTitulo: 'text-amber-950',
    clasesBorde: 'border-amber-200 ring-1 ring-amber-500/10',
    clasesFondo: 'bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-white'
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
      class="p-4 sm:p-5 rounded-2xl border shadow-xs transition-all duration-300 relative overflow-hidden"
      :class="[estado.clasesBorde, estado.clasesFondo]"
    >
      <div class="flex items-start gap-3.5 sm:gap-4">
        <div
          :class="[
            'flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl shadow-xs',
            estado.clasesIcono
          ]"
          aria-hidden="true"
        >
          <component :is="estado.icono" :size="22" :stroke-width="2" />
        </div>

        <div class="min-w-0 flex-1">
          <h3 :class="['text-sm sm:text-base font-bold tracking-tight leading-snug', estado.clasesTitulo]">
            {{ estado.titulo }}
          </h3>
          <p v-if="descripcion" class="mt-0.5 text-xs text-slate-600 leading-relaxed">
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
