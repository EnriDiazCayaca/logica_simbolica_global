# Tareas de Morocho y Alex: Módulo de Trazabilidad y Explicación (Didáctico)

**Objetivo:** Hacer que el motor guarde el "paso a paso" detallado de la resolución para poder enseñarlo.

## Tareas Detalladas
- [ ] **Paso 1: Diseñar cómo se guardará un "paso".** Piensen cómo quieren que la interfaz (que se hará en el próximo sprint) reciba la información. Un buen inicio es definir un objeto en TypeScript: `{ numeroPaso: 1, operacion: "Simplificar", explicacion: "Se aplicó la regla de De Morgan", estadoActual: "..." }`.
- [ ] **Paso 2: Crear el contenedor del historial.** Creen una estructura (como un array vacío `[]`) al principio de la resolución donde se irán empujando (`.push()`) los pasos a medida que el motor (creado por Mio y Arom) avanza.
- [ ] **Paso 3: Coordinación con el Solver.** Hablen con Mio y Arom para acordar en qué momentos exactos el motor debería avisarles que "ocurrió un paso nuevo" para que ustedes lo registren en su array.
- [ ] **Paso 4: Mantenerlo limpio (Desacoplamiento).** Asegúrense de que las explicaciones sean texto plano (ej: `"Se aplica la regla X"`), sin código HTML (`<b>Se aplica...</b>`). El diseño visual se hará después.

## Temas a investigar (Para principiantes)
- **Arreglos (Arrays) en JavaScript/TypeScript:** Repasen los métodos `.push()`, `.map()`, y `.forEach()`.
- **Trabajo con Objetos:** Repasen cómo crear objetos `{ clave: valor }` y cómo actualizar sus propiedades.
