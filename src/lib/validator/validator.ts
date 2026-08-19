import type {
  ResultadoValidacion,
  ResultadoValidacionConjunto,
  OpcionesSanitizacion,
} from './types';

// Lista de operadores reconocidos por el sistema
const OPERADORES_ESTANDAR = new Set([
  'Y',
  'O',
  'O_EXCLUSIVA',
  'NO',
  'ENTONCES',
  'SI_Y_SOLO_SI',
  'NI',
  'INCOMPATIBLE',
]);

const OPERADORES_BINARIOS = new Set([
  'Y',
  'O',
  'O_EXCLUSIVA',
  'ENTONCES',
  'SI_Y_SOLO_SI',
  'NI',
  'INCOMPATIBLE',
]);

/**
 * Sanitiza una cadena de texto que contiene una fórmula lógica proposicional.
 * Limpia espacios, normaliza símbolos de operadores lógicos a su forma estándar en español,
 * capitaliza variables y valida coherencia léxica y de paréntesis.
 *
 * @param texto Cadena ingresada por el usuario
 * @returns Cadena sanitizada y lista para ser parseada
 * @throws Error si la entrada es inválida, vacía, contiene caracteres extraños o errores sintácticos
 */
export function sanitizarEntrada(texto: string): string {
  if (texto === undefined || texto === null || typeof texto !== 'string') {
    throw new Error('La entrada no puede estar vacía');
  }

  const sinEspacios = texto.trim();
  if (sinEspacios.length === 0) {
    throw new Error('La entrada no puede estar vacía');
  }

  // 1. Normalización de símbolos y operadores lógicos a palabras clave estándar
  let procesado = texto;

  // Normalizar saltos de línea y tabuladores a espacios
  procesado = procesado.replace(/[\r\n\t]+/g, ' ');

  // Bicondicionales (Multi-carácter y Unicode)
  procesado = procesado.replace(/<->|<=>|<-->|↔|⇔/g, ' SI_Y_SOLO_SI ');
  procesado = procesado.replace(/\bsi\s+y\s+solo\s+si\b/gi, ' SI_Y_SOLO_SI ');
  procesado = procesado.replace(/\biff\b/gi, ' SI_Y_SOLO_SI ');

  // Condicional / Implicación (Multi-carácter y Unicode)
  procesado = procesado.replace(/->|=>|-->|→|⇒/g, ' ENTONCES ');
  procesado = procesado.replace(/\bentonces\b/gi, ' ENTONCES ');
  procesado = procesado.replace(/\bimplies\b/gi, ' ENTONCES ');

  // Disyunción Exclusiva (XOR)
  procesado = procesado.replace(/⊕|⊻/g, ' O_EXCLUSIVA ');
  procesado = procesado.replace(/\bo\s+exclusiva\b/gi, ' O_EXCLUSIVA ');
  procesado = procesado.replace(/\bxor\b/gi, ' O_EXCLUSIVA ');

  // NOR / Barra de Nicod
  procesado = procesado.replace(/↓|⊽/g, ' NI ');
  procesado = procesado.replace(/\bnor\b/gi, ' NI ');
  procesado = procesado.replace(/\bni\b/gi, ' NI ');

  // NAND / Barra de Sheffer
  procesado = procesado.replace(/↑|⊼/g, ' INCOMPATIBLE ');
  procesado = procesado.replace(/\bnand\b/gi, ' INCOMPATIBLE ');
  procesado = procesado.replace(/\bincompatible\b/gi, ' INCOMPATIBLE ');

  // Conjunción (AND)
  procesado = procesado.replace(/&&|&|∧|\^|·|\*/g, ' Y ');
  procesado = procesado.replace(/\band\b/gi, ' Y ');
  procesado = procesado.replace(/\by\b/gi, ' Y ');

  // Negación (NOT)
  procesado = procesado.replace(/¬|~|!/g, ' NO ');
  procesado = procesado.replace(/\bnot\b/gi, ' NO ');
  procesado = procesado.replace(/\bno\b/gi, ' NO ');

  // Disyunción (OR): '||', '|', '∨', '+', 'v' aislada, palabra 'o', o 'or'
  procesado = procesado.replace(/\|\||\||∨|\+/g, ' O ');
  procesado = procesado.replace(/\bor\b/gi, ' O ');
  procesado = procesado.replace(/\bo\b/gi, ' O ');
  procesado = procesado.replace(/\bv\b/gi, ' O ');

  // 2. Detectar caracteres peligrosos o prohibidos remanentes (Inyecciones, tags HTML, caracteres especiales)
  const caracteresProhibidos = /[<>{}$`@#?\\;%]/g;
  const coincidenciasProhibidas = procesado.match(caracteresProhibidos);
  if (coincidenciasProhibidas) {
    const unicos = Array.from(new Set(coincidenciasProhibidas)).join(', ');
    throw new Error(`Caracteres inválidos detectados: [${unicos}]`);
  }

  // 3. Espaciado alrededor de paréntesis
  procesado = procesado.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ');

  // 4. Limpieza de espacios redundantes y split en tokens
  const fragmentos = procesado.trim().split(/\s+/).filter(Boolean);

  if (fragmentos.length === 0) {
    throw new Error('La entrada no puede contener solo espacios');
  }

  // 5. Validar y normalizar cada token individualmente
  const tokensNormalizados: string[] = [];

  for (const frag of fragmentos) {
    const mayus = frag.toUpperCase();

    if (mayus === '(' || mayus === ')') {
      tokensNormalizados.push(mayus);
    } else if (OPERADORES_ESTANDAR.has(mayus)) {
      tokensNormalizados.push(mayus);
    } else {
      // Verificar si es un identificador de variable válido (Ej: P, Q, P1, Q_2, etc.)
      const esVariableValida = /^[A-Za-z][A-Za-z0-9_]*$/.test(frag);
      if (!esVariableValida) {
        throw new Error(`Token o carácter no reconocido: '${frag}'`);
      }
      tokensNormalizados.push(mayus);
    }
  }

  // 6. Validar balanceo y coherencia de paréntesis
  validarParentesis(tokensNormalizados);

  // 7. Validar secuencias de operadores consecutivas y expresiones incompletas
  validarSecuenciaTokens(tokensNormalizados);

  return tokensNormalizados.join(' ');
}

/**
 * Valida el balanceo de paréntesis y que no haya paréntesis vacíos "()".
 */
function validarParentesis(tokens: string[]): void {
  let nivel = 0;
  let ultimoToken = '';

  for (const token of tokens) {
    if (token === '(') {
      nivel++;
    } else if (token === ')') {
      if (ultimoToken === '(') {
        throw new Error("Expresión vacía dentro de paréntesis '()'");
      }
      nivel--;
      if (nivel < 0) {
        throw new Error("Paréntesis desbalanceados: ')' inesperado");
      }
    }
    ultimoToken = token;
  }

  if (nivel > 0) {
    throw new Error("Paréntesis desbalanceados: falta cerrar ')'");
  }
}

/**
 * Valida que no haya dos operadores binarios consecutivos ni operadores huérfanos al inicio/final.
 */
function validarSecuenciaTokens(tokens: string[]): void {
  const n = tokens.length;
  if (n === 0) return;

  // Primer token no puede ser un operador binario
  if (OPERADORES_BINARIOS.has(tokens[0])) {
    throw new Error(`Expresión incompleta: no puede iniciar con operador binario '${tokens[0]}'`);
  }

  // Último token no puede ser un operador (ni binario ni NO)
  const ultimo = tokens[n - 1];
  if (OPERADORES_ESTANDAR.has(ultimo)) {
    throw new Error(`Expresión incompleta: no puede finalizar con operador '${ultimo}'`);
  }

  for (let i = 0; i < n - 1; i++) {
    const actual = tokens[i];
    const siguiente = tokens[i + 1];

    // Dos operadores binarios seguidos: ej. "P Y Y Q", "P ENTONCES O Q"
    if (OPERADORES_BINARIOS.has(actual) && OPERADORES_BINARIOS.has(siguiente)) {
      throw new Error(
        `Operadores lógicos consecutivos sin proposición intermedia: '${actual} ${siguiente}'`
      );
    }

    // Operador binario o 'NO' seguido inmediatamente de cierre de paréntesis: ej. "(P Y )" o "(P Y NO)"
    if (OPERADORES_BINARIOS.has(actual) && siguiente === ')') {
      throw new Error(`Operador '${actual}' sin operando derecho antes de ')'`);
    }
    if (actual === 'NO' && siguiente === ')') {
      throw new Error(`Operador 'NO' sin operando derecho antes de ')'`);
    }

    // Apertura de paréntesis seguida de operador binario: ej. "( Y P)"
    if (actual === '(' && OPERADORES_BINARIOS.has(siguiente)) {
      throw new Error(`Operador binario '${siguiente}' inesperado después de '('`);
    }

    // Operador 'NO' seguido de operador binario: ej. "NO Y P"
    if (actual === 'NO' && OPERADORES_BINARIOS.has(siguiente)) {
      throw new Error(`Operador 'NO' no puede ser seguido por '${siguiente}'`);
    }

    // Variable seguida directamente de otra variable sin operador: ej. "P Q"
    const esVarActual = !OPERADORES_ESTANDAR.has(actual) && actual !== '(' && actual !== ')';
    const esVarSiguiente = !OPERADORES_ESTANDAR.has(siguiente) && siguiente !== '(' && siguiente !== ')';
    if (esVarActual && esVarSiguiente) {
      throw new Error(`Falta operador entre las variables '${actual}' y '${siguiente}'`);
    }
  }
}

/**
 * Valida una expresión y retorna un objeto de resultado seguro sin lanzar excepciones.
 * Ideal para formularios reactivos en Vue.
 *
 * @param texto Cadena a validar
 * @returns ResultadoValidacion con el estado y texto sanitizado o mensaje de error
 */
export function validarExpresion(texto: string): ResultadoValidacion {
  try {
    const sanitizado = sanitizarEntrada(texto);
    return {
      esValida: true,
      textoSanitizado: sanitizado,
    };
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : String(error);
    return {
      esValida: false,
      textoSanitizado: '',
      error: mensaje,
    };
  }
}

/**
 * Valida y sanitiza un conjunto completo de premisas y una conclusión.
 * Elimina duplicados en las premisas si está configurado.
 *
 * @param premisas Array de cadenas con las premisas
 * @param conclusion Cadena con la conclusión a demostrar
 * @param opciones Opciones opcionales de sanitización
 * @returns ResultadoValidacionConjunto con premisas limpias y errores acumulados si existen
 */
export function validarPremisasYConclusion(
  premisas: string[],
  conclusion: string,
  opciones: OpcionesSanitizacion = { eliminarDuplicados: true }
): ResultadoValidacionConjunto {
  const errores: string[] = [];
  const premisasSanitizadas: string[] = [];

  if (!premisas || premisas.length === 0) {
    errores.push('Se requiere al menos una premisa para realizar la demostración');
  } else {
    premisas.forEach((premisa, index) => {
      const res = validarExpresion(premisa);
      if (!res.esValida) {
        errores.push(`Premisa ${index + 1}: ${res.error}`);
      } else {
        premisasSanitizadas.push(res.textoSanitizado);
      }
    });
  }

  // Validar conclusión
  const resConclusion = validarExpresion(conclusion);
  let conclusionSanitizada = '';
  if (!resConclusion.esValida) {
    errores.push(`Conclusión: ${resConclusion.error}`);
  } else {
    conclusionSanitizada = resConclusion.textoSanitizado;
  }

  // Eliminar premisas duplicadas si se solicita y no hubo errores
  let premisasFinales = premisasSanitizadas;
  if (opciones.eliminarDuplicados) {
    premisasFinales = Array.from(new Set(premisasSanitizadas));
  }

  return {
    esValido: errores.length === 0,
    premisasSanitizadas: premisasFinales,
    conclusionSanitizada,
    errores,
  };
}
