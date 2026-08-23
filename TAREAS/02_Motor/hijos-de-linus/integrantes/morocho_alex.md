# Tareas de Morocho y Alex: Módulo de Trazabilidad y Explicación (Didáctico)

**Objetivo:** Hacer que el motor guarde el "paso a paso" detallado de la resolución para poder enseñarlo.

## Tareas Detalladas
- [x] **Paso 1: Diseñar cómo se guardará un "paso".** Se definió la interfaz `PasoTrazabilidad` en `src/lib/trazabilidad/types.ts` con los campos: `numeroPaso`, `operacion`, `regla`, `alias`, `explicacion`, `expresionSimbolica`, `lineasBase`, `esConclusion` y `estadoActual`. Se creó también `ResultadoTrazabilidad` como contenedor completo con `esValido`, `pasos`, `conclusion` y `totalPasos`.
- [x] **Paso 2: Crear el contenedor del historial.** Se implementó `crearHistorial()` en `src/lib/trazabilidad/historial.ts` que retorna un array vacío `[]`. La función `registrarPaso()` usa `.push()` para ir agregando cada paso a medida que el motor avanza. Se incluyeron funciones auxiliares `obtenerPaso()` y `obtenerConclusiones()` para consultas sobre el historial.
- [x] **Paso 3: Coordinación con el Solver.** La función `construirTrazabilidad()` integra directamente con la salida de `demostrarConclusion()` del solver. Recorre `resultado.pasos` en orden, acumulando `pasosPrevios` para resolver referencias cruzadas de líneas. Consume el módulo de transcripción de Mio (`generarPasoEnriquecido`, `renderizarNodo`) para generar las descripciones en español.
- [x] **Paso 4: Mantenerlo limpio (Desacoplamiento).** Toda la lógica de trazabilidad está en `src/lib/trazabilidad/`, separada del solver y de la transcripción. Los textos generados son plano (sin HTML). La interfaz está diseñada para que la UI (próximo sprint) pueda consumirla directamente sin procesamiento adicional.

## Archivos Creados
- `src/lib/trazabilidad/types.ts` — Interfaces `PasoTrazabilidad` y `ResultadoTrazabilidad`
- `src/lib/trazabilidad/historial.ts` — Funciones `crearHistorial`, `registrarPaso`, `construirTrazabilidad`, `obtenerPaso`, `obtenerConclusiones`
- `src/lib/trazabilidad/index.ts` — Punto de entrada del módulo (re-exports)
- `src/lib/trazabilidad/trazabilidad.test.ts` — Suite de pruebas Vitest (9 tests, 22 assertions totales)

## Corrección Adicional
- Se corrigió un bug en `src/lib/transcription/astRenderer.ts`: la importación de tipos apuntaba a `"./types"` (inexistente) en lugar de `"../solver/types"`.

## Temas a investigar (Para principiantes)
- **Arreglos (Arrays) en JavaScript/TypeScript:** Repasen los métodos `.push()`, `.map()`, y `.forEach()`.
- **Trabajo con Objetos:** Repasen cómo crear objetos `{ clave: valor }` y cómo actualizar sus propiedades.

---
## IMPORTANTE: Estándares, Herramientas y Registro de Avance

Para garantizar un código robusto, limpio y sin errores en el equipo (y con asistentes IA Antigravity), tener en cuenta lo siguiente:

1. **Herramientas y Verificación (LSP & Testing):**
   - **Verificación de Tipos (LSP / vue-tsc):** Ejecutar siempre `npm run type-check` antes de finalizar para asegurar TypeScript estricto (cero `any`).
   - **Pruebas Automatizadas (Vitest):** Ejecutar `npm test` para validar que tus cambios no rompan funcionalidades.
   - **Servidores de Lenguaje configurados:** `typescript-language-server` y `@vue/language-server` (Volar).

2. **Skills y Buenas Prácticas del Proyecto:**
   - Seguir las directrices de `AGENTS.md` y las skills de `vue-best-practices`.
   - **Desacoplamiento:** Mantener la lógica de trazabilidad y datos en texto plano y estructuras limpias, sin etiquetas HTML.
   - Para consultar documentación actualizada de herramientas, usar la CLI de **Context7** (`npx ctx7@latest ...`).

3. **Registro Obligatorio:**
   - Al finalizar tu parte de las tareas, debes añadir obligatoriamente tu avance formal (detallando lo completado) en el archivo `../avance.md`.
