import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PanelTrazabilidad from '../PanelTrazabilidad.vue'

describe('PanelTrazabilidad', () => {
  it('renderiza un mensaje si no hay pasos', () => {
    const wrapper = mount(PanelTrazabilidad, {
      props: { pasos: [] }
    })
    expect(wrapper.text()).toContain('Aún no hay pasos de deducción para mostrar.')
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
    expect(wrapper.text()).toContain('¿Por qué esta regla?')
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
            explicacion: 'Explicación detallada de la regla aplicada.'
          }
        ]
      }
    })

    const botonExplicacion = wrapper.find('button')
    expect(botonExplicacion.exists()).toBe(true)

    // Inicialmente no está visible el texto de explicación
    expect(wrapper.text()).not.toContain('Explicación detallada de la regla aplicada.')

    // Clic para abrir
    await botonExplicacion.trigger('click')
    expect(wrapper.text()).toContain('Explicación detallada de la regla aplicada.')
    expect(wrapper.text()).toContain('Ocultar explicación')

    // Clic para cerrar
    await botonExplicacion.trigger('click')
    expect(wrapper.text()).not.toContain('Explicación detallada de la regla aplicada.')
  })
})
