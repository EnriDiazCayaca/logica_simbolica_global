/**
 * astVisual.ts
 * -------------
 * Metadatos semánticos y estéticos para visualizar el AST (Árbol de Sintaxis
 * Abstracta) del motor lógico Arom. Centraliza los símbolos, nombres legibles
 * y paletas de color por operador, de forma que los componentes de UI y las
 * pruebas consuman una única fuente de verdad.
 */

import type { NodoExpresion, Operador } from './types'

export interface MetaOperador {
  /** Símbolo matemático estándar (¬, ∧, ∨, →, ↔, △, ↓, ↑). */
  simbolo: string
  /** Nombre completo en español (p. ej. "Conjunción"). */
  nombre: string
  /** Abreviatura didáctica (p. ej. "AND"). */
  corto: string
  /** Familia de color de Tailwind usada en el nodo. */
  color: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'cyan' | 'fuchsia' | 'orange'
  /** Aridad del conectivo: 1 = unario (NO), 2 = binario. */
  aridad: 1 | 2
}

export const META_OPERADOR: Record<Operador, MetaOperador> = {
  Y: { simbolo: '∧', nombre: 'Conjunción', corto: 'AND', color: 'blue', aridad: 2 },
  O: { simbolo: '∨', nombre: 'Disyunción', corto: 'OR', color: 'emerald', aridad: 2 },
  O_EXCLUSIVA: { simbolo: '△', nombre: 'Disyunción Exclusiva', corto: 'XOR', color: 'amber', aridad: 2 },
  NO: { simbolo: '¬', nombre: 'Negación', corto: 'NOT', color: 'rose', aridad: 1 },
  ENTONCES: { simbolo: '→', nombre: 'Implicación', corto: 'IF', color: 'indigo', aridad: 2 },
  SI_Y_SOLO_SI: { simbolo: '↔', nombre: 'Bicondicional', corto: 'IFF', color: 'cyan', aridad: 2 },
  NI: { simbolo: '↓', nombre: 'Nor', corto: 'NOR', color: 'fuchsia', aridad: 2 },
  INCOMPATIBLE: { simbolo: '↑', nombre: 'Nand', corto: 'NAND', color: 'orange', aridad: 2 }
}

/** Clases de color para el "chip" del nodo según su familia. */
export const COLOR_NODO: Record<MetaOperador['color'], string> = {
  blue: 'bg-blue-50 border-blue-300 text-blue-700 ring-blue-500/20',
  emerald: 'bg-emerald-50 border-emerald-300 text-emerald-700 ring-emerald-500/20',
  amber: 'bg-amber-50 border-amber-300 text-amber-700 ring-amber-500/20',
  rose: 'bg-rose-50 border-rose-300 text-rose-700 ring-rose-500/20',
  indigo: 'bg-indigo-50 border-indigo-300 text-indigo-700 ring-indigo-500/20',
  cyan: 'bg-cyan-50 border-cyan-300 text-cyan-700 ring-cyan-500/20',
  fuchsia: 'bg-fuchsia-50 border-fuchsia-300 text-fuchsia-700 ring-fuchsia-500/20',
  orange: 'bg-orange-50 border-orange-300 text-orange-700 ring-orange-500/20'
}

/**
 * Clases de color para los conectores de rama (líneas del árbol). Se aplican
 * como color de texto al <ul> contenedor para que las líneas (currentColor)
 * hereden el tono del operador padre.
 */
export const COLOR_RAMA: Record<MetaOperador['color'], string> = {
  blue: 'text-blue-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  rose: 'text-rose-400',
  indigo: 'text-indigo-400',
  cyan: 'text-cyan-400',
  fuchsia: 'text-fuchsia-400',
  orange: 'text-orange-400'
}

export const COLOR_VARIABLE = 'bg-slate-50 border-slate-300 text-slate-700 ring-slate-500/20'
export const COLOR_RAMA_VARIABLE = 'border-slate-300'

/** Devuelve los hijos de un nodo en el orden visual (izquierdo, derecho). */
export function hijosDeNodo(nodo: NodoExpresion): NodoExpresion[] {
  if (nodo.tipo !== 'operacion') return []
  const hijos: NodoExpresion[] = []
  if (nodo.izquierdo) hijos.push(nodo.izquierdo)
  if (nodo.derecho) hijos.push(nodo.derecho)
  return hijos
}

/** Cuenta la cantidad total de nodos en el subárbol (útil para estadísticas). */
export function contarNodos(nodo: NodoExpresion): number {
  if (nodo.tipo === 'variable') return 1
  return 1 + hijosDeNodo(nodo).reduce((acc, h) => acc + contarNodos(h), 0)
}

/** Profundidad máxima del subárbol (raíz = 1). */
export function profundidadNodo(nodo: NodoExpresion): number {
  if (nodo.tipo === 'variable') return 1
  const hijos = hijosDeNodo(nodo)
  return 1 + (hijos.length ? Math.max(...hijos.map(profundidadNodo)) : 0)
}

export interface EstadisticasAST {
  nodos: number
  profundidad: number
  variables: number
  operadores: number
}

/** Calcula estadísticas resumidas de un subárbol en una única pasada O(N). */
export function estadisticasNodo(nodo: NodoExpresion): EstadisticasAST {
  function analizar(n: NodoExpresion): { nodos: number; profundidad: number; variables: number; operadores: number } {
    if (n.tipo === 'variable') {
      return { nodos: 1, profundidad: 1, variables: 1, operadores: 0 }
    }
    const hijos = hijosDeNodo(n)
    let totalNodos = 1
    let maxProf = 0
    let totalVars = 0
    let totalOps = 1

    for (const h of hijos) {
      const res = analizar(h)
      totalNodos += res.nodos
      if (res.profundidad > maxProf) maxProf = res.profundidad
      totalVars += res.variables
      totalOps += res.operadores
    }

    return {
      nodos: totalNodos,
      profundidad: 1 + maxProf,
      variables: totalVars,
      operadores: totalOps
    }
  }

  return analizar(nodo)
}
