/**
 * Motor de tablas de verdad para lógica proposicional.
 * Soporta múltiples notaciones: símbolos Unicode, ASCII, palabras clave.
 * Genera tablas completas con sub-expresiones y clasificación semántica.
 */

export type TipoNodo = 'VAR' | 'NOT' | 'AND' | 'OR' | 'IMPLIES' | 'IFF';

export interface NodoExpresion {
  tipo: TipoNodo;
  valor?: string;
  izquierdo?: NodoExpresion;
  derecho?: NodoExpresion;
}

export type ClasificacionProposicion = 'tautologia' | 'contradiccion' | 'contingencia';

export interface FilaTabla {
  asignacion: Record<string, boolean>;
  pasos: { etiqueta: string; valor: boolean }[];
  resultado: boolean;
}

export interface ResultadoTabla {
  formula: string;
  variables: string[];
  filas: FilaTabla[];
  subExpresiones: NodoExpresion[];
  clasificacion: ClasificacionProposicion;
  verdaderas: number;
  falsas: number;
}

export class ErrorParseoLogico extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErrorParseoLogico';
  }
}

const MAPA_SIMBOLOS: Record<string, string> = {
  '¬': 'NOT', '~': 'NOT', '!': 'NOT', '-': 'NOT',
  '∧': 'AND', '^': 'AND', '&': 'AND', '.': 'AND',
  '∨': 'OR', '|': 'OR', '+': 'OR',
  '→': 'IMPLIES', '↔': 'IFF',
};

type Token = {
  tipo: 'VAR' | 'NOT' | 'AND' | 'OR' | 'IMPLIES' | 'IFF' | 'LPAREN' | 'RPAREN';
  valor?: string;
};

function normalizar(input: string): string {
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

function tokenizar(raw: string): Token[] {
  const input = normalizar(raw);
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];
    if (ch === '(') { tokens.push({ tipo: 'LPAREN' }); i++; continue; }
    if (ch === ')') { tokens.push({ tipo: 'RPAREN' }); i++; continue; }
    const mapped = MAPA_SIMBOLOS[ch];
    if (mapped) { tokens.push({ tipo: mapped as Token['tipo'] }); i++; continue; }
    if (/[a-zA-Z]/.test(ch)) {
      tokens.push({ tipo: 'VAR', valor: ch.toUpperCase() });
      i++;
      continue;
    }
    throw new ErrorParseoLogico(`Carácter no reconocido: "${ch}"`);
  }
  return tokens;
}

class Parser {
  private posicion = 0;

  constructor(private readonly tokens: Token[]) {}

  private mirar(): Token | undefined {
    return this.tokens[this.posicion];
  }

  private consumir(tipo: Token['tipo']): Token {
    const token = this.tokens[this.posicion];
    if (!token || token.tipo !== tipo) {
      throw new ErrorParseoLogico(`Se esperaba ${tipo} en la posición ${this.posicion}`);
    }
    this.posicion++;
    return token;
  }

  parsear(): NodoExpresion {
    if (this.tokens.length === 0) throw new ErrorParseoLogico('La proposición está vacía.');
    const nodo = this.parsearIff();
    if (this.posicion < this.tokens.length) throw new ErrorParseoLogico('Expresión inválida: sobran símbolos.');
    return nodo;
  }

  private parsearIff(): NodoExpresion {
    let nodo = this.parsearImplies();
    while (this.mirar()?.tipo === 'IFF') {
      this.consumir('IFF');
      nodo = { tipo: 'IFF', izquierdo: nodo, derecho: this.parsearImplies() };
    }
    return nodo;
  }

  private parsearImplies(): NodoExpresion {
    let nodo = this.parsearOr();
    while (this.mirar()?.tipo === 'IMPLIES') {
      this.consumir('IMPLIES');
      nodo = { tipo: 'IMPLIES', izquierdo: nodo, derecho: this.parsearOr() };
    }
    return nodo;
  }

  private parsearOr(): NodoExpresion {
    let nodo = this.parsearAnd();
    while (this.mirar()?.tipo === 'OR') {
      this.consumir('OR');
      nodo = { tipo: 'OR', izquierdo: nodo, derecho: this.parsearAnd() };
    }
    return nodo;
  }

  private parsearAnd(): NodoExpresion {
    let nodo = this.parsearNot();
    while (this.mirar()?.tipo === 'AND') {
      this.consumir('AND');
      nodo = { tipo: 'AND', izquierdo: nodo, derecho: this.parsearNot() };
    }
    return nodo;
  }

  private parsearNot(): NodoExpresion {
    if (this.mirar()?.tipo === 'NOT') {
      this.consumir('NOT');
      return { tipo: 'NOT', derecho: this.parsearNot() };
    }
    return this.parsearPrimario();
  }

  private parsearPrimario(): NodoExpresion {
    const token = this.mirar();
    if (!token) throw new ErrorParseoLogico('Expresión incompleta.');
    if (token.tipo === 'VAR') {
      this.consumir('VAR');
      return { tipo: 'VAR', valor: token.valor };
    }
    if (token.tipo === 'LPAREN') {
      this.consumir('LPAREN');
      const nodo = this.parsearIff();
      this.consumir('RPAREN');
      return nodo;
    }
    throw new ErrorParseoLogico('Se esperaba una variable o "(".');
  }
}

export function parsearProposicion(formula: string): NodoExpresion {
  return new Parser(tokenizar(formula)).parsear();
}

export function recolectarVariables(nodo: NodoExpresion): string[] {
  const variables = new Set<string>();
  const visitar = (actual: NodoExpresion): void => {
    if (actual.tipo === 'VAR' && actual.valor) variables.add(actual.valor);
    if (actual.izquierdo) visitar(actual.izquierdo);
    if (actual.derecho) visitar(actual.derecho);
  };
  visitar(nodo);
  return Array.from(variables).sort();
}

export function evaluar(nodo: NodoExpresion, asignacion: Record<string, boolean>): boolean {
  switch (nodo.tipo) {
    case 'VAR':
      return asignacion[nodo.valor ?? ''] ?? false;
    case 'NOT':
      return !evaluar(nodo.derecho as NodoExpresion, asignacion);
    case 'AND':
      return evaluar(nodo.izquierdo as NodoExpresion, asignacion) && evaluar(nodo.derecho as NodoExpresion, asignacion);
    case 'OR':
      return evaluar(nodo.izquierdo as NodoExpresion, asignacion) || evaluar(nodo.derecho as NodoExpresion, asignacion);
    case 'IMPLIES':
      return !evaluar(nodo.izquierdo as NodoExpresion, asignacion) || evaluar(nodo.derecho as NodoExpresion, asignacion);
    case 'IFF':
      return evaluar(nodo.izquierdo as NodoExpresion, asignacion) === evaluar(nodo.derecho as NodoExpresion, asignacion);
  }
}

export function nodoATexto(nodo: NodoExpresion): string {
  switch (nodo.tipo) {
    case 'VAR': return nodo.valor ?? '';
    case 'NOT': return `¬${envolver(nodo.derecho as NodoExpresion)}`;
    case 'AND': return `${envolver(nodo.izquierdo as NodoExpresion)} ∧ ${envolver(nodo.derecho as NodoExpresion)}`;
    case 'OR': return `${envolver(nodo.izquierdo as NodoExpresion)} ∨ ${envolver(nodo.derecho as NodoExpresion)}`;
    case 'IMPLIES': return `${envolver(nodo.izquierdo as NodoExpresion)} → ${envolver(nodo.derecho as NodoExpresion)}`;
    case 'IFF': return `${envolver(nodo.izquierdo as NodoExpresion)} ↔ ${envolver(nodo.derecho as NodoExpresion)}`;
  }
}

function envolver(nodo: NodoExpresion): string {
  const texto = nodoATexto(nodo);
  return nodo.tipo === 'VAR' || nodo.tipo === 'NOT' ? texto : `(${texto})`;
}

export function recolectarSubExpresiones(nodo: NodoExpresion): NodoExpresion[] {
  const resultado: NodoExpresion[] = [];
  const vistas = new Set<string>();
  const visitar = (actual: NodoExpresion): void => {
    if (actual.izquierdo) visitar(actual.izquierdo);
    if (actual.derecho) visitar(actual.derecho);
    if (actual.tipo !== 'VAR') {
      const texto = nodoATexto(actual);
      if (!vistas.has(texto)) {
        vistas.add(texto);
        resultado.push(actual);
      }
    }
  };
  visitar(nodo);
  return resultado;
}

export function clasificarProposicion(nodo: NodoExpresion): {
  clasificacion: ClasificacionProposicion;
  resultados: boolean[];
  conteoVerdaderas: number;
  conteoFalsas: number;
} {
  const variables = recolectarVariables(nodo);
  const subExpresiones = recolectarSubExpresiones(nodo);
  const total = Math.pow(2, variables.length);
  const resultados: boolean[] = [];

  for (let fila = 0; fila < total; fila++) {
    const asignacion: Record<string, boolean> = {};
    variables.forEach((v, idx) => {
      asignacion[v] = ((fila >> (variables.length - idx - 1)) & 1) === 0;
    });
    resultados.push(evaluar(nodo, asignacion));
  }

  const conteoVerdaderas = resultados.filter(Boolean).length;
  const conteoFalsas = resultados.length - conteoVerdaderas;

  let clasificacion: ClasificacionProposicion;
  if (conteoFalsas === 0) clasificacion = 'tautologia';
  else if (conteoVerdaderas === 0) clasificacion = 'contradiccion';
  else clasificacion = 'contingencia';

  return { clasificacion, resultados, conteoVerdaderas, conteoFalsas };
}

export function generarFilas(
  nodo: NodoExpresion,
  variables: string[],
  variablesInactivas: string[] = []
): FilaTabla[] {
  const subExpresiones = recolectarSubExpresiones(nodo);
  const n = variables.length;
  const total = n === 0 ? 1 : Math.pow(2, n);
  const filas: FilaTabla[] = [];

  for (let i = 0; i < total; i++) {
    const asignacion: Record<string, boolean> = {};
    variables.forEach((v, idx) => {
      asignacion[v] = ((i >> (n - idx - 1)) & 1) === 0;
    });
    variablesInactivas.forEach((v) => {
      asignacion[v] = true;
    });

    filas.push({
      asignacion,
      pasos: subExpresiones.map((sub) => ({
        etiqueta: nodoATexto(sub),
        valor: evaluar(sub, asignacion),
      })),
      resultado: evaluar(nodo, asignacion),
    });
  }
  return filas;
}

export function generarTabla(formula: string): ResultadoTabla {
  const nodo = parsearProposicion(formula);
  const variables = recolectarVariables(nodo);
  const filas = generarFilas(nodo, variables);
  const verdaderas = filas.filter((f) => f.resultado).length;
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
    subExpresiones: recolectarSubExpresiones(nodo),
    clasificacion,
    verdaderas,
    falsas,
  };
}
