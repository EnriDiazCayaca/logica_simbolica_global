import { describe, it, expect } from 'vitest';
import { sanitizarEntrada, validarPremisasYConclusion } from './validator';
import { parsearExpresion } from './solver/parser';
import { demostrarConclusion } from './solver/solver';
import { construirTrazabilidad } from './trazabilidad/historial';
import { explicarDemostracion } from './transcription';

describe('Prueba de Integración End-to-End: Motor Lógico Hijos de Linus (Sprint 2)', () => {

  it('debe procesar un flujo completo: Entrada sucia -> Sanitización -> Parseo AST -> Solver -> Trazabilidad -> Transcripción', () => {
    // 1. Entrada desordenada / lenguaje natural con símbolos matemáticos
    const premisa1Sucia = '  p   ->   q  '; // Modus Ponens premisa mayor
    const premisa2Sucia = 'p';            // Modus Ponens premisa menor
    const conclusionSucia = 'q';          // Conclusión esperada

    // 2. Paso Renato: Validación y Sanitización
    const validacion = validarPremisasYConclusion([premisa1Sucia, premisa2Sucia], conclusionSucia);
    expect(validacion.esValido).toBe(true);
    expect(validacion.premisasSanitizadas).toEqual(['P ENTONCES Q', 'P']);
    expect(validacion.conclusionSanitizada).toBe('Q');

    // 3. Paso Arom: Análisis Sintáctico (Parser AST)
    const nodoPremisa1 = parsearExpresion(validacion.premisasSanitizadas[0]);
    const nodoPremisa2 = parsearExpresion(validacion.premisasSanitizadas[1]);
    const nodoConclusion = parsearExpresion(validacion.conclusionSanitizada);

    expect(nodoPremisa1.tipo).toBe('operacion');
    expect(nodoPremisa2.tipo).toBe('variable');
    expect(nodoConclusion.tipo).toBe('variable');

    // 4. Paso Arom: Demostración con el Solver
    const premisas = [nodoPremisa1, nodoPremisa2];
    const resultadoSolver = demostrarConclusion(premisas, nodoConclusion);

    expect(resultadoSolver.esValido).toBe(true);
    expect(resultadoSolver.pasos.length).toBe(1);
    expect(resultadoSolver.pasos[0].idPaso).toBe('MODUS_PONENDO_PONENS');

    // 5. Paso Morocho & Alex: Construcción de la Trazabilidad y Snapshot
    const resultadoTrazabilidad = construirTrazabilidad(premisas, resultadoSolver);

    expect(resultadoTrazabilidad.esValido).toBe(true);
    expect(resultadoTrazabilidad.totalPasos).toBe(1);
    expect(resultadoTrazabilidad.pasos[0].operacion).toBe('Modus Ponendo Ponens');
    expect(resultadoTrazabilidad.pasos[0].expresionSimbolica).toBe('Q');
    expect(resultadoTrazabilidad.pasos[0].lineasBase).toEqual([1, 2]);

    // 6. Paso Mio: Transcripción a lenguaje natural en español
    const explicacion = explicarDemostracion(premisas, resultadoSolver);

    expect(explicacion.pasos.length).toBe(1);
    expect(explicacion.pasos[0].descripcion).toContain('Modus Ponendo Ponens');
    expect(explicacion.conclusion).toContain('demostrar');
  });

  it('debe manejar entradas inválidas sin que el pipeline colapse con errores no capturados', () => {
    const validacion = validarPremisasYConclusion(['p -> (q &'], 'r');
    expect(validacion.esValido).toBe(false);
    expect(validacion.errores.length).toBeGreaterThan(0);
  });

  it('debe procesar notaciones simbólicas ricas como Unicode y flechas compuestas', () => {
    const p1 = sanitizarEntrada('p ∧ q');
    const p2 = sanitizarEntrada('p ∨ r');
    const p3 = sanitizarEntrada('¬p');
    const p4 = sanitizarEntrada('p ↔ q');

    expect(p1).toBe('P Y Q');
    expect(p2).toBe('P O R');
    expect(p3).toBe('NO P');
    expect(p4).toBe('P SI_Y_SOLO_SI Q');

    // Comprobar que el parser de Arom las procesa sin problemas
    expect(() => parsearExpresion(p1)).not.toThrow();
    expect(() => parsearExpresion(p2)).not.toThrow();
    expect(() => parsearExpresion(p3)).not.toThrow();
    expect(() => parsearExpresion(p4)).not.toThrow();
  });

});
