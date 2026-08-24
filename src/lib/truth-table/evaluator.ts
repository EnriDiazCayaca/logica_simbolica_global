/**
 * Motor de tablas de verdad para lógica proposicional.
 * Adaptado a partir de la implementación de LogiLearn v3.
 */

export type NodeType = 'VAR' | 'NOT' | 'AND' | 'OR' | 'IMPLIES' | 'IFF';

export interface NodoExpresion {
  type: NodeType;
  value?: string;
  left?: NodoExpresion;
  right?: NodoExpresion;
}

export interface AsignacionTabla {
  variables: Map<string, boolean>;
  pasos: { label: string; value: boolean }[];
  resultado: boolean;
}

export interface ResultadoTabla {
  formula: string;
  variables: string[];
  filas: AsignacionTabla[];
  subExpresiones: NodoExpresion[];
  clasificacion: 'tautologia' | 'contradiccion' | 'contingencia';
  verdaderas: number;
  falsas: number;
}

export class LogicParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LogicParseError';
  }
}

type Token = {
  type: 'VAR' | 'NOT' | 'AND' | 'OR' | 'IMPLIES' | 'IFF' | 'LPAREN' | 'RPAREN';
  value?: string;
};

const SYMBOL_MAP: Record<string, Token['type']> = {
  '¬': 'NOT', '~': 'NOT', '!': 'NOT', '-': 'NOT',
  '∧': 'AND', '^': 'AND', '&': 'AND', '.': 'AND',
  '∨': 'OR', '|': 'OR', '+': 'OR',
  '→': 'IMPLIES', '↔': 'IFF',
};

function normalize(input: string): string {
  return input
    .trim()
    .replace(/<->|<=>/g, '↔')
    .replace(/->|=>/g, '→')
    .replace(/\bAND\b/gi, '∧')
    .replace(/\bOR\b/gi, '∨')
    .replace(/\bNOT\b/gi, '¬')
    .replace(/\bIMPLIES\b/gi, '→')
    .replace(/\bIFF\b/gi, '↔')
    .replace(/\s+/g, '');
}

function tokenize(raw: string): Token[] {
  const input = normalize(raw);
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];
    if (ch === '(') { tokens.push({ type: 'LPAREN' }); i++; continue; }
    if (ch === ')') { tokens.push({ type: 'RPAREN' }); i++; continue; }
    const mapped = SYMBOL_MAP[ch];
    if (mapped) { tokens.push({ type: mapped }); i++; continue; }
    if (/[a-zA-Z]/.test(ch)) {
      tokens.push({ type: 'VAR', value: ch.toUpperCase() });
      i++;
      continue;
    }
    throw new LogicParseError(`Carácter no reconocido: "${ch}"`);
  }
  return tokens;
}

class Parser {
  private position = 0;

  constructor(private readonly tokens: Token[]) {}

  private peek(): Token | undefined { return this.tokens[this.position]; }

  private consume(type: Token['type']): Token {
    const token = this.tokens[this.position];
    if (!token || token.type !== type) {
      throw new LogicParseError(`Se esperaba ${type} en la posición ${this.position}`);
    }
    this.position++;
    return token;
  }

  parse(): NodoExpresion {
    if (this.tokens.length === 0) throw new LogicParseError('La proposición está vacía.');
    const node = this.parseIff();
    if (this.position < this.tokens.length) throw new LogicParseError('Expresión inválida: sobran símbolos.');
    return node;
  }

  private parseIff(): NodoExpresion {
    let node = this.parseImplies();
    while (this.peek()?.type === 'IFF') {
      this.consume('IFF');
      node = { type: 'IFF', left: node, right: this.parseImplies() };
    }
    return node;
  }

  private parseImplies(): NodoExpresion {
    let node = this.parseOr();
    while (this.peek()?.type === 'IMPLIES') {
      this.consume('IMPLIES');
      node = { type: 'IMPLIES', left: node, right: this.parseOr() };
    }
    return node;
  }

  private parseOr(): NodoExpresion {
    let node = this.parseAnd();
    while (this.peek()?.type === 'OR') {
      this.consume('OR');
      node = { type: 'OR', left: node, right: this.parseAnd() };
    }
    return node;
  }

  private parseAnd(): NodoExpresion {
    let node = this.parseNot();
    while (this.peek()?.type === 'AND') {
      this.consume('AND');
      node = { type: 'AND', left: node, right: this.parseNot() };
    }
    return node;
  }

  private parseNot(): NodoExpresion {
    if (this.peek()?.type === 'NOT') {
      this.consume('NOT');
      return { type: 'NOT', right: this.parseNot() };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): NodoExpresion {
    const token = this.peek();
    if (!token) throw new LogicParseError('Expresión incompleta.');
    if (token.type === 'VAR') {
      this.consume('VAR');
      return { type: 'VAR', value: token.value };
    }
    if (token.type === 'LPAREN') {
      this.consume('LPAREN');
      const node = this.parseIff();
      this.consume('RPAREN');
      return node;
    }
    throw new LogicParseError('Se esperaba una variable o "(".');
  }
}

export function parseProposition(formula: string): NodoExpresion {
  return new Parser(tokenize(formula)).parse();
}

export function collectVariables(node: NodoExpresion): string[] {
  const variables = new Set<string>();
  const visit = (current: NodoExpresion): void => {
    if (current.type === 'VAR' && current.value) variables.add(current.value);
    if (current.left) visit(current.left);
    if (current.right) visit(current.right);
  };
  visit(node);
  return Array.from(variables).sort();
}

export function evaluar(nodo: NodoExpresion, asignacion: Map<string, boolean>): boolean {
  switch (nodo.type) {
    case 'VAR':
      return asignacion.get(nodo.value ?? '') ?? false;
    case 'NOT':
      return !evaluar(nodo.right as NodoExpresion, asignacion);
    case 'AND':
      return evaluar(nodo.left as NodoExpresion, asignacion) && evaluar(nodo.right as NodoExpresion, asignacion);
    case 'OR':
      return evaluar(nodo.left as NodoExpresion, asignacion) || evaluar(nodo.right as NodoExpresion, asignacion);
    case 'IMPLIES':
      return !evaluar(nodo.left as NodoExpresion, asignacion) || evaluar(nodo.right as NodoExpresion, asignacion);
    case 'IFF':
      return evaluar(nodo.left as NodoExpresion, asignacion) === evaluar(nodo.right as NodoExpresion, asignacion);
  }
}

export function nodeToString(node: NodoExpresion): string {
  switch (node.type) {
    case 'VAR': return node.value ?? '';
    case 'NOT': return `¬${wrap(node.right as NodoExpresion)}`;
    case 'AND': return `${wrap(node.left as NodoExpresion)} ∧ ${wrap(node.right as NodoExpresion)}`;
    case 'OR': return `${wrap(node.left as NodoExpresion)} ∨ ${wrap(node.right as NodoExpresion)}`;
    case 'IMPLIES': return `${wrap(node.left as NodoExpresion)} → ${wrap(node.right as NodoExpresion)}`;
    case 'IFF': return `${wrap(node.left as NodoExpresion)} ↔ ${wrap(node.right as NodoExpresion)}`;
  }
}

function wrap(node: NodoExpresion): string {
  const text = nodeToString(node);
  return node.type === 'VAR' || node.type === 'NOT' ? text : `(${text})`;
}

export function collectSubExpressions(node: NodoExpresion): NodoExpresion[] {
  const result: NodoExpresion[] = [];
  const seen = new Set<string>();
  const visit = (current: NodoExpresion): void => {
    if (current.left) visit(current.left);
    if (current.right) visit(current.right);
    if (current.type !== 'VAR') {
      const text = nodeToString(current);
      if (!seen.has(text)) {
        seen.add(text);
        result.push(current);
      }
    }
  };
  visit(node);
  return result;
}

function generarFilas(nodo: NodoExpresion, variables: string[]): AsignacionTabla[] {
  const subExpresiones = collectSubExpressions(nodo);
  const total = Math.pow(2, variables.length);
  const filas: AsignacionTabla[] = [];

  for (let row = 0; row < total; row++) {
    const map = new Map<string, boolean>();
    variables.forEach((variable, index) => {
      map.set(variable, ((row >> (variables.length - index - 1)) & 1) === 0);
    });

    filas.push({
      variables: map,
      pasos: subExpresiones.map((sub) => ({ label: nodeToString(sub), value: evaluar(sub, map) })),
      resultado: evaluar(nodo, map),
    });
  }
  return filas;
}

export function generarTabla(formula: string): ResultadoTabla {
  const nodo = parseProposition(formula);
  const variables = collectVariables(nodo);
  const filas = generarFilas(nodo, variables);
  const verdaderas = filas.filter((fila) => fila.resultado).length;
  const falsas = filas.length - verdaderas;

  const clasificacion = falsas === 0
    ? 'tautologia'
    : verdaderas === 0
      ? 'contradiccion'
      : 'contingencia';

  return {
    formula,
    variables,
    filas,
    subExpresiones: collectSubExpressions(nodo),
    clasificacion,
    verdaderas,
    falsas,
  };
}
