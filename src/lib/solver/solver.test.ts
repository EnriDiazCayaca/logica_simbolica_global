import { describe, it, expect } from 'vitest';
import {
  aplicarModusPonendoPonens,
  aplicarModusTollendoTollens,
  aplicarSilogismoDisyuntivo,
  aplicarSilogismoHipotetico,
  demostrarConclusion,
  sonNodosIguales,
  negarNodo
} from './solver';
import type { NodoExpresion } from './types';

describe('Motor Lógico (Solver)', () => {
  const nodoP: NodoExpresion = { tipo: 'variable', nombre: 'P' };
  const nodoQ: NodoExpresion = { tipo: 'variable', nombre: 'Q' };
  const nodoR: NodoExpresion = { tipo: 'variable', nombre: 'R' };
  const nodoNoP: NodoExpresion = { tipo: 'operacion', operador: 'NO', derecho: nodoP };
  const nodoNoQ: NodoExpresion = { tipo: 'operacion', operador: 'NO', derecho: nodoQ };

  const implPQ: NodoExpresion = {
    tipo: 'operacion',
    operador: 'ENTONCES',
    izquierdo: nodoP,
    derecho: nodoQ
  };

  const implQR: NodoExpresion = {
    tipo: 'operacion',
    operador: 'ENTONCES',
    izquierdo: nodoQ,
    derecho: nodoR
  };

  const disyPQ: NodoExpresion = {
    tipo: 'operacion',
    operador: 'O',
    izquierdo: nodoP,
    derecho: nodoQ
  };

  describe('sonNodosIguales', () => {
    it('debe identificar variables iguales (case-insensitive)', () => {
      expect(sonNodosIguales(nodoP, { tipo: 'variable', nombre: 'P' })).toBe(true);
      expect(sonNodosIguales(nodoP, { tipo: 'variable', nombre: 'p' })).toBe(true);
    });

    it('debe rechazar variables diferentes', () => {
      expect(sonNodosIguales(nodoP, nodoQ)).toBe(false);
    });
  });

  describe('Regla: Modus Ponendo Ponens', () => {
    it('debe retornar Q si se da P -> Q y P', () => {
      const resultado = aplicarModusPonendoPonens(implPQ, nodoP);
      expect(resultado).not.toBeNull();
      expect(sonNodosIguales(resultado!, nodoQ)).toBe(true);
    });
  });

  describe('Regla: Modus Tollendo Tollens', () => {
    it('debe retornar NO P si se da P -> Q y NO Q', () => {
      const resultado = aplicarModusTollendoTollens(implPQ, nodoNoQ);
      expect(resultado).not.toBeNull();
      expect(sonNodosIguales(resultado!, nodoNoP)).toBe(true);
    });
  });

  describe('Regla: Silogismo Disyuntivo', () => {
    it('debe retornar Q si se da P v Q y NO P', () => {
      const resultado = aplicarSilogismoDisyuntivo(disyPQ, nodoNoP);
      expect(resultado).not.toBeNull();
      expect(sonNodosIguales(resultado!, nodoQ)).toBe(true);
    });

    it('debe retornar P si se da P v Q y NO Q', () => {
      const resultado = aplicarSilogismoDisyuntivo(disyPQ, nodoNoQ);
      expect(resultado).not.toBeNull();
      expect(sonNodosIguales(resultado!, nodoP)).toBe(true);
    });
  });

  describe('Regla: Silogismo Hipotético', () => {
    it('debe retornar P -> R si se da P -> Q y Q -> R', () => {
      const resultado = aplicarSilogismoHipotetico(implPQ, implQR);
      expect(resultado).not.toBeNull();
      expect(sonNodosIguales(resultado!, {
        tipo: 'operacion',
        operador: 'ENTONCES',
        izquierdo: nodoP,
        derecho: nodoR
      })).toBe(true);
    });
  });

  describe('demostrarConclusion (Demostraciones avanzadas y multi-paso)', () => {
    it('debe demostrar Q a partir de P -> Q y P (Modus Ponens)', () => {
      const resultado = demostrarConclusion([implPQ, nodoP], nodoQ);
      expect(resultado.esValido).toBe(true);
      expect(resultado.pasos.length).toBe(1);
      expect(resultado.pasos[0].idPaso).toBe('MODUS_PONENDO_PONENS');
    });

    it('debe demostrar NO P a partir de P -> Q y NO Q (Modus Tollens)', () => {
      const resultado = demostrarConclusion([implPQ, nodoNoQ], nodoNoP);
      expect(resultado.esValido).toBe(true);
      expect(resultado.pasos.length).toBe(1);
      expect(resultado.pasos[0].idPaso).toBe('MODUS_TOLLENDO_TOLLENS');
    });

    it('debe demostrar Q a partir de P v Q y NO P (Silogismo Disyuntivo)', () => {
      const resultado = demostrarConclusion([disyPQ, nodoNoP], nodoQ);
      expect(resultado.esValido).toBe(true);
      expect(resultado.pasos[0].idPaso).toBe('SILOGISMO_DISYUNTIVO');
    });

    it('debe demostrar R en 2 pasos a partir de P -> Q, Q -> R y P', () => {
      const resultado = demostrarConclusion([implPQ, implQR, nodoP], nodoR);
      expect(resultado.esValido).toBe(true);
      expect(resultado.pasos.length).toBeGreaterThanOrEqual(1);
      expect(resultado.pasos.some(p => p.esConclusion)).toBe(true);
    });

    it('debe rechazar inferencias falaces', () => {
      // P -> Q y Q |- P (Afirmación del consecuente = falacia)
      const resultado = demostrarConclusion([implPQ, nodoQ], nodoP);
      expect(resultado.esValido).toBe(false);
    });
  });
});
