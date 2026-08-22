// src/lib/sets/operations.ts

/**
 * Operaciones Matemáticas de Teoría de Conjuntos - Equipo Linus
 * Usamos Generics (T) para que funcione con números, strings, etc.
 */

export function union<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a, ...b]);
}

export function interseccion<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a].filter(x => b.has(x)));
}

export function diferencia<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a].filter(x => !b.has(x)));
}

export function complemento<T>(universo: Set<T>, a: Set<T>): Set<T> {
  return diferencia(universo, a);
}

export function potencia<T>(a: Set<T>): Set<Set<T>> {
  const elementos = Array.from(a);
  const subconjuntos = new Set<Set<T>>();
  
  const numSubconjuntos = Math.pow(2, elementos.length);
  for (let i = 0; i < numSubconjuntos; i++) {
    const subconjunto = new Set<T>();
    for (let j = 0; j < elementos.length; j++) {
      if ((i & (1 << j)) !== 0) {
        subconjunto.add(elementos[j]);
      }
    }
    subconjuntos.add(subconjunto);
  }
  return subconjuntos;
}

export function verificarPertenencia<T>(elemento: T, conjunto: Set<T>): boolean {
  return conjunto.has(elemento);
}

export function sonDisjuntos<T>(a: Set<T>, b: Set<T>): boolean {
  for (const elemento of a) {
    if (b.has(elemento)) return false;
  }
  return true;
}

export function esSubconjunto<T>(a: Set<T>, b: Set<T>): boolean {
  for (const elemento of a) {
    if (!b.has(elemento)) return false;
  }
  return true;
}
