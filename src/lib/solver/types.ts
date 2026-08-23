// Operadores lógicos en español
export type Operador =
  | 'Y'             // Conjunción (AND)
  | 'O'             // Disyunción (OR)
  | 'O_EXCLUSIVA'   // Disyunción exclusiva (XOR)
  | 'NO'            // Negación (NOT)
  | 'ENTONCES'      // Implicación / Condicional (IMPLIES)
  | 'SI_Y_SOLO_SI'  // Bicondicional (EQUIV)
  | 'NI'            // NOR (No O)
  | 'INCOMPATIBLE'; // NAND (No Y)

// Reglas de Inferencia (Principales)
export type Inferencia =
  | 'MODUS_PONENDO_PONENS'         // Alias: MPP, Afirmando afirmo
  | 'MODUS_TOLLENDO_TOLLENS'       // Alias: MTT, Negando niego
  | 'SILOGISMO_DISYUNTIVO'         // Alias: Modus Tollendo Ponens, MTP, Negando afirmo
  | 'SILOGISMO_HIPOTETICO'         // Alias: SH, Transitividad
  | 'ADICION'                      // Alias: AD
  | 'SIMPLIFICACION'               // Alias: SIMP
  | 'CONJUNCION'                   // Alias: CONJ
  | 'DILEMA_CONSTRUCTIVO'          // P->Q, R->S, P v R |- Q v S
  | 'ELIMINACION_BICONDICIONAL'    // P <-> Q |- P -> Q, Q -> P
  | 'MODUS_PONENS_BICONDICIONAL';  // P <-> Q, P |- Q

// Equivalencias Lógicas (Principales)
export type Equivalencia =
  | 'DE_MORGAN'
  | 'DOBLE_NEGACION'
  | 'CONMUTATIVA'
  | 'ASOCIATIVA'
  | 'DISTRIBUTIVA'
  | 'IMPLICACION_MATERIAL'     // Alias: Condicional a Disyunción (P -> Q = ~P v Q)
  | 'CONTRAPOSICION'           // Alias: Transposición (P -> Q = ~Q -> ~P)
  | 'EXPORTACION'              // (P ^ Q) -> R  equivale a  P -> (Q -> R)
  | 'EQUIVALENCIA_MATERIAL';   // P <-> Q equivale a (P -> Q) ^ (Q -> P)

export type ReglaLogica = Inferencia | Equivalencia;

// Nodos del Árbol de Sintaxis Abstracta (AST)
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

// Estructura de un "Paso" en la demostración
export interface PasoDemostracion {
  idPaso: ReglaLogica;
  lineasInvolucradas: number[]; // De qué premisas o pasos anteriores se deduce (ej. [1, 2])
  expresionResultante: NodoExpresion; // La nueva premisa inferida
  esConclusion: boolean; // Verdadero si este paso alcanzó la conclusión final
}

// Motivos de Invalidez y Diagnóstico
export type MotivoInvalidez =
  | 'FALACIA_AFIRMACION_CONSECUENTE'
  | 'FALACIA_NEGACION_ANTECEDENTE'
  | 'VARIABLE_NO_EXISTE_EN_PREMISAS'
  | 'SIN_REGLAS_APLICABLES'
  | 'CONCLUSION_NO_ALCANZADA';

export interface ErrorLogico {
  tipo: MotivoInvalidez;
  lineasInvolucradas?: number[];
  mensaje: string;
}

// Resultado completo de la verificación
export interface ResultadoDemostracion {
  errorLogico?: ErrorLogico;
  esValido: boolean; // ¿Se logró demostrar la conclusión?
  pasos: PasoDemostracion[]; // El paso a paso de la demostración para que Mio lo traduzca
}
