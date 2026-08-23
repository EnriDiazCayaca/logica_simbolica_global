<script setup lang="ts">
/**
 * PanelTrazabilidad.vue
 * Renderiza el paso a paso de una deducción lógica con acordeones explicativos.
 */
import { ref } from 'vue'
import { ChevronDown, Info } from '@lucide/vue'
import type { PasoInferencia } from '@/types/inferencias'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'

const props = defineProps<{
  pasos: PasoInferencia[]
}>()

// Registro de pasos cuyo acordeón de explicación está abierto
const pasosAbiertos = ref<Record<number, boolean>>({})

const togglePaso = (numeroPaso: number) => {
  pasosAbiertos.value[numeroPaso] = !pasosAbiertos.value[numeroPaso]
}
</script>

<template>
  <section
    class="space-y-3"
    role="list"
    aria-label="Trazabilidad de la deducción lógica"
    aria-live="polite"
  >
    <TransitionGroup name="fade" tag="div" class="space-y-3">
      <Card
        v-for="paso in props.pasos"
        :key="paso.paso"
        hoverable
        role="listitem"
        class="transition-all"
      >
        <div class="flex items-start gap-3">
          <!-- Número de paso -->
          <div
            class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-xs"
            aria-hidden="true"
          >
            {{ paso.paso }}
          </div>

          <div class="min-w-0 flex-1 space-y-2">
            <!-- Encabezado del paso: Regla y botón de acordeón -->
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex flex-wrap items-center gap-2">
                <Badge variant="blue">
                  {{ paso.regla }}
                </Badge>

                <!-- Premisas usadas en este paso -->
                <div v-if="paso.premisas?.length" class="flex flex-wrap gap-1">
                  <span
                    v-for="(premisa, pIndex) in paso.premisas"
                    :key="pIndex"
                    class="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 border border-neutral-200/60"
                  >
                    {{ premisa }}
                  </span>
                </div>
              </div>

              <!-- Botón desplegable / acordeón de explicación -->
              <button
                v-if="paso.explicacion"
                type="button"
                @click="togglePaso(paso.paso)"
                :aria-expanded="Boolean(pasosAbiertos[paso.paso])"
                :title="pasosAbiertos[paso.paso] ? 'Ocultar explicación didáctica' : 'Ver explicación didáctica'"
                class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors border border-blue-200/60 cursor-pointer"
              >
                <Info :size="13" />
                <span>{{ pasosAbiertos[paso.paso] ? 'Ocultar explicación' : '¿Por qué esta regla?' }}</span>
                <ChevronDown
                  :size="14"
                  class="transition-transform duration-200"
                  :class="{ 'rotate-180': pasosAbiertos[paso.paso] }"
                />
              </button>
            </div>

            <!-- Conclusión del paso (foco de atención) -->
            <div class="flex items-center gap-2 pt-0.5">
              <span class="text-neutral-400 font-serif text-base">&there4;</span>
              <p class="font-mono text-sm md:text-base font-bold text-neutral-900 break-words">
                {{ paso.conclusion }}
              </p>
            </div>

            <!-- Contenido desplegable del acordeón (Explicación didáctica) -->
            <Transition name="desplegar">
              <div
                v-if="pasosAbiertos[paso.paso] && paso.explicacion"
                class="mt-2.5 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-1.5 shadow-2xs"
              >
                <div class="flex items-center gap-1.5 font-bold text-blue-900 text-xs uppercase tracking-wider">
                  <span>📖</span> Explicación de la deducción:
                </div>
                <p class="text-neutral-700">
                  {{ paso.explicacion }}
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </Card>
    </TransitionGroup>

    <!-- Estado vacío -->
    <p
      v-if="!props.pasos || props.pasos.length === 0"
      class="py-8 text-center text-sm text-neutral-500"
    >
      Aún no hay pasos de deducción para mostrar. Ingresa las premisas y presiona Demostrar.
    </p>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.fade-leave-to {
  opacity: 0;
}

.desplegar-enter-active,
.desplegar-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.desplegar-enter-from,
.desplegar-leave-to {
  opacity: 0;
  transform: translateY(-4px);
  max-height: 0;
}
.desplegar-enter-to,
.desplegar-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 300px;
}
</style>
