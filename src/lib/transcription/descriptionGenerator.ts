import { REGLAS } from "./translations";
import { renderizarNodo } from "./astRenderer";
import type { NodoExpresion, PasoDemostracion } from "../solver/types";
import type { ExplicacionParticionada, LineaBaseDetalle } from "../trazabilidad/types";

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
 * Genera la estructura particionada y pedagógica de explicación de un paso.
 */
export function generarDetalleParticionado(
  paso: PasoDemostracion,
  premisas: NodoExpresion[],
  pasosPrevios: PasoDemostracion[]
): ExplicacionParticionada {
  const info = REGLAS[paso.idPaso];
  const resultadoTexto = renderizarNodo(paso.expresionResultante);

  const expresiones = paso.lineasInvolucradas.map((numeroLinea) => {
    const expr = resolverLinea(numeroLinea, premisas, pasosPrevios);
    return {
      linea: numeroLinea,
      nodo: expr,
      texto: renderizarNodo(expr),
    };
  });

  let premisasBase: LineaBaseDetalle[] = [];
  let reglaJustificacion = info ? info.descripcion : 'Aplicación de regla lógica.';
  let conclusionDeducida = `Se obtiene '${resultadoTexto}'.`;

  switch (paso.idPaso) {
    case 'MODUS_PONENDO_PONENS': {
      const impl = expresiones.find((e) => e.nodo.tipo === 'operacion' && e.nodo.operador === 'ENTONCES') || expresiones[0];
      const ant = expresiones.find((e) => e !== impl) || expresiones[1];
      premisasBase = [
        { linea: impl?.linea, expresion: impl?.texto, rol: 'Condicional base (verdadero)' },
        { linea: ant?.linea, expresion: ant?.texto, rol: 'Antecedente afirmado / cumplido' },
      ];
      reglaJustificacion =
        `Dado que el condicional '${impl?.texto}' es verdadero y su antecedente '${ant?.texto}' se cumple, el consecuente '${resultadoTexto}' es necesariamente verdadero.`;
      conclusionDeducida = `'${resultadoTexto}' se deduce forzosamente al cumplirse la condición previa.`;
      break;
    }
    case 'MODUS_TOLLENDO_TOLLENS': {
      const impl = expresiones.find((e) => e.nodo.tipo === 'operacion' && e.nodo.operador === 'ENTONCES') || expresiones[0];
      const consNeg = expresiones.find((e) => e !== impl) || expresiones[1];
      premisasBase = [
        { linea: impl?.linea, expresion: impl?.texto, rol: 'Condicional base (verdadero)' },
        { linea: consNeg?.linea, expresion: consNeg?.texto, rol: 'Consecuente negado / no cumplido' },
      ];
      reglaJustificacion =
        `Dado que '${impl?.texto}' es verdadero y su consecuente está negado en '${consNeg?.texto}', el antecedente no pudo haber ocurrido, concluyéndose '${resultadoTexto}'.`;
      conclusionDeducida = `'${resultadoTexto}' se concluye como negación necesaria del antecedente.`;
      break;
    }
    case 'SILOGISMO_DISYUNTIVO': {
      const disy = expresiones.find((e) => e.nodo.tipo === 'operacion' && e.nodo.operador === 'O') || expresiones[0];
      const neg = expresiones.find((e) => e !== disy) || expresiones[1];
      premisasBase = [
        { linea: disy?.linea, expresion: disy?.texto, rol: 'Disyunción (al menos una es verdadera)' },
        { linea: neg?.linea, expresion: neg?.texto, rol: 'Opción descartada / negada' },
      ];
      reglaJustificacion =
        `En la disyunción '${disy?.texto}', al descartarse una opción mediante '${neg?.texto}', la otra opción '${resultadoTexto}' es forzosamente la verdadera.`;
      conclusionDeducida = `'${resultadoTexto}' es la única opción válida restante.`;
      break;
    }
    case 'SILOGISMO_DISYUNTIVO_EXCLUSIVO': {
      const xor = expresiones.find((e) => e.nodo.tipo === 'operacion' && e.nodo.operador === 'O_EXCLUSIVA') || expresiones[0];
      const otra = expresiones.find((e) => e !== xor) || expresiones[1];
      premisasBase = [
        { linea: xor?.linea, expresion: xor?.texto, rol: 'Disyunción fuerte / exclusiva' },
        { linea: otra?.linea, expresion: otra?.texto, rol: 'Proposición evaluada' },
      ];
      reglaJustificacion =
        `En la disyunción exclusiva '${xor?.texto}' solo una proposición puede ser verdadera. Al evaluarse con '${otra?.texto}', se concluye por exclusión mutua directa que '${resultadoTexto}'.`;
      conclusionDeducida = `'${resultadoTexto}' se deduce por exclusión mutua directa.`;
      break;
    }
    case 'SILOGISMO_HIPOTETICO': {
      const [i1, i2] = expresiones;
      premisasBase = [
        { linea: i1?.linea, expresion: i1?.texto, rol: 'Primer eslabón condicional' },
        { linea: i2?.linea, expresion: i2?.texto, rol: 'Segundo eslabón condicional' },
      ];
      reglaJustificacion =
        `Por propiedad de transitividad entre '${i1?.texto}' y '${i2?.texto}', se conecta directamente el inicio con el final en '${resultadoTexto}'. (Nota: este paso equivale a encadenar dos veces Modus Ponens o Modus Tollens sobre las premisas intermedias).`;
      conclusionDeducida = `'${resultadoTexto}' conecta directamente el inicio con el final de la cadena transitiva.`;
      break;
    }
    case 'SIMPLIFICACION': {
      const conj = expresiones[0];
      premisasBase = [
        { linea: conj?.linea, expresion: conj?.texto, rol: 'Conjunción verdadera' },
      ];
      reglaJustificacion =
        `Al ser verdadera la conjunción '${conj?.texto}', ambas partes son verdaderas por separado y se extrae válidamente '${resultadoTexto}'.`;
      conclusionDeducida = `Se extrae la proposición '${resultadoTexto}'.`;
      break;
    }
    case 'DOBLE_NEGACION': {
      const base = expresiones[0];
      premisasBase = [
        { linea: base?.linea, expresion: base?.texto, rol: 'Proposición con doble negación' },
      ];
      reglaJustificacion =
        `Negar dos veces '${base?.texto}' equivale a afirmar positivamente su valor original '${resultadoTexto}'.`;
      conclusionDeducida = `Se simplifica a la afirmación directa '${resultadoTexto}'.`;
      break;
    }
    case 'MODUS_PONENS_BICONDICIONAL':
    case 'ELIMINACION_BICONDICIONAL': {
      const bic = expresiones.find((e) => e.nodo.tipo === 'operacion' && e.nodo.operador === 'SI_Y_SOLO_SI') || expresiones[0];
      const otra = expresiones.find((e) => e !== bic);
      if (otra) {
        premisasBase = [
          { linea: bic?.linea, expresion: bic?.texto, rol: 'Bicondicional (ambos lados equivalentes)' },
          { linea: otra?.linea, expresion: otra?.texto, rol: 'Lado conocido / afirmado' },
        ];
        reglaJustificacion =
          `En el bicondicional '${bic?.texto}', ambos lados comparten el mismo valor de verdad. Al conocerse '${otra?.texto}', se determina que '${resultadoTexto}'.`;
        conclusionDeducida = `'${resultadoTexto}' se deduce por equivalencia directa.`;
      } else {
        premisasBase = [
          { linea: bic?.linea, expresion: bic?.texto, rol: 'Bicondicional base' },
        ];
        reglaJustificacion =
          `El bicondicional '${bic?.texto}' equivale conjuntamente a las dos implicaciones directas, obteniéndose '${resultadoTexto}'.`;
        conclusionDeducida = `Se descompone en '${resultadoTexto}'.`;
      }
      break;
    }
    case 'CONJUNCION': {
      const [p1, p2] = expresiones;
      premisasBase = [
        { linea: p1?.linea, expresion: p1?.texto, rol: 'Primera proposición demostrada' },
        { linea: p2?.linea, expresion: p2?.texto, rol: 'Segunda proposición demostrada' },
      ];
      reglaJustificacion =
        `Al estar demostradas '${p1?.texto}' y '${p2?.texto}' por separado, su conjunción '${resultadoTexto}' es igualmente verdadera.`;
      conclusionDeducida = `Se unen válidamente en '${resultadoTexto}'.`;
      break;
    }
    case 'DILEMA_CONSTRUCTIVO': {
      const [i1, i2, disy] = expresiones;
      premisasBase = [
        { linea: i1?.linea, expresion: i1?.texto, rol: 'Primera implicación' },
        { linea: i2?.linea, expresion: i2?.texto, rol: 'Segunda implicación' },
        { linea: disy?.linea, expresion: disy?.texto, rol: 'Disyunción de antecedentes' },
      ];
      reglaJustificacion =
        `Al ocurrir necesariamente una de las condiciones en '${disy?.texto}' y estar garantizados sus efectos por '${i1?.texto}' y '${i2?.texto}', se produce forzosamente la disyunción '${resultadoTexto}'.`;
      conclusionDeducida = `'${resultadoTexto}' se deduce por dilema constructivo.`;
      break;
    }
    default: {
      premisasBase = expresiones.map((e) => ({
        linea: e.linea,
        expresion: e.texto,
        rol: 'Premisa / Paso involucrado',
      }));
      break;
    }
  }

  const resumen = generarDescripcionPaso(paso, premisas, pasosPrevios);

  return {
    resumen,
    premisasBase,
    reglaNombre: info?.nombre ?? paso.idPaso,
    reglaAlias: info?.alias,
    reglaJustificacion,
    conclusionDeducida,
  };
}

/**
 * Genera la descripción en texto corrido.
 */
export function generarDescripcionPaso(
  paso: PasoDemostracion,
  premisas: NodoExpresion[],
  pasosPrevios: PasoDemostracion[]
): string {
  const info = REGLAS[paso.idPaso];
  const resultadoTexto = renderizarNodo(paso.expresionResultante);

  const expresiones = paso.lineasInvolucradas.map((numeroLinea) => {
    const expr = resolverLinea(numeroLinea, premisas, pasosPrevios);
    return `Línea ${numeroLinea} (${renderizarNodo(expr)})`;
  });

  const lineasStr = expresiones.join(' y ');
  let desc = `A partir de ${lineasStr}, aplicando ${info?.nombre ?? paso.idPaso}, se obtiene: ${resultadoTexto}.`;

  if (paso.esConclusion) {
    desc += " Con esto se alcanza la conclusion buscada.";
  }

  return desc;
}

/**
 * Versión enriquecida: expone nombre de regla, detalle particionado y descripción.
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
  detalle: ExplicacionParticionada;
  esConclusion: boolean;
} {
  const info = REGLAS[paso.idPaso];
  const detalle = generarDetalleParticionado(paso, premisas, pasosPrevios);

  return {
    regla: info?.nombre ?? paso.idPaso,
    alias: info?.alias,
    expresionResultante: renderizarNodo(paso.expresionResultante),
    descripcion: detalle.resumen,
    detalle,
    esConclusion: paso.esConclusion,
  };
}
