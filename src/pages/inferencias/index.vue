<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type {
  InferenciaRequest,
  ResultadoInferencia,
  PasoInferencia,
  ErrorLogico
} from '@/types/inferencias'
import { parsearExpresion } from '@/lib/solver/parser'
import { demostrarConclusion } from '@/lib/solver/solver'
import { construirTrazabilidad } from '@/lib/trazabilidad/historial'

import FormularioInferencia from '@/components/inferencias/FormularioInferencia.vue'
import TraductorLenguajeNatural from '@/components/inferencias/TraductorLenguajeNatural.vue'
import ArbolAST from '@/components/inferencias/ArbolAST.vue'
import IndicadorResultado from '@/components/inferencias/IndicadorResultado.vue'
import PanelTrazabilidad from '@/components/inferencias/PanelTrazabilidad.vue'
import { History, Trash2, Keyboard, BookOpen, TreePine, Network } from '@lucide/vue'

interface ItemHistorial {
  id: string
  fecha: string
  premisas: string[]
  conclusion: string
  resultado: ResultadoInferencia
}

// Pestaña activa en la columna izquierda
const activeTab = ref<'simbolos' | 'lenguaje' | 'arbol'>('simbolos')

// Estado de fórmulas sincronizado entre pestañas
const formulaData = ref<{ premisas: string[]; conclusion: string }>({
  premisas: [],
  conclusion: ''
})

// Estado global de la UI
const isLoading = ref(false)
const resultado = ref<ResultadoInferencia>('pendiente')
const error = ref<string | undefined>(undefined)
const errorLogicoActual = ref<ErrorLogico | undefined>(undefined)
const pasos = ref<PasoInferencia[]>([])
const historialLocal = ref<ItemHistorial[]>([])
const mostrarHistorial = ref(false)

const STORAGE_KEY = 'lhdl_historial_inferencias'

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      historialLocal.value = JSON.parse(raw)
    }
  } catch (err) {
    console.error('Error cargando historial de localStorage:', err)
  }
})

const guardarEnHistorial = (
  premisas: string[],
  conclusion: string,
  res: ResultadoInferencia
) => {
  try {
    const nuevo: ItemHistorial = {
      id: Date.now().toString(),
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      premisas,
      conclusion,
      resultado: res
    }
    const filtrado = [
      nuevo,
      ...historialLocal.value.filter(
        (h) => h.premisas.join(';') !== premisas.join(';') || h.conclusion !== conclusion
      )
    ].slice(0, 6)

    historialLocal.value = filtrado
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrado))
  } catch (err) {
    console.error('Error guardando en localStorage:', err)
  }
}

const limpiarHistorial = () => {
  historialLocal.value = []
  localStorage.removeItem(STORAGE_KEY)
}

const restaurarDesdeHistorial = (item: ItemHistorial) => {
  formulaData.value = {
    premisas: item.premisas,
    conclusion: item.conclusion
  }
  procesarInferencia({
    premisas: item.premisas,
    conclusion: item.conclusion
  })
}

const handleFormUpdate = (data: { premisas: string[]; conclusion: string }) => {
  formulaData.value = data
}

const procesarInferencia = async (payload: InferenciaRequest) => {
  isLoading.value = true
  resultado.value = 'pendiente'
  error.value = undefined
  errorLogicoActual.value = undefined
  pasos.value = []

  try {
    // 1. Parsear premisas y conclusión
    const premisasNodos = payload.premisas.map((p) => parsearExpresion(p))
    const conclusionNodo = parsearExpresion(payload.conclusion)

    // 2. Pequeña pausa para feedback visual
    await new Promise((resolve) => setTimeout(resolve, 300))

    // 3. Ejecutar motor (solver)
    const resultadoDemostracion = demostrarConclusion(premisasNodos, conclusionNodo)

    // 4. Generar trazabilidad con el motor
    const trazabilidad = construirTrazabilidad(premisasNodos, resultadoDemostracion)

    // 5. Mapear estado formal explícito (Válida demostrada, Válida método indirecto, Inválida refutada)
    if (trazabilidad.esValido) {
      resultado.value = 'valida'
    } else if (resultadoDemostracion.errorLogico?.tipo === 'DEMOSTRACION_INCOMPLETA') {
      resultado.value = 'no_demostrable_directa'
    } else {
      resultado.value = 'invalida'
    }

    errorLogicoActual.value = resultadoDemostracion.errorLogico

    pasos.value = trazabilidad.pasos.map((p) => {
      const premisasMapeadas = p.lineasBase.map((l) => `Línea ${l}`)

      return {
        paso: p.numeroPaso,
        premisas: premisasMapeadas,
        conclusion: p.expresionSimbolica,
        regla: p.alias || p.operacion,
        explicacion: p.explicacion,
        detalle: p.detalle
      }
    })

    guardarEnHistorial(payload.premisas, payload.conclusion, resultado.value)

    if (!trazabilidad.esValido) {
      error.value = resultadoDemostracion.errorLogico?.mensaje
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
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden selection:bg-blue-500/20">
    <!-- Fondo ambiental decorativo -->
    <div class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-teal-400/5 blur-3xl rounded-full"></div>

    <div class="relative max-w-6xl mx-auto p-4 sm:p-6 md:p-10 space-y-7">
      <!-- Navegación & Encabezado Principal -->
      <div class="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-2">
            <router-link
              to="/"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-blue-700 bg-slate-100/90 hover:bg-blue-50 rounded-lg transition-colors"
            >
              &larr; Volver al Inicio
            </router-link>
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
              Equipo Los Hijos de Linus
            </span>
          </div>

          <!-- Botón de Historial Local -->
          <button
            v-if="historialLocal.length > 0"
            type="button"
            @click="mostrarHistorial = !mostrarHistorial"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-xl border border-slate-300/80 shadow-2xs cursor-pointer transition-all active:scale-95"
          >
            <History :size="14" class="text-blue-600" />
            <span>{{ mostrarHistorial ? 'Ocultar Historial' : `Historial Reciente (${historialLocal.length})` }}</span>
          </button>
        </div>

        <div class="flex items-start gap-4">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/30">
            <Network :size="28" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950">
              Demostrador de Inferencias Lógicas
            </h1>
            <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Ingresa tus premisas con simbología formal, visualiza su traducción a lenguaje natural, explora el árbol de derivación (AST) y comprueba deducciones formales paso a paso.
            </p>
          </div>
        </div>
      </div>

      <!-- Panel Desplegable de Historial Local -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mostrarHistorial && historialLocal.length > 0" class="p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <History :size="15" class="text-blue-600" /> Ejercicios Demostrados Recientemente
            </span>
            <button
              type="button"
              @click="limpiarHistorial"
              class="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 :size="12" /> Limpiar Historial
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div
              v-for="item in historialLocal"
              :key="item.id"
              @click="restaurarDesdeHistorial(item)"
              class="p-3 bg-slate-50/80 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 rounded-xl cursor-pointer transition-all space-y-1.5 shadow-2xs hover:shadow-xs group"
            >
              <div class="flex items-center justify-between text-[10px]">
                <span
                  class="font-bold uppercase px-2 py-0.5 rounded-md text-[10px]"
                  :class="{
                    'bg-emerald-100 text-emerald-800': item.resultado === 'valida',
                    'bg-indigo-100 text-indigo-800': item.resultado === 'no_demostrable_directa',
                    'bg-rose-100 text-rose-800': item.resultado === 'invalida' || item.resultado === 'error'
                  }"
                >
                  {{ item.resultado === 'valida' ? 'Válida' : item.resultado === 'no_demostrable_directa' ? 'Válida (Ind.)' : 'Inválida' }}
                </span>
                <span class="text-slate-400 font-mono text-[10px]">{{ item.fecha }}</span>
              </div>
              <div class="font-mono text-xs text-slate-800 truncate font-semibold">
                {{ item.premisas.join('; ') }}
              </div>
              <div class="text-[11px] text-blue-700 font-mono font-bold flex items-center gap-1">
                <span>&there4;</span> {{ item.conclusion }}
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <main class="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        <!-- Columna Izquierda: Pestañas de Entrada (Símbolos vs Lenguaje Natural vs Árbol AST) -->
        <div :class="activeTab === 'arbol' ? 'lg:col-span-12 space-y-4' : 'lg:col-span-6 space-y-4'">
          <!-- Switcher de Pestañas (Segmented Control) -->
          <div class="inline-flex items-center gap-1 p-1 bg-slate-200/75 rounded-2xl border border-slate-200/90 shadow-inner w-full sm:w-fit overflow-x-auto">
            <button
              type="button"
              @click="activeTab = 'simbolos'"
              :class="[
                'flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap',
                activeTab === 'simbolos'
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              ]"
            >
              <Keyboard :size="14" /> Simbología Formal
            </button>
            <button
              type="button"
              @click="activeTab = 'lenguaje'"
              :class="[
                'flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap',
                activeTab === 'lenguaje'
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              ]"
            >
              <BookOpen :size="14" /> Lenguaje Natural
            </button>
            <button
              type="button"
              @click="activeTab = 'arbol'"
              :class="[
                'flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap',
                activeTab === 'arbol'
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              ]"
            >
              <TreePine :size="14" /> Árbol de Nodos (AST)
            </button>
          </div>

          <!-- Contenido de Pestaña 1: Formulario Simbólico -->
          <div v-show="activeTab === 'simbolos'">
            <section class="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-slate-200/90">
              <FormularioInferencia
                :isLoading="isLoading"
                :premisasIniciales="formulaData.premisas"
                :conclusionInicial="formulaData.conclusion"
                @submit="procesarInferencia"
                @update:modelValue="handleFormUpdate"
              />
            </section>
          </div>

          <!-- Contenido de Pestaña 2: Traductor a Lenguaje Natural -->
          <div v-show="activeTab === 'lenguaje'">
            <TraductorLenguajeNatural
              :premisas="formulaData.premisas"
              :conclusion="formulaData.conclusion"
            />
          </div>

          <!-- Contenido de Pestaña 3: Árbol de Nodos (AST) -->
          <div v-show="activeTab === 'arbol'">
            <section class="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-slate-200/90">
              <ArbolAST
                :premisas="formulaData.premisas"
                :conclusion="formulaData.conclusion"
              />
            </section>
          </div>
        </div>

        <!-- Columna Derecha: Indicador de Resultado & Trazabilidad con Contraejemplos / Exportación -->
        <div :class="activeTab === 'arbol' ? 'lg:col-span-12 space-y-6' : 'lg:col-span-6 space-y-6'">
          <!-- Indicador de Resultado -->
          <IndicadorResultado
            :resultado="resultado"
            :mensaje="error"
          />

          <!-- Panel de Trazabilidad / Análisis de la Demostración -->
          <section class="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-slate-200/90 min-h-[380px]">
            <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h2 class="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>{{ resultado === 'valida' ? '⚡' : '🔍' }}</span>
                {{ resultado === 'valida' ? 'Trazabilidad de la Demostración' : 'Análisis y Diagnóstico de la Demostración' }}
              </h2>
              <span v-if="isLoading" class="flex items-center gap-2 text-xs font-medium text-blue-600">
                <span class="flex h-2.5 w-2.5 relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                </span>
                Calculando deducción...
              </span>
            </div>

            <PanelTrazabilidad
              :pasos="pasos"
              :premisasOriginales="formulaData.premisas"
              :conclusionOriginal="formulaData.conclusion"
              :errorLogico="errorLogicoActual"
              :esInvalido="resultado === 'invalida' || resultado === 'no_demostrable_directa'"
            />
          </section>
        </div>
      </main>
    </div>
  </div>
</template>
