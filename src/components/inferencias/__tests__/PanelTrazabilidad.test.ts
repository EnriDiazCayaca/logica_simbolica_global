import { describe, it, expect } from 'vitest'
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
})
