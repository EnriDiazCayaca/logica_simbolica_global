/**
 * Mapea cada ReglaLogica (Inferencia | Equivalencia) a su nombre
 * para mostrar, alias populares, y una descripción en español de
 * QUÉ hace la regla en general (independiente del caso puntual).
 *
 * La descripción específica de un paso concreto (con las expresiones
 * reales involucradas) se arma en descriptionGenerator.ts combinando
 * esta info con las expresiones del AST.
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
      "como el condicional (P → Q) es verdadero y su antecedente P también lo es, se deduce necesariamente que el consecuente Q es verdadero",
  },
  MODUS_TOLLENDO_TOLLENS: {
    nombre: "Modus Tollendo Tollens",
    alias: "MTT, Negando niego",
    descripcion:
      "como el condicional (P → Q) es verdadero pero su consecuente Q es falso (¬Q), se deduce necesariamente que el antecedente P debe ser falso (¬P)",
  },
  SILOGISMO_DISYUNTIVO: {
    nombre: "Silogismo Disyuntivo",
    alias: "MTP, Modus Tollendo Ponens",
    descripcion:
      "en una disyunción (P ∨ Q) al menos una proposición es verdadera; al saber que una es falsa, la otra opción es forzosamente verdadera",
  },
  SILOGISMO_DISYUNTIVO_EXCLUSIVO: {
    nombre: "Silogismo Disyuntivo Exclusivo",
    alias: "SDE, Disyunción Fuerte",
    descripcion:
      "en una disyunción exclusiva (P △ Q) exactamente una proposición es verdadera; afirmar una niega la otra, y negar una afirma la otra",
  },
  SILOGISMO_HIPOTETICO: {
    nombre: "Silogismo Hipotético",
    alias: "SH, Transitividad",
    descripcion:
      "como P implica a Q y Q a su vez implica a R, por transitividad lógica se deduce que P implica directamente a R",
  },
  ADICION: {
    nombre: "Adición",
    alias: "AD",
    descripcion: "a partir de una proposición verdadera P, se puede construir válidamente la disyunción (P ∨ Q)",
  },
  SIMPLIFICACION: {
    nombre: "Simplificación",
    alias: "SIMP",
    descripcion: "como la conjunción (P ∧ Q) es verdadera, ambas proposiciones son verdaderas por separado, permitiendo extraer cualquiera de ellas",
  },
  CONJUNCION: {
    nombre: "Conjunción",
    alias: "CONJ",
    descripcion: "al tener dos proposiciones P y Q demostradas de forma independiente, se concluye la verdad de su unión (P ∧ Q)",
  },
  DILEMA_CONSTRUCTIVO: {
    nombre: "Dilema Constructivo",
    alias: "DC",
    descripcion:
      "al cumplirse (P → Q) y (R → S), y saber que ocurre (P ∨ R), se deduce que ocurrirá al menos uno de los consecuentes (Q ∨ S)",
  },
  ELIMINACION_BICONDICIONAL: {
    nombre: "Eliminación del Bicondicional",
    alias: "EB, Bicondicional",
    descripcion:
      "un bicondicional (P ↔ Q) indica que ambas proposiciones tienen el mismo valor de verdad, descomponiéndose en (P → Q) y (Q → P)",
  },
  MODUS_PONENS_BICONDICIONAL: {
    nombre: "Modus Ponens Bicondicional",
    alias: "MPB",
    descripcion:
      "al ser (P ↔ Q) verdadero, afirmar cualquiera de los dos lados deduce inmediatamente la verdad del otro",
  },

  // ---- Equivalencias Lógicas ----
  DE_MORGAN: {
    nombre: "Ley de De Morgan",
    alias: "DM",
    descripcion:
      "la negación de una conjunción ¬(P ∧ Q) equivale a la disyunción de las negaciones (¬P ∨ ¬Q), y viceversa",
  },
  DOBLE_NEGACION: {
    nombre: "Doble Negación",
    alias: "DN",
    descripcion: "negar dos veces una proposición ¬(¬P) equivale lógicamente a afirmar su valor original P",
  },
  CONMUTATIVA: {
    nombre: "P. Conmutativa",
    alias: "CONM",
    descripcion: "el orden de los operandos no altera el valor de verdad de la expresión",
  },
  ASOCIATIVA: {
    nombre: "P. Asociativa",
    alias: "ASOC",
    descripcion: "la forma de agrupar operandos homogéneos mediante paréntesis no altera el resultado",
  },
  DISTRIBUTIVA: {
    nombre: "P. Distributiva",
    alias: "DIST",
    descripcion:
      "distribución de un operador sobre otro, como (P ∧ (Q ∨ R)) ≡ ((P ∧ Q) ∨ (P ∧ R))",
  },
  IMPLICACION_MATERIAL: {
    nombre: "Implicación Material",
    alias: "Condicional a Disyunción",
    descripcion: "el condicional (P → Q) equivale lógicamente a (¬P ∨ Q)",
  },
  CONTRAPOSICION: {
    nombre: "P. Contrarrecíproca",
    alias: "Contraposición",
    descripcion: "un condicional (P → Q) equivale lógicamente a su contrarrecíproco (¬Q → ¬P)",
  },
  EXPORTACION: {
    nombre: "Ley de Exportación",
    alias: "EXP",
    descripcion: "((P ∧ Q) → R) equivale lógicamente a (P → (Q → R))",
  },
  EQUIVALENCIA_MATERIAL: {
    nombre: "Equivalencia Material",
    alias: "EQM",
    descripcion: "el bicondicional (P ↔ Q) equivale lógicamente a la conjunción de dos implicaciones ((P → Q) ∧ (Q → P))",
  },
};
