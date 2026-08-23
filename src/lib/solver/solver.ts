import type {
  NodoExpresion,
  ResultadoDemostracion,
  PasoDemostracion,
  ReglaLogica,
  ErrorLogico,
} from './types';

/**
 * Extrae todas las variables proposicionales únicas de un nodo AST.
 */
export function extraerVariablesDeNodo(nodo: NodoExpresion): string[] {
  if (nodo.tipo === 'variable') {
    return [nodo.nombre.toUpperCase()];
  }
  const vars: string[] = [];
  if (nodo.izquierdo) vars.push(...extraerVariablesDeNodo(nodo.izquierdo));
  if (nodo.derecho) vars.push(...extraerVariablesDeNodo(nodo.derecho));
  return Array.from(new Set(vars));
}

/**
 * Verifica si dos nodos del AST son estructuralmente idénticos.
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
 * Si ya era una negación (NO X), aplica simplificación de doble negación y devuelve X.
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
 * Determina si dos fórmulas son opuestas/contradictorias (es decir, una es la negación de la otra).
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
 * Evalúa si es posible aplicar Modus Ponendo Ponens (A -> B, A |- B).
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
 * Evalúa si es posible aplicar Modus Tollendo Tollens (A -> B, NO B |- NO A).
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
 * Evalúa si es posible aplicar Modus Ponens Bicondicional:
 * (A <-> B, A |- B) o (A <-> B, B |- A)
 * (A <-> B, NO A |- NO B) o (A <-> B, NO B |- NO A)
 */
export function aplicarModusPonensBicondicional(
  bic: NodoExpresion,
  premisa: NodoExpresion
): NodoExpresion | null {
  if (
    bic.tipo === 'operacion' &&
    bic.operador === 'SI_Y_SOLO_SI' &&
    bic.izquierdo &&
    bic.derecho
  ) {
    if (sonNodosIguales(bic.izquierdo, premisa)) {
      return bic.derecho;
    }
    if (sonNodosIguales(bic.derecho, premisa)) {
      return bic.izquierdo;
    }
    if (sonOpuestos(bic.izquierdo, premisa)) {
      return negarNodo(bic.derecho);
    }
    if (sonOpuestos(bic.derecho, premisa)) {
      return negarNodo(bic.izquierdo);
    }
  }
  return null;
}

/**
 * Descompone un bicondicional en sus dos implicaciones (A <-> B |- A -> B, B -> A).
 */
export function aplicarEliminacionBicondicional(
  bic: NodoExpresion
): [NodoExpresion, NodoExpresion] | null {
  if (
    bic.tipo === 'operacion' &&
    bic.operador === 'SI_Y_SOLO_SI' &&
    bic.izquierdo &&
    bic.derecho
  ) {
    return [
      {
        tipo: 'operacion',
        operador: 'ENTONCES',
        izquierdo: bic.izquierdo,
        derecho: bic.derecho,
      },
      {
        tipo: 'operacion',
        operador: 'ENTONCES',
        izquierdo: bic.derecho,
        derecho: bic.izquierdo,
      },
    ];
  }
  return null;
}

/**
 * Evalúa si es posible aplicar Silogismo Disyuntivo (A v B, NO A |- B) o (A v B, NO B |- A).
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
 * Evalúa si es posible aplicar Silogismo Hipotético (A -> B, B -> C |- A -> C).
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
 * Evalúa si es posible aplicar Simplificación (A Y B |- A) o (A Y B |- B).
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
 * Evalúa si es posible aplicar Doble Negación (NO NO A |- A).
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
 * Evalúa si es posible aplicar Dilema Constructivo (A -> B, C -> D, A v C |- B v D).
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
 * Realiza un pattern matching profundo para diagnosticar de forma muy específica
 * el motivo de fallo lógico en inferencias inválidas.
 */
export function detectarErrorLogico(
  premisas: NodoExpresion[],
  conclusion: NodoExpresion,
  totalPasosInferidos: number
): ErrorLogico {
  // 1. Validar si la conclusión contiene variables completamente ausentes en las premisas
  const varsConclusion = extraerVariablesDeNodo(conclusion);
  const varsPremisas = Array.from(
    new Set(premisas.flatMap((p) => extraerVariablesDeNodo(p)))
  );
  const varsFaltantes = varsConclusion.filter((v) => !varsPremisas.includes(v));

  if (varsFaltantes.length > 0) {
    return {
      tipo: 'VARIABLE_NO_EXISTE_EN_PREMISAS',
      mensaje: `La variable '${varsFaltantes.join(', ')}' de la conclusión no aparece en ninguna de las premisas dadas. Es lógicamente imposible deducir conclusiones sobre variables ausentes en el argumento.`,
    };
  }

  // 2. Falacia de Afirmación del Consecuente: A -> B y B  |- A
  for (let i = 0; i < premisas.length; i++) {
    const p1 = premisas[i];
    if (
      p1.tipo === 'operacion' &&
      p1.operador === 'ENTONCES' &&
      p1.izquierdo &&
      p1.derecho
    ) {
      for (let j = 0; j < premisas.length; j++) {
        if (i === j) continue;
        const p2 = premisas[j];
        if (
          sonNodosIguales(p1.derecho, p2) &&
          sonNodosIguales(p1.izquierdo, conclusion)
        ) {
          return {
            tipo: 'FALACIA_AFIRMACION_CONSECUENTE',
            lineasInvolucradas: [i + 1, j + 1],
            mensaje: `Falacia formal de Afirmación del Consecuente (entre Líneas ${i + 1} y ${j + 1}): Conocer el condicional y afirmar su consecuente no garantiza el antecedente. El consecuente podría ser verdadero por otras causas independientes.`,
          };
        }
      }
    }
  }

  // 3. Falacia de Negación del Antecedente: A -> B y ¬A  |- ¬B
  for (let i = 0; i < premisas.length; i++) {
    const p1 = premisas[i];
    if (
      p1.tipo === 'operacion' &&
      p1.operador === 'ENTONCES' &&
      p1.izquierdo &&
      p1.derecho
    ) {
      for (let j = 0; j < premisas.length; j++) {
        if (i === j) continue;
        const p2 = premisas[j];
        if (
          sonOpuestos(p1.izquierdo, p2) &&
          sonOpuestos(p1.derecho, conclusion)
        ) {
          return {
            tipo: 'FALACIA_NEGACION_ANTECEDENTE',
            lineasInvolucradas: [i + 1, j + 1],
            mensaje: `Falacia formal de Negación del Antecedente (entre Líneas ${i + 1} y ${j + 1}): Conocer el condicional y negar su antecedente no permite deducir la negación del consecuente. Aunque el antecedente no ocurra, el consecuente aún podría cumplirse por otras razones.`,
          };
        }
      }
    }
  }

  // 4. Sin reglas aplicables (premisas desconectadas)
  if (totalPasosInferidos === 0) {
    return {
      tipo: 'SIN_REGLAS_APLICABLES',
      mensaje:
        'No se encontraron reglas de inferencia aplicables con las premisas dadas. Las premisas no comparten conectivos ni variables intermedias compatibles para construir una deducción.',
    };
  }

  // 5. Conclusión no alcanzada (cadena deductiva incompleta)
  return {
    tipo: 'CONCLUSION_NO_ALCANZADA',
    mensaje:
      'Se lograron derivar inferencias intermedias, pero no existen suficientes premisas puente para conectar los pasos demostrados con la conclusión deseada.',
  };
}

/**
 * Motor central de resolución e inferencia deductiva (Forward Chaining Search).
 * Aplica recursivamente las reglas lógicas sobre el conjunto de premisas conocidas
 * hasta alcanzar la conclusión deseada o agotar las inferencias posibles.
 */
export function demostrarConclusion(
  premisas: NodoExpresion[],
  conclusion: NodoExpresion
): ResultadoDemostracion {
  const pasos: PasoDemostracion[] = [];

  // 1. Caso trivial: La conclusión ya está directamente en las premisas
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

  // Registro acumulativo de fórmulas conocidas con su número de línea
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

      // Simplificación (A Y B |- A, B)
      const simplificados = aplicarSimplificacion(f.nodo);
      if (simplificados) {
        if (agregarPaso('SIMPLIFICACION', [f.linea], simplificados[0])) {
          return { esValido: true, pasos };
        }
        if (agregarPaso('SIMPLIFICACION', [f.linea], simplificados[1])) {
          return { esValido: true, pasos };
        }
      }

      // Doble Negación (NO NO A |- A)
      const sinDobleNeg = aplicarDobleNegacion(f.nodo);
      if (sinDobleNeg) {
        if (agregarPaso('DOBLE_NEGACION', [f.linea], sinDobleNeg)) {
          return { esValido: true, pasos };
        }
      }

      // Eliminación del Bicondicional (A <-> B |- A -> B, B -> A)
      const elimBic = aplicarEliminacionBicondicional(f.nodo);
      if (elimBic) {
        if (agregarPaso('ELIMINACION_BICONDICIONAL', [f.linea], elimBic[0])) {
          return { esValido: true, pasos };
        }
        if (agregarPaso('ELIMINACION_BICONDICIONAL', [f.linea], elimBic[1])) {
          return { esValido: true, pasos };
        }
      }
    }

    // --- REGLAS BINARIAS (Pares de fórmulas) ---
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

        // 2. Modus Ponens Bicondicional (A <-> B, A |- B o A <-> B, B |- A)
        const resMPB = aplicarModusPonensBicondicional(f1.nodo, f2.nodo);
        if (resMPB) {
          if (agregarPaso('MODUS_PONENS_BICONDICIONAL', [f1.linea, f2.linea], resMPB)) {
            return { esValido: true, pasos };
          }
        }

        // 3. Modus Tollendo Tollens (A -> B, NO B |- NO A)
        const resMTT = aplicarModusTollendoTollens(f1.nodo, f2.nodo);
        if (resMTT) {
          if (agregarPaso('MODUS_TOLLENDO_TOLLENS', [f1.linea, f2.linea], resMTT)) {
            return { esValido: true, pasos };
          }
        }

        // 4. Silogismo Disyuntivo (A v B, NO A |- B)
        const resSD = aplicarSilogismoDisyuntivo(f1.nodo, f2.nodo);
        if (resSD) {
          if (agregarPaso('SILOGISMO_DISYUNTIVO', [f1.linea, f2.linea], resSD)) {
            return { esValido: true, pasos };
          }
        }

        // 5. Silogismo Hipotético (A -> B, B -> C |- A -> C)
        const resSH = aplicarSilogismoHipotetico(f1.nodo, f2.nodo);
        if (resSH) {
          if (agregarPaso('SILOGISMO_HIPOTETICO', [f1.linea, f2.linea], resSH)) {
            return { esValido: true, pasos };
          }
        }

        // 6. Conjunción objetivo: Si la conclusión es (A Y B) y tenemos A y B
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

    // --- REGLAS TERNARIAS (Tríos de fórmulas) ---
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

    // Si en toda la pasada no se infirió ninguna nueva fórmula, no es demostrable con estas reglas
    if (formulasConocidas.length === longitudInicial) {
      break;
    }
  }

  return {
    esValido: false,
    pasos,
    errorLogico: detectarErrorLogico(premisas, conclusion, pasos.length),
  };
}
