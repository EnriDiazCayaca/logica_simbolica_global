import { describe, it, expect } from 'vitest'
import {
  evaluar,
  generarTabla,
  parsearProposicion,
  clasificarProposicion,
  recolectarVariables,
  recolectarSubExpresiones,
  nodoATexto,
} from './evaluator'

describe('Motor de tablas de verdad', () => {
  describe('parsearProposicion', () => {
    it('parsea una variable simple', () => {
      const nodo = parsearProposicion('P')
      expect(nodo.tipo).toBe('VAR')
      expect(nodo.valor).toBe('P')
    })

    it('parsea negación', () => {
      const nodo = parsearProposicion('NOT P')
      expect(nodo.tipo).toBe('NOT')
    })

    it('parsea conjunción', () => {
      const nodo = parsearProposicion('P AND Q')
      expect(nodo.tipo).toBe('AND')
    })

    it('parsea implicación con símbolo →', () => {
      const nodo = parsearProposicion('P → Q')
      expect(nodo.tipo).toBe('IMPLIES')
    })

    it('parsea bicondicional con símbolo ↔', () => {
      const nodo = parsearProposicion('P ↔ Q')
      expect(nodo.tipo).toBe('IFF')
    })

    it('lanza error con expresión vacía', () => {
      expect(() => parsearProposicion('')).toThrow()
    })

    it('lanza error con carácter inválido', () => {
      expect(() => parsearProposicion('P @ Q')).toThrow()
    })
  })

  describe('recolectarVariables', () => {
    it('extrae variables en orden alfabético', () => {
      const nodo = parsearProposicion('C AND A OR B')
      expect(recolectarVariables(nodo)).toEqual(['A', 'B', 'C'])
    })
  })

  describe('nodoATexto', () => {
    it('convierte AST de vuelta a texto legible', () => {
      const nodo = parsearProposicion('P AND Q')
      expect(nodoATexto(nodo)).toBe('P ∧ Q')
    })

    it('representa negación correctamente', () => {
      const nodo = parsearProposicion('NOT P')
      expect(nodoATexto(nodo)).toBe('¬P')
    })

    it('agrega paréntesis en expresiones compuestas', () => {
      const nodo = parsearProposicion('(P OR Q) AND R')
      expect(nodoATexto(nodo)).toBe('(P ∨ Q) ∧ R')
    })
  })

  describe('evaluar', () => {
    it('evalúa P AND Q correctamente', () => {
      const nodo = parsearProposicion('P AND Q')
      expect(evaluar(nodo, { P: true, Q: false })).toBe(false)
      expect(evaluar(nodo, { P: true, Q: true })).toBe(true)
    })

    it('evalúa P OR NOT Q correctamente', () => {
      const nodo = parsearProposicion('P OR NOT Q')
      expect(evaluar(nodo, { P: false, Q: false })).toBe(true)
      expect(evaluar(nodo, { P: false, Q: true })).toBe(false)
    })

    it('evalúa P IMPLIES Q correctamente', () => {
      const nodo = parsearProposicion('P IMPLIES Q')
      expect(evaluar(nodo, { P: true, Q: false })).toBe(false)
      expect(evaluar(nodo, { P: false, Q: false })).toBe(true)
      expect(evaluar(nodo, { P: true, Q: true })).toBe(true)
    })

    it('evalúa P IFF Q correctamente', () => {
      const nodo = parsearProposicion('P IFF Q')
      expect(evaluar(nodo, { P: true, Q: true })).toBe(true)
      expect(evaluar(nodo, { P: true, Q: false })).toBe(false)
    })

    it('asigna false a variables no definidas', () => {
      const nodo = parsearProposicion('P')
      expect(evaluar(nodo, {})).toBe(false)
    })
  })

  describe('clasificarProposicion', () => {
    it('identifica una tautología', () => {
      const nodo = parsearProposicion('P OR NOT P')
      const resultado = clasificarProposicion(nodo)
      expect(resultado.clasificacion).toBe('tautologia')
      expect(resultado.conteoVerdaderas).toBe(2)
    })

    it('identifica una contradicción', () => {
      const nodo = parsearProposicion('P AND NOT P')
      const resultado = clasificarProposicion(nodo)
      expect(resultado.clasificacion).toBe('contradiccion')
      expect(resultado.conteoFalsas).toBe(2)
    })

    it('identifica una contingencia', () => {
      const nodo = parsearProposicion('P AND Q')
      const resultado = clasificarProposicion(nodo)
      expect(resultado.clasificacion).toBe('contingencia')
      expect(resultado.conteoVerdaderas).toBe(1)
      expect(resultado.conteoFalsas).toBe(3)
    })
  })

  describe('generarTabla', () => {
    it('genera tabla completa con clasificación', () => {
      const tabla = generarTabla('P AND Q')
      expect(tabla.variables).toEqual(['P', 'Q'])
      expect(tabla.filas).toHaveLength(4)
      expect(tabla.clasificacion).toBe('contingencia')
      expect(tabla.verdaderas).toBe(1)
      expect(tabla.falsas).toBe(3)
    })

    it('genera tabla para tautología', () => {
      const tabla = generarTabla('P OR NOT P')
      expect(tabla.clasificacion).toBe('tautologia')
      expect(tabla.verdaderas).toBe(2)
      expect(tabla.falsas).toBe(0)
    })

    it('genera tabla con múltiples operadores', () => {
      const tabla = generarTabla('(P AND Q) OR NOT R')
      expect(tabla.variables).toEqual(['P', 'Q', 'R'])
      expect(tabla.filas).toHaveLength(8)
    })

    it('genera tabla con notación ASCII', () => {
      const tabla = generarTabla('p -> q')
      expect(tabla.clasificacion).toBe('contingencia')
    })

    it('genera tabla con notación de palabras', () => {
      const tabla = generarTabla('P AND Q IMPLIES R')
      expect(tabla.variables).toEqual(['P', 'Q', 'R'])
    })
  })

  describe('recolectarSubExpresiones', () => {
    it('encuentra sub-expresiones internas', () => {
      const nodo = parsearProposicion('(P AND Q) OR R')
      const subs = recolectarSubExpresiones(nodo)
      expect(subs.length).toBe(2)
      expect(nodoATexto(subs[0])).toBe('P ∧ Q')
      expect(nodoATexto(subs[1])).toBe('(P ∧ Q) ∨ R')
    })
  })
})
