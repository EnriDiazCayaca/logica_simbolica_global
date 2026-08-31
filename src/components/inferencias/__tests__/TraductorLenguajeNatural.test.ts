import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TraductorLenguajeNatural from '../TraductorLenguajeNatural.vue'

describe('TraductorLenguajeNatural', () => {
  it('detecta variables de las premisas y muestra la traducción', () => {
    const wrapper = mount(TraductorLenguajeNatural, {
      props: {
        premisas: ['P → Q', 'P'],
        conclusion: 'Q'
      }
    })

    expect(wrapper.text()).toContain('Interpretación en Lenguaje Natural')
    expect(wrapper.text()).toContain('P')
    expect(wrapper.text()).toContain('Q')
    expect(wrapper.text()).toContain('Argumento Traducido en Prosa:')
    expect(wrapper.text()).toContain('Si llueve, entonces la calle se moja.')
  })

  it('actualiza la narración cuando el usuario cambia el significado de una variable', async () => {
    const wrapper = mount(TraductorLenguajeNatural, {
      props: {
        premisas: ['P → Q'],
        conclusion: 'Q'
      }
    })

    const inputs = wrapper.findAll('input')
    // Cambiar primer input (P)
    await inputs[0].setValue('como verduras')
    
    expect(wrapper.text()).toContain('Si como verduras, entonces la calle se moja.')
  })
})
