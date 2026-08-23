import { describe, it, expect } from 'vitest';
import {
  aplicarModusPonendoPonens,
  aplicarModusTollendoTollens,
  aplicarSilogismoDisyuntivo,
  aplicarSilogismoHipotetico,
  aplicarModusPonensBicondicional,
  demostrarConclusion,
  sonNodosIguales,
} from './solver';
import type { NodoExpresion } from './types';

describe('Motor Lógico (Solver)', () => {
  const nodoP: NodoExpresion = { tipo: 'variable', nombre: 'P' };
  const nodoQ: NodoExpresion = { tipo: 'variable', nombre: 'Q' };
  const nodoR: NodoExpresion = { tipo: 'variable', nombre: 'R' };
  const nodoZ: NodoExpresion = { tipo: 'variable', nombre: 'Z' };
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

  const bicPQ: NodoExpresion = {
    tipo: 'operacion',
    operador: 'SI_Y_SOLO_SI',
    izquierdo: nodoP,
    derecho: nodoQ
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

  describe('Reglas de Bicondicional', () => {
    it('debe aplicar Modus Ponens Bicondicional (P <-> Q y P |- Q)', () => {
      const resultado = aplicarModusPonensBicondicional(bicPQ, nodoP);
      expect(resultado).not.toBeNull();
      expect(sonNodosIguales(resultado!, nodoQ)).toBe(true);
    });

    it('debe aplicar Modus Ponens Bicondicional inverso (P <-> Q y Q |- P)', () => {
      const resultado = aplicarModusPonensBicondicional(bicPQ, nodoQ);
      expect(resultado).not.toBeNull();
      expect(sonNodosIguales(resultado!, nodoP)).toBe(true);
    });

    it('debe resolver demostraciones completas con bicondicional', () => {
      const resultado = demostrarConclusion([bicPQ, nodoP], nodoQ);
      expect(resultado.esValido).toBe(true);
      expect(resultado.pasos.length).toBeGreaterThanOrEqual(1);
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
      expect(resultado.pasos.length).toBe(1);
      expect(resultado.pasos[0].idPaso).toBe('SILOGISMO_DISYUNTIVO');
    });

    it('debe demostrar R en 2 pasos a partir de P -> Q, Q -> R y P', () => {
      const resultado = demostrarConclusion([implPQ, implQR, nodoP], nodoR);
      expect(resultado.esValido).toBe(true);
      expect(resultado.pasos.length).toBeGreaterThanOrEqual(1);
      expect(resultado.pasos.some(p => p.esConclusion)).toBe(true);
    });

    it('debe diagnosticar falacia de Afirmación del Consecuente con mensaje formal', () => {
      const resultado = demostrarConclusion([implPQ, nodoQ], nodoP);
      expect(resultado.esValido).toBe(false);
      expect(resultado.errorLogico?.tipo).toBe('FALACIA_AFIRMACION_CONSECUENTE');
      expect(resultado.errorLogico?.titulo).toContain('Afirmación del Consecuente');
      expect(resultado.errorLogico?.porQueFalla).toBeDefined();
      expect(resultado.errorLogico?.sugerencia).toBeDefined();
    });

    it('debe diagnosticar cuando la conclusión contiene variables inexistentes en las premisas', () => {
      const resultado = demostrarConclusion([implPQ, nodoP], nodoZ);
      expect(resultado.esValido).toBe(false);
      expect(resultado.errorLogico?.tipo).toBe('VARIABLE_NO_EXISTE_EN_PREMISAS');
      expect(resultado.errorLogico?.mensaje).toContain("La variable 'Z' de la conclusión no aparece");
    });
  });
});
