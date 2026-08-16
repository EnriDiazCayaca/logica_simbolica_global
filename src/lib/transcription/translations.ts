/**
 
 * Mapea cada ReglaLogica (Inferencia | Equivalencia, definidas por Arom en
 * types.ts) a su nombre para mostrar, alias populares, y una descripción
 * en español de QUÉ hace la regla en general (independiente del caso puntual).
 *
 * La descripción específica de un paso concreto (con las expresiones reales
 * involucradas) se arma en descriptionGenerator.ts combinando esta info con
 * las expresiones del AST.
 */

import type { ReglaLogica } from "../solver/types";

export interface InfoRegla {
  nombre: string;
  alias?: string;
  descripcion: string;
}

export const REGLAS: Record<ReglaLogica, InfoRegla> = {
  // ---- Reglas de Inferencia ----
  MODUS_PONENDO_PONENS: {
    nombre: "Modus Ponendo Ponens",
    alias: "MPP, Afirmando afirmo",
    descripcion:
      "si se cuenta con (P ENTONCES Q) y además se afirma P, se puede concluir Q",
  },
  MODUS_TOLLENDO_TOLLENS: {
    nombre: "Modus Tollendo Tollens",
    alias: "MTT, Negando niego",
    descripcion:
      "si se cuenta con (P ENTONCES Q) y se niega Q (es decir, NO Q), se puede concluir NO P",
  },
  SILOGISMO_DISYUNTIVO: {
    nombre: "Silogismo Disyuntivo",
    alias: "Modus Tollendo Ponens, MTP, Negando afirmo",
    descripcion:
      "si se cuenta con (P O Q) y se niega una de las dos, se puede concluir la otra",
  },
  SILOGISMO_HIPOTETICO: {
    nombre: "Silogismo Hipotético",
    alias: "SH, Transitividad",
    descripcion:
      "si se cuenta con (P ENTONCES Q) y (Q ENTONCES R), se puede concluir (P ENTONCES R)",
  },
  ADICION: {
    nombre: "Adición",
    alias: "AD",
    descripcion: "a partir de P, se puede concluir (P O Q) sin importar qué sea Q",
  },
  SIMPLIFICACION: {
    nombre: "Simplificación",
    alias: "SIMP",
    descripcion: "a partir de (P Y Q), se puede concluir P (o, análogamente, Q)",
  },
  CONJUNCION: {
    nombre: "Conjunción",
    alias: "CONJ",
    descripcion: "si se cuenta con P y, por separado, con Q, se puede concluir (P Y Q)",
  },
  DILEMA_CONSTRUCTIVO: {
    nombre: "Dilema Constructivo",
    descripcion:
      "si se cuenta con (P ENTONCES Q), (R ENTONCES S) y (P O R), se puede concluir (Q O S)",
  },

  // ---- Equivalencias Lógicas ----
  DE_MORGAN: {
    nombre: "Ley de De Morgan",
    descripcion:
      "NO(P Y Q) equivale a (NO P) O (NO Q), y de forma análoga, NO(P O Q) equivale a (NO P) Y (NO Q)",
  },
  DOBLE_NEGACION: {
    nombre: "Doble Negación",
    alias: "DN",
    descripcion: "NO(NO P) equivale directamente a P",
  },
  CONMUTATIVA: {
    nombre: "P. Conmutativa",
    descripcion: "el orden de los operandos no altera el resultado, ej. (P Y Q) equivale a (Q Y P)",
  },
  ASOCIATIVA: {
    nombre: "P. Asociativa",
    descripcion: "la forma de agrupar los operandos con paréntesis no altera el resultado",
  },
  DISTRIBUTIVA: {
    nombre: "P. Distributiva",
    descripcion:
      "(P Y (Q O R)) equivale a ((P Y Q) O (P Y R)), y de forma análoga distribuyendo O sobre Y",
  },
  IMPLICACION_MATERIAL: {
    nombre: "Implicación Material",
    alias: "Condicional a Disyunción",
    descripcion: "(P ENTONCES Q) equivale a ((NO P) O Q)",
  },
  CONTRAPOSICION: {
    nombre: "P. Contrarrecíproca",
    descripcion: "(P ENTONCES Q) equivale a ((NO Q) ENTONCES (NO P))",
  },
  EXPORTACION: {
    nombre: "Ley de exportación",
    descripcion: "((P Y Q) ENTONCES R) equivale a (P ENTONCES (Q ENTONCES R))",
  },
};
