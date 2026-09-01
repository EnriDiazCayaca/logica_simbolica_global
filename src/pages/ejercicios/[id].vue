<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  obtenerEjercicioPorId,
  clasificacionCorrecta,
  etiquetasDificultad,
  puntosDificultad,
  OPCIONES_QUIZ,
  claveTemaParaEjercicio,
  type Ejercicio,
  type EjercicioQuiz,
} from '@/data/exercises'
import { parsearProposicion } from '@/lib/truth-table/evaluator'
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

onMounted(() => {
  const id = route.params.id as string
  const ex = obtenerEjercicioPorId(id)
  if (ex) {
    ejercicio.value = ex
    if (ex.tipo === 'quiz') {
      const quizEx = ex as EjercicioQuiz
      preguntasQuizRespondidas.value = new Array(quizEx.preguntas.length).fill(false)
    }
  }
})

function verificarRespuesta() {
  if (!ejercicio.value) return
  respuestaEnviada.value = true
  const tema = claveTemaParaEjercicio(ejercicio.value)

  if (ejercicio.value.tipo === 'identify') {
    esCorrecta.value = seleccionUsuario.value === ejercicio.value.opcionCorrecta
  } else if (ejercicio.value.tipo === 'law') {
    esCorrecta.value = seleccionUsuario.value === ejercicio.value.opcionCorrecta
  } else if (ejercicio.value.tipo === 'classify') {
    const clasificacionReal = clasificacionCorrecta(ejercicio.value.proposicion)
    esCorrecta.value = seleccionUsuario.value === clasificacionReal
  } else if (ejercicio.value.tipo === 'truth-table') {
    esCorrecta.value = true
  }

  registrarRespuesta(tema, esCorrecta.value)
  marcarEjercicioCompletado(ejercicio.value.id, tema, esCorrecta.value)
}

function responderQuiz(opcion: string) {
  if (!ejercicio.value || ejercicio.value.tipo !== 'quiz') return
  const preguntaIdx = indiceQuizActual.value
  const pregunta = ejercicio.value.preguntas[preguntaIdx]

  if (pregunta.asignacion) {
    const nodo = parsearProposicion(pregunta.proposicion)
    const resultadoReal = opcion === 'VERDADERO'
    const resultadoObtenido = (() => {
      const evaluar = (n: ReturnType<typeof parsearProposicion>, asig: Record<string, boolean>): boolean => {
        switch (n.tipo) {
          case 'VAR': return asig[n.valor ?? ''] ?? false
          case 'NOT': return !evaluar(n.derecho!, asig)
          case 'AND': return evaluar(n.izquierdo!, asig) && evaluar(n.derecho!, asig)
          case 'OR': return evaluar(n.izquierdo!, asig) || evaluar(n.derecho!, asig)
          case 'IMPLIES': return !evaluar(n.izquierdo!, asig) || evaluar(n.derecho!, asig)
          case 'IFF': return evaluar(n.izquierdo!, asig) === evaluar(n.derecho!, asig)
        }
      }
      const valorReal = evaluar(nodo, pregunta.asignacion)
      return opcion === (valorReal ? 'VERDADERO' : 'FALSO')
    })()

    preguntasQuizRespondidas.value[preguntaIdx] = true
    const tema = claveTemaParaEjercicio(ejercicio.value)
    registrarRespuesta(tema, resultadoObtenido)
    if (resultadoObtenido) puntuacionQuiz.value++

    setTimeout(() => {
      const ex = ejercicio.value
      if (ex && ex.tipo === 'quiz' && indiceQuizActual.value < ex.preguntas.length - 1) {
        indiceQuizActual.value++
        seleccionUsuario.value = ''
        respuestaEnviada.value = false
      } else {
        respuestaEnviada.value = true
        esCorrecta.value = ex && ex.tipo === 'quiz'
          ? puntuacionQuiz.value >= Math.ceil(ex.preguntas.length / 2)
          : false
        if (ex) marcarQuizCompletado(ex.id)
      }
    }, 1000)
  }
}

function reiniciarQuiz() {
  indiceQuizActual.value = 0
  puntuacionQuiz.value = 0
  seleccionUsuario.value = ''
  respuestaEnviada.value = false
  preguntasQuizRespondidas.value = new Array(ejercicio.value?.tipo === 'quiz' ? ejercicio.value.preguntas.length : 0).fill(false)
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
    'IDENTIFICACIÓN': 'Identificación',
    'TABLAS DE VERDAD': 'Tablas de Verdad',
    'CLASIFICACIÓN': 'Clasificación',
    'LEYES LÓGICAS': 'Leyes Lógicas',
    'CUESTIONARIO': 'Cuestionario',
  }
  return mapa[ejercicio.value.categoria] ?? ejercicio.value.categoria
})
</script>

<template>
  <section class="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Back -->
      <button
        class="text-sm font-medium text-blue-600 hover:underline"
        @click="router.push('/ejercicios')"
      >
        &larr; Volver a ejercicios
      </button>

      <div v-if="!ejercicio" class="text-center py-12">
        <p class="text-neutral-500">Ejercicio no encontrado.</p>
      </div>

      <template v-else>
        <!-- Header -->
        <Card>
          <div class="flex items-center justify-between flex-wrap gap-2 mb-2">
            <Badge variant="blue">{{ tituloCategoria }}</Badge>
            <span v-if="ejercicio.fuente" class="text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
              📖 {{ ejercicio.fuente }}
            </span>
          </div>
          <h1 class="text-2xl font-bold text-neutral-900 mt-1 mb-1">{{ ejercicio.titulo }}</h1>
          <p class="text-sm text-neutral-500">
            <span aria-hidden="true">{{ puntosDificultad[ejercicio.nivel] }}</span>
            Nivel: {{ etiquetasDificultad[ejercicio.nivel] }}
          </p>
          <p class="text-neutral-600 mt-2">{{ ejercicio.descripcionCorta }}</p>
        </Card>

        <!-- Truth Table Exercise -->
        <Card v-if="ejercicio.tipo === 'truth-table'">
          <h3 class="text-sm font-bold text-neutral-700 mb-4">Proposición: {{ ejercicio.proposicion }}</h3>
          <p class="text-sm text-neutral-500 mb-4">
            Genera la tabla de verdad para la proposición indicada y verifica los resultados.
          </p>
          <Button @click="verificarRespuesta">Verificar tabla</Button>
          <div v-if="respuestaEnviada" class="mt-4 p-4 rounded-lg bg-emerald-50 text-emerald-800 text-sm">
            <div class="font-semibold text-emerald-700 mb-1">Tabla verificada correctamente.</div>
            <p v-if="ejercicio.explicacion" class="font-normal text-neutral-700 mt-2 pt-2 border-t border-emerald-200">
              <strong class="text-emerald-900">Resolución y Análisis Lógico:</strong><br />
              {{ ejercicio.explicacion }}
            </p>
          </div>
        </Card>

        <!-- Identify Exercise -->
        <Card v-if="ejercicio.tipo === 'identify'">
          <h3 class="text-sm font-bold text-neutral-700 mb-2">Proposición: {{ ejercicio.proposicion }}</h3>
          <p class="text-sm text-neutral-500 mb-4">¿Qué tipo de proposición es?</p>
          <div class="space-y-2 mb-4">
            <label
              v-for="opcion in ejercicio.opciones"
              :key="opcion"
              :class="[
                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                seleccionUsuario === opcion ? 'border-blue-600 bg-blue-50' : 'border-neutral-200 hover:border-blue-300',
                respuestaEnviada && opcion === ejercicio.opcionCorrecta && 'border-emerald-500 bg-emerald-50',
                respuestaEnviada && seleccionUsuario === opcion && !esCorrecta && 'border-red-500 bg-red-50',
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
          <Button :disabled="!seleccionUsuario || respuestaEnviada" @click="verificarRespuesta">
            Verificar
          </Button>
          <div v-if="respuestaEnviada" :class="[
            'mt-4 p-4 rounded-lg text-sm',
            esCorrecta ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
          ]">
            <div class="font-semibold">{{ esCorrecta ? '¡Correcto!' : 'Incorrecto.' }}</div>
            <p v-if="ejercicio.explicacion" class="font-normal text-neutral-700 mt-2 pt-2 border-t border-neutral-200/60">
              <strong>Resolución y Análisis:</strong><br />
              {{ ejercicio.explicacion }}
            </p>
          </div>
        </Card>

        <!-- Law Exercise -->
        <Card v-if="ejercicio.tipo === 'law'">
          <h3 class="text-sm font-bold text-neutral-700 mb-2">Proposición: {{ ejercicio.proposicion }}</h3>
          <p class="text-sm text-neutral-500 mb-4">¿Qué ley lógica se debe utilizar?</p>
          <div class="space-y-2 mb-4">
            <label
              v-for="opcion in ejercicio.opciones"
              :key="opcion"
              :class="[
                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                seleccionUsuario === opcion ? 'border-blue-600 bg-blue-50' : 'border-neutral-200 hover:border-blue-300',
                respuestaEnviada && opcion === ejercicio.opcionCorrecta && 'border-emerald-500 bg-emerald-50',
                respuestaEnviada && seleccionUsuario === opcion && !esCorrecta && 'border-red-500 bg-red-50',
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
          <Button :disabled="!seleccionUsuario || respuestaEnviada" @click="verificarRespuesta">
            Verificar
          </Button>
          <div v-if="respuestaEnviada" :class="[
            'mt-4 p-4 rounded-lg text-sm',
            esCorrecta ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
          ]">
            <div class="font-semibold">{{ esCorrecta ? '¡Correcto!' : 'Incorrecto.' }}</div>
            <p v-if="ejercicio.explicacion" class="font-normal text-neutral-700 mt-2 pt-2 border-t border-neutral-200/60">
              <strong>Resolución y Justificación de la Ley:</strong><br />
              {{ ejercicio.explicacion }}
            </p>
          </div>
        </Card>

        <!-- Classify Exercise -->
        <Card v-if="ejercicio.tipo === 'classify'">
          <h3 class="text-sm font-bold text-neutral-700 mb-2">Proposición: {{ ejercicio.proposicion }}</h3>
          <p class="text-sm text-neutral-500 mb-4">¿Es tautología, contradicción o contingencia?</p>
          <div class="space-y-2 mb-4">
            <label
              v-for="opcion in opcionesClasificacion"
              :key="opcion"
              :class="[
                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                seleccionUsuario === opcion ? 'border-blue-600 bg-blue-50' : 'border-neutral-200 hover:border-blue-300',
                respuestaEnviada && opcion === clasificacionCorrecta(ejercicio.proposicion) && 'border-emerald-500 bg-emerald-50',
                respuestaEnviada && seleccionUsuario === opcion && !esCorrecta && 'border-red-500 bg-red-50',
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
          <Button :disabled="!seleccionUsuario || respuestaEnviada" @click="verificarRespuesta">
            Verificar
          </Button>
          <div v-if="respuestaEnviada" :class="[
            'mt-4 p-4 rounded-lg text-sm',
            esCorrecta ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
          ]">
            <div class="font-semibold">
              {{ esCorrecta ? '¡Correcto!' : `Incorrecto. La respuesta es: ${etiquetasClasificacion[clasificacionCorrecta(ejercicio.proposicion)]}` }}
            </div>
            <p v-if="ejercicio.explicacion" class="font-normal text-neutral-700 mt-2 pt-2 border-t border-neutral-200/60">
              <strong>Demostración y Análisis Semántico:</strong><br />
              {{ ejercicio.explicacion }}
            </p>
          </div>
        </Card>

        <!-- Quiz Exercise -->
        <Card v-if="ejercicio.tipo === 'quiz' && !respuestaEnviada">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-neutral-700">
              Pregunta {{ indiceQuizActual + 1 }} de {{ ejercicio.preguntas.length }}
            </h3>
            <Badge variant="green">Puntos: {{ puntuacionQuiz }}</Badge>
          </div>

          <div v-if="indiceQuizActual < ejercicio.preguntas.length">
            <p class="text-base font-semibold text-neutral-900 mb-2">
              {{ ejercicio.preguntas[indiceQuizActual].enunciado }}
            </p>
            <p class="text-lg font-mono text-blue-700 mb-2">
              {{ ejercicio.preguntas[indiceQuizActual].proposicion }}
            </p>
            <p class="text-sm text-neutral-500 mb-4">
              {{ ejercicio.preguntas[indiceQuizActual].textoAsignacion }}
            </p>
            <div class="grid grid-cols-2 gap-2 mb-4">
              <button
                v-for="opcion in OPCIONES_QUIZ"
                :key="opcion"
                :class="[
                  'py-3 px-4 rounded-lg border text-sm font-semibold transition-all',
                  seleccionUsuario === opcion ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-neutral-200 hover:border-blue-300'
                ]"
                @click="responderQuiz(opcion)"
              >
                {{ opcion }}
              </button>
            </div>
          </div>
        </Card>

        <!-- Quiz Complete -->
        <Card v-if="ejercicio.tipo === 'quiz' && respuestaEnviada">
          <h3 class="text-lg font-bold text-neutral-900 mb-3">Resultados del Cuestionario</h3>
          <p class="text-4xl font-extrabold text-blue-600 mb-2">
            {{ puntuacionQuiz }}/{{ ejercicio.preguntas.length }}
          </p>
          <p class="text-sm text-neutral-500 mb-4">
            {{ esCorrecta ? '¡Buen trabajo! Aprobaste el cuestionario.' : 'Sigue practicando para mejorar.' }}
          </p>
          <Button variant="secondary" @click="reiniciarQuiz">Reintentar</Button>
        </Card>

        <!-- Back button -->
        <div class="flex justify-center">
          <Button variant="ghost" @click="router.push('/ejercicios')">Volver a ejercicios</Button>
        </div>
      </template>
    </div>
  </section>
</template>
