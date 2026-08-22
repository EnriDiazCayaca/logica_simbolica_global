# Tareas de Rennato: Auditoría Visual, Accesibilidad y QA

**Objetivo:** Auditar la interfaz, asegurar la fidelidad al Glosario de Diseño y garantizar la calidad con tests unitarios y de integración.

---

## 📌 Posición en el Flujo de Trabajo
- **Fase 4 (Auditoría Final):** Entras en acción cuando **Arom** termine la **Fase 3** (ensamble de la página `index.vue` con todos los componentes y el motor).
- ⚠️ **Dependencia:** Requieres que las Fases 1, 2 y 3 estén completas.
- 📢 **Al terminar:** Emites el reporte final de calidad y das el visto bueno (o lista de correcciones) para el Pull Request del equipo.

---

## Tareas Detalladas (FASE 4)
- [ ] **Paso 1: Auditoría de Branding y Responsive.** Verifica la implementación de `index.vue` contra `../glosario-diseno.md`. Ajusta responsividad para móvil (`320px` - `768px`). Asegura el uso estricto de iconos Lucide (cero emojis en UI).
- [ ] **Paso 2: Pruebas de Integración y Componentes (Vitest).** 
    - `FormularioInferencia`: Prueba enfáticamente que el botón *Demostrar* se deshabilita correctamente al recibir la prop `isLoading=true` o cuando las entradas están vacías.
    - `PanelTrazabilidad` e `IndicadorResultado`: Pruebas de renderizado y props reactivas.
    - **Página completa (`index.vue`):** Añade una prueba de integración que simule el llenado del formulario, el click al botón, y verifique que el estado se actualiza simulando una respuesta del motor con un *mock*.
- [ ] **Paso 3: Validación Estricta de Calidad.** Ejecuta `npm run type-check` y `npm run lint`. Limpia cualquier error o advertencia.
- [ ] **Paso 4: Auditoría de Accesibilidad y Errores.** Verifica que los errores del motor se muestren al usuario en `IndicadorResultado`. Asegúrate de que todos los inputs tengan `labels` con `id`/`for` y que los resultados usen `aria-live`. Si algo falla, repórtalo al integrante responsable.

---

## 💬 Comentario de Cierre al Finalizar
Cuando completes la auditoría, deja este comentario en `../avance.md` o en tu commit:
> *"Auditoría de QA y pruebas completadas por Rennato. Módulo de Inferencias validado y listo para Pull Request final."*

---

## ⛔ REGLA DE NO DUPLICACIÓN (Para Agentes de IA)
> **Tu IA asistente NO debe implementar desde cero los componentes de tus compañeros.** Tu rol es auditar, escribir tests y reportar inconsistencias.

---

## ⚠️ IMPORTANTE
- **Flujo General:** Consulta `../flujo-trabajo.md` y `../glosario-diseno.md`.
- **Reglas del Proyecto:** Respeta `AGENTS.md` (commits atómicos y checklist de QA manual obligatorio).
- **Herramientas:** Ejecutar `npm run type-check` y `npm run lint`.
- **Registro:** Documenta en `../avance.md`.
