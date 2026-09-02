import {
  parsearProposicion,
  recolectarVariables,
  generarFilas,
  clasificarProposicion,
  type ClasificacionProposicion,
} from '@/lib/truth-table/evaluator'

export type Dificultad = 'facil' | 'medio' | 'dificil'

export const etiquetasDificultad: Record<Dificultad, string> = {
  facil: 'Fácil',
  medio: 'Medio',
  dificil: 'Difícil',
}

export const puntosDificultad: Record<Dificultad, string> = {
  facil: '●○○',
  medio: '●●○',
  dificil: '●●●',
}

export type TipoEjercicio = 'truth-table' | 'identify' | 'law' | 'classify' | 'quiz'

export interface EjercicioBase {
  id: string
  orden: number
  tipo: TipoEjercicio
  categoria: 'IDENTIFICACIÓN' | 'TABLAS DE VERDAD' | 'CLASIFICACIÓN' | 'LEYES LÓGICAS' | 'CUESTIONARIO'
  titulo: string
  descripcionCorta: string
  nivel: Dificultad
  fuente?: string
  proposicion: string
}

export interface EjercicioIdentificar extends EjercicioBase {
  tipo: 'identify'
  opciones: string[]
  opcionCorrecta: string
  explicacion: string
}

export interface EjercicioTablaVerdad extends EjercicioBase {
  tipo: 'truth-table'
  explicacion?: string
}

export interface EjercicioLey extends EjercicioBase {
  tipo: 'law'
  opciones: string[]
  opcionCorrecta: string
  explicacion: string
}

export interface EjercicioClasificar extends EjercicioBase {
  tipo: 'classify'
  explicacion: string
}

export interface PreguntaQuiz {
  enunciado: string
  proposicion: string
  textoAsignacion: string
  asignacion: Record<string, boolean>
  explicacion: string
}

export interface EjercicioQuiz {
  id: string
  orden: number
  tipo: 'quiz'
  categoria: 'CUESTIONARIO'
  titulo: string
  descripcionCorta: string
  nivel: Dificultad
  fuente?: string
  preguntas: PreguntaQuiz[]
}

export type Ejercicio =
  | EjercicioIdentificar
  | EjercicioTablaVerdad
  | EjercicioLey
  | EjercicioQuiz
  | EjercicioClasificar

export type ClaveTema =
  | 'identificacion'
  | 'tablas-verdad'
  | 'clasificacion'
  | 'leyes-logicas'
  | 'cuestionario'

export const etiquetasTema: Record<ClaveTema, string> = {
  identificacion: 'Identificación de proposiciones',
  'tablas-verdad': 'Tablas de verdad',
  clasificacion: 'Clasificación de esquemas moleculares',
  'leyes-logicas': 'Leyes lógicas',
  cuestionario: 'Cuestionarios de evaluación',
}

export function claveTemaParaEjercicio(ex: Ejercicio): ClaveTema {
  switch (ex.tipo) {
    case 'identify':
      return 'identificacion'
    case 'truth-table':
      return 'tablas-verdad'
    case 'classify':
      return 'clasificacion'
    case 'law':
      return 'leyes-logicas'
    case 'quiz':
      return 'cuestionario'
  }
}

export function clasificacionCorrecta(proposicion: string): ClasificacionProposicion {
  return clasificarProposicion(parsearProposicion(proposicion)).clasificacion
}

export const OPCIONES_QUIZ = [
  'VERDADERO',
  'FALSO',
  'NO SE PUEDE DETERMINAR',
  'LA PROPOSICIÓN ES INVÁLIDA',
]

export function construirPreguntaQuiz(
  proposicion: string,
  asignacion: Record<string, boolean>,
  explicacionDetallada: string,
): PreguntaQuiz {
  const ast = parsearProposicion(proposicion)
  const vars = recolectarVariables(ast)
  const textoAsignacion = vars
    .map((v) => `${v.toLowerCase()} = ${asignacion[v] ? 'Verdadero' : 'Falso'}`)
    .join(', ')

  return {
    enunciado: 'Determina el valor de verdad formal de la siguiente fórmula lógica:',
    proposicion,
    textoAsignacion: `Asignación de variables: ${textoAsignacion}`,
    asignacion,
    explicacion: explicacionDetallada,
  }
}

/* ==========================================================================
   1. IDENTIFICACIÓN DE FÓRMULAS Y CONECTIVOS DOMINANTES (15 Ejercicios)
   ========================================================================== */

const ejerciciosIdentificar: EjercicioIdentificar[] = [
  {
    id: 'id-1',
    orden: 1,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 1',
    descripcionCorta: 'Identifica el operador de máxima jerarquía en: ¬(p ∧ (q ∨ ¬r))',
    nivel: 'facil',
    fuente: 'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    proposicion: '¬(p ∧ (q ∨ ¬r))',
    opciones: ['Negación', 'Conjunción', 'Disyunción', 'Condicional', 'Bicondicional'],
    opcionCorrecta: 'Negación',
    explicacion:
      'Paso 1: Se analizan los signos de agrupación internos: la subfórmula más anidada es la disyunción (q ∨ ¬r).\nPaso 2: Dicha subfórmula se vincula mediante conjunción con p, conformando el bloque (p ∧ (q ∨ ¬r)).\nPaso 3: El operador de Negación (¬) está ubicado externamente a todo el paréntesis principal.\nConclusión: El alcance de la Negación abarca la totalidad de la fórmula, siendo el conectivo dominante.',
  },
  {
    id: 'id-2',
    orden: 2,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 2',
    descripcionCorta: 'Identifica el conectivo dominante en: ((p → q) ∧ (q → r)) ∧ ¬(p → r)',
    nivel: 'medio',
    fuente: 'Patrick Suppes & Shirley Hill - Primer Curso de Lógica Matemática',
    proposicion: '((p → q) ∧ (q → r)) ∧ ¬(p → r)',
    opciones: ['Conjunción', 'Condicional', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Conjunción',
    explicacion:
      'Paso 1: El miembro izquierdo es el bloque de premisas del silogismo hipotético ((p → q) ∧ (q → r)).\nPaso 2: El miembro derecho es la conclusión negada ¬(p → r).\nPaso 3: Ambos bloques están articulados por la Conjunción (∧) central fuera de los paréntesis mayores.\nConclusión: El conectivo principal del enunciado es la Conjunción.',
  },
  {
    id: 'id-3',
    orden: 3,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 3',
    descripcionCorta: 'Identifica el operador principal en: ((p ∧ q) → r) → ((p → r) ∨ (q → r))',
    nivel: 'medio',
    fuente: 'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    proposicion: '((p ∧ q) → r) → ((p → r) ∨ (q → r))',
    opciones: ['Condicional', 'Conjunción', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'Paso 1: El miembro izquierdo es la implicación condicional ((p ∧ q) → r), que actúa íntegramente como antecedente.\nPaso 2: El miembro derecho es la disyunción ((p → r) ∨ (q → r)), que actúa como consecuente.\nPaso 3: El operador central que une ambos bloques en el nivel más externo es el Condicional (→).\nConclusión: El conectivo dominante de la proposición es el Condicional.',
  },
  {
    id: 'id-4',
    orden: 4,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 4',
    descripcionCorta: 'Identifica la estructura de: ((p ∨ ¬q) ↔ (¬p ∧ r)) ↔ (q → (r ∨ s))',
    nivel: 'dificil',
    fuente: 'Susanna S. Epp - Matemáticas Discretas con Aplicaciones',
    proposicion: '((p ∨ ¬q) ↔ (¬p ∧ r)) ↔ (q → (r ∨ s))',
    opciones: ['Bicondicional', 'Condicional', 'Disyunción', 'Conjunción', 'Negación'],
    opcionCorrecta: 'Bicondicional',
    explicacion:
      'Paso 1: La rama izquierda es una doble implicación entre dos subfórmulas: ((p ∨ ¬q) ↔ (¬p ∧ r)).\nPaso 2: La rama derecha es la implicación simple (q → (r ∨ s)).\nPaso 3: Ambas ramas están unidas en el nivel más externo por el Bicondicional (↔) central.\nConclusión: La forma lógica global corresponde a un Bicondicional.',
  },
  {
    id: 'id-5',
    orden: 5,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 5',
    descripcionCorta: 'Determina el conectivo de mayor jerarquía en: ¬(((p → q) ∧ (r → s)) → ((p ∨ r) → (q ∨ s)))',
    nivel: 'dificil',
    fuente: 'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    proposicion: '¬(((p → q) ∧ (r → s)) → ((p ∨ r) → (q ∨ s)))',
    opciones: ['Negación', 'Condicional', 'Conjunción', 'Disyunción', 'Bicondicional'],
    opcionCorrecta: 'Negación',
    explicacion:
      'Paso 1: Dentro del paréntesis mayor se encuentra la formulación completa del Dilema Constructivo: ((p → q) ∧ (r → s)) → ((p ∨ r) → (q ∨ s)).\nPaso 2: Al anteponerse el símbolo de Negación (¬) al paréntesis exterior que encierra toda la fórmula, su alcance abarca la totalidad del enunciado.\nConclusión: El operador dominante absoluto es la Negación.',
  },
  {
    id: 'id-6',
    orden: 6,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 6',
    descripcionCorta: 'Identifica el operador principal en: (((p ∨ q) ∧ ¬p) → q) ∨ ((p ∧ q) ↔ (q ∧ p))',
    nivel: 'medio',
    fuente: 'Patrick Suppes & Shirley Hill - Primer Curso de Lógica Matemática',
    proposicion: '(((p ∨ q) ∧ ¬p) → q) ∨ ((p ∧ q) ↔ (q ∧ p))',
    opciones: ['Disyunción', 'Condicional', 'Conjunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Disyunción',
    explicacion:
      'Paso 1: El término izquierdo corresponde a la implicación del Silogismo Disyuntivo (((p ∨ q) ∧ ¬p) → q).\nPaso 2: El término derecho es el bicondicional de conmutatividad ((p ∧ q) ↔ (q ∧ p)).\nPaso 3: El operador de máxima jerarquía que vincula ambos bloques independientes es la Disyunción (∨) central.\nConclusión: El conectivo dominante es la Disyunción.',
  },
  {
    id: 'id-7',
    orden: 7,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 7',
    descripcionCorta: 'Identifica la estructura del Axioma de Frege: ((p → (q → r)) ∧ (p → q)) → (p → r)',
    nivel: 'dificil',
    fuente: 'A. G. Hamilton - Lógica para Matemáticos',
    proposicion: '((p → (q → r)) ∧ (p → q)) → (p → r)',
    opciones: ['Condicional', 'Conjunción', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'Paso 1: El antecedente general es la conjunción ((p → (q → r)) ∧ (p → q)).\nPaso 2: El consecuente general es la implicación simple (p → r).\nPaso 3: El operador dominante es el Condicional (→) principal, que formaliza el principio de autodistribución del condicional en el cálculo deductivo.\nConclusión: La fórmula corresponde a un Condicional.',
  },
  {
    id: 'id-8',
    orden: 8,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 8',
    descripcionCorta: 'Determina el conectivo principal en: ¬p ∧ ((q ↔ r) → (¬s ∨ (r ∧ p)))',
    nivel: 'medio',
    fuente: 'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    proposicion: '¬p ∧ ((q ↔ r) → (¬s ∨ (r ∧ p)))',
    opciones: ['Conjunción', 'Condicional', 'Disyunción', 'Negación', 'Bicondicional'],
    opcionCorrecta: 'Conjunción',
    explicacion:
      'Paso 1: El literal izquierdo es ¬p.\nPaso 2: El bloque derecho es el condicional anidado ((q ↔ r) → (¬s ∨ (r ∧ p))).\nPaso 3: La operación principal es la Conjunción (∧), ya que articula ambos miembros en la raíz sintáctica del árbol lógico.\nConclusión: El operador dominante es la Conjunción.',
  },
  {
    id: 'id-9',
    orden: 9,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 9',
    descripcionCorta: 'Identifica la forma lógica de: (p ↔ (q ∧ ¬r)) → (¬(p ∨ q) ∧ (r → ¬s))',
    nivel: 'dificil',
    fuente: 'Susanna S. Epp - Matemáticas Discretas con Aplicaciones',
    proposicion: '(p ↔ (q ∧ ¬r)) → (¬(p ∨ q) ∧ (r → ¬s))',
    opciones: ['Condicional', 'Bicondicional', 'Conjunción', 'Disyunción', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'Paso 1: El antecedente es la proposición bicondicional (p ↔ (q ∧ ¬r)).\nPaso 2: El consecuente es la conjunción de subfórmulas (¬(p ∨ q) ∧ (r → ¬s)).\nPaso 3: El conectivo de mayor alcance que gobierna la estructura global es el Condicional (→).\nConclusión: La fórmula corresponde a un Condicional.',
  },
  {
    id: 'id-10',
    orden: 10,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 10',
    descripcionCorta: 'Identifica el conectivo principal en: ¬(p → (q → (r → (p ∧ q ∧ r))))',
    nivel: 'dificil',
    fuente: 'Seymour Lipschutz - Teoría de Conjuntos y Álgebra de Proposiciones',
    proposicion: '¬(p → (q → (r → (p ∧ q ∧ r))))',
    opciones: ['Negación', 'Condicional', 'Conjunción', 'Disyunción', 'Bicondicional'],
    opcionCorrecta: 'Negación',
    explicacion:
      'Paso 1: La cadena de implicaciones anidadas p → (q → (r → (p ∧ q ∧ r))) está agrupada por completo bajo el signo de negación exterior.\nPaso 2: Al no haber conectivos binarios fuera del paréntesis exterior, la Negación (¬) es el operador dominante del enunciado.\nConclusión: El conectivo dominante absoluto es la Negación.',
  },
  {
    id: 'id-11',
    orden: 11,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 11',
    descripcionCorta: 'Estructura de la Regla de Resolución en 4 variables: ((p ∨ q) ∧ (¬p ∨ r) ∧ (¬q ∨ s)) → (r ∨ s)',
    nivel: 'dificil',
    fuente: 'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    proposicion: '((p ∨ q) ∧ (¬p ∨ r) ∧ (¬q ∨ s)) → (r ∨ s)',
    opciones: ['Condicional', 'Conjunción', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'Paso 1: El antecedente está compuesto por la conjunción de tres cláusulas disyuntivas: (p ∨ q) ∧ (¬p ∨ r) ∧ (¬q ∨ s).\nPaso 2: El consecuente es la cláusula resolvente (r ∨ s).\nPaso 3: El operador principal es el Condicional (→), el cual rige la validez de la deducción proposicional.\nConclusión: La proposición es un Condicional.',
  },
  {
    id: 'id-12',
    orden: 12,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 12',
    descripcionCorta: 'Identifica el operador principal en: ¬((p ∧ ¬q) ∨ (q ∧ ¬r) ∨ (r ∧ ¬p))',
    nivel: 'medio',
    fuente: 'Manuel Garrido - Lógica Simbólica',
    proposicion: '¬((p ∧ ¬q) ∨ (q ∧ ¬r) ∨ (r ∧ ¬p))',
    opciones: ['Negación', 'Disyunción', 'Conjunción', 'Condicional', 'Bicondicional'],
    opcionCorrecta: 'Negación',
    explicacion:
      'Paso 1: La expresión interna es una disyunción ternaria de pares conjuntivos: (p ∧ ¬q) ∨ (q ∧ ¬r) ∨ (r ∧ ¬p).\nPaso 2: El operador de Negación (¬) precede al paréntesis que contiene a toda la disyunción, constituyendo la raíz del árbol de análisis sintáctico.\nConclusión: El operador principal es la Negación.',
  },
  {
    id: 'id-13',
    orden: 13,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 13',
    descripcionCorta: 'Identifica la estructura de la Ley de Exportación Disyuntiva: (p → (q ∨ r)) ↔ ((p ∧ ¬q) → r)',
    nivel: 'medio',
    fuente: 'Patrick Suppes & Shirley Hill - Primer Curso de Lógica Matemática',
    proposicion: '(p → (q ∨ r)) ↔ ((p ∧ ¬q) → r)',
    opciones: ['Bicondicional', 'Condicional', 'Disyunción', 'Conjunción', 'Negación'],
    opcionCorrecta: 'Bicondicional',
    explicacion:
      'Paso 1: El lado izquierdo contiene la implicación con disyunción (p → (q ∨ r)).\nPaso 2: El lado derecho contiene la implicación condicional con conjunción ((p ∧ ¬q) → r).\nPaso 3: El operador principal es el Bicondicional (↔), que establece la equivalencia lógica estricta entre ambas formas.\nConclusión: La forma estructural dominante es el Bicondicional.',
  },
  {
    id: 'id-14',
    orden: 14,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 14',
    descripcionCorta: 'Identifica la estructura de: ((p → q) ∧ (r → ¬q) ∧ (¬r → s)) → (p → s)',
    nivel: 'dificil',
    fuente: 'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    proposicion: '((p → q) ∧ (r → ¬q) ∧ (¬r → s)) → (p → s)',
    opciones: ['Condicional', 'Conjunción', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'Paso 1: El antecedente agrupa tres premisas implicativas encadenadas mediante conjunción: ((p → q) ∧ (r → ¬q) ∧ (¬r → s)).\nPaso 2: El consecuente es la conclusión (p → s).\nPaso 3: El conectivo principal que vincula premisas y conclusión es el Condicional (→).\nConclusión: La fórmula es un Condicional.',
  },
  {
    id: 'id-15',
    orden: 15,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio 15',
    descripcionCorta: 'Identifica el operador principal en: ¬(¬(p ∨ ¬q) ∨ ¬(q ∧ ¬(r ∨ ¬p)))',
    nivel: 'dificil',
    fuente: 'Susanna S. Epp - Matemáticas Discretas con Aplicaciones',
    proposicion: '¬(¬(p ∨ ¬q) ∨ ¬(q ∧ ¬(r ∨ ¬p)))',
    opciones: ['Negación', 'Disyunción', 'Conjunción', 'Condicional', 'Bicondicional'],
    opcionCorrecta: 'Negación',
    explicacion:
      'Paso 1: Dentro de la expresión existe una disyunción de subfórmulas profundamente negadas y anidadas.\nPaso 2: La Negación (¬) situada en el extremo izquierdo abarca todo el bloque encerrado en el paréntesis exterior, convirtiéndola en el operador dominante.\nConclusión: El operador principal absoluto es la Negación.',
  },
]

/* ==========================================================================
   2. TABLAS DE VERDAD INTERACTIVAS Y RIGUROSAS (15 Ejercicios)
   ========================================================================== */

const ejerciciosTablaVerdad: EjercicioTablaVerdad[] = [
  {
    id: 'tt-1',
    orden: 16,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 16',
    descripcionCorta: 'Construye y resuelve la tabla de verdad para la Implicación Material: (p → q) ↔ (¬p ∨ q)',
    nivel: 'medio',
    fuente: 'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    proposicion: '(p → q) ↔ (¬p ∨ q)',
    explicacion:
      'Paso 1: Evaluación de (p → q): Da Falso únicamente cuando p=V y q=F; vector canónico (VV, VF, FV, FF) = [V, F, V, V].\nPaso 2: Evaluación de (¬p ∨ q): ¬p es [F, F, V, V], y al operar la disyunción con q [V, F, V, F] resulta en [V, F, V, V].\nPaso 3: Evaluación del Bicondicional (↔): Comparando ambas columnas idénticas fila a fila, el bicondicional arroja [V, V, V, V].\nConclusión: El esquema molecular evalúa a Verdadero en todas las filas (Tautología absoluta).',
  },
  {
    id: 'tt-2',
    orden: 17,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 17',
    descripcionCorta: 'Resuelve la tabla de verdad de la Ley de De Morgan: ¬(p ∧ q) ↔ (¬p ∨ ¬q)',
    nivel: 'medio',
    fuente: 'Seymour Lipschutz - Teoría de Conjuntos y Álgebra de Proposiciones',
    proposicion: '¬(p ∧ q) ↔ (¬p ∨ ¬q)',
    explicacion:
      'Paso 1: La conjunción (p ∧ q) es verdadera solo en (V, V), produciendo [V, F, F, F]; su negación ¬(p ∧ q) produce [F, V, V, V].\nPaso 2: Los literales negados son ¬p [F, F, V, V] y ¬q [F, V, F, V]; su disyunción (¬p ∨ ¬q) genera [F, V, V, V].\nPaso 3: Al evaluar el bicondicional miembro a miembro, en las 4 filas los valores coinciden exactamente.\nConclusión: La matriz principal arroja [V, V, V, V] (Tautología de De Morgan).',
  },
  {
    id: 'tt-3',
    orden: 18,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 18',
    descripcionCorta: 'Completa la tabla de verdad para el Silogismo Disyuntivo: ((p ∨ q) ∧ ¬p) → q',
    nivel: 'medio',
    fuente: 'Patrick Suppes & Shirley Hill - Primer Curso de Lógica Matemática',
    proposicion: '((p ∨ q) ∧ ¬p) → q',
    explicacion:
      'Paso 1: Disyunción (p ∨ q) genera [V, V, V, F].\nPaso 2: Conjunción con ¬p [F, F, V, V] resulta en el antecedente ((p ∨ q) ∧ ¬p) = [F, F, V, F].\nPaso 3: Implicación con el consecuente q [V, F, V, F] fila a fila:\n- Fila 1 (p=V, q=V): F → V = V\n- Fila 2 (p=V, q=F): F → F = V\n- Fila 3 (p=F, q=V): V → V = V\n- Fila 4 (p=F, q=F): F → F = V\nConclusión: La fórmula es una Tautología fundamental.',
  },
  {
    id: 'tt-4',
    orden: 19,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 19',
    descripcionCorta: 'Completa la tabla para la Ley de Contraposición: (p → q) ↔ (¬q → ¬p)',
    nivel: 'medio',
    fuente: 'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    proposicion: '(p → q) ↔ (¬q → ¬p)',
    explicacion:
      'Paso 1: La implicación directa (p → q) produce el vector canónico [V, F, V, V].\nPaso 2: La implicación contrapositiva (¬q → ¬p) arroja F solo cuando ¬q=V y ¬p=F (es decir, q=F y p=V), dando [V, F, V, V].\nPaso 3: La equivalencia bicondicional compara dos vectores idénticos fila a fila, dando [V, V, V, V].\nConclusión: La contrapositiva es estrictamente equivalente al condicional directo.',
  },
  {
    id: 'tt-5',
    orden: 20,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 20',
    descripcionCorta: 'Tabla de verdad de la definición del Bicondicional: (p ↔ q) ↔ ((p → q) ∧ (q → p))',
    nivel: 'medio',
    fuente: 'Patrick Suppes & Shirley Hill - Primer Curso de Lógica Matemática',
    proposicion: '(p ↔ q) ↔ ((p → q) ∧ (q → p))',
    explicacion:
      'Paso 1: El bicondicional (p ↔ q) es verdadero en filas 1 y 4: [V, F, F, V].\nPaso 2: (p → q) genera [V, F, V, V] y (q → p) genera [V, V, F, V]; su conjunción simultánea ((p → q) ∧ (q → p)) genera [V, F, F, V].\nPaso 3: Comparando ambos lados con el bicondicional principal se obtiene [V, V, V, V].\nConclusión: Se valida la definición conjuntiva del bicondicional como una Tautología.',
  },
  {
    id: 'tt-6',
    orden: 21,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 21',
    descripcionCorta: 'Tabla de verdad (8 filas) para el Silogismo Hipotético: ((p → q) ∧ (q → r)) → (p → r)',
    nivel: 'dificil',
    fuente: 'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    proposicion: '((p → q) ∧ (q → r)) → (p → r)',
    explicacion:
      'Paso 1: Se calculan (p → q) y (q → r) para las 8 combinaciones canónicas de (p, q, r).\nPaso 2: Su conjunción representa la transitividad de las premisas en el antecedente.\nPaso 3: Cada vez que el antecedente ((p → q) ∧ (q → r)) es Verdadero, necesariamente la conclusión (p → r) también es Verdadera.\nConclusión: Todas las 8 filas evalúan a Verdadero [V, V, V, V, V, V, V, V] (Silogismo Hipotético).',
  },
  {
    id: 'tt-7',
    orden: 22,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 22',
    descripcionCorta: 'Tabla de verdad (8 filas) para el Dilema Simple: ((p ∨ q) ∧ (p → r) ∧ (q → r)) → r',
    nivel: 'dificil',
    fuente: 'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    proposicion: '((p ∨ q) ∧ (p → r) ∧ (q → r)) → r',
    explicacion:
      'Paso 1: Premisa 1: (p ∨ q) asegura que al menos una de las proposiciones p o q es verdadera.\nPaso 2: Premisas 2 y 3: Si p implica r y q también implica r, entonces cualquiera que sea verdadera garantizará r=V.\nPaso 3: En la tabla de 8 filas, para cualquier combinación donde el antecedente sea Verdadero, r es Verdadero.\nConclusión: La fórmula resulta en [V, V, V, V, V, V, V, V] (Dilema Simple).',
  },
  {
    id: 'tt-8',
    orden: 23,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 23',
    descripcionCorta: 'Tabla de verdad (8 filas) de la Ley Distributiva: (p ∧ (q ∨ r)) ↔ ((p ∧ q) ∨ (p ∧ r))',
    nivel: 'dificil',
    fuente: 'Seymour Lipschutz - Teoría de Conjuntos y Álgebra de Proposiciones',
    proposicion: '(p ∧ (q ∨ r)) ↔ ((p ∧ q) ∨ (p ∧ r))',
    explicacion:
      'Paso 1: Columna izquierda: se evalúa la disyunción (q ∨ r) y se hace conjunción con p, dando Verdadero en las filas (V,V,V), (V,V,F) y (V,F,V).\nPaso 2: Columna derecha: se evalúan (p ∧ q) y (p ∧ r), y se toma su disyunción, arrojando exactamente los mismos valores de verdad.\nPaso 3: El bicondicional final compara ambas columnas idénticas fila a fila.\nConclusión: El bicondicional final evalúa a Verdadero en las 8 filas [V, V, V, V, V, V, V, V].',
  },
  {
    id: 'tt-9',
    orden: 24,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 24',
    descripcionCorta: 'Tabla de verdad (8 filas) de la Ley de Exportación: (p → (q → r)) ↔ ((p ∧ q) → r)',
    nivel: 'dificil',
    fuente: 'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    proposicion: '(p → (q → r)) ↔ ((p ∧ q) → r)',
    explicacion:
      'Paso 1: (p → (q → r)) es Falso únicamente cuando p=V y (q → r)=F, lo que equivale a p=V, q=V y r=F (Fila 2).\nPaso 2: ((p ∧ q) → r) es Falso únicamente cuando el antecedente (p ∧ q) es Verdadero y el consecuente r es Falso, lo que ocurre exactamente en p=V, q=V, r=F.\nPaso 3: Al coincidir en todas las asignaciones posibles, el bicondicional compara valores idénticos.\nConclusión: La matriz principal resulta en [V, V, V, V, V, V, V, V] (Ley de Exportación).',
  },
  {
    id: 'tt-10',
    orden: 25,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 25',
    descripcionCorta: 'Tabla de verdad (8 filas) de Conjunción de Implicaciones: ((p → r) ∧ (q → r)) ↔ ((p ∨ q) → r)',
    nivel: 'dificil',
    fuente: 'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    proposicion: '((p → r) ∧ (q → r)) ↔ ((p ∨ q) → r)',
    explicacion:
      'Paso 1: Por álgebra proposicional: ((p → r) ∧ (q → r)) ≡ (¬p ∨ r) ∧ (¬q ∨ r) ≡ (¬p ∧ ¬q) ∨ r ≡ ¬(p ∨ q) ∨ r ≡ (p ∨ q) → r.\nPaso 2: En la tabla de 8 combinaciones, ambas subexpresiones son idénticamente Falsas en aquellas filas donde r=F y al menos una entre p o q es V, y Verdaderas en el resto.\nPaso 3: El bicondicional compara ambas columnas equivalentes fila a fila.\nConclusión: La matriz principal arroja 8 valores Verdaderos [V, V, V, V, V, V, V, V].',
  },
  {
    id: 'tt-11',
    orden: 26,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 26',
    descripcionCorta: 'Tabla de verdad para la Reducción de Casos: ((p → q) ∧ (¬p → q)) ↔ q',
    nivel: 'medio',
    fuente: 'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    proposicion: '((p → q) ∧ (¬p → q)) ↔ q',
    explicacion:
      'Paso 1: (p → q) ∧ (¬p → q) equivale por implicación material a (¬p ∨ q) ∧ (p ∨ q).\nPaso 2: Aplicando distributividad respecto a q: (¬p ∧ p) ∨ q ≡ F ∨ q ≡ q.\nPaso 3: La tabla de 4 filas valida que la columna compuesta coincide exactamente con los valores de verdad de q.\nConclusión: El bicondicional principal arroja [V, V, V, V] (Tautología).',
  },
  {
    id: 'tt-12',
    orden: 27,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 27',
    descripcionCorta: 'Tabla de verdad (8 filas) para la Regla de Resolución: ((p ∨ q) ∧ (¬p ∨ r)) → (q ∨ r)',
    nivel: 'dificil',
    fuente: 'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    proposicion: '((p ∨ q) ∧ (¬p ∨ r)) → (q ∨ r)',
    explicacion:
      'Paso 1: Principio de resolución: La variable p debe ser o bien Verdadera o Falsa; si p=V, entonces ¬p=F, obligando a que r=V para que la segunda cláusula sea V; si p=F, entonces q=V para que la primera sea V.\nPaso 2: En cualquiera de los dos casos, la cláusula resolvente (q ∨ r) resulta forzosamente Verdadera.\nPaso 3: Toda fila con antecedente Verdadero produce consecuente Verdadero.\nConclusión: La tabla de verdad arroja [V, V, V, V, V, V, V, V] (Resolución Proposicional).',
  },
  {
    id: 'tt-13',
    orden: 28,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 28',
    descripcionCorta: 'Tabla de verdad de Equivalencia Bicondicional Negada: (p ↔ q) ↔ (¬p ↔ ¬q)',
    nivel: 'medio',
    fuente: 'Susanna S. Epp - Matemáticas Discretas con Aplicaciones',
    proposicion: '(p ↔ q) ↔ (¬p ↔ ¬q)',
    explicacion:
      'Paso 1: (p ↔ q) es V en (V,V) y (F,F), y F en (V,F) y (F,V): vector [V, F, F, V].\nPaso 2: En (¬p ↔ ¬q), cuando (p,q)=(V,V), (¬p,¬q)=(F,F) dando V; cuando (p,q)=(V,F), (¬p,¬q)=(F,V) dando F.\nPaso 3: La columna de (¬p ↔ ¬q) es idéntica [V, F, F, V].\nConclusión: El bicondicional final evalúa a [V, V, V, V] (Tautología).',
  },
  {
    id: 'tt-14',
    orden: 29,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 29',
    descripcionCorta: 'Tabla de verdad (8 filas) de la Distributividad de la Disyunción: (p ∨ (q ∧ r)) ↔ ((p ∨ q) ∧ (p ∨ r))',
    nivel: 'dificil',
    fuente: 'Seymour Lipschutz - Teoría de Conjuntos y Álgebra de Proposiciones',
    proposicion: '(p ∨ (q ∧ r)) ↔ ((p ∨ q) ∧ (p ∨ r))',
    explicacion:
      'Paso 1: Miembro izquierdo: (p ∨ (q ∧ r)) es V si p=V (4 primeras filas) o si q=V y r=V (fila 7).\nPaso 2: Miembro derecho: ((p ∨ q) ∧ (p ∨ r)) es Falso si y solo si p=F y al menos una de q o r es F, es decir, filas 5, 6 y 8.\nPaso 3: Las 8 filas de ambos miembros coinciden plenamente.\nConclusión: La matriz principal arroja [V, V, V, V, V, V, V, V] (Distributividad Disyuntiva).',
  },
  {
    id: 'tt-15',
    orden: 30,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio 30',
    descripcionCorta: 'Tabla de verdad para la Inferencia Modus Tollens: ((p → q) ∧ ¬q) → ¬p',
    nivel: 'medio',
    fuente: 'Patrick Suppes & Shirley Hill - Primer Curso de Lógica Matemática',
    proposicion: '((p → q) ∧ ¬q) → ¬p',
    explicacion:
      'Paso 1: (p → q) da [V, F, V, V]; ¬q da [F, V, F, V].\nPaso 2: Conjunción del antecedente: ((p → q) ∧ ¬q) da [F, F, F, V] (solo es V en p=F, q=F).\nPaso 3: En dicha fila 4, ¬p es Verdadero (¬F = V), por lo que V → V es Verdadero; en las demás filas el antecedente es F, haciendo que el condicional sea Verdadero por vacuidad.\nConclusión: La matriz principal resulta en [V, V, V, V] (Modus Tollens).',
  },
]

/* ==========================================================================
   3. CLASIFICACIÓN SEMÁNTICA DE ESQUEMAS MOLECULARES (20 Ejercicios)
   ========================================================================== */

function construirEjercicioClasificar(
  id: string,
  orden: number,
  proposicion: string,
  nivel: Dificultad,
  descripcionCorta: string,
  fuente: string,
  explicacion: string,
): EjercicioClasificar {
  return {
    id,
    orden,
    tipo: 'classify',
    categoria: 'CLASIFICACIÓN',
    titulo: `Ejercicio ${orden}`,
    descripcionCorta,
    nivel,
    fuente,
    proposicion,
    explicacion,
  }
}

const ejerciciosClasificar: EjercicioClasificar[] = [
  construirEjercicioClasificar(
    'clas-1',
    31,
    '(p → q) ∨ (q → p)',
    'medio',
    'Clasifica la fórmula de implicaciones simétricas: (p → q) ∨ (q → p)',
    'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    'Paso 1: Por definición de implicación material, (p → q) ≡ (¬p ∨ q) y (q → p) ≡ (¬q ∨ p).\nPaso 2: La disyunción total resulta en (¬p ∨ q) ∨ (¬q ∨ p).\nPaso 3: Reagrupando términos por conmutatividad y asociatividad: (p ∨ ¬p) ∨ (q ∨ ¬q).\nPaso 4: Por la Ley del Tercero Excluido, cada término evalúa a Verdadero: V ∨ V ≡ V.\nConclusión: El esquema molecular evalúa a Verdadero en todas las interpretaciones posibles, por lo que es una Tautología.',
  ),
  construirEjercicioClasificar(
    'clas-2',
    32,
    '(p ∧ ¬p) ∧ (q ∨ r)',
    'facil',
    'Clasifica la conjunción con término contradictorio: (p ∧ ¬p) ∧ (q ∨ r)',
    'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    'Paso 1: Se analiza el primer factor conjuntivo (p ∧ ¬p).\nPaso 2: Por el Principio de No Contradicción, (p ∧ ¬p) evalúa a Falso en cualquier asignación de verdad.\nPaso 3: Sustituyendo en la fórmula global: F ∧ (q ∨ r).\nPaso 4: Por la propiedad absorbente de la conjunción respecto al Falso: F ∧ X ≡ F.\nConclusión: La matriz principal contiene únicamente valores Falsos en todas las filas, por lo que es una Contradicción.',
  ),
  construirEjercicioClasificar(
    'clas-3',
    33,
    '(p ∨ q) → (p ∧ q)',
    'medio',
    'Clasifica el condicional de disyunción a conjunción: (p ∨ q) → (p ∧ q)',
    'Patrick Suppes & Shirley Hill - Primer Curso de Lógica Matemática',
    'Paso 1: Evaluación bajo la interpretación p=V y q=V: (V ∨ V) → (V ∧ V) ≡ V → V ≡ V.\nPaso 2: Evaluación bajo la interpretación p=V y q=F: (V ∨ F) → (V ∧ F) ≡ V → F ≡ F.\nPaso 3: La matriz principal arroja el vector de valores [V, F, F, V].\nConclusión: Al contener al menos un valor Verdadero y al menos un valor Falso, el esquema molecular es una Contingencia.',
  ),
  construirEjercicioClasificar(
    'clas-4',
    34,
    '((p → q) ∧ p) → q',
    'medio',
    'Clasifica la regla deductiva Modus Ponens: ((p → q) ∧ p) → q',
    'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    'Paso 1: Se transforma la implicación del antecedente: ((¬p ∨ q) ∧ p).\nPaso 2: Aplicando distributividad: (¬p ∧ p) ∨ (q ∧ p) ≡ F ∨ (p ∧ q) ≡ (p ∧ q).\nPaso 3: Evaluando el condicional completo: (p ∧ q) → q ≡ ¬(p ∧ q) ∨ q ≡ ¬p ∨ ¬q ∨ q ≡ ¬p ∨ V ≡ V.\nConclusión: El esquema molecular evalúa a Verdadero bajo toda asignación, formalizando el Modus Ponens como una Tautología.',
  ),
  construirEjercicioClasificar(
    'clas-5',
    35,
    '(p ↔ q) ∧ (p ↔ ¬q)',
    'medio',
    'Clasifica la conjunción de bicondicionales opuestos: (p ↔ q) ∧ (p ↔ ¬q)',
    'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    'Paso 1: Para que el primer miembro (p ↔ q) sea Verdadero, p y q deben coincidir en valor de verdad.\nPaso 2: Para que el segundo miembro (p ↔ ¬q) sea Verdadero, p y q deben tener valores de verdad opuestos.\nPaso 3: No existe ninguna valuación booleana simultánea donde p tenga el mismo valor y a la vez el valor opuesto que q.\nConclusión: La conjunción de ambas condiciones es siempre Falsa en todas las combinaciones de la tabla, siendo una Contradicción.',
  ),
  construirEjercicioClasificar(
    'clas-6',
    36,
    '(p → q) ∧ (q → r) ∧ (p ∧ ¬r)',
    'dificil',
    'Clasifica el conjunto de premisas con negación de conclusión: (p → q) ∧ (q → r) ∧ (p ∧ ¬r)',
    'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    'Paso 1: Las dos primeras premisas conjuntivas ((p → q) ∧ (q → r)) implican lógicamente por transitividad a (p → r).\nPaso 2: La tercera premisa es (p ∧ ¬r), la cual es la negación lógica exacta de (p → r), ya que ¬(p → r) ≡ (p ∧ ¬r).\nPaso 3: La fórmula total tiene la estructura general A ∧ ¬A.\nConclusión: Por el Principio de No Contradicción, A ∧ ¬A es idénticamente Falsa en todas las filas, siendo una Contradicción.',
  ),
  construirEjercicioClasificar(
    'clas-7',
    37,
    '((p ∧ q) → r) ↔ (p → (q → r))',
    'dificil',
    'Clasifica el teorema de la Ley de Exportación: ((p ∧ q) → r) ↔ (p → (q → r))',
    'Seymour Lipschutz - Teoría de Conjuntos y Álgebra de Proposiciones',
    'Paso 1: Desarrollando el miembro izquierdo: ((p ∧ q) → r) ≡ ¬(p ∧ q) ∨ r ≡ ¬p ∨ ¬q ∨ r.\nPaso 2: Desarrollando el miembro derecho: (p → (q → r)) ≡ ¬p ∨ (¬q ∨ r) ≡ ¬p ∨ ¬q ∨ r.\nPaso 3: Ambos miembros son formalmente idénticos bajo cualquier asignación de verdad.\nConclusión: El bicondicional de dos fórmulas lógicamente equivalentes evalúa siempre a Verdadero, demostrando que la Ley de Exportación es una Tautología.',
  ),
  construirEjercicioClasificar(
    'clas-8',
    38,
    '((p → q) → p) → p',
    'dificil',
    'Clasifica la célebre Ley de Peirce: ((p → q) → p) → p',
    'Manuel Garrido - Lógica Simbólica',
    'Paso 1: Caso p=V: El consecuente final es V, por lo que todo el condicional X → V evalúa directamente a Verdadero.\nPaso 2: Caso p=F: El antecedente interno (p → q) tiene antecedente F, por lo que (F → q) = V.\nPaso 3: Luego, el antecedente global ((p → q) → p) evalúa a (V → F) = F.\nPaso 4: Finalmente, la implicación total es F → F, la cual evalúa a Verdadero.\nConclusión: En todas las asignaciones posibles la fórmula evalúa a Verdadero, demostrando que la Ley de Peirce es una Tautología.',
  ),
  construirEjercicioClasificar(
    'clas-9',
    39,
    '(p ∨ q) ∧ ¬(p ∨ (q ∧ r))',
    'dificil',
    'Clasifica la fórmula proposicional compuesta: (p ∨ q) ∧ ¬(p ∨ (q ∧ r))',
    'A. G. Hamilton - Lógica para Matemáticos',
    'Paso 1: Valuación 1 (p=F, q=V, r=F): (F ∨ V) ∧ ¬(F ∨ (V ∧ F)) = V ∧ ¬(F) = V ∧ V = V.\nPaso 2: Valuación 2 (p=V, q=V, r=V): (V ∨ V) ∧ ¬(V ∨ (V ∧ V)) = V ∧ ¬(V) = V ∧ F = F.\nPaso 3: La fórmula resulta Verdadera en ciertas interpretaciones y Falsa en otras.\nConclusión: Dado que la matriz principal contiene tanto valores V como F, el esquema molecular es una Contingencia.',
  ),
  construirEjercicioClasificar(
    'clas-10',
    40,
    '((p → q) ∧ (r → s) ∧ (p ∨ r)) → (q ∨ s)',
    'dificil',
    'Clasifica el Teorema del Dilema Constructivo: ((p → q) ∧ (r → s) ∧ (p ∨ r)) → (q ∨ s)',
    'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    'Paso 1: Si el antecedente es Verdadero, se cumple la disyunción (p ∨ r), lo que exige que p=V o r=V.\nPaso 2: Si p=V, de la premisa (p → q) se deduce necesariamente que q=V, satisfaciendo (q ∨ s)=V.\nPaso 3: Si r=V, de la premisa (r → s) se deduce necesariamente que s=V, satisfaciendo (q ∨ s)=V.\nPaso 4: En cualquier caso posible donde las premisas sean V, el consecuente resulta invariablemente V.\nConclusión: No existe ninguna combinación que haga el condicional Falso, confirmando que el Dilema Constructivo es una Tautología.',
  ),
  construirEjercicioClasificar(
    'clas-11',
    41,
    '(p ↔ ¬p) ∧ (q ↔ ¬q)',
    'facil',
    'Clasifica la conjunción de autorrefutaciones: (p ↔ ¬p) ∧ (q ↔ ¬q)',
    'A. G. Hamilton - Lógica para Matemáticos',
    'Paso 1: Ninguna variable proposicional puede tener el mismo valor de verdad que su negación: (p ↔ ¬p) = F.\nPaso 2: Del mismo modo, para la variable q se tiene: (q ↔ ¬q) = F.\nPaso 3: Operando la conjunción entre ambas expresiones: F ∧ F = F.\nConclusión: La matriz principal arroja únicamente Falso en todas las filas de la tabla de verdad, por lo que es una Contradicción.',
  ),
  construirEjercicioClasificar(
    'clas-12',
    42,
    '(p ∧ (q ∨ ¬r)) → (r ∧ ¬q)',
    'medio',
    'Clasifica el condicional con variables mixtas: (p ∧ (q ∨ ¬r)) → (r ∧ ¬q)',
    'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    'Paso 1: Valuación 1 (p=F, q=F, r=F): Antecedente F ∧ ... = F, por lo que F → X evalúa a Verdadero (V).\nPaso 2: Valuación 2 (p=V, q=V, r=V): Antecedente V ∧ (V ∨ F) = V; consecuente V ∧ F = F; luego V → F = Falso (F).\nPaso 3: La tabla de verdad presenta resultados mixtos según la asignación de variables.\nConclusión: Al no ser universalmente válida ni idénticamente nula, la fórmula es una Contingencia.',
  ),
  construirEjercicioClasificar(
    'clas-13',
    43,
    '(¬p → p) ↔ p',
    'medio',
    'Clasifica la regla de Reducción Clásica (Consequentia Mirabilis): (¬p → p) ↔ p',
    'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    'Paso 1: Transformación del miembro izquierdo por definición de implicación: (¬p → p) ≡ ¬(¬p) ∨ p.\nPaso 2: Por doble negación e idempotencia: p ∨ p ≡ p.\nPaso 3: Sustituyendo en la fórmula total: p ↔ p.\nPaso 4: Por la propiedad reflexiva del bicondicional: p ↔ p ≡ V.\nConclusión: La fórmula evalúa a Verdadero en todas las interpretaciones (Consequentia Mirabilis), siendo una Tautología.',
  ),
  construirEjercicioClasificar(
    'clas-14',
    44,
    '(p → (q ∧ ¬q)) ↔ ¬p',
    'medio',
    'Clasifica la justificación lógica de la Reducción al Absurdo: (p → (q ∧ ¬q)) ↔ ¬p',
    'Susanna S. Epp - Matemáticas Discretas con Aplicaciones',
    'Paso 1: El consecuente interno (q ∧ ¬q) es una contradicción estricta, por lo que equivale a F.\nPaso 2: La implicación izquierda se simplifica a: (p → F) ≡ ¬p ∨ F ≡ ¬p.\nPaso 3: El bicondicional completo queda reducido a: ¬p ↔ ¬p.\nPaso 4: Toda proposición es lógicamente equivalente a sí misma, arrojando Verdadero bajo cualquier asignación.\nConclusión: La fórmula que fundamenta el método de Reducción al Absurdo es una Tautología.',
  ),
  construirEjercicioClasificar(
    'clas-15',
    45,
    '(p ∨ q) ↔ (p ∨ (¬p ∧ q))',
    'medio',
    'Clasifica la Ley de Absorción Fuerte: (p ∨ q) ↔ (p ∨ (¬p ∧ q))',
    'Patrick Suppes & Shirley Hill - Primer Curso de Lógica Matemática',
    'Paso 1: Se aplica la ley distributiva en el miembro derecho: p ∨ (¬p ∧ q) ≡ (p ∨ ¬p) ∧ (p ∨ q).\nPaso 2: Por el Principio del Tercero Excluido: (p ∨ ¬p) ≡ V.\nPaso 3: Por la propiedad del elemento neutro de la conjunción: V ∧ (p ∨ q) ≡ (p ∨ q).\nPaso 4: El bicondicional final queda expresado como: (p ∨ q) ↔ (p ∨ q) ≡ V.\nConclusión: Ambos lados son idénticos para toda valuación de verdad, demostrando que la Ley de Absorción Fuerte es una Tautología.',
  ),
  construirEjercicioClasificar(
    'clas-16',
    46,
    '(p ∧ ¬q) ↔ (¬p ∨ q)',
    'medio',
    'Clasifica la equivalencia entre conjunción y su negación: (p ∧ ¬q) ↔ (¬p ∨ q)',
    'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    'Paso 1: Por leyes de De Morgan, la negación de (p ∧ ¬q) es: ¬(p ∧ ¬q) ≡ ¬p ∨ ¬(¬q) ≡ ¬p ∨ q.\nPaso 2: La fórmula compara una expresión con su negación exacta mediante un bicondicional: A ↔ ¬A.\nPaso 3: Un bicondicional entre una fórmula y su negación siempre evalúa a Falso, ya que sus valores de verdad son estrictamente opuestos.\nConclusión: La matriz principal contiene exclusivamente valores Falsos, por lo que el esquema molecular es una Contradicción.',
  ),
  construirEjercicioClasificar(
    'clas-17',
    47,
    '(p ↔ q) ↔ (¬p ↔ q)',
    'medio',
    'Clasifica la relación entre bicondicional directo y su negación: (p ↔ q) ↔ (¬p ↔ q)',
    'Seymour Lipschutz - Teoría de Conjuntos y Álgebra de Proposiciones',
    'Paso 1: El miembro izquierdo es el bicondicional directo (p ↔ q).\nPaso 2: El miembro derecho (¬p ↔ q) es la negación exacta del bicondicional directo: ¬(p ↔ q).\nPaso 3: La fórmula tiene la estructura formal: (p ↔ q) ↔ ¬(p ↔ q).\nPaso 4: Dado que una proposición nunca puede ser equivalente a su propia negación, el resultado es universalmente Falso.\nConclusión: Todas las filas de la tabla de verdad resultan en Falso, confirmando que es una Contradicción.',
  ),
  construirEjercicioClasificar(
    'clas-18',
    48,
    '((p → q) ∧ (q → ¬p)) → ¬p',
    'dificil',
    'Clasifica el principio de inferencia de refutación: ((p → q) ∧ (q → ¬p)) → ¬p',
    'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    'Paso 1: Por transitividad del condicional, las premisas ((p → q) ∧ (q → ¬p)) implican válidamente a (p → ¬p).\nPaso 2: Por definición de condicional, (p → ¬p) ≡ ¬p ∨ ¬p ≡ ¬p.\nPaso 3: Dado que el antecedente exige lógicamente que ¬p sea verdadero, la implicación hacia el consecuente ¬p es siempre válida: ¬p → ¬p ≡ V.\nConclusión: La fórmula evalúa a Verdadero bajo toda asignación de verdad, constituyendo una Tautología.',
  ),
  construirEjercicioClasificar(
    'clas-19',
    49,
    '(p ∨ (q ∧ ¬r)) ∧ ¬(p ∨ q)',
    'dificil',
    'Clasifica la conjunción con negación de disyunción: (p ∨ (q ∧ ¬r)) ∧ ¬(p ∨ q)',
    'Susanna S. Epp - Matemáticas Discretas con Aplicaciones',
    'Paso 1: Aplicando la Ley de De Morgan en el segundo factor: ¬(p ∨ q) ≡ (¬p ∧ ¬q).\nPaso 2: Sustituyendo en la expresión total: (p ∨ (q ∧ ¬r)) ∧ (¬p ∧ ¬q).\nPaso 3: Aplicando distributividad: (p ∧ ¬p ∧ ¬q) ∨ (q ∧ ¬r ∧ ¬p ∧ ¬q).\nPaso 4: En el primer término (p ∧ ¬p) = F; en el segundo término (q ∧ ¬q) = F; por tanto: F ∨ F ≡ F.\nConclusión: La expresión evalúa invariablemente a Falso en todas las interpretaciones, siendo una Contradicción.',
  ),
  construirEjercicioClasificar(
    'clas-20',
    50,
    '((p → (q → r)) ∧ (p → q)) → (p → r)',
    'dificil',
    'Clasifica el Teorema del Axioma 2 de Frege: ((p → (q → r)) ∧ (p → q)) → (p → r)',
    'A. G. Hamilton - Lógica para Matemáticos',
    'Paso 1: Caso p=V: El antecedente requiere que (q → r)=V y que q=V.\nPaso 2: Aplicando Modus Ponens a q=V y (q → r)=V, se deduce necesariamente que r=V.\nPaso 3: Por lo tanto, el consecuente (p → r) evalúa a (V → V) = V.\nPaso 4: Caso p=F: El consecuente (p → r) tiene antecedente F, por lo que (F → r) = V de manera inmediata.\nConclusión: En cualquier situación el condicional principal resulta Verdadero, validando el Axioma 2 de Frege como una Tautología.',
  ),
]

/* ==========================================================================
   4. LEYES LÓGICAS Y ÁLGEBRA PROPOSICIONAL (15 Ejercicios)
   ========================================================================== */

const ejerciciosLeyes: EjercicioLey[] = [
  {
    id: 'ley-1',
    orden: 51,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 51',
    descripcionCorta: 'Identifica la ley aplicada en: ¬(p ∨ q) ↔ (¬p ∧ ¬q)',
    nivel: 'facil',
    fuente: 'Seymour Lipschutz - Teoría de Conjuntos y Álgebra de Proposiciones',
    proposicion: '¬(p ∨ q) ↔ (¬p ∧ ¬q)',
    opciones: [
      'Ley de De Morgan',
      'Ley Distributiva',
      'Ley de Absorción',
      'Ley Asociativa',
      'Ley de Contraposición',
    ],
    opcionCorrecta: 'Ley de De Morgan',
    explicacion:
      'Paso 1: Se tiene la negación de una disyunción inclusiva ¬(p ∨ q).\nPaso 2: La equivalencia transforma la negación exterior en la conjunción de los literales negados (¬p ∧ ¬q).\nPaso 3: Esta transformación corresponde a la Ley de De Morgan en álgebra booleana y cálculo proposicional: ¬(A ∨ B) ≡ ¬A ∧ ¬B.\nConclusión: La ley aplicada es la Ley de De Morgan.',
  },
  {
    id: 'ley-2',
    orden: 52,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 52',
    descripcionCorta: 'Identifica la ley aplicada en: ((p ∧ q) → r) ↔ (p → (q → r))',
    nivel: 'medio',
    fuente: 'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    proposicion: '((p ∧ q) → r) ↔ (p → (q → r))',
    opciones: [
      'Ley de Exportación',
      'Ley de Importación / Transitividad',
      'Ley de Reducción al Absurdo',
      'Dilema Constructivo',
      'Ley de De Morgan',
    ],
    opcionCorrecta: 'Ley de Exportación',
    explicacion:
      'Paso 1: El miembro izquierdo expresa una implicación donde las premisas están unidas conjuntamente ((p ∧ q) → r).\nPaso 2: El miembro derecho reestructura las premisas como condicionales anidados sucesivos p → (q → r).\nPaso 3: Esta equivalencia deductiva clásica se denomina formalmente Ley de Exportación.\nConclusión: La ley aplicada es la Ley de Exportación.',
  },
  {
    id: 'ley-3',
    orden: 53,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 53',
    descripcionCorta: 'Identifica la ley aplicada en: (p ∨ (p ∧ q)) ↔ p',
    nivel: 'facil',
    fuente: 'Seymour Lipschutz - Teoría de Conjuntos y Álgebra de Proposiciones',
    proposicion: '(p ∨ (p ∧ q)) ↔ p',
    opciones: [
      'Ley de Absorción',
      'Ley Idempotente',
      'Ley de Identidad',
      'Ley Dominante',
      'Ley Conmutativa',
    ],
    opcionCorrecta: 'Ley de Absorción',
    explicacion:
      'Paso 1: La expresión combina una disyunción exterior con una conjunción interior que contiene la misma variable p.\nPaso 2: Por álgebra proposicional: p ∨ (p ∧ q) ≡ (p ∧ V) ∨ (p ∧ q) ≡ p ∧ (V ∨ q) ≡ p ∧ V ≡ p.\nPaso 3: Este axioma de simplificación directa es la Ley de Absorción.\nConclusión: La ley aplicada es la Ley de Absorción.',
  },
  {
    id: 'ley-4',
    orden: 54,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 54',
    descripcionCorta: 'Identifica la ley aplicada en: (p → q) ↔ (¬q → ¬p)',
    nivel: 'medio',
    fuente: 'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    proposicion: '(p → q) ↔ (¬q → ¬p)',
    opciones: [
      'Ley de Contraposición (Transposición)',
      'Ley de Inversión',
      'Ley de Implicación Material',
      'Silogismo Disyuntivo',
      'Doble Negación',
    ],
    opcionCorrecta: 'Ley de Contraposición (Transposición)',
    explicacion:
      'Paso 1: Se compara la proposición condicional original (p → q) con su forma inversa negada (¬q → ¬p).\nPaso 2: Ambas proposiciones poseen exactamente la misma tabla de verdad [V, F, V, V].\nPaso 3: Este principio de equivalencia se conoce como Ley de Contraposición (o Transposición).\nConclusión: La ley aplicada es la Ley de Contraposición.',
  },
  {
    id: 'ley-5',
    orden: 55,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 55',
    descripcionCorta: 'Identifica la ley aplicada en: (p → q) ↔ (¬p ∨ q)',
    nivel: 'medio',
    fuente: 'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    proposicion: '(p → q) ↔ (¬p ∨ q)',
    opciones: [
      'Definición de Implicación Material',
      'Ley de De Morgan',
      'Ley de Silogismo Hipotético',
      'Ley de Absorción',
      'Ley de Bicondicional',
    ],
    opcionCorrecta: 'Definición de Implicación Material',
    explicacion:
      'Paso 1: La expresión relaciona el conectivo condicional (p → q) con la disyunción (¬p ∨ q).\nPaso 2: Afirmar que p implica q equivale estrictamente a afirmar que no ocurre p o bien sí ocurre q.\nPaso 3: Esta equivalencia constituye la Definición de Implicación Material (o Ley del Condicional).\nConclusión: La ley aplicada es la Definición de Implicación Material.',
  },
  {
    id: 'ley-6',
    orden: 56,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 56',
    descripcionCorta: 'Identifica la ley aplicada en: ((p ∨ q) ∧ (p ∨ r)) ↔ (p ∨ (q ∧ r))',
    nivel: 'medio',
    fuente: 'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    proposicion: '((p ∨ q) ∧ (p ∨ r)) ↔ (p ∨ (q ∧ r))',
    opciones: [
      'Ley Distributiva de la Disyunción',
      'Ley Asociativa',
      'Ley de De Morgan',
      'Ley de Absorción',
      'Ley de Idempotencia',
    ],
    opcionCorrecta: 'Ley Distributiva de la Disyunción',
    explicacion:
      'Paso 1: El miembro izquierdo presenta la conjunción de dos disyunciones con término común p: (p ∨ q) ∧ (p ∨ r).\nPaso 2: Factorizando la disyunción común se obtiene p ∨ (q ∧ r).\nPaso 3: Esta propiedad distributiva dual de la disyunción sobre la conjunción es la Ley Distributiva.\nConclusión: La ley aplicada es la Ley Distributiva de la Disyunción.',
  },
  {
    id: 'ley-7',
    orden: 57,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 57',
    descripcionCorta: 'Identifica la regla de inferencia en: ((p → q) ∧ p) → q',
    nivel: 'facil',
    fuente: 'Patrick Suppes & Shirley Hill - Primer Curso de Lógica Matemática',
    proposicion: '((p → q) ∧ p) → q',
    opciones: [
      'Modus Ponendo Ponens (MPP)',
      'Modus Tollendo Tollens (MTT)',
      'Silogismo Disyuntivo (SD)',
      'Silogismo Hipotético (SH)',
      'Dilema Constructivo',
    ],
    opcionCorrecta: 'Modus Ponendo Ponens (MPP)',
    explicacion:
      'Paso 1: La estructura presenta como premisas un condicional (p → q) y la afirmación de su antecedente p.\nPaso 2: De ambas premisas se infiere válidamente la afirmación del consecuente q.\nPaso 3: Esta regla deductiva fundamental es el Modus Ponendo Ponens (afirmando afirmo).\nConclusión: La regla de inferencia es Modus Ponendo Ponens (MPP).',
  },
  {
    id: 'ley-8',
    orden: 58,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 58',
    descripcionCorta: 'Identifica la regla de inferencia en: ((p → q) ∧ ¬q) → ¬p',
    nivel: 'medio',
    fuente: 'Susanna S. Epp - Matemáticas Discretas con Aplicaciones',
    proposicion: '((p → q) ∧ ¬q) → ¬p',
    opciones: [
      'Modus Tollendo Tollens (MTT)',
      'Modus Ponendo Ponens (MPP)',
      'Silogismo Disyuntivo (SD)',
      'Dilema Destructivo',
      'Ley de Contraposición',
    ],
    opcionCorrecta: 'Modus Tollendo Tollens (MTT)',
    explicacion:
      'Paso 1: Las premisas son una proposición condicional (p → q) y la negación de su consecuente ¬q.\nPaso 2: Al ser falso el consecuente, el antecedente p no puede ser verdadero sin hacer falso el condicional.\nPaso 3: Por lo tanto, se concluye necesariamente la negación del antecedente ¬p.\nConclusión: La regla de inferencia es Modus Tollendo Tollens (MTT).',
  },
  {
    id: 'ley-9',
    orden: 59,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 59',
    descripcionCorta: 'Identifica la regla de inferencia en: ((p ∨ q) ∧ ¬p) → q',
    nivel: 'facil',
    fuente: 'Patrick Suppes & Shirley Hill - Primer Curso de Lógica Matemática',
    proposicion: '((p ∨ q) ∧ ¬p) → q',
    opciones: [
      'Silogismo Disyuntivo (SD)',
      'Modus Ponens (MPP)',
      'Simplificación Conjuntiva',
      'Adición Disyuntiva',
      'Ley de De Morgan',
    ],
    opcionCorrecta: 'Silogismo Disyuntivo (SD)',
    explicacion:
      'Paso 1: Se dispone de una disyunción inclusiva como premisa (p ∨ q).\nPaso 2: Se dispone de la negación explícita de uno de los disyuntos (¬p).\nPaso 3: Negado un disyunto, se concluye necesariamente la verdad del otro disyunto q (Modus Tollendo Ponens).\nConclusión: La regla de inferencia aplicada es el Silogismo Disyuntivo (SD).',
  },
  {
    id: 'ley-10',
    orden: 60,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 60',
    descripcionCorta: 'Identifica la ley aplicada en: (p ∧ (¬p ∨ q)) ↔ (p ∧ q)',
    nivel: 'medio',
    fuente: 'Seymour Lipschutz - Teoría de Conjuntos y Álgebra de Proposiciones',
    proposicion: '(p ∧ (¬p ∨ q)) ↔ (p ∧ q)',
    opciones: [
      'Ley de Absorción por Negación (Simplificación)',
      'Ley Distributiva',
      'Ley de Idempotencia',
      'Ley del Tercero Excluido',
      'Ley de De Morgan',
    ],
    opcionCorrecta: 'Ley de Absorción por Negación (Simplificación)',
    explicacion:
      'Paso 1: Al distribuir el término p sobre la disyunción: (p ∧ ¬p) ∨ (p ∧ q).\nPaso 2: Por el Principio de No Contradicción: (p ∧ ¬p) ≡ F.\nPaso 3: Por elemento neutro: F ∨ (p ∧ q) ≡ (p ∧ q).\nConclusión: Esta equivalencia corresponde a la Ley de Absorción por Negación (o simplificación booleana).',
  },
  {
    id: 'ley-11',
    orden: 61,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 61',
    descripcionCorta: 'Identifica la ley aplicada en: (p ↔ q) ↔ ((p → q) ∧ (q → p))',
    nivel: 'facil',
    fuente: 'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    proposicion: '(p ↔ q) ↔ ((p → q) ∧ (q → p))',
    opciones: [
      'Definición del Bicondicional',
      'Ley de Implicación Material',
      'Ley de Exportación',
      'Ley Conmutativa',
      'Silogismo Hipotético',
    ],
    opcionCorrecta: 'Definición del Bicondicional',
    explicacion:
      'Paso 1: El miembro izquierdo es el operador bicondicional p ↔ q.\nPaso 2: El miembro derecho formaliza la doble implicación como conjunción de dos condicionales mutuos: (p → q) ∧ (q → p).\nPaso 3: Esta equivalencia constituye la definición formal del conectivo bicondicional en el cálculo proposicional.\nConclusión: La ley aplicada es la Definición del Bicondicional.',
  },
  {
    id: 'ley-12',
    orden: 62,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 62',
    descripcionCorta: 'Identifica la regla de inferencia en: ((p → q) ∧ (q → r)) → (p → r)',
    nivel: 'medio',
    fuente: 'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    proposicion: '((p → q) ∧ (q → r)) → (p → r)',
    opciones: [
      'Silogismo Hipotético (SH)',
      'Modus Ponens',
      'Dilema Constructivo',
      'Ley de Transitividad Simétrica',
      'Ley de Exportación',
    ],
    opcionCorrecta: 'Silogismo Hipotético (SH)',
    explicacion:
      'Paso 1: Las premisas son dos condicionales encadenados donde el consecuente del primero coincide con el antecedente del segundo: (p → q) y (q → r).\nPaso 2: Por transitividad de la relación condicional, se deduce la implicación directa de p hacia r.\nPaso 3: Esta regla fundamental del razonamiento deductivo es el Silogismo Hipotético.\nConclusión: La regla de inferencia es el Silogismo Hipotético (SH).',
  },
  {
    id: 'ley-13',
    orden: 63,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 63',
    descripcionCorta: 'Identifica la ley en: (p ∨ ¬p) ↔ (q ∨ ¬q)',
    nivel: 'facil',
    fuente: 'Seymour Lipschutz - Teoría de Conjuntos y Álgebra de Proposiciones',
    proposicion: '(p ∨ ¬p) ↔ (q ∨ ¬q)',
    opciones: [
      'Ley del Tercero Excluido (Equivalencia Tautológica)',
      'Ley de No Contradicción',
      'Ley de Idempotencia',
      'Ley de Doble Negación',
      'Ley de Identidad',
    ],
    opcionCorrecta: 'Ley del Tercero Excluido (Equivalencia Tautológica)',
    explicacion:
      'Paso 1: Por la Ley del Tercero Excluido, toda proposición disyunta con su negación evalúa a Verdadero: (p ∨ ¬p) ≡ V.\nPaso 2: Análogamente, para la variable q se tiene: (q ∨ ¬q) ≡ V.\nPaso 3: Sustituyendo en el bicondicional: V ↔ V ≡ V.\nConclusión: La ley fundamental aplicada es la Ley del Tercero Excluido (Equivalencia Tautológica).',
  },
  {
    id: 'ley-14',
    orden: 64,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 64',
    descripcionCorta: 'Identifica la regla en: ((p ∨ q) ∧ (¬p ∨ r)) → (q ∨ r)',
    nivel: 'dificil',
    fuente: 'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    proposicion: '((p ∨ q) ∧ (¬p ∨ r)) → (q ∨ r)',
    opciones: [
      'Regla de Resolución Proposicional',
      'Dilema Constructivo',
      'Silogismo Disyuntivo',
      'Ley de Absorción',
      'Ley Distributiva',
    ],
    opcionCorrecta: 'Regla de Resolución Proposicional',
    explicacion:
      'Paso 1: Se tienen dos cláusulas disyuntivas con literales complementarios p y ¬p: (p ∨ q) y (¬p ∨ r).\nPaso 2: Al combinarlas conjuntamente, se elimina el par complementario y se obtiene la cláusula resolvente (q ∨ r).\nPaso 3: Este principio constituye la Regla de Resolución de Robinson, base de la demostración automática de teoremas.\nConclusión: La regla es la Regla de Resolución Proposicional.',
  },
  {
    id: 'ley-15',
    orden: 65,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio 65',
    descripcionCorta: 'Identifica la ley aplicada en: ((p → r) ∧ (q → r)) ↔ ((p ∨ q) → r)',
    nivel: 'dificil',
    fuente: 'Susanna S. Epp - Matemáticas Discretas con Aplicaciones',
    proposicion: '((p → r) ∧ (q → r)) ↔ ((p ∨ q) → r)',
    opciones: [
      'Ley de Dilema / Conjunción de Implicaciones',
      'Ley de Exportación',
      'Ley de Contraposición',
      'Silogismo Hipotético',
      'Ley de Absorción',
    ],
    opcionCorrecta: 'Ley de Dilema / Conjunción de Implicaciones',
    explicacion:
      'Paso 1: El miembro izquierdo afirma que dos condiciones distintas p y q conducen a la misma conclusión r.\nPaso 2: Esto equivale lógicamente a afirmar que si ocurre al menos una de ellas (p ∨ q), ocurrirá r.\nPaso 3: Esta ley formaliza el método de Demostración por Casos (Ley de Dilema / Conjunción de Implicaciones).\nConclusión: La ley aplicada es la Ley de Dilema / Conjunción de Implicaciones.',
  },
]

/* ==========================================================================
   5. CUESTIONARIOS DE EVALUACIÓN SEMÁNTICA RIGUROSA (15 Bloques de Quizzes)
   ========================================================================== */

function crearEjercicioQuiz(
  id: string,
  orden: number,
  titulo: string,
  descripcionCorta: string,
  nivel: Dificultad,
  fuente: string,
  preguntas: PreguntaQuiz[],
): EjercicioQuiz {
  return {
    id,
    orden,
    tipo: 'quiz',
    categoria: 'CUESTIONARIO',
    titulo,
    descripcionCorta,
    nivel,
    fuente,
    preguntas,
  }
}

const ejerciciosQuiz: EjercicioQuiz[] = [
  crearEjercicioQuiz(
    'quiz-1',
    66,
    'Ejercicio 66',
    'Cuestionario: Implicaciones y negaciones compuestas',
    'facil',
    'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    [
      construirPreguntaQuiz(
        '¬p ∨ (q → p)',
        { P: true, Q: false },
        'Paso 1: Sustitución de variables: p=V, q=F.\nPaso 2: ¬p = ¬(V) = F.\nPaso 3: (q → p) = (F → V) = V (un antecedente falso produce verdad).\nPaso 4: F ∨ V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ∧ ¬q) → (p ∨ q)',
        { P: false, Q: true },
        'Paso 1: Sustitución de variables: p=F, q=V.\nPaso 2: Antecedente: (p ∧ ¬q) = (F ∧ F) = F.\nPaso 3: Consecuente: (p ∨ q) = (F ∨ V) = V.\nPaso 4: F → V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '¬(p → q) ∧ (q → ¬p)',
        { P: true, Q: false },
        'Paso 1: Sustitución de variables: p=V, q=F.\nPaso 2: (p → q) = (V → F) = F; luego su negación ¬(F) = V.\nPaso 3: (q → ¬p) = (F → F) = V.\nPaso 4: V ∧ V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ↔ q) ∧ ¬(p ∨ ¬q)',
        { P: false, Q: false },
        'Paso 1: Sustitución de variables: p=F, q=F.\nPaso 2: (p ↔ q) = (F ↔ F) = V.\nPaso 3: (p ∨ ¬q) = (F ∨ V) = V; luego ¬(V) = F.\nPaso 4: V ∧ F = Falso (F).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-2',
    67,
    'Ejercicio 67',
    'Cuestionario: Tablas y bicondicionales de 3 variables',
    'medio',
    'Patrick Suppes & Shirley Hill - Primer Curso de Lógica Matemática',
    [
      construirPreguntaQuiz(
        '(p → (q ∨ r)) ↔ ((p ∧ ¬q) → r)',
        { P: true, Q: false, R: false },
        'Paso 1: Sustitución de variables: p=V, q=F, r=F.\nPaso 2: Miembro izquierdo: (q ∨ r) = (F ∨ F) = F; luego (p → F) = (V → F) = F.\nPaso 3: Miembro derecho: (p ∧ ¬q) = (V ∧ V) = V; luego (V → r) = (V → F) = F.\nPaso 4: F ↔ F = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '((p ∧ q) → r) ∧ ¬(p → (q → r))',
        { P: true, Q: true, R: false },
        'Paso 1: Sustitución de variables: p=V, q=V, r=F.\nPaso 2: Por ley de exportación, ((p ∧ q) → r) es idéntico a (p → (q → r)).\nPaso 3: Una proposición conjuntada con su propia negación A ∧ ¬A siempre evalúa a Falso (F).',
      ),
      construirPreguntaQuiz(
        '((p ∨ q) ∧ ¬r) → (p ↔ r)',
        { P: false, Q: true, R: false },
        'Paso 1: Sustitución de variables: p=F, q=V, r=F.\nPaso 2: Antecedente: (F ∨ V) ∧ ¬(F) = V ∧ V = V.\nPaso 3: Consecuente: (p ↔ r) = (F ↔ F) = V.\nPaso 4: V → V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '¬(p ∧ (q ∨ r)) ↔ (¬p ∨ (¬q ∧ ¬r))',
        { P: true, Q: true, R: false },
        'Paso 1: Sustitución de variables: p=V, q=V, r=F.\nPaso 2: Miembro izquierdo: ¬(V ∧ (V ∨ F)) = ¬(V ∧ V) = ¬(V) = F.\nPaso 3: Miembro derecho: ¬p ∨ (¬q ∧ ¬r) = F ∨ (F ∧ V) = F ∨ F = F.\nPaso 4: F ↔ F = Verdadero (V).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-3',
    68,
    'Ejercicio 68',
    'Cuestionario: Transitividad y silogismos hipotéticos',
    'medio',
    'Susanna S. Epp - Matemáticas Discretas con Aplicaciones',
    [
      construirPreguntaQuiz(
        '((p → q) ∧ (q → r)) → (p → r)',
        { P: true, Q: false, R: true },
        'Paso 1: Sustitución de variables: p=V, q=F, r=V.\nPaso 2: Dado que es el Silogismo Hipotético (Tautología), su valor de verdad es universalmente Verdadero.\nPaso 3: Comprobación aritmética: (V → F) ∧ (F → V) = F ∧ V = F.\nPaso 4: Antecedente F → Consecuente (V → V) = F → V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '((p ∨ q) ∧ (p → r) ∧ (q → r)) → r',
        { P: true, Q: false, R: false },
        'Paso 1: Sustitución de variables: p=V, q=F, r=F.\nPaso 2: Dado que es el Dilema Simple (Tautología), evalúa a Verdadero en todas las interpretaciones.\nPaso 3: Sustituyendo en antecedente: (V ∨ F) ∧ (V → F) ∧ (F → F) = V ∧ F ∧ V = F.\nPaso 4: Antecedente F → Consecuente F = F → F = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ∧ ¬q ∧ r) ∧ (¬p ∨ q ∨ ¬r)',
        { P: true, Q: false, R: true },
        'Paso 1: Sustitución de variables: p=V, q=F, r=V.\nPaso 2: Primer término: V ∧ ¬(F) ∧ V = V ∧ V ∧ V = V.\nPaso 3: Segundo término: ¬(V) ∨ F ∨ ¬(V) = F ∨ F ∨ F = F.\nPaso 4: V ∧ F = Falso (F).',
      ),
      construirPreguntaQuiz(
        '((p → q) ∧ (r → s) ∧ (p ∨ r)) → (q ∨ s)',
        { P: false, Q: false, R: true, S: false },
        'Paso 1: Sustitución de variables en el Dilema Constructivo: p=F, q=F, r=V, s=F.\nPaso 2: Antecedente: (F → F) ∧ (V → F) ∧ (F ∨ V) = V ∧ F ∧ V = F.\nPaso 3: Consecuente: (q ∨ s) = (F ∨ F) = F.\nPaso 4: F → F = Verdadero (V).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-4',
    69,
    'Ejercicio 69',
    'Cuestionario: Ley de Peirce y conectivos complejos',
    'dificil',
    'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    [
      construirPreguntaQuiz(
        '((p → q) → p) → p',
        { P: false, Q: true },
        'Paso 1: Sustitución de variables: p=F, q=V.\nPaso 2: (p → q) = (F → V) = V.\nPaso 3: ((p → q) → p) = (V → F) = F.\nPaso 4: F → p = (F → F) = Verdadero (V) (Ley de Peirce).',
      ),
      construirPreguntaQuiz(
        '¬(((p → q) ∧ p) → q)',
        { P: true, Q: false },
        'Paso 1: Sustitución de variables: p=V, q=F.\nPaso 2: El término interior es el Modus Ponens, que es una Tautología (siempre Verdadero).\nPaso 3: La negación de una Tautología produce una Contradicción: ¬(V) = Falso (F).',
      ),
      construirPreguntaQuiz(
        '(p ↔ (q ↔ r)) ↔ ((p ↔ q) ↔ r)',
        { P: false, Q: true, R: false },
        'Paso 1: Sustitución en la Ley de Asociatividad del Bicondicional: p=F, q=V, r=F.\nPaso 2: Izquierda: (q ↔ r) = (V ↔ F) = F; luego (p ↔ F) = (F ↔ F) = V.\nPaso 3: Derecha: (p ↔ q) = (F ↔ V) = F; luego (F ↔ r) = (F ↔ F) = V.\nPaso 4: V ↔ V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p → (q ∧ ¬q)) ∧ p',
        { P: true, Q: false },
        'Paso 1: Sustitución de variables: p=V, q=F.\nPaso 2: (q ∧ ¬q) = (F ∧ V) = F.\nPaso 3: (p → F) = (V → F) = F.\nPaso 4: F ∧ p = F ∧ V = Falso (F).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-5',
    70,
    'Ejercicio 70',
    'Cuestionario: Reducción al absurdo y tautologías clásicas',
    'medio',
    'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    [
      construirPreguntaQuiz(
        '(p → (q ∧ ¬q)) ↔ ¬p',
        { P: false, Q: true },
        'Paso 1: Sustitución de variables: p=F, q=V.\nPaso 2: (p → (q ∧ ¬q)) = (F → F) = V.\nPaso 3: ¬p = ¬(F) = V.\nPaso 4: V ↔ V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ∧ ¬p) ∨ (q ∧ ¬q)',
        { P: true, Q: true },
        'Paso 1: Primer término: (p ∧ ¬p) = (V ∧ F) = F.\nPaso 2: Segundo término: (q ∧ ¬q) = (V ∧ F) = F.\nPaso 3: F ∨ F = Falso (F).',
      ),
      construirPreguntaQuiz(
        '(¬p → p) → p',
        { P: false, Q: false },
        'Paso 1: Sustitución de variables: p=F.\nPaso 2: Antecedente (¬p → p) = (V → F) = F.\nPaso 3: F → p = (F → F) = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '((p ∧ q) ∨ (p ∧ ¬q)) ↔ p',
        { P: true, Q: false },
        'Paso 1: Por distributividad: p ∧ (q ∨ ¬q) ≡ p ∧ V ≡ p.\nPaso 2: Como p=V, ambos miembros valen V.\nPaso 3: V ↔ V = Verdadero (V).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-6',
    71,
    'Ejercicio 71',
    'Cuestionario: Dilemas y conmutatividad proposicional',
    'dificil',
    'Patrick Suppes & Shirley Hill - Primer Curso de Lógica Matemática',
    [
      construirPreguntaQuiz(
        '((p → q) ∧ (¬p → q)) ↔ q',
        { P: true, Q: false },
        'Paso 1: Sustitución de variables: p=V, q=F.\nPaso 2: (p → q) = (V → F) = F.\nPaso 3: Conjunción antecedente: F ∧ (F → F) = F ∧ V = F.\nPaso 4: Como q=F, el bicondicional F ↔ F evalúa a Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '¬((p ∨ q) → p) ∧ ¬q',
        { P: false, Q: true },
        'Paso 1: Sustitución de variables: p=F, q=V.\nPaso 2: (p ∨ q) = V; luego (V → F) = F; su negación ¬(F) = V.\nPaso 3: ¬q = ¬(V) = F.\nPaso 4: V ∧ F = Falso (F).',
      ),
      construirPreguntaQuiz(
        '((p ↔ q) ∧ (q ↔ r)) → (p ↔ r)',
        { P: true, Q: true, R: false },
        'Paso 1: Sustitución de variables: p=V, q=V, r=F.\nPaso 2: Antecedente: (V ↔ V) ∧ (V ↔ F) = V ∧ F = F.\nPaso 3: Consecuente: (p ↔ r) = (V ↔ F) = F.\nPaso 4: F → F = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ∧ (q ∨ r)) ↔ ((p ∧ q) ∨ (p ∧ r))',
        { P: false, Q: true, R: true },
        'Paso 1: Sustitución en la Ley Distributiva: p=F, q=V, r=V.\nPaso 2: Miembro izquierdo: F ∧ (V ∨ V) = F ∧ V = F.\nPaso 3: Miembro derecho: (F ∧ V) ∨ (F ∧ V) = F ∨ F = F.\nPaso 4: F ↔ F = Verdadero (V).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-7',
    72,
    'Ejercicio 72',
    'Cuestionario: Regla de resolución y formas normales',
    'dificil',
    'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    [
      construirPreguntaQuiz(
        '((p ∨ q) ∧ (¬p ∨ r)) → (q ∨ r)',
        { P: true, Q: false, R: true },
        'Paso 1: Sustitución en la Regla de Resolución: p=V, q=F, r=V.\nPaso 2: Antecedente: (V ∨ F) ∧ (F ∨ V) = V ∧ V = V.\nPaso 3: Consecuente: (q ∨ r) = (F ∨ V) = V.\nPaso 4: V → V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ∧ q) ∧ (¬p ∨ ¬q)',
        { P: true, Q: true },
        'Paso 1: Primer término: (p ∧ q) = (V ∧ V) = V.\nPaso 2: Segundo término: (¬p ∨ ¬q) = (F ∨ F) = F.\nPaso 3: V ∧ F = Falso (F) (Contradicción estricta A ∧ ¬A).',
      ),
      construirPreguntaQuiz(
        '(p → (q ∨ r)) ∧ (p ∧ ¬q ∧ ¬r)',
        { P: true, Q: false, R: false },
        'Paso 1: (q ∨ r) = (F ∨ F) = F; luego (p → F) = (V → F) = F.\nPaso 2: Segundo término: (V ∧ V ∧ V) = V.\nPaso 3: F ∧ V = Falso (F).',
      ),
      construirPreguntaQuiz(
        '((p ∨ q) ∧ ¬p) ↔ (¬p ∧ q)',
        { P: false, Q: true },
        'Paso 1: Miembro izquierdo: (F ∨ V) ∧ V = V ∧ V = V.\nPaso 2: Miembro derecho: V ∧ V = V.\nPaso 3: V ↔ V = Verdadero (V).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-8',
    73,
    'Ejercicio 73',
    'Cuestionario: Absorción y simplificación booleana',
    'medio',
    'Susanna S. Epp - Matemáticas Discretas con Aplicaciones',
    [
      construirPreguntaQuiz(
        '(p ∨ (p ∧ q)) ↔ p',
        { P: false, Q: true },
        'Paso 1: Sustitución de variables: p=F, q=V.\nPaso 2: Miembro izquierdo: F ∨ (F ∧ V) = F ∨ F = F.\nPaso 3: Miembro derecho: p = F.\nPaso 4: F ↔ F = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ∧ (p ∨ q)) ↔ p',
        { P: true, Q: false },
        'Paso 1: Sustitución de variables: p=V, q=F.\nPaso 2: Miembro izquierdo: V ∧ (V ∨ F) = V ∧ V = V.\nPaso 3: Miembro derecho: p = V.\nPaso 4: V ↔ V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ∧ (¬p ∨ q)) ↔ (p ∧ q)',
        { P: true, Q: false },
        'Paso 1: Miembro izquierdo: V ∧ (F ∨ F) = V ∧ F = F.\nPaso 2: Miembro derecho: (V ∧ F) = F.\nPaso 3: F ↔ F = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ∨ (¬p ∧ q)) ↔ (p ∨ q)',
        { P: false, Q: false },
        'Paso 1: Miembro izquierdo: F ∨ (V ∧ F) = F ∨ F = F.\nPaso 2: Miembro derecho: F ∨ F = F.\nPaso 3: F ↔ F = Verdadero (V).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-9',
    74,
    'Ejercicio 74',
    'Cuestionario: Dilema constructivo y destructivo',
    'dificil',
    'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    [
      construirPreguntaQuiz(
        '((p → q) ∧ (r → s) ∧ (¬q ∨ ¬s)) → (¬p ∨ ¬r)',
        { P: true, Q: true, R: false, S: false },
        'Paso 1: Sustitución en el Dilema Destructivo: p=V, q=V, r=F, s=F.\nPaso 2: Antecedente: (V → V) ∧ (F → F) ∧ (F ∨ V) = V ∧ V ∧ V = V.\nPaso 3: Consecuente: (¬p ∨ ¬r) = (F ∨ V) = V.\nPaso 4: V → V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p → q) ∧ (p → ¬q) ∧ p',
        { P: true, Q: true },
        'Paso 1: (p → q) = (V → V) = V.\nPaso 2: (p → ¬q) = (V → F) = F.\nPaso 3: V ∧ F ∧ V = Falso (F).',
      ),
      construirPreguntaQuiz(
        '((p ∧ q) ↔ p) ↔ (p → q)',
        { P: false, Q: false },
        'Paso 1: Miembro izquierdo: (F ∧ F) ↔ F = F ↔ F = V.\nPaso 2: Miembro derecho: (F → F) = V.\nPaso 3: V ↔ V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ∨ q) ∧ (p ∨ ¬q) ∧ (¬p ∨ q) ∧ (¬p ∨ ¬q)',
        { P: true, Q: false },
        'Paso 1: Se evalúa el conjunto completo de 4 cláusulas disyuntivas con p=V y q=F.\nPaso 2: La cláusula (¬p ∨ q) evalúa a (F ∨ F) = F.\nPaso 3: Al existir al menos una cláusula falsa, la conjunción total evalúa a Falso (F).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-10',
    75,
    'Ejercicio 75',
    'Cuestionario: Negaciones dobles y álgebra booleana',
    'facil',
    'Seymour Lipschutz - Teoría de Conjuntos y Álgebra de Proposiciones',
    [
      construirPreguntaQuiz(
        '¬¬p ↔ p',
        { P: false },
        'Paso 1: Doble Negación: ¬(¬F) = ¬(V) = F.\nPaso 2: F ↔ F = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ∧ q) ∨ (¬p ∧ ¬q)',
        { P: true, Q: false },
        'Paso 1: Primer término: (p ∧ q) = (V ∧ F) = F.\nPaso 2: Segundo término: (¬p ∧ ¬q) = (F ∧ V) = F.\nPaso 3: F ∨ F = Falso (F).',
      ),
      construirPreguntaQuiz(
        '(p ∨ ¬p) ∧ (q ∨ ¬q)',
        { P: false, Q: true },
        'Paso 1: Primer término: (F ∨ V) = V.\nPaso 2: Segundo término: (V ∨ F) = V.\nPaso 3: V ∧ V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '¬(p ↔ q) ↔ (p ↔ ¬q)',
        { P: true, Q: true },
        'Paso 1: Miembro izquierdo: ¬(V ↔ V) = ¬(V) = F.\nPaso 2: Miembro derecho: (V ↔ F) = F.\nPaso 3: F ↔ F = Verdadero (V).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-11',
    76,
    'Ejercicio 76',
    'Cuestionario: Condicionales anidados y equivalencias',
    'medio',
    'Patrick Suppes & Shirley Hill - Primer Curso de Lógica Matemática',
    [
      construirPreguntaQuiz(
        '(p → (q → r)) ↔ (q → (p → r))',
        { P: true, Q: false, R: false },
        'Paso 1: Sustitución de variables: p=V, q=F, r=F.\nPaso 2: Miembro izquierdo: (p → (F → F)) = (V → V) = V.\nPaso 3: Miembro derecho: (q → (V → F)) = (F → F) = V.\nPaso 4: V ↔ V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '((p → q) → r) ↔ (p → (q → r))',
        { P: false, Q: false, R: false },
        'Paso 1: Miembro izquierdo: (F → F) = V; luego (V → F) = F.\nPaso 2: Miembro derecho: (F → F) = V; luego (F → V) = V.\nPaso 3: F ↔ V = Falso (F) (El condicional no es asociativo).',
      ),
      construirPreguntaQuiz(
        '(p ∧ q) → (p ↔ q)',
        { P: true, Q: true },
        'Paso 1: Antecedente: (V ∧ V) = V.\nPaso 2: Consecuente: (V ↔ V) = V.\nPaso 3: V → V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ↔ q) → (p → q)',
        { P: false, Q: true },
        'Paso 1: Antecedente: (F ↔ V) = F.\nPaso 2: Consecuente: (F → V) = V.\nPaso 3: F → V = Verdadero (V).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-12',
    77,
    'Ejercicio 77',
    'Cuestionario: Contraposición y doble condicional',
    'medio',
    'Susanna S. Epp - Matemáticas Discretas con Aplicaciones',
    [
      construirPreguntaQuiz(
        '(p → q) ↔ (¬q → ¬p)',
        { P: false, Q: true },
        'Paso 1: Miembro izquierdo: (F → V) = V.\nPaso 2: Miembro derecho: (F → V) = V.\nPaso 3: V ↔ V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p → ¬q) ↔ (q → ¬p)',
        { P: true, Q: true },
        'Paso 1: Miembro izquierdo: (V → F) = F.\nPaso 2: Miembro derecho: (V → F) = F.\nPaso 3: F ↔ F = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '¬(p → q) ↔ (p ∧ ¬q)',
        { P: false, Q: false },
        'Paso 1: Miembro izquierdo: ¬(F → F) = ¬(V) = F.\nPaso 2: Miembro derecho: (F ∧ V) = F.\nPaso 3: F ↔ F = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ∧ q) ∧ (¬p ∨ (q → ¬p))',
        { P: true, Q: true },
        'Paso 1: Primer término: (p ∧ q) = (V ∧ V) = V.\nPaso 2: Segundo término: (q → ¬p) = (V → F) = F; luego (¬p ∨ F) = (F ∨ F) = F.\nPaso 3: V ∧ F = Falso (F).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-13',
    78,
    'Ejercicio 78',
    'Cuestionario: Tautologías de orden superior',
    'dificil',
    'Irving M. Copi & Carl Cohen - Introducción a la Lógica',
    [
      construirPreguntaQuiz(
        '(p ∨ ¬p) ∧ (q ∨ ¬q) ∧ (r ∨ ¬r)',
        { P: false, Q: true, R: false },
        'Paso 1: Conjunción de tres instancias del Tercero Excluido: (V ∧ V ∧ V).\nPaso 2: Evalúa universalmente a Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '¬(p ∧ (q ∨ r))',
        { P: true, Q: false, R: false },
        'Paso 1: Sustitución de variables: p=V, q=F, r=F.\nPaso 2: (q ∨ r) = (F ∨ F) = F; luego (p ∧ F) = F.\nPaso 3: Negación de la conjunción: ¬(F) = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '((p ∨ q) ∧ ¬q) ↔ (p ∧ ¬q)',
        { P: true, Q: true },
        'Paso 1: Miembro izquierdo: (V ∨ V) ∧ F = V ∧ F = F.\nPaso 2: Miembro derecho: V ∧ F = F.\nPaso 3: F ↔ F = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p → q) ∨ (p → ¬q)',
        { P: true, Q: false },
        'Paso 1: Miembro izquierdo: (V → F) = F.\nPaso 2: Miembro derecho: (V → V) = V.\nPaso 3: F ∨ V = Verdadero (V).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-14',
    79,
    'Ejercicio 79',
    'Cuestionario: Permutación y distribución de premisas',
    'dificil',
    'Susanna S. Epp - Matemáticas Discretas con Aplicaciones',
    [
      construirPreguntaQuiz(
        '(p → (q → r)) ↔ (q → (p → r))',
        { P: true, Q: false, R: false },
        'Paso 1: Permutación de premisas.\nPaso 2: Izquierda: (V → (F → F)) = (V → V) = V.\nPaso 3: Derecha: (F → (V → F)) = (F → F) = V.\nPaso 4: V ↔ V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '((p ∧ q) → r) → (p → (q → r))',
        { P: true, Q: true, R: false },
        'Paso 1: Sustitución en la Ley de Exportación: p=V, q=V, r=F.\nPaso 2: Antecedente: (V ∧ V) → F = V → F = F.\nPaso 3: F → Consecuente = F → X = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ↔ ¬p) ∨ (q ↔ q)',
        { P: true, Q: false },
        'Paso 1: Primer término: (p ↔ ¬p) = F.\nPaso 2: Segundo término: (q ↔ q) = V.\nPaso 3: F ∨ V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p → (q ∧ ¬q)) ↔ ¬p',
        { P: true, Q: false },
        'Paso 1: Miembro izquierdo: (p → F) = (V → F) = F.\nPaso 2: Miembro derecho: ¬p = ¬(V) = F.\nPaso 3: F ↔ F = Verdadero (V).',
      ),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-15',
    80,
    'Ejercicio 80',
    'Cuestionario: Desafío integral de cálculo proposicional',
    'dificil',
    'Kenneth H. Rosen - Matemática Discreta y sus Aplicaciones',
    [
      construirPreguntaQuiz(
        '((p → (q → r)) ∧ (p → q)) → (p → r)',
        { P: true, Q: false, R: false },
        'Paso 1: Sustitución en el Axioma de Frege: p=V, q=F, r=F.\nPaso 2: Antecedente: (V → (F → F)) ∧ (V → F) = (V → V) ∧ F = V ∧ F = F.\nPaso 3: F → (p → r) = F → (V → F) = F → F = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '((p ∨ q) ∧ (¬p ∨ r)) → (q ∨ r)',
        { P: false, Q: true, R: false },
        'Paso 1: Sustitución en la Regla de Resolución: p=F, q=V, r=F.\nPaso 2: Antecedente: (F ∨ V) ∧ (V ∨ F) = V ∧ V = V.\nPaso 3: Consecuente: (q ∨ r) = (V ∨ F) = V.\nPaso 4: V → V = Verdadero (V).',
      ),
      construirPreguntaQuiz(
        '(p ∧ ¬q) ∧ (¬p ∨ q)',
        { P: false, Q: false },
        'Paso 1: Primer término: (F ∧ V) = F.\nPaso 2: Segundo término: (V ∨ F) = V.\nPaso 3: F ∧ V = Falso (F) (Contradicción estricta).',
      ),
      construirPreguntaQuiz(
        '((p → q) → p) → p',
        { P: true, Q: false },
        'Paso 1: Sustitución en la Ley de Peirce: p=V, q=F.\nPaso 2: (p → q) = (V → F) = F; luego ((p → q) → p) = (F → V) = V.\nPaso 3: V → p = (V → V) = Verdadero (V).',
      ),
    ],
  ),
]

/* ==========================================================================
   CONSOLIDACIÓN DEL CATÁLOGO TOTAL DE 80 EJERCICIOS
   ========================================================================== */

export const ejercicios: Ejercicio[] = [
  ...ejerciciosIdentificar,
  ...ejerciciosTablaVerdad,
  ...ejerciciosClasificar,
  ...ejerciciosLeyes,
  ...ejerciciosQuiz,
]

// Numeración y títulos automáticos ordenados de 1 a 80
ejercicios.forEach((ex, idx) => {
  ex.orden = idx + 1
  ex.titulo = `Ejercicio ${idx + 1}`
})

export function obtenerEjercicioPorId(id: string): Ejercicio | undefined {
  return ejercicios.find((e) => e.id === id)
}

export function construirTablaCompleta(proposicion: string) {
  const ast = parsearProposicion(proposicion)
  const vars = recolectarVariables(ast)
  return { ast, vars, filas: generarFilas(ast, vars) }
}
