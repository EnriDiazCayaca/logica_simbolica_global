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
    // 1. Parsear
    const premisasNodos = payload.premisas.map(p => parsearExpresion(p))
    const conclusionNodo = parsearExpresion(payload.conclusion)

    // 2. Ejecutar motor (solver) - Esto podría ser asíncrono si el motor evoluciona
    // pero por ahora es síncrono. Lo envolvemos en una pequeña pausa para UX
    await new Promise(resolve => setTimeout(resolve, 600)) 

    const resultadoDemostracion = demostrarConclusion(premisasNodos, conclusionNodo)

    // 3. Generar trazabilidad con el motor
    const trazabilidad = construirTrazabilidad(premisasNodos, resultadoDemostracion)

    // 4. Mapear al estado de UI
    resultado.value = trazabilidad.esValido ? 'valida' : 'invalida'
    
    pasos.value = trazabilidad.pasos.map((p) => {
      // DECISIÓN DE DISEÑO: Mapeamos lineasBase (números) a un formato string para los badges
      // Ej: [1, 2] -> ["Línea 1", "Línea 2"]
      const premisasMapeadas = p.lineasBase.map(l => `Línea ${l}`)
      
      return {
        paso: p.numeroPaso,
        premisas: premisasMapeadas,
        conclusion: p.expresionSimbolica,
        regla: p.alias || p.operacion
      }
    })

    if (!trazabilidad.esValido) {
      error.value = "No se logró demostrar la conclusión con las reglas actuales."
    }

  } catch (e: any) {
    console.error("Error en inferencia:", e)
    resultado.value = 'error'
    error.value = e.message || "Ocurrió un error de sintaxis o procesamiento en el motor lógico."
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 p-6 md:p-12 text-neutral-900 font-sans">
    <div class="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 class="text-3xl font-bold text-blue-600">Motor de Inferencias</h1>
        <p class="text-neutral-600 mt-2">
          Ingresa tus premisas y la conclusión a demostrar paso a paso.
        </p>
      </header>

      <main class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Columna Izquierda: Controles e Indicador -->
        <div class="lg:col-span-5 space-y-8">
          <section class="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <FormularioInferencia 
              :isLoading="isLoading" 
              @submit="procesarInferencia" 
            />
          </section>

          <IndicadorResultado 
            :resultado="resultado" 
            :mensaje="error" 
          />
        </div>

        <!-- Columna Derecha: Trazabilidad -->
        <div class="lg:col-span-7">
          <section class="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 min-h-[400px]">
            <h2 class="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
              Trazabilidad Lógica
              <span v-if="isLoading" class="flex h-4 w-4 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
              </span>
            </h2>
            <PanelTrazabilidad :pasos="pasos" />
          </section>
        </div>
      </main>
    </div>
  </div>
</template>
