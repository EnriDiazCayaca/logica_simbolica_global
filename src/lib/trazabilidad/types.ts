import type { ReglaLogica, ErrorLogico } from "../solver/types";

export interface LineaBaseDetalle {
  linea: number;
  expresion: string;
  rol: string;
}

export interface ExplicacionParticionada {
  resumen: string;
  premisasBase: LineaBaseDetalle[];
  reglaNombre: string;
  reglaAlias?: string;
  reglaJustificacion: string;
  conclusionDeducida: string;
}

export interface PasoTrazabilidad {
  numeroPaso: number;
  operacion: string;
  regla: ReglaLogica;
  alias?: string;
  explicacion: string;
  detalle?: ExplicacionParticionada;
  expresionSimbolica: string;
  lineasBase: number[];
  esConclusion: boolean;
  estadoActual: string;
}

export interface ResultadoTrazabilidad {
  esValido: boolean;
  errorLogico?: ErrorLogico;
  pasos: PasoTrazabilidad[];
  conclusion: string;
  totalPasos: number;
}
