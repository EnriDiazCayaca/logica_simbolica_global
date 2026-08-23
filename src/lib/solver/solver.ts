import type {
  NodoExpresion,
  ResultadoDemostracion,
  PasoDemostracion,
  ReglaLogica,
} from './types';

/**
 * Verifica si dos nodos del AST son estructuralmente idÃ©nticos.
 */
export function sonNodosIguales(a: NodoExpresion, b: NodoExpresion): boolean {
  if (a.tipo !== b.tipo) return false;
  if (a.tipo === 'variable' && b.tipo === 'variable') {
    return a.nombre.toUpperCase() === b.nombre.toUpperCase();
  }
  if (a.tipo === 'operacion' && b.tipo === 'operacion') {
    if (a.operador !== b.operador) return false;

    const izqIgual =
      a.izquierdo && b.izquierdo
        ? sonNodosIguales(a.izquierdo, b.izquierdo)
        : a.izquierdo === b.izquierdo;

    const derIgual =
      a.derecho && b.derecho
        ? sonNodosIguales(a.derecho, b.derecho)
        : a.derecho === b.derecho;

    return Boolean(izqIgual && derIgual);
  }
  return false;
}

/**
 * Niega un nodo del AST.
 * Si ya era una negaciÃ³n (NO X), aplica simplificaciÃ³n de doble negaciÃ³n y devuelve X.
 */
export function negarNodo(nodo: NodoExpresion): NodoExpresion {
  if (nodo.tipo === 'operacion' && nodo.operador === 'NO' && nodo.derecho) {
    return nodo.derecho;
  }
  return {
    tipo: 'operacion',
    operador: 'NO',
    derecho: nodo,
  };
}

/**
 * Determina si dos fÃ³rmulas son opuestas/contradictorias (es decir, una es la negaciÃ³n de la otra).
 * Ej: P y NO P, o NO Q y Q, o NO (P Y Q) y (P Y Q).
 */
export function sonOpuestos(a: NodoExpresion, b: NodoExpresion): boolean {
  if (a.tipo === 'operacion' && a.operador === 'NO' && a.derecho) {
    if (sonNodosIguales(a.derecho, b)) return true;
  }
  if (b.tipo === 'operacion' && b.operador === 'NO' && b.derecho) {
    if (sonNodosIguales(b.derecho, a)) return true;
  }
  return false;
}

/**
 * EvalÃºa si es posible aplicar Modus Ponendo Ponens (A -> B, A |- B).
 */
export function aplicarModusPonendoPonens(
  impl: NodoExpresion,
  premisa: NodoExpresion
): NodoExpresion | null {
  if (
    impl.tipo === 'operacion' &&
    impl.operador === 'ENTONCES' &&
    impl.izquierdo &&
    impl.derecho
  ) {
    if (sonNodosIguales(impl.izquierdo, premisa)) {
      return impl.derecho;
    }
  }
  return null;
}

/**
 * EvalÃºa si es posible aplicar Modus Tollendo Tollens (A -> B, NO B |- NO A).
 */
export function aplicarModusTollendoTollens(
  impl: NodoExpresion,
  premisa: NodoExpresion
): NodoExpresion | null {
  if (
    impl.tipo === 'operacion' &&
    impl.operador === 'ENTONCES' &&
    impl.izquierdo &&
    impl.derecho
  ) {
    if (sonOpuestos(impl.derecho, premisa)) {
      return negarNodo(impl.izquierdo);
    }
  }
  return null;
}

/**
 * EvalÃºa si es posible aplicar Silogismo Disyuntivo (A v B, NO A |- B) o (A v B, NO B |- A).
 */
export function aplicarSilogismoDisyuntivo(
  disy: NodoExpresion,
  premisa: NodoExpresion
): NodoExpresion | null {
  if (
    disy.tipo === 'operacion' &&
    disy.operador === 'O' &&
    disy.izquierdo &&
    disy.derecho
  ) {
    if (sonOpuestos(disy.izquierdo, premisa)) {
      return disy.derecho;
    }
    if (sonOpuestos(disy.derecho, premisa)) {
      return disy.izquierdo;
    }
  }
  return null;
}

/**
 * EvalÃºa si es posible aplicar Silogismo HipotÃ©tico (A -> B, B -> C |- A -> C).
 */
export function aplicarSilogismoHipotetico(
  impl1: NodoExpresion,
  impl2: NodoExpresion
): NodoExpresion | null {
  if (
    impl1.tipo === 'operacion' &&
    impl1.operador === 'ENTONCES' &&
    impl1.izquierdo &&
    impl1.derecho &&
    impl2.tipo === 'operacion' &&
    impl2.operador === 'ENTONCES' &&
    impl2.izquierdo &&
    impl2.derecho
  ) {
    if (sonNodosIguales(impl1.derecho, impl2.izquierdo)) {
      return {
        tipo: 'operacion',
        operador: 'ENTONCES',
        izquierdo: impl1.izquierdo,
        derecho: impl2.derecho,
      };
    }
  }
  return null;
}

/**
 * EvalÃºa si es posible aplicar SimplificaciÃ³n (A Y B |- A) o (A Y B |- B).
 */
export function aplicarSimplificacion(
  conj: NodoExpresion
): [NodoExpresion, NodoExpresion] | null {
  if (
    conj.tipo === 'operacion' &&
    conj.operador === 'Y' &&
    conj.izquierdo &&
    conj.derecho
  ) {
    return [conj.izquierdo, conj.derecho];
  }
  return null;
}

/**
 * EvalÃºa si es posible aplicar Doble NegaciÃ³n (NO NO A |- A).
 */
export function aplicarDobleNegacion(nodo: NodoExpresion): NodoExpresion | null {
  if (
    nodo.tipo === 'operacion' &&
    nodo.operador === 'NO' &&
    nodo.derecho &&
    nodo.derecho.tipo === 'operacion' &&
    nodo.derecho.operador === 'NO' &&
    nodo.derecho.derecho
  ) {
    return nodo.derecho.derecho;
  }
  return null;
}

/**
 * EvalÃºa si es posible aplicar Dilema Constructivo (A -> B, C -> D, A v C |- B v D).
 */
export function aplicarDilemaConstructivo(
  impl1: NodoExpresion,
  impl2: NodoExpresion,
  disy: NodoExpresion
): NodoExpresion | null {
  if (
    impl1.tipo === 'operacion' &&
    impl1.operador === 'ENTONCES' &&
    impl1.izquierdo &&
    impl1.derecho &&
    impl2.tipo === 'operacion' &&
    impl2.operador === 'ENTONCES' &&
    impl2.izquierdo &&
    impl2.derecho &&
    disy.tipo === 'operacion' &&
    disy.operador === 'O' &&
    disy.izquierdo &&
    disy.derecho
  ) {
    const calza1 =
      sonNodosIguales(disy.izquierdo, impl1.izquierdo) &&
      sonNodosIguales(disy.derecho, impl2.izquierdo);
    const calza2 =
      sonNodosIguales(disy.izquierdo, impl2.izquierdo) &&
      sonNodosIguales(disy.derecho, impl1.izquierdo);

    if (calza1 || calza2) {
      return {
        tipo: 'operacion',
        operador: 'O',
        izquierdo: impl1.derecho,
        derecho: impl2.derecho,
      };
    }
  }
  return null;
}

interface RegistroFormula {
  nodo: NodoExpresion;
  linea: number;
}

/**
 * Motor central de resoluciÃ³n e inferencia deductiva (Forward Chaining Search).
 * Aplica recursivamente las reglas lÃ³gicas sobre el conjunto de premisas conocidas
 * hasta alcanzar la conclusiÃ³n deseada o agotar las inferencias posibles.
 */
export function demostrarConclusion(
  premisas: NodoExpresion[],
  conclusion: NodoExpresion
): ResultadoDemostracion {
  const pasos: PasoDemostracion[] = [];

  // 1. Caso trivial: La conclusiÃ³n ya estÃ¡ directamente en las premisas
  for (let i = 0; i < premisas.length; i++) {
    if (sonNodosIguales(premisas[i], conclusion)) {
      return {
        esValido: true,
        pasos: [
          {
            idPaso: 'MODUS_PONENDO_PONENS', // Marcador
            lineasInvolucradas: [i + 1],
            expresionResultante: premisas[i],
            esConclusion: true,
          },
        ],
      };
    }
  }

  // Registro acumulativo de fÃ³rmulas conocidas con su nÃºmero de lÃ­nea
  const formulasConocidas: RegistroFormula[] = premisas.map((p, index) => ({
    nodo: p,
    linea: index + 1,
  }));

  const yaExisteFormula = (nodo: NodoExpresion): boolean => {
    return formulasConocidas.some((f) => sonNodosIguales(f.nodo, nodo));
  };

  const agregarPaso = (
    idPaso: ReglaLogica,
    lineasInvolucradas: number[],
    expresionResultante: NodoExpresion
  ): boolean => {
    if (yaExisteFormula(expresionResultante)) return false;

    const esFinal = sonNodosIguales(expresionResultante, conclusion);
    const nuevaLinea = formulasConocidas.length + 1;

    formulasConocidas.push({
      nodo: expresionResultante,
      linea: nuevaLinea,
    });

    pasos.push({
      idPaso,
      lineasInvolucradas,
      expresionResultante,
      esConclusion: esFinal,
    });

    return esFinal;
  };

  const MAX_ITERACIONES = 12;

  for (let iter = 0; iter < MAX_ITERACIONES; iter++) {
    const longitudInicial = formulasConocidas.length;

    // --- REGLAS UNARIAS ---
    for (let i = 0; i < formulasConocidas.length; i++) {
      const f = formulasConocidas[i];

      // SimplificaciÃ³n (A Y B |- A, B)
      const simplificados = aplicarSimplificacion(f.nodo);
      if (simplificados) {
        if (agregarPaso('SIMPLIFICACION', [f.linea], simplificados[0])) {
          return { esValido: true, pasos };
        }
        if (agregarPaso('SIMPLIFICACION', [f.linea], simplificados[1])) {
          return { esValido: true, pasos };
        }
      }

      // Doble NegaciÃ³n (NO NO A |- A)
      const sinDobleNeg = aplicarDobleNegacion(f.nodo);
      if (sinDobleNeg) {
        if (agregarPaso('DOBLE_NEGACION', [f.linea], sinDobleNeg)) {
          return { esValido: true, pasos };
        }
      }
    }

    // --- REGLAS BINARIAS (Pares de fÃ³rmulas) ---
    for (let i = 0; i < formulasConocidas.length; i++) {
      for (let j = 0; j < formulasConocidas.length; j++) {
        if (i === j) continue;
        const f1 = formulasConocidas[i];
        const f2 = formulasConocidas[j];

        // 1. Modus Ponendo Ponens (A -> B, A |- B)
        const resMPP = aplicarModusPonendoPonens(f1.nodo, f2.nodo);
        if (resMPP) {
          if (agregarPaso('MODUS_PONENDO_PONENS', [f1.linea, f2.linea], resMPP)) {
            return { esValido: true, pasos };
          }
        }

        // 2. Modus Tollendo Tollens (A -> B, NO B |- NO A)
        const resMTT = aplicarModusTollendoTollens(f1.nodo, f2.nodo);
        if (resMTT) {
          if (agregarPaso('MODUS_TOLLENDO_TOLLENS', [f1.linea, f2.linea], resMTT)) {
            return { esValido: true, pasos };
          }
        }

        // 3. Silogismo Disyuntivo (A v B, NO A |- B)
        const resSD = aplicarSilogismoDisyuntivo(f1.nodo, f2.nodo);
        if (resSD) {
          if (agregarPaso('SILOGISMO_DISYUNTIVO', [f1.linea, f2.linea], resSD)) {
            return { esValido: true, pasos };
          }
        }

        // 4. Silogismo HipotÃ©tico (A -> B, B -> C |- A -> C)
        const resSH = aplicarSilogismoHipotetico(f1.nodo, f2.nodo);
        if (resSH) {
          if (agregarPaso('SILOGISMO_HIPOTETICO', [f1.linea, f2.linea], resSH)) {
            return { esValido: true, pasos };
          }
        }

        // 5. ConjunciÃ³n objetivo: Si la conclusiÃ³n es (A Y B) y tenemos A y B
        if (
          conclusion.tipo === 'operacion' &&
          conclusion.operador === 'Y' &&
          conclusion.izquierdo &&
          conclusion.derecho
        ) {
          if (
            sonNodosIguales(f1.nodo, conclusion.izquierdo) &&
            sonNodosIguales(f2.nodo, conclusion.derecho)
          ) {
            const resConj: NodoExpresion = {
              tipo: 'operacion',
              operador: 'Y',
              izquierdo: f1.nodo,
              derecho: f2.nodo,
            };
            if (agregarPaso('CONJUNCION', [f1.linea, f2.linea], resConj)) {
              return { esValido: true, pasos };
            }
          }
        }
      }
    }

    // --- REGLAS TERNARIAS (TrÃ­os de fÃ³rmulas) ---
    for (let i = 0; i < formulasConocidas.length; i++) {
      for (let j = 0; j < formulasConocidas.length; j++) {
        for (let k = 0; k < formulasConocidas.length; k++) {
          if (i === j || j === k || i === k) continue;
          const f1 = formulasConocidas[i];
          const f2 = formulasConocidas[j];
          const f3 = formulasConocidas[k];

          // Dilema Constructivo (A -> B, C -> D, A v C |- B v D)
          const resDC = aplicarDilemaConstructivo(f1.nodo, f2.nodo, f3.nodo);
          if (resDC) {
            if (
              agregarPaso(
                'DILEMA_CONSTRUCTIVO',
                [f1.linea, f2.linea, f3.linea],
                resDC
              )
            ) {
              return { esValido: true, pasos };
            }
          }
        }
      }
    }

    // Si en toda la pasada no se infiriÃ³ ninguna nueva fÃ³rmula, no es demostrable con estas reglas
    if (formulasConocidas.length === longitudInicial) {
      break;
    }
  }

  return { esValido: false, pasos };
}

