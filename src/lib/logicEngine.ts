// Motor de lógica proposicional: tokeniza, parsea y evalúa expresiones.
// Soporta variables (una letra), negación, conjunción, disyunción,
// implicación y bicondicional, con distintas notaciones de entrada.

export type NodeType = 'VAR' | 'NOT' | 'AND' | 'OR' | 'IMPLIES' | 'IFF';

export interface AstNode {
  type: NodeType;
  value?: string; // solo para VAR
  left?: AstNode;
  right?: AstNode; // NOT usa "right" como único operando
}

export class LogicParseError extends Error {}

const SYMBOL_MAP: Record<string, string> = {
  '¬': '¬', '~': '¬', '!': '¬', '-': '¬',
  '∧': '∧', '^': '∧', '&': '∧', '.': '∧',
  '∨': '∨', '|': '∨', '+': '∨',
  '→': '→', '↔': '↔',
};

/** Normaliza notaciones ASCII comunes a los símbolos canónicos. */
function normalize(input: string): string {
  return input
    .trim()
    .replace(/<->|<=>/g, '↔')
    .replace(/->|=>/g, '→')
    .replace(/\bAND\b/gi, '∧')
    .replace(/\bOR\b/gi, '∨')
    .replace(/\bNOT\b/gi, '¬')
    .replace(/\s+/g, '');
}

type Token = { type: 'VAR' | 'NOT' | 'AND' | 'OR' | 'IMPLIES' | 'IFF' | 'LPAREN' | 'RPAREN'; value?: string };

function tokenize(raw: string): Token[] {
  const input = normalize(raw);
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (ch === '(') { tokens.push({ type: 'LPAREN' }); i++; continue; }
    if (ch === ')') { tokens.push({ type: 'RPAREN' }); i++; continue; }
    if (ch === '↔') { tokens.push({ type: 'IFF' }); i++; continue; }
    if (ch === '→') { tokens.push({ type: 'IMPLIES' }); i++; continue; }
    if (SYMBOL_MAP[ch] === '∧') { tokens.push({ type: 'AND' }); i++; continue; }
    if (SYMBOL_MAP[ch] === '∨') { tokens.push({ type: 'OR' }); i++; continue; }
    if (SYMBOL_MAP[ch] === '¬') { tokens.push({ type: 'NOT' }); i++; continue; }
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
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(type: Token['type']): Token {
    const tok = this.tokens[this.pos];
    if (!tok || tok.type !== type) {
      throw new LogicParseError(`Se esperaba ${type} en la posición ${this.pos}`);
    }
    this.pos++;
    return tok;
  }

  parse(): AstNode {
    if (this.tokens.length === 0) {
      throw new LogicParseError('La proposición está vacía.');
    }
    const node = this.parseIff();
    if (this.pos < this.tokens.length) {
      throw new LogicParseError('Expresión inválida: sobran símbolos.');
    }
    return node;
  }

  private parseIff(): AstNode {
    let node = this.parseImplies();
    while (this.peek()?.type === 'IFF') {
      this.consume('IFF');
      const right = this.parseImplies();
      node = { type: 'IFF', left: node, right };
    }
    return node;
  }

  private parseImplies(): AstNode {
    let node = this.parseOr();
    while (this.peek()?.type === 'IMPLIES') {
      this.consume('IMPLIES');
      const right = this.parseOr();
      node = { type: 'IMPLIES', left: node, right };
    }
    return node;
  }

  private parseOr(): AstNode {
    let node = this.parseAnd();
    while (this.peek()?.type === 'OR') {
      this.consume('OR');
      const right = this.parseAnd();
      node = { type: 'OR', left: node, right };
    }
    return node;
  }

  private parseAnd(): AstNode {
    let node = this.parseNot();
    while (this.peek()?.type === 'AND') {
      this.consume('AND');
      const right = this.parseNot();
      node = { type: 'AND', left: node, right };
    }
    return node;
  }

  private parseNot(): AstNode {
    if (this.peek()?.type === 'NOT') {
      this.consume('NOT');
      const right = this.parseNot();
      return { type: 'NOT', right };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): AstNode {
    const tok = this.peek();
    if (!tok) throw new LogicParseError('Expresión incompleta.');
    if (tok.type === 'VAR') {
      this.consume('VAR');
      return { type: 'VAR', value: tok.value };
    }
    if (tok.type === 'LPAREN') {
      this.consume('LPAREN');
      const node = this.parseIff();
      this.consume('RPAREN');
      return node;
    }
    throw new LogicParseError('Se esperaba una variable o "(".');
  }
}

export function parseProposition(raw: string): AstNode {
  const tokens = tokenize(raw);
  return new Parser(tokens).parse();
}

/** Recolecta las variables presentes en el árbol, en orden alfabético. */
export function collectVariables(node: AstNode): string[] {
  const set = new Set<string>();
  const walk = (n: AstNode) => {
    if (n.type === 'VAR' && n.value) set.add(n.value);
    if (n.left) walk(n.left);
    if (n.right) walk(n.right);
  };
  walk(node);
  return Array.from(set).sort();
}

export function evaluate(node: AstNode, assignment: Record<string, boolean>): boolean {
  switch (node.type) {
    case 'VAR':
      return assignment[node.value as string] ?? true;
    case 'NOT':
      return !evaluate(node.right as AstNode, assignment);
    case 'AND':
      return evaluate(node.left as AstNode, assignment) && evaluate(node.right as AstNode, assignment);
    case 'OR':
      return evaluate(node.left as AstNode, assignment) || evaluate(node.right as AstNode, assignment);
    case 'IMPLIES':
      return !evaluate(node.left as AstNode, assignment) || evaluate(node.right as AstNode, assignment);
    case 'IFF':
      return evaluate(node.left as AstNode, assignment) === evaluate(node.right as AstNode, assignment);
    default:
      throw new LogicParseError('Nodo desconocido.');
  }
}

/** Convierte el AST de vuelta a texto legible con los símbolos canónicos. */
export function nodeToString(node: AstNode): string {
  switch (node.type) {
    case 'VAR':
      return node.value as string;
    case 'NOT':
      return `¬${wrapIfNeeded(node.right as AstNode)}`;
    case 'AND':
      return `${wrapIfNeeded(node.left as AstNode)} ∧ ${wrapIfNeeded(node.right as AstNode)}`;
    case 'OR':
      return `${wrapIfNeeded(node.left as AstNode)} ∨ ${wrapIfNeeded(node.right as AstNode)}`;
    case 'IMPLIES':
      return `${wrapIfNeeded(node.left as AstNode)} → ${wrapIfNeeded(node.right as AstNode)}`;
    case 'IFF':
      return `${wrapIfNeeded(node.left as AstNode)} ↔ ${wrapIfNeeded(node.right as AstNode)}`;
    default:
      return '';
  }
}

function wrapIfNeeded(node: AstNode): string {
  const str = nodeToString(node);
  return node.type === 'VAR' || node.type === 'NOT' ? str : `(${str})`;
}

export interface TruthTableRow {
  assignment: Record<string, boolean>;
  steps: { label: string; value: boolean }[];
  result: boolean;
}

export interface TruthTableResult {
  variables: string[];
  rows: TruthTableRow[];
  subExpressions: AstNode[]; // sub-expresiones internas, en orden de evaluación
}

/** Recolecta las sub-expresiones internas (no hoja) en orden post-order, sin duplicados de texto. */
export function collectSubExpressions(node: AstNode): AstNode[] {
  const seen = new Set<string>();
  const result: AstNode[] = [];
  const walk = (n: AstNode) => {
    if (n.left) walk(n.left);
    if (n.right) walk(n.right);
    if (n.type !== 'VAR') {
      const str = nodeToString(n);
      if (!seen.has(str)) {
        seen.add(str);
        result.push(n);
      }
    }
  };
  walk(node);
  return result;
}

/**
 * Genera la tabla de verdad completa para las variables activas.
 * Las variables desactivadas se fijan en "verdadero" y no generan columna propia.
 */
export function buildTruthTable(node: AstNode, activeVariables: string[]): TruthTableResult {
  const allVars = collectVariables(node);
  const inactive = allVars.filter((v) => !activeVariables.includes(v));
  const subExpressions = collectSubExpressions(node);
  const n = activeVariables.length;
  const rows: TruthTableRow[] = [];
  const total = n === 0 ? 1 : Math.pow(2, n);

  for (let i = 0; i < total; i++) {
    const assignment: Record<string, boolean> = {};
    activeVariables.forEach((v, idx) => {
      // Primera fila = todas verdaderas (V), como en el diseño de referencia.
      const bit = (i >> (n - idx - 1)) & 1;
      assignment[v] = bit === 0;
    });
    inactive.forEach((v) => {
      assignment[v] = true;
    });

    const steps = subExpressions.map((sub) => ({
      label: nodeToString(sub),
      value: evaluate(sub, assignment),
    }));

    rows.push({
      assignment,
      steps,
      result: evaluate(node, assignment),
    });
  }

  return { variables: activeVariables, rows, subExpressions };
}

/** Clasificación semántica de una proposición según su columna final de resultados. */
export type PropositionClassification = 'tautologia' | 'contradiccion' | 'contingencia';

export const classificationLabel: Record<PropositionClassification, string> = {
  tautologia: 'Tautología',
  contradiccion: 'Contradicción',
  contingencia: 'Contingencia',
};

export const classificationDescription: Record<PropositionClassification, string> = {
  tautologia: 'Es verdadera (V) en absolutamente todas las combinaciones posibles de valores de verdad.',
  contradiccion: 'Es falsa (F) en absolutamente todas las combinaciones posibles de valores de verdad.',
  contingencia: 'Su valor de verdad depende de la combinación: en algunas es V y en otras es F.',
};

/**
 * Determina si una proposición es tautología, contradicción o contingencia.
 * SIEMPRE evalúa la tabla de verdad completa con TODAS las variables presentes
 * en la expresión (independientemente de si el usuario desactivó alguna variable
 * en la interfaz), porque la clasificación lógica de una proposición no depende
 * de cuántas filas decida mostrar la interfaz.
 */
export function classifyProposition(node: AstNode): {
  classification: PropositionClassification;
  results: boolean[];
  trueCount: number;
  falseCount: number;
} {
  const allVars = collectVariables(node);
  const full = buildTruthTable(node, allVars);
  const results = full.rows.map((r) => r.result);
  const trueCount = results.filter(Boolean).length;
  const falseCount = results.length - trueCount;

  let classification: PropositionClassification;
  if (falseCount === 0) classification = 'tautologia';
  else if (trueCount === 0) classification = 'contradiccion';
  else classification = 'contingencia';

  return { classification, results, trueCount, falseCount };
}
