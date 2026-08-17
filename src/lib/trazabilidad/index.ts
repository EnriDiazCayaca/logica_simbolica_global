/**
 * index.ts
 * --------
 * Punto de entrada del módulo de Trazabilidad y Explicación (Morocho/Alex).
 *
 * Integra el contenedor de historial con la interfaz de trazabilidad
 * para ofrecer una API limpia que la UI (próximo sprint) consumirá.
 *
 * Flujo completo:
 *   Solver -> ResultadoDemostracion
 *            -> construirTrazabilidad()
 *            -> ResultadoTrazabilidad (listo para UI)
 */

export type { PasoTrazabilidad, ResultadoTrazabilidad } from "./types";

export {
  crearHistorial,
  registrarPaso,
  construirTrazabilidad,
  obtenerPaso,
  obtenerConclusiones,
} from "./historial";
