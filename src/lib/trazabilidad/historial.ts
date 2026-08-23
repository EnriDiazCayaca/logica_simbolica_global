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

export function obtenerPaso(
  historial: PasoTrazabilidad[],
  numeroPaso: number
): PasoTrazabilidad | undefined {
  return historial.find((p) => p.numeroPaso === numeroPaso);
}

export function obtenerConclusiones(
  historial: PasoTrazabilidad[]
): PasoTrazabilidad[] {
  return historial.filter((p) => p.esConclusion);
}
