import {
  parsearProposicion,
  evaluar,
  recolectarVariables,
  clasificarProposicion,
  generarFilas,
  type ClasificacionProposicion,
} from '../lib/truth-table/evaluator'

export type Dificultad = 'facil' | 'medio' | 'dificil'

export const etiquetasDificultad: Record<Dificultad, string> = {
  facil: 'Fácil',
  medio: 'Medio',
  dificil: 'Difícil',
}

export const puntosDificultad: Record<Dificultad, string> = {
  facil: '🟢',
  medio: '🟠',
  dificil: '🔴',
}

export interface BaseEjercicio {
  id: string
  orden: number
  categoria: 'IDENTIFICACIÓN' | 'TABLAS DE VERDAD' | 'CLASIFICACIÓN' | 'LEYES LÓGICAS' | 'CUESTIONARIO'
  titulo: string
  descripcionCorta: string
  nivel: Dificultad
  fuente: string
  explicacion?: string
}

export interface EjercicioTablaVerdad extends BaseEjercicio {
  tipo: 'truth-table'
  proposicion: string
}

export interface EjercicioLey extends BaseEjercicio {
  tipo: 'law'
  proposicion: string
  opciones: string[]
  opcionCorrecta: string
  explicacion: string
}

export interface PreguntaQuiz {
  enunciado: string
  proposicion: string
  textoAsignacion: string
  asignacion: Record<string, boolean>
  explicacion: string
}

export interface EjercicioQuiz extends BaseEjercicio {
  tipo: 'quiz'
  preguntas: PreguntaQuiz[]
}

export interface EjercicioIdentificar extends BaseEjercicio {
  tipo: 'identify'
  proposicion: string
  opciones: string[]
  opcionCorrecta: string
  explicacion: string
}

export interface EjercicioClasificar extends BaseEjercicio {
  tipo: 'classify'
  proposicion: string
  explicacion: string
}

export type Ejercicio =
  | EjercicioTablaVerdad
  | EjercicioLey
  | EjercicioQuiz
  | EjercicioIdentificar
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
  clasificacion: 'Tautología, contradicción y contingencia',
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
  explicacionDetallada?: string,
): PreguntaQuiz {
  const ast = parsearProposicion(proposicion)
  const vars = recolectarVariables(ast)
  const textoAsignacion = vars
    .map((v) => `${v.toLowerCase()} = ${asignacion[v] ? 'Verdadero' : 'Falso'}`)
    .join(', ')

  const valorFinal = evaluar(ast, asignacion)
  const valorTexto = valorFinal ? 'Verdadero (V)' : 'Falso (F)'

  const explicacion =
    explicacionDetallada ??
    `Evaluación paso a paso: Sustituyendo los valores asignados (${textoAsignacion}) en la fórmula "${proposicion}", la expresión evalúa a ${valorTexto}.`

  return {
    enunciado: 'Determina el valor de verdad de la siguiente fórmula lógica:',
    proposicion,
    textoAsignacion: `Asignación de variables: ${textoAsignacion}`,
    asignacion,
    explicacion,
  }
}

/* ==========================================================================
   1. IDENTIFICACIÓN DE FÓRMULAS Y CONECTIVOS DOMINANTES (15 Ejercicios de Nivel Universitario)
   Fuentes: Copi & Cohen (Cap. 8-9), Rosen (Cap. 1), Epp (Cap. 2), Suppes (Cap. 1-2), Hamilton (Cap. 2)
   ========================================================================== */

const ejerciciosIdentificar: EjercicioIdentificar[] = [
  {
    id: 'id-1',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el operador principal en: ¬(p ∧ (q ∨ ¬r))',
    nivel: 'facil',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 8.2)',
    proposicion: '¬(p ∧ (q ∨ ¬r))',
    opciones: ['Negación', 'Conjunción', 'Disyunción', 'Condicional', 'Bicondicional'],
    opcionCorrecta: 'Negación',
    explicacion:
      'El operador principal es la Negación (¬). El signo de negación externo antepuesto al paréntesis abarca toda la conjunción interna p ∧ (q ∨ ¬r).',
  },
  {
    id: 'id-2',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el conectivo dominante en: ((p → q) ∧ (q → r)) ∧ ¬(p → r)',
    nivel: 'medio',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 1.2)',
    proposicion: '((p → q) ∧ (q → r)) ∧ ¬(p → r)',
    opciones: ['Conjunción', 'Condicional', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Conjunción',
    explicacion:
      'El conectivo principal es la Conjunción (∧) central, que une el bloque de premisas ((p → q) ∧ (q → r)) con la negación de la conclusión ¬(p → r).',
  },
  {
    id: 'id-3',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el operador principal en: ((p ∧ q) → r) → ((p → r) ∨ (q → r))',
    nivel: 'medio',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.1)',
    proposicion: '((p ∧ q) → r) → ((p → r) ∨ (q → r))',
    opciones: ['Condicional', 'Conjunción', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'El conectivo principal es el Condicional (→) central. La subfórmula izquierda ((p ∧ q) → r) actúa como antecedente y la disyunción derecha ((p → r) ∨ (q → r)) como consecuente.',
  },
  {
    id: 'id-4',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el tipo de proposición: ((p ∨ ¬q) ↔ (¬p ∧ r)) ↔ (q → (r ∨ s))',
    nivel: 'dificil',
    fuente: 'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.1)',
    proposicion: '((p ∨ ¬q) ↔ (¬p ∧ r)) ↔ (q → (r ∨ s))',
    opciones: ['Bicondicional', 'Condicional', 'Disyunción', 'Conjunción', 'Negación'],
    opcionCorrecta: 'Bicondicional',
    explicacion:
      'El operador principal es el Bicondicional (↔) central, que establece una relación de doble implicación entre el bloque izquierdo y el condicional derecho.',
  },
  {
    id: 'id-5',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Determina el conectivo de mayor jerarquía en: ¬(((p → q) ∧ (r → s)) → ((p ∨ r) → (q ∨ s)))',
    nivel: 'dificil',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    proposicion: '¬(((p → q) ∧ (r → s)) → ((p ∨ r) → (q ∨ s)))',
    opciones: ['Negación', 'Condicional', 'Conjunción', 'Disyunción', 'Bicondicional'],
    opcionCorrecta: 'Negación',
    explicacion:
      'El conectivo dominante es la Negación exterior (¬), cuyo alcance engloba la totalidad del condicional que formula el Dilema Constructivo.',
  },
  {
    id: 'id-6',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el operador principal en: (((p ∨ q) ∧ ¬p) → q) ∨ ((p ∧ q) ↔ (q ∧ p))',
    nivel: 'medio',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.2)',
    proposicion: '(((p ∨ q) ∧ ¬p) → q) ∨ ((p ∧ q) ↔ (q ∧ p))',
    opciones: ['Disyunción', 'Condicional', 'Conjunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Disyunción',
    explicacion:
      'El operador principal es la Disyunción (∨) central, que une la implicación del silogismo disyuntivo a la izquierda con el bicondicional de conmutatividad a la derecha.',
  },
  {
    id: 'id-7',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la estructura del Axioma de Frege: ((p → (q → r)) ∧ (p → q)) → (p → r)',
    nivel: 'dificil',
    fuente: 'A. G. Hamilton - Logic for Mathematicians (Cap. 2)',
    proposicion: '((p → (q → r)) ∧ (p → q)) → (p → r)',
    opciones: ['Condicional', 'Conjunción', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'El operador principal es el Condicional (→). Su antecedente es la conjunción ((p → (q → r)) ∧ (p → q)) y su consecuente es (p → r). Corresponde al axioma de autodistribución del condicional.',
  },
  {
    id: 'id-8',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Determina el conectivo principal en: ¬p ∧ ((q ↔ r) → (¬s ∨ (r ∧ p)))',
    nivel: 'medio',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.1)',
    proposicion: '¬p ∧ ((q ↔ r) → (¬s ∨ (r ∧ p)))',
    opciones: ['Conjunción', 'Condicional', 'Disyunción', 'Negación', 'Bicondicional'],
    opcionCorrecta: 'Conjunción',
    explicacion:
      'El operador dominante es la Conjunción (∧), uniendo el literal negado ¬p con la subexpresión condicional anidada.',
  },
  {
    id: 'id-9',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la forma lógica de: (p ↔ (q ∧ ¬r)) → (¬(p ∨ q) ∧ (r → ¬s))',
    nivel: 'dificil',
    fuente: 'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.1)',
    proposicion: '(p ↔ (q ∧ ¬r)) → (¬(p ∨ q) ∧ (r → ¬s))',
    opciones: ['Condicional', 'Bicondicional', 'Conjunción', 'Disyunción', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'El operador principal es el Condicional (→). Vincula el bicondicional del antecedente con la conjunción del consecuente.',
  },
  {
    id: 'id-10',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el conectivo principal en: ¬(p → (q → (r → (p ∧ q ∧ r))))',
    nivel: 'dificil',
    fuente: 'Seymour Lipschutz - Álgebra de Proposiciones (Serie Schaum, Cap. 10)',
    proposicion: '¬(p → (q → (r → (p ∧ q ∧ r))))',
    opciones: ['Negación', 'Condicional', 'Conjunción', 'Disyunción', 'Bicondicional'],
    opcionCorrecta: 'Negación',
    explicacion:
      'El operador de mayor jerarquía es la Negación (¬) inicial, ya que afecta a toda la cadena de condicionales anidados.',
  },
  {
    id: 'id-11',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Determina el conectivo principal en: (((p ∨ q) ∧ ¬r) ↔ ((p ∧ ¬r) ∨ (q ∧ ¬r))) ∧ (r → ¬p)',
    nivel: 'dificil',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    proposicion: '(((p ∨ q) ∧ ¬r) ↔ ((p ∧ ¬r) ∨ (q ∧ ¬r))) ∧ (r → ¬p)',
    opciones: ['Conjunción', 'Bicondicional', 'Disyunción', 'Condicional', 'Negación'],
    opcionCorrecta: 'Conjunción',
    explicacion:
      'El operador principal es la Conjunción (∧) central, uniendo la equivalencia distributiva con la implicación (r → ¬p).',
  },
  {
    id: 'id-12',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el conectivo dominante en: (((p → q) ∧ (r → s) ∧ (p ∨ r)) → (q ∨ s)) ↔ (¬(p ∧ r) ∨ (q ∧ s))',
    nivel: 'dificil',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 9.2)',
    proposicion: '(((p → q) ∧ (r → s) ∧ (p ∨ r)) → (q ∨ s)) ↔ (¬(p ∧ r) ∨ (q ∧ s))',
    opciones: ['Bicondicional', 'Condicional', 'Conjunción', 'Disyunción', 'Negación'],
    opcionCorrecta: 'Bicondicional',
    explicacion:
      'El operador principal es el Bicondicional (↔). Conecta la implicación del dilema con la expresión disyuntiva de la derecha.',
  },
  {
    id: 'id-13',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Determina el operador dominante en: ¬(((p ∧ ¬q) ∨ (¬p ∧ q)) ↔ (p ↔ q))',
    nivel: 'dificil',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.2)',
    proposicion: '¬(((p ∧ ¬q) ∨ (¬p ∧ q)) ↔ (p ↔ q))',
    opciones: ['Negación', 'Bicondicional', 'Disyunción', 'Conjunción', 'Condicional'],
    opcionCorrecta: 'Negación',
    explicacion:
      'El conectivo principal es la Negación (¬) externa, que niega la equivalencia lógica total contenida entre los paréntesis.',
  },
  {
    id: 'id-14',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la estructura lógica de: ((p → q) ∧ (r → ¬q) ∧ (¬r → s)) → (p → s)',
    nivel: 'dificil',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 9.2)',
    proposicion: '((p → q) ∧ (r → ¬q) ∧ (¬r → s)) → (p → s)',
    opciones: ['Condicional', 'Conjunción', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'El conectivo principal es el Condicional (→). Su antecedente es la conjunción de las 3 premisas deductivas y su consecuente es la conclusión (p → s).',
  },
  {
    id: 'id-15',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el operador principal en: ¬(¬(p ∨ ¬q) ∨ ¬(q ∧ ¬(r ∨ ¬p)))',
    nivel: 'dificil',
    fuente: 'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.2)',
    proposicion: '¬(¬(p ∨ ¬q) ∨ ¬(q ∧ ¬(r ∨ ¬p)))',
    opciones: ['Negación', 'Disyunción', 'Conjunción', 'Condicional', 'Bicondicional'],
    opcionCorrecta: 'Negación',
    explicacion:
      'El operador dominante es la Negación externa (¬), que modifica a toda la disyunción compleja de subfórmulas negadas.',
  },
]

/* ==========================================================================
   2. TABLAS DE VERDAD INTERACTIVAS Y RIGUROSAS (15 Ejercicios de 8 Filas / 3 Variables)
   Fuentes: Rosen (Cap. 1.3), Copi (Cap. 8.3), Suppes (Cap. 2), Lipschutz (Cap. 10)
   ========================================================================== */

const ejerciciosTablaVerdad: EjercicioTablaVerdad[] = [
  {
    id: 'tt-1',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla para la Implicación Material: (p → q) ↔ (¬p ∨ q)',
    nivel: 'medio',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 8.4)',
    proposicion: '(p → q) ↔ (¬p ∨ q)',
    explicacion:
      'Resolución: La tabla de verdad de (p → q) genera los valores [V, F, V, V] para las 4 combinaciones. La disyunción (¬p ∨ q) genera exactamente los mismos valores [V, F, V, V]. Al comparar fila por fila con el bicondicional, todas las filas evalúan a Verdadero (Tautología).',
  },
  {
    id: 'tt-2',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de la Ley de De Morgan: ¬(p ∧ q) ↔ (¬p ∨ ¬q)',
    nivel: 'medio',
    fuente: 'Seymour Lipschutz - Teoría de Conjuntos y Temas Afines (Cap. 10)',
    proposicion: '¬(p ∧ q) ↔ (¬p ∨ ¬q)',
    explicacion:
      'Resolución: (p ∧ q) es [V, F, F, F], luego su negación es [F, V, V, V]. La disyunción de las negaciones (¬p ∨ ¬q) produce [F, V, V, V]. La columna de resultado final es idénticamente [V, V, V, V].',
  },
  {
    id: 'tt-3',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de verdad para el Silogismo Disyuntivo: ((p ∨ q) ∧ ¬p) → q',
    nivel: 'medio',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.2)',
    proposicion: '((p ∨ q) ∧ ¬p) → q',
    explicacion:
      'Resolución: La subfórmula (p ∨ q) ∧ ¬p solo es verdadera en la fila p=F, q=V. En dicha fila q es V, por lo que V → V es V. En todas las demás filas el antecedente es Falso, haciendo que el condicional sea Verdadero (Tautología).',
  },
  {
    id: 'tt-4',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla para la Ley de Contraposición: (p → q) ↔ (¬q → ¬p)',
    nivel: 'medio',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 8.4)',
    proposicion: '(p → q) ↔ (¬q → ¬p)',
    explicacion:
      'Resolución: Ambas subexpresiones condicionales (p → q) y (¬q → ¬p) arrojan los valores [V, F, V, V]. El bicondicional resultante arroja [V, V, V, V] en las cuatro filas.',
  },
  {
    id: 'tt-5',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de definición del Bicondicional: (p ↔ q) ↔ ((p → q) ∧ (q → p))',
    nivel: 'medio',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.3)',
    proposicion: '(p ↔ q) ↔ ((p → q) ∧ (q → p))',
    explicacion:
      'Resolución: (p ↔ q) genera [V, F, F, V]. La conjunción de las implicaciones directas y recíprocas (p → q) ∧ (q → p) genera [V, F, F, V]. La equivalencia lógica se cumple con [V, V, V, V].',
  },
  {
    id: 'tt-6',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de verdad para la regla Modus Tollens: ((p → q) ∧ ¬q) → ¬p',
    nivel: 'dificil',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    proposicion: '((p → q) ∧ ¬q) → ¬p',
    explicacion:
      'Resolución: El antecedente ((p → q) ∧ ¬q) es verdadero únicamente cuando p=F y q=F. En esa fila ¬p es V (V → V = V). En las otras 3 combinaciones el antecedente es F, por lo que el condicional es universalmente Verdadero [V, V, V, V].',
  },
  {
    id: 'tt-7',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de verdad para la regla Modus Ponens: (p ∧ (p → q)) → q',
    nivel: 'dificil',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    proposicion: '(p ∧ (p → q)) → q',
    explicacion:
      'Resolución: Cuando p=V y (p → q)=V, q es necesariamente V. En los demás casos el antecedente es Falso. La columna final arroja [V, V, V, V] (Tautología).',
  },
  {
    id: 'tt-8',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de 8 filas para la Ley de Exportación: (p ∧ q → r) ↔ (p → (q → r))',
    nivel: 'dificil',
    fuente: 'Seymour Lipschutz - Álgebra de Proposiciones (Cap. 10)',
    proposicion: '(p ∧ q → r) ↔ (p → (q → r))',
    explicacion:
      'Resolución: Para las 8 combinaciones de p, q, r, ambas expresiones son falsas únicamente cuando p=V, q=V y r=F. En las 7 combinaciones restantes ambas son verdaderas. El bicondicional final evalúa a Verdadero en todas las 8 filas.',
  },
  {
    id: 'tt-9',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de 8 filas del Silogismo Hipotético: ((p → q) ∧ (q → r)) → (p → r)',
    nivel: 'dificil',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 8.4)',
    proposicion: '((p → q) ∧ (q → r)) → (p → r)',
    explicacion:
      'Resolución: En las 8 combinaciones de las 3 variables, si las dos premisas (p → q) y (q → r) son verdaderas, la conclusión (p → r) es obligatoriamente verdadera, demostrando la transitividad de la implicación con 8 filas en V.',
  },
  {
    id: 'tt-10',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de 8 filas para la Ley Distributiva: (p ∨ (q ∧ r)) ↔ ((p ∨ q) ∧ (p ∨ r))',
    nivel: 'dificil',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    proposicion: '(p ∨ (q ∧ r)) ↔ ((p ∨ q) ∧ (p ∨ r))',
    explicacion:
      'Resolución: Ambas subexpresiones arrojan la secuencia de 8 valores [V, V, V, V, V, F, F, F] para las combinaciones estándar de (p, q, r). El bicondicional resulta en [V, V, V, V, V, V, V, V].',
  },
  {
    id: 'tt-11',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla para la Reducción Condicional: (p → (q ∨ r)) ↔ ((p ∧ ¬q) → r)',
    nivel: 'dificil',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 8.4)',
    proposicion: '(p → (q ∨ r)) ↔ ((p ∧ ¬q) → r)',
    explicacion:
      'Resolución: Ambas fórmulas equivalen lógicamente a ¬p ∨ q ∨ r. Ambas solo son falsas cuando p=V, q=F y r=F. En las 7 combinaciones restantes son verdaderas. El bicondicional arroja 8 filas verdaderas.',
  },
  {
    id: 'tt-12',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de la Regla de Resolución de Robinson: ((p ∨ q) ∧ (¬p ∨ r)) → (q ∨ r)',
    nivel: 'dificil',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.6)',
    proposicion: '((p ∨ q) ∧ (¬p ∨ r)) → (q ∨ r)',
    explicacion:
      'Resolución: Si las dos cláusulas (p ∨ q) y (¬p ∨ r) son verdaderas, dependiendo de si p es V o F, al menos q o r debe ser verdadero. En las 8 filas el resultado de la implicación es Verdadero (Tautología).',
  },
  {
    id: 'tt-13',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de verdad para la fórmula: (p ↔ (q ∧ r)) → (¬p ∨ q)',
    nivel: 'dificil',
    fuente: 'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.1)',
    proposicion: '(p ↔ (q ∧ r)) → (¬p ∨ q)',
    explicacion:
      'Resolución: Se evalúa (p ↔ (q ∧ r)) y la disyunción (¬p ∨ q) en las 8 filas. Únicamente cuando p=V, q=F, r=F el antecedente es Falso (F ↔ F = V) pero ¬p ∨ q es Falso, haciendo V → F = F. La fórmula evalúa a Contingencia.',
  },
  {
    id: 'tt-14',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de verdad para la Ley de De Morgan Generalizada: ¬(p → (q ∧ r)) ↔ (p ∧ (¬q ∨ ¬r))',
    nivel: 'dificil',
    fuente: 'Seymour Lipschutz - Álgebra de Proposiciones (Cap. 10)',
    proposicion: '¬(p → (q ∧ r)) ↔ (p ∧ (¬q ∨ ¬r))',
    explicacion:
      'Resolución: ¬(p → (q ∧ r)) ≡ p ∧ ¬(q ∧ r) ≡ p ∧ (¬q ∨ ¬r). Ambas ramas son idénticas en todas las 8 filas de la tabla de verdad, resultando en una Tautología completa.',
  },
  {
    id: 'tt-15',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de verdad para la transitividad del bicondicional: ((p ↔ q) ∧ (q ↔ r)) → (p ↔ r)',
    nivel: 'dificil',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.3)',
    proposicion: '((p ↔ q) ∧ (q ↔ r)) → (p ↔ r)',
    explicacion:
      'Resolución: La relación de equivalencia lógica es transitiva. Si p tiene el mismo valor que q, y q tiene el mismo valor que r, p tiene obligatoriamente el mismo valor que r. Las 8 filas arrojan Verdadero (Tautología).',
  },
]

/* ==========================================================================
   3. CLASIFICACIÓN SEMÁNTICA: TAUTOLOGÍAS, CONTINGENCIAS Y CONTRADICCIONES (20 Ejercicios Universitarios)
   Fuentes: Copi (Cap. 8.4-9.1), Suppes (Cap. 2-3), Rosen (Cap. 1.3-1.6), Hamilton (Cap. 2)
   ========================================================================== */

function construirEjercicioClasificar(
  id: string,
  proposicion: string,
  nivel: Dificultad,
  descripcionCorta: string,
  fuente: string,
  explicacion: string,
): EjercicioClasificar {
  return {
    id,
    orden: 0,
    tipo: 'classify',
    categoria: 'CLASIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta,
    nivel,
    fuente,
    proposicion,
    explicacion,
  }
}

const ejerciciosClasificar: EjercicioClasificar[] = [
  construirEjercicioClasificar(
    'cl-1',
    '((p → q) ∧ p) → q',
    'medio',
    'Clasifica la regla de Modus Ponens: ((p → q) ∧ p) → q',
    'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    'Es una Tautología. Si p es V y (p → q) es V, q debe ser V. Si p es F o p → q es F, el antecedente es Falso, garantizando que el condicional siempre evalúa a Verdadero.',
  ),
  construirEjercicioClasificar(
    'cl-2',
    '((p → q) ∧ ¬q) → ¬p',
    'medio',
    'Clasifica la regla de Modus Tollens: ((p → q) ∧ ¬q) → ¬p',
    'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    'Es una Tautología. Si q es Falso y p → q es Verdadero, p debe ser necesariamente Falso, por lo que ¬p es Verdadero.',
  ),
  construirEjercicioClasificar(
    'cl-3',
    '((p ∨ q) ∧ ¬p) → q',
    'medio',
    'Clasifica el Silogismo Disyuntivo: ((p ∨ q) ∧ ¬p) → q',
    'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.2)',
    'Es una Tautología. Si al menos uno de los dos es verdadero (p ∨ q) y p es falso (¬p), q debe ser forzosamente verdadero.',
  ),
  construirEjercicioClasificar(
    'cl-4',
    '((p → q) ∧ (q → r)) → (p → r)',
    'medio',
    'Clasifica el Silogismo Hipotético: ((p → q) ∧ (q → r)) → (p → r)',
    'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    'Es una Tautología. Representa la transitividad formal del condicional en el cálculo proposicional.',
  ),
  construirEjercicioClasificar(
    'cl-5',
    '((p → q) ∧ q) → p',
    'medio',
    'Clasifica la Falacia de Afirmación del Consecuente: ((p → q) ∧ q) → p',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.6)',
    'Es una Contingencia (Falacia formal). Contraejemplo: Asignando p = Falso y q = Verdadero, tenemos (F → V) = V, V ∧ V = V, pero el consecuente p es Falso, produciendo V → F = Falso.',
  ),
  construirEjercicioClasificar(
    'cl-6',
    '((p → q) ∧ ¬p) → ¬q',
    'medio',
    'Clasifica la Falacia de Negación del Antecedente: ((p → q) ∧ ¬p) → ¬q',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.6)',
    'Es una Contingencia (Falacia formal). Contraejemplo: Asignando p = Falso y q = Verdadero, tenemos (F → V) = V, ¬p = V, V ∧ V = V, pero ¬q = Falso, produciendo V → F = Falso.',
  ),
  construirEjercicioClasificar(
    'cl-7',
    '(p → q) ∧ (p ∧ ¬q)',
    'medio',
    'Clasifica la fórmula: (p → q) ∧ (p ∧ ¬q)',
    'Seymour Lipschutz - Álgebra de Proposiciones (Cap. 10)',
    'Es una Contradicción. La proposición p → q equivale a ¬(p ∧ ¬q). Por tanto, la fórmula tiene la estructura X ∧ ¬X, que es universalmente falsa.',
  ),
  construirEjercicioClasificar(
    'cl-8',
    '((p → q) ∧ (r → s) ∧ (p ∨ r)) → (q ∨ s)',
    'dificil',
    'Clasifica la regla del Dilema Constructivo: ((p → q) ∧ (r → s) ∧ (p ∨ r)) → (q ∨ s)',
    'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    'Es una Tautología. Si p ∨ r es verdadero, al menos una de las dos hipótesis (p o r) se cumple; por tanto, por Modus Ponens, al menos una de las dos conclusiones (q o s) debe cumplirse.',
  ),
  construirEjercicioClasificar(
    'cl-9',
    '((p → q) → p) → p',
    'dificil',
    'Clasifica la Ley de Peirce: ((p → q) → p) → p',
    'A. G. Hamilton - Logic for Mathematicians (Cap. 2)',
    'Es una Tautología. Prueba por casos: Si p=V, el consecuente es V. Si p=F, p → q es V (F → q = V), luego (p → q) → p es F (V → F = F), y finalmente F → F es V. Evalúa a Verdadero en todas las interpretaciones.',
  ),
  construirEjercicioClasificar(
    'cl-10',
    '((p → q) ∧ (r → s) ∧ (¬q ∨ ¬s)) → (¬p ∨ ¬r)',
    'dificil',
    'Clasifica el Dilema Destructivo: ((p → q) ∧ (r → s) ∧ (¬q ∨ ¬s)) → (¬p ∨ ¬r)',
    'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    'Es una Tautología. Combina dos implicaciones con la negación disyuntiva de sus consecuentes para concluir por Modus Tollens la negación disyuntiva de los antecedentes.',
  ),
  construirEjercicioClasificar(
    'cl-11',
    '(p → q) ∨ (q → p)',
    'dificil',
    'Clasifica la Ley de Linealidad (Paradoja de Implicación Material): (p → q) ∨ (q → p)',
    'A. G. Hamilton - Logic for Mathematicians (Cap. 2)',
    'Es una Tautología. Por equivalencia condicional: (¬p ∨ q) ∨ (¬q ∨ p) ≡ (p ∨ ¬p) ∨ (q ∨ ¬q) ≡ V ∨ V ≡ Verdadero en todas las combinaciones.',
  ),
  construirEjercicioClasificar(
    'cl-12',
    '(p ∨ q) → (p ∧ q)',
    'medio',
    'Clasifica la relación: (p ∨ q) → (p ∧ q)',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    'Es una Contingencia. Si p = V y q = F, la disyunción es V pero la conjunción es F, produciendo V → F = Falso. Si ambos son V o ambos F, es Verdadero.',
  ),
  construirEjercicioClasificar(
    'cl-13',
    '(p → q) ↔ (q → p)',
    'medio',
    'Clasifica la equivalencia con la recíproca: (p → q) ↔ (q → p)',
    'Copi & Cohen - Introducción a la Lógica (Cap. 8.4)',
    'Es una Contingencia. Para p=V, q=F, p → q es F pero q → p es V, haciendo que el bicondicional sea Falso.',
  ),
  construirEjercicioClasificar(
    'cl-14',
    '(p ∧ ¬q) ∧ (¬p ∨ q)',
    'medio',
    'Clasifica la fórmula: (p ∧ ¬q) ∧ (¬p ∨ q)',
    'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.1)',
    'Es una Contradicción. Por Ley de De Morgan, ¬p ∨ q ≡ ¬(p ∧ ¬q). La expresión es de la forma X ∧ ¬X, que siempre evalúa a Falso.',
  ),
  construirEjercicioClasificar(
    'cl-15',
    '(p → (q ∧ ¬q)) → ¬p',
    'dificil',
    'Clasifica el principio de Reducción al Absurdo: (p → (q ∧ ¬q)) → ¬p',
    'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.5)',
    'Es una Tautología. Si asumir p conduce a la contradicción demostrable (q ∧ ¬q), entonces p es necesariamente falsa y ¬p es verdadera.',
  ),
  construirEjercicioClasificar(
    'cl-16',
    '((p ∨ q) ∧ (¬p ∨ r)) → (q ∨ r)',
    'dificil',
    'Clasifica la Regla de Resolución Proposicional: ((p ∨ q) ∧ (¬p ∨ r)) → (q ∨ r)',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.6)',
    'Es una Tautología. Constituye la base del algoritmo de resolución de Robinson utilizado en demostradores automáticos de teoremas.',
  ),
  construirEjercicioClasificar(
    'cl-17',
    '(p ↔ q) ∧ (p ↔ ¬q)',
    'medio',
    'Clasifica la fórmula: (p ↔ q) ∧ (p ↔ ¬q)',
    'Seymour Lipschutz - Álgebra de Proposiciones (Cap. 10)',
    'Es una Contradicción. Una proposición p no puede ser simultáneamente equivalente a q y a su negación ¬q.',
  ),
  construirEjercicioClasificar(
    'cl-18',
    '((p ∨ q) ∧ ¬p ∧ ¬q)',
    'facil',
    'Clasifica la fórmula: ((p ∨ q) ∧ ¬p ∧ ¬q)',
    'Copi & Cohen - Introducción a la Lógica (Cap. 8.4)',
    'Es una Contradicción. Por De Morgan ¬p ∧ ¬q ≡ ¬(p ∨ q), lo que resulta en (p ∨ q) ∧ ¬(p ∨ q) ≡ Falso.',
  ),
  construirEjercicioClasificar(
    'cl-19',
    '((p ∨ q) ∧ ¬q) ↔ (p ∧ ¬q)',
    'dificil',
    'Clasifica la equivalencia de absorción disyuntiva: ((p ∨ q) ∧ ¬q) ↔ (p ∧ ¬q)',
    'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.2)',
    'Es una Tautología. Al distribuir: (p ∧ ¬q) ∨ (q ∧ ¬q) ≡ (p ∧ ¬q) ∨ Falso ≡ p ∧ ¬q. Ambos lados son formalmente idénticos.',
  ),
  construirEjercicioClasificar(
    'cl-20',
    '(p → (q → r)) ↔ (q → (p → r))',
    'dificil',
    'Clasifica la Ley de Permutación de Premisas: (p → (q → r)) ↔ (q → (p → r))',
    'A. G. Hamilton - Logic for Mathematicians (Cap. 2)',
    'Es una Tautología. Ambas expresiones equivalen a ¬p ∨ ¬q ∨ r. El orden de las hipótesis en condicionales anidados no altera el valor final.',
  ),
]

/* ==========================================================================
   4. LEYES LÓGICAS Y ÁLGEBRA PROPOSICIONAL (15 Ejercicios de Nivel Universitario)
   Fuentes: Lipschutz (Cap. 10), Copi (Cap. 9.2), Rosen (Cap. 1.3), Suppes (Cap. 2)
   ========================================================================== */

const ejerciciosLeyes: EjercicioLey[] = [
  {
    id: 'law-1',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley en: ¬(p ∧ q) ≡ ¬p ∨ ¬q',
    nivel: 'facil',
    fuente: 'Seymour Lipschutz - Teoría de Conjuntos y Temas Afines (Cap. 10)',
    proposicion: '¬(p ∧ q) ≡ ¬p ∨ ¬q',
    opciones: ['Ley de De Morgan', 'Ley Distributiva', 'Ley Conmutativa', 'Ley Asociativa', 'Ley de Absorción'],
    opcionCorrecta: 'Ley de De Morgan',
    explicacion:
      'Ley de De Morgan: La negación de una conjunción lógica se transforma en la disyunción de las negaciones de cada proposición.',
  },
  {
    id: 'law-2',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley en: p ∧ (p ∨ q) ≡ p',
    nivel: 'facil',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    proposicion: 'p ∧ (p ∨ q) ≡ p',
    opciones: ['Ley de Absorción', 'Ley Distributiva', 'Ley de Idempotencia', 'Ley de Identidad', 'Ley Asociativa'],
    opcionCorrecta: 'Ley de Absorción',
    explicacion:
      'Ley de Absorción clásica: La conjunción de una variable p con una disyunción que contiene a p absorbe por completo el segundo término q.',
  },
  {
    id: 'law-3',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley de absorción ampliada: p ∨ (¬p ∧ q) ≡ p ∨ q',
    nivel: 'medio',
    fuente: 'Seymour Lipschutz - Álgebra de Proposiciones (Cap. 10)',
    proposicion: 'p ∨ (¬p ∧ q) ≡ p ∨ q',
    opciones: ['Ley de Absorción', 'Ley de De Morgan', 'Ley de Idempotencia', 'Ley Conmutativa', 'Ley de Complemento'],
    opcionCorrecta: 'Ley de Absorción',
    explicacion:
      'Ley de Absorción (segunda forma): Al aplicar distributividad p ∨ (¬p ∧ q) ≡ (p ∨ ¬p) ∧ (p ∨ q) ≡ V ∧ (p ∨ q) ≡ p ∨ q.',
  },
  {
    id: 'law-4',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley en: p → q ≡ ¬q → ¬p',
    nivel: 'medio',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 9.2)',
    proposicion: 'p → q ≡ ¬q → ¬p',
    opciones: ['Ley de Trasposición', 'Ley de Exportación', 'Ley de De Morgan', 'Ley de Absorción', 'Ley Distributiva'],
    opcionCorrecta: 'Ley de Trasposición',
    explicacion:
      'Ley de Trasposición (Contraposición): Una implicación condicional equivale a invertir el antecedente y el consecuente negándolos simultáneamente.',
  },
  {
    id: 'law-5',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley en: (p ∧ q) → r ≡ p → (q → r)',
    nivel: 'medio',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 9.2)',
    proposicion: '(p ∧ q) → r ≡ p → (q → r)',
    opciones: ['Ley de Exportación', 'Ley de Trasposición', 'Ley Distributiva', 'Ley Asociativa', 'Ley de Implicación'],
    opcionCorrecta: 'Ley de Exportación',
    explicacion:
      'Ley de Exportación: Permite transferir premisas unidas por conjunción hacia condicionales anidados sucesivos.',
  },
  {
    id: 'law-6',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley en: p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)',
    nivel: 'medio',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    proposicion: 'p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)',
    opciones: ['Ley Distributiva', 'Ley Asociativa', 'Ley de Absorción', 'Ley de De Morgan', 'Ley de Idempotencia'],
    opcionCorrecta: 'Ley Distributiva',
    explicacion:
      'Ley Distributiva: La disyunción se distribuye sobre la conjunción de forma análoga a la multiplicación sobre la suma.',
  },
  {
    id: 'law-7',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la definición de implicación material: p → q ≡ ¬p ∨ q',
    nivel: 'medio',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.3)',
    proposicion: 'p → q ≡ ¬p ∨ q',
    opciones: ['Ley de Implicación Material', 'Ley de De Morgan', 'Ley de Absorción', 'Ley de Identidad', 'Ley de Idempotencia'],
    opcionCorrecta: 'Ley de Implicación Material',
    explicacion:
      'Ley de Implicación Material: Expresa que un condicional p → q solo es falso cuando p es verdadero y q falso, equivaliendo a ¬p ∨ q.',
  },
  {
    id: 'law-8',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley en: ¬(p → q) ≡ p ∧ ¬q',
    nivel: 'medio',
    fuente: 'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.2)',
    proposicion: '¬(p → q) ≡ p ∧ ¬q',
    opciones: ['Negación del Condicional', 'Ley de De Morgan', 'Ley de Trasposición', 'Ley de Absorción', 'Ley Distributiva'],
    opcionCorrecta: 'Negación del Condicional',
    explicacion:
      'Negación del Condicional: Negar que p implique q equivale exactamente a afirmar la hipótesis p y negar la conclusión q.',
  },
  {
    id: 'law-9',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley en: p ↔ q ≡ (p → q) ∧ (q → p)',
    nivel: 'medio',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.3)',
    proposicion: 'p ↔ q ≡ (p → q) ∧ (q → p)',
    opciones: ['Ley de Definición del Bicondicional', 'Ley de Trasposición', 'Ley de Exportación', 'Ley de Absorción', 'Ley Asociativa'],
    opcionCorrecta: 'Ley de Definición del Bicondicional',
    explicacion:
      'Definición del Bicondicional: Descompone la equivalencia en la conjunción de las dos implicaciones unidireccionales.',
  },
  {
    id: 'law-10',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley en: (p ∧ q) ∨ (p ∧ ¬q) ≡ p',
    nivel: 'dificil',
    fuente: 'Seymour Lipschutz - Álgebra de Proposiciones (Cap. 10)',
    proposicion: '(p ∧ q) ∨ (p ∧ ¬q) ≡ p',
    opciones: ['Ley de Expansión Booleana', 'Ley de De Morgan', 'Ley de Absorción', 'Ley de Idempotencia', 'Ley Asociativa'],
    opcionCorrecta: 'Ley de Expansión Booleana',
    explicacion:
      'Expansión Booleana / Factorización: p ∧ (q ∨ ¬q) ≡ p ∧ V ≡ p. Demuestra la eliminación de variables complementarias.',
  },
  {
    id: 'law-11',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley que justifica: ¬(p ∨ (¬p ∧ q)) ≡ ¬p ∧ ¬q',
    nivel: 'dificil',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    proposicion: '¬(p ∨ (¬p ∧ q)) ≡ ¬p ∧ ¬q',
    opciones: ['Ley de De Morgan', 'Ley Distributiva', 'Ley de Trasposición', 'Ley de Exportación', 'Ley de Idempotencia'],
    opcionCorrecta: 'Ley de De Morgan',
    explicacion:
      'Por absorción interna p ∨ (¬p ∧ q) ≡ p ∨ q, y aplicando la Ley de De Morgan se concluye ¬(p ∨ q) ≡ ¬p ∧ ¬q.',
  },
  {
    id: 'law-12',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley en: (p ∨ q) ∨ r ≡ p ∨ (q ∨ r)',
    nivel: 'facil',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 9.2)',
    proposicion: '(p ∨ q) ∨ r ≡ p ∨ (q ∨ r)',
    opciones: ['Ley Asociativa', 'Ley Conmutativa', 'Ley Distributiva', 'Ley de Idempotencia', 'Ley de Absorción'],
    opcionCorrecta: 'Ley Asociativa',
    explicacion:
      'Ley Asociativa: Establece que el agrupamiento de tres o más proposiciones bajo el mismo operador no altera el valor final.',
  },
  {
    id: 'law-13',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley en: p ∧ (p ∨ ¬q) ≡ p',
    nivel: 'medio',
    fuente: 'Seymour Lipschutz - Teoría de Conjuntos y Temas Afines (Cap. 10)',
    proposicion: 'p ∧ (p ∨ ¬q) ≡ p',
    opciones: ['Ley de Absorción', 'Ley Distributiva', 'Ley de Complemento', 'Ley de Identidad', 'Ley Asociativa'],
    opcionCorrecta: 'Ley de Absorción',
    explicacion:
      'Ley de Absorción: La presencia del literal p fuera y dentro de la disyunción absorbe cualquier término adicional.',
  },
  {
    id: 'law-14',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el principio fundamental en: p ∨ ¬p ≡ V',
    nivel: 'facil',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.1)',
    proposicion: 'p ∨ ¬p ≡ V',
    opciones: ['Ley del Tercero Excluido', 'Ley de Contradicción', 'Ley de Idempotencia', 'Ley de Absorción', 'Ley Conmutativa'],
    opcionCorrecta: 'Ley del Tercero Excluido',
    explicacion:
      'Principio del Tercero Excluido: Toda proposición lógica es necesariamente verdadera o falsa, sin tercer valor admitido.',
  },
  {
    id: 'law-15',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el principio fundamental en: p ∧ ¬p ≡ F',
    nivel: 'facil',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    proposicion: 'p ∧ ¬p ≡ F',
    opciones: ['Ley de Contradicción', 'Ley del Tercero Excluido', 'Ley de Idempotencia', 'Ley de Identidad', 'Ley de Absorción'],
    opcionCorrecta: 'Ley de Contradicción',
    explicacion:
      'Principio de No Contradicción: Una proposición y su negación no pueden ser simultáneamente verdaderas en el mismo sistema.',
  },
]

/* ==========================================================================
   5. CUESTIONARIOS DE EVALUACIÓN SEMÁNTICA RIGUROSA (15 Bloques de Ejercicios)
   Fuentes: Copi (Cap. 8.2), Suppes (Cap. 1), Rosen (Cap. 1.1-1.3), Epp (Cap. 2.2)
   ========================================================================== */

function crearEjercicioQuiz(
  id: string,
  titulo: string,
  descripcionCorta: string,
  nivel: Dificultad,
  fuente: string,
  preguntas: PreguntaQuiz[],
): EjercicioQuiz {
  return {
    id,
    orden: 0,
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
    'Ejercicio',
    'Cuestionario: Evaluación de conectivos condicionales y bicondicionales',
    'medio',
    'Copi & Cohen - Introducción a la Lógica (Cap. 8.2)',
    [
      construirPreguntaQuiz('p → (q ∧ ¬r)', { P: true, Q: false, R: true }, 'q ∧ ¬r es F ∧ F = F; luego V → F evalúa a Falso.'),
      construirPreguntaQuiz('(p ↔ q) ∨ (r → p)', { P: false, Q: true, R: false }, 'p ↔ q es F; pero r → p es F → F = V; luego F ∨ V evalúa a Verdadero.'),
      construirPreguntaQuiz('¬(p ∨ q) → (r ∧ ¬p)', { P: false, Q: false, R: true }, '¬(F ∨ F) = V; r ∧ ¬p es V ∧ V = V; luego V → V evalúa a Verdadero.'),
      construirPreguntaQuiz('(p ∧ q) ↔ (¬p ∨ ¬q)', { P: true, Q: true }, 'p ∧ q es V; ¬p ∨ ¬q es F ∨ F = F; V ↔ F evalúa a Falso.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-2',
    'Ejercicio',
    'Cuestionario: Fórmulas compuestas con 3 variables',
    'medio',
    'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 1.2)',
    [
      construirPreguntaQuiz('(p → q) ∧ (q → r) → (p → r)', { P: true, Q: false, R: true }, 'Al ser una tautología válida (Silogismo Hipotético), evalúa universalmente a Verdadero.'),
      construirPreguntaQuiz('¬p ∧ (q ∨ (r → ¬p))', { P: true, Q: true, R: false }, '¬p es Falso; por tanto F ∧ (...) evalúa inmediatamente a Falso.'),
      construirPreguntaQuiz('(p ↔ ¬q) ∧ (q ↔ r)', { P: true, Q: false, R: false }, 'p ↔ ¬q es V ↔ V = V; q ↔ r es F ↔ F = V; V ∧ V evalúa a Verdadero.'),
      construirPreguntaQuiz('(p ∨ ¬q) → (r ∧ p)', { P: false, Q: false, R: true }, 'p ∨ ¬q es F ∨ V = V; pero r ∧ p es V ∧ F = F; luego V → F evalúa a Falso.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-3',
    'Ejercicio',
    'Cuestionario: Negaciones complejas y leyes de Morgan',
    'medio',
    'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.2)',
    [
      construirPreguntaQuiz('¬(p ∧ (q ∨ ¬r))', { P: true, Q: false, R: true }, 'q ∨ ¬r es F ∨ F = F; p ∧ F = F; su negación ¬(F) evalúa a Verdadero.'),
      construirPreguntaQuiz('¬(p → q) ↔ (p ∧ ¬q)', { P: false, Q: true }, 'Ambos miembros evalúan a Falso, haciendo que el bicondicional F ↔ F evalúe a Verdadero.'),
      construirPreguntaQuiz('(¬p ∨ ¬q) ∧ (p ∨ q)', { P: true, Q: true }, '¬p ∨ ¬q es F; luego F ∧ V evalúa a Falso.'),
      construirPreguntaQuiz('p → ¬(q ∧ r)', { P: true, Q: true, R: true }, 'q ∧ r es V, su negación es F; luego V → F evalúa a Falso.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-4',
    'Ejercicio',
    'Cuestionario: Evaluación de reglas de inferencia con asignación',
    'medio',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.1)',
    [
      construirPreguntaQuiz('((p → q) ∧ p) → q', { P: true, Q: false }, 'Tautología del Modus Ponens: evalúa a Verdadero bajo toda asignación.'),
      construirPreguntaQuiz('((p → q) ∧ q) → p', { P: false, Q: true }, 'Falacia formal: (F → V) = V, V ∧ V = V, pero p = F, produciendo Falso.'),
      construirPreguntaQuiz('((p ∨ q) ∧ ¬p) → q', { P: false, Q: true }, 'Tautología del Silogismo Disyuntivo: evalúa a Verdadero.'),
      construirPreguntaQuiz('((p → q) ∧ ¬p) → ¬q', { P: false, Q: true }, 'Falacia formal: V ∧ V = V, pero ¬q = F, produciendo Falso.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-5',
    'Ejercicio',
    'Cuestionario: Fórmulas de 3 variables con condicionales múltiples',
    'dificil',
    'Copi & Cohen - Introducción a la Lógica (Cap. 8.2)',
    [
      construirPreguntaQuiz('(p ∧ q → r) ↔ (p → (q → r))', { P: true, Q: true, R: false }, 'Ambos lados evalúan a Falso (V → F = F); por tanto F ↔ F evalúa a Verdadero.'),
      construirPreguntaQuiz('(p ∨ q) ∧ (¬p ∨ r) → (q ∨ r)', { P: true, Q: false, R: false }, 'Antecedente: V ∧ F = F; un condicional con antecedente F es Verdadero.'),
      construirPreguntaQuiz('p → (q → (r → p))', { P: false, Q: true, R: true }, 'Condicional con antecedente p=F evalúa inmediatamente a Verdadero.'),
      construirPreguntaQuiz('(p ↔ q) ∧ (q ↔ r) ∧ ¬(p ↔ r)', { P: true, Q: true, R: true }, 'p ↔ r es V, su negación es F; por tanto la conjunción evalúa a Falso.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-6',
    'Ejercicio',
    'Cuestionario: Expresiones con bicondicionales anidados',
    'dificil',
    'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 1.3)',
    [
      construirPreguntaQuiz('(p ↔ (q ↔ r)) ↔ ((p ↔ q) ↔ r)', { P: true, Q: false, R: false }, 'Asociatividad del bicondicional: evalúa a Verdadero en todas las interpretaciones.'),
      construirPreguntaQuiz('p ∧ ¬q ∧ r → (p ∨ q ∨ r)', { P: true, Q: false, R: true }, 'Consecuente es Verdadero (p=V), por lo que el condicional es Verdadero.'),
      construirPreguntaQuiz('¬((p ∧ q) ∨ r) ↔ (¬p ∨ ¬q) ∧ ¬r', { P: true, Q: false, R: true }, 'Equivalencia de De Morgan: ambos lados evalúan a Falso, resultando en Verdadero.'),
      construirPreguntaQuiz('(p → ¬q) ∧ (q → ¬r) ∧ (r → ¬p)', { P: true, Q: true, R: false }, 'p → ¬q es V → F = F; por lo que toda la conjunción evalúa a Falso.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-7',
    'Ejercicio',
    'Cuestionario: Álgebra Booleana y evaluación de simplificaciones',
    'dificil',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.2)',
    [
      construirPreguntaQuiz('p ∨ (¬p ∧ q) ↔ (p ∨ q)', { P: false, Q: true }, 'Ambos miembros evalúan a Verdadero; V ↔ V es Verdadero.'),
      construirPreguntaQuiz('(p ∧ q) ∨ (p ∧ ¬q) ↔ p', { P: false, Q: true }, 'Ambos lados evalúan a Falso; F ↔ F evalúa a Verdadero.'),
      construirPreguntaQuiz('p ∧ (q ∨ ¬r) → (p ∧ q)', { P: true, Q: false, R: false }, 'Antecedente: V ∧ (F ∨ V) = V. Consecuente: V ∧ F = F. V → F evalúa a Falso.'),
      construirPreguntaQuiz('¬(p ∨ q ∨ r) ↔ (¬p ∧ ¬q ∧ ¬r)', { P: false, Q: false, R: false }, 'Ambos lados evalúan a Verdadero; V ↔ V es Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-8',
    'Ejercicio',
    'Cuestionario: Deducción y paradojas de la implicación',
    'dificil',
    'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.2)',
    [
      construirPreguntaQuiz('(p → q) ∨ (q → p)', { P: true, Q: false }, 'p → q es F, pero q → p es V; luego F ∨ V evalúa a Verdadero.'),
      construirPreguntaQuiz('(p ∧ ¬p) → (q ∧ r)', { P: true, Q: false, R: false }, 'Principio de explosión: antecedente falso implica siempre Verdadero.'),
      construirPreguntaQuiz('((p → q) → p) → p', { P: false, Q: true }, 'Ley de Peirce: evalúa universalmente a Verdadero.'),
      construirPreguntaQuiz('(p ↔ ¬p) ∨ (q ↔ ¬q)', { P: true, Q: false }, 'Ambas componentes son contradicciones; F ∨ F evalúa a Falso.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-9',
    'Ejercicio',
    'Cuestionario: Silogismos y dilemas lógicos',
    'dificil',
    'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    [
      construirPreguntaQuiz('((p → q) ∧ (r → s) ∧ (p ∨ r)) → (q ∨ s)', { P: true, Q: false, R: false, S: true }, 'Dilema constructivo: evalúa a Verdadero en todas las interpretaciones.'),
      construirPreguntaQuiz('((p → q) ∧ (r → s) ∧ (¬q ∨ ¬s)) → (¬p ∨ ¬r)', { P: true, Q: false, R: true, S: true }, 'Dilema destructivo: evalúa a Verdadero en todas las interpretaciones.'),
      construirPreguntaQuiz('(p ∧ q → r) → (p → r)', { P: true, Q: false, R: false }, 'Antecedente: F → F = V. Consecuente: V → F = F. V → F evalúa a Falso.'),
      construirPreguntaQuiz('¬(p ↔ q) ↔ (p ↔ ¬q)', { P: true, Q: false }, 'Negación del bicondicional: ambos miembros son Verdaderos, resultando en Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-10',
    'Ejercicio',
    'Cuestionario: Fórmulas de 3 variables con conectivos mixtos',
    'dificil',
    'Seymour Lipschutz - Álgebra de Proposiciones (Cap. 10)',
    [
      construirPreguntaQuiz('(p ∧ q) ∨ (¬p ∧ ¬r)', { P: true, Q: false, R: false }, 'p ∧ q es F; ¬p ∧ ¬r es F ∧ V = F; F ∨ F evalúa a Falso.'),
      construirPreguntaQuiz('p → (¬q ∨ r)', { P: true, Q: true, R: false }, '¬q ∨ r es F ∨ F = F; luego V → F evalúa a Falso.'),
      construirPreguntaQuiz('(p ↔ ¬q) → r', { P: true, Q: false, R: false }, 'p ↔ ¬q es V ↔ V = V; luego V → F evalúa a Falso.'),
      construirPreguntaQuiz('¬p ∨ (q → r)', { P: true, Q: false, R: true }, 'q → r es F → V = V; luego F ∨ V evalúa a Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-11',
    'Ejercicio',
    'Cuestionario: Evaluación de tautologías clásicas y equivalencias',
    'dificil',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.2)',
    [
      construirPreguntaQuiz('(p → (q ∨ r)) ↔ ((p → q) ∨ (p → r))', { P: true, Q: false, R: true }, 'Ambos miembros evalúan a Verdadero; V ↔ V evalúa a Verdadero.'),
      construirPreguntaQuiz('(p ∧ ¬q) → (r ∨ ¬p)', { P: true, Q: true, R: false }, 'Antecedente p ∧ ¬q es Falso, garantizando que el condicional evalúa a Verdadero.'),
      construirPreguntaQuiz('(p ↔ q) ↔ (¬p ↔ ¬q)', { P: true, Q: false }, 'Ambos bicondicionales evalúan a Falso; F ↔ F evalúa a Verdadero.'),
      construirPreguntaQuiz('(p ∨ q ∨ r) ∧ ¬p ∧ ¬q', { P: false, Q: false, R: true }, 'p ∨ q ∨ r es V; ¬p es V; ¬q es V; V ∧ V ∧ V evalúa a Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-12',
    'Ejercicio',
    'Cuestionario: Razonamiento deductivo con 4 variables',
    'dificil',
    'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.1)',
    [
      construirPreguntaQuiz('(p → q) ∧ (r → s) ∧ (p ∨ r) → (q ∨ s)', { P: false, Q: false, R: true, S: true }, 'Dilema constructivo: evalúa universalmente a Verdadero.'),
      construirPreguntaQuiz('(p ∧ q) → (r ∧ s)', { P: true, Q: true, R: false, S: true }, 'Antecedente V ∧ V = V; consecuente F ∧ V = F; V → F evalúa a Falso.'),
      construirPreguntaQuiz('¬((p ∨ q) ∧ ¬r)', { P: true, Q: false, R: true }, 'p ∨ q es V; ¬r es F; V ∧ F = F; su negación evalúa a Verdadero.'),
      construirPreguntaQuiz('(p → (q → (r → s))) ↔ (p ∧ q ∧ r → s)', { P: true, Q: true, R: true, S: false }, 'Exportación múltiple: ambos miembros evalúan a Falso, haciendo el bicondicional Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-13',
    'Ejercicio',
    'Cuestionario: Negaciones anidadas y pruebas de no contradicción',
    'dificil',
    'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    [
      construirPreguntaQuiz('(p ∧ ¬p) ∧ (q ∨ ¬q) ∧ (r ∨ ¬r)', { P: false, Q: true, R: false }, 'El primer factor es Falso (Contradicción); toda la conjunción evalúa a Falso.'),
      construirPreguntaQuiz('(p ∨ ¬p) ∧ (q ∨ ¬q) ∧ (r ∨ ¬r)', { P: false, Q: true, R: false }, 'Conjunción de tres instancias del Tercero Excluido (V ∧ V ∧ V) evalúa a Verdadero.'),
      construirPreguntaQuiz('¬(p ∧ (q ∨ r))', { P: true, Q: false, R: false }, 'q ∨ r es F; p ∧ F = F; su negación ¬(F) evalúa a Verdadero.'),
      construirPreguntaQuiz('((p ∨ q) ∧ ¬q) ↔ (p ∧ ¬q)', { P: true, Q: true }, 'Ambos miembros evalúan a Falso; F ↔ F evalúa a Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-14',
    'Ejercicio',
    'Cuestionario: Permutación y distribución de premisas',
    'dificil',
    'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.2)',
    [
      construirPreguntaQuiz('(p → (q → r)) ↔ (q → (p → r))', { P: true, Q: false, R: false }, 'Permutación de premisas: ambos lados evalúan a Verdadero, resultando en Verdadero.'),
      construirPreguntaQuiz('(p ∧ q → r) → (p → (q → r))', { P: true, Q: true, R: false }, 'Ley de Exportación: evalúa universalmente a Verdadero.'),
      construirPreguntaQuiz('(p ↔ ¬p) ∨ (q ↔ q)', { P: true, Q: false }, 'q ↔ q es V; luego F ∨ V evalúa a Verdadero.'),
      construirPreguntaQuiz('(p → (q ∧ ¬q)) ↔ ¬p', { P: true, Q: false }, 'Reducción al absurdo: ambos lados evalúan a Falso, haciendo el bicondicional Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-15',
    'Ejercicio',
    'Cuestionario: Desafío integral de lógica simbólica y cálculo proposicional',
    'dificil',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    [
      construirPreguntaQuiz('((p → (q → r)) ∧ (p → q)) → (p → r)', { P: true, Q: false, R: false }, 'Axioma de Frege: evalúa universalmente a Verdadero.'),
      construirPreguntaQuiz('((p ∨ q) ∧ (¬p ∨ r)) → (q ∨ r)', { P: false, Q: true, R: false }, 'Regla de resolución proposicional: evalúa a Verdadero.'),
      construirPreguntaQuiz('(p ∧ ¬q) ∧ (¬p ∨ q)', { P: false, Q: false }, 'Contradicción estricta: evalúa universalmente a Falso.'),
      construirPreguntaQuiz('((p → q) → p) → p', { P: true, Q: false }, 'Ley de Peirce: evalúa universalmente a Verdadero.'),
    ],
  ),
]

/* ==========================================================================
   CONSOLIDACIÓN DEL CATÁLOGO TOTAL DE 80 EJERCICIOS
   15 Identificar + 15 Tablas de Verdad + 20 Clasificar + 15 Leyes + 15 Quizzes = 80
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
