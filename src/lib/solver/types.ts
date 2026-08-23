// Operadores lÃ³gicos en espaÃ±ol
export type Operador =
  | 'Y'             // ConjunciÃ³n (AND)
  | 'O'             // DisyunciÃ³n (OR)
  | 'O_EXCLUSIVA'   // DisyunciÃ³n exclusiva (XOR)
  | 'NO'            // NegaciÃ³n (NOT)
  | 'ENTONCES'      // ImplicaciÃ³n / Condicional (IMPLIES)
  | 'SI_Y_SOLO_SI'  // Bicondicional (EQUIV)
  | 'NI'            // NOR (No O)
  | 'INCOMPATIBLE'; // NAND (No Y)

// Reglas de Inferencia (Principales)
export type Inferencia =
  | 'MODUS_PONENDO_PONENS'     // Alias: MPP, Afirmando afirmo
  | 'MODUS_TOLLENDO_TOLLENS'   // Alias: MTT, Negando niego
  | 'SILOGISMO_DISYUNTIVO'     // Alias: Modus Tollendo Ponens, MTP, Negando afirmo
  | 'SILOGISMO_HIPOTETICO'     // Alias: SH, Transitividad
  | 'ADICION'                  // Alias: AD
  | 'SIMPLIFICACION'           // Alias: SIMP
  | 'CONJUNCION'               // Alias: CONJ
  | 'DILEMA_CONSTRUCTIVO';     // P->Q, R->S, P v R |- Q v S

// Equivalencias LÃ³gicas (Principales)
export type Equivalencia =
  | 'DE_MORGAN'
  | 'DOBLE_NEGACION'
  | 'CONMUTATIVA'
  | 'ASOCIATIVA'
  | 'DISTRIBUTIVA'
  | 'IMPLICACION_MATERIAL'     // Alias: Condicional a DisyunciÃ³n (P -> Q = ~P v Q)
  | 'CONTRAPOSICION'           // Alias: TransposiciÃ³n (P -> Q = ~Q -> ~P)
  | 'EXPORTACION';             // (P ^ Q) -> R  equivale a  P -> (Q -> R)

export type ReglaLogica = Inferencia | Equivalencia;

// Nodos del Ãrbol de Sintaxis Abstracta (AST)
export interface NodoBase {
  tipo: 'variable' | 'operacion';
}

export interface NodoVariable extends NodoBase {
  tipo: 'variable';
  nombre: string; // ej. "p", "q"
}

export interface NodoOperacion extends NodoBase {
  tipo: 'operacion';
  operador: Operador;
  izquierdo?: NodoExpresion; // Opcional para operaciones unarias como 'NO'
  derecho?: NodoExpresion;
}

export type NodoExpresion = NodoVariable | NodoOperacion;

// Estructura de un "Paso" en la demostraciÃ³n
export interface PasoDemostracion {
  idPaso: ReglaLogica;
  lineasInvolucradas: number[]; // De quÃ© premisas o pasos anteriores se deduce (ej. [1, 2])
  expresionResultante: NodoExpresion; // La nueva premisa inferida
  esConclusion: boolean; // Verdadero si este paso alcanzÃ³ la conclusiÃ³n final
}

// Resultado completo de la verificaciÃ³n
export interface ResultadoDemostracion {
  errorLogico?: ErrorLogico;
  esValido: boolean; // Â¿Se logrÃ³ demostrar la conclusiÃ³n?
  pasos: PasoDemostracion[]; // El paso a paso de la demostraciÃ³n para que Mio lo traduzca
}

export type MotivoInvalidez =
  | 'FALACIA_AFIRMACION_CONSECUENTE'
  | 'FALACIA_NEGACION_ANTECEDENTE'
  | 'SIN_REGLAS_APLICABLES'
  | 'CONCLUSION_NO_ALCANZADA';

export interface ErrorLogico {
  tipo: MotivoInvalidez;
  lineasInvolucradas?: number[];
  mensaje: string;
}
