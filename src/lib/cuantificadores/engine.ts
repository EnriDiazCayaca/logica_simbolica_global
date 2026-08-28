/**
 * Motor Unificado de Cuantificadores Lógicos (Grupo 3)
 * Archivo único para reemplazo directo en: src/lib/cuantificadores/engine.ts
 */

export class ExpresionInvalidaError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ExpresionInvalidaError';
  }
}

export type TokenType = 'number' | 'identifier' | 'operator' | 'lparen' | 'rparen';

export interface Token {
  type: TokenType;
  value: string;
}

export interface NumberNode { type: 'number'; value: number; }
export interface VariableNode { type: 'variable'; }
export interface UnaryNode { type: 'unary'; op: string; value: ASTNode; }
export interface BinaryNode { type: 'binary'; op: string; left: ASTNode; right: ASTNode; }
export interface ComparisonNode { type: 'comparison'; op: string; left: ASTNode; right: ASTNode; }
export interface LogicalNode { type: 'logical'; op: 'and' | 'or'; left: ASTNode; right: ASTNode; }

export type ASTNode = NumberNode | VariableNode | UnaryNode | BinaryNode | ComparisonNode | LogicalNode;

export type QuantifierType = 'forall' | 'exists';
export type TipoCuantificador = QuantifierType;

export interface StepResult {
  formula: string;
  rule: string;
}

export interface PasoTrazabilidad {
  elemento: string;
  explicacion: string;
  resultado: boolean;
}

export interface PasoResolucion {
  ley: string;
  antes: string;
  despues: string;
}

export interface QuantifierEvaluation {
  isSatisfied: boolean;
  type: QuantifierType;
  displayExpression: string;
  counterExample: number | string | null;
  witness: number | string | null;
  demorganText: string;
  rows: Array<{ x: number | string; evaluatedText: string; result: boolean }>;
}

export interface ResultadoCuantificador {
  tipo: TipoCuantificador;
  dominio: string[];
  predicado: string;
  resultado: boolean;
  trazabilidad: PasoTrazabilidad[];
  contraejemplo?: string;
  testigo?: string;
  resumen: string;
  deMorgan: {
    regla: string;
    original: string;
    negado: string;
  };
  pasosResolucion: PasoResolucion[];
}

const COMPARADORES = ['=', '==', '!=', '<>', '>', '>=', '<', '<='];
const PALABRAS_AND = ['y', 'and'];
const PALABRAS_OR = ['o', 'or'];
const TOKENS_AND = [',', '&&', '∧', 'and'];
const TOKENS_OR = ['||', '∨', 'or'];
const RANGO_REGEX = /^\(?\s*(-?\d+(?:\.\d+)?)\s*(<=?|>=?)\s*[a-zA-Z]\s*(<=?|>=?)\s*(-?\d+(?:\.\d+)?)\s*\)?$/i;
const MAX_ELEMENTOS_RANGO = 2000;

export function tokenizeExpression(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (/[0-9.]/.test(ch)) {
      const match = source.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
      if (!match) throw new ExpresionInvalidaError(`Número inválido cerca de "${source.slice(i)}".`);
      tokens.push({ type: 'number', value: match[0] });
      i += match[0].length;
      continue;
    }
    if (/[a-zA-Z_]/.test(ch)) {
      const match = source.slice(i).match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
      if (match) {
        const palabra = match[0].toLowerCase();
        if (PALABRAS_AND.includes(palabra)) tokens.push({ type: 'operator', value: 'and' });
        else if (PALABRAS_OR.includes(palabra)) tokens.push({ type: 'operator', value: 'or' });
        else tokens.push({ type: 'identifier', value: match[0] });
        i += match[0].length;
        continue;
      }
    }
    const two = source.slice(i, i + 2);
    if (['>=', '<=', '!=', '==', '<>', '&&', '||'].includes(two)) {
      tokens.push({ type: 'operator', value: two });
      i += 2;
      continue;
    }
    if ('+-*/%^><=(),∧∨'.includes(ch)) {
      tokens.push({
        type: ch === '(' ? 'lparen' : ch === ')' ? 'rparen' : 'operator',
        value: ch,
      });
      i++;
      continue;
    }
    throw new ExpresionInvalidaError(`Símbolo no permitido: "${ch}".`);
  }
  if (tokens.length === 0) throw new ExpresionInvalidaError('La expresión está vacía.');
  return tokens;
}

export function parseTokens(tokens: Token[]): ASTNode {
  let pos = 0;
  const peek = (): Token | undefined => tokens[pos];

  function parsePrimary(): ASTNode {
    const token = peek();
    if (!token) throw new ExpresionInvalidaError('Falta una expresión.');
    if (token.type === 'number') { pos++; return { type: 'number', value: Number(token.value) }; }
    if (token.type === 'identifier') {
      pos++;
      return { type: 'variable' };
    }
    if (token.type === 'lparen') {
      pos++;
      const node = parseOr();
      const currentToken = peek();
      if (!currentToken || currentToken.value !== ')') throw new ExpresionInvalidaError('Falta un paréntesis de cierre ")".');
      pos++;
      return node;
    }
    throw new ExpresionInvalidaError(`Token inesperado: "${token.value}".`);
  }

  function parseUnary(): ASTNode {
    const t = peek();
    if (t && (t.value === '+' || t.value === '-')) {
      const op = t.value; pos++;
      return { type: 'unary', op, value: parseUnary() };
    }
    return parsePrimary();
  }

  function parsePower(): ASTNode {
    let left = parseUnary();
    while (peek()?.value === '^') {
      pos++; left = { type: 'binary', op: '^', left, right: parseUnary() };
    }
    return left;
  }

  function parseMultiplication(): ASTNode {
    let left = parsePower();
    while (peek() && ['*', '/', '%'].includes(peek()!.value)) {
      const op = peek()!.value; pos++;
      left = { type: 'binary', op, left, right: parsePower() };
    }
    return left;
  }

  function parseAddition(): ASTNode {
    let left = parseMultiplication();
    while (peek() && ['+', '-'].includes(peek()!.value)) {
      const op = peek()!.value; pos++;
      left = { type: 'binary', op, left, right: parseMultiplication() };
    }
    return left;
  }

  function parseComparisonChain(): ASTNode {
    let left = parseAddition();
    let chain: ASTNode | null = null;
    while (peek() && COMPARADORES.includes(peek()!.value)) {
      const op = peek()!.value; pos++;
      const right = parseAddition();
      const comparison: ComparisonNode = { type: 'comparison', op, left, right };
      chain = chain ? { type: 'logical', op: 'and', left: chain, right: comparison } : comparison;
      left = right;
    }
    return chain !== null ? chain : left;
  }

  function parseAnd(): ASTNode {
    let left = parseComparisonChain();
    while (peek() && TOKENS_AND.includes(peek()!.value)) {
      pos++;
      left = { type: 'logical', op: 'and', left, right: parseComparisonChain() };
    }
    return left;
  }

  function parseOr(): ASTNode {
    let left = parseAnd();
    while (peek() && TOKENS_OR.includes(peek()!.value)) {
      pos++;
      left = { type: 'logical', op: 'or', left, right: parseAnd() };
    }
    return left;
  }

  const ast = parseOr();
  if (pos < tokens.length) throw new ExpresionInvalidaError(`Expresión inesperada cerca de "${tokens[pos].value}".`);
  return ast;
}

export function evaluateAST(node: ASTNode, x: number): boolean | number {
  switch (node.type) {
    case 'number': return node.value;
    case 'variable': return x;
    case 'unary': {
      const val = evaluateAST(node.value, x) as number;
      return node.op === '-' ? -val : val;
    }
    case 'binary': {
      const a = evaluateAST(node.left, x) as number;
      const b = evaluateAST(node.right, x) as number;
      switch (node.op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': if (b === 0) throw new ExpresionInvalidaError('División por cero.'); return a / b;
        case '%': if (b === 0) throw new ExpresionInvalidaError('Módulo por cero.'); return a % b;
        case '^': return Math.pow(a, b);
      }
      break;
    }
    case 'comparison': {
      const a = evaluateAST(node.left, x) as number;
      const b = evaluateAST(node.right, x) as number;
      switch (node.op) {
        case '=': case '==': return a === b;
        case '!=': case '<>': return a !== b;
        case '>': return a > b;
        case '>=': return a >= b;
        case '<': return a < b;
        case '<=': return a <= b;
      }
      break;
    }
    case 'logical': {
      const a = evaluateAST(node.left, x) as boolean;
      const b = evaluateAST(node.right, x) as boolean;
      return node.op === 'and' ? a && b : a || b;
    }
  }
  throw new ExpresionInvalidaError('Nodo AST inválido.');
}

export function parseDomain(domainRaw: string): string[] {
  const partes = domainRaw.split(',').map(s => s.trim()).filter(Boolean);
  if (partes.length === 0) throw new ExpresionInvalidaError('El dominio D está vacío.');
  const valores: string[] = [];
  for (const parte of partes) {
    const match = parte.match(RANGO_REGEX);
    if (match) {
      const lower = Number(match[1]);
      const lowerInc = match[2].includes('=');
      const upperInc = match[3].includes('=');
      const upper = Number(match[4]);
      const inicio = lowerInc ? Math.ceil(lower) : Math.floor(lower) + 1;
      const fin = upperInc ? Math.floor(upper) : Math.ceil(upper) - 1;
      if (fin - inicio + 1 > MAX_ELEMENTOS_RANGO) throw new ExpresionInvalidaError('Rango demasiado grande.');
      for (let i = inicio; i <= fin; i++) valores.push(String(i));
      continue;
    }
    valores.push(parte);
  }
  return Array.from(new Set(valores));
}

export function normalizeExpression(expr: string): string {
  return expr
    .replace(/\s+/g, ' ')
    .replace(/<>/g, '≠')
    .replace(/==/g, '=')
    .replace(/\s*,\s*/g, ' ∧ ')
    .replace(/&&/g, '∧')
    .replace(/\|\|/g, '∨')
    .replace(/\b(and|y)\b/gi, '∧')
    .replace(/\b(or|o)\b/gi, '∨')
    .trim();
}

export function evaluateQuantifier(type: QuantifierType, domainRaw: string, expressionRaw: string): QuantifierEvaluation {
  const domain = parseDomain(domainRaw);
  const ast = parseTokens(tokenizeExpression(expressionRaw));
  
  let allTrue = true;
  let anyTrue = false;
  let counterExample: string | null = null;
  let witness: string | null = null;

  const rows = domain.map(elem => {
    const num = Number(elem);
    const res = Boolean(evaluateAST(ast, isNaN(num) ? 0 : num));
    if (res) { anyTrue = true; if (witness === null) witness = elem; }
    else { allTrue = false; if (counterExample === null) counterExample = elem; }
    return { x: elem, evaluatedText: expressionRaw.replace(/\bx\b/gi, String(elem)), result: res };
  });

  const isSatisfied = type === 'forall' ? allTrue : anyTrue;
  const displayExpression = normalizeExpression(expressionRaw);
  const oppQuant = type === 'forall' ? '∃x' : '∀x';
  const demorganText = `¬(${type === 'forall' ? '∀x' : '∃x'} ${displayExpression}) ≡ ${oppQuant} ¬(${displayExpression})`;

  return { isSatisfied, type, displayExpression, counterExample, witness, demorganText, rows };
}

export function solveFormula(formula: string, maxIterations = 15): StepResult[] {
  let current = formula.trim().replace(/\s+/g, ' ');
  const steps: StepResult[] = [{ formula: current, rule: 'Fórmula Original' }];
  let loops = 0;

  while (loops < maxIterations) {
    let applied = false;
    if (/~\s*~/.test(current)) {
      current = current.replace(/~\s*~\s*/g, '');
      steps.push({ formula: current, rule: 'Doble Negación' });
      applied = true;
    }
    if (!applied) break;
    loops++;
  }
  return steps;
}

export function parsearDominio(entrada: string): string[] {
  return parseDomain(entrada);
}

export function evaluarExpresionPredicado(expresion: string, elemento: string): boolean {
  try {
    const num = Number(elemento);
    const ast = parseTokens(tokenizeExpression(expresion));
    return Boolean(evaluateAST(ast, isNaN(num) ? 0 : num));
  } catch {
    return false;
  }
}

export function negarComparador(op: string): string {
  switch (op) {
    case '>': return '<=';
    case '<': return '>=';
    case '>=': return '<';
    case '<=': return '>';
    case '==': return '!=';
    case '!=': return '==';
    default: return op;
  }
}

export function negarExpresion(expr: string): string {
  if (expr.includes('∀')) return expr.replace('∀', '∃').replace(/P\(x\)/g, '¬P(x)');
  if (expr.includes('∃')) return expr.replace('∃', '∀').replace(/P\(x\)/g, '¬P(x)');
  return `¬(${expr})`;
}

export function aplicarLeyes(expr: string): Array<{ ley: string; antes: string; despues: string }> {
  return [
    { ley: 'Normalización AST', antes: expr, despues: expr.trim() }
  ];
}

export function obtenerPredicados(): Record<string, { fn: (x: string) => boolean; descripcion: string }> {
  return {
    esPar: { fn: (x) => Number(x) % 2 === 0, descripcion: 'x es un número par' },
    esImpar: { fn: (x) => Number(x) % 2 !== 0, descripcion: 'x es un número impar' },
    mayorQueDos: { fn: (x) => Number(x) > 2, descripcion: 'x es mayor que 2' },
  };
}

export function evaluarCuantificador(
  tipo: TipoCuantificador,
  dominio: string | string[],
  predicado: string
): ResultadoCuantificador {
  const dominioRaw = Array.isArray(dominio) ? dominio.join(',') : dominio;
  const evalRes = evaluateQuantifier(tipo, dominioRaw, predicado);
  
  const trazabilidad: PasoTrazabilidad[] = evalRes.rows.map(r => ({
    elemento: String(r.x),
    explicacion: `${evalRes.displayExpression} evaluado en x = ${r.x}`,
    resultado: r.result
  }));

  const resumen = tipo === 'forall'
    ? (evalRes.isSatisfied
        ? `Verdadero (V): El predicado se cumple para TODOS los elementos del dominio D.`
        : `Falso (F): Existe un contraejemplo x = ${evalRes.counterExample} que hace Falso el predicado.`)
    : (evalRes.isSatisfied
        ? `Verdadero (V): Existe al menos un testigo x = ${evalRes.witness} que satisface el predicado.`
        : `Falso (F): Ningún elemento del dominio D satisface el predicado.`);

  const oppQuantSymbol = tipo === 'forall' ? '∃x' : '∀x';
  const origQuantSymbol = tipo === 'forall' ? '∀x' : '∃x';

  return {
    tipo,
    dominio: parseDomain(dominioRaw),
    predicado: evalRes.displayExpression,
    resultado: evalRes.isSatisfied,
    trazabilidad,
    contraejemplo: evalRes.counterExample ? String(evalRes.counterExample) : undefined,
    testigo: evalRes.witness ? String(evalRes.witness) : undefined,
    resumen,
    deMorgan: {
      regla: tipo === 'forall'
        ? 'Negación del Universal: ¬(∀x P(x)) ≡ ∃x ¬P(x)'
        : 'Negación del Existencial: ¬(∃x P(x)) ≡ ∀x ¬P(x)',
      original: `${origQuantSymbol} ${evalRes.displayExpression}`,
      negado: `${oppQuantSymbol} ¬(${evalRes.displayExpression})`
    },
    pasosResolucion: solveFormula(predicado).map(s => ({
      ley: s.rule,
      antes: predicado,
      despues: s.formula
    }))
  };
}

