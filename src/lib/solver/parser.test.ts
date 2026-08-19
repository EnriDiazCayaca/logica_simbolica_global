import { describe, it, expect } from 'vitest';
import { parsearExpresion, tokenizar } from './parser';
import { sonNodosIguales } from './solver';
import type { NodoExpresion } from './types';

describe('Motor Lógico (Parser)', () => {

  describe('Análisis Léxico (tokenizar)', () => {
    it('debe tokenizar correctamente variables y operadores simples', () => {
      const tokens = tokenizar('P Y Q');
      expect(tokens.length).toBe(3);
      expect(tokens[0]).toEqual({ tipo: 'VARIABLE', valor: 'P' });
      expect(tokens[1]).toEqual({ tipo: 'OPERADOR', valor: 'Y' });
      expect(tokens[2]).toEqual({ tipo: 'VARIABLE', valor: 'Q' });
    });

    it('debe aislar paréntesis sin importar los espacios', () => {
      const tokens = tokenizar('P ENTONCES(Q O R)');
      expect(tokens.length).toBe(7);
      expect(tokens[0]).toEqual({ tipo: 'VARIABLE', valor: 'P' });
      expect(tokens[1]).toEqual({ tipo: 'OPERADOR', valor: 'ENTONCES' });
      expect(tokens[2]).toEqual({ tipo: 'PARENTESIS_IZQ', valor: '(' });
      expect(tokens[3]).toEqual({ tipo: 'VARIABLE', valor: 'Q' });
      expect(tokens[4]).toEqual({ tipo: 'OPERADOR', valor: 'O' });
      expect(tokens[5]).toEqual({ tipo: 'VARIABLE', valor: 'R' });
      expect(tokens[6]).toEqual({ tipo: 'PARENTESIS_DER', valor: ')' });
    });
  });

  describe('Análisis Sintáctico (parsearExpresion)', () => {
    it('debe construir AST para expresión simple (P O Q)', () => {
      const ast = parsearExpresion('P O Q');
      const esperado: NodoExpresion = {
        tipo: 'operacion',
        operador: 'O',
        izquierdo: { tipo: 'variable', nombre: 'P' },
        derecho: { tipo: 'variable', nombre: 'Q' }
      };
      expect(sonNodosIguales(ast, esperado)).toBe(true);
    });

    it('debe respetar la precedencia (NO P ENTONCES Q)', () => {
      // "NO" tiene más precedencia que "ENTONCES"
      const ast = parsearExpresion('NO P ENTONCES Q');
      const esperado: NodoExpresion = {
        tipo: 'operacion',
        operador: 'ENTONCES',
        izquierdo: {
          tipo: 'operacion',
          operador: 'NO',
          derecho: { tipo: 'variable', nombre: 'P' }
        },
        derecho: { tipo: 'variable', nombre: 'Q' }
      };
      expect(sonNodosIguales(ast, esperado)).toBe(true);
    });

    it('debe respetar los paréntesis explícitos: NO (P ENTONCES Q)', () => {
      const ast = parsearExpresion('NO (P ENTONCES Q)');
      const esperado: NodoExpresion = {
        tipo: 'operacion',
        operador: 'NO',
        derecho: {
          tipo: 'operacion',
          operador: 'ENTONCES',
          izquierdo: { tipo: 'variable', nombre: 'P' },
          derecho: { tipo: 'variable', nombre: 'Q' }
        }
      };
      expect(sonNodosIguales(ast, esperado)).toBe(true);
    });

    it('debe lanzar error de sintaxis ante expresiones mal formadas', () => {
      // Paréntesis desbalanceados
      expect(() => parsearExpresion('P Y (Q O R')).toThrowError(/Falta paréntesis de cierre/);
      
      // Fin inesperado
      expect(() => parsearExpresion('P Y')).toThrowError(/final de la expresión/);
      
      // Tokens sobrantes
      expect(() => parsearExpresion('P Y Q R')).toThrowError(/Tokens inesperados al final: R/);
    });
  });

});
