import {
  parsearProposicion,
  evaluar,
  recolectarVariables,
  clasificarProposicion,
  generarFilas,
  nodoATexto,
  type ClasificacionProposicion,
  type NodoExpresion,
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

interface BaseEjercicio {
  id: string
  orden: number
  categoria: 'IDENTIFICACIÓN' | 'TABLAS DE VERDAD' | 'CLASIFICACIÓN' | 'LEYES LÓGICAS' | 'CUESTIONARIO'
  titulo: string
  descripcionCorta: string
  nivel: Dificultad
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
}

export type Ejercicio = EjercicioTablaVerdad | EjercicioLey | EjercicioQuiz | EjercicioIdentificar | EjercicioClasificar

export type ClaveTema = 'identificacion' | 'tablas-verdad' | 'clasificacion' | 'leyes-logicas' | 'cuestionario'

export const etiquetasTema: Record<ClaveTema, string> = {
  identificacion: 'Identificación de proposiciones',
  'tablas-verdad': 'Tablas de verdad',
  clasificacion: 'Tautología, contradicción y contingencia',
  'leyes-logicas': 'Leyes lógicas',
  cuestionario: 'Cuestionarios de evaluación',
}

export function claveTemaParaEjercicio(ex: Ejercicio): ClaveTema {
  switch (ex.tipo) {
    case 'identify': return 'identificacion'
    case 'truth-table': return 'tablas-verdad'
    case 'classify': return 'clasificacion'
    case 'law': return 'leyes-logicas'
    case 'quiz': return 'cuestionario'
  }
}

const OPCIONES_CLASIFICACION: ClasificacionProposicion[] = ['tautologia', 'contradiccion', 'contingencia']

export function clasificacionCorrecta(proposicion: string): ClasificacionProposicion {
  return clasificarProposicion(parsearProposicion(proposicion)).clasificacion
}

const OPCIONES_QUIZ = ['VERDADERO', 'FALSO', 'NO SE PUEDE DETERMINAR', 'LA PROPOSICIÓN ES INVÁLIDA']

function construirPreguntaQuiz(proposicion: string, asignacion: Record<string, boolean>): PreguntaQuiz {
  const vars = recolectarVariables(parsearProposicion(proposicion))
  const textoAsignacion = vars.map((v) => `${v.toLowerCase()} = ${asignacion[v] ? 'Verdadero' : 'Falso'}`).join(' y ')
  return {
    enunciado: '¿Cuál es el valor de verdad de la siguiente proposición?',
    proposicion,
    textoAsignacion: `Si ${textoAsignacion}`,
    asignacion,
    explicacion: `Sustituyendo los valores dados en (${proposicion}) se obtiene ${
      evaluar(parsearProposicion(proposicion), asignacion) ? 'Verdadero' : 'Falso'
    }.`,
  }
}

const preguntasQuiz1: PreguntaQuiz[] = [
  construirPreguntaQuiz('p ∧ q', { P: true, Q: false }),
  construirPreguntaQuiz('p ∨ q', { P: false, Q: false }),
  construirPreguntaQuiz('¬p', { P: true }),
  construirPreguntaQuiz('p → q', { P: true, Q: false }),
  construirPreguntaQuiz('p ↔ q', { P: false, Q: false }),
  construirPreguntaQuiz('p ∨ q', { P: true, Q: false }),
  construirPreguntaQuiz('p ∧ ¬q', { P: true, Q: true }),
  construirPreguntaQuiz('¬p ∨ q', { P: false, Q: false }),
  construirPreguntaQuiz('p → q', { P: false, Q: false }),
  construirPreguntaQuiz('p ↔ q', { P: true, Q: true }),
]

const preguntasQuiz2: PreguntaQuiz[] = [
  construirPreguntaQuiz('p ∧ q', { P: true, Q: true }),
  construirPreguntaQuiz('p ∨ q', { P: false, Q: true }),
  construirPreguntaQuiz('¬p', { P: false }),
  construirPreguntaQuiz('p → q', { P: false, Q: true }),
]

const preguntasQuiz3: PreguntaQuiz[] = [
  construirPreguntaQuiz('p ∨ q', { P: false, Q: false }),
  construirPreguntaQuiz('p ∧ q', { P: false, Q: true }),
  construirPreguntaQuiz('¬p', { P: true }),
  construirPreguntaQuiz('p ↔ q', { P: true, Q: false }),
]

const preguntasQuiz4: PreguntaQuiz[] = [
  construirPreguntaQuiz('p ∧ ¬q', { P: true, Q: false }),
  construirPreguntaQuiz('¬p ∨ ¬q', { P: true, Q: true }),
  construirPreguntaQuiz('p → ¬q', { P: true, Q: false }),
  construirPreguntaQuiz('¬(p ∧ q)', { P: true, Q: true }),
  construirPreguntaQuiz('¬p ↔ q', { P: false, Q: false }),
  construirPreguntaQuiz('p ∨ ¬q', { P: false, Q: true }),
]

const preguntasQuiz5: PreguntaQuiz[] = [
  construirPreguntaQuiz('¬p ∧ q', { P: false, Q: true }),
  construirPreguntaQuiz('p ↔ ¬q', { P: true, Q: true }),
  construirPreguntaQuiz('¬(p ∨ q)', { P: false, Q: false }),
  construirPreguntaQuiz('p → (q ∨ p)', { P: true, Q: false }),
  construirPreguntaQuiz('¬q → p', { P: false, Q: false }),
  construirPreguntaQuiz('(p ∧ q) ∨ ¬p', { P: false, Q: true }),
]

const preguntasQuiz6: PreguntaQuiz[] = [
  construirPreguntaQuiz('p ∧ q → r', { P: true, Q: true, R: false }),
  construirPreguntaQuiz('(p ∨ q) ∧ r', { P: false, Q: true, R: true }),
  construirPreguntaQuiz('p → (q → r)', { P: true, Q: false, R: false }),
  construirPreguntaQuiz('¬p ∨ (q ∧ r)', { P: true, Q: true, R: false }),
  construirPreguntaQuiz('(p ↔ q) ∧ r', { P: true, Q: true, R: false }),
  construirPreguntaQuiz('p ∧ ¬q ∧ r', { P: true, Q: false, R: true }),
  construirPreguntaQuiz('¬(p ∧ q) ∨ r', { P: true, Q: true, R: false }),
  construirPreguntaQuiz('(p ∨ ¬q) → r', { P: false, Q: true, R: false }),
]

const ejerciciosIdentificar: EjercicioIdentificar[] = [
  {
    id: 'id-1', orden: 0, tipo: 'identify', categoria: 'IDENTIFICACIÓN', titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el tipo de proposición: ¬p', nivel: 'facil', proposicion: '¬p',
    opciones: ['Negación', 'Conjunción', 'Disyunción', 'Condicional', 'Bicondicional'],
    opcionCorrecta: 'Negación',
    explicacion: 'El símbolo ¬ antepuesto a una proposición indica su negación: invierte su valor de verdad.',
  },
  {
    id: 'id-2', orden: 0, tipo: 'identify', categoria: 'IDENTIFICACIÓN', titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el tipo de proposición: p ∧ q', nivel: 'facil', proposicion: 'p ∧ q',
    opciones: ['Conjunción', 'Disyunción', 'Negación', 'Condicional', 'Bicondicional'],
    opcionCorrecta: 'Conjunción',
    explicacion: 'El símbolo ∧ une dos proposiciones en una conjunción: solo es verdadera si ambas lo son.',
  },
  {
    id: 'id-3', orden: 0, tipo: 'identify', categoria: 'IDENTIFICACIÓN', titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el tipo de proposición: p ∨ q', nivel: 'facil', proposicion: 'p ∨ q',
    opciones: ['Disyunción', 'Conjunción', 'Negación', 'Condicional', 'Bicondicional'],
    opcionCorrecta: 'Disyunción',
    explicacion: 'El símbolo ∨ une dos proposiciones en una disyunción: es verdadera si al menos una lo es.',
  },
  {
    id: 'id-4', orden: 0, tipo: 'identify', categoria: 'IDENTIFICACIÓN', titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el tipo de proposición: p → q', nivel: 'facil', proposicion: 'p → q',
    opciones: ['Condicional', 'Bicondicional', 'Conjunción', 'Disyunción', 'Negación'],
    opcionCorrecta: 'Condicional',
    explicacion: 'El símbolo → forma un condicional: solo es falso cuando el antecedente es V y el consecuente F.',
  },
  {
    id: 'id-5', orden: 0, tipo: 'identify', categoria: 'IDENTIFICACIÓN', titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el tipo de proposición: p ↔ q', nivel: 'facil', proposicion: 'p ↔ q',
    opciones: ['Bicondicional', 'Condicional', 'Conjunción', 'Disyunción', 'Negación'],
    opcionCorrecta: 'Bicondicional',
    explicacion: 'El símbolo ↔ forma un bicondicional: es verdadero cuando ambas proposiciones tienen el mismo valor.',
  },
  {
    id: 'id-6', orden: 0, tipo: 'identify', categoria: 'IDENTIFICACIÓN', titulo: 'Ejercicio',
    descripcionCorta: 'Identifica el tipo de proposición: ¬p ∨ q', nivel: 'medio', proposicion: '¬p ∨ q',
    opciones: ['Disyunción', 'Condicional', 'Conjunción', 'Bicondicional', 'Negación'],
    opcionCorrecta: 'Disyunción',
    explicacion: 'El operador principal es ∨, así que es una disyunción, aunque uno de sus miembros esté negado.',
  },
]

function construirEjercicioClasificar(
  id: string,
  proposicion: string,
  nivel: Dificultad,
  descripcionCorta: string,
): EjercicioClasificar {
  return {
    id, orden: 0, tipo: 'classify', categoria: 'CLASIFICACIÓN', titulo: 'Ejercicio',
    descripcionCorta, nivel, proposicion,
  }
}

const ejerciciosClasificar: EjercicioClasificar[] = [
  construirEjercicioClasificar('cl-1', 'p ∨ ¬p', 'medio', 'Clasifica: p ∨ ¬p'),
  construirEjercicioClasificar('cl-2', 'p ∧ ¬p', 'medio', 'Clasifica: p ∧ ¬p'),
  construirEjercicioClasificar('cl-3', 'p → q', 'medio', 'Clasifica: p → q'),
  construirEjercicioClasificar('cl-4', '(p ∧ q) → p', 'dificil', 'Clasifica: (p ∧ q) → p'),
  construirEjercicioClasificar('cl-5', '(p ∨ q) ∧ ¬p ∧ ¬q', 'dificil', 'Clasifica: (p ∨ q) ∧ ¬p ∧ ¬q'),
  construirEjercicioClasificar('cl-6', '(p → q) ↔ (¬q → ¬p)', 'dificil', 'Clasifica: (p → q) ↔ (¬q → ¬p)'),
]

export const ejercicios: Ejercicio[] = [
  ...ejerciciosIdentificar,
  {
    id: 'tt-1', orden: 1, tipo: 'truth-table', categoria: 'TABLAS DE VERDAD', titulo: 'Ejercicio 1',
    descripcionCorta: 'Completa la tabla de verdad (p v q)', nivel: 'facil', proposicion: 'p ∨ q',
  },
  {
    id: 'law-1', orden: 2, tipo: 'law', categoria: 'LEYES LÓGICAS', titulo: 'Ejercicio 2',
    descripcionCorta: 'Identifica la ley lógica que se debe utilizar', nivel: 'medio',
    proposicion: '¬(p ∧ q)',
    opciones: ['Ley de De Morgan', 'Ley Distributiva', 'Ley Conmutativa', 'Ley Asociativa', 'Ley de Absorción'],
    opcionCorrecta: 'Ley de De Morgan',
    explicacion: 'La negación de una conjunción se transforma en la disyunción de las negaciones: ¬(p ∧ q) ≡ ¬p ∨ ¬q.',
  },
  {
    id: 'quiz-1', orden: 3, tipo: 'quiz', categoria: 'CUESTIONARIO', titulo: 'Ejercicio 3',
    descripcionCorta: 'Resuelve un bloque de 10 preguntas', nivel: 'dificil', preguntas: preguntasQuiz1,
  },
  {
    id: 'tt-2', orden: 4, tipo: 'truth-table', categoria: 'TABLAS DE VERDAD', titulo: 'Ejercicio 4',
    descripcionCorta: 'Completa la tabla de verdad (p ∧ q)', nivel: 'facil', proposicion: 'p ∧ q',
  },
  {
    id: 'law-2', orden: 5, tipo: 'law', categoria: 'LEYES LÓGICAS', titulo: 'Ejercicio 5',
    descripcionCorta: 'Identifica la ley lógica que se debe utilizar', nivel: 'medio',
    proposicion: 'p ∧ (p ∨ q)',
    opciones: ['Ley de Absorción', 'Ley Distributiva', 'Ley Conmutativa', 'Ley de Identidad', 'Ley de Idempotencia'],
    opcionCorrecta: 'Ley de Absorción',
    explicacion: 'Una proposición combinada por conjunción y disyunción con otra repetida se reduce a esta última: p ∧ (p ∨ q) ≡ p.',
  },
  {
    id: 'quiz-2', orden: 6, tipo: 'quiz', categoria: 'CUESTIONARIO', titulo: 'Ejercicio 6',
    descripcionCorta: 'Resuelve un bloque de 4 preguntas', nivel: 'facil', preguntas: preguntasQuiz2,
  },
  {
    id: 'tt-3', orden: 7, tipo: 'truth-table', categoria: 'TABLAS DE VERDAD', titulo: 'Ejercicio 7',
    descripcionCorta: 'Completa la tabla de verdad (¬p ∨ q)', nivel: 'facil', proposicion: '¬p ∨ q',
  },
  {
    id: 'law-3', orden: 8, tipo: 'law', categoria: 'LEYES LÓGICAS', titulo: 'Ejercicio 8',
    descripcionCorta: 'Identifica la ley lógica que se debe utilizar', nivel: 'facil',
    proposicion: '(p ∧ q) ∧ r ≡ p ∧ (q ∧ r)',
    opciones: ['Ley Asociativa', 'Ley Conmutativa', 'Ley Distributiva', 'Ley de Identidad', 'Ley de Complemento'],
    opcionCorrecta: 'Ley Asociativa',
    explicacion: 'El orden en que se agrupan tres o más proposiciones con el mismo operador no altera el resultado: (p ∧ q) ∧ r ≡ p ∧ (q ∧ r).',
  },
  {
    id: 'quiz-3', orden: 9, tipo: 'quiz', categoria: 'CUESTIONARIO', titulo: 'Ejercicio 9',
    descripcionCorta: 'Resuelve un bloque de 4 preguntas', nivel: 'facil', preguntas: preguntasQuiz3,
  },
  {
    id: 'tt-4', orden: 10, tipo: 'truth-table', categoria: 'TABLAS DE VERDAD', titulo: 'Ejercicio 10',
    descripcionCorta: 'Completa la tabla de verdad (p → q)', nivel: 'medio', proposicion: 'p → q',
  },
  {
    id: 'law-4', orden: 11, tipo: 'law', categoria: 'LEYES LÓGICAS', titulo: 'Ejercicio 11',
    descripcionCorta: 'Identifica la ley lógica que se debe utilizar', nivel: 'medio',
    proposicion: 'p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)',
    opciones: ['Ley Distributiva', 'Ley Asociativa', 'Ley de Absorción', 'Ley de Morgan', 'Ley de Exportación'],
    opcionCorrecta: 'Ley Distributiva',
    explicacion: 'Un operador lógico fuera de un paréntesis se distribuye sobre cada elemento dentro de él: p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r).',
  },
  {
    id: 'quiz-4', orden: 12, tipo: 'quiz', categoria: 'CUESTIONARIO', titulo: 'Ejercicio 12',
    descripcionCorta: 'Resuelve un bloque de 6 preguntas', nivel: 'medio', preguntas: preguntasQuiz4,
  },
  {
    id: 'tt-5', orden: 13, tipo: 'truth-table', categoria: 'TABLAS DE VERDAD', titulo: 'Ejercicio 13',
    descripcionCorta: 'Completa la tabla de verdad (p ↔ q)', nivel: 'medio', proposicion: 'p ↔ q',
  },
  {
    id: 'law-5', orden: 14, tipo: 'law', categoria: 'LEYES LÓGICAS', titulo: 'Ejercicio 14',
    descripcionCorta: 'Identifica la ley lógica que se debe utilizar', nivel: 'dificil',
    proposicion: 'p → q ≡ ¬q → ¬p',
    opciones: ['Ley de Trasposición', 'Ley de Exportación', 'Ley de Morgan', 'Ley de Absorción', 'Ley Distributiva'],
    opcionCorrecta: 'Ley de Trasposición',
    explicacion: 'Una implicación condicional equivale a invertir el orden de las proposiciones negándolas ambas: p → q ≡ ¬q → ¬p.',
  },
  {
    id: 'quiz-5', orden: 15, tipo: 'quiz', categoria: 'CUESTIONARIO', titulo: 'Ejercicio 15',
    descripcionCorta: 'Resuelve un bloque de 6 preguntas', nivel: 'medio', preguntas: preguntasQuiz5,
  },
  {
    id: 'tt-6', orden: 16, tipo: 'truth-table', categoria: 'TABLAS DE VERDAD', titulo: 'Ejercicio 16',
    descripcionCorta: 'Completa la tabla de verdad (p ∧ q → r)', nivel: 'dificil', proposicion: 'p ∧ q → r',
  },
  {
    id: 'law-6', orden: 17, tipo: 'law', categoria: 'LEYES LÓGICAS', titulo: 'Ejercicio 17',
    descripcionCorta: 'Identifica la ley lógica que se debe utilizar', nivel: 'facil',
    proposicion: '¬(p ∨ q)',
    opciones: ['Ley de Morgan', 'Ley Distributiva', 'Ley Conmutativa', 'Ley de Absorción', 'Ley Asociativa'],
    opcionCorrecta: 'Ley de Morgan',
    explicacion: 'La negación de una disyunción se transforma en la conjunción de las negaciones: ¬(p ∨ q) ≡ ¬p ∧ ¬q.',
  },
  {
    id: 'quiz-6', orden: 18, tipo: 'quiz', categoria: 'CUESTIONARIO', titulo: 'Ejercicio 18',
    descripcionCorta: 'Resuelve un bloque de 8 preguntas', nivel: 'dificil', preguntas: preguntasQuiz6,
  },
  {
    id: 'tt-7', orden: 19, tipo: 'truth-table', categoria: 'TABLAS DE VERDAD', titulo: 'Ejercicio 19',
    descripcionCorta: 'Completa la tabla de verdad ((p ∨ q) ∧ ¬r)', nivel: 'dificil', proposicion: '(p ∨ q) ∧ ¬r',
  },
  {
    id: 'law-7', orden: 0, tipo: 'law', categoria: 'LEYES LÓGICAS', titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley lógica que se debe utilizar', nivel: 'dificil',
    proposicion: '(p ∧ q) → r ≡ p → (q → r)',
    opciones: ['Ley de Exportación', 'Ley de Trasposición', 'Ley Distributiva', 'Ley de Absorción', 'Ley Asociativa'],
    opcionCorrecta: 'Ley de Exportación',
    explicacion: 'Cumplir dos condiciones juntas para lograr un resultado equivale a que la primera te condicione a cumplir la segunda: (p ∧ q) → r ≡ p → (q → r).',
  },
  ...ejerciciosClasificar,
  {
    id: 'tt-8', orden: 0, tipo: 'truth-table', categoria: 'TABLAS DE VERDAD', titulo: 'Ejercicio',
    descripcionCorta: 'Completa la tabla de verdad (p ↔ (q ∧ r))', nivel: 'dificil', proposicion: 'p ↔ (q ∧ r)',
  },
  {
    id: 'law-8', orden: 0, tipo: 'law', categoria: 'LEYES LÓGICAS', titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley lógica que se debe utilizar', nivel: 'medio',
    proposicion: 'p ∨ p ≡ p',
    opciones: ['Ley de Idempotencia', 'Ley de Absorción', 'Ley Conmutativa', 'Ley de Complemento', 'Ley Distributiva'],
    opcionCorrecta: 'Ley de Idempotencia',
    explicacion: 'Una proposición combinada consigo misma mediante conjunción o disyunción equivale a la proposición original: p ∨ p ≡ p.',
  },
  {
    id: 'law-9', orden: 0, tipo: 'law', categoria: 'LEYES LÓGICAS', titulo: 'Ejercicio',
    descripcionCorta: 'Identifica la ley lógica que se debe utilizar', nivel: 'facil',
    proposicion: 'p ∧ V ≡ p',
    opciones: ['Ley de Identidad', 'Ley de Complemento', 'Ley de Idempotencia', 'Ley de Absorción', 'Ley Conmutativa'],
    opcionCorrecta: 'Ley de Identidad',
    explicacion: 'Al combinar una proposición con el valor de verdad constante V mediante conjunción, esta conserva su valor original: p ∧ V ≡ p.',
  },
  {
    id: 'quiz-7', orden: 0, tipo: 'quiz', categoria: 'CUESTIONARIO', titulo: 'Ejercicio',
    descripcionCorta: 'Resuelve un bloque avanzado de 6 preguntas con 3 variables', nivel: 'dificil',
    preguntas: [
      construirPreguntaQuiz('(p ∨ q) → (r ∧ p)', { P: true, Q: false, R: true }),
      construirPreguntaQuiz('¬(p ↔ q) ∨ r', { P: true, Q: true, R: false }),
      construirPreguntaQuiz('(p ∧ ¬r) ∨ (q ∧ r)', { P: false, Q: true, R: true }),
      construirPreguntaQuiz('p → (q ↔ r)', { P: true, Q: false, R: false }),
      construirPreguntaQuiz('¬p ∧ (q ∨ ¬r)', { P: false, Q: false, R: true }),
      construirPreguntaQuiz('(p → q) ∧ (q → r)', { P: true, Q: true, R: false }),
    ],
  },
]

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

export { OPCIONES_QUIZ }
