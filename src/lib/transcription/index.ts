/**
 * index.ts
 * --------
 * Paso 3 de Mio: Integración Trazable.
 *
 * Punto de entrada del módulo de transcripción. Toma las premisas originales
 * y el ResultadoDemostracion que devuelve demostrarConclusion() (de Arom),
 * y produce el array de pasos traducidos a español que consumen Morocho y Alex.
 *
 * Se conserva el número de línea de cada paso (premisas.length + índice + 1)
 * para trazabilidad cruzada con lineasInvolucradas del historial original.
 */

import { generarPasoEnriquecido } from "./descriptionGenerator";
import type { NodoExpresion, PasoDemostracion, ResultadoDemostracion } from "../solver/types";

export interface PasoTraducido {
  linea: number;
  regla: string;
  alias?: string;
  lineasInvolucradas: number[];
  expresionResultante: string;
  descripcion: string;
  esConclusion: boolean;
}

/**
 * Traduce todo el historial de un ResultadoDemostracion a español.
 * Recorre los pasos EN ORDEN, ya que cada paso puede depender de los
 * anteriores (líneas ya numeradas) para resolver su propia descripción.
 */
export function traducirHistorial(
  premisas: NodoExpresion[],
  resultado: ResultadoDemostracion
): PasoTraducido[] {
  const pasosTraducidos: PasoTraducido[] = [];
  const pasosPrevios: PasoDemostracion[] = [];

  resultado.pasos.forEach((paso, indice) => {
    const enriquecido = generarPasoEnriquecido(paso, premisas, pasosPrevios);
    const linea = premisas.length + indice + 1;

    pasosTraducidos.push({
      linea,
      regla: enriquecido.regla,
      alias: enriquecido.alias,
      lineasInvolucradas: paso.lineasInvolucradas,
      expresionResultante: enriquecido.expresionResultante,
      descripcion: enriquecido.descripcion,
      esConclusion: enriquecido.esConclusion,
    });

    // Este paso pasa a estar disponible como línea previa para el siguiente
    pasosPrevios.push(paso);
  });

  return pasosTraducidos;
}

/**
 * Función de conveniencia: arma el historial traducido y una conclusión
 * final en lenguaje natural, a partir de premisas + ResultadoDemostracion.
 */
export function explicarDemostracion(
  premisas: NodoExpresion[],
  resultado: ResultadoDemostracion
): {
  pasos: PasoTraducido[];
  conclusion: string;
} {
  const pasos = traducirHistorial(premisas, resultado);

  const conclusion = resultado.esValido
    ? "Se logró demostrar la conclusión a partir de las premisas dadas."
    : "No se logró demostrar la conclusión a partir de las premisas dadas (con las reglas evaluadas hasta el momento).";

  return { pasos, conclusion };
}

export { generarDescripcionPaso, generarPasoEnriquecido } from "./descriptionGenerator";
