import { describe, it, expect } from 'vitest';
import {
  union, interseccion, diferencia, complemento,
  potencia, verificarPertenencia, sonDisjuntos, esSubconjunto
} from './operations';

describe('Operaciones de Conjuntos (Equipo Linus)', () => {

  // --- Unión ---
  it('Unión: A ∪ B combina todos los elementos sin repetir', () => {
    const A = new Set([1, 2, 3]);
    const B = new Set([3, 4, 5]);
    expect(union(A, B)).toEqual(new Set([1, 2, 3, 4, 5]));
  });

  it('Unión: propiedad conmutativa A ∪ B = B ∪ A', () => {
    const A = new Set([1, 2]);
    const B = new Set([3, 4]);
    expect(union(A, B)).toEqual(union(B, A));
  });

  // --- Intersección ---
  it('Intersección: A ∩ B devuelve solo elementos comunes', () => {
    const A = new Set([1, 2, 3, 4]);
    const B = new Set([3, 4, 5, 6]);
    expect(interseccion(A, B)).toEqual(new Set([3, 4]));
  });

  it('Intersección: conjuntos disjuntos retornan vacío', () => {
    const A = new Set([1, 2]);
    const B = new Set([3, 4]);
    expect(interseccion(A, B)).toEqual(new Set());
  });

  // --- Diferencia ---
  it('Diferencia: A − B devuelve lo que está en A pero no en B', () => {
    const A = new Set([1, 2, 3]);
    const B = new Set([2, 3]);
    expect(diferencia(A, B)).toEqual(new Set([1]));
  });

  // --- Complemento ---
  it('Complemento: A\' devuelve U − A', () => {
    const U = new Set([1, 2, 3, 4, 5]);
    const A = new Set([1, 2]);
    expect(complemento(U, A)).toEqual(new Set([3, 4, 5]));
  });

  // --- Potencia ---
  it('Potencia: P({1,2}) tiene 4 subconjuntos', () => {
    const A = new Set([1, 2]);
    const P = potencia(A);
    expect(P.size).toBe(4);
  });

  // --- Pertenencia ---
  it('Pertenencia: 2 ∈ {1, 2, 3} es verdadero', () => {
    expect(verificarPertenencia(2, new Set([1, 2, 3]))).toBe(true);
  });

  it('Pertenencia: 5 ∈ {1, 2, 3} es falso', () => {
    expect(verificarPertenencia(5, new Set([1, 2, 3]))).toBe(false);
  });

  // --- Subconjunto ---
  it('Subconjunto: {1, 2} ⊆ {1, 2, 3, 4} es verdadero', () => {
    expect(esSubconjunto(new Set([1, 2]), new Set([1, 2, 3, 4]))).toBe(true);
  });

  // --- Disjuntos ---
  it('Disjuntos: {1, 2} y {3, 4} son disjuntos', () => {
    expect(sonDisjuntos(new Set([1, 2]), new Set([3, 4]))).toBe(true);
  });

  it('Disjuntos: {1, 2} y {2, 3} NO son disjuntos', () => {
    expect(sonDisjuntos(new Set([1, 2]), new Set([2, 3]))).toBe(false);
  });

  // --- Propiedad distributiva ---
  it('Propiedad distributiva: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)', () => {
    const A = new Set([1, 2, 3, 4]);
    const B = new Set([2, 3, 5]);
    const C = new Set([3, 4, 6]);
    const izquierda = interseccion(A, union(B, C));
    const derecha = union(interseccion(A, B), interseccion(A, C));
    expect(izquierda).toEqual(derecha);
  });

  // --- Funciona con strings ---
  it('Funciona con strings: unión de letras', () => {
    const A = new Set(['a', 'b']);
    const B = new Set(['b', 'c']);
    expect(union(A, B)).toEqual(new Set(['a', 'b', 'c']));
  });
});
