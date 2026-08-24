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
  FileText
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
 * Genera el texto en formato Markdown de la demostración académica completa.
 * Usa listas numeradas globales (premisas + pasos comparten numeración) para
 * que cada línea ocupe su propio bloque al pegarlo en un archivo .md.
 */
const generarMarkdownAcademico = computed(() => {
  if (!props.pasos || props.pasos.length === 0) return ''

  const totalPremisas = props.premisasOriginales.length
  const lineas: string[] = ['### Demostración Formal de Inferencia Lógica', '']

  lineas.push('**Premisas:**', '')
  props.premisasOriginales.forEach((p, i) => {
    lineas.push(`${i + 1}. $${aNotacionSimbolica(p)}$`)
  })

  lineas.push('')
  lineas.push(`**Conclusión:** $\\therefore ${aNotacionSimbolica(props.conclusionOriginal)}$`, '')
  lineas.push('**Deducción formal paso a paso:**', '')

  props.pasos.forEach((p) => {
    const numLinea = totalPremisas + p.paso
    const refs = p.premisas.length ? ` (${p.premisas.join(', ')})` : ''
    lineas.push(`${numLinea}. $${aNotacionSimbolica(p.conclusion)}$ *[${p.regla}${refs}]*`)
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
      <div class="p-5 bg-orange-50/80 border border-orange-200 rounded-xl shadow-xs space-y-4">
        <!-- Encabezado del Diagnóstico -->
        <div class="flex items-start gap-3 border-b border-orange-200/80 pb-3.5">
          <div class="p-2 bg-orange-100 text-orange-700 rounded-lg flex-shrink-0">
            <AlertOctagon :size="20" />
          </div>
          <div>
            <span class="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
              Diagnóstico del Fallo
            </span>
            <h3 class="text-base font-extrabold text-orange-950">
              {{ props.errorLogico.titulo }}
            </h3>
          </div>
        </div>

        <!-- Partición 1: Detalle del Problema Detectado -->
        <div class="space-y-1.5 text-xs text-orange-900 bg-white/80 p-3 rounded-lg border border-orange-100">
          <span class="font-bold uppercase tracking-wider text-[10px] text-orange-700 block">
            📋 Análisis de las premisas:
          </span>
          <p class="leading-relaxed">
            {{ props.errorLogico.mensaje }}
          </p>
        </div>

        <!-- Partición 2: ¿Por qué falla el razonamiento? -->
        <div class="space-y-1.5 text-xs text-neutral-800 bg-white/80 p-3 rounded-lg border border-orange-100">
          <span class="font-bold uppercase tracking-wider text-[10px] text-neutral-600 block flex items-center gap-1">
            <span>❌</span> ¿Por qué falla este razonamiento?
          </span>
          <p class="leading-relaxed text-neutral-700">
            {{ props.errorLogico.porQueFalla }}
          </p>
        </div>

        <!-- Partición 3: Contraejemplo Semántico Matemático (Si existe) -->
        <div
          v-if="props.errorLogico.contraejemplo"
          class="space-y-2.5 text-xs bg-red-50/90 p-3.5 rounded-lg border border-red-200"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold uppercase tracking-wider text-[10px] text-red-700 flex items-center gap-1.5">
              <span>🛑</span> Contraejemplo que refuta la validez:
            </span>
            <span class="text-[10px] font-mono bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">
              Premisas = V | Conclusión = F
            </span>
          </div>

          <!-- Asignación de variables -->
          <div class="flex flex-wrap gap-2 pt-1">
            <div
              v-for="(val, vNombre) in props.errorLogico.contraejemplo.valores"
              :key="vNombre"
              class="flex items-center gap-1 px-2.5 py-1 bg-white rounded-md border border-red-200 font-mono text-xs shadow-2xs"
            >
              <strong class="text-neutral-800">{{ vNombre }}</strong>
              <span class="text-neutral-400">=</span>
              <span :class="val ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'">
                {{ val ? 'Verdadero (V)' : 'Falso (F)' }}
              </span>
            </div>
          </div>

          <p class="text-[11px] text-red-900/90 leading-normal pt-1 italic">
            Bajo esta asignación concreta de valores de verdad, todas las premisas se cumplen simultáneamente como verdaderas, pero la conclusión resulta falsa. Por lo tanto, el argumento es formalmente inválido.
          </p>
        </div>

        <!-- Partición 4: ¿Cómo corregir el argumento? -->
        <div class="space-y-1.5 text-xs text-blue-900 bg-blue-50/80 p-3 rounded-lg border border-blue-100">
          <span class="font-bold uppercase tracking-wider text-[10px] text-blue-700 block flex items-center gap-1">
            <span>💡</span> ¿Cómo solucionarlo o deducirlo válidamente?
          </span>
          <p class="leading-relaxed text-blue-950">
            {{ props.errorLogico.sugerencia }}
          </p>
        </div>
      </div>
    </div>

    <!-- CASO B: INFERENCIA VÁLIDA CON PASOS DEMOSTRADOS -->
    <div v-else-if="props.pasos && props.pasos.length > 0" class="space-y-4">
      <!-- Barra de Exportación Académica -->
      <div class="flex items-center justify-between p-2.5 bg-neutral-100/80 rounded-xl border border-neutral-200 text-xs">
        <span class="font-semibold text-neutral-600 flex items-center gap-1.5">
          <span>🎓</span> Formato Académico:
        </span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="copiarPortapapeles('markdown')"
            title="Copiar demostración en Markdown"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-neutral-50 text-neutral-700 font-medium rounded-lg border border-neutral-300 shadow-2xs transition-colors cursor-pointer text-xs"
          >
            <component :is="copiadoTipo === 'markdown' ? Check : FileText" :size="13" :class="copiadoTipo === 'markdown' ? 'text-emerald-600' : ''" />
            <span>{{ copiadoTipo === 'markdown' ? '¡Copiado MD!' : 'Copiar Markdown' }}</span>
          </button>
          <button
            type="button"
            @click="copiarPortapapeles('latex')"
            title="Copiar demostración en LaTeX"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-neutral-50 text-neutral-700 font-medium rounded-lg border border-neutral-300 shadow-2xs transition-colors cursor-pointer text-xs"
          >
            <component :is="copiadoTipo === 'latex' ? Check : FileCode2" :size="13" :class="copiadoTipo === 'latex' ? 'text-emerald-600' : ''" />
            <span>{{ copiadoTipo === 'latex' ? '¡Copiado LaTeX!' : 'Copiar LaTeX' }}</span>
          </button>
        </div>
      </div>

      <!-- Tarjetas de Pasos de Demostración -->
      <TransitionGroup name="fade" tag="div" class="space-y-3">
        <Card
          v-for="paso in props.pasos"
          :key="paso.paso"
          hoverable
          role="listitem"
          class="transition-all border border-neutral-200/80"
        >
          <div class="flex items-start gap-3.5">
            <!-- Número de paso (Estilo Formal: Línea global) -->
            <div
              class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-xs"
              aria-hidden="true"
            >
              {{ props.premisasOriginales.length ? props.premisasOriginales.length + paso.paso : paso.paso }}
            </div>

            <div class="min-w-0 flex-1 space-y-2.5">
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
                  v-if="paso.explicacion || paso.detalle"
                  type="button"
                  @click="togglePaso(paso.paso)"
                  :aria-expanded="Boolean(pasosAbiertos[paso.paso])"
                  :title="pasosAbiertos[paso.paso] ? 'Ocultar desglose detallado' : 'Ver desglose detallado'"
                  class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors border border-blue-200/70 cursor-pointer"
                >
                  <HelpCircle :size="13" />
                  <span>{{ pasosAbiertos[paso.paso] ? 'Ocultar desglose' : '¿Cómo se deduce?' }}</span>
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

              <!-- Contenido particionado del acordeón -->
              <Transition name="desplegar">
                <div
                  v-if="pasosAbiertos[paso.paso]"
                  class="mt-3 p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3 shadow-2xs text-xs"
                >
                  <!-- 1. Premisas Base Involucradas -->
                  <div v-if="paso.detalle?.premisasBase?.length" class="space-y-1.5">
                    <span class="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block">
                      📌 Premisas base utilizadas:
                    </span>
                    <div class="grid grid-cols-1 gap-1.5">
                      <div
                        v-for="(pBase, pbIdx) in paso.detalle.premisasBase"
                        :key="pbIdx"
                        class="flex items-center justify-between p-2 bg-white rounded-lg border border-neutral-200/70 text-xs"
                      >
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
                            Línea {{ pBase.linea }}
                          </span>
                          <code class="font-mono font-bold text-neutral-800">{{ pBase.expresion }}</code>
                        </div>
                        <span class="text-[11px] text-neutral-500 italic">{{ pBase.rol }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 2. Justificación Lógica de la Regla -->
                  <div v-if="paso.detalle?.reglaJustificacion" class="space-y-1 p-2.5 bg-blue-50/70 rounded-lg border border-blue-100/80">
                    <span class="font-bold text-blue-800 uppercase tracking-wider text-[10px] block">
                      ⚙️ Regla aplicada: {{ paso.detalle.reglaNombre }} {{ paso.detalle.reglaAlias ? `(${paso.detalle.reglaAlias})` : '' }}
                    </span>
                    <p class="text-neutral-700 text-xs leading-relaxed">
                      {{ paso.detalle.reglaJustificacion }}
                    </p>
                  </div>

                  <!-- 3. Deducción Resultante -->
                  <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200/60">
                    <CheckCircle2 :size="14" class="text-emerald-600 flex-shrink-0" />
                    <span>Resultado: {{ paso.detalle?.conclusionDeducida || paso.explicacion }}</span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </Card>
      </TransitionGroup>
    </div>

    <!-- Estado vacío / Inicial -->
    <p
      v-else
      class="py-8 text-center text-sm text-neutral-500"
    >
      Aún no hay pasos de deducción para mostrar. Ingresa las premisas y presiona <strong>Demostrar Inferencia</strong>.
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
  max-height: 500px;
}
</style>
