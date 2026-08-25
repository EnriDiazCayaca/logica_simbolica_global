/**
 * Motor de evaluación de cuantificadores lógicos sobre dominios finitos.
 * Soporta cuantificador universal (∀) y existencial (∃).
 * Features: rangos encadenados, predicados libres, De Morgan profundo, resolutor paso a paso.
 */

export type TipoCuantificador = 'forall' | 'exists'

export interface PasoTrazabilidad {
  elemento: string
  explicacion: string
  resultado: boolean
}

export interface PasoResolucion {
  ley: string
  antes: string
  despues: string
}

export interface ResultadoCuantificador {
  tipo: TipoCuantificador
  dominio: string[]
  predicado: string
  resultado: boolean
  trazabilidad: PasoTrazabilidad[]
  contraejemplo?: string
  testigo?: string
  resumen: string
  deMorgan: {
    regla: string
    original: string
    negado: string
  }
  pasosResolucion: PasoResolucion[]
}

export type FuncionPredicado = (elemento: string) => boolean

// ── Predicados predefinidos ──────────────────────────────────────────

const PREDICADOS_PREDEFINIDOS: Record<string, { fn: FuncionPredicado; descripcion: string }> = {
  esPar: {
    fn: (x) => {
      const n = Number(x)
      return !isNaN(n) && n % 2 === 0
    },
    descripcion: 'x es un número par',
  },
  esImpar: {
    fn: (x) => {
      const n = Number(x)
      return !isNaN(n) && n % 2 !== 0
    },
    descripcion: 'x es un número impar',
  },
  esPrimo: {
    fn: (x) => {
      const n = Number(x)
      if (isNaN(n) || n <= 1) return false
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false
      }
      return true
    },
    descripcion: 'x es un número primo',
  },
  mayorQueDos: {
    fn: (x) => {
      const n = Number(x)
      return !isNaN(n) && n > 2
    },
    descripcion: 'x es mayor que 2',
  },
  positivo: {
    fn: (x) => {
      const n = Number(x)
      return !isNaN(n) && n > 0
    },
    descripcion: 'x es un número positivo',
  },
}

export function obtenerPredicados(): Record<string, { fn: FuncionPredicado; descripcion: string }> {
  return PREDICADOS_PREDEFINIDOS
}

// ── Parseo de dominio: listas y rangos encadenados ───────────────────

export function parsearDominio(entrada: string): string[] {
  const trimmed = entrada.trim()

  // Rango encadenado: "0 < x < 90", "1 <= x <= 10", "5 > x > 1"
  const rangoMatch = trimmed.match(
    /^(-?\d+(?:\.\d+)?)\s*(<=?|>=?)\s*[a-zA-Z]\s*(<=?|>=?)\s*(-?\d+(?:\.\d+)?)$/
  )
  if (rangoMatch) {
    const [, minStr, op1, op2, maxStr] = rangoMatch
    const a = Number(minStr)
    const b = Number(maxStr)
    const ascendente = a <= b
    const lo = Math.min(a, b)
    const hi = Math.max(a, b)
    const op1EsAsc = op1.startsWith('<')
    const op2EsAsc = op2.startsWith('<')
    if (ascendente && !op1EsAsc) return []
    if (!ascendente && op1EsAsc) return []
    const incluirLo = ascendente ? op1 === '<=' : op2 === '>='
    const incluirHi = ascendente ? op2 === '<=' : op1 === '>='
    const min = incluirLo ? lo : lo + 1
    const max = incluirHi ? hi : hi - 1
    if (min > max) return []
    const resultado: string[] = []
    for (let i = min; i <= max; i++) {
      resultado.push(String(i))
    }
    return resultado
  }

  // Lista explícita: "1, 2, 3"
  return trimmed
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

// ── Predicados libres (expresiones de usuario) ───────────────────────

function limpiarConectores(expr: string): string {
  return expr
    .replace(/\bAND\b/gi, '&&')
    .replace(/\bOR\b/gi, '||')
    .replace(/\bY\b/gi, '&&')
    .replace(/\bO\b/gi, '||')
}

export function evaluarExpresionPredicado(expresion: string, x: string): boolean {
  const n = Number(x)
  const exprLimpia = limpiarConectores(expresion)
    .replace(/x/g, `(${isNaN(n) ? `'${x}'` : n})`)

  try {
    // Solo permitir caracteres seguros
    if (/[a-zA-Z]/.test(exprLimpia.replace(/true|false/gi, ''))) {
      return false
    }
    const fn = new Function(`return (${exprLimpia})`)
    return Boolean(fn())
  } catch {
    return false
  }
}

// ── Negación De Morgan profunda ──────────────────────────────────────

export function negarComparador(op: string): string {
  const mapa: Record<string, string> = {
    '>': '<=',
    '<': '>=',
    '>=': '<',
    '<=': '>',
    '==': '!=',
    '===': '!==',
    '!=': '==',
    '!==': '===',
  }
  return mapa[op] ?? op
}

export function negarExpresion(expresion: string): string {
  let resultado = expresion.trim()

  // Invertir cuantificadores (order matters: ∃→TEMP first, then ∀→∃, then TEMP→∀)
  resultado = resultado.replace(/∃/g, 'TEMP').replace(/∀/g, '∃').replace(/TEMP/g, '∀')

  // Invertir comparadores
  resultado = resultado.replace(/>=|<=|===|!==|>|<|==|!=/g, (match) => negarComparador(match))

  // Negar la expresión si no está ya negada
  if (!resultado.startsWith('¬') && !resultado.startsWith('!')) {
    resultado = `¬(${resultado})`
  } else {
    resultado = resultado.replace(/^[¬!]\s*/, '')
  }

  return resultado
}

// ── Resolutor paso a paso ────────────────────────────────────────────

export function aplicarLeyes(expresion: string): PasoResolucion[] {
  const pasos: PasoResolucion[] = []
  let actual = expresion.trim()

  // 1. Bicondicional: A ↔ B → (A → B) ∧ (B → A)
  const bicondicionalMatch = actual.match(/^(.+?)\s*↔\s*(.+)$/)
  if (bicondicionalMatch) {
    const [, a, b] = bicondicionalMatch
    const despues = `(${a.trim()} → ${b.trim()}) ∧ (${b.trim()} → ${a.trim()})`
    pasos.push({ ley: 'Bicondicional', antes: actual, despues })
    actual = despues
  }

  // 2. Implicación: A → B → ¬A ∨ B
  const implicacionMatch = actual.match(/^(.+?)\s*→\s*(.+)$/)
  if (implicacionMatch && !actual.includes('↔')) {
    const [, a, b] = implicacionMatch
    const despues = `¬${a.trim()} ∨ ${b.trim()}`
    pasos.push({ ley: 'Implicación', antes: actual, despues })
    actual = despues
  }

  // 3. De Morgan: ¬(A ∧ B) → ¬A ∨ ¬B, ¬(A ∨ B) → ¬A ∧ ¬B
  const deMorganAnd = actual.match(/^¬\s*\((.+?)\s*∧\s*(.+)\)$/)
  if (deMorganAnd) {
    const [, a, b] = deMorganAnd
    const despues = `¬${a.trim()} ∨ ¬${b.trim()}`
    pasos.push({ ley: 'De Morgan', antes: actual, despues })
    actual = despues
  }

  const deMorganOr = actual.match(/^¬\s*\((.+?)\s*∨\s*(.+)\)$/)
  if (deMorganOr) {
    const [, a, b] = deMorganOr
    const despues = `¬${a.trim()} ∧ ¬${b.trim()}`
    pasos.push({ ley: 'De Morgan', antes: actual, despues })
    actual = despues
  }

  // 4. Distribución: A ∧ (B ∨ C) → (A ∧ B) ∨ (A ∧ C)
  const distMatch = actual.match(/^(.+?)\s*∧\s*\((.+?)\s*∨\s*(.+)\)$/)
  if (distMatch) {
    const [, a, b, c] = distMatch
    const despues = `(${a.trim()} ∧ ${b.trim()}) ∨ (${a.trim()} ∧ ${c.trim()})`
    pasos.push({ ley: 'Distribución', antes: actual, despues })
    actual = despues
  }

  // Distribución dual: A ∨ (B ∧ C) → (A ∨ B) ∧ (A ∨ C)
  const distDualMatch = actual.match(/^(.+?)\s*∨\s*\((.+?)\s*∧\s*(.+)\)$/)
  if (distDualMatch) {
    const [, a, b, c] = distDualMatch
    const despues = `(${a.trim()} ∨ ${b.trim()}) ∧ (${a.trim()} ∨ ${c.trim()})`
    pasos.push({ ley: 'Distribución dual', antes: actual, despues })
    actual = despues
  }

  return pasos
}

// ── Función principal de evaluación ──────────────────────────────────

export function evaluarCuantificador(
  tipo: TipoCuantificador,
  dominio: string[],
  predicado: FuncionPredicado,
  descripcionPredicado: string,
  expresionLibre?: string,
): ResultadoCuantificador {
  const trazabilidad: PasoTrazabilidad[] = []

  for (const elemento of dominio) {
    const resultado = predicado(elemento)
    const desc = expresionLibre
      ? `P(${elemento}): ${expresionLibre} → ${resultado ? 'V' : 'F'}`
      : `P(${elemento}): ${descripcionPredicado} → ${resultado ? 'V' : 'F'}`
    trazabilidad.push({ elemento, explicacion: desc, resultado })
  }

  let resultado: boolean
  let contraejemplo: string | undefined
  let testigo: string | undefined

  if (tipo === 'forall') {
    const fallos = trazabilidad.filter((p) => !p.resultado)
    resultado = fallos.length === 0
    if (fallos.length > 0) contraejemplo = fallos[0].elemento
  } else {
    const exitosos = trazabilidad.filter((p) => p.resultado)
    resultado = exitosos.length > 0
    if (exitosos.length > 0) testigo = exitosos[0].elemento
  }

  const simbolo = tipo === 'forall' ? '∀' : '∃'
  const nombrePredicado = expresionLibre ?? descripcionPredicado

  const resumen = resultado
    ? tipo === 'forall'
      ? `Para todo x en D, se cumple que ${nombrePredicado}. La proposición ${simbolo}x P(x) es VERDADERA.`
      : `Existe al menos un x en D para el cual se cumple ${nombrePredicado}. La proposición ${simbolo}x P(x) es VERDADERA.`
    : tipo === 'forall'
      ? `No se cumple que para todo x en D, ${nombrePredicado}. La proposición ${simbolo}x P(x) es FALSA.`
      : `No existe ningún x en D para el cual se cumpla ${nombrePredicado}. La proposición ${simbolo}x P(x) es FALSA.`

  // De Morgan profundo
  const exprOriginal = `${simbolo}x P(x)`
  const negacion = tipo === 'forall' ? `∃x ¬P(x)` : `∀x ¬P(x)`
  const deMorgan = tipo === 'forall'
    ? {
        regla: '¬(∀x P(x)) ≡ ∃x ¬P(x) — Negar un universal equivale a existencial negado',
        original: exprOriginal,
        negado: negacion,
      }
    : {
        regla: '¬(∃x P(x)) ≡ ∀x ¬P(x) — Negar un existencial equivale a universal negado',
        original: exprOriginal,
        negado: negacion,
      }

  // Resolutor paso a paso
  const pasosResolucion = expresionLibre ? aplicarLeyes(expresionLibre) : []

  return {
    tipo,
    dominio,
    predicado: nombrePredicado,
    resultado,
    trazabilidad,
    contraejemplo,
    testigo,
    resumen,
    deMorgan,
    pasosResolucion,
  }
}
