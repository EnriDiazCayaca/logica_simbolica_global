<script setup lang="ts">
/**
 * PanelTrazabilidad.vue
 * Renderiza el paso a paso de una deducción lógica de forma didáctica.
 *
 * Tipos reales (Arom, src/types/inferencias.ts):
 *   interface PasoInferencia {
 *     paso: number
 *     premisas: string[]
 *     conclusion: string
 *     regla: string   // ej. "Modus Ponens"
 *   }
 */
import type { PasoInferencia } from '@/types/inferencias'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
 
const props = defineProps<{
  pasos: PasoInferencia[]
}>()
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
      >
        <div class="flex items-start gap-3">
          <!-- Número de paso -->
          <div
            class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
            aria-hidden="true"
          >
            {{ paso.paso }}
          </div>
 
          <div class="min-w-0 flex-1">
            <!-- Regla aplicada -->
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="blue">
                {{ paso.regla }}
              </Badge>
            </div>
 
            <!-- Premisas usadas en este paso -->
            <div v-if="paso.premisas?.length" class="mb-2 flex flex-wrap gap-x-2 gap-y-1">
              <span
                v-for="(premisa, pIndex) in paso.premisas"
                :key="pIndex"
                class="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600"
              >
                {{ premisa }}
              </span>
            </div>
 
            <!-- Conclusión del paso (foco de atención) -->
            <p class="font-medium text-neutral-900 break-words">
              &there4; {{ paso.conclusion }}
            </p>
          </div>
        </div>
      </Card>
    </TransitionGroup>
 
    <!-- Estado vacío -->
    <p
      v-if="!props.pasos || props.pasos.length === 0"
      class="py-6 text-center text-sm text-neutral-600"
    >
      Aún no hay pasos de deducción para mostrar.
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
</style>
