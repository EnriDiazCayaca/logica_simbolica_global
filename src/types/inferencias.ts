import type { ErrorLogico } from '../lib/solver/types';
import type { ExplicacionParticionada } from '../lib/trazabilidad/types';

export interface InferenciaRequest {
  premisas: string[]
  conclusion: string
}

export interface PasoInferencia {
  paso: number
  premisas: string[]
  conclusion: string
  regla: string
  explicacion?: string
  detalle?: ExplicacionParticionada
}

export type ResultadoInferencia =
  | 'valida'
  | 'invalida'
  | 'no_demostrable_directa'
  | 'error'
  | 'pendiente';

export interface DiagnosticoInvalidez {
  errorLogico: ErrorLogico
  conclusionEsperada: string
  premisasDadas: string[]
}

export * from '../lib/solver/types';
export * from '../lib/trazabilidad/types';
