/**
 * Motor de evaluación de cuantificadores lógicos sobre dominios finitos.
 * Híbrido: mantiene compatibilidad con main + integra funcionalidades sanas de PR19 (AST seguro, rangos múltiples, ^)
 * Soporta cuantificador universal (∀) y existencial (∃).
 */

export class ExpresionInvalidaError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ExpresionInvalidaError';
  }
}

export type TipoCuantificador = 'forall' | 'exists'
export type QuantifierType = TipoCuantificador;

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

export interface StepResult {
  formula: string;
  rule: string;
}

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

// ── Predicados predefinidos (preservado main) ────────────────────────

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

// ── Tokenizer / Parser seguro (de PR19, corregido para ===/!==) ─────

const COMPARADORES = ['===', '!==', '==', '!=', '<>', '>=', '<=', '>', '<', '='];
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
    // 3-char operadores primero
    const three = source.slice(i, i + 3);
    if (['===', '!=='].includes(three)) {
      tokens.push({ type: 'operator', value: three });
      i += 3;
      continue;
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
        case '=': case '==': case '===': return a === b;
        case '!=': case '!==': case '<>': return a !== b;
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

// ── Parseo de dominio híbrido ────────────────────────────────────────
// Mantiene compatibilidad con main (rango único + lista) y añade soporte PR19 (rangos múltiples por coma)

export function parseDomain(domainRaw: string): string[] {
  const trimmed = domainRaw.trim();
  if (trimmed === '') return [];
  // Si contiene comas, tratamos cada parte como posible rango (funcionalidad PR19)
  if (trimmed.includes(',')) {
    const partes = trimmed.split(',').map(s => s.trim()).filter(Boolean);
    if (partes.length === 0) return [];
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
        if (inicio <= fin) {
          for (let i = inicio; i <= fin; i++) valores.push(String(i));
        }
        continue;
      }
      valores.push(parte);
    }
    return Array.from(new Set(valores));
  }
  // Sin comas: comportamiento original main para rango encadenado
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
  // Lista explícita simple sin rangos
  return trimmed.split(',').map((s) => s.trim()).filter(Boolean)
}

export function parsearDominio(entrada: string): string[] {
  // Wrapper compatible: no lanza en vacío, retorna []
  try {
    return parseDomain(entrada);
  } catch (e) {
    if (e instanceof ExpresionInvalidaError && entrada.trim() === '') return [];
    // Para rango demasiado grande, propagar? En tests no se espera throw, pero PR19 lo hace. Mantenemos throw solo para ese caso
    if (e instanceof ExpresionInvalidaError && e.message.includes('demasiado grande')) throw e;
    // Si es dominio vacío con comas pero sin valores, retornar []
    if (e instanceof ExpresionInvalidaError && e.message.includes('vacío')) return [];
    throw e;
  }
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

// ── Predicados libres híbrido ────────────────────────────────────────

function limpiarConectores(expr: string): string {
  return expr
    .replace(/\bAND\b/gi, '&&')
    .replace(/\bOR\b/gi, '||')
    .replace(/\bY\b/gi, '&&')
    .replace(/\bO\b/gi, '||')
}

export function evaluarExpresionPredicado(expresion: string, x: string): boolean {
  // Intento AST seguro primero (PR19), fallback a Function (main) para compatibilidad total
  try {
    const num = Number(x);
    const ast = parseTokens(tokenizeExpression(expresion));
    return Boolean(evaluateAST(ast, isNaN(num) ? 0 : num));
  } catch {
    // fallback main
    const n = Number(x)
    const exprLimpia = limpiarConectores(expresion)
      .replace(/x/g, `(${isNaN(n) ? `'${x}'` : n})`)
    try {
      if (/[a-zA-Z]/.test(exprLimpia.replace(/true|false/gi, ''))) {
        return false
      }
      const fn = new Function(`return (${exprLimpia})`)
      return Boolean(fn())
    } catch {
      return false
    }
  }
}

// ── Negación De Morgan profunda (preservado main) ────────────────────

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
  resultado = resultado.replace(/∃/g, 'TEMP').replace(/∀/g, '∃').replace(/TEMP/g, '∀')
  resultado = resultado.replace(/>=|<=|===|!==|>|<|==|!=/g, (match) => negarComparador(match))
  if (!resultado.startsWith('¬') && !resultado.startsWith('!')) {
    resultado = `¬(${resultado})`
  } else {
    resultado = resultado.replace(/^[¬!]\s*/, '')
  }
  return resultado
}

// ── Resolutor paso a paso (preservado main) ──────────────────────────

export function aplicarLeyes(expresion: string): PasoResolucion[] {
  const pasos: PasoResolucion[] = []
  let actual = expresion.trim()

  const bicondicionalMatch = actual.match(/^(.+?)\s*↔\s*(.+)$/)
  if (bicondicionalMatch) {
    const [, a, b] = bicondicionalMatch
    const despues = `(${a.trim()} → ${b.trim()}) ∧ (${b.trim()} → ${a.trim()})`
    pasos.push({ ley: 'Bicondicional', antes: actual, despues })
    actual = despues
  }

  const implicacionMatch = actual.match(/^(.+?)\s*→\s*(.+)$/)
  if (implicacionMatch && !actual.includes('↔')) {
    const [, a, b] = implicacionMatch
    const despues = `¬${a.trim()} ∨ ${b.trim()}`
    pasos.push({ ley: 'Implicación', antes: actual, despues })
    actual = despues
  }

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

  const dobleNegacionMatch = actual.match(/^¬\s*¬\s*(.+)$/)
  if (dobleNegacionMatch) {
    const [, a] = dobleNegacionMatch
    const despues = a.trim()
    pasos.push({ ley: 'Doble Negación', antes: actual, despues })
    actual = despues
  }

  const distMatch = actual.match(/^(.+?)\s*∧\s*\((.+?)\s*∨\s*(.+)\)$/)
  if (distMatch) {
    const [, a, b, c] = distMatch
    const despues = `(${a.trim()} ∧ ${b.trim()}) ∨ (${a.trim()} ∧ ${c.trim()})`
    pasos.push({ ley: 'Distribución', antes: actual, despues })
    actual = despues
  }

  const distDualMatch = actual.match(/^(.+?)\s*∨\s*\((.+?)\s*∧\s*(.+)\)$/)
  if (distDualMatch) {
    const [, a, b, c] = distDualMatch
    const despues = `(${a.trim()} ∨ ${b.trim()}) ∧ (${a.trim()} ∨ ${c.trim()})`
    pasos.push({ ley: 'Distribución dual', antes: actual, despues })
    actual = despues
  }

  return pasos
}

// Solución de PR19 como helper adicional (no reemplaza aplicarLeyes)
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

// Helper PR19: evaluateQuantifier con manejo de dominio vacío
export function evaluateQuantifier(type: QuantifierType, domainRaw: string, expressionRaw: string): QuantifierEvaluation {
  const domain = parseDomain(domainRaw);
  // Si dominio vacío, retornar evaluación vacua sin lanzar
  if (domain.length === 0) {
    const displayExpression = normalizeExpression(expressionRaw);
    const oppQuant = type === 'forall' ? '∃x' : '∀x';
    const demorganText = `¬(${type === 'forall' ? '∀x' : '∃x'} ${displayExpression}) ≡ ${oppQuant} ¬(${displayExpression})`;
    return { isSatisfied: type === 'forall', type, displayExpression, counterExample: null, witness: null, demorganText, rows: [] };
  }
  const ast = parseTokens(tokenizeExpression(expressionRaw));
  let allTrue = true;
  let anyTrue = false;
  let counterExample: string | null = null;
  let witness: string | null = null;
  const rows = domain.map(elem => {
    const num = Number(elem);
    // usar evaluarExpresionPredicado híbrido para consistencia? usamos AST directo
    let res: boolean;
    try { res = Boolean(evaluateAST(ast, isNaN(num) ? 0 : num)); } catch { res = false; }
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

// ── Función principal híbrida ────────────────────────────────────────
// Mantiene firma original (tipo, dominio:string[], predicado:Funcion, descripcion, expresionLibre?)
// + sobrecarga para (tipo, dominio:string|string[], predicado:string) de PR19

export function evaluarCuantificador(
  tipo: TipoCuantificador,
  dominio: string[] | string,
  predicado: FuncionPredicado | string,
  descripcionPredicado: string = 'predicado',
  expresionLibre?: string,
): ResultadoCuantificador {
  // Normalizar dominio
  let dominioArray: string[];
  if (Array.isArray(dominio)) {
    dominioArray = dominio;
  } else {
    // dominio es string raw
    dominioArray = parsearDominio(dominio);
  }

  // Si predicado es string, convertir a función via AST
  let fn: FuncionPredicado;
  let nombrePred: string;
  let exprLibreFinal: string | undefined = expresionLibre;

  if (typeof predicado === 'string') {
    const expr = predicado;
    fn = (x: string) => evaluarExpresionPredicado(expr, x);
    nombrePred = descripcionPredicado !== 'predicado' ? descripcionPredicado : expr;
    // Si no se pasó expresionLibre, usar el string como expresionLibre para pasos
    if (!exprLibreFinal) exprLibreFinal = expr;
  } else {
    fn = predicado;
    nombrePred = descripcionPredicado;
  }

  const trazabilidad: PasoTrazabilidad[] = []

  for (const elemento of dominioArray) {
    const resultado = fn(elemento)
    const desc = exprLibreFinal
      ? `P(${elemento}): ${exprLibreFinal} → ${resultado ? 'V' : 'F'}`
      : `P(${elemento}): ${nombrePred} → ${resultado ? 'V' : 'F'}`
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
  const nombrePredicado = exprLibreFinal ?? nombrePred

  const resumen = resultado
    ? tipo === 'forall'
      ? `Para todo x en D, se cumple que ${nombrePredicado}. La proposición ${simbolo}x P(x) es VERDADERA.`
      : `Existe al menos un x en D para el cual se cumple ${nombrePredicado}. La proposición ${simbolo}x P(x) es VERDADERA.`
    : tipo === 'forall'
      ? `No se cumple que para todo x en D, ${nombrePredicado}. La proposición ${simbolo}x P(x) es FALSA.`
      : `No existe ningún x en D para el cual se cumpla ${nombrePredicado}. La proposición ${simbolo}x P(x) es FALSA.`

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

  const pasosResolucion = exprLibreFinal ? aplicarLeyes(exprLibreFinal) : []

  return {
    tipo,
    dominio: dominioArray,
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
