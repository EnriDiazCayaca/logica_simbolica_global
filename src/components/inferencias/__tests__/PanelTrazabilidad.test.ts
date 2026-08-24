import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PanelTrazabilidad from '../PanelTrazabilidad.vue'

describe('PanelTrazabilidad', () => {
  it('renderiza un mensaje si no hay pasos y no es inválido', () => {
    const wrapper = mount(PanelTrazabilidad, {
      props: { pasos: [], esInvalido: false }
    })
    expect(wrapper.text()).toContain('Aún no hay pasos de deducción para mostrar.')
  })

  it('renderiza correctamente el diagnóstico de inferencia inválida con contraejemplo', () => {
    const wrapper = mount(PanelTrazabilidad, {
      props: {
        pasos: [],
        esInvalido: true,
        errorLogico: {
          tipo: 'FALACIA_AFIRMACION_CONSECUENTE',
          titulo: 'Falacia de Afirmación del Consecuente',
          mensaje: 'Se intentó deducir el antecedente.',
          porQueFalla: 'Tener el consecuente no garantiza el antecedente.',
          sugerencia: 'Afirma el antecedente para usar Modus Ponens.',
          contraejemplo: {
            valores: { P: false, Q: true },
            valoresPremisas: [true, true],
            valorConclusion: false
          }
        }
      }
    })

    expect(wrapper.text()).toContain('Diagnóstico del Fallo')
    expect(wrapper.text()).toContain('Falacia de Afirmación del Consecuente')
    expect(wrapper.text()).toContain('Contraejemplo que refuta la validez')
    expect(wrapper.text()).toContain('Falso (F)')
    expect(wrapper.text()).toContain('Verdadero (V)')
    expect(wrapper.text()).toContain('¿Por qué falla este razonamiento?')
  })

  it('renderiza correctamente los pasos y su botón de acordeón', () => {
    const wrapper = mount(PanelTrazabilidad, {
      props: {
        pasos: [
          {
            paso: 1,
            premisas: ['Línea 1', 'Línea 2'],
            conclusion: 'Q',
            regla: 'Modus Ponens',
            explicacion: 'Explicación detallada de la regla aplicada.'
          }
        ]
      }
    })
    
    expect(wrapper.text()).toContain('Modus Ponens')
    expect(wrapper.text()).toContain('Línea 1')
    expect(wrapper.text()).toContain('Línea 2')
    expect(wrapper.text()).toContain('Q') // Conclusion
    expect(wrapper.text()).toContain('1') // Paso number
    expect(wrapper.text()).toContain('¿Cómo se deduce?')
  })

  it('despliega y oculta la explicación didáctica al hacer clic en el botón', async () => {
    const wrapper = mount(PanelTrazabilidad, {
      props: {
        pasos: [
          {
            paso: 1,
            premisas: ['Línea 1'],
            conclusion: 'Q',
            regla: 'Modus Ponens',
            explicacion: 'Explicación detallada de la regla aplicada.',
            detalle: {
              resumen: 'Explicación detallada de la regla aplicada.',
              premisasBase: [
                { linea: 1, expresion: 'P -> Q', rol: 'Condicional base' }
              ],
              reglaNombre: 'Modus Ponens',
              reglaJustificacion: 'Justificación lógica de la regla.',
              conclusionDeducida: 'Q es verdadero.'
            }
          }
        ]
      }
    })

    const botonAcordeon = wrapper.find('button[aria-expanded]')
    expect(botonAcordeon.exists()).toBe(true)

    // Inicialmente no está visible el texto de explicación
    expect(wrapper.text()).not.toContain('Justificación lógica de la regla.')

    // Clic para abrir
    await botonAcordeon.trigger('click')
    expect(wrapper.text()).toContain('Justificación lógica de la regla.')
    expect(wrapper.text()).toContain('Premisas base utilizadas')
    expect(wrapper.text()).toContain('Ocultar desglose')

    // Clic para cerrar
    await botonAcordeon.trigger('click')
    expect(wrapper.text()).not.toContain('Justificación lógica de la regla.')
  })

  it('exporta el markdown académico con notación simbólica (sin palabras del motor)', async () => {
    const escribir = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: escribir },
      configurable: true
    })

    const wrapper = mount(PanelTrazabilidad, {
      props: {
        pasos: [
          {
            paso: 1,
            premisas: ['Línea 1', 'Línea 2'],
            conclusion: '( P ENTONCES R )',
            regla: 'SH, Transitividad'
          }
        ],
        premisasOriginales: ['P ENTONCES Q', 'Q ENTONCES R'],
        conclusionOriginal: 'P ENTONCES R'
      }
    })

    await wrapper.find('button[title="Copiar demostración en Markdown"]').trigger('click')

    expect(escribir).toHaveBeenCalledTimes(1)
    const texto = escribir.mock.calls[0][0] as string

    expect(texto).toContain('### Demostración Formal de Inferencia Lógica')
    expect(texto).toContain('3. $(P \\rightarrow R)$ *[SH, Transitividad (Línea 1, Línea 2)]*')
    expect(texto).toContain('$P \\rightarrow Q$')
    expect(texto).not.toContain('ENTONCES')
    expect(texto).not.toContain('( P')
  })

  it('exporta un documento LaTeX completo y compilable', async () => {
    const escribir = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: escribir },
      configurable: true
    })

    const wrapper = mount(PanelTrazabilidad, {
      props: {
        pasos: [
          {
            paso: 1,
            premisas: ['Línea 1', 'Línea 2'],
            conclusion: '( P ENTONCES R )',
            regla: 'SH, Transitividad'
          }
        ],
        premisasOriginales: ['P ENTONCES Q', 'p → q'],
        conclusionOriginal: 'P ENTONCES R'
      }
    })

    await wrapper.find('button[title="Copiar demostración en LaTeX"]').trigger('click')
    const texto = escribir.mock.calls[0][0] as string

    expect(texto).toContain('\\documentclass[11pt]{article}')
    expect(texto).toContain('\\usepackage{amsmath}')
    expect(texto).toContain('\\begin{document}')
    expect(texto).toContain('\\section*{Argumento}')
    expect(texto).toContain('\\item $P \\rightarrow Q$')
    // Símbolo Unicode crudo del usuario convertido a comando LaTeX compilable
    expect(texto).toContain('\\item $p \\rightarrow q$')
    expect(texto).toContain('\\section*{Demostración formal}')
    expect(texto).toContain('\\therefore (3) \\quad & (P \\rightarrow R) && \\text{[SH, Transitividad (1, 2)]}')
    expect(texto).not.toContain('ENTONCES')
    expect(texto).not.toContain('→')

    // Sin salto de fila colgante antes de cerrar el entorno matemático
    expect(texto.includes('\\\\\n\\end{align*}')).toBe(false)
    expect(texto.trimEnd().endsWith('\\end{document}')).toBe(true)
  })
})
