import { describe, it, expect } from 'vitest'
import { parsearExpresion } from './parser'
import {
  hijosDeNodo,
  contarNodos,
  profundidadNodo,
  estadisticasNodo,
  META_OPERADOR
} from './astVisual'

describe('Utilidades de visualización AST (astVisual)', () => {
  it('cuenta nodos y profundidad correctamente en P → Q', () => {
    const ast = parsearExpresion('P ENTONCES Q')
    expect(contarNodos(ast)).toBe(3) // ENTONCES + P + Q
    expect(profundidadNodo(ast)).toBe(2)
  })

  it('reconoce la aridad unaria de NO', () => {
    const ast = parsearExpresion('NO P')
    const hijos = hijosDeNodo(ast)
    expect(hijos.length).toBe(1)
    expect(META_OPERADOR['NO'].aridad).toBe(1)
  })

  it('respeta paréntesis: NO (P → Q) tiene a NO como raíz', () => {
    const ast = parsearExpresion('NO (P ENTONCES Q)')
    expect(ast.tipo).toBe('operacion')
    if (ast.tipo === 'operacion') {
      expect(ast.operador).toBe('NO')
      expect(contarNodos(ast)).toBe(4) // NO + ENTONCES + P + Q
    }
  })

  it('genera estadísticas coherentes', () => {
    const ast = parsearExpresion('(P Y Q) O R')
    const stats = estadisticasNodo(ast)
    expect(stats.nodos).toBe(5)
    expect(stats.variables).toBe(3)
    expect(stats.operadores).toBe(2)
    expect(stats.profundidad).toBe(3)
  })
})
