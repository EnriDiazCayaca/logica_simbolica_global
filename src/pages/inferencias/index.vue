<script setup lang="ts">
import { ref } from 'vue'
import type { InferenciaRequest, ResultadoInferencia, PasoInferencia } from '@/types/inferencias'
import { parsearExpresion } from '@/lib/solver/parser'
import { demostrarConclusion } from '@/lib/solver/solver'
import { construirTrazabilidad } from '@/lib/trazabilidad/historial'

import FormularioInferencia from '@/components/inferencias/FormularioInferencia.vue'
import IndicadorResultado from '@/components/inferencias/IndicadorResultado.vue'
import PanelTrazabilidad from '@/components/inferencias/PanelTrazabilidad.vue'

// Estado global de la UI
const isLoading = ref(false)
const resultado = ref<ResultadoInferencia>('pendiente')
const error = ref<string | undefined>(undefined)
const pasos = ref<PasoInferencia[]>([])

const procesarInferencia = async (payload: InferenciaRequest) => {
  isLoading.value = true
  resultado.value = 'pendiente'
  error.value = undefined
  pasos.value = []

  try {
    // 1. Parsear premisas y conclusión (el payload ya viene sanitizado/normalizado)
    const premisasNodos = payload.premisas.map((p) => parsearExpresion(p))
    const conclusionNodo = parsearExpresion(payload.conclusion)

    // 2. Pequeña pausa para feedback visual de carga en la UI
    await new Promise((resolve) => setTimeout(resolve, 450))

    // 3. Ejecutar motor (solver)
    const resultadoDemostracion = demostrarConclusion(premisasNodos, conclusionNodo)

    // 4. Generar trazabilidad con el motor
    const trazabilidad = construirTrazabilidad(premisasNodos, resultadoDemostracion)

    // 5. Mapear al estado de UI
    resultado.value = trazabilidad.esValido ? 'valida' : 'invalida'

    pasos.value = trazabilidad.pasos.map((p) => {
      const premisasMapeadas = p.lineasBase.map((l) => `Línea ${l}`)

      return {
        paso: p.numeroPaso,
        premisas: premisasMapeadas,
        conclusion: p.expresionSimbolica,
        regla: p.alias || p.operacion
      }
    })

    if (!trazabilidad.esValido) {
      error.value = 'No se logró demostrar la conclusión con las reglas lógicas evaluadas.'
    }
  } catch (e: any) {
    console.error('Error en inferencia:', e)
    resultado.value = 'error'
    error.value = e.message || 'Ocurrió un error de sintaxis o procesamiento en el motor lógico.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 p-6 md:p-10 text-neutral-900 font-sans">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Navegación & Encabezado -->
      <div>
        <router-link
          to="/"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-3"
        >
          &larr; Volver al Inicio
        </router-link>
        <h1 class="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Demostrador de Inferencias Lógicas
        </h1>
        <p class="text-sm text-neutral-600 mt-1.5">
          Escribe tus premisas con simbología formal y valida la deducción lógica paso a paso.
        </p>
      </div>

      <main class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Columna Izquierda: Formulario y Teclado Simbólico -->
        <div class="lg:col-span-6 space-y-6">
          <section class="bg-white p-6 rounded-xl shadow-sm border border-neutral-200/80">
            <FormularioInferencia
              :isLoading="isLoading"
              @submit="procesarInferencia"
            />
          </section>
        </div>

        <!-- Columna Derecha: Indicador de Resultado (Arriba) & Trazabilidad (Abajo) -->
        <div class="lg:col-span-6 space-y-6">
          <!-- Indicador de Resultado (Posicionado arriba de la trazabilidad) -->
          <IndicadorResultado
            :resultado="resultado"
            :mensaje="error"
          />

          <!-- Panel de Trazabilidad Lógica -->
          <section class="bg-white p-6 rounded-xl shadow-sm border border-neutral-200/80 min-h-[380px]">
            <div class="flex items-center justify-between border-b border-neutral-100 pb-4 mb-5">
              <h2 class="text-lg font-bold text-neutral-800 flex items-center gap-2">
                <span>⚡</span> Trazabilidad de la Demostración
              </h2>
              <span v-if="isLoading" class="flex items-center gap-2 text-xs font-medium text-blue-600">
                <span class="flex h-2.5 w-2.5 relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                </span>
                Calculando...
              </span>
            </div>

            <PanelTrazabilidad :pasos="pasos" />
          </section>
        </div>
      </main>
    </div>
  </div>
</template>
