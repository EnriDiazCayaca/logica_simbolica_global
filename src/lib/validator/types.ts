/**
 * Tipos e interfaces para el Módulo de Sanitización y Validación.
 * Autor: Renato (Hijos de Linus) - Sprint 2
 */

export interface ResultadoValidacion {
  esValida: boolean;
  textoSanitizado: string;
  error?: string;
}

export interface ResultadoValidacionConjunto {
  esValido: boolean;
  premisasSanitizadas: string[];
  conclusionSanitizada: string;
  errores: string[];
}

export interface OpcionesSanitizacion {
  eliminarDuplicados?: boolean;
  normalizarMayusculas?: boolean;
}
