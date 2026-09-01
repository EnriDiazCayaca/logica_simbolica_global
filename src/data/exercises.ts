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
   1. IDENTIFICACIÓN DE FÓRMULAS Y CONECTIVOS PRINCIPALES (15 Ejercicios)
   Fuentes: Copi & Cohen (Cap. 8), Rosen (Cap. 1), Epp (Cap. 2), Suppes (Cap. 1)
   ========================================================================== */

const ejerciciosIdentificar: EjercicioIdentificar[] = [
  {
    id: 'id-1',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el operador de mayor jerarquía en: ¬(p ∧ q)',
    nivel: 'facil',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 8.2)',
    proposicion: '¬(p ∧ q)',
    opciones: ['Negación', 'Conjunción', 'Disyunción', 'Condicional', 'Bicondicional'],
    opcionCorrecta: 'Negación',
    explicacion:
      'El conectivo principal es la Negación (¬). Aunque dentro del paréntesis hay una conjunción (∧), el símbolo de negación afecta a toda la estructura encerrada entre paréntesis, convirtiéndola en una negación compuesta.',
  },
  {
    id: 'id-2',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el tipo de proposición: (p → q) ∧ (q → r)',
    nivel: 'facil',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 1.2)',
    proposicion: '(p → q) ∧ (q → r)',
    opciones: ['Conjunción', 'Condicional', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Conjunción',
    explicacion:
      'El conectivo dominante es la Conjunción (∧), ya que une dos proposiciones condicionales independientes: (p → q) por la izquierda y (q → r) por la derecha.',
  },
  {
    id: 'id-3',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el operador principal en: (p ∧ q) → (r ∨ ¬s)',
    nivel: 'medio',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics and its Applications (Cap. 1.1)',
    proposicion: '(p ∧ q) → (r ∨ ¬s)',
    opciones: ['Condicional', 'Conjunción', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'El conectivo principal es el Condicional (→). La fórmula tiene como antecedente la conjunción (p ∧ q) y como consecuente la disyunción (r ∨ ¬s). El condicional es el operador de menor precedencia que vincula ambos bloques.',
  },
  {
    id: 'id-4',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el tipo de fórmula: (p ∨ ¬q) ↔ (¬p ∧ q)',
    nivel: 'medio',
    fuente: 'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.1)',
    proposicion: '(p ∨ ¬q) ↔ (¬p ∧ q)',
    opciones: ['Bicondicional', 'Disyunción', 'Conjunción', 'Condicional', 'Negación'],
    opcionCorrecta: 'Bicondicional',
    explicacion:
      'El operador principal es el Bicondicional (↔). Establece una doble implicación o equivalencia lógica entre el miembro izquierdo (p ∨ ¬q) y el miembro derecho (¬p ∧ q).',
  },
  {
    id: 'id-5',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el conectivo dominante en: ¬((p ∨ q) → (r ∧ ¬p))',
    nivel: 'medio',
    fuente: 'Seymour Lipschutz - Teoría de Conjuntos y Temas Afines (Serie Schaum, Cap. 10)',
    proposicion: '¬((p ∨ q) → (r ∧ ¬p))',
    opciones: ['Negación', 'Condicional', 'Disyunción', 'Conjunción', 'Bicondicional'],
    opcionCorrecta: 'Negación',
    explicacion:
      'El conectivo principal es la Negación (¬). El alcance del signo de negación inicial abarca todo el condicional contenido en los paréntesis externos.',
  },
  {
    id: 'id-6',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la estructura de la regla Modus Ponens: ((p → q) ∧ p) → q',
    nivel: 'medio',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    proposicion: '((p → q) ∧ p) → q',
    opciones: ['Condicional', 'Conjunción', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'La estructura general es un Condicional (→). El antecedente compuesto es la conjunción de las premisas ((p → q) ∧ p) y el consecuente es la conclusión q.',
  },
  {
    id: 'id-7',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el conectivo principal en: (p ∧ ¬q) ∨ (¬p ∧ q)',
    nivel: 'medio',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.1)',
    proposicion: '(p ∧ ¬q) ∨ (¬p ∧ q)',
    opciones: ['Disyunción', 'Conjunción', 'Bicondicional', 'Condicional', 'Negación'],
    opcionCorrecta: 'Disyunción',
    explicacion:
      'El operador principal es la Disyunción (∨). Esta expresión representa la definición estándar de la disyunción exclusiva (XOR), uniendo dos conjunciones mediante el operador "O".',
  },
  {
    id: 'id-8',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Determina el conectivo principal en: ¬p ∧ (q → (r ∨ s))',
    nivel: 'medio',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 1.3)',
    proposicion: '¬p ∧ (q → (r ∨ s))',
    opciones: ['Conjunción', 'Condicional', 'Disyunción', 'Negación', 'Bicondicional'],
    opcionCorrecta: 'Conjunción',
    explicacion:
      'El conectivo principal es la Conjunción (∧). Une la proposición negada simple ¬p con la subfórmula condicional (q → (r ∨ s)).',
  },
  {
    id: 'id-9',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el tipo de proposición: (p ↔ q) → (¬r ∧ s)',
    nivel: 'medio',
    fuente: 'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.1)',
    proposicion: '(p ↔ q) → (¬r ∧ s)',
    opciones: ['Condicional', 'Bicondicional', 'Conjunción', 'Disyunción', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'El operador dominante es el Condicional (→). Su antecedente es el bicondicional (p ↔ q) y su consecuente es la conjunción (¬r ∧ s).',
  },
  {
    id: 'id-10',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el operador principal en: ¬(p → (q ↔ r))',
    nivel: 'dificil',
    fuente: 'Seymour Lipschutz - Álgebra de Proposiciones (Serie Schaum, Cap. 10)',
    proposicion: '¬(p → (q ↔ r))',
    opciones: ['Negación', 'Condicional', 'Bicondicional', 'Conjunción', 'Disyunción'],
    opcionCorrecta: 'Negación',
    explicacion:
      'El conectivo de mayor jerarquía es la Negación (¬). Niega la implicación completa p → (q ↔ r).',
  },
  {
    id: 'id-11',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el conectivo principal en: ((p ∨ q) ∧ ¬r) ↔ ((p ∧ ¬r) ∨ (q ∧ ¬r))',
    nivel: 'dificil',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    proposicion: '((p ∨ q) ∧ ¬r) ↔ ((p ∧ ¬r) ∨ (q ∧ ¬r))',
    opciones: ['Bicondicional', 'Conjunción', 'Disyunción', 'Condicional', 'Negación'],
    opcionCorrecta: 'Bicondicional',
    explicacion:
      'El conectivo principal es el Bicondicional (↔). La fórmula expresa formalmente la Ley Distributiva de la conjunción respecto a la disyunción.',
  },
  {
    id: 'id-12',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la estructura del Dilema Constructivo: ((p → q) ∧ (r → s) ∧ (p ∨ r)) → (q ∨ s)',
    nivel: 'dificil',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 9.2)',
    proposicion: '((p → q) ∧ (r → s) ∧ (p ∨ r)) → (q ∨ s)',
    opciones: ['Condicional', 'Conjunción', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'El operador principal es el Condicional (→). Corresponde a la regla de inferencia del Dilema Constructivo: la conjunción de las tres premisas implica la disyunción de las conclusiones (q ∨ s).',
  },
  {
    id: 'id-13',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el conectivo en: ¬((p ∧ ¬q) ∨ (¬p ∧ q)) ↔ (p ↔ q)',
    nivel: 'dificil',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.2)',
    proposicion: '¬((p ∧ ¬q) ∨ (¬p ∧ q)) ↔ (p ↔ q)',
    opciones: ['Bicondicional', 'Negación', 'Disyunción', 'Conjunción', 'Condicional'],
    opcionCorrecta: 'Bicondicional',
    explicacion:
      'El conectivo principal es el Bicondicional (↔), que afirma la equivalencia entre la negación del XOR y el bicondicional clásico (XNOR ≡ IFF).',
  },
  {
    id: 'id-14',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la forma del axioma de distribución condicional: ((p → (q → r)) ∧ (p → q)) → (p → r)',
    nivel: 'dificil',
    fuente: 'A. G. Hamilton - Logic for Mathematicians (Cap. 2)',
    proposicion: '((p → (q → r)) ∧ (p → q)) → (p → r)',
    opciones: ['Condicional', 'Conjunción', 'Disyunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion:
      'El operador principal es el Condicional (→). Esta tautología es el Axioma 2 en el cálculo proposicional de Hilbert-Frege (distribución de la implicación).',
  },
  {
    id: 'id-15',
    orden: 0,
    tipo: 'identify',
    categoria: 'IDENTIFICACIÓN',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el operador dominante en: ¬(¬p ∨ ¬(q ∧ ¬r))',
    nivel: 'dificil',
    fuente: 'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.2)',
    proposicion: '¬(¬p ∨ ¬(q ∧ ¬r))',
    opciones: ['Negación', 'Disyunción', 'Conjunción', 'Condicional', 'Bicondicional'],
    opcionCorrecta: 'Negación',
    explicacion:
      'El operador dominante es la Negación externa (¬), cuyo alcance engloba a toda la disyunción compleja.',
  },
]

/* ==========================================================================
   2. TABLAS DE VERDAD RIGUROSAS (15 Ejercicios)
   Fuentes: Rosen (Cap. 1.3), Copi (Cap. 8.3), Suppes (Cap. 2), Lipschutz (Cap. 10)
   ========================================================================== */

const ejerciciosTablaVerdad: EjercicioTablaVerdad[] = [
  {
    id: 'tt-1',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Construye la tabla de verdad para la Ley de Adición: p → (p ∨ q)',
    nivel: 'facil',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    proposicion: 'p → (p ∨ q)',
    explicacion:
      'Resolución: La disyunción (p ∨ q) es verdadera siempre que p sea V. Si p es F, el condicional p → (p ∨ q) tiene antecedente falso y por tanto es trivialmente verdadero. En las 4 filas el resultado es Verdadero (Tautología).',
  },
  {
    id: 'tt-2',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Construye la tabla de verdad para la Ley de Simplificación: (p ∧ q) → p',
    nivel: 'facil',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 8.3)',
    proposicion: '(p ∧ q) → p',
    explicacion:
      'Resolución: Cuando (p ∧ q) es V, necesariamente p es V, por lo que V → V es V. En los demás casos donde la conjunción es F, el condicional es verdadero por antecedente falso. Resulta en una Tautología.',
  },
  {
    id: 'tt-3',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de verdad: (p ∧ ¬q) → ¬p',
    nivel: 'facil',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.1)',
    proposicion: '(p ∧ ¬q) → ¬p',
    explicacion:
      'Resolución: Para la fila p=V, q=F, tenemos (V ∧ V) → F, lo cual evalúa a Falso. En las filas donde p=F o q=V el antecedente es falso o el consecuente verdadero. La proposición es una Contingencia.',
  },
  {
    id: 'tt-4',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Demuestra la Ley de De Morgan por tabla: ¬(p ∧ q) ↔ (¬p ∨ ¬q)',
    nivel: 'medio',
    fuente: 'Seymour Lipschutz - Teoría de Conjuntos y Temas Afines (Cap. 10)',
    proposicion: '¬(p ∧ q) ↔ (¬p ∨ ¬q)',
    explicacion:
      'Resolución: Se evalúa ¬(p ∧ q) obteniendo [F, V, V, V] y (¬p ∨ ¬q) obteniendo [F, V, V, V]. Al coincidir en todas las filas, el bicondicional final arroja [V, V, V, V] demostrando formalmente la Ley de De Morgan.',
  },
  {
    id: 'tt-5',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Verifica la Ley de Contraposición (Transposición): (p → q) ↔ (¬q → ¬p)',
    nivel: 'medio',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 8.4)',
    proposicion: '(p → q) ↔ (¬q → ¬p)',
    explicacion:
      'Resolución: La tabla para (p → q) es [V, F, V, V]. La tabla para (¬q → ¬p) con los valores invertidos es [V, F, V, V]. Ambas columnas son idénticas en las 4 combinaciones, lo que prueba la equivalencia lógica.',
  },
  {
    id: 'tt-6',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Construye la tabla de verdad: (p ∨ q) ∧ ¬p',
    nivel: 'medio',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.2)',
    proposicion: '(p ∨ q) ∧ ¬p',
    explicacion:
      'Resolución: Se calcula la disyunción (p ∨ q) y se opera mediante conjunción con ¬p. La columna resultante es [F, F, V, F], siendo verdadera únicamente en la fila p=F, q=V.',
  },
  {
    id: 'tt-7',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Demuestra la definición del Bicondicional: (p ↔ q) ↔ ((p → q) ∧ (q → p))',
    nivel: 'medio',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.3)',
    proposicion: '(p ↔ q) ↔ ((p → q) ∧ (q → p))',
    explicacion:
      'Resolución: (p ↔ q) es V cuando p y q tienen el mismo valor. La conjunción (p → q) ∧ (q → p) también evalúa a V exactamente cuando p y q coinciden. La tabla arroja valores verdaderos en todas las filas.',
  },
  {
    id: 'tt-8',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Verifica la validez de la regla Modus Ponens: (p ∧ (p → q)) → q',
    nivel: 'medio',
    fuente: 'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.3)',
    proposicion: '(p ∧ (p → q)) → q',
    explicacion:
      'Resolución: Si p=V y (p → q)=V, entonces q es necesariamente V. En cualquier otro caso el antecedente (p ∧ (p → q)) es Falso. La columna final es [V, V, V, V], demostrando que Modus Ponens es universalmente válido.',
  },
  {
    id: 'tt-9',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Analiza la relación entre disyunción y conjunción: (p ∨ q) → (p ∧ q)',
    nivel: 'medio',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    proposicion: '(p ∨ q) → (p ∧ q)',
    explicacion:
      'Resolución: Para p=V, q=F o p=F, q=V, la disyunción es V pero la conjunción es F, produciendo V → F = Falso. La columna resultante es [V, F, F, V], clasificándose como Contingencia.',
  },
  {
    id: 'tt-10',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Construye la tabla de 3 variables para el Silogismo Hipotético: ((p → q) ∧ (q → r)) → (p → r)',
    nivel: 'dificil',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 8.4)',
    proposicion: '((p → q) ∧ (q → r)) → (p → r)',
    explicacion:
      'Resolución: Se evalúan las 8 combinaciones de las 3 variables (p, q, r). En cada una de las 8 filas, si las dos premisas (p → q) y (q → r) son verdaderas, la conclusión (p → r) es obligatoriamente verdadera (Tautología).',
  },
  {
    id: 'tt-11',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Verifica la Ley de Exportación con 3 variables: (p ∧ q → r) ↔ (p → (q → r))',
    nivel: 'dificil',
    fuente: 'Seymour Lipschutz - Álgebra de Proposiciones (Cap. 10)',
    proposicion: '(p ∧ q → r) ↔ (p → (q → r))',
    explicacion:
      'Resolución: Ambas expresiones solo son falsas en la única combinación p=V, q=V, r=F. En las restantes 7 combinaciones de la tabla de verdad de 3 variables ambas son verdaderas, verificando la equivalencia.',
  },
  {
    id: 'tt-12',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Verifica la validez del Silogismo Disyuntivo: ((p ∨ q) ∧ ¬p) → q',
    nivel: 'dificil',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.4)',
    proposicion: '((p ∨ q) ∧ ¬p) → q',
    explicacion:
      'Resolución: El antecedente ((p ∨ q) ∧ ¬p) solo es verdadero cuando p=F y q=V. En dicha fila el consecuente q es V (V → V = V). En todas las demás filas el antecedente es Falso (F → q = V). Resulta en Tautología.',
  },
  {
    id: 'tt-13',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Demuestra la Ley Distributiva con 3 variables: (p ∨ (q ∧ r)) ↔ ((p ∨ q) ∧ (p ∨ r))',
    nivel: 'dificil',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    proposicion: '(p ∨ (q ∧ r)) ↔ ((p ∨ q) ∧ (p ∨ r))',
    explicacion:
      'Resolución: Se genera la tabla completa de 8 filas para p ∨ (q ∧ r) y para (p ∨ q) ∧ (p ∨ r). Ambas subexpresiones arrojan idénticos valores de verdad en las 8 filas [V, V, V, V, V, F, F, F].',
  },
  {
    id: 'tt-14',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Verifica la equivalencia: (p → (q ∨ r)) ↔ ((p ∧ ¬q) → r)',
    nivel: 'dificil',
    fuente: 'Copi & Cohen - Introducción a la Lógica (Cap. 8.4)',
    proposicion: '(p → (q ∨ r)) ↔ ((p ∧ ¬q) → r)',
    explicacion:
      'Resolución: Mediante álgebra proposicional: p → (q ∨ r) ≡ ¬p ∨ q ∨ r ≡ (¬p ∨ q) ∨ r ≡ ¬(p ∧ ¬q) ∨ r ≡ (p ∧ ¬q) → r. La tabla de 8 filas confirma que las dos columnas son idénticas en todas las asignaciones.',
  },
  {
    id: 'tt-15',
    orden: 0,
    tipo: 'truth-table',
    categoria: 'TABLAS DE VERDAD',
    titulo: 'Ejercicio',
    descripcionCorta: 'Demuestra la validez de la regla Modus Tollens: ((p → q) ∧ ¬q) → ¬p',
    nivel: 'dificil',
    fuente: 'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.3)',
    proposicion: '((p → q) ∧ ¬q) → ¬p',
    explicacion:
      'Resolución: El antecedente ((p → q) ∧ ¬q) es verdadero únicamente cuando p=F y q=F. En esa combinación, ¬p es Verdadero (V → V = V). En las otras 3 combinaciones el antecedente es Falso, garantizando que siempre es Tautología.',
  },
]

/* ==========================================================================
   3. CLASIFICACIÓN SEMÁNTICA: TAUTOLOGÍAS, CONTINGENCIAS Y CONTRADICCIONES (20 Ejercicios)
   Fuentes: Copi (Cap. 8.4), Suppes (Cap. 3), Rosen (Cap. 1.3), Hamilton (Cap. 2)
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
    'facil',
    'Clasifica la regla de Modus Ponens: ((p → q) ∧ p) → q',
    'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    'Es una Tautología. Si p es V y (p → q) es V, por definición de implicación q no puede ser falsa; por tanto, el consecuente q es siempre V. Si el antecedente es F, el condicional es verdadero.',
  ),
  construirEjercicioClasificar(
    'cl-2',
    '((p → q) ∧ ¬q) → ¬p',
    'facil',
    'Clasifica la regla de Modus Tollens: ((p → q) ∧ ¬q) → ¬p',
    'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    'Es una Tautología. Si q es Falso y p → q es Verdadero, p debe ser obligatoriamente Falso, haciendo que ¬p sea Verdadero. La implicación nunca produce V → F.',
  ),
  construirEjercicioClasificar(
    'cl-3',
    '((p ∨ q) ∧ ¬p) → q',
    'facil',
    'Clasifica el Silogismo Disyuntivo: ((p ∨ q) ∧ ¬p) → q',
    'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.2)',
    'Es una Tautología. Al saber que al menos uno de los dos es verdadero (p ∨ q) y que p es falso (¬p), la única opción para satisfacer la conjunción es que q sea verdadero.',
  ),
  construirEjercicioClasificar(
    'cl-4',
    '((p → q) ∧ (q → r)) → (p → r)',
    'medio',
    'Clasifica el Silogismo Hipotético: ((p → q) ∧ (q → r)) → (p → r)',
    'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    'Es una Tautología. Representa la propiedad transitiva de la implicación lógica: si p garantiza q, y q garantiza r, entonces p garantiza directamente r.',
  ),
  construirEjercicioClasificar(
    'cl-5',
    '((p → q) ∧ q) → p',
    'medio',
    'Clasifica la Falacia de Afirmación del Consecuente: ((p → q) ∧ q) → p',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.6)',
    'Es una Contingencia (Falacia formal). Asignando p = Falso y q = Verdadero: (F → V) es V, V ∧ V es V, pero el consecuente p es F, produciendo V → F = Falso.',
  ),
  construirEjercicioClasificar(
    'cl-6',
    '((p → q) ∧ ¬p) → ¬q',
    'medio',
    'Clasifica la Falacia de Negación del Antecedente: ((p → q) ∧ ¬p) → ¬q',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.6)',
    'Es una Contingencia (Falacia formal). Asignando p = Falso y q = Verdadero: (F → V) es V, ¬p es V, V ∧ V es V, pero ¬q es F, produciendo V → F = Falso.',
  ),
  construirEjercicioClasificar(
    'cl-7',
    '(p ∧ q) ∧ ¬p',
    'facil',
    'Clasifica la fórmula: (p ∧ q) ∧ ¬p',
    'Seymour Lipschutz - Teoría de Conjuntos y Temas Afines (Cap. 10)',
    'Es una Contradicción. Reasociando por ley asociativa y conmutativa: (p ∧ ¬p) ∧ q ≡ Falso ∧ q ≡ Falso en todas las combinaciones.',
  ),
  construirEjercicioClasificar(
    'cl-8',
    '((p → q) ∧ (r → s) ∧ (p ∨ r)) → (q ∨ s)',
    'dificil',
    'Clasifica el Dilema Constructivo: ((p → q) ∧ (r → s) ∧ (p ∨ r)) → (q ∨ s)',
    'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    'Es una Tautología. Si p ∨ r es verdadero, al menos uno de los antecedentes (p o r) se cumple; por tanto, por Modus Ponens, al menos uno de los consecuentes (q o s) debe ser verdadero.',
  ),
  construirEjercicioClasificar(
    'cl-9',
    '((p → q) → p) → p',
    'dificil',
    'Clasifica la Ley de Peirce: ((p → q) → p) → p',
    'A. G. Hamilton - Logic for Mathematicians (Cap. 2)',
    'Es una Tautología. Si p es V, el condicional externo tiene consecuente V y es V. Si p es F, p → q es V (F → q = V), entonces (p → q) → p evalúa a V → F = F; luego F → F = V. En ambos casos resulta siempre Verdadero.',
  ),
  construirEjercicioClasificar(
    'cl-10',
    '(p → q) ∧ (p ∧ ¬q)',
    'medio',
    'Clasifica la fórmula: (p → q) ∧ (p ∧ ¬q)',
    'Seymour Lipschutz - Álgebra de Proposiciones (Cap. 10)',
    'Es una Contradicción. La fórmula p → q es equivalente a ¬(p ∧ ¬q). Por lo tanto, la expresión tiene la forma A ∧ ¬A, que es universalmente falsa.',
  ),
  construirEjercicioClasificar(
    'cl-11',
    '(p ↔ q) ↔ ((p ∧ q) ∨ (¬p ∧ ¬q))',
    'medio',
    'Clasifica la descomposición disyuntiva del bicondicional: (p ↔ q) ↔ ((p ∧ q) ∨ (¬p ∧ ¬q))',
    'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.3)',
    'Es una Tautología. Ambas ramas evalúan a Verdadero si y solo si p y q poseen exactamente el mismo valor de verdad.',
  ),
  construirEjercicioClasificar(
    'cl-12',
    '(p ∨ q) → (p ∧ q)',
    'medio',
    'Clasifica la implicación de disyunción a conjunción: (p ∨ q) → (p ∧ q)',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    'Es una Contingencia. Cuando p = V y q = F, la disyunción (V ∨ F) es V, pero la conjunción (V ∧ F) es F, resultando en V → F = Falso.',
  ),
  construirEjercicioClasificar(
    'cl-13',
    '(p → q) ↔ (q → p)',
    'medio',
    'Clasifica la equivalencia con la recíproca: (p → q) ↔ (q → p)',
    'Copi & Cohen - Introducción a la Lógica (Cap. 8.4)',
    'Es una Contingencia. Un condicional no es en general equivalente a su recíproca (por ejemplo, si p = V y q = F, p → q es F pero q → p es V, haciendo el bicondicional Falso).',
  ),
  construirEjercicioClasificar(
    'cl-14',
    '(p ∧ ¬q) ∧ (¬p ∨ q)',
    'medio',
    'Clasifica la fórmula: (p ∧ ¬q) ∧ (¬p ∨ q)',
    'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.1)',
    'Es una Contradicción. Por Ley de De Morgan, ¬p ∨ q ≡ ¬(p ∧ ¬q). La expresión es de la forma X ∧ ¬X, lo cual siempre es Falso.',
  ),
  construirEjercicioClasificar(
    'cl-15',
    '(p → (q ∧ ¬q)) → ¬p',
    'dificil',
    'Clasifica el principio de Reducción al Absurdo: (p → (q ∧ ¬q)) → ¬p',
    'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.5)',
    'Es una Tautología. Si asumir p conduce a una contradicción demostrable (q ∧ ¬q), entonces p debe ser necesariamente falsa (¬p es verdadera).',
  ),
  construirEjercicioClasificar(
    'cl-16',
    '(p ∧ (q ∨ r)) ↔ ((p ∧ q) ∨ (p ∧ r))',
    'dificil',
    'Clasifica la Ley Distributiva de la conjunción: (p ∧ (q ∨ r)) ↔ ((p ∧ q) ∨ (p ∧ r))',
    'Seymour Lipschutz - Teoría de Conjuntos y Temas Afines (Cap. 10)',
    'Es una Tautología. Corresponde a uno de los axiomas fundamentales del álgebra de Boole y la lógica proposicional clásica.',
  ),
  construirEjercicioClasificar(
    'cl-17',
    'p ↔ (p ∨ q)',
    'medio',
    'Clasifica la fórmula: p ↔ (p ∨ q)',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    'Es una Contingencia. Si p = F y q = V, el miembro izquierdo es F y el derecho es V, resultando en Falso. Si p = V o si ambos son F, evalúa a Verdadero.',
  ),
  construirEjercicioClasificar(
    'cl-18',
    '(p ∧ ¬p) ∧ (q ∨ ¬q)',
    'facil',
    'Clasifica el producto de contradicción y tautología: (p ∧ ¬p) ∧ (q ∨ ¬q)',
    'Copi & Cohen - Introducción a la Lógica (Cap. 8.4)',
    'Es una Contradicción. (p ∧ ¬p) es Falso en todas las interpretaciones; al operar Falso ∧ Tautología el resultado es siempre Falso.',
  ),
  construirEjercicioClasificar(
    'cl-19',
    '((p ∨ q) ∧ ¬q) ↔ (p ∧ ¬q)',
    'dificil',
    'Clasifica la equivalencia de absorción disyuntiva: ((p ∨ q) ∧ ¬q) ↔ (p ∧ ¬q)',
    'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.2)',
    'Es una Tautología. Al distribuir ¬q: (p ∧ ¬q) ∨ (q ∧ ¬q) ≡ (p ∧ ¬q) ∨ Falso ≡ (p ∧ ¬q). Ambos lados son estrictamente idénticos.',
  ),
  construirEjercicioClasificar(
    'cl-20',
    '(p → (q → r)) ↔ (q → (p → r))',
    'dificil',
    'Clasifica la Ley de Permutación de Premisas: (p → (q → r)) ↔ (q → (p → r))',
    'A. G. Hamilton - Logic for Mathematicians (Cap. 2)',
    'Es una Tautología. Por definición condicional y asociatividad: p → (q → r) ≡ ¬p ∨ ¬q ∨ r ≡ ¬q ∨ ¬p ∨ r ≡ q → (p → r).',
  ),
]

/* ==========================================================================
   4. LEYES LÓGICAS Y ÁLGEBRA PROPOSICIONAL (15 Ejercicios)
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
      'Ley de De Morgan: La negación de una conjunción es lógicamente equivalente a la disyunción de las proposiciones negadas individualmente.',
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
      'Ley de Absorción: Cuando una variable fuera del paréntesis se combina por conjunción con una disyunción que contiene a esa misma variable, la expresión se reduce directamente a dicha variable.',
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
      'Ley de Absorción (forma con negación): Al distribuir p ∨ (¬p ∧ q) se obtiene (p ∨ ¬p) ∧ (p ∨ q) ≡ V ∧ (p ∨ q) ≡ p ∨ q.',
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
      'Ley de Trasposición (o Contraposición): Toda implicación condicional equivale a invertir el antecedente y el consecuente negando ambos términos.',
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
      'Ley de Exportación: Expresa que requerir dos condiciones simultáneas para una consecuencia es equivalente a que la primera condición implique que la segunda produce la consecuencia.',
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
      'Ley Distributiva: La disyunción se distribuye sobre la conjunción, análogo al producto sobre la suma en el álgebra elemental.',
  },
  {
    id: 'law-7',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la regla de definición del condicional: p → q ≡ ¬p ∨ q',
    nivel: 'medio',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.3)',
    proposicion: 'p → q ≡ ¬p ∨ q',
    opciones: ['Ley de Implicación Material', 'Ley de De Morgan', 'Ley de Absorción', 'Ley de Identidad', 'Ley de Idempotencia'],
    opcionCorrecta: 'Ley de Implicación Material',
    explicacion:
      'Ley de Implicación Material (o Definición del Condicional): Transforma una condicional p → q en la disyunción equivalente ¬p ∨ q.',
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
      'Negación del Condicional: Negar que p implique q equivale a demostrar que ocurre el antecedente p y no ocurre el consecuente q (p ∧ ¬q).',
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
      'Ley de Definición del Bicondicional: Descompone la doble implicación en la conjunción de los dos condicionales directo y recíproco.',
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
      'Ley de Expansión Booleana (o Reducción por Factorización): Factorizando p por distributividad inversa: p ∧ (q ∨ ¬q) ≡ p ∧ V ≡ p.',
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
      'Aplicando primero absorción en el interior p ∨ (¬p ∧ q) ≡ p ∨ q, y luego la Ley de De Morgan: ¬(p ∨ q) ≡ ¬p ∧ ¬q.',
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
      'Ley Asociativa: Permite reordenar los paréntesis de agrupación en una secuencia de proposiciones unidas por el mismo operador.',
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
      'Ley de Absorción: La presencia de la variable p en conjunción con una disyunción que contiene a p absorbe cualquier término adicional (¬q).',
  },
  {
    id: 'law-14',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley fundamental en: p ∨ ¬p ≡ V',
    nivel: 'facil',
    fuente: 'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.1)',
    proposicion: 'p ∨ ¬p ≡ V',
    opciones: ['Ley del Tercero Excluido', 'Ley de Contradicción', 'Ley de Idempotencia', 'Ley de Absorción', 'Ley Conmutativa'],
    opcionCorrecta: 'Ley del Tercero Excluido',
    explicacion:
      'Ley del Tercero Excluido (Principio de Tertium Non Datur): Toda proposición o bien es verdadera o bien es falsa, sin una tercera alternativa.',
  },
  {
    id: 'law-15',
    orden: 0,
    tipo: 'law',
    categoria: 'LEYES LÓGICAS',
    titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley fundamental en: p ∧ ¬p ≡ F',
    nivel: 'facil',
    fuente: 'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    proposicion: 'p ∧ ¬p ≡ F',
    opciones: ['Ley de Contradicción', 'Ley del Tercero Excluido', 'Ley de Idempotencia', 'Ley de Identidad', 'Ley de Absorción'],
    opcionCorrecta: 'Ley de Contradicción',
    explicacion:
      'Ley de No Contradicción: Una proposición no puede ser simultáneamente verdadera y falsa en el mismo contexto.',
  },
]

/* ==========================================================================
   5. CUESTIONARIOS DE EVALUACIÓN SEMÁNTICA CON ASIGNACIONES (15 Bloques de Ejercicios)
   Fuentes: Copi (Cap. 8.2), Suppes (Cap. 1), Rosen (Cap. 1.1), Epp (Cap. 2.2)
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
    'Cuestionario: Evaluación de conectivos básicos con asignación',
    'facil',
    'Copi & Cohen - Introducción a la Lógica (Cap. 8.2)',
    [
      construirPreguntaQuiz('p ∧ q', { P: true, Q: false }, 'p ∧ q con p=V y q=F es Falso porque la conjunción requiere que ambos términos sean verdaderos.'),
      construirPreguntaQuiz('p ∨ q', { P: false, Q: false }, 'p ∨ q con p=F y q=F es Falso porque la disyunción requiere que al menos uno sea verdadero.'),
      construirPreguntaQuiz('¬p', { P: true }, '¬p con p=V es Falso porque la negación invierte el valor de verdad.'),
      construirPreguntaQuiz('p → q', { P: true, Q: false }, 'p → q con p=V y q=F es Falso porque un condicional solo es falso con antecedente V y consecuente F.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-2',
    'Ejercicio',
    'Cuestionario: Evaluación de bicondicional y negaciones',
    'facil',
    'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 1.2)',
    [
      construirPreguntaQuiz('p ↔ q', { P: false, Q: false }, 'p ↔ q con p=F y q=F es Verdadero porque ambos operandos tienen el mismo valor de verdad.'),
      construirPreguntaQuiz('¬p ∨ q', { P: false, Q: false }, '¬p es V, luego V ∨ F evalúa a Verdadero.'),
      construirPreguntaQuiz('p ∧ ¬q', { P: true, Q: true }, '¬q es F, luego V ∧ F evalúa a Falso.'),
      construirPreguntaQuiz('p → q', { P: false, Q: false }, 'Condicional con antecedente falso (p=F) es Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-3',
    'Ejercicio',
    'Cuestionario: Expresiones con negaciones compuestas',
    'medio',
    'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.2)',
    [
      construirPreguntaQuiz('¬(p ∧ q)', { P: true, Q: true }, 'p ∧ q es V, por tanto su negación ¬(V) es Falso.'),
      construirPreguntaQuiz('¬(p ∨ q)', { P: false, Q: false }, 'p ∨ q es F, por tanto su negación ¬(F) es Verdadero.'),
      construirPreguntaQuiz('¬p ∧ ¬q', { P: false, Q: false }, '¬p es V y ¬q es V, luego V ∧ V es Verdadero.'),
      construirPreguntaQuiz('p → ¬q', { P: true, Q: true }, '¬q es F, entonces V → F es Falso.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-4',
    'Ejercicio',
    'Cuestionario: Condicionales anidados con 2 variables',
    'medio',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.1)',
    [
      construirPreguntaQuiz('p → (q ∨ p)', { P: true, Q: false }, 'q ∨ p es V, por tanto V → V es Verdadero.'),
      construirPreguntaQuiz('¬q → p', { P: false, Q: false }, '¬q es V, entonces V → F es Falso.'),
      construirPreguntaQuiz('(p ∧ q) ∨ ¬p', { P: false, Q: true }, 'p ∧ q es F, pero ¬p es V, resultando en F ∨ V = Verdadero.'),
      construirPreguntaQuiz('p ↔ ¬q', { P: true, Q: true }, '¬q es F; p(V) ↔ ¬q(F) tienen valores distintos, resultando en Falso.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-5',
    'Ejercicio',
    'Cuestionario: Fórmulas de 3 variables (p, q, r)',
    'medio',
    'Copi & Cohen - Introducción a la Lógica (Cap. 8.2)',
    [
      construirPreguntaQuiz('p ∧ q → r', { P: true, Q: true, R: false }, 'p ∧ q es V; luego V → F (r) evalúa a Falso.'),
      construirPreguntaQuiz('(p ∨ q) ∧ r', { P: false, Q: true, R: true }, 'p ∨ q es V; luego V ∧ V (r) evalúa a Verdadero.'),
      construirPreguntaQuiz('p → (q → r)', { P: true, Q: false, R: false }, 'q → r es V (F → F); luego V → V evalúa a Verdadero.'),
      construirPreguntaQuiz('¬p ∨ (q ∧ r)', { P: true, Q: true, R: false }, '¬p es F y q ∧ r es F; F ∨ F evalúa a Falso.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-6',
    'Ejercicio',
    'Cuestionario: Bicondicionales y conjunciones con 3 variables',
    'medio',
    'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 1.3)',
    [
      construirPreguntaQuiz('(p ↔ q) ∧ r', { P: true, Q: true, R: false }, 'p ↔ q es V; pero V ∧ F (r) evalúa a Falso.'),
      construirPreguntaQuiz('p ∧ ¬q ∧ r', { P: true, Q: false, R: true }, '¬q es V; luego V ∧ V ∧ V evalúa a Verdadero.'),
      construirPreguntaQuiz('¬(p ∧ q) ∨ r', { P: true, Q: true, R: false }, 'p ∧ q es V, su negación es F; luego F ∨ F (r) es Falso.'),
      construirPreguntaQuiz('(p ∨ ¬q) → r', { P: false, Q: true, R: false }, 'p ∨ ¬q es F ∨ F = F; un condicional con antecedente F es Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-7',
    'Ejercicio',
    'Cuestionario: Fórmulas compuestas de examen universitario',
    'dificil',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.2)',
    [
      construirPreguntaQuiz('(p ∨ q) → (r ∧ p)', { P: true, Q: false, R: true }, 'Antecedente (V ∨ F) = V. Consecuente (V ∧ V) = V. V → V evalúa a Verdadero.'),
      construirPreguntaQuiz('¬(p ↔ q) ∨ r', { P: true, Q: true, R: false }, 'p ↔ q es V, su negación es F; F ∨ F (r) evalúa a Falso.'),
      construirPreguntaQuiz('(p ∧ ¬r) ∨ (q ∧ r)', { P: false, Q: true, R: true }, 'p ∧ ¬r es F; q ∧ r es V ∧ V = V; luego F ∨ V evalúa a Verdadero.'),
      construirPreguntaQuiz('p → (q ↔ r)', { P: true, Q: false, R: false }, 'q ↔ r es V (F ↔ F); luego V → V evalúa a Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-8',
    'Ejercicio',
    'Cuestionario: Evaluación de negaciones anidadas y disyunción',
    'dificil',
    'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.2)',
    [
      construirPreguntaQuiz('¬p ∧ (q ∨ ¬r)', { P: false, Q: false, R: true }, '¬p es V; q ∨ ¬r es F ∨ F = F; luego V ∧ F evalúa a Falso.'),
      construirPreguntaQuiz('(p → q) ∧ (q → r)', { P: true, Q: true, R: false }, 'p → q es V; q → r es F (V → F); luego V ∧ F evalúa a Falso.'),
      construirPreguntaQuiz('¬(p ∨ ¬q) ↔ (¬p ∧ q)', { P: false, Q: true, R: false }, '¬(F ∨ F) = V; ¬p ∧ q = V ∧ V = V; V ↔ V evalúa a Verdadero.'),
      construirPreguntaQuiz('(p ∧ q) → (p ∨ r)', { P: false, Q: true, R: false }, 'Antecedente p ∧ q es Falso, garantizando que el condicional es Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-9',
    'Ejercicio',
    'Cuestionario: Evaluación semántica de transitividad e implicaciones',
    'dificil',
    'Copi & Cohen - Introducción a la Lógica (Cap. 8.2)',
    [
      construirPreguntaQuiz('((p → q) ∧ p) → q', { P: true, Q: false }, 'Al ser una tautología (Modus Ponens), evalúa a Verdadero bajo toda asignación.'),
      construirPreguntaQuiz('(p ↔ q) ∧ (q ↔ r)', { P: true, Q: true, R: false }, 'p ↔ q es V; q ↔ r es F; luego V ∧ F evalúa a Falso.'),
      construirPreguntaQuiz('¬(p → (q ∧ r))', { P: true, Q: true, R: true }, 'p → (q ∧ r) es V → V = V; por tanto su negación evalúa a Falso.'),
      construirPreguntaQuiz('(p ∨ ¬q) ∧ (q ∨ ¬r)', { P: false, Q: false, R: true }, 'p ∨ ¬q es V; q ∨ ¬r es F ∨ F = F; luego V ∧ F evalúa a Falso.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-10',
    'Ejercicio',
    'Cuestionario: Fórmulas de 3 variables con conectivos mixtos',
    'dificil',
    'Seymour Lipschutz - Álgebra de Proposiciones (Cap. 10)',
    [
      construirPreguntaQuiz('(p ∧ q) ∨ (¬p ∧ ¬r)', { P: true, Q: false, R: false }, 'p ∧ q es F; ¬p ∧ ¬r es F ∧ V = F; luego F ∨ F evalúa a Falso.'),
      construirPreguntaQuiz('p → (¬q ∨ r)', { P: true, Q: true, R: false }, '¬q ∨ r es F ∨ F = F; luego V → F evalúa a Falso.'),
      construirPreguntaQuiz('(p ↔ ¬q) → r', { P: true, Q: false, R: false }, 'p ↔ ¬q es V ↔ V = V; luego V → F (r) evalúa a Falso.'),
      construirPreguntaQuiz('¬p ∨ (q → r)', { P: true, Q: false, R: true }, 'q → r es F → V = V; luego F ∨ V evalúa a Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-11',
    'Ejercicio',
    'Cuestionario: Álgebra Booleana y evaluación lógica',
    'dificil',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.2)',
    [
      construirPreguntaQuiz('p ∧ (q ∨ ¬r) → (p ∧ q)', { P: true, Q: false, R: false }, 'Antecedente: V ∧ (F ∨ V) = V. Consecuente: V ∧ F = F. V → F evalúa a Falso.'),
      construirPreguntaQuiz('(p → q) ∨ (q → r)', { P: true, Q: false, R: false }, 'p → q es F; q → r es F → F = V; luego F ∨ V evalúa a Verdadero.'),
      construirPreguntaQuiz('¬(p ∧ q ∧ r)', { P: true, Q: true, R: false }, 'La conjunción de las 3 variables es Falso, por lo que su negación es Verdadero.'),
      construirPreguntaQuiz('(p ∨ q ∨ r) ∧ ¬p ∧ ¬q', { P: false, Q: false, R: true }, 'p ∨ q ∨ r es V; ¬p es V; ¬q es V; luego V ∧ V ∧ V evalúa a Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-12',
    'Ejercicio',
    'Cuestionario: Equivalencias avanzadas y condicionales',
    'dificil',
    'Suppes & Hill - Primer Curso de Lógica Matemática (Cap. 2.1)',
    [
      construirPreguntaQuiz('¬((p ∨ q) ∧ ¬r)', { P: true, Q: false, R: true }, '(p ∨ q) es V; ¬r es F; V ∧ F = F; su negación evalúa a Verdadero.'),
      construirPreguntaQuiz('(p → (q ∨ r)) ↔ ((p → q) ∨ (p → r))', { P: true, Q: false, R: true }, 'Ambos miembros evalúan a Verdadero; por tanto el bicondicional es Verdadero.'),
      construirPreguntaQuiz('(p ∧ ¬q) → (r ∨ ¬p)', { P: true, Q: true, R: false }, 'Antecedente p ∧ ¬q es Falso, garantizando que el condicional evalúa a Verdadero.'),
      construirPreguntaQuiz('(p ↔ q) ↔ (¬p ↔ ¬q)', { P: true, Q: false, R: false }, 'Ambos bicondicionales evalúan a Falso; F ↔ F evalúa a Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-13',
    'Ejercicio',
    'Cuestionario: Razonamiento deductivo con 3 premisas',
    'dificil',
    'Copi & Cohen - Introducción a la Lógica (Cap. 9.1)',
    [
      construirPreguntaQuiz('((p ∨ q) ∧ ¬p) → q', { P: true, Q: false, R: false }, 'Es una tautología válida (Silogismo Disyuntivo), evalúa a Verdadero.'),
      construirPreguntaQuiz('((p → q) ∧ ¬q) → ¬p', { P: false, Q: false, R: false }, 'Es una tautología válida (Modus Tollens), evalúa a Verdadero.'),
      construirPreguntaQuiz('((p → q) ∧ q) → p', { P: false, Q: true, R: false }, 'Falacia formal: p → q es V, q es V, pero p es F, produciendo Falso.'),
      construirPreguntaQuiz('((p → q) ∧ ¬p) → ¬q', { P: false, Q: true, R: false }, 'Falacia formal: p → q es V, ¬p es V, pero ¬q es F, produciendo Falso.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-14',
    'Ejercicio',
    'Cuestionario: Expresiones con negación de implicaciones',
    'dificil',
    'Susanna S. Epp - Discrete Mathematics with Applications (Cap. 2.2)',
    [
      construirPreguntaQuiz('¬(p → q) ↔ (p ∧ ¬q)', { P: true, Q: false, R: false }, 'Equivalencia lógica exacta: ambos lados evalúan a Verdadero, resultando en Verdadero.'),
      construirPreguntaQuiz('(p ∧ q → r) → (p → r)', { P: true, Q: false, R: false }, 'p ∧ q → r es V (F → F); p → r es F (V → F); luego V → F evalúa a Falso.'),
      construirPreguntaQuiz('(p ↔ ¬p) ∨ (q ↔ q)', { P: true, Q: false, R: false }, 'p ↔ ¬p es F; q ↔ q es V; luego F ∨ V evalúa a Verdadero.'),
      construirPreguntaQuiz('¬(p ∧ (q ∨ r))', { P: true, Q: false, R: false }, 'q ∨ r es F; p ∧ F = F; luego la negación evalúa a Verdadero.'),
    ],
  ),
  crearEjercicioQuiz(
    'quiz-15',
    'Ejercicio',
    'Cuestionario: Desafío integral de lógica simbólica universitaria',
    'dificil',
    'Kenneth H. Rosen - Discrete Mathematics (Cap. 1.3)',
    [
      construirPreguntaQuiz('((p → q) ∧ (r → s) ∧ (p ∨ r)) → (q ∨ s)', { P: true, Q: false, R: false, S: true }, 'Tautología del Dilema Constructivo: evalúa a Verdadero en todas las interpretaciones.'),
      construirPreguntaQuiz('(p ∧ ¬p) → (q ∧ r)', { P: true, Q: false, R: false }, 'Principio de Explosión (Ex Falso Quodlibet): antecedente contradictorio F implica cualquier fórmula: Verdadero.'),
      construirPreguntaQuiz('(p ∨ ¬p) ∧ (q ∨ ¬q) ∧ (r ∨ ¬r)', { P: false, Q: true, R: false }, 'Conjunción de 3 instancias del Tercero Excluido (V ∧ V ∧ V) evalúa a Verdadero.'),
      construirPreguntaQuiz('((p → q) → p) → p', { P: false, Q: true, R: false }, 'Tautología de la Ley de Peirce: evalúa universalmente a Verdadero.'),
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
