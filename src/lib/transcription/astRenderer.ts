/**
 * astRenderer.ts
 * --------------
 * Convierte un NodoExpresion (el AST real de Arom) a una cadena de texto
 * con símbolos matemáticos legibles y estándar (¬, →, ↔, ∧, ∨, △), para
 * usarla dentro de las explicaciones y trazabilidad pedagógica.
 */

import type { NodoExpresion } from "../solver/types";

const SIMBOLO_OPERADOR: Record<string, string> = {
  ENTONCES: '→',
  SI_Y_SOLO_SI: '↔',
  O_EXCLUSIVA: '△',
  Y: '∧',
  O: '∨',
  NO: '¬',
  NI: '↓',
  INCOMPATIBLE: '↑',
};

export function renderizarNodo(nodo: NodoExpresion): string {
  if (nodo.tipo === "variable") {
    return nodo.nombre;
  }

  // nodo.tipo === 'operacion'
  const { operador, izquierdo, derecho } = nodo;
  const simb = SIMBOLO_OPERADOR[operador] ?? operador;

  // Caso unario: solo 'NO'
  if (!izquierdo && derecho) {
    if (derecho.tipo === 'variable') {
      return `¬${derecho.nombre}`;
    }
    return `¬(${renderizarNodo(derecho)})`;
  }

  // Caso binario
  if (izquierdo && derecho) {
    return `(${renderizarNodo(izquierdo)} ${simb} ${renderizarNodo(derecho)})`;
  }

  // Caso degenerado
  return `[${operador}: expresión incompleta]`;
}
