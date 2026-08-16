/**
 * astRenderer.ts
 * --------------
 * Convierte un NodoExpresion (el AST real de Arom) a una cadena de texto
 * legible en español, para usarla dentro de las explicaciones que arma
 * descriptionGenerator.ts. No es "lenguaje natural narrado", es notación
 * simbólica legible, ej: "(P ENTONCES Q)", "(NO P)".
 */

import type { NodoExpresion } from "./types";

export function renderizarNodo(nodo: NodoExpresion): string {
  if (nodo.tipo === "variable") {
    return nodo.nombre;
  }

  // nodo.tipo === 'operacion'
  const { operador, izquierdo, derecho } = nodo;

  // Caso unario: solo 'NO' se usa así en el AST de Arom (solo 'derecho' presente)
  if (!izquierdo && derecho) {
    return `(${operador} ${renderizarNodo(derecho)})`;
  }

  // Caso binario
  if (izquierdo && derecho) {
    return `(${renderizarNodo(izquierdo)} ${operador} ${renderizarNodo(derecho)})`;
  }

  // Caso degenerado (no debería pasar con un AST bien formado)
  return `[${operador}: expresión incompleta]`;
}
