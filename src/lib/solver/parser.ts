import type { NodoExpresion, Operador } from './types';

// ====================================================
// 1. ANÁLISIS LÉXICO (Tokenización)
// ====================================================
export type TipoToken = 'VARIABLE' | 'OPERADOR' | 'PARENTESIS_IZQ' | 'PARENTESIS_DER';

export interface Token {
  tipo: TipoToken;
  valor: string; 
}

const OPERADORES_VALIDOS: Record<string, Operador> = {
  'Y': 'Y',
  'O': 'O',
  'O_EXCLUSIVA': 'O_EXCLUSIVA',
  'NO': 'NO',
  'ENTONCES': 'ENTONCES',
  'SI_Y_SOLO_SI': 'SI_Y_SOLO_SI',
  'NI': 'NI',
  'INCOMPATIBLE': 'INCOMPATIBLE'
};

/**
 * Convierte una cadena de texto en una lista de tokens reconocibles.
 */
export function tokenizar(entrada: string): Token[] {
  const tokens: Token[] = [];
  
  // Añadimos espacios alrededor de los paréntesis para que sea más fácil separar por espacios
  const sanitizado = entrada
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .trim();
    
  if (!sanitizado) return [];

  // Dividir por uno o más espacios
  const fragmentos = sanitizado.split(/\s+/);

  for (const f of fragmentos) {
    if (f === '(') {
      tokens.push({ tipo: 'PARENTESIS_IZQ', valor: f });
    } else if (f === ')') {
      tokens.push({ tipo: 'PARENTESIS_DER', valor: f });
    } else if (OPERADORES_VALIDOS[f.toUpperCase()]) {
      tokens.push({ tipo: 'OPERADOR', valor: f.toUpperCase() });
    } else {
      // Si no es ni operador ni paréntesis, asumimos que es una variable proposicional
      tokens.push({ tipo: 'VARIABLE', valor: f });
    }
  }

  return tokens;
}

// ====================================================
// 2. ANÁLISIS SINTÁCTICO (Parseo a AST)
// ====================================================

/**
 * Clase que ayuda a iterar sobre los tokens para el análisis de Descenso Recursivo.
 */
class ASTParser {
  private tokens: Token[];
  private posicion: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | null {
    if (this.posicion < this.tokens.length) {
      return this.tokens[this.posicion];
    }
    return null;
  }

  private consume(): Token {
    return this.tokens[this.posicion++];
  }

  public parsear(): NodoExpresion {
    const expresion = this.parsearImplicacionBicondicional();
    
    // Si terminamos de parsear la expresión lógica pero sobran tokens, hay un error de sintaxis.
    if (this.peek() !== null) {
      throw new Error(`Error de sintaxis: Tokens inesperados al final: ${this.peek()?.valor}`);
    }
    
    return expresion;
  }

  // Orden de precedencia: 
  // 1. SI_Y_SOLO_SI, ENTONCES (Menor precedencia / se evalúa al último al subir el árbol)
  // 2. O, O_EXCLUSIVA, NI, INCOMPATIBLE
  // 3. Y
  // 4. NO (Mayor precedencia)
  // 5. Paréntesis y variables

  private parsearImplicacionBicondicional(): NodoExpresion {
    let nodo = this.parsearDisyunciones();

    while (true) {
      const token = this.peek();
      if (token && token.tipo === 'OPERADOR' && (token.valor === 'ENTONCES' || token.valor === 'SI_Y_SOLO_SI')) {
        this.consume();
        const derecho = this.parsearDisyunciones();
        nodo = {
          tipo: 'operacion',
          operador: token.valor as Operador,
          izquierdo: nodo,
          derecho: derecho
        };
      } else {
        break;
      }
    }
    return nodo;
  }

  private parsearDisyunciones(): NodoExpresion {
    let nodo = this.parsearConjunciones();

    while (true) {
      const token = this.peek();
      if (token && token.tipo === 'OPERADOR' && ['O', 'O_EXCLUSIVA', 'NI', 'INCOMPATIBLE'].includes(token.valor)) {
        this.consume();
        const derecho = this.parsearConjunciones();
        nodo = {
          tipo: 'operacion',
          operador: token.valor as Operador,
          izquierdo: nodo,
          derecho: derecho
        };
      } else {
        break;
      }
    }
    return nodo;
  }

  private parsearConjunciones(): NodoExpresion {
    let nodo = this.parsearNegacion();

    while (true) {
      const token = this.peek();
      if (token && token.tipo === 'OPERADOR' && token.valor === 'Y') {
        this.consume();
        const derecho = this.parsearNegacion();
        nodo = {
          tipo: 'operacion',
          operador: token.valor as Operador,
          izquierdo: nodo,
          derecho: derecho
        };
      } else {
        break;
      }
    }
    return nodo;
  }

  private parsearNegacion(): NodoExpresion {
    const token = this.peek();
    
    if (token && token.tipo === 'OPERADOR' && token.valor === 'NO') {
      this.consume();
      const derecho = this.parsearNegacion(); // Permite múltiples negaciones anidadas "NO NO P"
      return {
        tipo: 'operacion',
        operador: 'NO',
        derecho: derecho
      };
    }
    
    return this.parsearPrimario();
  }

  private parsearPrimario(): NodoExpresion {
    const token = this.consume();
    
    if (!token) {
      throw new Error("Se esperaba una variable o '(', pero se encontró el final de la expresión");
    }

    if (token.tipo === 'VARIABLE') {
      return { tipo: 'variable', nombre: token.valor };
    }

    if (token.tipo === 'PARENTESIS_IZQ') {
      const nodo = this.parsearImplicacionBicondicional();
      const siguiente = this.consume();
      if (!siguiente || siguiente.tipo !== 'PARENTESIS_DER') {
        throw new Error("Falta paréntesis de cierre ')'");
      }
      return nodo;
    }

    throw new Error(`Token inesperado: ${token.valor}`);
  }
}

/**
 * Convierte una lista de tokens en un Árbol de Sintaxis Abstracta (AST).
 */
export function construirAST(tokens: Token[]): NodoExpresion {
  if (tokens.length === 0) {
    throw new Error("No hay tokens para parsear");
  }
  const parser = new ASTParser(tokens);
  return parser.parsear();
}

/**
 * Función Principal Pública del Parser.
 * Envuelve el proceso completo: Texto -> Tokens -> AST.
 */
export function parsearExpresion(entrada: string): NodoExpresion {
  const tokens = tokenizar(entrada);
  return construirAST(tokens);
}
