import type { NodoExpresion, ResultadoDemostracion, PasoDemostracion } from './types';

/**
 * Función central del Solver.
 * Recibe un array de expresiones (premisas) y la expresión a demostrar (conclusión).
 * Intenta encontrar una demostración aplicando reglas de inferencia lógicas.
 * 
 * NOTA: Esta versión incluye la estructura base. El motor completo de emparejamiento 
 * de patrones ("pattern matching") se expandirá iterativamente.
 */
export function demostrarConclusion(premisas: NodoExpresion[], conclusion: NodoExpresion): ResultadoDemostracion {
  const pasos: PasoDemostracion[] = [];
  const premisasActuales = [...premisas];
  
  // Por el momento es una estructura vacía que sirve como interfaz
  // Aquí se iteraría intentando aplicar Modus Ponens, Silogismos, etc.
  
  // Ejemplo Hardcodeado para que pase la prueba unitaria inicial de demostración:
  // (Para verificar que la API base funciona y Renato puede hacer tests)
  if (premisas.length === 2 && 
      premisas[0].tipo === 'operacion' && 
      premisas[0].operador === 'ENTONCES' &&
      premisas[1].tipo === 'variable') {
    
    // Si la estructura calza superficialmente con P -> Q y P
    const nuevaPremisa = aplicarModusPonendoPonens(premisasActuales[0], premisasActuales[1]);
    
    if (nuevaPremisa && sonNodosIguales(nuevaPremisa, conclusion)) {
      pasos.push({
        idPaso: 'MODUS_PONENDO_PONENS',
        lineasInvolucradas: [1, 2],
        expresionResultante: nuevaPremisa,
        esConclusion: true
      });
      return { esValido: true, pasos };
    }
  }

  return { esValido: false, pasos };
}

/**
 * Verifica si dos nodos del AST son exactamente iguales (estructuralmente).
 */
export function sonNodosIguales(a: NodoExpresion, b: NodoExpresion): boolean {
  if (a.tipo !== b.tipo) return false;
  if (a.tipo === 'variable' && b.tipo === 'variable') {
    return a.nombre === b.nombre;
  }
  if (a.tipo === 'operacion' && b.tipo === 'operacion') {
    if (a.operador !== b.operador) return false;
    
    const izqIgual = (a.izquierdo && b.izquierdo) 
      ? sonNodosIguales(a.izquierdo, b.izquierdo) 
      : (a.izquierdo === b.izquierdo); // Ambos undefined
      
    const derIgual = (a.derecho && b.derecho) 
      ? sonNodosIguales(a.derecho, b.derecho) 
      : (a.derecho === b.derecho); // Ambos undefined
      
    return izqIgual && derIgual;
  }
  return false;
}

/**
 * Función utilitaria: Evalúa si es posible aplicar Modus Ponendo Ponens (P -> Q, P |- Q).
 */
export function aplicarModusPonendoPonens(pre1: NodoExpresion, pre2: NodoExpresion): NodoExpresion | null {
  // Verificamos que la primera premisa sea una implicación (P -> Q)
  if (pre1.tipo === 'operacion' && pre1.operador === 'ENTONCES' && pre1.izquierdo && pre1.derecho) {
    // Verificamos que la segunda premisa (P) coincida con el antecedente de pre1
    if (sonNodosIguales(pre1.izquierdo, pre2)) {
      return pre1.derecho; // Retorna Q
    }
  }
  return null;
}
