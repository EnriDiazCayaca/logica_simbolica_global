export interface InferenciaRequest {
  premisas: string[];
  conclusion: string;
}

export interface PasoInferencia {
  paso: number;
  premisas: string[];
  conclusion: string;
  regla: string; // ej. "Modus Ponens"
}

export type ResultadoInferencia = 'valida' | 'invalida' | 'error' | 'pendiente';
export * from '../lib/solver/types';
