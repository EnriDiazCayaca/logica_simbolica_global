import { describe, it, expect } from 'vitest';
import { aplicarModusPonendoPonens, demostrarConclusion, sonNodosIguales } from './solver';
import type { NodoExpresion } from './types';

describe('Motor Lógico (Solver)', () => {
  
  // Nodo de utilidad para pruebas (Variable 'P')
  const nodoP: NodoExpresion = { tipo: 'variable', nombre: 'P' };
  // Nodo de utilidad para pruebas (Variable 'Q')
  const nodoQ: NodoExpresion = { tipo: 'variable', nombre: 'Q' };
  // Nodo (P ENTONCES Q)
  const implicacionPQ: NodoExpresion = {
    tipo: 'operacion',
    operador: 'ENTONCES',
    izquierdo: nodoP,
    derecho: nodoQ
  };

  describe('sonNodosIguales', () => {
    it('debe identificar variables iguales', () => {
      expect(sonNodosIguales(nodoP, { tipo: 'variable', nombre: 'P' })).toBe(true);
    });

    it('debe rechazar variables diferentes', () => {
      expect(sonNodosIguales(nodoP, nodoQ)).toBe(false);
    });

    it('debe identificar operaciones iguales', () => {
      const impl2: NodoExpresion = {
        tipo: 'operacion',
        operador: 'ENTONCES',
        izquierdo: { tipo: 'variable', nombre: 'P' },
        derecho: { tipo: 'variable', nombre: 'Q' }
      };
      expect(sonNodosIguales(implicacionPQ, impl2)).toBe(true);
    });
  });

  describe('Regla: Modus Ponendo Ponens', () => {
    it('debe retornar Q si se da P -> Q y P', () => {
      const resultado = aplicarModusPonendoPonens(implicacionPQ, nodoP);
      expect(resultado).not.toBeNull();
      expect(sonNodosIguales(resultado!, nodoQ)).toBe(true);
    });

    it('debe retornar null si la segunda premisa no coincide', () => {
      // P -> Q y Q, falacia de afirmación del consecuente
      const resultado = aplicarModusPonendoPonens(implicacionPQ, nodoQ);
      expect(resultado).toBeNull();
    });
  });

  describe('demostrarConclusion (Flujo principal)', () => {
    it('debe demostrar Q a partir de P -> Q y P', () => {
      const resultado = demostrarConclusion([implicacionPQ, nodoP], nodoQ);
      
      expect(resultado.esValido).toBe(true);
      expect(resultado.pasos.length).toBe(1);
      expect(resultado.pasos[0].idPaso).toBe('MODUS_PONENDO_PONENS');
      expect(sonNodosIguales(resultado.pasos[0].expresionResultante, nodoQ)).toBe(true);
    });
  });
});
