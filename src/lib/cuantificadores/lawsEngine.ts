/**
 * ============================================================================
 * PROYECTO: LÓGICA SIMBÓLICA GLOBAL — NETLIFY v3.0
 * MÓDULO DE DISTRIBUCIÓN Y LEYES DE PREDICADOS
 * ----------------------------------------------------------------------------
 * EQUIPO: Equipo 3 — Modus Innova
 * INCLUYE:
 *   1. Disyunción Fuerte / Exclusiva (Δ / ⊕)
 *   2. Simplificación de pasos repetidos continuos
 *   3. Trazabilidad de subexpresiones transformadas (changedChunk)
 * ============================================================================
 */

export interface ProofStep {
  formula: string;
  rule: string;
  changedChunk?: string;
}

export type RuleId =
  | 'doble_negacion'
  | 'disyuncion_fuerte'
  | 'bicondicional'
  | 'implicacion'
  | 'morgan'
  | 'distribucion'
  | 'cuantificador_vacio'
  | 'modus_ponens'
  | 'tollendo_tollens'
  | 'silogismo_hipotetico';

const LEYES_A_INTENTAR: RuleId[] = [
  'doble_negacion',
  'disyuncion_fuerte',
  'bicondicional',
  'implicacion',
  'morgan',
  'distribucion',
  'cuantificador_vacio',
  'modus_ponens',
  'tollendo_tollens',
  'silogismo_hipotetico',
];

function normalizeFormula(s: string): string {
  return s.trim().replace(/\s+/g, ' ');
}

const ATOMO_O_GRUPO = /~?\s*[A-Za-z]x?|~?\s*[\(\[][^\)\]]+[\)\]]/.source;

function findMatchingClose(str: string, openIdx: number): number {
  const openChar = str[openIdx];
  const closeChar = openChar === '[' ? ']' : openChar === '(' ? ')' : null;
  if (!closeChar) return -1;
  let depth = 1;
  for (let i = openIdx + 1; i < str.length; i++) {
    if (str[i] === openChar) depth++;
    else if (str[i] === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function findTopLevelOperator(expr: string, targetOps = ['↔', '→', '∧', '∨', 'Δ', '⊕']) {
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth--;
    else if (depth === 0) {
      for (const op of targetOps) {
        if (expr.substring(i).startsWith(op)) {
          return {
            op: op,
            index: i,
            left: expr.substring(0, i).trim(),
            right: expr.substring(i + op.length).trim(),
          };
        }
      }
    }
  }
  return null;
}

function getOperandLeft(str: string, operatorIdx: number) {
  let end = operatorIdx;
  let i = operatorIdx - 1;
  while (i >= 0 && /\s/.test(str[i])) i--;
  if (i < 0) return null;

  if (str[i] === ')' || str[i] === ']') {
    const closeChar = str[i];
    const openChar = closeChar === ')' ? '(' : '[';
    let depth = 1;
    let start = i;
    for (let k = i - 1; k >= 0; k--) {
      if (str[k] === closeChar) depth++;
      else if (str[k] === openChar) {
        depth--;
        if (depth === 0) {
          start = k;
          let p = start - 1;
          while (p >= 0 && /\s/.test(str[p])) p--;
          if (p >= 0 && str[p] === '~') start = p;
          return { text: str.substring(start, end).trim(), start, end: operatorIdx };
        }
      }
    }
    return null;
  } else {
    let start = i;
    while (start >= 0 && /[a-zA-Z0-9_~]/.test(str[start])) {
      if (str[start] === '~') break;
      start--;
    }
    if (start < 0 || !/[a-zA-Z0-9_~]/.test(str[start])) start++;
    return { text: str.substring(start, end).trim(), start, end: operatorIdx };
  }
}

function getOperandRight(str: string, startFromIdx: number) {
  let i = startFromIdx;
  while (i < str.length && /\s/.test(str[i])) i++;
  if (i >= str.length) return null;

  let start = i;
  if (str[i] === '~') {
    i++;
    while (i < str.length && /\s/.test(str[i])) i++;
  }

  if (i < str.length && (str[i] === '(' || str[i] === '[')) {
    const closeIdx = findMatchingClose(str, i);
    if (closeIdx !== -1) {
      return { text: str.substring(start, closeIdx + 1).trim(), start, end: closeIdx + 1 };
    }
    return null;
  } else {
    let end = i;
    while (end < str.length && /[a-zA-Z0-9_]/.test(str[end])) end++;
    if (end === start) return null;
    return { text: str.substring(start, end).trim(), start, end };
  }
}

export function tryApplyRule(ruleId: RuleId, formula: string): ProofStep | null {
  const original = formula;
  let result: ProofStep | null = null;

  switch (ruleId) {
    case 'doble_negacion': {
      if (/~\s*~/.test(formula)) {
        const newF = formula.replace(/~\s*~\s*/g, '');
        result = { formula: newF, rule: 'Doble Negación', changedChunk: '' };
      }
      break;
    }

    case 'disyuncion_fuerte': {
      for (let i = 0; i < formula.length; i++) {
        if (formula[i] === 'Δ' || formula[i] === '⊕' || formula[i] === '⊻') {
          const leftObj = getOperandLeft(formula, i);
          const rightObj = getOperandRight(formula, i + 1);
          if (leftObj && rightObj) {
            const A = leftObj.text;
            const B = rightObj.text;
            const replacement = `[(${A} ∨ ${B}) ∧ ~(${A} ∧ ${B})]`;
            result = {
              formula: formula.substring(0, leftObj.start) + replacement + formula.substring(rightObj.end),
              rule: 'Definición de Disyunción Fuerte (Exclusiva)',
              changedChunk: replacement,
            };
            break;
          }
        }
      }
      break;
    }

    case 'bicondicional': {
      for (let i = 0; i < formula.length; i++) {
        if (formula[i] === '↔') {
          const leftObj = getOperandLeft(formula, i);
          const rightObj = getOperandRight(formula, i + 1);
          if (leftObj && rightObj) {
            const A = leftObj.text;
            const B = rightObj.text;
            const replacement = `(${A} → ${B}) ∧ (${B} → ${A})`;
            result = {
              formula: formula.substring(0, leftObj.start) + replacement + formula.substring(rightObj.end),
              rule: 'Definición de Bicondicional',
              changedChunk: replacement,
            };
            break;
          }
        }
      }
      break;
    }

    case 'implicacion': {
      for (let i = 0; i < formula.length; i++) {
        if (formula[i] === '→') {
          const leftObj = getOperandLeft(formula, i);
          const rightObj = getOperandRight(formula, i + 1);
          if (leftObj && rightObj) {
            let A = leftObj.text.trim();
            let B = rightObj.text.trim();
            let negA = A.startsWith('~') ? A.substring(1).trim() : `~${A}`;
            const replacement = `${negA} ∨ ${B}`;
            result = {
              formula: formula.substring(0, leftObj.start) + replacement + formula.substring(rightObj.end),
              rule: 'Definición de Implicación',
              changedChunk: replacement,
            };
            break;
          }
        }
      }
      break;
    }

    case 'morgan': {
      for (let i = 0; i < formula.length; i++) {
        if (formula[i] === '~') {
          let j = i + 1;
          while (j < formula.length && /\s/.test(formula[j])) j++;
          if (j < formula.length && (formula[j] === '(' || formula[j] === '[')) {
            const closeIdx = findMatchingClose(formula, j);
            if (closeIdx !== -1) {
              const inner = formula.substring(j + 1, closeIdx).trim();
              const mainOp = findTopLevelOperator(inner, ['∧', '∨']);
              if (mainOp) {
                const newOp = mainOp.op === '∧' ? '∨' : '∧';
                let leftNeg = mainOp.left.startsWith('~') ? mainOp.left.substring(1).trim() : `~${mainOp.left}`;
                let rightNeg = mainOp.right.startsWith('~') ? mainOp.right.substring(1).trim() : `~${mainOp.right}`;
                const replacement = `[${leftNeg} ${newOp} ${rightNeg}]`;
                result = {
                  formula: formula.substring(0, i) + replacement + formula.substring(closeIdx + 1),
                  rule: 'Ley de De Morgan',
                  changedChunk: replacement,
                };
                break;
              }
            }
          }
        }
      }
      break;
    }

    case 'distribucion': {
      const quantRegex = /(\(?[∀∃]([a-z])\)?)\s*/g;
      let match: RegExpExecArray | null;
      while ((match = quantRegex.exec(formula)) !== null) {
        const quant = match[1].trim();
        const startIdx = match.index;
        const scopeStartIdx = startIdx + match[0].length;

        if (scopeStartIdx < formula.length && (formula[scopeStartIdx] === '(' || formula[scopeStartIdx] === '[')) {
          const closeIdx = findMatchingClose(formula, scopeStartIdx);
          if (closeIdx !== -1) {
            const inner = formula.substring(scopeStartIdx + 1, closeIdx).trim();
            const mainOp = findTopLevelOperator(inner, ['∧', '∨']);
            if (mainOp) {
              const replacement = `${quant}${mainOp.left} ${mainOp.op} ${quant}${mainOp.right}`;
              result = {
                formula: formula.substring(0, startIdx) + replacement + formula.substring(closeIdx + 1),
                rule: 'Distribución de Cuantificadores',
                changedChunk: replacement,
              };
              break;
            }
          }
        }
      }
      break;
    }

    case 'cuantificador_vacio': {
      const quantRegex = /(\(?[∀∃]([a-z])\)?)\s*/g;
      let match: RegExpExecArray | null;
      while ((match = quantRegex.exec(formula)) !== null) {
        const fullQuant = match[0];
        const quantVar = match[2];
        const startIdx = match.index;
        const scopeStartIdx = startIdx + fullQuant.length;
        if (scopeStartIdx >= formula.length) break;

        const rightObj = getOperandRight(formula, scopeStartIdx);
        if (rightObj) {
          const scope = rightObj.text;
          if (!scope.includes(quantVar)) {
            result = {
              formula: formula.substring(0, startIdx) + scope + formula.substring(rightObj.end),
              rule: 'Eliminación de Cuantificador Vacío',
              changedChunk: scope,
            };
            break;
          }
        }
      }
      break;
    }
  }
  return result && result.formula !== original ? result : null;
}

export function solveFormula(initialFormula: string, maxIterations = 15): ProofStep[] {
  let current = normalizeFormula(initialFormula);
  const steps: ProofStep[] = [{ formula: current, rule: 'Fórmula Original', changedChunk: '' }];
  let changed = true;
  let loops = 0;

  while (changed && loops < maxIterations) {
    changed = false;
    for (const ruleId of LEYES_A_INTENTAR) {
      const stepResult = tryApplyRule(ruleId, current);
      if (stepResult) {
        current = normalizeFormula(stepResult.formula);
        let ruleName = stepResult.rule;
        let changedChunk = stepResult.changedChunk || '';

        // SIMPLIFICACIÓN: Aplica repetidamente la misma regla en el mismo paso
        while (true) {
          const nextRes = tryApplyRule(ruleId, current);
          if (nextRes && normalizeFormula(nextRes.formula) !== current) {
            current = normalizeFormula(nextRes.formula);
            if (nextRes.changedChunk) {
              changedChunk += (changedChunk ? ' y ' : '') + nextRes.changedChunk;
            }
          } else {
            break;
          }
        }

        steps.push({ formula: current, rule: ruleName, changedChunk });
        changed = true;
        break;
      }
    }
    loops++;
  }
  return steps;
}
