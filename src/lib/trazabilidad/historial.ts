import type {
  PasoTrazabilidad,
  ResultadoTrazabilidad,
} from "./types";
import type {
  NodoExpresion,
  PasoDemostracion,
  ResultadoDemostracion,
} from "../solver/types";
import { generarPasoEnriquecido } from "../transcription/descriptionGenerator";
import { renderizarNodo } from "../transcription/astRenderer";

/**
 * Crea un array vacío de pasos de trazabilidad.
 */
export function crearHistorial(): PasoTrazabilidad[] {
  return [];
}

/**
 * Registra un paso individual en el historial con detalle particionado.
 *
 * @param historial  - Array acumulador de pasos (se muta con .push()).
 * @param paso       - Paso raw del solver (PasoDemostracion).
 * @param premisas   - Premisas originales (para resolver números de línea).
 * @param pasosPrevios - Pasos raw ya registrados antes de este.
 * @returns El paso de trazabilidad registrado.
 */
export function registrarPaso(
  historial: PasoTrazabilidad[],
  paso: PasoDemostracion,
  premisas: NodoExpresion[],
  pasosPrevios: PasoDemostracion[]
): PasoTrazabilidad {
  const enriquecido = generarPasoEnriquecido(paso, premisas, pasosPrevios);
  const numeroPaso = historial.length + 1;

  const expresionesEnEstado = [
    ...premisas.map((p, i) => `${i + 1}: ${renderizarNodo(p)}`),
    ...pasosPrevios.map((p, i) => `${premisas.length + i + 1}: ${renderizarNodo(p.expresionResultante)}`),
    `${premisas.length + pasosPrevios.length + 1}: ${renderizarNodo(paso.expresionResultante)}`,
  ];

  const pasoTrazabilidad: PasoTrazabilidad = {
    numeroPaso,
    operacion: enriquecido.regla,
    regla: paso.idPaso,
    alias: enriquecido.alias,
    explicacion: enriquecido.descripcion,
    detalle: enriquecido.detalle,
    expresionSimbolica: enriquecido.expresionResultante,
    lineasBase: paso.lineasInvolucradas,
    esConclusion: paso.esConclusion,
    estadoActual: expresionesEnEstado.join("\n"),
  };

  historial.push(pasoTrazabilidad);
  return pasoTrazabilidad;
}

/**
 * Procesa un ResultadoDemostracion completo del solver y produce
 * un ResultadoTrazabilidad listo para consumir por la UI.
 *
 * Esta es la función principal de integración con el solver:
 * recorre los pasos EN ORDEN, registrando cada uno en el historial
 * y acumulando el estado de la demostración.
 *
 * @param premisas  - Premisas originales (NodoExpresion[]).
 * @param resultado - Resultado que devolvió demostrarConclusion().
 * @returns ResultadoTrazabilidad completo con todos los pasos traducidos.
 */
export function construirTrazabilidad(
  premisas: NodoExpresion[],
  resultado: ResultadoDemostracion
): ResultadoTrazabilidad {
  const historial = crearHistorial();
  const pasosPreviosAcum: PasoDemostracion[] = [];

  resultado.pasos.forEach((paso) => {
    registrarPaso(historial, paso, premisas, pasosPreviosAcum);
    pasosPreviosAcum.push(paso);
  });

  const conclusion = resultado.esValido
    ? "Se logro demostrar la conclusion a partir de las premisas dadas."
    : "No se logro demostrar la conclusion a partir de las premisas dadas (con las reglas evaluadas hasta el momento).";

  return {
    esValido: resultado.esValido,
    errorLogico: resultado.errorLogico,
    pasos: historial,
    conclusion,
    totalPasos: historial.length,
  };
}

/**
 * Obtiene un paso específico del historial por su número.
 * Útil para que la UI navegue entre pasos.
 *
 * @param historial   - Array de pasos de trazabilidad.
 * @param numeroPaso  - Número del paso a buscar (1-indexed).
 * @returns El paso encontrado, o undefined si no existe.
 */
export function obtenerPaso(
  historial: PasoTrazabilidad[],
  numeroPaso: number
): PasoTrazabilidad | undefined {
  return historial.find((p) => p.numeroPaso === numeroPaso);
}

/**
 * Filtra los pasos del historial que son conclusiones.
 * Puede haber más de uno si la demostración tiene múltiples ramas.
 */
export function obtenerConclusiones(
  historial: PasoTrazabilidad[]
): PasoTrazabilidad[] {
  return historial.filter((p) => p.esConclusion);
}
