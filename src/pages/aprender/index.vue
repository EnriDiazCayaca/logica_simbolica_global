<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import OptionPill from '@/components/ui/OptionPill.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { LEYES_LOGICAS, type LeyLogica } from '@/data/logicLaws'
import { ejercicios, type EjercicioIdentificar, type EjercicioLey, type ClaveTema } from '@/data/exercises'
import { parsearProposicion, evaluar, recolectarVariables, ErrorParseoLogico } from '@/lib/truth-table/evaluator'
import { registrarRespuesta, temaRecomendado, temasDebiles, type ProgresoTema } from '@/store/progress'
import { siteContent } from '@/content'

const router = useRouter()
const t = siteContent.aprender
const modoLiteral = t.modoLiteral

// ── Catálogo de conceptos ────────────────────────────────────────────

type GrupoConcepto = 'conector' | 'ley'

interface Concepto {
  id: string
  grupo: GrupoConcepto
  titulo: string
  simbolo?: string
  definicion: string
  proposicion: string
  proposicionDisplay: string
  tema: ClaveTema
}

const CONECTORES: Concepto[] = t.conectores.map(c => ({
  id: c.id,
  grupo: 'conector' as GrupoConcepto,
  titulo: c.titulo,
  simbolo: modoLiteral ? c.simboloLiteral : c.simbolo,
  definicion: c.definicion,
  proposicion: c.proposicion,
  proposicionDisplay: modoLiteral ? c.proposicionLiteral : c.proposicion,
  tema: 'identificacion' as ClaveTema,
}))

const LEYES_CONCEPTOS: Concepto[] = LEYES_LOGICAS.map((ley: LeyLogica) => ({
  id: `ley-${ley.id}`,
  grupo: 'ley' as GrupoConcepto,
  titulo: ley.nombre,
  definicion: ley.descripcion,
  proposicion: ley.formulas[0],
  proposicionDisplay: (modoLiteral && (ley as any).formulasLiteral?.[0]) ? (ley as any).formulasLiteral[0] : ley.formulas[0],
  tema: 'leyes-logicas' as ClaveTema,
}))

const conceptos: Concepto[] = [...CONECTORES, ...LEYES_CONCEPTOS]

function formulasLey(concepto: Concepto): string[] {
  if (concepto.grupo !== 'ley') return []
  const ley = LEYES_LOGICAS.find((l) => `ley-${l.id}` === concepto.id)
  if (!ley) return []
  if (modoLiteral && (ley as any).formulasLiteral) return (ley as any).formulasLiteral as string[]
  return ley.formulas
}

// ── Emparejamiento con banco de ejercicios ───────────────────────────

function normalizarTokens(s: string): Set<string> {
  return new Set(
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/\s+/).filter((w) => w && w !== 'ley'),
  )
}

function conjuntosIguales(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false
  for (const x of a) if (!b.has(x)) return false
  return true
}

function ejercicioEmparejado(concepto: Concepto): EjercicioIdentificar | EjercicioLey | null {
  if (concepto.grupo === 'conector') {
    return ejercicios.find(
      (e): e is EjercicioIdentificar => e.tipo === 'identify' && e.opcionCorrecta === concepto.titulo,
    ) ?? null
  }
  const objetivo = normalizarTokens(concepto.titulo)
  return ejercicios.find(
    (e): e is EjercicioLey => e.tipo === 'law' && conjuntosIguales(normalizarTokens(e.opcionCorrecta), objetivo),
  ) ?? null
}

// ── Verificación en vivo de equivalencias ────────────────────────────

interface VerificacionViva {
  izquierda: string
  derecha: string
  valorIzq: boolean
  valorDer: boolean
  textoAsignacion: string
}

function intentarVerificarVivo(formula: string): VerificacionViva | null {
  if (formula.includes(',')) return null
  const partes = formula.split('≡').map((s) => s.trim())
  if (partes.length !== 2) return null
  try {
    const astIzq = parsearProposicion(partes[0])
    const astDer = parsearProposicion(partes[1])
    const vars = Array.from(new Set([...recolectarVariables(astIzq), ...recolectarVariables(astDer)]))
    const asignacion: Record<string, boolean> = {}
    let alternar = true
    vars.forEach((v) => {
      if (v === 'V') asignacion[v] = true
      else if (v === 'F') asignacion[v] = false
      else { asignacion[v] = alternar; alternar = !alternar }
    })
    const valorIzq = evaluar(astIzq, asignacion)
    const valorDer = evaluar(astDer, asignacion)
    const textoAsignacion = vars.filter((v) => v !== 'V' && v !== 'F')
      .map((v) => `${v.toLowerCase()} = ${asignacion[v] ? 'Verdadero' : 'Falso'}`).join(', ')
    return { izquierda: partes[0], derecha: partes[1], valorIzq, valorDer, textoAsignacion }
  } catch {
    return null
  }
}

// ── Ejemplo en vivo para conectores ──────────────────────────────────

interface EjemploConector {
  proposicion: string
  textoAsignacion: string
  resultado: boolean
}

function construirEjemploConector(concepto: Concepto): EjemploConector {
  const ast = parsearProposicion(concepto.proposicion)
  const vars = recolectarVariables(ast)
  const asignacion: Record<string, boolean> = {}
  vars.forEach((v, idx) => { asignacion[v] = idx % 2 === 0 })
  const resultado = evaluar(ast, asignacion)
  const textoAsignacion = vars.map((v) => `${v.toLowerCase()} = ${asignacion[v] ? 'Verdadero' : 'Falso'}`).join(', ')
  return { proposicion: concepto.proposicionDisplay, textoAsignacion, resultado }
}

// ── Estado de navegación ─────────────────────────────────────────────

const etiquetaGrupo: Record<GrupoConcepto, string> = { conector: t.etiquetasGrupo.conector, ley: t.etiquetasGrupo.ley }
const grupoActivo = ref<GrupoConcepto>('conector')
const conceptoSeleccionadoId = ref<string | null>(CONECTORES[0]?.id ?? null)
const paso = ref(1)
const opcionSeleccionada = ref<string | null>(null)
const respondido = ref(false)
const fueCorrecto = ref(false)
const vivoRespondido = ref(false)
const vivoCorrecto = ref<boolean | null>(null)
const conceptosVistos = ref<Set<string>>(new Set())

const conceptosVisibles = computed(() => conceptos.filter((c) => c.grupo === grupoActivo.value))
const conceptoSeleccionado = computed(() => conceptos.find((c) => c.id === conceptoSeleccionadoId.value) ?? null)

const ejemploConector = computed<EjemploConector | null>(() => {
  if (!conceptoSeleccionado.value || conceptoSeleccionado.value.grupo !== 'conector') return null
  return construirEjemploConector(conceptoSeleccionado.value)
})

const verificacionViva = computed<VerificacionViva | null>(() => {
  if (!conceptoSeleccionado.value) return null
  return intentarVerificarVivo(conceptoSeleccionado.value.proposicion)
})

const ejercicioEmp = computed(() => conceptoSeleccionado.value ? ejercicioEmparejado(conceptoSeleccionado.value) : null)

function seleccionarConcepto(concepto: Concepto) {
  conceptoSeleccionadoId.value = concepto.id
  paso.value = 1
  opcionSeleccionada.value = null
  respondido.value = false
  fueCorrecto.value = false
  vivoRespondido.value = false
  vivoCorrecto.value = null
}

watch(grupoActivo, () => {
  const primero = conceptosVisibles.value[0]
  if (primero) seleccionarConcepto(primero)
})

function irAPaso(n: number) {
  paso.value = Math.max(1, Math.min(4, n))
}

function elegirOpcion(opcion: string) {
  if (respondido.value || !ejercicioEmp.value || !conceptoSeleccionado.value) return
  opcionSeleccionada.value = opcion
  respondido.value = true
  fueCorrecto.value = opcion === ejercicioEmp.value.opcionCorrecta
  registrarRespuesta(conceptoSeleccionado.value.tema, fueCorrecto.value)
  conceptosVistos.value.add(conceptoSeleccionado.value.id)
}

function responderVerificacionViva(diceVerdadero: boolean) {
  if (vivoRespondido.value || !verificacionViva.value || !conceptoSeleccionado.value) return
  const equivalenteReal = verificacionViva.value.valorIzq === verificacionViva.value.valorDer
  const correcto = diceVerdadero === equivalenteReal
  vivoRespondido.value = true
  vivoCorrecto.value = correcto
  registrarRespuesta(conceptoSeleccionado.value.tema, correcto)
  conceptosVistos.value.add(conceptoSeleccionado.value.id)
}

function estadoOpcion(opcion: string): 'default' | 'correct' | 'incorrect' {
  if (!respondido.value || !ejercicioEmp.value) return 'default'
  if (opcion === ejercicioEmp.value.opcionCorrecta) return 'correct'
  if (opcion === opcionSeleccionada.value) return 'incorrect'
  return 'default'
}

function irAEjercicios(tema?: ClaveTema) {
  if (tema) router.push({ path: '/ejercicios', query: { tema } })
  else router.push('/ejercicios')
}

function practicarRecomendacion(t: ProgresoTema) {
  const concepto = conceptos.find((c) => c.tema === t.clave)
  if (concepto) {
    grupoActivo.value = concepto.grupo
    seleccionarConcepto(concepto)
  } else {
    irAEjercicios(t.clave)
  }
}
</script>

<template>
  <section class="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-neutral-900 mb-2">{{ t.titulo }}</h1>
      <p class="text-neutral-500 text-sm mb-6 max-w-xl">
        {{ t.subtitulo }}
      </p>

      <!-- Repaso inteligente -->
      <div v-if="temaRecomendado || temasDebiles.length > 0" class="bg-neutral-900 text-white rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="flex-1">
          <p class="font-bold text-sm mb-1">{{ t.repaso.titulo }}</p>
          <p v-if="temaRecomendado" class="text-sm text-neutral-300">
            {{ t.repaso.recomendacionPrefix }} <strong class="text-white">{{ temaRecomendado.etiqueta }}</strong>
            <span v-if="temaRecomendado.total > 0"> ({{ t.repaso.precisionLabel }}: {{ temaRecomendado.precision }}%)</span>.
          </p>
          <div v-if="temasDebiles.length > 0" class="flex flex-wrap gap-2 mt-2">
            <button
              v-for="td in temasDebiles"
              :key="td.clave"
              class="bg-white/10 rounded-full px-3 py-1 text-xs font-semibold hover:bg-white/20 transition-colors"
              @click="practicarRecomendacion(td)"
            >
              {{ t.repaso.reforzarPrefix }} {{ td.etiqueta }} · {{ td.precision }}%
            </button>
          </div>
        </div>
        <Button v-if="temaRecomendado" size="sm" @click="practicarRecomendacion(temaRecomendado)">
          {{ t.repaso.practicarBtn }}
        </Button>
      </div>

      <!-- Tabs de grupo -->
      <div class="flex gap-3 mb-6">
        <button
          v-for="g in (['conector', 'ley'] as GrupoConcepto[])"
          :key="g"
          :class="[
            'py-3 px-5 rounded-xl font-bold text-sm transition-all',
            grupoActivo === g ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-neutral-700 hover:bg-blue-100'
          ]"
          @click="grupoActivo = g"
        >
          {{ etiquetaGrupo[g] }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5 items-start">
        <!-- Lista de conceptos -->
        <div class="bg-neutral-50 rounded-xl p-3 space-y-2">
          <button
            v-for="c in conceptosVisibles"
            :key="c.id"
            type="button"
            :class="[
              'w-full flex items-center gap-2.5 bg-white border rounded-lg px-3.5 py-3 text-sm font-semibold text-left transition-all',
              conceptoSeleccionadoId === c.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-neutral-800 border-neutral-200 hover:border-blue-400'
            ]"
            @click="seleccionarConcepto(c)"
          >
            <span v-if="c.simbolo" class="font-bold text-base w-5 text-center">{{ c.simbolo }}</span>
            <span class="flex-1">{{ c.titulo }}</span>
            <span v-if="conceptosVistos.has(c.id)" class="text-emerald-500 font-bold text-xs">✔</span>
          </button>
        </div>

        <!-- Recorrido guiado -->
        <div v-if="conceptoSeleccionado" class="bg-blue-50/50 rounded-xl p-5">
          <h2 class="text-lg font-bold text-neutral-900 mb-3">{{ conceptoSeleccionado.titulo }}</h2>

          <!-- Pasos -->
          <div class="flex flex-wrap gap-2 mb-4">
            <button
              v-for="(etiqueta, idx) in t.pasos"
              :key="etiqueta"
              type="button"
              :class="[
                'rounded-full px-3.5 py-1.5 text-xs font-bold border transition-all',
                paso === idx + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-neutral-500 border-neutral-200',
                paso > idx + 1 && paso !== idx + 1 ? 'text-emerald-600 border-emerald-500' : ''
              ]"
              @click="irAPaso(idx + 1)"
            >
              {{ idx + 1 }}. {{ etiqueta }}
            </button>
          </div>

          <!-- Paso 1: Definición -->
          <div v-if="paso === 1" class="bg-white rounded-lg p-5 min-h-[140px]">
            <p class="text-sm text-neutral-700 leading-relaxed mb-3">{{ conceptoSeleccionado.definicion }}</p>
            <ul v-if="conceptoSeleccionado.grupo === 'ley'" class="text-sm text-neutral-700 space-y-1 list-disc list-inside">
              <li v-for="f in formulasLey(conceptoSeleccionado)" :key="f" class="font-mono">{{ f }}</li>
            </ul>
            <p v-else class="text-xs text-neutral-400">
              {{ t.detalle.notacionLabel }} <code class="bg-blue-100 px-1.5 py-0.5 rounded font-bold">{{ conceptoSeleccionado.proposicionDisplay }}</code>
            </p>
          </div>

          <!-- Paso 2: Ejemplo -->
          <div v-if="paso === 2" class="bg-white rounded-lg p-5 min-h-[140px]">
            <template v-if="conceptoSeleccionado.grupo === 'conector' && ejemploConector">
              <p class="text-sm text-neutral-700 mb-2">
                Tomemos <code class="bg-blue-100 px-1.5 py-0.5 rounded font-bold">{{ ejemploConector.proposicion }}</code>
                con {{ ejemploConector.textoAsignacion }}.
              </p>
              <p :class="['text-sm font-bold', ejemploConector.resultado ? 'text-emerald-600' : 'text-red-600']">
                Resultado: {{ ejemploConector.resultado ? 'Verdadero' : 'Falso' }}
              </p>
            </template>
            <template v-else-if="verificacionViva">
              <p class="text-sm text-neutral-700 mb-2">
                Verifiquemos con {{ verificacionViva.textoAsignacion || 'valores constantes' }}:
              </p>
              <p class="text-sm font-mono text-neutral-700">
                <code>{{ verificacionViva.izquierda }}</code> = {{ verificacionViva.valorIzq ? 'V' : 'F' }}
                ·
                <code>{{ verificacionViva.derecha }}</code> = {{ verificacionViva.valorDer ? 'V' : 'F' }}
              </p>
              <p :class="['text-sm font-bold mt-2', verificacionViva.valorIzq === verificacionViva.valorDer ? 'text-emerald-600' : 'text-red-600']">
                {{ verificacionViva.valorIzq === verificacionViva.valorDer
                  ? 'Ambos lados coinciden: la equivalencia se cumple en este caso.'
                  : 'Los lados no coinciden en este caso.' }}
              </p>
            </template>
            <p v-else class="text-sm text-neutral-500">
              Esta ley involucra valores constantes; revisa las fórmulas del paso anterior.
            </p>
          </div>

          <!-- Paso 3: Ejercicio -->
          <div v-if="paso === 3" class="bg-white rounded-lg p-5 min-h-[140px]">
            <template v-if="ejercicioEmp">
              <p class="text-sm text-neutral-700 mb-3">
                {{ ejercicioEmp.tipo === 'identify' ? 'Identifica el tipo de proposición:' : 'Identifica la ley lógica:' }}
                <code class="bg-blue-100 px-1.5 py-0.5 rounded font-bold">{{ ejercicioEmp.proposicion }}</code>
              </p>
              <div class="space-y-2.5 max-w-md">
                <OptionPill
                  v-for="opt in ejercicioEmp.opciones"
                  :key="opt"
                  :label="opt"
                  :selected="opcionSeleccionada === opt"
                  :state="estadoOpcion(opt)"
                  @select="elegirOpcion(opt)"
                />
              </div>
            </template>
            <template v-else-if="verificacionViva">
              <p class="text-sm text-neutral-700 mb-3">
                ¿Es correcta esta equivalencia?
                <code class="bg-blue-100 px-1.5 py-0.5 rounded font-bold">{{ conceptoSeleccionado.proposicionDisplay }}</code>
              </p>
              <div class="flex gap-3">
                <button
                  class="flex-1 py-3 rounded-lg bg-blue-600 text-white font-bold text-sm transition-all disabled:opacity-50"
                  :disabled="vivoRespondido"
                  @click="responderVerificacionViva(true)"
                >
                  Verdadero
                </button>
                <button
                  class="flex-1 py-3 rounded-lg bg-blue-600 text-white font-bold text-sm transition-all disabled:opacity-50"
                  :disabled="vivoRespondido"
                  @click="responderVerificacionViva(false)"
                >
                  Falso
                </button>
              </div>
              <p v-if="vivoRespondido" :class="['text-sm font-bold mt-3', vivoCorrecto ? 'text-emerald-600' : 'text-red-600']">
                {{ vivoCorrecto ? '¡Correcto!' : 'No es correcto.' }}
              </p>
            </template>
            <template v-else>
              <p class="text-sm text-neutral-500 mb-3">
                {{ t.emptyLeyes }}
              </p>
              <Button size="sm" @click="irAEjercicios(conceptoSeleccionado.tema)">Ir a Ejercicios</Button>
            </template>
          </div>

          <!-- Paso 4: Solución -->
          <div v-if="paso === 4" class="bg-white rounded-lg p-5 min-h-[140px]">
            <template v-if="ejercicioEmp && respondido">
              <p :class="['text-sm font-bold mb-2', fueCorrecto ? 'text-emerald-600' : 'text-red-600']">
                {{ fueCorrecto ? '¡Respondiste correctamente!' : `La respuesta correcta era: ${ejercicioEmp.opcionCorrecta}` }}
              </p>
              <p class="text-sm text-neutral-700">{{ ejercicioEmp.explicacion }}</p>
            </template>
            <template v-else-if="verificacionViva && vivoRespondido">
              <p class="text-sm text-neutral-700">
                Explicación: <code>{{ verificacionViva.izquierda }}</code> y <code>{{ verificacionViva.derecha }}</code>
                {{ verificacionViva.valorIzq === verificacionViva.valorDer
                  ? 'producen el mismo valor de verdad, tal como establece esta ley.'
                  : 'no coincidieron con esta asignación particular.' }}
              </p>
            </template>
            <template v-else>
              <p class="text-sm text-neutral-400">
                Completa el paso "Ejercicio" para ver aquí la explicación de la solución.
              </p>
            </template>
          </div>

          <!-- Navegación -->
          <div class="flex justify-between mt-4">
            <Button variant="ghost" size="sm" :disabled="paso === 1" @click="irAPaso(paso - 1)">← Anterior</Button>
            <Button size="sm" :disabled="paso === 4" @click="irAPaso(paso + 1)">Siguiente →</Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
