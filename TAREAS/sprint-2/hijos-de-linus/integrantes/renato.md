# Tareas de Renato: Validaciones, Pruebas y Cobertura (Carga Ampliada)

**Objetivo:** Proteger el motor contra entradas inválidas, asegurar que no falle y validar exhaustivamente el código del equipo. Tu rol es ser el "abogado del diablo" del código.

## Tareas Detalladas
- [x] **Paso 1: Matriz de Casos Borde (`casos_de_prueba.md`).** Sin escribir código, haz una lista de al menos 15 maneras en que el usuario podría romper el programa (ej: texto vacío, enviar números en vez de letras, poner símbolos raros).
- [x] **Paso 2: Función de Sanitización.** Crea un archivo `validator.ts` con una función `sanitizarEntrada(texto)`. Esta función debe recibir lo que el usuario escribió, limpiarlo (quitar espacios extra, caracteres inválidos) o lanzar un error si es insalvable, ANTES de pasarlo al motor.
- [x] **Paso 3: Configurar Vitest.** Investiga e instala Vitest. Crea un archivo muy básico de prueba (`test_ejemplo.test.ts`) solo para verificar que el comando de pruebas funciona.
- [x] **Paso 4: Escribir las pruebas reales.** Una vez que Mio, Arom, Alex y Morocho tengan funciones listas, importa esas funciones en tus archivos de prueba (`.test.ts`) y ponlas a prueba con tus casos límite usando `expect()`.
- [x] **Paso 5: Documentación.** Crea o actualiza un `README.md` corto explicando a tus compañeros cómo usar tu función `sanitizarEntrada` y qué comandos correr para ejecutar los tests.

## Temas a investigar (Para principiantes)
- **Manejo de Errores (try/catch y throw):** Aprende cómo detener el programa a propósito si hay un error: `throw new Error("Entrada inválida")`.
- **Testing Básico (Vitest o Jest):** Busca un tutorial de 10 minutos de Vitest. Aprende las palabras clave: `describe`, `it`, `test`, `expect`.

---
## ⚠️ IMPORTANTE: Estándares, Herramientas y Registro de Avance

Para garantizar un código robusto, limpio y sin errores en el equipo (y con asistentes IA Antigravity), tener en cuenta lo siguiente:

1. **Herramientas y Verificación (LSP & Testing):**
   - **Verificación de Tipos (LSP / vue-tsc):** Ejecutar siempre `npm run type-check` antes de finalizar para asegurar TypeScript estricto (cero `any`).
   - **Pruebas Automatizadas (Vitest):** Ejecutar `npm test` o `npm run test:watch` para validar que tus tests pasen y no existan regresiones.
   - **Servidores de Lenguaje configurados:** `typescript-language-server` y `@vue/language-server` (Volar).

2. **Skills y Buenas Prácticas del Proyecto:**
   - Seguir las directrices de `AGENTS.md` y las skills de `vue-best-practices`.
   - **Sanitización y Validación:** La función `sanitizarEntrada` debe ser una función pura y bien testeada contra casos límite.
   - Para consultar documentación actualizada de librerías o testing, usar la CLI de **Context7** (`npx ctx7@latest ...`).

3. **Registro Obligatorio:**
   - Al finalizar tu parte de las tareas, debes añadir obligatoriamente tu avance formal (detallando lo completado) en el archivo `../avance.md`.

