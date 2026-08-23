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
 * Genera la descripción explicativa y pedagógica en español de un único paso,
 * detallando la justificación de verdad y la regla lógica aplicada.
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
    return {
      linea: numeroLinea,
      nodo: expresion,
      texto: renderizarNodo(expresion),
    };
  });

  const resultadoTexto = renderizarNodo(paso.expresionResultante);
  let descripcion = '';

  switch (paso.idPaso) {
    case 'MODUS_PONENDO_PONENS': {
      const impl =
        expresionesInvolucradas.find(
          (e) => e.nodo.tipo === 'operacion' && e.nodo.operador === 'ENTONCES'
        ) || expresionesInvolucradas[0];
      const ant =
        expresionesInvolucradas.find((e) => e !== impl) ||
        expresionesInvolucradas[1];
      descripcion = `Como el condicional '${impl?.texto}' es verdadero (Línea ${impl?.linea}) y su antecedente '${ant?.texto}' también se cumple (Línea ${ant?.linea}), por Modus Ponendo Ponens (MPP) se concluye necesariamente que el consecuente '${resultadoTexto}' es verdadero.`;
      break;
    }
    case 'MODUS_TOLLENDO_TOLLENS': {
      const impl =
        expresionesInvolucradas.find(
          (e) => e.nodo.tipo === 'operacion' && e.nodo.operador === 'ENTONCES'
        ) || expresionesInvolucradas[0];
      const consNeg =
        expresionesInvolucradas.find((e) => e !== impl) ||
        expresionesInvolucradas[1];
      descripcion = `Como el condicional '${impl?.texto}' es verdadero (Línea ${impl?.linea}) pero su consecuente está negado en '${consNeg?.texto}' (Línea ${consNeg?.linea}), por Modus Tollendo Tollens (MTT) el antecedente debe ser falso, concluyendo '${resultadoTexto}'.`;
      break;
    }
    case 'SILOGISMO_DISYUNTIVO': {
      const disy =
        expresionesInvolucradas.find(
          (e) => e.nodo.tipo === 'operacion' && e.nodo.operador === 'O'
        ) || expresionesInvolucradas[0];
      const neg =
        expresionesInvolucradas.find((e) => e !== disy) ||
        expresionesInvolucradas[1];
      descripcion = `En la disyunción '${disy?.texto}' (Línea ${disy?.linea}), al menos una opción es verdadera. Como se descarta una mediante '${neg?.texto}' (Línea ${neg?.linea}), por Silogismo Disyuntivo la otra opción '${resultadoTexto}' tiene que ser verdadera.`;
      break;
    }
    case 'SILOGISMO_HIPOTETICO': {
      const [i1, i2] = expresionesInvolucradas;
      descripcion = `Dado que '${i1?.texto}' (Línea ${i1?.linea}) y '${i2?.texto}' (Línea ${i2?.linea}) son verdaderos, por transitividad lógica (Silogismo Hipotético) se deduce directamente que '${resultadoTexto}'.`;
      break;
    }
    case 'SIMPLIFICACION': {
      const conj = expresionesInvolucradas[0];
      descripcion = `Como la conjunción '${conj?.texto}' es verdadera (Línea ${conj?.linea}), ambas partes son ciertas por separado; por Simplificación se extrae legítimamente '${resultadoTexto}'.`;
      break;
    }
    case 'DOBLE_NEGACION': {
      const base = expresionesInvolucradas[0];
      descripcion = `Al negar dos veces '${base?.texto}' (Línea ${base?.linea}), por Doble Negación se cancelan ambas negaciones y se recupera la afirmación original '${resultadoTexto}'.`;
      break;
    }
    case 'CONJUNCION': {
      const [p1, p2] = expresionesInvolucradas;
      descripcion = `Teniendo demostradas '${p1?.texto}' (Línea ${p1?.linea}) y '${p2?.texto}' (Línea ${p2?.linea}) de manera independiente, la regla de Conjunción permite unirlas válidamente en '${resultadoTexto}'.`;
      break;
    }
    case 'DILEMA_CONSTRUCTIVO': {
      const [c1, c2, d] = expresionesInvolucradas;
      descripcion = `Teniendo los condicionales '${c1?.texto}' y '${c2?.texto}', y la disyunción '${d?.texto}', por Dilema Constructivo se concluye que al menos uno de los consecuentes debe cumplirse: '${resultadoTexto}'.`;
      break;
    }
    case 'ELIMINACION_BICONDICIONAL':
    case 'MODUS_PONENS_BICONDICIONAL': {
      const bic =
        expresionesInvolucradas.find(
          (e) => e.nodo.tipo === 'operacion' && e.nodo.operador === 'SI_Y_SOLO_SI'
        ) || expresionesInvolucradas[0];
      const otra = expresionesInvolucradas.find((e) => e !== bic);
      if (otra) {
        descripcion = `Como el bicondicional '${bic?.texto}' es verdadero (Línea ${bic?.linea}), ambas proposiciones comparten el mismo valor de verdad. Al saber que '${otra?.texto}' es verdadero (Línea ${otra?.linea}), se deduce '${resultadoTexto}'.`;
      } else {
        descripcion = `Al ser el bicondicional '${bic?.texto}' verdadero (Línea ${bic?.linea}), se descompone válidamente en la implicación '${resultadoTexto}'.`;
      }
      break;
    }
    default: {
      const lineasStr = expresionesInvolucradas
        .map((e) => `Línea ${e.linea} ('${e.texto}')`)
        .join(', ');
      descripcion = `A partir de ${lineasStr}, aplicando ${info.nombre}${
        info.alias ? ` (${info.alias})` : ''
      } (${info.descripcion}), se deduce: '${resultadoTexto}'.`;
      break;
    }
  }

  if (paso.esConclusion) {
    descripcion += ' ✅ Con este paso queda formalmente demostrada la conclusión.';
  }

  return descripcion;
}

/**
 * Versión enriquecida: además del texto, expone el nombre de la regla
 * y la expresión resultante ya renderizada.
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
