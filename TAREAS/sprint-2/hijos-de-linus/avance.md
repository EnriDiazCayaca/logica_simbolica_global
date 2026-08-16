# Avances del Sprint 2 - Equipo: Hijos de Linus

## Integrante: Arom
**Módulo:** Motor Lógico (Solver)

### ✅ Completado (15 de Agosto)
* **Definición de Tipos y AST:**
  * Se establecieron los operadores lógicos en español (Y, O, O_EXCLUSIVA, NO, ENTONCES, SI_Y_SOLO_SI, NI, INCOMPATIBLE).
  * Se definieron los nodos del Árbol de Sintaxis Abstracta (AST) en `src/lib/solver/types.ts`.
  * Se crearon los tipos `Inferencia` y `Equivalencia` para representar las reglas lógicas (Modus Ponens, Modus Tollens, Silogismo, De Morgan, etc.) y se mapearon sus alias populares.
* **Base del Evaluador (`solver.ts`):**
  * Se creó la función principal `demostrarConclusion` que recibe un arreglo de premisas y la conclusión deseada.
  * Se implementó el primer evaluador `aplicarModusPonendoPonens` como prueba de concepto para el "pattern matching".
  * Se creó la función `sonNodosIguales` para verificar la similitud estructural de dos ramas lógicas (esencial para evaluar equivalencias y silogismos).
* **Pruebas y Verificación:**
  * Se creó la suite de pruebas automatizadas en `src/lib/solver/solver.test.ts`.
  * El código base cumple estrictamente el tipado estricto (0 errores en `vue-tsc`) y 100% de cobertura en las pruebas iniciales de Vitest.
* **Analizador Sintáctico (Parser) (Paso 2):**
  * Se implementó el analizador léxico (`tokenizar`) para separar correctamente variables, operadores y paréntesis respetando espacios.
  * Se construyó el algoritmo de parseo (`construirAST`) mediante un analizador de descenso recursivo, respetando firmemente la jerarquía y precedencia de operadores lógicos (donde "NO" tiene mayor peso que "Y", seguido de "O", y por último las condicionales/bicondicionales).
  * Se superaron las pruebas unitarias exhaustivas para expresiones anidadas, precedencia correcta y validación de errores sintácticos (`parser.test.ts`).

### 📝 Pendiente y Notas para el Futuro
* **Expansión de Reglas (Módulo de Arom):** Seguir agregando las funciones unitarias para detectar y aplicar `MODUS_TOLLENDO_TOLLENS`, `SILOGISMO_HIPOTETICO`, `DE_MORGAN`, etc., basándose en la plantilla estructural de `aplicarModusPonendoPonens`.
* **Algoritmo de Búsqueda:** Mejorar el interior de `demostrarConclusion` para que recorra cíclicamente el arreglo de premisas intentando derivar proposiciones nuevas usando encadenamiento hacia adelante (forward-chaining) hasta dar con la conclusión deseada.

## Integrante: Mio
**Módulo:** Transcripción

### ✅ Completado (16 de Agosto)
* **Diccionario de Traducciones:**
  * Se creó `translations.ts`, indexado por `ReglaLogica` (el tipo combinado `Inferencia | Equivalencia` que definió Arom en `types.ts`), usando `Record<ReglaLogica, InfoRegla>` para forzar en tiempo de compilación que **las 16 reglas** (8 de inferencia + 8 de equivalencia) tengan traducción.
  * Cada regla mapea a un objeto `InfoRegla` con `nombre` (nombre para mostrar), `alias` opcional (ej. "MPP") y `descripcion` (qué hace la regla en general, en español llano).
* **Generador de descripciones:**
  * Se crearon las funciones:
     * `resolverLinea(numeroLinea, premisas, pasosPrevios)`: traduce un número de `lineasInvolucradas` a la expresión (`NodoExpresion`) real a la que apunta, siguiendo la convención de numeración de Arom (líneas 1..N = premisas originales; líneas N+1 en adelante = pasos ya demostrados, en orden).
     * `generarDescripcionPaso(paso, premisas, pasosPrevios)`: arma la oración completa en español citando qué líneas se usaron (con su expresión renderizada), qué regla se aplicó (nombre + alias + descripción general) y qué expresión se obtuvo, agregando una frase de cierre si `paso.esConclusion` es verdadero.
   * Se separó el renderizado del AST a texto legible (`(P ENTONCES Q)`, `(NO P)`, etc.) en una función auxiliar recursiva (`renderizarNodo`), reutilizable en cualquier parte que necesite mostrar una expresión, no solo dentro de una explicación.
   * Se agregó `generarPasoEnriquecido`, que devuelve los mismos datos pero "desarmados" en campos separados (regla, alias, expresión resultante, descripción, esConclusion), por si la UI necesita mostrarlos en columnas en vez de un párrafo corrido.
* **Integración Trazable:**
  * Se creó `index.ts` como punto de entrada único del módulo.
  * `traducirHistorial(premisas, resultado)` recorre `resultado.pasos` **en orden** (no en paralelo), manteniendo un acumulador de pasos ya procesados — necesario porque un paso puede depender de una línea generada por un paso anterior, no solo de las premisas originales.
  * Cada paso traducido conserva su número de línea calculado (`premisas.length + índice + 1`) y su `lineasInvolucradas` original, para poder cruzarlo 1 a 1 con el historial crudo de Arom si Morocho o Alex lo necesitan.
  * `explicarDemostracion(premisas, resultado)` envuelve lo anterior y agrega una conclusión final en lenguaje natural según `resultado.esValido`.
  * Se validó la integración corriendo `ejemplo.ts` contra el `demostrarConclusion` real de Arom (mismo caso que su `solver.test.ts`, Modus Ponendo Ponens con P ENTONCES Q y P), confirmando compilación en modo estricto (0 errores) y salida correcta en español.




