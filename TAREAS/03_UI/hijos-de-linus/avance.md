# 📊 Registro de Avances — Los Hijos de Linus

## 🚀 SPRINT 3.5 (En Curso)
> **Instrucciones:** Cada integrante debe registrar sus avances copiando este template al finalizar su tarea.

### [Nombre del Integrante] - [Fecha]
- **Tareas Completadas:** 
  - (Ej: Componente X finalizado)
- **Decisiones Importantes Consultadas con el Humano:**
  - (Ej: Se acordó con Arom el formato de los errores)
- **Checklist Manual Ejecutado (QA Humano):**
  - [ ] Navegación por teclado probada
  - [ ] Responsividad manual verificada
  - [ ] Contrastes visuales y legibilidad comprobados
- **Mensaje para el siguiente integrante:**
  - (Ej: @Alex ya puedes usar la nueva interfaz de errores)

---

## 📦 SPRINT 3 (Completado)

### Arom - 2026-08-23
- **Tareas Completadas:** 
  - Fase 3 completada: Integración completa de `index.vue` conectando `FormularioInferencia`, `IndicadorResultado` y `PanelTrazabilidad` con el motor lógico (`demostrarConclusion` y `construirTrazabilidad`).
  - Implementación de Teclado Lógico Simbólico (`¬`, `∧`, `∨`, `→`, `↔`, `(`, `)`) y normalizador automático de símbolos matemáticos.
  - Corrección de base URL en `src/router/index.ts` para despliegues.
  - Reorganización de layout balanceado en 2 columnas (formulario a la izquierda, indicador y trazabilidad a la derecha).
- **Problemas Encontrados (y Soluciones):**
  - El motor lógico solo tenía un caso hardcodeado de Modus Ponens; se expandió a un motor de deducción completo (Forward Chaining) con reglas formales (MPP, MTT, SD, SH, SIMP, DN, DC).
- **Checklist Manual Ejecutado (QA Humano):**
  - [x] Navegación por teclado (`Tab`, `Enter`)
  - [x] Responsividad de 2 columnas a 1 columna
  - [x] Validación de contrastes y símbolos limpios

### Rennato - 2026-08-23
- **Tareas Completadas:**
  - Fase 4 completada: Setup de `@vue/test-utils` y `happy-dom` en `vite.config.ts`.
  - Creación de suites de prueba unitarias para `FormularioInferencia.test.ts`, `IndicadorResultado.test.ts`, `PanelTrazabilidad.test.ts`.
  - Creación de prueba de integración `src/pages/inferencias/__tests__/index.test.ts` cubriendo flujos exitosos y captura de excepciones.
  - Pruebas exhaustivas del motor lógico en `src/lib/solver/solver.test.ts` (12 tests pasando).
- **Checklist Manual Ejecutado:**
  - [x] Ejecución de suite de tests: 88 tests en verde (12 archivos).
  - [x] `npm run type-check` pasando al 100%.

### Alex - 2026-08-22
- **Tareas Completadas:**
  - Fase 2 (Indicador de Resultados y Feedback Visual) completada.
  - Creación de `src/components/inferencias/IndicadorResultado.vue` con props tipadas (`resultado: ResultadoInferencia`, `mensaje?: string`).
  - 4 estados implementados: válido (`green-600`), inválido (`orange-600`), error (`red-600`) y pendiente.
  - Accesibilidad: `role="status"` + `aria-live="polite"` en el contenedor.
- **Checklist Manual Ejecutado:**
  - [x] Responsividad e iconos escalables.

### Mio - 2026-08-22
- **Tareas Completadas:** 
  - Fase 2 (Panel de Trazabilidad y Explicación Visual).
  - Creación y desarrollo de `PanelTrazabilidad.vue` en base a los componentes base de UI.

### Morocho - 2026-08-22
- **Tareas Completadas:**
  - Fase 2 (Formulario de Inferencia).
  - Desarrollo de `FormularioInferencia.vue` con textarea de premisas y campo de conclusión.
