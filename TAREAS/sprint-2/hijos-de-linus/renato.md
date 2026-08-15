# Tareas de Renato: Validaciones, Pruebas y Cobertura (Carga Ampliada)

**Objetivo:** Proteger el motor contra entradas inválidas, asegurar que no falle y validar exhaustivamente el código del equipo. Tu rol es ser el "abogado del diablo" del código.

## Tareas Detalladas
- [ ] **Paso 1: Matriz de Casos Borde (`casos_de_prueba.md`).** Sin escribir código, haz una lista de al menos 15 maneras en que el usuario podría romper el programa (ej: texto vacío, enviar números en vez de letras, poner símbolos raros).
- [ ] **Paso 2: Función de Sanitización.** Crea un archivo `validator.ts` con una función `sanitizarEntrada(texto)`. Esta función debe recibir lo que el usuario escribió, limpiarlo (quitar espacios extra, caracteres inválidos) o lanzar un error si es insalvable, ANTES de pasarlo al motor.
- [ ] **Paso 3: Configurar Vitest.** Investiga e instala Vitest. Crea un archivo muy básico de prueba (`test_ejemplo.test.ts`) solo para verificar que el comando de pruebas funciona.
- [ ] **Paso 4: Escribir las pruebas reales.** Una vez que Mio, Arom, Alex y Morocho tengan funciones listas, importa esas funciones en tus archivos de prueba (`.test.ts`) y ponlas a prueba con tus casos límite usando `expect()`.
- [ ] **Paso 5: Documentación.** Crea o actualiza un `README.md` corto explicando a tus compañeros cómo usar tu función `sanitizarEntrada` y qué comandos correr para ejecutar los tests.

## Temas a investigar (Para principiantes)
- **Manejo de Errores (try/catch y throw):** Aprende cómo detener el programa a propósito si hay un error: `throw new Error("Entrada inválida")`.
- **Testing Básico (Vitest o Jest):** Busca un tutorial de 10 minutos de Vitest. Aprende las palabras clave: `describe`, `it`, `test`, `expect`.
