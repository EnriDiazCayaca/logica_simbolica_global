# 📊 Registro de Avances — Los Hijos de Linus

## 🚀 SPRINT 3.5 (Completado)

### Alex - 2026-08-23
- **Tareas Completadas:** 
  - Actualización de `IndicadorResultado.vue` para mostrar de forma reactiva los motivos y diagnósticos de falacias (`errorLogico`) en el estado inválido y error.
  - Implementación de acordeón colapsable en `PanelTrazabilidad.vue` (`¿Por qué esta regla?` / `Ocultar explicación`) para ver las explicaciones didácticas de cada deducción formal.
  - Creación de pruebas unitarias adicionales en `IndicadorResultado.test.ts` y `PanelTrazabilidad.test.ts`.
- **Checklist Manual Ejecutado (QA Humano):**
  - [x] Navegación por teclado probada en los botones del acordeón.
  - [x] Contrastes y transiciones suaves de apertura/cierre.

### Mio - 2026-08-23
- **Tareas Completadas:** 
  - Creación y verificación de `TraductorLenguajeNatural.vue`, permitiendo asignar texto a variables proposicionales y generando el argumento continuo.
  - Integración de sistema de pestañas en `index.vue` (`[ ⌨️ Simbología Formal ]` | `[ 📖 Lenguaje Natural ]`), preservando la estructura balanceada en 2 columnas sin romper la altura visual.
  - Sincronización en tiempo real entre el formulario y el traductor.
  - Pruebas unitarias en `TraductorLenguajeNatural.test.ts` e integración de pestañas en `index.test.ts`.
- **Checklist Manual Ejecutado (QA Humano):**
  - [x] Responsividad de pestañas en móviles y escritorio.
  - [x] Sincronización de variables reactivas al cambiar inputs.

### Morocho - 2026-08-23
- **Tareas Completadas:** 
  - Definición temprana de tipos en `src/lib/solver/types.ts` (`MotivoInvalidez`, `ErrorLogico`, `ResultadoDemostracion`) exportados en `src/types/inferencias.ts`.
  - Implementación de `detectarErrorLogico()` en `src/lib/solver/solver.ts` con *pattern matching* para diagnosticar falacias y motivos de fallo lógico.
  - Creación de 3 pruebas unitarias adicionales en `src/lib/solver/solver.test.ts` (15/15 tests pasando).

---

## 📦 SPRINT 3 (Completado)

### Arom - 2026-08-23
- **Tareas Completadas:** 
  - Fase 3 completada: Integración completa de `index.vue` conectando `FormularioInferencia`, `IndicadorResultado` y `PanelTrazabilidad` con el motor lógico.
  - Implementación de Teclado Lógico Simbólico (`¬`, `∧`, `∨`, `→`, `↔`, `(`, `)`).
  - Corrección de base URL en `src/router/index.ts` para despliegues.

### Rennato - 2026-08-23
- **Tareas Completadas:**
  - Fase 4 completada: Setup de `@vue/test-utils` y `happy-dom` en `vite.config.ts`.
  - Creación de suites de prueba unitarias e integración de la página.

### Alex - 2026-08-22
- **Tareas Completadas:**
  - Fase 2 (Indicador de Resultados y Feedback Visual) completada.

### Mio - 2026-08-22
- **Tareas Completadas:** 
  - Fase 2 (Panel de Trazabilidad y Explicación Visual).

### Morocho - 2026-08-22
- **Tareas Completadas:**
  - Fase 2 (Formulario de Inferencia).
