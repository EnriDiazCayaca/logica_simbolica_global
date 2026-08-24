export interface LogicLaw {
  id: number;
  name: string;
  description: string;
  formulas: string[];
}

export const logicLaws: LogicLaw[] = [
  {
    id: 1,
    name: 'Ley de Idempotencia',
    description:
      'La ley de idempotencia en lógica establece que cualquier proposición operada consigo misma (ya sea mediante conjunción o disyunción) es equivalente a la proposición original.',
    formulas: ['p ∧ p ≡ p', 'p ∨ p ≡ p'],
  },
  {
    id: 2,
    name: 'Ley Asociativa',
    description:
      'La ley asociativa en lógica proposicional establece que cuando tienes tres o más proposiciones unidas por el mismo operador lógico, el orden en el que agrupes las operaciones usando paréntesis no altera el valor de verdad final.',
    formulas: ['(p ∧ q) ∧ r ≡ p ∧ (q ∧ r)', '(p ∨ q) ∨ r ≡ p ∨ (q ∨ r)', '(p ↔ q) ↔ r ≡ p ↔ (q ↔ r)'],
  },
  {
    id: 3,
    name: 'Ley Conmutativa',
    description:
      'La ley conmutativa en lógica establece que el orden en el que se combinan dos proposiciones mediante los operadores de conjunción (Y), disyunción (O) o disyunción fuerte no altera el valor de verdad de la proposición final.',
    formulas: ['p ∧ q ≡ q ∧ p', 'p ∨ q ≡ q ∨ p', 'p ↔ q ≡ q ↔ p'],
  },
  {
    id: 4,
    name: 'Ley Distributiva',
    description:
      'La ley distributiva en lógica proposicional indica que un operador lógico fuera de un paréntesis se distribuye sobre cada uno de los elementos dentro de él.',
    formulas: [
      'p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)',
      'p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)',
      'p → (q ∧ r) ≡ (p → q) ∧ (p → r)',
      'p → (q ∨ r) ≡ (p → q) ∨ (p → r)',
    ],
  },
  {
    id: 5,
    name: 'Ley de Absorción',
    description:
      'La Ley de Absorción establece que una proposición combinada mediante conjunción y disyunción con otra proposición repetida se reduce simplemente a esta última.',
    formulas: ['p ∧ (p ∨ q) ≡ p', 'p ∨ (p ∧ q) ≡ p'],
  },
  {
    id: 6,
    name: 'Ley de Complemento',
    description:
      'La Ley de Complemento establece que al combinar una proposición con su negación se obtiene un valor absoluto.',
    formulas: [
      '¬¬p ≡ p',
      'p ∧ ¬p ≡ F ≡ ¬p ∧ p',
      'p ∨ ¬p ≡ V ≡ ¬p ∨ p',
      'p → p ≡ V, p ↔ p ≡ V',
      '¬(p ∧ ¬p) ≡ V',
      '¬V ≡ F, ¬F ≡ V',
    ],
  },
  {
    id: 7,
    name: 'Ley de Identidad',
    description:
      'La Ley de Identidad establece que al combinar una proposición con un valor de verdad constante, esta conserva su valor original o se absorbe por la constante.',
    formulas: ['p ∧ V ≡ p ≡ V ∧ p', 'p ∧ F ≡ F ≡ F ∧ p', 'p ∨ V ≡ V ≡ V ∨ p', 'p ∨ F ≡ p ≡ F ∨ p'],
  },
  {
    id: 8,
    name: 'Ley de Morgan',
    description:
      'La Ley de De Morgan establece que la negación de una operación lógica cambia los operadores al distribuirse.',
    formulas: ['¬(p ∧ q) ≡ ¬p ∨ ¬q', '¬(p ∨ q) ≡ ¬p ∧ ¬q'],
  },
  {
    id: 9,
    name: 'Ley de Expansión Booleana',
    description:
      'La Ley de Expansión Booleana establece que puedes añadir una variable cualquiera a una proposición sin alterar su valor original, sumando su versión verdadera y su versión falsa.',
    formulas: ['p ≡ p ∧ (q ∨ ¬q)', 'p ≡ p ∨ (q ∧ ¬q)'],
  },
  {
    id: 10,
    name: 'Ley de Trasposición',
    description:
      'Establece que una implicación condicional equivale a invertir el orden de las proposiciones negándolas ambas.',
    formulas: ['p → q ≡ ¬q → ¬p'],
  },
  {
    id: 11,
    name: 'Ley de Exportación',
    description:
      'Establece que tener dos condiciones juntas para lograr un resultado es lo mismo que cumplir la primera y que esta te condicione a cumplir la segunda.',
    formulas: ['(p ∧ q) → r ≡ p → (q → r)'],
  },
  {
    id: 12,
    name: 'Leyes de Definición',
    description:
      'Establecen las reglas para traducir operadores complejos en combinaciones equivalentes de los conectores básicos. Su objetivo es transformar la estructura de la fórmula para facilitar su posterior análisis y simplificación.',
    formulas: [
      'p → q ≡ ¬p ∨ q',
      'p ↔ q ≡ (p → q) ∧ (q → p)',
      'p ↔ q ≡ (¬p ∨ q) ∧ (¬q ∨ p)',
      'p ▲ q ≡ (p ∨ q) ∧ ¬(p ∧ q)',
    ],
  },
];
