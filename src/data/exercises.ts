import {
  parseProposition,
  evaluate,
  buildTruthTable,
  collectVariables,
  classifyProposition,
  classificationLabel,
  type PropositionClassification,
} from '../lib/logicEngine';

export type Difficulty = 'facil' | 'medio' | 'dificil';

export const difficultyLabel: Record<Difficulty, string> = {
  facil: 'Fácil',
  medio: 'Medio',
  dificil: 'Difícil',
};

export const difficultyDot: Record<Difficulty, string> = {
  facil: '🟢',
  medio: '🟠',
  dificil: '🔴',
};

interface ExerciseBase {
  id: string;
  order: number;
  category: 'IDENTIFICACIÓN' | 'TABLAS DE VERDAD' | 'CLASIFICACIÓN' | 'LEYES LÓGICAS' | 'CUESTIONARIO';
  title: string;
  shortDescription: string;
  level: Difficulty;
}

export interface TruthTableExercise extends ExerciseBase {
  kind: 'truth-table';
  proposition: string;
}

export interface LawExercise extends ExerciseBase {
  kind: 'law';
  proposition: string;
  options: string[];
  correctOption: string;
  explanation: string;
}

export interface QuizQuestion {
  prompt: string;
  proposition: string;
  assignmentText: string;
  assignment: Record<string, boolean>;
  explanation: string;
}

export interface QuizExercise extends ExerciseBase {
  kind: 'quiz';
  questions: QuizQuestion[];
}

/** Ejercicios de nivel básico: identificar qué conectivo/tipo de proposición es. */
export interface IdentifyExercise extends ExerciseBase {
  kind: 'identify';
  proposition: string;
  options: string[];
  correctOption: string;
  explanation: string;
}

/**
 * Ejercicios de clasificación: tautología, contradicción o contingencia.
 * La respuesta correcta NUNCA se hardcodea: se calcula en tiempo real con
 * `classifyProposition`, que evalúa la columna final completa de la tabla
 * de verdad de la proposición (ver src/lib/logicEngine.ts).
 */
export interface ClassifyExercise extends ExerciseBase {
  kind: 'classify';
  proposition: string;
}

export type Exercise = TruthTableExercise | LawExercise | QuizExercise | IdentifyExercise | ClassifyExercise;

/** Tema al que pertenece cada ejercicio, usado para el seguimiento de progreso por tema. */
export type TopicKey = 'identificacion' | 'tablas-verdad' | 'clasificacion' | 'leyes-logicas' | 'cuestionario';

export const topicLabels: Record<TopicKey, string> = {
  identificacion: 'Identificación de proposiciones',
  'tablas-verdad': 'Tablas de verdad',
  clasificacion: 'Tautología, contradicción y contingencia',
  'leyes-logicas': 'Leyes lógicas',
  cuestionario: 'Cuestionarios de evaluación',
};

export function topicKeyForExercise(ex: Exercise): TopicKey {
  switch (ex.kind) {
    case 'identify':
      return 'identificacion';
    case 'truth-table':
      return 'tablas-verdad';
    case 'classify':
      return 'clasificacion';
    case 'law':
      return 'leyes-logicas';
    case 'quiz':
      return 'cuestionario';
  }
}

const CLASSIFICATION_OPTIONS: PropositionClassification[] = ['tautologia', 'contradiccion', 'contingencia'];
export const CLASSIFY_OPTIONS = CLASSIFICATION_OPTIONS.map((c) => classificationLabel[c]);

/** Calcula la respuesta correcta de un ejercicio de clasificación a partir de la lógica real. */
export function correctClassificationFor(proposition: string): PropositionClassification {
  return classifyProposition(parseProposition(proposition)).classification;
}

const QUIZ_OPTIONS = ['VERDADERO', 'FALSO', 'NO SE PUEDE DETERMINAR', 'LA PROPOSICIÓN ES INVÁLIDA'];

function buildQuizQuestion(proposition: string, assignment: Record<string, boolean>): QuizQuestion {
  const vars = collectVariables(parseProposition(proposition));
  const assignmentText = vars.map((v) => `${v.toLowerCase()} = ${assignment[v] ? 'Verdadero' : 'Falso'}`).join(' y ');
  return {
    prompt: `¿Cuál es el valor de verdad de la siguiente proposición?`,
    proposition,
    assignmentText: `Si ${assignmentText}`,
    assignment,
    explanation: `Sustituyendo los valores dados en (${proposition}) se obtiene ${
      evaluate(parseProposition(proposition), assignment) ? 'Verdadero' : 'Falso'
    }.`,
  };
}

const quizQuestions: QuizQuestion[] = [
  buildQuizQuestion('p ∧ q', { P: true, Q: false }),
  buildQuizQuestion('p ∨ q', { P: false, Q: false }),
  buildQuizQuestion('¬p', { P: true }),
  buildQuizQuestion('p → q', { P: true, Q: false }),
  buildQuizQuestion('p ↔ q', { P: false, Q: false }),
  buildQuizQuestion('p ∨ q', { P: true, Q: false }),
  buildQuizQuestion('p ∧ ¬q', { P: true, Q: true }),
  buildQuizQuestion('¬p ∨ q', { P: false, Q: false }),
  buildQuizQuestion('p → q', { P: false, Q: false }),
  buildQuizQuestion('p ↔ q', { P: true, Q: true }),
];

const quizQuestions2: QuizQuestion[] = [
  buildQuizQuestion('p ∧ q', { P: true, Q: true }),
  buildQuizQuestion('p ∨ q', { P: false, Q: true }),
  buildQuizQuestion('¬p', { P: false }),
  buildQuizQuestion('p → q', { P: false, Q: true }),
];

const quizQuestions3: QuizQuestion[] = [
  buildQuizQuestion('p ∨ q', { P: false, Q: false }),
  buildQuizQuestion('p ∧ q', { P: false, Q: true }),
  buildQuizQuestion('¬p', { P: true }),
  buildQuizQuestion('p ↔ q', { P: true, Q: false }),
];

const quizQuestions4: QuizQuestion[] = [
  buildQuizQuestion('p ∧ ¬q', { P: true, Q: false }),
  buildQuizQuestion('¬p ∨ ¬q', { P: true, Q: true }),
  buildQuizQuestion('p → ¬q', { P: true, Q: false }),
  buildQuizQuestion('¬(p ∧ q)', { P: true, Q: true }),
  buildQuizQuestion('¬p ↔ q', { P: false, Q: false }),
  buildQuizQuestion('p ∨ ¬q', { P: false, Q: true }),
];

const quizQuestions5: QuizQuestion[] = [
  buildQuizQuestion('¬p ∧ q', { P: false, Q: true }),
  buildQuizQuestion('p ↔ ¬q', { P: true, Q: true }),
  buildQuizQuestion('¬(p ∨ q)', { P: false, Q: false }),
  buildQuizQuestion('p → (q ∨ p)', { P: true, Q: false }),
  buildQuizQuestion('¬q → p', { P: false, Q: false }),
  buildQuizQuestion('(p ∧ q) ∨ ¬p', { P: false, Q: true }),
];

const quizQuestions6: QuizQuestion[] = [
  buildQuizQuestion('p ∧ q → r', { P: true, Q: true, R: false }),
  buildQuizQuestion('(p ∨ q) ∧ r', { P: false, Q: true, R: true }),
  buildQuizQuestion('p → (q → r)', { P: true, Q: false, R: false }),
  buildQuizQuestion('¬p ∨ (q ∧ r)', { P: true, Q: true, R: false }),
  buildQuizQuestion('(p ↔ q) ∧ r', { P: true, Q: true, R: false }),
  buildQuizQuestion('p ∧ ¬q ∧ r', { P: true, Q: false, R: true }),
  buildQuizQuestion('¬(p ∧ q) ∨ r', { P: true, Q: true, R: false }),
  buildQuizQuestion('(p ∨ ¬q) → r', { P: false, Q: true, R: false }),
];

const identifyExercises: IdentifyExercise[] = [
  {
    id: 'id-1',
    order: 0,
    kind: 'identify',
    category: 'IDENTIFICACIÓN',
    title: 'Ejercicio',
    shortDescription: 'Identifica el tipo de proposición: ¬p',
    level: 'facil',
    proposition: '¬p',
    options: ['Negación', 'Conjunción', 'Disyunción', 'Condicional', 'Bicondicional'],
    correctOption: 'Negación',
    explanation: 'El símbolo ¬ antepuesto a una proposición indica su negación: invierte su valor de verdad.',
  },
  {
    id: 'id-2',
    order: 0,
    kind: 'identify',
    category: 'IDENTIFICACIÓN',
    title: 'Ejercicio',
    shortDescription: 'Identifica el tipo de proposición: p ∧ q',
    level: 'facil',
    proposition: 'p ∧ q',
    options: ['Conjunción', 'Disyunción', 'Negación', 'Condicional', 'Bicondicional'],
    correctOption: 'Conjunción',
    explanation: 'El símbolo ∧ une dos proposiciones en una conjunción: solo es verdadera si ambas lo son.',
  },
  {
    id: 'id-3',
    order: 0,
    kind: 'identify',
    category: 'IDENTIFICACIÓN',
    title: 'Ejercicio',
    shortDescription: 'Identifica el tipo de proposición: p ∨ q',
    level: 'facil',
    proposition: 'p ∨ q',
    options: ['Disyunción', 'Conjunción', 'Negación', 'Condicional', 'Bicondicional'],
    correctOption: 'Disyunción',
    explanation: 'El símbolo ∨ une dos proposiciones en una disyunción: es verdadera si al menos una lo es.',
  },
  {
    id: 'id-4',
    order: 0,
    kind: 'identify',
    category: 'IDENTIFICACIÓN',
    title: 'Ejercicio',
    shortDescription: 'Identifica el tipo de proposición: p → q',
    level: 'facil',
    proposition: 'p → q',
    options: ['Condicional', 'Bicondicional', 'Conjunción', 'Disyunción', 'Negación'],
    correctOption: 'Condicional',
    explanation: 'El símbolo → forma un condicional: solo es falso cuando el antecedente es V y el consecuente F.',
  },
  {
    id: 'id-5',
    order: 0,
    kind: 'identify',
    category: 'IDENTIFICACIÓN',
    title: 'Ejercicio',
    shortDescription: 'Identifica el tipo de proposición: p ↔ q',
    level: 'facil',
    proposition: 'p ↔ q',
    options: ['Bicondicional', 'Condicional', 'Conjunción', 'Disyunción', 'Negación'],
    correctOption: 'Bicondicional',
    explanation: 'El símbolo ↔ forma un bicondicional: es verdadero cuando ambas proposiciones tienen el mismo valor.',
  },
  {
    id: 'id-6',
    order: 0,
    kind: 'identify',
    category: 'IDENTIFICACIÓN',
    title: 'Ejercicio',
    shortDescription: 'Identifica el tipo de proposición: ¬p ∨ q',
    level: 'medio',
    proposition: '¬p ∨ q',
    options: ['Disyunción', 'Condicional', 'Conjunción', 'Bicondicional', 'Negación'],
    correctOption: 'Disyunción',
    explanation: 'El operador principal (el de menor precedencia fuera de paréntesis) es ∨, así que es una disyunción, aunque uno de sus miembros esté negado.',
  },
];

function buildClassifyExercise(
  id: string,
  proposition: string,
  level: Difficulty,
  shortDescription: string,
): ClassifyExercise {
  return {
    id,
    order: 0,
    kind: 'classify',
    category: 'CLASIFICACIÓN',
    title: 'Ejercicio',
    shortDescription,
    level,
    proposition,
  };
}

const classifyExercises: ClassifyExercise[] = [
  buildClassifyExercise('cl-1', 'p ∨ ¬p', 'medio', 'Clasifica: p ∨ ¬p'),
  buildClassifyExercise('cl-2', 'p ∧ ¬p', 'medio', 'Clasifica: p ∧ ¬p'),
  buildClassifyExercise('cl-3', 'p → q', 'medio', 'Clasifica: p → q'),
  buildClassifyExercise('cl-4', '(p ∧ q) → p', 'dificil', 'Clasifica: (p ∧ q) → p'),
  buildClassifyExercise('cl-5', '(p ∨ q) ∧ ¬p ∧ ¬q', 'dificil', 'Clasifica: (p ∨ q) ∧ ¬p ∧ ¬q'),
  buildClassifyExercise('cl-6', '(p → q) ↔ (¬q → ¬p)', 'dificil', 'Clasifica: (p → q) ↔ (¬q → ¬p)'),
];

export const exercises: Exercise[] = [
  ...identifyExercises,
  {
    id: 'tt-1',
    order: 1,
    kind: 'truth-table',
    category: 'TABLAS DE VERDAD',
    title: 'Ejercicio 1',
    shortDescription: 'Completa la tabla de verdad (p v q)',
    level: 'facil',
    proposition: 'p ∨ q',
  },
  {
    id: 'law-1',
    order: 2,
    kind: 'law',
    category: 'LEYES LÓGICAS',
    title: 'Ejercicio 2',
    shortDescription: 'Identifica la ley lógica que se debe utilizar',
    level: 'medio',
    proposition: '¬(p ∧ q)',
    options: ['Ley de De Morgan', 'Ley Distributiva', 'Ley Conmutativa', 'Ley Asociativa', 'Ley de Absorción'],
    correctOption: 'Ley de De Morgan',
    explanation: 'La negación de una conjunción se transforma en la disyunción de las negaciones: ¬(p ∧ q) ≡ ¬p ∨ ¬q.',
  },
  {
    id: 'quiz-1',
    order: 3,
    kind: 'quiz',
    category: 'CUESTIONARIO',
    title: 'Ejercicio 3',
    shortDescription: 'Resuelve un bloque de 10 preguntas',
    level: 'dificil',
    questions: quizQuestions,
  },
  {
    id: 'tt-2',
    order: 4,
    kind: 'truth-table',
    category: 'TABLAS DE VERDAD',
    title: 'Ejercicio 4',
    shortDescription: 'Completa la tabla de verdad (p ∧ q)',
    level: 'facil',
    proposition: 'p ∧ q',
  },
  {
    id: 'law-2',
    order: 5,
    kind: 'law',
    category: 'LEYES LÓGICAS',
    title: 'Ejercicio 5',
    shortDescription: 'Identifica la ley lógica que se debe utilizar',
    level: 'medio',
    proposition: 'p ∧ (p ∨ q)',
    options: ['Ley de Absorción', 'Ley Distributiva', 'Ley Conmutativa', 'Ley de Identidad', 'Ley de Idempotencia'],
    correctOption: 'Ley de Absorción',
    explanation: 'Una proposición combinada por conjunción y disyunción con otra repetida se reduce a esta última: p ∧ (p ∨ q) ≡ p.',
  },
  {
    id: 'quiz-2',
    order: 6,
    kind: 'quiz',
    category: 'CUESTIONARIO',
    title: 'Ejercicio 6',
    shortDescription: 'Resuelve un bloque de 4 preguntas',
    level: 'facil',
    questions: quizQuestions2,
  },
  {
    id: 'tt-3',
    order: 7,
    kind: 'truth-table',
    category: 'TABLAS DE VERDAD',
    title: 'Ejercicio 7',
    shortDescription: 'Completa la tabla de verdad (¬p ∨ q)',
    level: 'facil',
    proposition: '¬p ∨ q',
  },
  {
    id: 'law-3',
    order: 8,
    kind: 'law',
    category: 'LEYES LÓGICAS',
    title: 'Ejercicio 8',
    shortDescription: 'Identifica la ley lógica que se debe utilizar',
    level: 'facil',
    proposition: '(p ∧ q) ∧ r ≡ p ∧ (q ∧ r)',
    options: ['Ley Asociativa', 'Ley Conmutativa', 'Ley Distributiva', 'Ley de Identidad', 'Ley de Complemento'],
    correctOption: 'Ley Asociativa',
    explanation: 'El orden en que se agrupan tres o más proposiciones con el mismo operador no altera el resultado: (p ∧ q) ∧ r ≡ p ∧ (q ∧ r).',
  },
  {
    id: 'quiz-3',
    order: 9,
    kind: 'quiz',
    category: 'CUESTIONARIO',
    title: 'Ejercicio 9',
    shortDescription: 'Resuelve un bloque de 4 preguntas',
    level: 'facil',
    questions: quizQuestions3,
  },
  {
    id: 'tt-4',
    order: 10,
    kind: 'truth-table',
    category: 'TABLAS DE VERDAD',
    title: 'Ejercicio 10',
    shortDescription: 'Completa la tabla de verdad (p → q)',
    level: 'medio',
    proposition: 'p → q',
  },
  {
    id: 'law-4',
    order: 11,
    kind: 'law',
    category: 'LEYES LÓGICAS',
    title: 'Ejercicio 11',
    shortDescription: 'Identifica la ley lógica que se debe utilizar',
    level: 'medio',
    proposition: 'p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)',
    options: ['Ley Distributiva', 'Ley Asociativa', 'Ley de Absorción', 'Ley de Morgan', 'Ley de Exportación'],
    correctOption: 'Ley Distributiva',
    explanation: 'Un operador lógico fuera de un paréntesis se distribuye sobre cada elemento dentro de él: p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r).',
  },
  {
    id: 'quiz-4',
    order: 12,
    kind: 'quiz',
    category: 'CUESTIONARIO',
    title: 'Ejercicio 12',
    shortDescription: 'Resuelve un bloque de 6 preguntas',
    level: 'medio',
    questions: quizQuestions4,
  },
  {
    id: 'tt-5',
    order: 13,
    kind: 'truth-table',
    category: 'TABLAS DE VERDAD',
    title: 'Ejercicio 13',
    shortDescription: 'Completa la tabla de verdad (p ↔ q)',
    level: 'medio',
    proposition: 'p ↔ q',
  },
  {
    id: 'law-5',
    order: 14,
    kind: 'law',
    category: 'LEYES LÓGICAS',
    title: 'Ejercicio 14',
    shortDescription: 'Identifica la ley lógica que se debe utilizar',
    level: 'dificil',
    proposition: 'p → q ≡ ¬q → ¬p',
    options: ['Ley de Trasposición', 'Ley de Exportación', 'Ley de Morgan', 'Ley de Absorción', 'Ley Distributiva'],
    correctOption: 'Ley de Trasposición',
    explanation: 'Una implicación condicional equivale a invertir el orden de las proposiciones negándolas ambas: p → q ≡ ¬q → ¬p.',
  },
  {
    id: 'quiz-5',
    order: 15,
    kind: 'quiz',
    category: 'CUESTIONARIO',
    title: 'Ejercicio 15',
    shortDescription: 'Resuelve un bloque de 6 preguntas',
    level: 'medio',
    questions: quizQuestions5,
  },
  {
    id: 'tt-6',
    order: 16,
    kind: 'truth-table',
    category: 'TABLAS DE VERDAD',
    title: 'Ejercicio 16',
    shortDescription: 'Completa la tabla de verdad (p ∧ q → r)',
    level: 'dificil',
    proposition: 'p ∧ q → r',
  },
  {
    id: 'law-6',
    order: 17,
    kind: 'law',
    category: 'LEYES LÓGICAS',
    title: 'Ejercicio 17',
    shortDescription: 'Identifica la ley lógica que se debe utilizar',
    level: 'facil',
    proposition: '¬(p ∨ q)',
    options: ['Ley de Morgan', 'Ley Distributiva', 'Ley Conmutativa', 'Ley de Absorción', 'Ley Asociativa'],
    correctOption: 'Ley de Morgan',
    explanation: 'La negación de una disyunción se transforma en la conjunción de las negaciones: ¬(p ∨ q) ≡ ¬p ∧ ¬q.',
  },
  {
    id: 'quiz-6',
    order: 18,
    kind: 'quiz',
    category: 'CUESTIONARIO',
    title: 'Ejercicio 18',
    shortDescription: 'Resuelve un bloque de 8 preguntas',
    level: 'dificil',
    questions: quizQuestions6,
  },
  {
    id: 'tt-7',
    order: 19,
    kind: 'truth-table',
    category: 'TABLAS DE VERDAD',
    title: 'Ejercicio 19',
    shortDescription: 'Completa la tabla de verdad ((p ∨ q) ∧ ¬r)',
    level: 'dificil',
    proposition: '(p ∨ q) ∧ ¬r',
  },
  {
    id: 'law-7',
    order: 0,
    kind: 'law',
    category: 'LEYES LÓGICAS',
    title: 'Ejercicio',
    shortDescription: 'Identifica la ley lógica que se debe utilizar',
    level: 'dificil',
    proposition: '(p ∧ q) → r ≡ p → (q → r)',
    options: ['Ley de Exportación', 'Ley de Trasposición', 'Ley Distributiva', 'Ley de Absorción', 'Ley Asociativa'],
    correctOption: 'Ley de Exportación',
    explanation: 'Cumplir dos condiciones juntas para lograr un resultado equivale a que la primera te condicione a cumplir la segunda: (p ∧ q) → r ≡ p → (q → r).',
  },
  ...classifyExercises,
  {
    id: 'tt-8',
    order: 0,
    kind: 'truth-table',
    category: 'TABLAS DE VERDAD',
    title: 'Ejercicio',
    shortDescription: 'Completa la tabla de verdad (p ↔ (q ∧ r))',
    level: 'dificil',
    proposition: 'p ↔ (q ∧ r)',
  },
  {
    id: 'law-8',
    order: 0,
    kind: 'law',
    category: 'LEYES LÓGICAS',
    title: 'Ejercicio',
    shortDescription: 'Identifica la ley lógica que se debe utilizar',
    level: 'medio',
    proposition: 'p ∨ p ≡ p',
    options: ['Ley de Idempotencia', 'Ley de Absorción', 'Ley Conmutativa', 'Ley de Complemento', 'Ley Distributiva'],
    correctOption: 'Ley de Idempotencia',
    explanation: 'Una proposición combinada consigo misma mediante conjunción o disyunción equivale a la proposición original: p ∨ p ≡ p.',
  },
  {
    id: 'law-9',
    order: 0,
    kind: 'law',
    category: 'LEYES LÓGICAS',
    title: 'Ejercicio',
    shortDescription: 'Identifica la ley lógica que se debe utilizar',
    level: 'facil',
    proposition: 'p ∧ V ≡ p',
    options: ['Ley de Identidad', 'Ley de Complemento', 'Ley de Idempotencia', 'Ley de Absorción', 'Ley Conmutativa'],
    correctOption: 'Ley de Identidad',
    explanation: 'Al combinar una proposición con el valor de verdad constante V mediante conjunción, esta conserva su valor original: p ∧ V ≡ p.',
  },
  {
    id: 'quiz-7',
    order: 0,
    kind: 'quiz',
    category: 'CUESTIONARIO',
    title: 'Ejercicio',
    shortDescription: 'Resuelve un bloque avanzado de 6 preguntas con 3 variables',
    level: 'dificil',
    questions: [
      buildQuizQuestion('(p ∨ q) → (r ∧ p)', { P: true, Q: false, R: true }),
      buildQuizQuestion('¬(p ↔ q) ∨ r', { P: true, Q: true, R: false }),
      buildQuizQuestion('(p ∧ ¬r) ∨ (q ∧ r)', { P: false, Q: true, R: true }),
      buildQuizQuestion('p → (q ↔ r)', { P: true, Q: false, R: false }),
      buildQuizQuestion('¬p ∧ (q ∨ ¬r)', { P: false, Q: false, R: true }),
      buildQuizQuestion('(p → q) ∧ (q → r)', { P: true, Q: true, R: false }),
    ],
  },
];

// El orden y el título de cada ejercicio se derivan automáticamente de su
// posición en la lista (no se hardcodean), para que agregar o quitar
// ejercicios nunca desincronice la numeración mostrada al usuario.
exercises.forEach((ex, idx) => {
  ex.order = idx + 1;
  ex.title = `Ejercicio ${idx + 1}`;
});

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function buildFillTable(proposition: string) {
  const ast = parseProposition(proposition);
  const vars = collectVariables(ast);
  return buildTruthTable(ast, vars);
}

export { QUIZ_OPTIONS };
