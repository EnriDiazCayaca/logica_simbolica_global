<script setup lang="ts">
/**
 * PanelTrazabilidad.vue
 * Renderiza el paso a paso de una deducción lógica con explicaciones particionadas,
 * exportación académica (Markdown/LaTeX), y diagnóstico formal con contraejemplos.
 */
import { ref, computed } from 'vue'
import {
  ChevronDown,
  AlertOctagon,
  HelpCircle,
  CheckCircle2,
  Copy,
  Check,
  FileCode2,
  FileText,
  Download,
  ShieldAlert,
  AlertCircle,
  Sparkles,
  Layers,
  Inbox,
  Terminal
} from '@lucide/vue'
import type { PasoInferencia, ErrorLogico } from '@/types/inferencias'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'

interface Props {
  pasos: PasoInferencia[]
  premisasOriginales?: string[]
  conclusionOriginal?: string
  errorLogico?: ErrorLogico
  esInvalido?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  esInvalido: false,
  errorLogico: undefined,
  premisasOriginales: () => [],
  conclusionOriginal: ''
})

// Registro de pasos cuyo acordeón de explicación está abierto
const pasosAbiertos = ref<Record<number, boolean>>({})
const copiadoTipo = ref<'markdown' | 'latex' | null>(null)

const togglePaso = (numeroPaso: number) => {
  pasosAbiertos.value[numeroPaso] = !pasosAbiertos.value[numeroPaso]
}

/**
 * Mapa de traducción a símbolos Markdown Unicode limpios.
 */
const SIMBOLOS_MARKDOWN: Record<string, string> = {
  SI_Y_SOLO_SI: '↔',
  O_EXCLUSIVA: '△',
  INCOMPATIBLE: '↑',
  ENTONCES: '→',
  NI: '↓',
  NO: '¬',
  Y: '∧',
  O: '∨'
}

/**
 * Convierte expresiones a notación simbólica limpia para Markdown (símbolos Unicode legibles sin comandos LaTeX).
 */
const aNotacionMarkdown = (expresion: string): string =>
  expresion
    .replace(
      /\b(SI_Y_SOLO_SI|O_EXCLUSIVA|INCOMPATIBLE|ENTONCES|NO|NI|Y|O)\b/g,
      (op) => SIMBOLOS_MARKDOWN[op] ?? op
    )
    .replace(/\\leftrightarrow/g, '↔')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\oplus/g, '△')
    .replace(/\\uparrow/g, '↑')
    .replace(/\\downarrow/g, '↓')
    .replace(/\\neg\s*/g, '¬')
    .replace(/\\land/g, '∧')
    .replace(/\\lor/g, '∨')
    .replace(/<-->|<=>|<->/g, '↔')
    .replace(/-->|->|=>/g, '→')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * Mapa de traducción: operadores en español del motor → comandos LaTeX de
 * notación simbólica estándar (para que las fórmulas entre $...$ se rendericen).
 */
const SIMBOLOS_MATEMATICOS: Record<string, string> = {
  SI_Y_SOLO_SI: '\\leftrightarrow',
  O_EXCLUSIVA: '\\oplus',
  INCOMPATIBLE: '\\uparrow',
  ENTONCES: '\\rightarrow',
  NI: '\\downarrow',
  NO: '\\neg ',
  Y: '\\land ',
  O: '\\lor '
}

/**
 * Convierte una expresión serializada por el motor (ej. "( P ENTONCES Q )")
 * a notación simbólica apta para LaTeX/MathJax (ej. "(P \\rightarrow Q)").
 * Es idempotente: si la entrada ya usa símbolos, sale intacta.
 */
const aNotacionSimbolica = (expresion: string): string =>
  expresion
    .replace(
      /\b(SI_Y_SOLO_SI|O_EXCLUSIVA|INCOMPATIBLE|ENTONCES|NO|NI|Y|O)\b/g,
      (op) => SIMBOLOS_MATEMATICOS[op]
    )
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * Mapa de símbolos Unicode/ASCII (los que puede traer el texto crudo del
 * usuario) a su comando LaTeX equivalente. Espeja el mapeo del validador
 * (src/lib/validator/validator.ts) para mantener la semántica del motor.
 */
const MAPA_SIMBOLOS_LATEX: Record<string, string> = {
  '↔': '\\leftrightarrow ',
  '⇔': '\\leftrightarrow ',
  '→': '\\rightarrow ',
  '⇒': '\\rightarrow ',
  '⟶': '\\rightarrow ',
  '⊕': '\\oplus ',
  '⊻': '\\oplus ',
  '△': '\\oplus ',
  '↓': '\\downarrow ',
  '⊽': '\\downarrow ',
  '↑': '\\uparrow ',
  '⊼': '\\uparrow ',
  '&': '\\land ',
  '∧': '\\land ',
  '·': '\\land ',
  '^': '\\land ',
  '*': '\\land ',
  '∨': '\\lor ',
  '+': '\\lor ',
  '¬': '\\neg ',
  '~': '\\neg ',
  '!': '\\neg '
}

/**
 * Pasa adicional SOLO para la exportación LaTeX: pdfLaTeX no compila símbolos
 * Unicode en modo matemático (ej. "p → q" lanza "Unicode character → not set
 * up"), así que todo símbolo se convierte a su comando (ej. "p \rightarrow q").
 */
const aCodigoLatex = (expresion: string): string =>
  aNotacionSimbolica(expresion)
    .replace(/<-->|<=>|<->/g, '\\leftrightarrow ')
    .replace(/-->|->|=>/g, '\\rightarrow ')
    .replace(/\(\+\)/g, '\\oplus ')
    .replace(/\|\|/g, '\\lor ')
    .replace(/\|/g, '\\lor ')
    .replace(/\bv\b/g, '\\lor ')
    .replace(/[↔⇔→⇒⟶⊕⊻△↓⊽↑⊼&∧·^*∨+¬~!]/g, (s) => MAPA_SIMBOLOS_LATEX[s] ?? s)
    .replace(/\s+/g, ' ')
    .trim()

/**
 * Genera el texto en formato Markdown de la demostración académica completa con símbolos limpios.
 * Usa listas numeradas globales (premisas + pasos comparten numeración) para
 * que cada línea ocupe su propio bloque al pegarlo en un archivo .md.
 */
const generarMarkdownAcademico = computed(() => {
  if (!props.pasos || props.pasos.length === 0) return ''

  const totalPremisas = props.premisasOriginales.length
  const lineas: string[] = ['### Demostración Formal de Inferencia Lógica', '']

  lineas.push('**Premisas:**', '')
  props.premisasOriginales.forEach((p, i) => {
    lineas.push(`${i + 1}. ${aNotacionMarkdown(p)}`)
  })

  lineas.push('')
  lineas.push(`**Conclusión:** ∴ ${aNotacionMarkdown(props.conclusionOriginal)}`, '')
  lineas.push('**Deducción formal paso a paso:**', '')

  props.pasos.forEach((p) => {
    const numLinea = totalPremisas + p.paso
    const refs = p.premisas.length ? ` (${p.premisas.join(', ')})` : ''
    lineas.push(`${numLinea}. ${aNotacionMarkdown(p.conclusion)} *[${p.regla}${refs}]*`)
  })

  return lineas.join('\n')
})

/**
 * Genera un documento LaTeX completo y autocompilable (pdfLaTeX/XeLaTeX/
 * LuaLaTeX, listo para Overleaf): preámbulo mínimo estándar, planteamiento
 * del argumento y demostración en entorno align* con numeración global.
 */
const generarLatexAcademico = computed(() => {
  if (!props.pasos || props.pasos.length === 0) return ''

  const totalPremisas = props.premisasOriginales.length

  // Filas de la demostración (numeración global: premisas + pasos deducidos)
  const filas: string[] = []
  props.premisasOriginales.forEach((p, i) => {
    filas.push(`(${i + 1}) \\quad & ${aCodigoLatex(p)} && \\text{Premisa}`)
  })

  props.pasos.forEach((p) => {
    const numLinea = totalPremisas + p.paso
    const refs = p.premisas.map((pr) => pr.replace('Línea ', '')).join(', ')
    const justif = refs ? `${p.regla} (${refs})` : p.regla
    filas.push(`\\therefore (${numLinea}) \\quad & ${aCodigoLatex(p.conclusion)} && \\text{[${justif}]}`)
  })

  const lineas: string[] = [
    '% Demostración Formal de Inferencia Lógica',
    '% Documento autocompilable: pegar en un archivo .tex vacío y compilar.',
    '\\documentclass[11pt]{article}',
    '',
    '\\usepackage[utf8]{inputenc}',
    '\\usepackage[T1]{fontenc}',
    '\\usepackage[spanish,es-noshorthands]{babel}',
    '\\usepackage{amsmath}',
    '\\usepackage{amssymb}',
    '\\usepackage[a4paper,margin=2.5cm]{geometry}',
    '',
    '\\title{Demostración Formal de Inferencia Lógica}',
    '\\author{}',
    '\\date{}',
    '',
    '\\begin{document}',
    '',
    '\\maketitle',
    ''
  ]

  if (totalPremisas > 0) {
    lineas.push('\\section*{Argumento}', '', '\\begin{enumerate}')
    props.premisasOriginales.forEach((p) => {
      lineas.push(`  \\item $${aCodigoLatex(p)}$`)
    })
    lineas.push('\\end{enumerate}', '')
  }

  if (props.conclusionOriginal) {
    lineas.push(
      'De las premisas anteriores se busca demostrar formalmente que:',
      '',
      `\\[ \\therefore ${aCodigoLatex(props.conclusionOriginal)} \\]`,
      ''
    )
  }

  lineas.push('\\section*{Demostración formal}', '', '\\begin{align*}')
  filas.forEach((fila, idx) => {
    // Sin \\ al final de la última fila (evita fila vacía antes de \end)
    lineas.push(idx < filas.length - 1 ? `${fila} \\\\` : fila)
  })
  lineas.push('\\end{align*}', '', '\\end{document}')

  return lineas.join('\n')
})

const copiarPortapapeles = async (tipo: 'markdown' | 'latex') => {
  const texto = tipo === 'markdown' ? generarMarkdownAcademico.value : generarLatexAcademico.value
  try {
    await navigator.clipboard.writeText(texto)
    copiadoTipo.value = tipo
    setTimeout(() => {
      copiadoTipo.value = null
    }, 2000)
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err)
  }
}

const descargarArchivo = (tipo: 'markdown' | 'latex') => {
  const contenido = tipo === 'markdown' ? generarMarkdownAcademico.value : generarLatexAcademico.value
  const nombreArchivo = tipo === 'markdown' ? 'demostracion_logica.md' : 'demostracion_logica.tex'
  const mimeType = tipo === 'markdown' ? 'text/markdown;charset=utf-8' : 'text/x-tex;charset=utf-8'

  const blob = new Blob([contenido], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <section
    class="space-y-4"
    role="region"
    aria-label="Trazabilidad y análisis de la demostración"
    aria-live="polite"
  >
    <!-- CASO A: INFERENCIA INVÁLIDA (Diagnóstico formal con Contraejemplo) -->
    <div v-if="props.esInvalido && props.errorLogico" class="space-y-4">
      <div class="p-4 sm:p-5 bg-amber-50/60 border border-amber-200/80 rounded-2xl shadow-xs space-y-3.5">
        <!-- Encabezado del Diagnóstico -->
        <div class="flex items-start gap-3 border-b border-amber-200/60 pb-3">
          <div class="p-2 bg-amber-100 text-amber-800 rounded-xl flex-shrink-0">
            <AlertOctagon :size="18" />
          </div>
          <div>
            <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              Diagnóstico del Fallo
            </span>
            <h3 class="text-sm sm:text-base font-bold text-amber-950">
              {{ props.errorLogico.titulo }}
            </h3>
          </div>
        </div>

        <!-- Partición 1: Detalle del Problema Detectado -->
        <div class="space-y-1 text-xs text-amber-950 bg-white/90 p-3 rounded-xl border border-amber-100/80 shadow-2xs">
          <span class="font-bold uppercase tracking-wider text-[10px] text-amber-800 flex items-center gap-1">
            <FileText :size="11" class="text-amber-700" />
            <span>Análisis:</span>
          </span>
          <p class="leading-relaxed text-slate-700">
            {{ props.errorLogico.mensaje }}
          </p>
        </div>

        <!-- Partición 2: ¿Por qué falla el razonamiento? -->
        <div class="space-y-1 text-xs text-slate-800 bg-white/90 p-3 rounded-xl border border-amber-100/80 shadow-2xs">
          <span class="font-bold uppercase tracking-wider text-[10px] text-rose-700 flex items-center gap-1">
            <AlertCircle :size="11" class="text-rose-600" />
            <span>¿Por qué falla este razonamiento?</span>
          </span>
          <p class="leading-relaxed text-slate-700">
            {{ props.errorLogico.porQueFalla }}
          </p>
        </div>

        <!-- Partición 3: Contraejemplo Semántico Matemático (Si existe) -->
        <div
          v-if="props.errorLogico.contraejemplo"
          class="space-y-2 text-xs bg-rose-50/80 p-3.5 rounded-xl border border-rose-200/80 shadow-2xs"
        >
          <div class="flex items-center justify-between flex-wrap gap-1">
            <span class="font-bold uppercase tracking-wider text-[10px] text-rose-800 flex items-center gap-1.5">
              <ShieldAlert :size="12" class="text-rose-600" />
              <span>Contraejemplo que refuta la validez:</span>
            </span>
            <span class="text-[10px] font-mono bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">
              Premisas = V | Conclusión = F
            </span>
          </div>

          <!-- Asignación de variables -->
          <div class="flex flex-wrap gap-1.5 pt-0.5">
            <div
              v-for="(val, vNombre) in props.errorLogico.contraejemplo.valores"
              :key="vNombre"
              class="flex items-center gap-1 px-2 py-0.5 bg-white rounded-lg border border-rose-200 font-mono text-xs shadow-2xs"
            >
              <strong class="text-slate-800">{{ vNombre }}</strong>
              <span class="text-slate-400">=</span>
              <span :class="val ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'">
                {{ val ? 'Verdadero (V)' : 'Falso (F)' }}
              </span>
            </div>
          </div>

          <p class="text-[11px] text-rose-900/90 leading-relaxed pt-0.5 italic">
            Con esta asignación, todas las premisas son verdaderas pero la conclusión resulta falsa; el argumento queda formalmente refutado.
          </p>
        </div>

        <!-- Partición 4: ¿Cómo corregir el argumento? -->
        <div class="space-y-1 text-xs text-blue-950 bg-blue-50/80 p-3 rounded-xl border border-blue-100/80 shadow-2xs">
          <span class="font-bold uppercase tracking-wider text-[10px] text-blue-700 flex items-center gap-1">
            <Sparkles :size="11" class="text-blue-600" />
            <span>Sugerencia de corrección:</span>
          </span>
          <p class="leading-relaxed text-slate-700">
            {{ props.errorLogico.sugerencia }}
          </p>
        </div>
      </div>
    </div>

    <!-- CASO B: INFERENCIA VÁLIDA CON PASOS DEMOSTRADOS -->
    <div v-else-if="props.pasos && props.pasos.length > 0" class="space-y-4">
      <!-- Barra de Exportación Académica -->
      <div class="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100/80 rounded-xl border border-slate-200 text-xs">
        <span class="font-semibold text-slate-600 flex items-center gap-1.5 text-xs">
          <FileCode2 :size="13" class="text-slate-500" />
          <span>Exportar:</span>
        </span>
        <div class="flex flex-wrap items-center gap-1.5">
          <!-- Copiar Markdown -->
          <button
            type="button"
            @click="copiarPortapapeles('markdown')"
            title="Copiar demostración en Markdown"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer text-xs"
          >
            <component :is="copiadoTipo === 'markdown' ? Check : FileText" :size="12" :class="copiadoTipo === 'markdown' ? 'text-emerald-600' : ''" />
            <span>{{ copiadoTipo === 'markdown' ? '¡Copiado MD!' : 'Copiar MD' }}</span>
          </button>

          <!-- Descargar Markdown -->
          <button
            type="button"
            @click="descargarArchivo('markdown')"
            title="Descargar archivo .md"
            class="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer text-xs"
          >
            <Download :size="12" class="text-blue-600" />
            <span>.md</span>
          </button>

          <!-- Copiar LaTeX -->
          <button
            type="button"
            @click="copiarPortapapeles('latex')"
            title="Copiar demostración en LaTeX"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer text-xs"
          >
            <component :is="copiadoTipo === 'latex' ? Check : FileCode2" :size="12" :class="copiadoTipo === 'latex' ? 'text-emerald-600' : ''" />
            <span>{{ copiadoTipo === 'latex' ? '¡Copiado LaTeX!' : 'Copiar LaTeX' }}</span>
          </button>

          <!-- Descargar LaTeX -->
          <button
            type="button"
            @click="descargarArchivo('latex')"
            title="Descargar archivo .tex para Overleaf"
            class="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer text-xs"
          >
            <Download :size="12" class="text-indigo-600" />
            <span>.tex</span>
          </button>
        </div>
      </div>

      <!-- Tarjetas de Pasos de Demostración con Estilo Timeline -->
      <TransitionGroup name="fade" tag="div" class="space-y-3">
        <div
          v-for="paso in props.pasos"
          :key="paso.paso"
          class="p-4 bg-white rounded-xl border border-slate-200/80 hover:border-blue-300 shadow-2xs transition-all space-y-2.5"
          role="listitem"
        >
          <div class="flex items-start gap-3">
            <!-- Número de paso (Línea global formal) -->
            <div
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white shadow-2xs font-mono"
              aria-hidden="true"
            >
              {{ props.premisasOriginales.length ? props.premisasOriginales.length + paso.paso : paso.paso }}
            </div>

            <div class="min-w-0 flex-1 space-y-1.5">
              <!-- Encabezado del paso: Regla y botón de acordeón -->
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
                    {{ paso.regla }}
                  </span>

                  <!-- Premisas usadas en este paso -->
                  <div v-if="paso.premisas?.length" class="flex flex-wrap gap-1">
                    <span
                      v-for="(premisa, pIndex) in paso.premisas"
                      :key="pIndex"
                      class="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200/70"
                    >
                      {{ premisa }}
                    </span>
                  </div>
                </div>

                <!-- Botón desplegable / acordeón de explicación -->
                <button
                  v-if="paso.explicacion || paso.detalle"
                  type="button"
                  @click="togglePaso(paso.paso)"
                  :aria-expanded="Boolean(pasosAbiertos[paso.paso])"
                  :title="pasosAbiertos[paso.paso] ? 'Ocultar desglose detallado' : 'Ver desglose detallado'"
                  class="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-0.5 rounded-lg transition-all border border-blue-200/70 cursor-pointer active:scale-95"
                >
                  <HelpCircle :size="12" />
                  <span>{{ pasosAbiertos[paso.paso] ? 'Ocultar desglose' : '¿Cómo se deduce?' }}</span>
                  <ChevronDown
                    :size="12"
                    class="transition-transform duration-200"
                    :class="{ 'rotate-180': pasosAbiertos[paso.paso] }"
                  />
                </button>
              </div>

              <!-- Conclusión del paso (Fórmula Deducida) -->
              <div class="flex items-center gap-2 pt-0.5">
                <span class="text-blue-600 font-serif text-base font-bold select-none">&there4;</span>
                <p class="font-mono text-sm md:text-base font-bold text-slate-900 break-words tracking-wide">
                  {{ paso.conclusion }}
                </p>
              </div>

              <!-- Contenido particionado del acordeón -->
              <Transition name="desplegar">
                <div
                  v-if="pasosAbiertos[paso.paso]"
                  class="mt-2.5 p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5 shadow-2xs text-xs"
                >
                  <!-- 1. Premisas Base Involucradas -->
                  <div v-if="paso.detalle?.premisasBase?.length" class="space-y-1">
                    <span class="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Layers :size="11" />
                      <span>Premisas base utilizadas:</span>
                    </span>
                    <div class="grid grid-cols-1 gap-1">
                      <div
                        v-for="(pBase, pbIdx) in paso.detalle.premisasBase"
                        :key="pbIdx"
                        class="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs"
                      >
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px] border border-blue-100">
                            Línea {{ pBase.linea }}
                          </span>
                          <code class="font-mono font-bold text-slate-800">{{ pBase.expresion }}</code>
                        </div>
                        <span class="text-[10px] text-slate-500 italic">{{ pBase.rol }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 2. Justificación Lógica de la Regla -->
                  <div v-if="paso.detalle?.reglaJustificacion" class="space-y-1 p-2.5 bg-blue-50/70 rounded-lg border border-blue-200/60">
                    <span class="font-bold text-blue-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Terminal :size="11" />
                      <span>Regla aplicada: {{ paso.detalle.reglaNombre }} {{ paso.detalle.reglaAlias ? `(${paso.detalle.reglaAlias})` : '' }}</span>
                    </span>
                    <p class="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                      {{ paso.detalle.reglaJustificacion }}
                    </p>
                  </div>

                  <!-- 3. Deducción Resultante -->
                  <div class="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/70">
                    <CheckCircle2 :size="14" class="text-emerald-600 shrink-0" />
                    <span>Resultado: {{ paso.detalle?.conclusionDeducida || paso.explicacion }}</span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Estado vacío / Inicial -->
    <div v-else class="py-12 text-center space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-6">
      <div class="flex justify-center">
        <Inbox :size="28" class="text-slate-400 stroke-[1.5]" />
      </div>
      <p class="text-sm font-semibold text-slate-700">
        Aún no hay pasos de deducción para mostrar.
        <span class="sr-only">Aún no hay pasos de deducción para mostrar.</span>
      </p>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        Ingresa premisas y conclusión, luego pulsa <strong>Demostrar Inferencia</strong> para ver el paso a paso.
      </p>
    </div>
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
  max-height: 500px;
}
</style>
