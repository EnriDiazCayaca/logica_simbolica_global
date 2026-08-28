import { describe, it, expect } from 'vitest'
import {
  evaluarCuantificador,
  parsearDominio,
  obtenerPredicados,
  evaluarExpresionPredicado,
  negarComparador,
  negarExpresion,
  aplicarLeyes,
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

    it('parsea rango con < (excluyente)', () => {
      expect(parsearDominio('0 < x < 5')).toEqual(['1', '2', '3', '4'])
    })

    it('parsea rango con <= (inclusivo)', () => {
      expect(parsearDominio('1 <= x <= 3')).toEqual(['1', '2', '3'])
    })

    it('parsea rango descendente', () => {
      expect(parsearDominio('5 > x > 1')).toEqual(['2', '3', '4'])
    })

    it('parsea rango con negativos', () => {
      expect(parsearDominio('-2 < x < 2')).toEqual(['-1', '0', '1'])
    })

    it('retorna vacío si rango inválido', () => {
      expect(parsearDominio('5 < x < 1')).toEqual([])
    })
  })

  describe('evaluarExpresionPredicado', () => {
    it('evalúa comparación simple', () => {
      expect(evaluarExpresionPredicado('x > 3', '5')).toBe(true)
      expect(evaluarExpresionPredicado('x > 3', '2')).toBe(false)
    })

    it('evalúa módulo', () => {
      expect(evaluarExpresionPredicado('x % 2 === 0', '4')).toBe(true)
      expect(evaluarExpresionPredicado('x % 2 === 0', '3')).toBe(false)
    })

    it('evalúa AND lógico', () => {
      expect(evaluarExpresionPredicado('x > 2 && x < 10', '5')).toBe(true)
      expect(evaluarExpresionPredicado('x > 2 && x < 10', '1')).toBe(false)
    })

    it('evalúa OR lógico', () => {
      expect(evaluarExpresionPredicado('x === 1 || x === 2', '1')).toBe(true)
      expect(evaluarExpresionPredicado('x === 1 || x === 2', '3')).toBe(false)
    })

    it('evalúa con palabras clave AND/OR', () => {
      expect(evaluarExpresionPredicado('x > 0 AND x < 10', '5')).toBe(true)
      expect(evaluarExpresionPredicado('x > 0 OR x < 0', '0')).toBe(false)
    })
  })

  describe('negarComparador', () => {
    it('invierte > a <=', () => expect(negarComparador('>')).toBe('<='))
    it('invierte < a >=', () => expect(negarComparador('<')).toBe('>='))
    it('invierte >= a <', () => expect(negarComparador('>=')).toBe('<'))
    it('invierte <= a >', () => expect(negarComparador('<=')).toBe('>'))
    it('invierte == a !=', () => expect(negarComparador('==')).toBe('!='))
    it('invierte != a ==', () => expect(negarComparador('!=')).toBe('=='))
  })

  describe('negarExpresion', () => {
    it('invierte cuantificador universal', () => {
      const resultado = negarExpresion('∀x P(x)')
      expect(resultado).toContain('∃')
      expect(resultado).not.toContain('∀')
    })

    it('invierte cuantificador existencial', () => {
      const resultado = negarExpresion('∃x P(x)')
      expect(resultado).toContain('∀')
      expect(resultado).not.toContain('∃')
    })

    it('niega una expresión simple', () => {
      const resultado = negarExpresion('x > 5')
      expect(resultado).toContain('¬')
      expect(resultado).toContain('<=')
    })
  })

  describe('aplicarLeyes', () => {
    it('aplica bicondicional', () => {
      const pasos = aplicarLeyes('A ↔ B')
      expect(pasos.length).toBeGreaterThanOrEqual(1)
      expect(pasos[0].ley).toBe('Bicondicional')
      expect(pasos[0].despues).toContain('→')
      expect(pasos[0].despues).toContain('∧')
    })

    it('aplica implicación', () => {
      const pasos = aplicarLeyes('A → B')
      expect(pasos.length).toBeGreaterThanOrEqual(1)
      expect(pasos[0].ley).toBe('Implicación')
      expect(pasos[0].despues).toContain('¬')
      expect(pasos[0].despues).toContain('∨')
    })

    it('aplica De Morgan (conjunción negada)', () => {
      const pasos = aplicarLeyes('¬(A ∧ B)')
      expect(pasos.length).toBeGreaterThanOrEqual(1)
      expect(pasos[0].ley).toBe('De Morgan')
      expect(pasos[0].despues).toContain('∨')
    })

    it('aplica De Morgan (disyunción negada)', () => {
      const pasos = aplicarLeyes('¬(A ∨ B)')
      expect(pasos.length).toBeGreaterThanOrEqual(1)
      expect(pasos[0].ley).toBe('De Morgan')
      expect(pasos[0].despues).toContain('∧')
    })

    it('aplica distribución', () => {
      const pasos = aplicarLeyes('A ∧ (B ∨ C)')
      expect(pasos.length).toBeGreaterThanOrEqual(1)
      expect(pasos[0].ley).toBe('Distribución')
      expect(pasos[0].despues).toContain('∨')
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
      expect(resultado.deMorgan.regla).toContain('∀')
      expect(resultado.deMorgan.regla).toContain('∃')
    })

    it('genera De Morgan correcto para existencial', () => {
      const resultado = evaluarCuantificador('exists', ['1'], () => true, 'test')
      expect(resultado.deMorgan.regla).toContain('∃')
      expect(resultado.deMorgan.regla).toContain('∀')
    })
  })

  describe('Resolutor paso a paso', () => {
    it('genera pasos para expresión con implicación', () => {
      const resultado = evaluarCuantificador('forall', ['1'], () => true, 'test', 'A → B')
      expect(resultado.pasosResolucion.length).toBeGreaterThanOrEqual(1)
      expect(resultado.pasosResolucion[0].ley).toBe('Implicación')
    })

    it('no genera pasos si no hay expresión libre', () => {
      const resultado = evaluarCuantificador('forall', ['1'], () => true, 'test')
      expect(resultado.pasosResolucion).toHaveLength(0)
    })
  })

  describe('Predicados', () => {
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
