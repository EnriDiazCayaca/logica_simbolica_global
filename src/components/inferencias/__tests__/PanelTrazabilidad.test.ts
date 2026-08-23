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

  it('renderiza correctamente los pasos', () => {
    const wrapper = mount(PanelTrazabilidad, {
      props: {
        pasos: [
          {
            paso: 1,
            premisas: ['Línea 1', 'Línea 2'],
            conclusion: 'Q',
            regla: 'Modus Ponens'
          }
        ]
      }
    })
    
    expect(wrapper.text()).toContain('Modus Ponens')
    expect(wrapper.text()).toContain('Línea 1')
    expect(wrapper.text()).toContain('Línea 2')
    expect(wrapper.text()).toContain('Q') // Conclusion
    expect(wrapper.text()).toContain('1') // Paso number
  })
})
