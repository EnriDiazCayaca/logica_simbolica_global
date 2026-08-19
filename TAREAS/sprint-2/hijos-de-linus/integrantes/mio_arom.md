# Tareas de Mio y Arom: Módulo de Resolución (Solver) y Transcripción

**Objetivo:** Construir el motor lógico matemático subyacente y dotarlo de la capacidad de explicar sus deducciones modulares en lenguaje natural (español).

## Nueva División de Responsabilidades
A partir de la reestructuración, las tareas se dividen en dos áreas especializadas:

### 🧑‍💻 Arom: Construcción del Motor Lógico (Solver)
Arom se encarga de la ingeniería pura del motor, las estructuras de datos y la evaluación de expresiones.
- [x] **Paso 1: Definición de Tipos (`types.ts`).** Crear la estructura de datos (Árbol de Sintaxis Abstracta - AST) para representar proposiciones lógicas, operadores (`AND`, `OR`, `NOT`, `IMPLIES`, etc.) y resultados.
- [x] **Paso 2: Parseo y Estructura.** Implementar la función que toma una expresión matemática y la convierte en la estructura de datos definida.
- [x] **Paso 3: Lógica de Inferencia (`solver.ts`).** Programar las reglas matemáticas de evaluación y simplificación. La función debe recibir la expresión estructurada, evaluarla y emitir eventos o retornos de cada paso lógico (sin texto en duro, usando códigos de operación).
- [x] **Paso 4: API del Motor.** Crear una función principal `export function resolverExpresion(entrada: Expression): Resultado` que consumirán otros módulos.



### 📝 Mio: Transcripción Modular a Lenguaje Natural
Mio toma los códigos y estructuras que genera el motor de Arom y los traduce a explicaciones didácticas en español.
- [x] **Paso 1: Diccionario de Traducciones.** Crear un módulo (`translations.ts` o similar) que mapee las operaciones lógicas de Arom a textos explicativos. (Ej: `operacion: 'SIMPLIFICACION_AND'` ➔ `"Se aplicó la regla de simplificación para la conjunción (Y)"`).
- [x] **Paso 2: Generador de Descripciones.** Desarrollar funciones que reciban el contexto del paso actual (los valores específicos) e inyecten esos valores en el texto. (Ej: `"Como A es Verdadero y B es Falso, entonces (A y B) es Falso"`).
- [x] **Paso 3: Integración Trazable.** Asegurar que los textos generados por Mio se acoplen perfectamente con el array de historial que esperan Morocho y Alex.

## Temas a investigar (Para principiantes)
- **Árboles de Sintaxis Abstracta (AST):** Concepto clave para Arom al construir la estructura anidada de operaciones lógicas.
- **Diccionarios/Mapas en TypeScript:** Concepto clave para Mio al crear las traducciones (Ej: `Record<string, string>`).
- **Funciones Puras e Inmutabilidad:** Regla de oro para ambos: las funciones no deben alterar variables externas, solo recibir datos y retornar resultados nuevos.

---
## ⚠️ IMPORTANTE: Estándares, Herramientas y Registro de Avance

Para garantizar un código robusto, limpio y sin errores en el equipo (y con asistentes IA Antigravity), tener en cuenta lo siguiente:

1. **Herramientas y Verificación (LSP & Testing):**
   - **Verificación de Tipos (LSP / vue-tsc):** Ejecutar siempre `npm run type-check` antes de finalizar para asegurar TypeScript estricto (cero `any`).
   - **Pruebas Automatizadas (Vitest):** Ejecutar `npm test` para validar la lógica del motor y las funciones auxiliares.
   - **Servidores de Lenguaje configurados:** `typescript-language-server` y `@vue/language-server` (Volar).

2. **Skills y Buenas Prácticas del Proyecto:**
   - Seguir las directrices de `AGENTS.md` y las skills de `vue-best-practices`.
   - **Modularidad y Funciones Puras:** El motor en `src/lib/solver/` y las traducciones de Mio deben ser módulos desacoplados de la UI (Vue).
   - Para consultar documentación actualizada de librerías o sintaxis, usar la CLI de **Context7** (`npx ctx7@latest ...`).

3. **Registro Obligatorio:**
   - Al finalizar tu parte de las tareas, debes añadir obligatoriamente tu avance formal (detallando lo completado) en el archivo `../avance.md`.

