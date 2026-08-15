# Tareas de Mio y Arom: Módulo de Resolución (Solver)

**Objetivo:** Garantizar que la herramienta resuelva los problemas matemáticos planteados y devuelva la solución exacta.

## Tareas Detalladas
- [ ] **Paso 1: Entender el problema matemático (Mio).** Antes de tocar el código, escribe en un papel o en un bloc de notas cuáles son las reglas exactas que el motor debe seguir (por ejemplo, cómo se evalúa un "Y", un "O", o cómo se simplifica una expresión).
- [ ] **Paso 2: Definir los tipos de datos (Conjunto).** Creen un archivo `types.ts` y definan cómo se verá una "expresión" en código. Ejemplo: ¿Será un texto `string` o un objeto `{ tipo: 'operacion', valor: 'AND' }`? Empiecen con lo más sencillo.
- [ ] **Paso 3: Crear la estructura base de la función principal (Conjunto).** Creen un archivo `solver.ts` con una función vacía: `export function resolverExpresion(entrada) { return salida; }`.
- [ ] **Paso 4: Implementar las reglas paso a paso (Conjunto).** Tomen las reglas que Mio escribió y programen una por una dentro de la función. Prueben usando `console.log()` para ver si funciona con casos muy simples (ej. "A y B" donde A=true, B=false).

## Temas a investigar (Para principiantes)
- **Tipos e Interfaces en TypeScript:** Lean cómo crear un `type` o `interface`. Esto les ayuda a que TypeScript les avise si cometen errores al pasar datos.
- **Funciones Puras:** Busquen ejemplos de funciones puras. En resumen: si a una función le pasas los mismos datos 10 veces, debe devolver siempre lo mismo sin cambiar variables de otros archivos.
