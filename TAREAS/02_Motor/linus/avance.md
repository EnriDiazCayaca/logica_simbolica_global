# Avance del Motor Lógico - Equipo Linus (Conjuntos)

## Qué hicimos
Implementamos todas las funciones matemáticas requeridas para la teoría de conjuntos en TypeScript estricto, utilizando Generics (`Set<T>`) para mayor seguridad y escalabilidad (soporta números, letras, etc.).

## Archivos Creados
- `src/lib/sets/operations.ts`: Contiene la lógica matemática (Unión, Intersección, Potencia, etc.).
- `src/lib/sets/operations.test.ts`: Pruebas unitarias para validar las propiedades con Vitest.

## Qué falta
- Para el Entregable 3: Integrar este motor lógico con la interfaz gráfica en Vue.

## Cómo usar el motor (Ejemplo)
```typescript
import { union } from '../../src/lib/sets/operations';

const A = new Set([1, 2, 3]);
const B = new Set([3, 4, 5]);

console.log(union(A, B)); // Set { 1, 2, 3, 4, 5 }
```
