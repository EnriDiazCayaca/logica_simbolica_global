/**
 * ============================================================================
 * PROYECTO: LÓGICA SIMBÓLICA GLOBAL — NETLIFY v3.5
 * MÓDULO DE CUANTIFICADORES LÓGICOS (D ⊂ ℤ) Y DE MORGAN
 * ----------------------------------------------------------------------------
 * EQUIPO: Equipo 3 — Modus Innova
 * INCLUYE:
 *   1. Restricción estricta del Dominio D a números enteros (ℤ)
 *   2. Tokenizador RPN y AST de predicados libres
 *   3. Trazabilidad elemento por elemento y negación de De Morgan
 * ============================================================================
 */

export class ExpresionInvalidaError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ExpresionInvalidaError';
  }
}

export type QuantifierType = 'forall' | 'exists';

const MAX_ELEMENTOS_RANGO = 2000;
const COMPARADORES = ['=', '==', '!=', '<>', '>', '>=', '<', '<='];
const PALABRAS_AND = ['y', 'and'];
const PALABRAS_OR = ['o', 'or'];
const TOKENS_AND = [',', '&&', '∧', 'and'];
const TOKENS_OR = ['||', '∨', 'or'];

export function tokenizeExpression(source: string) {
  const tokens: any[] = [];
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
      const palabra = match[0].toLowerCase();
      if (PALABRAS_AND.includes(palabra)) tokens.push({ type: 'operator', value: 'and' });
      else if (PALABRAS_OR.includes(palabra)) tokens.push({ type: 'operator', value: 'or' });
      else tokens.push({ type: 'identifier', value: match[0] });
      i += match[0].length;
      continue;
    }
    const two = source.slice(i, i + 2);
    if (['>=', '<=', '!=', '==', '<>', '&&', '||'].includes(two)) {
      tokens.push({ type: 'operator', value: two });
      i += 2;
      continue;
    }
    if ('+-*/%^><=(),∧∨'.includes(ch)) {
      tokens.push({ type: ch === '(' ? 'lparen' : ch === ')' ? 'rparen' : 'operator', value: ch });
      i++;
      continue;
    }
    throw new ExpresionInvalidaError(`Símbolo no permitido: "${ch}".`);
  }
  if (tokens.length === 0) throw new ExpresionInvalidaError('La expresión está vacía.');
  return tokens;
}

export function parseTokens(tokens: any[]) {
  let pos = 0;
  const peek = () => tokens[pos];

  function parsePrimary(): any {
    const token = peek();
    if (!token) throw new ExpresionInvalidaError('Falta una expresión.');
    if (token.type === 'number') { pos++; return { type: 'number', value: Number(token.value) }; }
    if (token.type === 'identifier') {
      pos++;
      if (token.value.toLowerCase() !== 'x') throw new ExpresionInvalidaError(`Variable "${token.value}" no permitida en evaluación. Use x.`);
      return { type: 'variable' };
    }
    if (token.type === 'lparen') {
      pos++;
      const node = parseOr();
      if (!peek() || peek().value !== ')') throw new ExpresionInvalidaError('Falta un paréntesis de cierre ")".');
      pos++;
      return node;
    }
    throw new ExpresionInvalidaError(`Token inesperado: "${token.value}".`);
  }

  function parseUnary(): any {
    const t = peek();
    if (t && (t.value === '+' || t.value === '-')) {
      const op = t.value; pos++; return { type: 'unary', op, value: parseUnary() };
    }
    return parsePrimary();
  }

  function parsePower(): any {
    let left = parseUnary();
    while (peek() && peek().value === '^') {
      pos++; left = { type: 'binary', op: '^', left, right: parseUnary() };
    }
    return left;
  }

  function parseMultiplication(): any {
    let left = parsePower();
    while (peek() && ['*', '/', '%'].includes(peek().value)) {
      const op = peek().value; pos++; left = { type: 'binary', op, left, right: parsePower() };
    }
    return left;
  }

  function parseAddition(): any {
    let left = parseMultiplication();
    while (peek() && ['+', '-'].includes(peek().value)) {
      const op = peek().value; pos++; left = { type: 'binary', op, left, right: parseMultiplication() };
    }
    return left;
  }

  function parseComparisonChain(): any {
    let left = parseAddition();
    let chain: any = null;
    while (peek() && COMPARADORES.includes(peek().value)) {
      const op = peek().value; pos++;
      const right = parseAddition();
      const comparison = { type: 'comparison', op, left, right };
      chain = chain ? { type: 'logical', op: 'and', left: chain, right: comparison } : comparison;
      left = right;
    }
    return chain !== null ? chain : left;
  }

  function parseAnd(): any {
    let left = parseComparisonChain();
    while (peek() && TOKENS_AND.includes(peek().value)) {
      pos++;
      const right = parseComparisonChain();
      left = { type: 'logical', op: 'and', left, right };
    }
    return left;
  }

  function parseOr(): any {
    let left = parseAnd();
    while (peek() && TOKENS_OR.includes(peek().value)) {
      pos++;
      const right = parseAnd();
      left = { type: 'logical', op: 'or', left, right };
    }
    return left;
  }

  const ast = parseOr();
  if (pos < tokens.length) throw new ExpresionInvalidaError(`Expresión inesperada cerca de "${tokens[pos].value}".`);
  return ast;
}

export function evaluateNode(node: any, x: number): any {
  switch (node.type) {
    case 'number': return node.value;
    case 'variable': return x;
    case 'unary': {
      const value = evaluateNode(node.value, x);
      return node.op === '-' ? -value : value;
    }
    case 'binary': {
      const a = evaluateNode(node.left, x);
      const b = evaluateNode(node.right, x);
      switch (node.op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': if (b === 0) throw new ExpresionInvalidaError('División entre cero.'); return a / b;
        case '%': if (b === 0) throw new ExpresionInvalidaError('Módulo entre cero.'); return a % b;
        case '^': return Math.pow(a, b);
      }
      break;
    }
    case 'comparison': {
      const a = evaluateNode(node.left, x);
      const b = evaluateNode(node.right, x);
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
      const a = evaluateNode(node.left, x);
      const b = evaluateNode(node.right, x);
      return node.op === 'and' ? a && b : a || b;
    }
  }
  throw new ExpresionInvalidaError('Nodo de expresión desconocido.');
}

export function parseExpression(expression: string) {
  const tokens = tokenizeExpression(expression);
  return parseTokens(tokens);
}

export function createPredicate(expression: string) {
  const ast = parseExpression(expression);
  return {
    evaluate(x: number) {
      const result = evaluateNode(ast, x);
      return typeof result === 'boolean' ? result : result !== 0;
    },
  };
}

export function compilePredicate(expression: string) {
  const predicate = createPredicate(expression);
  return (x: number) => predicate.evaluate(x);
}

export function normalizeExpressionForDisplay(expression: string) {
  return expression
    .replace(/\s+/g, ' ')
    .replace(/<>/g, '≠')
    .replace(/==/g, '=')
    .replace(/\s*,\s*/g, ' ∧ ')
    .replace(/&&/g, '∧')
    .replace(/\|\|/g, '∨')
    .replace(/\b(and|y)\b/gi, '∧')
    .replace(/\b(or|o)\b/gi, '∨')
    .replace(/\s+/g, ' ')
    .trim();
}

export function negarComparador(op: string) {
  switch (op) {
    case '=': case '==': return '!=';
    case '!=': case '<>': return '=';
    case '>': return '<=';
    case '>=': return '<';
    case '<': return '>=';
    case '<=': return '>';
  }
}

export function negarNodo(node: any): any {
  switch (node.type) {
    case 'comparison':
      return { type: 'comparison', op: negarComparador(node.op), left: node.left, right: node.right };
    case 'logical':
      return {
        type: 'logical',
        op: node.op === 'and' ? 'or' : 'and',
        left: negarNodo(node.left),
        right: negarNodo(node.right),
      };
    case 'number': case 'variable': case 'unary': case 'binary':
      return { type: 'comparison', op: '==', left: node, right: { type: 'number', value: 0 } };
  }
}

const SIMBOLO_COMPARADOR: Record<string, string> = { '=': '=', '==': '=', '!=': '≠', '<>': '≠', '>': '>', '>=': '≥', '<': '<', '<=': '≤' };

export function astToString(node: any, esRaiz = true): string {
  let texto: string;
  switch (node.type) {
    case 'number': return String(node.value);
    case 'variable': return 'x';
    case 'unary': return `${node.op}${astToString(node.value, false)}`;
    case 'binary':
      texto = `${astToString(node.left, false)} ${node.op} ${astToString(node.right, false)}`;
      return esRaiz ? texto : `(${texto})`;
    case 'comparison':
      texto = `${astToString(node.left, false)} ${SIMBOLO_COMPARADOR[node.op]} ${astToString(node.right, false)}`;
      return esRaiz ? texto : `(${texto})`;
    case 'logical':
      texto = `${astToString(node.left, false)} ${node.op === 'and' ? '∧' : '∨'} ${astToString(node.right, false)}`;
      return esRaiz ? texto : `(${texto})`;
  }
  return '';
}

export function negateExpression(expression: string) {
  const ast = parseExpression(expression);
  const negado = negarNodo(ast);
  return astToString(negado);
}

export function negateQuantifierStatement(type: QuantifierType, expression: string) {
  const negatedExpressionDisplay = negateExpression(expression);
  const negatedType = type === 'forall' ? 'exists' : 'forall';
  const cuantificadorOriginal = type === 'forall' ? '∀x' : '∃x';
  const cuantificadorNegado = negatedType === 'forall' ? '∀x' : '∃x';
  const expresionOriginal = normalizeExpressionForDisplay(expression);
  const demorganText = `¬(${cuantificadorOriginal} ${expresionOriginal}) ≡ ${cuantificadorNegado} (${negatedExpressionDisplay})`;
  return { negatedType, negatedExpressionDisplay, demorganText };
}

const RANGO_REGEX = /^\(?\s*(-?\d+(?:\.\d+)?)\s*(<=|<)\s*x\s*(<=|<)\s*(-?\d+(?:\.\d+)?)\s*\)?$/i;

export function expandirRango(lowerBound: number, lowerInclusive: boolean, upperBound: number, upperInclusive: boolean) {
  if (!Number.isInteger(lowerBound) || !Number.isInteger(upperBound)) {
    throw new ExpresionInvalidaError(`El dominio D opera únicamente sobre Números Enteros (ℤ). El rango contiene límites decimales (${lowerBound} .. ${upperBound}).`);
  }
  const inicio = lowerInclusive ? Math.ceil(lowerBound) : Math.floor(lowerBound) + 1;
  const fin = upperInclusive ? Math.floor(upperBound) : Math.ceil(upperBound) - 1;
  if (inicio > fin) throw new ExpresionInvalidaError(`El rango (${lowerBound} .. ${upperBound}) no contiene enteros.`);
  const cantidad = fin - inicio + 1;
  if (cantidad > MAX_ELEMENTOS_RANGO) throw new ExpresionInvalidaError(`El rango genera ${cantidad} elementos.`);
  const resultado: number[] = [];
  for (let i = inicio; i <= fin; i++) resultado.push(i);
  return resultado;
}

export function parseDomain(domainRaw: string): number[] {
  const partes = domainRaw.split(',').map((s) => s.trim()).filter(Boolean);
  if (partes.length === 0) throw new ExpresionInvalidaError('El dominio D no puede estar vacío.');
  const valores: number[] = [];
  for (const parte of partes) {
    const match = parte.match(RANGO_REGEX);
    if (match) {
      const lowerBound = Number(match[1]);
      const lowerInclusive = match[2] === '<=';
      const upperInclusive = match[3] === '<=';
      const upperBound = Number(match[4]);
      valores.push(...expandirRango(lowerBound, lowerInclusive, upperBound, upperInclusive));
      continue;
    }
    if (parte.includes('.')) {
      throw new ExpresionInvalidaError(`El dominio D opera únicamente sobre Números Enteros (ℤ). El valor "${parte}" es decimal.`);
    }
    const numero = Number(parte);
    if (!Number.isFinite(numero) || !Number.isInteger(numero)) {
      throw new ExpresionInvalidaError(`El elemento "${parte}" del dominio D no es un número entero válido (ℤ).`);
    }
    valores.push(numero);
  }
  return Array.from(new Set(valores));
}

export function evaluateQuantifier(type: QuantifierType, domain: number[], expression: string) {
  if (!expression.trim()) throw new ExpresionInvalidaError('Ingrese un predicado, por ejemplo: x > 3.');
  if (domain.length === 0) throw new ExpresionInvalidaError('El dominio D no puede estar vacío.');

  const predicate = createPredicate(expression);
  const rows = domain.map((x) => ({ x, result: predicate.evaluate(x) }));
  const allTrue = rows.every((row) => row.result);
  const anyTrue = rows.some((row) => row.result);
  return {
    satisfied: type === 'forall' ? allTrue : anyTrue,
    rows,
    counterExample: rows.find((row) => !row.result)?.x ?? null,
    witness: rows.find((row) => row.result)?.x ?? null,
    displayExpression: normalizeExpressionForDisplay(expression),
    domain,
  };
}
