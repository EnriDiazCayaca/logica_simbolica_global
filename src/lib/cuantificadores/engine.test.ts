import { describe, it, expect } from 'vitest'
import {
  evaluarCuantificador,
  parsearDominio,
  obtenerPredicados,
} from './engine'

describe('Motor de cuantificadores', () => {
  describe('parsearDominio', () => {
    it('parsea una cadena de números separados por coma', () => {
      expect(parsearDominio('1, 2, 3')).toEqual(['1', '2', '3'])
    })

    it('elimina espacios extra', () => {
      expect(parsearDominio('  a ,  b , c ')).toEqual(['a', 'b', 'c'])
    })

    it('filtra entradas vacías', () => {
      expect(parsearDominio('1,,2,,3')).toEqual(['1', '2', '3'])
    })
  })

  describe('evaluarCuantificador - universal (∀)', () => {
    it('retorna verdadero si todos cumplen', () => {
      const dominio = ['2', '4', '6']
      const predicado = (x: string) => Number(x) % 2 === 0
      const resultado = evaluarCuantificador('forall', dominio, predicado, 'es par')
      expect(resultado.resultado).toBe(true)
      expect(resultado.contraejemplo).toBeUndefined()
      expect(resultado.tipo).toBe('forall')
    })

    it('retorna falso si alguno no cumple', () => {
      const dominio = ['2', '3', '6']
      const predicado = (x: string) => Number(x) % 2 === 0
      const resultado = evaluarCuantificador('forall', dominio, predicado, 'es par')
      expect(resultado.resultado).toBe(false)
      expect(resultado.contraejemplo).toBe('3')
    })

    it('genera trazabilidad completa', () => {
      const dominio = ['1', '2']
      const predicado = (x: string) => Number(x) > 0
      const resultado = evaluarCuantificador('forall', dominio, predicado, 'es positivo')
      expect(resultado.trazabilidad).toHaveLength(2)
      expect(resultado.trazabilidad[0].resultado).toBe(true)
      expect(resultado.trazabilidad[1].resultado).toBe(true)
    })
  })

  describe('evaluarCuantificador - existencial (∃)', () => {
    it('retorna verdadero si al menos uno cumple', () => {
      const dominio = ['1', '3', '4']
      const predicado = (x: string) => Number(x) % 2 === 0
      const resultado = evaluarCuantificador('exists', dominio, predicado, 'es par')
      expect(resultado.resultado).toBe(true)
      expect(resultado.testigo).toBe('4')
    })

    it('retorna falso si ninguno cumple', () => {
      const dominio = ['1', '3', '5']
      const predicado = (x: string) => Number(x) % 2 === 0
      const resultado = evaluarCuantificador('exists', dominio, predicado, 'es par')
      expect(resultado.resultado).toBe(false)
      expect(resultado.testigo).toBeUndefined()
    })
  })

  describe('Leyes de De Morgan', () => {
    it('genera De Morgan correcto para universal', () => {
      const resultado = evaluarCuantificador('forall', ['1'], () => true, 'test')
      expect(resultado.deMorgan.regla).toBe('¬(∀x P(x)) ≡ ∃x ¬P(x)')
    })

    it('genera De Morgan correcto para existencial', () => {
      const resultado = evaluarCuantificador('exists', ['1'], () => true, 'test')
      expect(resultado.deMorgan.regla).toBe('¬(∃x P(x)) ≡ ∀x ¬P(x)')
    })
  })

  describe('obtenerPredicados', () => {
    it('retorna predicados predefinidos', () => {
      const predicados = obtenerPredicados()
      expect(predicados.esPar).toBeDefined()
      expect(predicados.esPrimo).toBeDefined()
      expect(predicados.esPar.fn('4')).toBe(true)
      expect(predicados.esPar.fn('3')).toBe(false)
    })
  })

  describe('Dominio vacío', () => {
    it('forall con dominio vacío es verdadero (vacuidad)', () => {
      const resultado = evaluarCuantificador('forall', [], () => false, 'test')
      expect(resultado.resultado).toBe(true)
    })

    it('exists con dominio vacío es falso', () => {
      const resultado = evaluarCuantificador('exists', [], () => true, 'test')
      expect(resultado.resultado).toBe(false)
    })
  })
})
