/**
 * descriptionGenerator.ts
 * ------------------------
 * Paso 2 de Mio: Generador de Descripciones.
 *
 * Recibe un PasoDemostracion real (con su idPaso, lineasInvolucradas y
 * expresionResultante) más el contexto necesario para resolver a qué
 * expresión concreta apunta cada número de línea, y arma el texto final
 * en español.
 *
 * Convención de numeración de líneas (coherente con solver.test.ts, donde
 * las premisas 1 y 2 son las líneas [1, 2]):
 *   - Líneas 1..N   -> las N premisas originales, en orden.
 *   - Línea N+i     -> el resultado del i-ésimo paso ya demostrado
 *                      (pasos[i-1].expresionResultante).
 */

import { REGLAS } from "./translations";
import { renderizarNodo } from "./astRenderer";
import type { NodoExpresion, PasoDemostracion } from "../solver/types";

/**
 * Resuelve un número de línea a su expresión concreta, buscando primero
 * entre las premisas originales y luego entre los pasos ya procesados.
 */
export function resolverLinea(
  numeroLinea: number,
  premisas: NodoExpresion[],
  pasosPrevios: PasoDemostracion[]
): NodoExpresion {
  if (numeroLinea >= 1 && numeroLinea <= premisas.length) {
    return premisas[numeroLinea - 1];
  }

  const indicePaso = numeroLinea - premisas.length - 1;
  const paso = pasosPrevios[indicePaso];

  if (!paso) {
    throw new Error(
      `No se pudo resolver la línea ${numeroLinea}: no corresponde a ninguna premisa ` +
        `(hay ${premisas.length}) ni a un paso previo (hay ${pasosPrevios.length}).`
    );
  }

  return paso.expresionResultante;
}

/**
 * Genera la descripción en español de un único paso, dado el contexto
 * completo (premisas originales + pasos ya demostrados antes que este).
 */
export function generarDescripcionPaso(
  paso: PasoDemostracion,
  premisas: NodoExpresion[],
  pasosPrevios: PasoDemostracion[]
): string {
  const info = REGLAS[paso.idPaso];

  if (!info) {
    throw new Error(
      `No existe traducción registrada para la regla "${paso.idPaso}". Agregala en translations.ts.`
    );
  }

  const expresionesInvolucradas = paso.lineasInvolucradas.map((numeroLinea) => {
    const expresion = resolverLinea(numeroLinea, premisas, pasosPrevios);
    return `línea ${numeroLinea} (${renderizarNodo(expresion)})`;
  });

  const listaLineas =
    expresionesInvolucradas.length > 1
      ? expresionesInvolucradas.slice(0, -1).join(", ") +
        " y " +
        expresionesInvolucradas[expresionesInvolucradas.length - 1]
      : expresionesInvolucradas[0] ?? "ninguna línea previa";

  const resultadoTexto = renderizarNodo(paso.expresionResultante);
  const aliasTexto = info.alias ? ` (${info.alias})` : "";

  let descripcion =
    `A partir de ${listaLineas}, aplicando ${info.nombre}${aliasTexto} ` +
    `—${info.descripcion}—, se obtiene: ${resultadoTexto}.`;

  if (paso.esConclusion) {
    descripcion += " Con esto se alcanza la conclusión buscada.";
  }

  return descripcion;
}

/**
 * Versión enriquecida: además del texto, expone el nombre de la regla
 * y la expresión resultante ya renderizada, por si la UI quiere mostrarlos
 * por separado (ej. en columnas de una tabla de demostración).
 */
export function generarPasoEnriquecido(
  paso: PasoDemostracion,
  premisas: NodoExpresion[],
  pasosPrevios: PasoDemostracion[]
): {
  regla: string;
  alias?: string;
  expresionResultante: string;
  descripcion: string;
  esConclusion: boolean;
} {
  const info = REGLAS[paso.idPaso];
  return {
    regla: info?.nombre ?? paso.idPaso,
    alias: info?.alias,
    expresionResultante: renderizarNodo(paso.expresionResultante),
    descripcion: generarDescripcionPaso(paso, premisas, pasosPrevios),
    esConclusion: paso.esConclusion,
  };
}
