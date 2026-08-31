<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { parsearExpresion, normalizarExpresion } from '@/lib/solver/parser'
import { META_OPERADOR, COLOR_NODO, estadisticasNodo } from '@/lib/solver/astVisual'
import type { NodoExpresion } from '@/lib/solver/types'
import NodoArbol from './NodoArbol.vue'
import { Maximize2, Network, X, ZoomIn, ZoomOut, RotateCcw } from '@lucide/vue'

interface Props {
  premisas: string[]
  conclusion: string
}

const props = defineProps<Props>()

interface Proposicion {
  fuente: string
  ast: NodoExpresion | null
  error: string | null
  etiqueta: string
  esConclusion: boolean
}

// Nodo ficticio requerido por NodoArbol para la raíz global (no se muestra).
const NODO_RAIZ: NodoExpresion = { tipo: 'variable', nombre: '·' }

// Ejemplo mostrado cuando la pestaña está vacía.
const EJEMPLO = {
  premisas: ['P ENTONCES Q', 'P'],
  conclusion: 'Q'
}

function parsearSeguro(texto: string): { ast: NodoExpresion | null; error: string | null } {
  const limpio = texto.trim()
  if (!limpio) return { ast: null, error: null }
  try {
    return { ast: parsearExpresion(normalizarExpresion(limpio)), error: null }
  } catch (e) {
    return { ast: null, error: (e as Error).message }
  }
}

const modelo = computed(() => {
  const premisasCrudas = props.premisas.filter((p) => p.trim() !== '')
  const conclusionCruda = props.conclusion.trim()
  const esDemo = premisasCrudas.length === 0 && conclusionCruda === ''

  const premisas = esDemo ? EJEMPLO.premisas : premisasCrudas
  const conclusion = esDemo ? EJEMPLO.conclusion : conclusionCruda

  const premisasParseadas: Proposicion[] = premisas.map((p, i) => {
    const { ast, error } = parsearSeguro(p)
    return { fuente: p, ast, error, etiqueta: `P${i + 1}`, esConclusion: false }
  })

  const conclusionParseada: Proposicion = {
    fuente: conclusion,
    ...parsearSeguro(conclusion),
    etiqueta: '∴ Conclusión',
    esConclusion: true
  }

  const todas = [...premisasParseadas, conclusionParseada]
  const errores = todas.filter((t) => t.error)
  const validas = todas.filter((t) => t.ast) as (Proposicion & { ast: NodoExpresion })[]

  const hijosRaiz = validas.map((t) => ({ nodo: t.ast, etiqueta: t.etiqueta }))

  const stats = validas.reduce(
    (acc, t) => {
      const s = estadisticasNodo(t.ast)
      acc.nodos += s.nodos
      acc.profundidad = Math.max(acc.profundidad, s.profundidad)
      acc.variables += s.variables
      acc.operadores += s.operadores
      return acc
    },
    { nodos: 0, profundidad: 0, variables: 0, operadores: 0 }
  )

  return { esDemo, errores, hijosRaiz, stats, total: todas.length }
})

const leyenda = computed(() =>
  Object.values(META_OPERADOR).map((m) => ({ ...m, clase: COLOR_NODO[m.color] }))
)

// Control de Zoom y Escala
const escala = ref(1)
const aumentarZoom = () => {
  if (escala.value < 1.6) escala.value = Number((escala.value + 0.1).toFixed(1))
}
const reducirZoom = () => {
  if (escala.value > 0.6) escala.value = Number((escala.value - 0.1).toFixed(1))
}
const reiniciarZoom = () => {
  escala.value = 1
}

// Control del modal de vista completa
const mostrarCompleto = ref(false)
const cerrarCompleto = () => (mostrarCompleto.value = false)
const toggleCompleto = () => (mostrarCompleto.value = !mostrarCompleto.value)

// Cierra el modal con la tecla Escape
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') cerrarCompleto()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  // Restaura el scroll del fondo si el componente se desmonta con el modal abierto
  document.body.style.overflow = ''
})

// Bloquea el scroll del fondo mientras el modal de pantalla completa está abierto,
// para que al hacer scroll sólo se mueva el diagrama y no la pestaña de atrás.
watch(
  mostrarCompleto,
  (abierto) => {
    document.body.style.overflow = abierto ? 'hidden' : ''
  }
)

</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-slate-100 pb-4">
      <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <span>🌳</span> Árbol de Derivación Sintáctica (AST)
      </h3>
      <p class="text-xs text-slate-500 mt-1">
        Visualiza la estructura jerárquica de tu deducción completa: un nodo raíz del que cuelgan cada premisa y la conclusión, descompuestas en sus conectivos lógicos y variables.
      </p>
    </div>

    <!-- Leyenda de operadores -->
    <div class="flex flex-wrap gap-2">
      <span
        v-for="op in leyenda"
        :key="op.corto"
        class="inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[11px] font-bold shadow-2xs transition-all hover:scale-105 select-none"
        :class="op.clase"
      >
        <span class="text-sm font-black leading-none font-serif">{{ op.simbolo }}</span>
        <span>{{ op.nombre }}</span>
      </span>
    </div>

    <!-- Guía para lectura del árbol -->
    <div class="rounded-2xl bg-sky-50/80 border border-sky-200/90 px-4 py-3.5 text-xs text-sky-950 leading-relaxed shadow-2xs space-y-1.5">
      <p class="font-bold flex items-center gap-1.5 text-sky-900">
        <span>💡</span> ¿Cómo interpretar este diagrama?
      </p>
      <ul class="list-disc pl-5 space-y-1 text-sky-900/90">
        <li>El <strong>nodo superior oscuro</strong> representa la <em>demostración completa</em>.</li>
        <li>Cada <strong>rama principal</strong> que desciende de él es una <strong>premisa</strong> (P1, P2…) o la <strong>conclusión</strong>.</li>
        <li>Los <strong>conectivos</strong> (∧ ∨ → ¬ ↔ △) actúan como nodos intermedios y las <strong>letras</strong> (P, Q…) son las hojas o variables proposicionales.</li>
      </ul>
    </div>

    <!-- Aviso de ejemplo cuando no hay entrada -->
    <div
      v-if="modelo.esDemo"
      class="flex items-start gap-2.5 rounded-2xl border border-dashed border-blue-300 bg-blue-50/70 p-4 text-xs text-blue-900"
    >
      <span class="text-lg leading-none">✨</span>
      <span>
        Mostrando <strong>ejemplo didáctico</strong>.
        Escribe tus premisas en la pestaña <strong>Simbología Formal</strong> y este árbol se actualizará automáticamente en tiempo real.
      </span>
    </div>

    <!-- Errores de sintaxis (no detienen el resto del árbol) -->
    <div
      v-if="modelo.errores.length"
      class="space-y-1.5 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-800"
    >
      <p class="font-bold flex items-center gap-1.5">
        <span>⚠️</span> Algunas proposiciones contienen errores de sintaxis:
      </p>
      <ul class="list-disc pl-5 space-y-0.5">
        <li v-for="(err, i) in modelo.errores" :key="i">
          <code class="font-mono font-bold">{{ err.etiqueta }}</code>: {{ err.error }}
        </li>
      </ul>
    </div>

    <!-- Estadísticas globales del diagrama & Controles de Zoom -->
    <div
      v-if="modelo.hijosRaiz.length"
      class="flex flex-wrap items-center justify-between gap-3 text-[10px] font-semibold text-slate-500 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-200/80"
    >
      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded-lg bg-white px-2.5 py-1 border border-slate-200 shadow-2xs">📦 {{ modelo.total }} proposiciones</span>
        <span class="rounded-lg bg-white px-2.5 py-1 border border-slate-200 shadow-2xs">⦿ {{ modelo.stats.nodos }} nodos</span>
        <span class="rounded-lg bg-white px-2.5 py-1 border border-slate-200 shadow-2xs">↕ prof. máx {{ modelo.stats.profundidad }}</span>
        <span class="rounded-lg bg-white px-2.5 py-1 border border-slate-200 shadow-2xs">◍ {{ modelo.stats.variables }} variables</span>
        <span class="rounded-lg bg-white px-2.5 py-1 border border-slate-200 shadow-2xs">⚇ {{ modelo.stats.operadores }} conectivos</span>
      </div>

      <!-- Controles de Zoom -->
      <div class="flex items-center gap-1 bg-white rounded-xl p-1 border border-slate-200 shadow-2xs">
        <button
          type="button"
          @click="reducirZoom"
          title="Reducir zoom"
          :disabled="escala <= 0.6"
          class="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ZoomOut :size="14" />
        </button>
        <span class="px-2 font-mono text-[10px] font-bold text-slate-700 select-none">
          {{ Math.round(escala * 100) }}%
        </span>
        <button
          type="button"
          @click="aumentarZoom"
          title="Aumentar zoom"
          :disabled="escala >= 1.6"
          class="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ZoomIn :size="14" />
        </button>
        <button
          type="button"
          @click="reiniciarZoom"
          title="Reiniciar zoom a 100%"
          class="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw :size="13" />
        </button>
      </div>
    </div>

    <!-- Diagrama único -->
    <div
      v-if="modelo.hijosRaiz.length"
      class="overflow-x-auto rounded-2xl bg-slate-50/70 py-8 px-4 border border-slate-200/80 shadow-inner min-h-[260px] flex items-center justify-center"
    >
      <div
        class="arbol-contenedor transition-transform duration-200"
        :style="{ transform: `scale(${escala})`, transformOrigin: 'top center' }"
      >
        <ul class="arbol-raiz">
          <NodoArbol
            :nodo="NODO_RAIZ"
            titulo-raiz="Demostración"
            :hijos="modelo.hijosRaiz"
          />
        </ul>
      </div>
    </div>

    <!-- Botón para ver el diagrama completo a pantalla completa -->
    <div v-if="modelo.hijosRaiz.length" class="flex justify-end">
      <button
        type="button"
        @click="toggleCompleto"
        class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
      >
        <Maximize2 :size="14" /> Ver a pantalla completa
      </button>
    </div>

    <!-- Modal de vista completa -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mostrarCompleto"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
        >
          <!-- Fondo oscuro -->
          <div
            class="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm"
            @click="cerrarCompleto"
          ></div>

          <!-- Panel -->
          <div
            class="relative w-full max-w-6xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-neutral-200 overflow-hidden"
          >
            <div class="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
              <h4 class="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Network :size="16" class="text-blue-600" /> Diagrama de árbol completo
              </h4>
              <button
                type="button"
                @click="cerrarCompleto"
                class="inline-flex items-center justify-center h-8 w-8 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors cursor-pointer"
                aria-label="Cerrar"
              >
                <X :size="18" />
              </button>
            </div>

            <div class="flex-1 overflow-auto bg-neutral-50/70 p-8">
              <div class="arbol-contenedor">
                <ul class="arbol-raiz">
                  <NodoArbol
                    :nodo="NODO_RAIZ"
                    titulo-raiz="Demostración"
                    :hijos="modelo.hijosRaiz"
                  />
                </ul>
              </div>
            </div>

            <div class="border-t border-neutral-100 px-5 py-2 text-[11px] text-neutral-400">
              Pulsa <kbd class="rounded bg-neutral-100 px-1.5 py-0.5 font-mono">Esc</kbd> o haz clic fuera para cerrar.
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Sin nada válido que mostrar -->
    <div
      v-if="!modelo.hijosRaiz.length && !modelo.esDemo"
      class="text-center py-6 text-xs text-neutral-400"
    >
      No hay proposiciones válidas para dibujar el árbol.
    </div>
  </div>
</template>

<style>
/* ----- Estructura del árbol (conectores CSS clásicos) -----
   CSS global: el árbol es recursivo (NodoArbol se invoca a sí mismo),
   por lo que los <li>/<ul> de niveles hijos NO llevan el atributo de
   ámbito de este componente. Usar <style scoped> rompería los conectores
   en profundidad. Los nombres de clase (.arbol-*) son únicos del feature. */
.arbol-raiz {
  display: flex;
  justify-content: center;
  padding: 4px 0 0;
  margin: 0;
  list-style: none;
}

/* Envoltorio que soluciona el scroll horizontal: centra el árbol cuando cabe
   y, al desbordar, se alinea a la izquierda para que toda la rama sea
   alcanzable con scroll (sin recortes a la izquierda). */
.arbol-contenedor {
  width: max-content;
  min-width: 100%;
  margin: 0 auto;
  padding: 0 24px;
}

/* El <ul> de hijos se renderiza dentro de NodoArbol (componente recursivo). */
.arbol-ul {
  display: flex;
  justify-content: center;
  padding-top: 26px;
  margin: 0;
  position: relative;
  list-style: none;
}

.arbol-li {
  list-style: none;
  text-align: center;
  position: relative;
  padding: 26px 14px 0;
  margin: 0;
}

/* La raíz no necesita espacio ni conectores superiores. */
.arbol-raiz > .arbol-li {
  padding-top: 0;
}

/* Líneas que conectan cada nodo padre con sus hijos. */
.arbol-li::before,
.arbol-li::after {
  content: '';
  position: absolute;
  top: 0;
  right: 50%;
  width: 50%;
  height: 26px;
  border-top: 2.5px solid currentColor;
}

.arbol-li::after {
  right: auto;
  left: 50%;
  border-left: 2.5px solid currentColor;
}

.arbol-li::before {
  border-right: 2.5px solid currentColor;
}

/* Un solo hijo: ocultar la bifurcación horizontal (se mantiene la línea
   vertical del <ul> padre para conectar el nodo unario con su hijo). */
.arbol-li:only-child::before,
.arbol-li:only-child::after {
  display: none;
}

/* Primer y último hijo: cerrar las esquinas del conector. */
.arbol-li:first-child::before,
.arbol-li:last-child::after {
  border: 0 none;
}

.arbol-li:last-child::before {
  border-right: 2.5px solid currentColor;
  border-radius: 0 6px 0 0;
}

.arbol-li:first-child::after {
  border-radius: 6px 0 0 0;
}

/* Línea vertical desde el nodo padre hacia la fila de hijos. */
.arbol-ul::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  border-left: 2.5px solid currentColor;
  height: 26px;
}

/* Los chips de nodo usan su propio color, no el de la rama. */
.arbol-nodo {
  color: inherit;
}
</style>
