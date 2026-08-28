export interface LeyLogica {
  id: number
  nombre: string
  descripcion: string
  formulas: string[]
}

export const LEYES_LOGICAS: LeyLogica[] = [
  {
    id: 1,
    nombre: 'Ley de Idempotencia',
    descripcion:
      'Cualquier proposición operada consigo misma (mediante conjunción o disyunción) es equivalente a la proposición original.',
    formulas: ['p ∧ p ≡ p', 'p ∨ p ≡ p'],
  },
  {
    id: 2,
    nombre: 'Ley Asociativa',
    descripcion:
      'Cuando tienes tres o más proposiciones unidas por el mismo operador lógico, el orden en el que agrupes las operaciones usando paréntesis no altera el valor de verdad final.',
    formulas: ['(p ∧ q) ∧ r ≡ p ∧ (q ∧ r)', '(p ∨ q) ∨ r ≡ p ∨ (q ∨ r)', '(p ↔ q) ↔ r ≡ p ↔ (q ↔ r)'],
  },
  {
    id: 3,
    nombre: 'Ley Conmutativa',
    descripcion:
      'El orden en el que se combinan dos proposiciones mediante los operadores de conjunción (Y), disyunción (O) o disyunción fuerte no altera el valor de verdad de la proposición final.',
    formulas: ['p ∧ q ≡ q ∧ p', 'p ∨ q ≡ q ∨ p', 'p ↔ q ≡ q ↔ p'],
  },
  {
    id: 4,
    nombre: 'Ley Distributiva',
    descripcion:
      'Un operador lógico fuera de un paréntesis se distribuye sobre cada uno de los elementos dentro de él.',
    formulas: [
      'p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)',
      'p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)',
      'p → (q ∧ r) ≡ (p → q) ∧ (p → r)',
      'p → (q ∨ r) ≡ (p → q) ∨ (p → r)',
    ],
  },
  {
    id: 5,
    nombre: 'Ley de Absorción',
    descripcion:
      'Una proposición combinada mediante conjunción y disyunción con otra proposición repetida se reduce simplemente a esta última.',
    formulas: ['p ∧ (p ∨ q) ≡ p', 'p ∨ (p ∧ q) ≡ p'],
  },
  {
    id: 6,
    nombre: 'Ley de Complemento',
    descripcion:
      'Al combinar una proposición con su negación se obtiene un valor absoluto.',
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
    nombre: 'Ley de Identidad',
    descripcion:
      'Al combinar una proposición con un valor de verdad constante, esta conserva su valor original o se absorbe por la constante.',
    formulas: ['p ∧ V ≡ p ≡ V ∧ p', 'p ∧ F ≡ F ≡ F ∧ p', 'p ∨ V ≡ V ≡ V ∨ p', 'p ∨ F ≡ p ≡ F ∨ p'],
  },
  {
    id: 8,
    nombre: 'Ley de Morgan',
    descripcion:
      'La negación de una operación lógica cambia los operadores al distribuirse.',
    formulas: ['¬(p ∧ q) ≡ ¬p ∨ ¬q', '¬(p ∨ q) ≡ ¬p ∧ ¬q'],
  },
  {
    id: 9,
    nombre: 'Ley de Expansión Booleana',
    descripcion:
      'Puedes añadir una variable cualquiera a una proposición sin alterar su valor original, sumando su versión verdadera y su versión falsa.',
    formulas: ['p ≡ p ∧ (q ∨ ¬q)', 'p ≡ p ∨ (q ∧ ¬q)'],
  },
  {
    id: 10,
    nombre: 'Ley de Trasposición',
    descripcion:
      'Una implicación condicional equivale a invertir el orden de las proposiciones negándolas ambas.',
    formulas: ['p → q ≡ ¬q → ¬p'],
  },
  {
    id: 11,
    nombre: 'Ley de Exportación',
    descripcion:
      'Tener dos condiciones juntas para lograr un resultado es lo mismo que cumplir la primera y que esta te condicione a cumplir la segunda.',
    formulas: ['(p ∧ q) → r ≡ p → (q → r)'],
  },
  {
    id: 12,
    nombre: 'Leyes de Definición',
    descripcion:
      'Reglas para traducir operadores complejos en combinaciones equivalentes de los conectores básicos.',
    formulas: [
      'p → q ≡ ¬p ∨ q',
      'p ↔ q ≡ (p → q) ∧ (q → p)',
      'p ↔ q ≡ (¬p ∨ q) ∧ (¬q ∨ p)',
      'p ▲ q ≡ (p ∨ q) ∧ ¬(p ∧ q)',
    ],
  },
]
