import type { NodoExpresion } from '../solver/types'
import { parsearExpresion } from '../solver/parser'

/**
 * Traduce un NodoExpresion del AST a una frase legible en lenguaje natural (español),
 * reemplazando las variables proposicionales por sus significados asignados.
 */
export function traducirNodoANatural(
  nodo: NodoExpresion,
  mapaVariables: Record<string, string>
): string {
  if (nodo.tipo === 'variable') {
    const significado = mapaVariables[nodo.nombre]?.trim()
    return significado ? significado : `[${nodo.nombre}]`
  }

  const { operador, izquierdo, derecho } = nodo

  if (operador === 'NO' && derecho) {
    const textoDer = traducirNodoANatural(derecho, mapaVariables)
    return `no es cierto que ${textoDer}`
  }

  if (izquierdo && derecho) {
    const textoIzq = traducirNodoANatural(izquierdo, mapaVariables)
    const textoDer = traducirNodoANatural(derecho, mapaVariables)

    switch (operador) {
      case 'ENTONCES':
        return `si ${textoIzq}, entonces ${textoDer}`
      case 'SI_Y_SOLO_SI':
        return `${textoIzq} si y solo si ${textoDer}`
      case 'Y':
        return `${textoIzq} y ${textoDer}`
      case 'O':
        return `${textoIzq} o ${textoDer}`
      case 'O_EXCLUSIVA':
        return `o bien ${textoIzq}, o bien ${textoDer}`
      default:
        return `${textoIzq} (${operador}) ${textoDer}`
    }
  }

  return ''
}

/**
 * Extrae los nombres de todas las variables proposicionales únicas de una expresión en texto.
 */
export function extraerVariablesDeTexto(texto: string): string[] {
  // Encuentra letras individuales que actúan como variables (A-Z)
  const matches = texto.toUpperCase().match(/\b[P-Z|A-O]\b/g)
  if (!matches) return []
  
  // Filtrar palabras reservadas del parser
  const reservadas = new Set(['Y', 'O', 'NO', 'NI', 'SI_Y_SOLO_SI', 'ENTONCES', 'O_EXCLUSIVA', 'INCOMPATIBLE'])
  const unicas = Array.from(new Set(matches.filter(m => !reservadas.has(m))))
  return unicas.sort()
}

/**
 * Traduce una expresión en texto a lenguaje natural de forma segura.
 */
export function traducirTextoANatural(
  textoFormula: string,
  mapaVariables: Record<string, string>,
  normalizar = true
): string {
  if (!textoFormula.trim()) return ''
  try {
    let formula = textoFormula
    if (normalizar) {
      formula = formula
        .replace(/<->|<=>|↔|⟺/g, ' SI_Y_SOLO_SI ')
        .replace(/->|=>|→|⟹/g, ' ENTONCES ')
        .replace(/\^|∧|&&/g, ' Y ')
        .replace(/∨|\|\|/g, ' O ')
        .replace(/~|¬|!/g, ' NO ')
        .replace(/⊕|⊻/g, ' O_EXCLUSIVA ')
        .replace(/\s+/g, ' ')
        .trim()
    }
    const ast = parsearExpresion(formula)
    const traducido = traducirNodoANatural(ast, mapaVariables)
    // Capitalizar primera letra
    return traducido.charAt(0).toUpperCase() + traducido.slice(1)
  } catch {
    return textoFormula
  }
}
