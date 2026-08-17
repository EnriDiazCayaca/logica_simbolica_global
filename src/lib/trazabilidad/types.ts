/**
 * types.ts
 * --------
 * Paso 1 (Morocho/Alex): Diseño de la estructura de un "paso" de trazabilidad.
 *
 * Define la interfaz PasoTrazabilidad que representa un registro legible
 * del progreso de una demostración lógica, diseñada para que la UI (próximo
 * sprint) pueda consumirla directamente.
 *
 * Todo es texto plano (sin HTML) para mantener el desacoplamiento.
 */

import type { ReglaLogica } from "../solver/types";

/**
 * Representa un único paso registrado en el historial de trazabilidad.
 *
 * @property numeroPaso       - Índice secuencial del paso (1, 2, 3, ...).
 * @property operacion        - Nombre legible de la operación/regla aplicada.
 * @property regla            - Identificador técnico de la regla lógica aplicada.
 * @property alias            - Alias popular de la regla (ej: "MPP"), si existe.
 * @property explicacion      - Descripción narrada en español del paso realizado.
 * @property expresionSimbolica - Expresión resultante en notación simbólica legible.
 * @property lineasBase       - Líneas (premisas o pasos previos) que se usaron como base.
 * @property esConclusion     - true si este paso alcanzó la conclusión buscada.
 * @property estadoActual     - Snapshot del estado de la demostración después de este paso.
 */
export interface PasoTrazabilidad {
  numeroPaso: number;
  operacion: string;
  regla: ReglaLogica;
  alias?: string;
  explicacion: string;
  expresionSimbolica: string;
  lineasBase: number[];
  esConclusion: boolean;
  estadoActual: string;
}

/**
 * Resultado completo de una demostración con trazabilidad.
 *
 * @property esValido    - Si la conclusión fue demostrada exitosamente.
 * @property pasos       - Lista ordenada de pasos de trazabilidad.
 * @property conclusion  - Mensaje final en lenguaje natural.
 * @property totalPasos  - Cantidad total de pasos registrados.
 */
export interface ResultadoTrazabilidad {
  esValido: boolean;
  pasos: PasoTrazabilidad[];
  conclusion: string;
  totalPasos: number;
}
