import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndicadorResultado from '../IndicadorResultado.vue'

describe('IndicadorResultado', () => {
  it('no muestra nada si resultado es "pendiente"', () => {
    const wrapper = mount(IndicadorResultado, {
      props: { resultado: 'pendiente' }
    })
    expect(wrapper.find('div.flex').exists()).toBe(false)
  })

  it('renderiza caso válido', () => {
    const wrapper = mount(IndicadorResultado, {
      props: { resultado: 'valida' }
    })
    expect(wrapper.text()).toContain('Inferencia válida')
    expect(wrapper.text()).toContain('La conclusión se deduce correctamente')
  })

  it('renderiza caso inválido', () => {
    const wrapper = mount(IndicadorResultado, {
      props: { resultado: 'invalida' }
    })
    expect(wrapper.text()).toContain('Inferencia inválida')
    expect(wrapper.text()).toContain('La conclusión no se deduce')
  })

  it('renderiza caso error con mensaje personalizado', () => {
    const wrapper = mount(IndicadorResultado, {
      props: { resultado: 'error', mensaje: 'Sintaxis incorrecta' }
    })
    expect(wrapper.text()).toContain('Error')
    expect(wrapper.text()).toContain('Sintaxis incorrecta')
  })
})
