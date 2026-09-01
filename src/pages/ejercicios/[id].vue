<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ejercicios,
  obtenerEjercicioPorId,
  clasificacionCorrecta,
  etiquetasDificultad,
  puntosDificultad,
  OPCIONES_QUIZ,
  claveTemaParaEjercicio,
  type Ejercicio,
  type EjercicioQuiz,
} from '@/data/exercises'
import {
  parsearProposicion,
  recolectarVariables,
  generarFilas,
  type FilaTabla,
} from '@/lib/truth-table/evaluator'
import { registrarRespuesta, marcarEjercicioCompletado, marcarQuizCompletado } from '@/store/progress'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

const route = useRoute()
const router = useRouter()

const ejercicio = ref<Ejercicio | null>(null)
const respuestaEnviada = ref(false)
const esCorrecta = ref(false)
const seleccionUsuario = ref('')
const preguntasQuizRespondidas = ref<boolean[]>([])
const indiceQuizActual = ref(0)
const puntuacionQuiz = ref(0)

interface RegistroRespuestaQuiz {
  numero: number
  enunciado: string
  proposicion: string
  textoAsignacion: string
  opcionSeleccionada: string
  opcionCorrecta: string
  esCorrecta: boolean
  explicacion: string
}

const historialQuiz = ref<RegistroRespuestaQuiz[]>([])

// Estado para tablas de verdad interactivas
const variablesTabla = ref<string[]>([])
const filasEsperadas = ref<FilaTabla[]>([])
const respuestasUsuarioTabla = ref<string[]>([])
const errorTablaIncompleta = ref(false)
const filasResultados = ref<{ correcta: boolean; esperada: string }[]>([])

function inicializarEjercicio(id: string) {
  const ex = obtenerEjercicioPorId(id)
  if (ex) {
    ejercicio.value = ex
    respuestaEnviada.value = false
    esCorrecta.value = false
    seleccionUsuario.value = ''
    indiceQuizActual.value = 0
    puntuacionQuiz.value = 0
    historialQuiz.value = []
    errorTablaIncompleta.value = false

    if (ex.tipo === 'quiz') {
      const quizEx = ex as EjercicioQuiz
      preguntasQuizRespondidas.value = new Array(quizEx.preguntas.length).fill(false)
    } else if (ex.tipo === 'truth-table') {
      try {
        const nodo = parsearProposicion(ex.proposicion)
        const vars = recolectarVariables(nodo)
        variablesTabla.value = vars
        filasEsperadas.value = generarFilas(nodo, vars)
        respuestasUsuarioTabla.value = new Array(filasEsperadas.value.length).fill('')
        filasResultados.value = []
      } catch (err) {
        console.error('Error al inicializar tabla:', err)
      }
    }
  } else {
    ejercicio.value = null
  }
}

onMounted(() => {
  inicializarEjercicio(route.params.id as string)
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      inicializarEjercicio(newId as string)
    }
  }
)

const siguienteEjercicioId = computed(() => {
  if (!ejercicio.value) return null
  const idx = ejercicios.findIndex((e) => e.id === ejercicio.value?.id)
  if (idx >= 0 && idx < ejercicios.length - 1) {
    return ejercicios[idx + 1].id
  }
  return null
})

const anteriorEjercicioId = computed(() => {
  if (!ejercicio.value) return null
  const idx = ejercicios.findIndex((e) => e.id === ejercicio.value?.id)
  if (idx > 0) {
    return ejercicios[idx - 1].id
  }
  return null
})

function irAEjercicio(id: string) {
  router.push(`/ejercicios/${id}`)
}

function verificarRespuesta() {
  if (!ejercicio.value) return
  const tema = claveTemaParaEjercicio(ejercicio.value)

  if (ejercicio.value.tipo === 'truth-table') {
    if (respuestasUsuarioTabla.value.some((r) => r === '')) {
      errorTablaIncompleta.value = true
      return
    }
    errorTablaIncompleta.value = false
    respuestaEnviada.value = true

    filasResultados.value = filasEsperadas.value.map((fila, idx) => {
      const valorUsuario = respuestasUsuarioTabla.value[idx] === 'V'
      return {
        correcta: valorUsuario === fila.resultado,
        esperada: fila.resultado ? 'V' : 'F',
      }
    })

    esCorrecta.value = filasResultados.value.every((r) => r.correcta)
  } else {
    respuestaEnviada.value = true
    if (ejercicio.value.tipo === 'identify') {
      esCorrecta.value = seleccionUsuario.value === ejercicio.value.opcionCorrecta
    } else if (ejercicio.value.tipo === 'law') {
      esCorrecta.value = seleccionUsuario.value === ejercicio.value.opcionCorrecta
    } else if (ejercicio.value.tipo === 'classify') {
      const clasificacionReal = clasificacionCorrecta(ejercicio.value.proposicion)
      esCorrecta.value = seleccionUsuario.value === clasificacionReal
    }
  }

  registrarRespuesta(tema, esCorrecta.value)
  marcarEjercicioCompletado(ejercicio.value.id, tema, esCorrecta.value)
}

function reiniciarTabla() {
  respuestasUsuarioTabla.value = new Array(filasEsperadas.value.length).fill('')
  filasResultados.value = []
  respuestaEnviada.value = false
  esCorrecta.value = false
  errorTablaIncompleta.value = false
}

const conteoFilasCorrectas = computed(() => {
  return filasResultados.value.filter((r) => r.correcta).length
})

const filasConErrores = computed(() => {
  if (!respuestaEnviada.value || ejercicio.value?.tipo !== 'truth-table') return []
  return filasResultados.value
    .map((res, idx) => ({
      ...res,
      idx,
      fila: filasEsperadas.value[idx],
      valorUsuario: respuestasUsuarioTabla.value[idx],
    }))
    .filter((item) => !item.correcta)
})

function responderQuiz(opcion: string) {
  if (!ejercicio.value || ejercicio.value.tipo !== 'quiz') return
  const preguntaIdx = indiceQuizActual.value
  const quizEx = ejercicio.value as EjercicioQuiz
  const pregunta = quizEx.preguntas[preguntaIdx]

  if (pregunta && pregunta.asignacion) {
    const nodo = parsearProposicion(pregunta.proposicion)

    const evaluarNodo = (n: ReturnType<typeof parsearProposicion>, asig: Record<string, boolean>): boolean => {
      switch (n.tipo) {
        case 'VAR':
          return asig[n.valor ?? ''] ?? false
        case 'NOT':
          return !evaluarNodo(n.derecho!, asig)
        case 'AND':
          return evaluarNodo(n.izquierdo!, asig) && evaluarNodo(n.derecho!, asig)
        case 'OR':
          return evaluarNodo(n.izquierdo!, asig) || evaluarNodo(n.derecho!, asig)
        case 'IMPLIES':
          return !evaluarNodo(n.izquierdo!, asig) || evaluarNodo(n.derecho!, asig)
        case 'IFF':
          return evaluarNodo(n.izquierdo!, asig) === evaluarNodo(n.derecho!, asig)
      }
    }

    const valorReal = evaluarNodo(nodo, pregunta.asignacion)
    const opcionCorrecta = valorReal ? 'VERDADERO' : 'FALSO'
    const esAcierto = opcion === opcionCorrecta

    historialQuiz.value.push({
      numero: preguntaIdx + 1,
      enunciado: pregunta.enunciado,
      proposicion: pregunta.proposicion,
      textoAsignacion: pregunta.textoAsignacion,
      opcionSeleccionada: opcion,
      opcionCorrecta,
      esCorrecta: esAcierto,
      explicacion: pregunta.explicacion,
    })

    preguntasQuizRespondidas.value[preguntaIdx] = true
    const tema = claveTemaParaEjercicio(ejercicio.value)
    registrarRespuesta(tema, esAcierto)
    if (esAcierto) puntuacionQuiz.value++

    seleccionUsuario.value = opcion

    setTimeout(() => {
      if (ejercicio.value && ejercicio.value.tipo === 'quiz' && indiceQuizActual.value < quizEx.preguntas.length - 1) {
        indiceQuizActual.value++
        seleccionUsuario.value = ''
      } else {
        respuestaEnviada.value = true
        esCorrecta.value = puntuacionQuiz.value >= Math.ceil(quizEx.preguntas.length / 2)
        if (ejercicio.value) marcarQuizCompletado(ejercicio.value.id)
      }
    }, 400)
  }
}

function reiniciarQuiz() {
  indiceQuizActual.value = 0
  puntuacionQuiz.value = 0
  seleccionUsuario.value = ''
  respuestaEnviada.value = false
  historialQuiz.value = []
  preguntasQuizRespondidas.value = new Array(
    ejercicio.value?.tipo === 'quiz' ? (ejercicio.value as EjercicioQuiz).preguntas.length : 0
  ).fill(false)
}

const opcionesClasificacion = ['tautologia', 'contradiccion', 'contingencia']
const etiquetasClasificacion: Record<string, string> = {
  tautologia: 'Tautología',
  contradiccion: 'Contradicción',
  contingencia: 'Contingencia',
}

const tituloCategoria = computed(() => {
  if (!ejercicio.value) return ''
  const mapa: Record<string, string> = {
    IDENTIFICACIÓN: 'Identificación',
    'TABLAS DE VERDAD': 'Tablas de Verdad',
    CLASIFICACIÓN: 'Clasificación de Esquemas Moleculares',
    'LEYES LÓGICAS': 'Leyes Lógicas',
    CUESTIONARIO: 'Cuestionario',
  }
  return mapa[ejercicio.value.categoria] ?? ejercicio.value.categoria
})
</script>

<template>
  <section class="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Breadcrumb & navigation bar -->
      <div class="flex items-center justify-between">
        <button
          class="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors"
          @click="router.push('/ejercicios')"
        >
          &larr; Volver al catálogo de ejercicios
        </button>

        <div class="flex items-center gap-2">
          <Button
            v-if="anteriorEjercicioId"
            variant="ghost"
            size="sm"
            @click="irAEjercicio(anteriorEjercicioId)"
          >
            &larr; Anterior
          </Button>
          <Button
            v-if="siguienteEjercicioId"
            variant="ghost"
            size="sm"
            @click="irAEjercicio(siguienteEjercicioId)"
          >
            Siguiente &rarr;
          </Button>
        </div>
      </div>

      <div v-if="!ejercicio" class="text-center py-16 bg-white rounded-2xl border border-neutral-200 shadow-xs">
        <p class="text-neutral-500 font-medium">Ejercicio no encontrado.</p>
        <Button variant="secondary" class="mt-4" @click="router.push('/ejercicios')">
          Ver todos los ejercicios
        </Button>
      </div>

      <template v-else>
        <!-- Header -->
        <Card>
          <div class="flex items-center justify-between flex-wrap gap-2 mb-2">
            <Badge variant="blue">{{ tituloCategoria }}</Badge>
            <span
              v-if="ejercicio.fuente"
              class="text-xs font-semibold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-md border border-neutral-200"
            >
              📖 {{ ejercicio.fuente }}
            </span>
          </div>
          <h1 class="text-2xl font-bold text-neutral-900 mt-1 mb-1">{{ ejercicio.titulo }}</h1>
          <p class="text-sm text-neutral-500">
            <span aria-hidden="true">{{ puntosDificultad[ejercicio.nivel] }}</span>
            Nivel: <strong class="text-neutral-700 font-semibold">{{ etiquetasDificultad[ejercicio.nivel] }}</strong>
          </p>
          <p class="text-neutral-600 mt-2 leading-relaxed">{{ ejercicio.descripcionCorta }}</p>
        </Card>

        <!-- Truth Table Exercise (Interactive) -->
        <Card v-if="ejercicio.tipo === 'truth-table'">
          <div class="mb-4">
            <h3 class="text-sm font-bold text-neutral-800">
              Proposición a evaluar:
              <span class="font-mono text-blue-700 font-extrabold text-base ml-1">{{ ejercicio.proposicion }}</span>
            </h3>
            <p class="text-xs text-neutral-500 mt-1">
              Completa cada fila de la tabla asignando el valor de verdad <strong>V (Verdadero)</strong> o
              <strong>F (Falso)</strong> que corresponde a la proposición:
            </p>
          </div>

          <!-- Interactive Table -->
          <div class="overflow-x-auto border border-neutral-200 rounded-xl mb-4 bg-white shadow-2xs">
            <table class="w-full text-center border-collapse">
              <thead>
                <tr class="bg-neutral-100 border-b border-neutral-200 text-xs font-bold text-neutral-700">
                  <th class="py-2.5 px-3 w-10 text-neutral-400">#</th>
                  <th v-for="v in variablesTabla" :key="v" class="py-2.5 px-4 font-mono text-neutral-800">
                    {{ v }}
                  </th>
                  <th class="py-2.5 px-6 font-mono text-blue-900 bg-blue-50/70 border-l border-neutral-200">
                    {{ ejercicio.proposicion }}
                  </th>
                  <th v-if="respuestaEnviada" class="py-2.5 px-3 w-36 text-neutral-600 border-l border-neutral-200">
                    Resultado
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100 text-sm">
                <tr
                  v-for="(fila, idx) in filasEsperadas"
                  :key="idx"
                  :class="[
                    'transition-colors',
                    idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/40',
                    respuestaEnviada && filasResultados[idx]?.correcta ? 'bg-emerald-50/40' : '',
                    respuestaEnviada && !filasResultados[idx]?.correcta ? 'bg-rose-50/50' : '',
                  ]"
                >
                  <td class="py-2.5 px-3 text-xs text-neutral-400 font-mono">
                    {{ idx + 1 }}
                  </td>
                  <td v-for="v in variablesTabla" :key="v" class="py-2.5 px-4 font-mono font-bold">
                    <span :class="fila.asignacion[v] ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'">
                      {{ fila.asignacion[v] ? 'V' : 'F' }}
                    </span>
                  </td>
                  <td class="py-2.5 px-6 border-l border-neutral-200 bg-blue-50/20">
                    <div class="inline-flex rounded-lg border border-neutral-200 p-1 bg-white shadow-2xs gap-1">
                      <button
                        type="button"
                        :disabled="respuestaEnviada"
                        :class="[
                          'px-3 py-1 text-xs font-bold rounded transition-all',
                          respuestasUsuarioTabla[idx] === 'V'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-neutral-600 hover:bg-neutral-100',
                        ]"
                        @click="
                          respuestasUsuarioTabla[idx] = 'V';
                          errorTablaIncompleta = false
                        "
                      >
                        V
                      </button>
                      <button
                        type="button"
                        :disabled="respuestaEnviada"
                        :class="[
                          'px-3 py-1 text-xs font-bold rounded transition-all',
                          respuestasUsuarioTabla[idx] === 'F'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-neutral-600 hover:bg-neutral-100',
                        ]"
                        @click="
                          respuestasUsuarioTabla[idx] = 'F';
                          errorTablaIncompleta = false
                        "
                      >
                        F
                      </button>
                    </div>
                  </td>
                  <td v-if="respuestaEnviada" class="py-2.5 px-3 border-l border-neutral-200 text-xs font-semibold">
                    <span v-if="filasResultados[idx]?.correcta" class="inline-flex items-center gap-1 text-emerald-700">
                      ✓ Correcto
                    </span>
                    <span v-else class="inline-flex items-center gap-1 text-rose-700 font-bold">
                      ✗ (Esperado: {{ filasResultados[idx]?.esperada }})
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Error si falta completar filas -->
          <div
            v-if="errorTablaIncompleta"
            class="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2"
          >
            <span>⚠️</span>
            <span>Por favor, selecciona V o F en cada una de las {{ filasEsperadas.length }} filas antes de verificar.</span>
          </div>

          <!-- Botones de Acción -->
          <div class="flex items-center gap-3">
            <Button v-if="!respuestaEnviada" @click="verificarRespuesta">
              Verificar tabla completa
            </Button>
            <Button v-else variant="secondary" @click="reiniciarTabla">
              🔄 Intentar de nuevo
            </Button>
            <Button
              v-if="respuestaEnviada && siguienteEjercicioId"
              variant="primary"
              @click="irAEjercicio(siguienteEjercicioId)"
            >
              Siguiente Ejercicio &rarr;
            </Button>
          </div>

          <!-- Retroalimentación Detallada de la Tabla -->
          <div
            v-if="respuestaEnviada"
            :class="[
              'mt-6 p-5 rounded-2xl border text-sm transition-all shadow-xs',
              esCorrecta
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-rose-50/70 border-rose-300 text-rose-950',
            ]"
          >
            <div class="flex items-center gap-2 mb-2 font-bold text-base">
              <span v-if="esCorrecta" class="text-xl">🎉</span>
              <span v-else class="text-xl">⚠️</span>
              <span>
                {{
                  esCorrecta
                    ? '¡Correcto! Has completado la tabla de verdad a la perfección.'
                    : 'Hay discrepancias en algunas filas de la tabla.'
                }}
              </span>
            </div>

            <div class="text-xs font-semibold mb-3 flex gap-2 flex-wrap">
              <span class="px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-neutral-800">
                Filas correctas: <strong>{{ conteoFilasCorrectas }} / {{ filasEsperadas.length }}</strong>
              </span>
              <span
                v-if="!esCorrecta"
                class="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 border border-rose-200"
              >
                Filas incorrectas: <strong>{{ filasEsperadas.length - conteoFilasCorrectas }}</strong>
              </span>
            </div>

            <!-- Desglose específico de filas incorrectas -->
            <div
              v-if="filasConErrores.length > 0"
              class="mb-4 p-3 rounded-xl bg-white border border-rose-200 text-xs space-y-1.5"
            >
              <p class="font-bold text-rose-900">📍 Detalle de filas donde hubo equivocación:</p>
              <div
                v-for="err in filasConErrores"
                :key="err.idx"
                class="flex items-center justify-between text-neutral-700 bg-rose-50/60 px-2.5 py-1.5 rounded-lg"
              >
                <span>
                  <strong>Fila #{{ err.idx + 1 }}</strong> ({{
                    Object.entries(err.fila.asignacion)
                      .map(([k, v]) => `${k}=${v ? 'V' : 'F'}`)
                      .join(', ')
                  }}):
                </span>
                <span>
                  Colocaste: <strong class="text-rose-700">{{ err.valorUsuario || 'Sin responder' }}</strong> &rarr; Valor correcto:
                  <strong class="text-emerald-700 font-mono">{{ err.esperada }}</strong>
                </span>
              </div>
            </div>

            <div v-if="ejercicio.explicacion" class="mt-3 pt-3 border-t border-neutral-200/80">
              <p class="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                💡 Resolución y Demostración Formal Paso a Paso:
              </p>
              <p class="text-sm leading-relaxed text-neutral-800 font-normal bg-white/90 p-3.5 rounded-xl border border-neutral-200 whitespace-pre-line">
                {{ ejercicio.explicacion }}
              </p>
            </div>
          </div>
        </Card>

        <!-- Identify Exercise -->
        <Card v-if="ejercicio.tipo === 'identify'">
          <h3 class="text-sm font-bold text-neutral-700 mb-2">
            Proposición: <span class="font-mono text-blue-700 font-bold">{{ ejercicio.proposicion }}</span>
          </h3>
          <p class="text-sm text-neutral-500 mb-4">¿Cuál es el operador principal o conectivo dominante?</p>
          <div class="space-y-2 mb-4">
            <label
              v-for="opcion in ejercicio.opciones"
              :key="opcion"
              :class="[
                'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                seleccionUsuario === opcion ? 'border-blue-600 bg-blue-50/70 font-semibold' : 'border-neutral-200 hover:border-blue-300',
                respuestaEnviada && opcion === ejercicio.opcionCorrecta && 'border-emerald-500 bg-emerald-50 font-bold',
                respuestaEnviada && seleccionUsuario === opcion && !esCorrecta && 'border-rose-500 bg-rose-50 font-bold',
              ]"
            >
              <input
                v-model="seleccionUsuario"
                type="radio"
                :value="opcion"
                class="accent-blue-600"
                :disabled="respuestaEnviada"
              />
              <span class="text-sm">{{ opcion }}</span>
            </label>
          </div>
          <div class="flex items-center gap-3">
            <Button :disabled="!seleccionUsuario || respuestaEnviada" @click="verificarRespuesta">
              Verificar respuesta
            </Button>
            <Button
              v-if="respuestaEnviada && siguienteEjercicioId"
              variant="primary"
              @click="irAEjercicio(siguienteEjercicioId)"
            >
              Siguiente Ejercicio &rarr;
            </Button>
          </div>

          <div
            v-if="respuestaEnviada"
            :class="[
              'mt-6 p-5 rounded-2xl border text-sm transition-all shadow-xs',
              esCorrecta
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-rose-50/70 border-rose-300 text-rose-950',
            ]"
          >
            <div class="flex items-center gap-2 mb-2 font-bold text-base">
              <span v-if="esCorrecta" class="text-xl">✅</span>
              <span v-else class="text-xl">❌</span>
              <span>{{ esCorrecta ? '¡Correcto! Operador identificado acertadamente' : 'Respuesta Incorrecta' }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs">
              <div class="p-2.5 rounded-lg bg-white border border-neutral-200">
                <span class="text-neutral-500">Tu selección:</span>
                <p class="font-bold mt-0.5" :class="esCorrecta ? 'text-emerald-700' : 'text-rose-700'">
                  {{ seleccionUsuario }}
                </p>
              </div>
              <div class="p-2.5 rounded-lg bg-white border border-neutral-200">
                <span class="text-neutral-500">Operador dominante correcto:</span>
                <p class="font-bold text-emerald-700 mt-0.5">{{ ejercicio.opcionCorrecta }}</p>
              </div>
            </div>

            <div v-if="ejercicio.explicacion" class="pt-3 border-t border-neutral-200/80">
              <p class="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                💡 Resolución y Jerarquía de Conectivos:
              </p>
              <p class="text-sm leading-relaxed text-neutral-800 font-normal bg-white/90 p-3.5 rounded-xl border border-neutral-200 whitespace-pre-line">
                {{ ejercicio.explicacion }}
              </p>
            </div>
          </div>
        </Card>

        <!-- Law Exercise -->
        <Card v-if="ejercicio.tipo === 'law'">
          <h3 class="text-sm font-bold text-neutral-700 mb-2">
            Proposición: <span class="font-mono text-blue-700 font-bold">{{ ejercicio.proposicion }}</span>
          </h3>
          <p class="text-sm text-neutral-500 mb-4">¿Qué ley o regla lógica justifica esta equivalencia o inferencia?</p>
          <div class="space-y-2 mb-4">
            <label
              v-for="opcion in ejercicio.opciones"
              :key="opcion"
              :class="[
                'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                seleccionUsuario === opcion ? 'border-blue-600 bg-blue-50/70 font-semibold' : 'border-neutral-200 hover:border-blue-300',
                respuestaEnviada && opcion === ejercicio.opcionCorrecta && 'border-emerald-500 bg-emerald-50 font-bold',
                respuestaEnviada && seleccionUsuario === opcion && !esCorrecta && 'border-rose-500 bg-rose-50 font-bold',
              ]"
            >
              <input
                v-model="seleccionUsuario"
                type="radio"
                :value="opcion"
                class="accent-blue-600"
                :disabled="respuestaEnviada"
              />
              <span class="text-sm">{{ opcion }}</span>
            </label>
          </div>
          <div class="flex items-center gap-3">
            <Button :disabled="!seleccionUsuario || respuestaEnviada" @click="verificarRespuesta">
              Verificar ley
            </Button>
            <Button
              v-if="respuestaEnviada && siguienteEjercicioId"
              variant="primary"
              @click="irAEjercicio(siguienteEjercicioId)"
            >
              Siguiente Ejercicio &rarr;
            </Button>
          </div>

          <div
            v-if="respuestaEnviada"
            :class="[
              'mt-6 p-5 rounded-2xl border text-sm transition-all shadow-xs',
              esCorrecta
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-rose-50/70 border-rose-300 text-rose-950',
            ]"
          >
            <div class="flex items-center gap-2 mb-2 font-bold text-base">
              <span v-if="esCorrecta" class="text-xl">✅</span>
              <span v-else class="text-xl">❌</span>
              <span>{{ esCorrecta ? '¡Correcto! Ley lógica identificada con precisión' : 'Ley Incorrecta' }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs">
              <div class="p-2.5 rounded-lg bg-white border border-neutral-200">
                <span class="text-neutral-500">Tu selección:</span>
                <p class="font-bold mt-0.5" :class="esCorrecta ? 'text-emerald-700' : 'text-rose-700'">
                  {{ seleccionUsuario }}
                </p>
              </div>
              <div class="p-2.5 rounded-lg bg-white border border-neutral-200">
                <span class="text-neutral-500">Ley Lógica Aplicable:</span>
                <p class="font-bold text-emerald-700 mt-0.5">{{ ejercicio.opcionCorrecta }}</p>
              </div>
            </div>

            <div v-if="ejercicio.explicacion" class="pt-3 border-t border-neutral-200/80">
              <p class="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                💡 Demostración y Justificación de la Equivalencia:
              </p>
              <p class="text-sm leading-relaxed text-neutral-800 font-normal bg-white/90 p-3.5 rounded-xl border border-neutral-200 whitespace-pre-line">
                {{ ejercicio.explicacion }}
              </p>
            </div>
          </div>
        </Card>

        <!-- Classify Exercise -->
        <Card v-if="ejercicio.tipo === 'classify'">
          <h3 class="text-sm font-bold text-neutral-700 mb-2">
            Proposición: <span class="font-mono text-blue-700 font-bold">{{ ejercicio.proposicion }}</span>
          </h3>
          <p class="text-sm text-neutral-500 mb-4">Determina la clasificación semántica del esquema molecular:</p>
          <div class="space-y-2 mb-4">
            <label
              v-for="opcion in opcionesClasificacion"
              :key="opcion"
              :class="[
                'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                seleccionUsuario === opcion ? 'border-blue-600 bg-blue-50/70 font-semibold' : 'border-neutral-200 hover:border-blue-300',
                respuestaEnviada && opcion === clasificacionCorrecta(ejercicio.proposicion) && 'border-emerald-500 bg-emerald-50 font-bold',
                respuestaEnviada && seleccionUsuario === opcion && !esCorrecta && 'border-rose-500 bg-rose-50 font-bold',
              ]"
            >
              <input
                v-model="seleccionUsuario"
                type="radio"
                :value="opcion"
                class="accent-blue-600"
                :disabled="respuestaEnviada"
              />
              <span class="text-sm">{{ etiquetasClasificacion[opcion] }}</span>
            </label>
          </div>
          <div class="flex items-center gap-3">
            <Button :disabled="!seleccionUsuario || respuestaEnviada" @click="verificarRespuesta">
              Verificar clasificación
            </Button>
            <Button
              v-if="respuestaEnviada && siguienteEjercicioId"
              variant="primary"
              @click="irAEjercicio(siguienteEjercicioId)"
            >
              Siguiente Ejercicio &rarr;
            </Button>
          </div>

          <div
            v-if="respuestaEnviada"
            :class="[
              'mt-6 p-5 rounded-2xl border text-sm transition-all shadow-xs',
              esCorrecta
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-rose-50/70 border-rose-300 text-rose-950',
            ]"
          >
            <div class="flex items-center gap-2 mb-2 font-bold text-base">
              <span v-if="esCorrecta" class="text-xl">✅</span>
              <span v-else class="text-xl">❌</span>
              <span>
                {{
                  esCorrecta
                    ? '¡Correcto! Clasificación semántica exacta'
                    : `Incorrecto. La clasificación correcta es: ${etiquetasClasificacion[clasificacionCorrecta(ejercicio.proposicion)]}`
                }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs">
              <div class="p-2.5 rounded-lg bg-white border border-neutral-200">
                <span class="text-neutral-500">Tu selección:</span>
                <p class="font-bold mt-0.5" :class="esCorrecta ? 'text-emerald-700' : 'text-rose-700'">
                  {{ etiquetasClasificacion[seleccionUsuario] || seleccionUsuario }}
                </p>
              </div>
              <div class="p-2.5 rounded-lg bg-white border border-neutral-200">
                <span class="text-neutral-500">Clasificación Real:</span>
                <p class="font-bold text-emerald-700 mt-0.5">
                  {{ etiquetasClasificacion[clasificacionCorrecta(ejercicio.proposicion)] }}
                </p>
              </div>
            </div>

            <div v-if="ejercicio.explicacion" class="pt-3 border-t border-neutral-200/80">
              <p class="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                💡 Demostración y Análisis Semántico:
              </p>
              <p class="text-sm leading-relaxed text-neutral-800 font-normal bg-white/90 p-3.5 rounded-xl border border-neutral-200 whitespace-pre-line">
                {{ ejercicio.explicacion }}
              </p>
            </div>
          </div>
        </Card>

        <!-- Quiz Question Active -->
        <Card v-if="ejercicio.tipo === 'quiz' && !respuestaEnviada">
          <div class="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
            <h3 class="text-sm font-bold text-neutral-800">
              Pregunta {{ indiceQuizActual + 1 }} de {{ ejercicio.preguntas.length }}
            </h3>
            <Badge variant="green">Aciertos acumulados: {{ puntuacionQuiz }}</Badge>
          </div>

          <div v-if="indiceQuizActual < ejercicio.preguntas.length">
            <p class="text-base font-semibold text-neutral-900 mb-2">
              {{ ejercicio.preguntas[indiceQuizActual].enunciado }}
            </p>
            <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-3">
              <p class="text-lg font-mono font-bold text-blue-800 mb-1">
                {{ ejercicio.preguntas[indiceQuizActual].proposicion }}
              </p>
              <p class="text-xs font-semibold text-neutral-600">
                📌 {{ ejercicio.preguntas[indiceQuizActual].textoAsignacion }}
              </p>
            </div>

            <p class="text-xs text-neutral-500 mb-3 font-medium">
              Selecciona el valor de verdad correspondiente a esta asignación:
            </p>

            <div class="grid grid-cols-2 gap-3 mb-2">
              <button
                v-for="opcion in OPCIONES_QUIZ"
                :key="opcion"
                :disabled="Boolean(seleccionUsuario)"
                :class="[
                  'py-3.5 px-4 rounded-xl border text-sm font-bold transition-all shadow-2xs text-center',
                  seleccionUsuario === opcion
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs scale-[0.99]'
                    : 'border-neutral-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 text-neutral-800',
                ]"
                @click="responderQuiz(opcion)"
              >
                {{ opcion }}
              </button>
            </div>
          </div>
        </Card>

        <!-- Quiz Completed with Comprehensive Feedback Breakdown -->
        <div v-if="ejercicio.tipo === 'quiz' && respuestaEnviada" class="space-y-6">
          <!-- Summary Hero Card -->
          <Card
            class="border-2 text-center"
            :class="esCorrecta ? 'border-emerald-200 bg-emerald-50/30' : 'border-amber-200 bg-amber-50/30'"
          >
            <div
              class="inline-flex p-3 rounded-full mb-3 shadow-xs"
              :class="esCorrecta ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
            >
              <span class="text-3xl">{{ esCorrecta ? '🏆' : '📝' }}</span>
            </div>
            <h2 class="text-2xl font-bold text-neutral-900 mb-1">Resultados del Cuestionario</h2>
            <p class="text-sm text-neutral-600 mb-5 max-w-lg mx-auto">
              {{
                esCorrecta
                  ? '¡Excelente trabajo! Has demostrado dominio en la evaluación proposicional paso a paso.'
                  : 'Has completado el cuestionario. Consulta el desglose detallado de errores y soluciones abajo para reforzar tus conocimientos.'
              }}
            </p>

            <!-- Metrics -->
            <div class="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
              <div class="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
                <span class="text-xs text-neutral-500 font-medium">Aciertos</span>
                <p class="text-2xl font-black text-emerald-600">{{ puntuacionQuiz }}</p>
              </div>
              <div class="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
                <span class="text-xs text-neutral-500 font-medium">Equivocaciones</span>
                <p class="text-2xl font-black text-rose-600">{{ ejercicio.preguntas.length - puntuacionQuiz }}</p>
              </div>
              <div class="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
                <span class="text-xs text-neutral-500 font-medium">Calificación</span>
                <p class="text-2xl font-black text-blue-600">
                  {{ Math.round((puntuacionQuiz / ejercicio.preguntas.length) * 100) }}%
                </p>
              </div>
            </div>

            <div class="flex justify-center gap-3 flex-wrap">
              <Button variant="secondary" @click="reiniciarQuiz">🔄 Reintentar Cuestionario</Button>
              <Button
                v-if="siguienteEjercicioId"
                variant="primary"
                @click="irAEjercicio(siguienteEjercicioId)"
              >
                Siguiente Ejercicio &rarr;
              </Button>
            </div>
          </Card>

          <!-- Detailed Question-by-Question Feedback Review -->
          <Card>
            <div class="border-b border-neutral-200 pb-3 mb-5">
              <h3 class="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span>📋</span>
                <span>Revisión Detallada y Retroalimentación por Pregunta</span>
              </h3>
              <p class="text-xs text-neutral-500 mt-1">
                A continuación se muestra en qué preguntas acertaste o te equivocaste, tu respuesta versus la respuesta correcta, y la resolución analítica paso a paso:
              </p>
            </div>

            <div class="space-y-5">
              <div
                v-for="item in historialQuiz"
                :key="item.numero"
                :class="[
                  'p-4 sm:p-5 rounded-2xl border transition-all text-sm shadow-2xs',
                  item.esCorrecta
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-rose-200 bg-rose-50/30',
                ]"
              >
                <!-- Question Header -->
                <div class="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <span class="font-bold text-neutral-800 text-sm">
                    Pregunta {{ item.numero }} de {{ historialQuiz.length }}
                  </span>
                  <span
                    :class="[
                      'text-xs font-bold px-3 py-1 rounded-full border inline-flex items-center gap-1',
                      item.esCorrecta
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300',
                    ]"
                  >
                    <span v-if="item.esCorrecta">✓ Acierto (+1 pt)</span>
                    <span v-else>✗ Equivocación (0 pts)</span>
                  </span>
                </div>

                <!-- Formula Statement & Variable Assignment -->
                <div class="bg-white p-3.5 rounded-xl border border-neutral-200 mb-3 space-y-1.5">
                  <p class="text-xs text-neutral-500 font-semibold">{{ item.enunciado }}</p>
                  <p class="text-base font-mono font-bold text-blue-800">{{ item.proposicion }}</p>
                  <p class="text-xs font-medium text-neutral-600 bg-neutral-50 px-2.5 py-1 rounded-md inline-block border border-neutral-200/60">
                    📌 {{ item.textoAsignacion }}
                  </p>
                </div>

                <!-- Answer Comparison Boxes -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5 text-xs">
                  <div
                    :class="[
                      'p-3 rounded-xl border font-semibold',
                      item.esCorrecta
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50 border-rose-200 text-rose-950',
                    ]"
                  >
                    <span class="text-[11px] block font-normal opacity-75">Tu respuesta seleccionada:</span>
                    <span class="text-sm font-bold">{{ item.opcionSeleccionada }}</span>
                    <span class="ml-1 font-bold">{{ item.esCorrecta ? '✓' : '✗' }}</span>
                  </div>

                  <div class="p-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 font-semibold">
                    <span class="text-[11px] block font-normal text-neutral-500">Respuesta correcta esperada:</span>
                    <span class="text-sm text-emerald-700 font-bold">{{ item.opcionCorrecta }} ✓</span>
                  </div>
                </div>

                <!-- Step-by-Step Explanation and Feedback -->
                <div
                  :class="[
                    'p-3.5 rounded-xl border text-xs leading-relaxed',
                    item.esCorrecta
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/80 border-rose-200 text-rose-950',
                  ]"
                >
                  <p class="font-bold mb-1.5 flex items-center gap-1.5 text-xs">
                    <span v-if="!item.esCorrecta">⚠️ Dónde estuvo la equivocación y resolución paso a paso:</span>
                    <span v-else>💡 Demostración formal y sustitución de variables:</span>
                  </p>
                  <p class="font-normal text-neutral-800 whitespace-pre-line">{{ item.explicacion }}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Footer Navigation buttons -->
        <div class="flex justify-between items-center pt-2">
          <Button variant="ghost" @click="router.push('/ejercicios')">
            &larr; Volver al catálogo
          </Button>

          <Button
            v-if="siguienteEjercicioId && respuestaEnviada"
            variant="primary"
            @click="irAEjercicio(siguienteEjercicioId)"
          >
            Siguiente Ejercicio &rarr;
          </Button>
        </div>
      </template>
    </div>
  </section>
</template>
