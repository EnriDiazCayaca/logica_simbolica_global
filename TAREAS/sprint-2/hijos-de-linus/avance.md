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

