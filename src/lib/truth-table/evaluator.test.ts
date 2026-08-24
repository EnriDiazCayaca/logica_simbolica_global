import { describe, expect, it } from 'vitest';
import { evaluar, generarTabla, parseProposition } from './evaluator';

describe('Motor de tablas de verdad - Sinergia', () => {
  it('evalúa p AND q correctamente', () => {
    const nodo = parseProposition('p AND q');
    const asignacion = new Map([
      ['P', true],
      ['Q', false],
    ]);
    expect(evaluar(nodo, asignacion)).toBe(false);
  });

  it('evalúa p OR NOT q correctamente', () => {
    const nodo = parseProposition('p OR NOT q');
    expect(evaluar(nodo, new Map([['P', false], ['Q', false]]))).toBe(true);
    expect(evaluar(nodo, new Map([['P', false], ['Q', true]]))).toBe(false);
  });

  it('evalúa p IMPLIES q correctamente', () => {
    const nodo = parseProposition('p IMPLIES q');
    expect(evaluar(nodo, new Map([['P', true], ['Q', false]]))).toBe(false);
    expect(evaluar(nodo, new Map([['P', false], ['Q', false]]))).toBe(true);
  });

  it('identifica una tautología', () => {
    const tabla = generarTabla('p OR NOT p');
    expect(tabla.clasificacion).toBe('tautologia');
    expect(tabla.verdaderas).toBe(2);
  });

  it('identifica una contradicción', () => {
    const tabla = generarTabla('p AND NOT p');
    expect(tabla.clasificacion).toBe('contradiccion');
    expect(tabla.falsas).toBe(2);
  });

  it('identifica una contingencia', () => {
    const tabla = generarTabla('p AND q');
    expect(tabla.clasificacion).toBe('contingencia');
    expect(tabla.verdaderas).toBe(1);
    expect(tabla.falsas).toBe(3);
  });
});
