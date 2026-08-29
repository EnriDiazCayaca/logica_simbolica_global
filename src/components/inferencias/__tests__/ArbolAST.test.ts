import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ArbolAST from '../ArbolAST.vue'

describe('ArbolAST (visualización de nodos)', () => {
  it('renderiza un árbol recursivo con <ul>/<li> para una implicación', () => {
    const wrapper = mount(ArbolAST, {
      props: {
        premisas: ['P ENTONCES Q'],
        conclusion: 'Q'
      }
    })

    // Debe existir al menos un <ul class="arbol-raiz">
    expect(wrapper.find('ul.arbol-raiz').exists()).toBe(true)

    // La raíz ENTONCES debe tener dos hijos (P y Q): dos <li> dentro del <ul> hijo
    const ulHijos = wrapper.findAll('ul.arbol-ul')
    expect(ulHijos.length).toBeGreaterThanOrEqual(1)

    const texto = wrapper.text()
    expect(texto).toContain('→') // símbolo del operador raíz
    expect(texto).toContain('P')
    expect(texto).toContain('Q')
    expect(texto).toContain('∴ Conclusión')
  })

  it('respeta la precedencia de paréntesis en un único diagrama', () => {
    const wrapper = mount(ArbolAST, {
      props: {
        premisas: ['NO (P ENTONCES Q)'],
        conclusion: 'R'
      }
    })

    // El diagrama es uno solo, con raíz "Demostración"
    expect(wrapper.find('ul.arbol-raiz').exists()).toBe(true)
    expect(wrapper.text()).toContain('Demostración')
    // La negación (¬) debe aparecer como nodo
    expect(wrapper.text()).toContain('¬')
    // Debe haber varios niveles de <ul> internos
    expect(wrapper.findAll('ul.arbol-ul').length).toBeGreaterThanOrEqual(2)
  })

  it('muestra un aviso cuando la sintaxis es inválida sin romper la vista', () => {
    const wrapper = mount(ArbolAST, {
      props: {
        premisas: ['P Y'],
        conclusion: 'Q'
      }
    })
    expect(wrapper.text()).toContain('no se pudieron construir')
    // La conclusión válida sí debe aparecer en el árbol
    expect(wrapper.text()).toContain('∴ Conclusión')
  })

  it('normaliza notación matemática (P → Q) y dibuja el árbol sin error', () => {
    const wrapper = mount(ArbolAST, {
      props: {
        premisas: ['P → Q'],
        conclusion: 'Q'
      }
    })
    // No debe mostrar mensaje de error de parseo
    expect(wrapper.text()).not.toContain('No se pudo construir el árbol')
    // Debe haber al menos la raíz y el nodo hijo (2 niveles de <ul>)
    expect(wrapper.findAll('ul.arbol-ul').length).toBeGreaterThanOrEqual(1)
    expect(wrapper.text()).toContain('→')
  })

  it('muestra un árbol de ejemplo cuando no hay premisas ingresadas', () => {
    const wrapper = mount(ArbolAST, {
      props: {
        premisas: [],
        conclusion: ''
      }
    })
    expect(wrapper.text()).toContain('ejemplo demostrativo')
    // El ejemplo debe renderizar nodos (P, Q)
    expect(wrapper.text()).toContain('P')
    expect(wrapper.text()).toContain('Q')
  })

  it('combina premisas y conclusión en UN solo diagrama con raíz "Demostración"', () => {
    const wrapper = mount(ArbolAST, {
      props: {
        premisas: ['P ENTONCES Q', 'P'],
        conclusion: 'Q'
      }
    })

    // Debe existir exactamente un árbol raíz (no uno por proposición)
    expect(wrapper.findAll('ul.arbol-raiz').length).toBe(1)
    expect(wrapper.text()).toContain('Demostración')
    // Las ramas directas deben estar etiquetadas como premisa y conclusión
    expect(wrapper.text()).toContain('P1')
    expect(wrapper.text()).toContain('∴ Conclusión')
  })

  it('abre el diagrama a pantalla completa al pulsar el botón', async () => {
    const wrapper = mount(ArbolAST, {
      props: {
        premisas: ['P ENTONCES Q'],
        conclusion: 'Q'
      }
    })

    // El modal (teleportado a <body>) no está visible inicialmente
    expect(document.body.textContent ?? '').not.toContain('Diagrama de árbol completo')

    // Pulsar "Ver a pantalla completa"
    const boton = wrapper.findAll('button').find((b) => b.text().includes('Ver a pantalla completa'))
    expect(boton).toBeTruthy()
    await boton!.trigger('click')

    // Ahora el modal muestra el diagrama completo (está en document.body)
    expect(document.body.textContent ?? '').toContain('Diagrama de árbol completo')

    // El scroll del fondo debe bloquearse para no mover la pestaña de atrás
    expect(document.body.style.overflow).toBe('hidden')

    // Al volver a pulsar el botón se cierra y el scroll del fondo se restaura
    await boton!.trigger('click')
    expect(document.body.style.overflow).toBe('')
  })
})
