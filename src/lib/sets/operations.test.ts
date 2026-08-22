import { describe, it, expect } from 'vitest';
import { 
  union, interseccion, diferencia, complemento, 
  potencia, verificarPertenencia, sonDisjuntos, esSubconjunto 
} from './operations';

describe('Operaciones de Conjuntos (Equipo Linus)', () => {
  it('Debe calcular la Unión correctamente', () => {
    const A = new Set([1, 2]);
    const B = new Set([2, 3]);
    expect(union(A, B)).toEqual(new Set([1, 2, 3]));
  });
  
  it('Debe calcular la Intersección correctamente', () => {
    const A = new Set([1, 2, 3]);
    const B = new Set([2, 3, 4]);
    expect(interseccion(A, B)).toEqual(new Set([2, 3]));
  });

  it('Debe calcular la Diferencia A - B', () => {
    const A = new Set([1, 2, 3]);
    const B = new Set([2, 3]);
    expect(diferencia(A, B)).toEqual(new Set([1]));
  });

  it('Verifica Pertenencia e Inclusión', () => {
    const A = new Set([1, 2]);
    const Universo = new Set([1, 2, 3, 4]);
    expect(verificarPertenencia(2, A)).toBe(true);
    expect(esSubconjunto(A, Universo)).toBe(true);
  });
});
