/**
 * Motor de evaluación de cuantificadores lógicos sobre dominios finitos.
 * Soporta cuantificador universal (∀) y existencial (∃).
 */

export type TipoCuantificador = 'forall' | 'exists'

export interface PasoTrazabilidad {
  elemento: string
  explicacion: string
  resultado: boolean
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
}

export type FuncionPredicado = (elemento: string) => boolean

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

export function parsearDominio(entrada: string): string[] {
  return entrada
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function evaluarCuantificador(
  tipo: TipoCuantificador,
  dominio: string[],
  predicado: FuncionPredicado,
  descripcionPredicado: string,
): ResultadoCuantificador {
  const trazabilidad: PasoTrazabilidad[] = []

  for (const elemento of dominio) {
    const resultado = predicado(elemento)
    trazabilidad.push({
      elemento,
      explicacion: `P(${elemento}): ${descripcionPredicado} → ${resultado ? 'V' : 'F'}`,
      resultado,
    })
  }

  let resultado: boolean
  let contraejemplo: string | undefined
  let testigo: string | undefined

  if (tipo === 'forall') {
    // Para todo: verdadero si TODOS cumplen
    const fallos = trazabilidad.filter((p) => !p.resultado)
    resultado = fallos.length === 0
    if (fallos.length > 0) {
      contraejemplo = fallos[0].elemento
    }
  } else {
    // Existe: verdadero si ALGUNO cumple
    const exitosos = trazabilidad.filter((p) => p.resultado)
    resultado = exitosos.length > 0
    if (exitosos.length > 0) {
      testigo = exitosos[0].elemento
    }
  }

  const simbolo = tipo === 'forall' ? '∀' : '∃'
  const nombrePredicado = descripcionPredicado

  const resumen = resultado
    ? tipo === 'forall'
      ? `Para todo x en D, se cumple que ${nombrePredicado}. La proposición ${simbolo}x P(x) es VERDADERA.`
      : `Existe al menos un x en D para el cual se cumple ${nombrePredicado}. La proposición ${simbolo}x P(x) es VERDADERA.`
    : tipo === 'forall'
      ? `No se cumple que para todo x en D, ${nombrePredicado}. La proposición ${simbolo}x P(x) es FALSA.`
      : `No existe ningún x en D para el cual se cumpla ${nombrePredicado}. La proposición ${simbolo}x P(x) es FALSA.`

  // Leyes de De Morgan para cuantificadores
  const deMorgan = tipo === 'forall'
    ? {
        regla: '¬(∀x P(x)) ≡ ∃x ¬P(x)',
        original: `∀x P(x)`,
        negado: `∃x ¬P(x)`,
      }
    : {
        regla: '¬(∃x P(x)) ≡ ∀x ¬P(x)',
        original: `∃x P(x)`,
        negado: `∀x ¬P(x)`,
      }

  return {
    tipo,
    dominio,
    predicado: descripcionPredicado,
    resultado,
    trazabilidad,
    contraejemplo,
    testigo,
    resumen,
    deMorgan,
  }
}
