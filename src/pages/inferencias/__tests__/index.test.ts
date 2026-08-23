import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import IndexView from '../index.vue'
import { demostrarConclusion } from '@/lib/solver/solver'
import { construirTrazabilidad } from '@/lib/trazabilidad/historial'

// Hacemos mock de las funciones pesadas/complejas del motor
vi.mock('@/lib/solver/solver', () => ({
  demostrarConclusion: vi.fn()
}))

vi.mock('@/lib/trazabilidad/historial', () => ({
  construirTrazabilidad: vi.fn()
}))

// Mock setTimeout inside procesarInferencia to be instantaneous for test
global.setTimeout = vi.fn((fn) => fn()) as any

describe('Integración: Página Inferencias', () => {
  it('realiza el flujo completo de inferencia correctamente simulando el motor', async () => {
    // Configurar el mock
    vi.mocked(demostrarConclusion).mockReturnValueOnce({ esValido: true, pasos: [] })
    vi.mocked(construirTrazabilidad).mockReturnValueOnce({
      esValido: true,
      conclusion: 'Demostrado',
      totalPasos: 1,
      pasos: [
        {
          numeroPaso: 1,
          operacion: 'Modus Ponens',
          regla: 'MODUS_PONENDO_PONENS',
          alias: 'MPP',
          explicacion: 'Aplicando Modus Ponens',
          expresionSimbolica: 'Q',
          lineasBase: [1, 2],
          esConclusion: true,
          estadoActual: ''
        }
      ]
    })

    const wrapper = mount(IndexView, {
      global: {
        stubs: {
          'router-link': true
        }
      }
    })

    // 1. Verificar estado inicial
    expect(wrapper.text()).not.toContain('Inferencia válida')
    expect(wrapper.text()).toContain('Aún no hay pasos')

    // 2. Llenar formulario
    await wrapper.find('textarea').setValue('P ENTONCES Q\nP')
    await wrapper.find('input').setValue('Q')

    // 3. Enviar formulario
    await wrapper.find('form').trigger('submit.prevent')
    
    // Esperar promesas asíncronas
    await flushPromises()

    // 4. Verificar que el resultado de la UI se actualizó
    expect(wrapper.text()).toContain('Inferencia válida')
    expect(wrapper.text()).toContain('MPP') // Toma el alias
    expect(wrapper.text()).toContain('Línea 1')
    expect(wrapper.text()).toContain('Línea 2')
    expect(wrapper.text()).toContain('Q') // Expresion simbólica de la conclusión del paso
  })

  it('permite cambiar entre pestañas de Simbología y Lenguaje Natural', async () => {
    const wrapper = mount(IndexView, {
      global: {
        stubs: {
          'router-link': true
        }
      }
    })

    // Botones de pestañas
    const botones = wrapper.findAll('button')
    const tabLenguaje = botones.find((b) => b.text().includes('Lenguaje Natural'))
    expect(tabLenguaje).toBeDefined()

    // Cambiar a pestaña de lenguaje natural
    await tabLenguaje!.trigger('click')
    expect(wrapper.text()).toContain('Interpretación en Lenguaje Natural')
    expect(wrapper.text()).toContain('Significado de las Variables')
  })

  it('muestra el mensaje de error cuando ocurre una excepción', async () => {
    const wrapper = mount(IndexView, {
      global: {
        stubs: {
          'router-link': true
        }
      }
    })

    // Llenar formulario con sintaxis inválida (faltan operadores)
    await wrapper.find('textarea').setValue('SINTAXIS INVALIDA')
    await wrapper.find('input').setValue('P')

    // Enviar
    await wrapper.find('form').trigger('submit.prevent')
    
    await flushPromises()

    // Verificar que se muestre error
    expect(wrapper.text()).toContain('Error en la inferencia')
    expect(wrapper.text()).toContain('Error de sintaxis: Tokens inesperados al final: INVALIDA')
  })
})
