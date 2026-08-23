import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormularioInferencia from '../FormularioInferencia.vue'
import Button from '@/components/ui/Button.vue'

describe('FormularioInferencia', () => {
  it('deshabilita el botÃ³n de Demostrar si las entradas estÃ¡n vacÃ­as', () => {
    const wrapper = mount(FormularioInferencia, {
      props: { isLoading: false },
      global: { components: { Button } }
    })
    
    const btn = wrapper.findComponent(Button)
    expect(btn.props('disabled')).toBe(true)
  })

  it('habilita el botÃ³n si hay premisas y conclusiÃ³n', async () => {
    const wrapper = mount(FormularioInferencia, {
      props: { isLoading: false },
      global: { components: { Button } }
    })
    
    await wrapper.find('textarea').setValue('P\nP ENTONCES Q')
    await wrapper.find('input').setValue('Q')

    const btn = wrapper.findComponent(Button)
    expect(btn.props('disabled')).toBe(false)
  })

  it('deshabilita el botÃ³n si isLoading es true, incluso con entradas llenas', async () => {
    const wrapper = mount(FormularioInferencia, {
      props: { isLoading: true },
      global: { components: { Button } }
    })
    
    await wrapper.find('textarea').setValue('P')
    await wrapper.find('input').setValue('P')

    const btn = wrapper.findComponent(Button)
    expect(btn.props('disabled')).toBe(true)
    expect(wrapper.text()).toContain('Procesando')
  })

  it('emite submit normalizando sÃ­mbolos a palabras clave del motor', async () => {
    const wrapper = mount(FormularioInferencia, {
      props: { isLoading: false },
      global: { components: { Button } }
    })
    
    await wrapper.find('textarea').setValue('   P   \n   \n   P -> Q   ')
    await wrapper.find('input').setValue('   Q   ')

    await wrapper.find('form').trigger('submit.prevent')

    const emitidos = wrapper.emitted('submit')
    expect(emitidos).toBeTruthy()
    expect(emitidos![0][0]).toEqual({
      premisas: ['P', 'P ENTONCES Q'], // Se normaliza -> a ENTONCES
      conclusion: 'Q'
    })
  })

  it('inserta tokens al presionar los botones del teclado lÃ³gico', async () => {
    const wrapper = mount(FormularioInferencia, {
      props: { isLoading: false },
      global: { components: { Button } }
    })

    // Hacer clic en botÃ³n 'P'
    const btnP = wrapper.findAll('button').find((b: any) => b.text() === 'P')
    expect(btnP).toBeDefined()
    await btnP!.trigger('click')

    expect(wrapper.find('textarea').element.value).toBe('P')
  })
})
