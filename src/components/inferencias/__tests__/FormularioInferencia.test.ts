import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormularioInferencia from '../FormularioInferencia.vue'
import Button from '@/components/ui/Button.vue'

describe('FormularioInferencia', () => {
  it('deshabilita el botón de Demostrar si las entradas están vacías', () => {
    const wrapper = mount(FormularioInferencia, {
      props: { isLoading: false },
      global: { components: { Button } }
    })

    const btn = wrapper.find('button[type="submit"]')
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('habilita el botón si hay premisas y conclusión', async () => {
    const wrapper = mount(FormularioInferencia, {
      props: { isLoading: false },
      global: { components: { Button } }
    })

    await wrapper.find('textarea').setValue('P\nP ENTONCES Q')
    await wrapper.find('input').setValue('Q')

    const btn = wrapper.find('button[type="submit"]')
    expect(btn.attributes('disabled')).toBeUndefined()
  })

  it('deshabilita el botón si isLoading es true, incluso con entradas llenas', async () => {
    const wrapper = mount(FormularioInferencia, {
      props: { isLoading: true },
      global: { components: { Button } }
    })

    await wrapper.find('textarea').setValue('P')
    await wrapper.find('input').setValue('P')

    const btn = wrapper.find('button[type="submit"]')
    expect(btn.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Demostrando')
  })

  it('emite submit normalizando símbolos a palabras clave del motor', async () => {
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
      premisas: ['P', 'P ENTONCES Q'],
      conclusion: 'Q'
    })
  })

  it('inserta tokens al presionar los botones del teclado lógico con reglas de espaciado', async () => {
    const wrapper = mount(FormularioInferencia, {
      props: { isLoading: false },
      global: { components: { Button } }
    })

    // Hacer clic en botón 'P' (variable sin espacio)
    const btnP = wrapper.findAll('button').find((b: any) => b.text() === 'P')
    expect(btnP).toBeDefined()
    await btnP!.trigger('click')

    expect(wrapper.find('textarea').element.value).toBe('P')

    // Hacer clic en botón '→' (conectivo con espacio)
    const btnImpl = wrapper.findAll('button').find((b: any) => b.text() === '→')
    expect(btnImpl).toBeDefined()
    await btnImpl!.trigger('click')

    expect(wrapper.find('textarea').element.value).toBe('P → ')
  })
})
