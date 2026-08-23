import { describe, it, expect } from 'vitest';
import {
  aplicarModusPonendoPonens,
  aplicarModusTollendoTollens,
  aplicarSilogismoDisyuntivo,
  aplicarSilogismoDisyuntivoExclusivo,
  aplicarSilogismoHipotetico,
  aplicarModusPonensBicondicional,
  demostrarConclusion,
  sonNodosIguales,
  encontrarContraejemplo,
} from './solver';
import { parsearExpresion } from './parser';
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

  const xorPQ: NodoExpresion = {
    tipo: 'operacion',
    operador: 'O_EXCLUSIVA',
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

  describe('Evaluador Semántico y Contraejemplos', () => {
    it('debe encontrar contraejemplo para la falacia de afirmación del consecuente', () => {
      const contraejemplo = encontrarContraejemplo([implPQ, nodoQ], nodoP);
      expect(contraejemplo).not.toBeNull();
      // P=False, Q=True hace P->Q Verdadero, Q Verdadero y P Falso
      expect(contraejemplo?.valores['P']).toBe(false);
      expect(contraejemplo?.valores['Q']).toBe(true);
      expect(contraejemplo?.valorConclusion).toBe(false);
    });

    it('debe encontrar contraejemplo para la falacia del dilema inverso reportada por el usuario', () => {
      const p1 = parsearExpresion('(P ENTONCES Q) Y (R ENTONCES S)');
      const p2 = parsearExpresion('Q O S');
      const conclusion = parsearExpresion('P O R');

      const resultado = demostrarConclusion([p1, p2], conclusion);
      expect(resultado.esValido).toBe(false);
      expect(resultado.errorLogico).toBeDefined();
      expect(resultado.errorLogico?.contraejemplo).toBeDefined();
      expect(resultado.errorLogico?.titulo).toContain('Dilema Inverso');
    });
  });

  describe('Reglas de Disyunción Exclusiva / Fuerte (⊕)', () => {
    it('debe aplicar Silogismo Disyuntivo Exclusivo (P ⊕ Q y P |- ¬Q)', () => {
      const resultado = aplicarSilogismoDisyuntivoExclusivo(xorPQ, nodoP);
      expect(resultado).not.toBeNull();
      expect(sonNodosIguales(resultado!, nodoNoQ)).toBe(true);
    });

    it('debe aplicar Silogismo Disyuntivo Exclusivo (P ⊕ Q y ¬P |- Q)', () => {
      const resultado = aplicarSilogismoDisyuntivoExclusivo(xorPQ, nodoNoP);
      expect(resultado).not.toBeNull();
      expect(sonNodosIguales(resultado!, nodoQ)).toBe(true);
    });

    it('debe resolver una demostración completa con disyunción exclusiva', () => {
      const resultado = demostrarConclusion([xorPQ, nodoP], nodoNoQ);
      expect(resultado.esValido).toBe(true);
      expect(resultado.pasos.length).toBeGreaterThanOrEqual(1);
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
      expect(resultado.errorLogico?.contraejemplo).toBeDefined();
    });

    it('debe diagnosticar cuando la conclusión contiene variables inexistentes en las premisas', () => {
      const resultado = demostrarConclusion([implPQ, nodoP], nodoZ);
      expect(resultado.esValido).toBe(false);
      expect(resultado.errorLogico?.tipo).toBe('VARIABLE_NO_EXISTE_EN_PREMISAS');
      expect(resultado.errorLogico?.mensaje).toContain("La variable 'Z' de la conclusión no aparece");
    });
  });
});
