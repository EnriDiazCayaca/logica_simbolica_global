# Tareas de Mio: Panel de Trazabilidad y Explicación Visual

**Objetivo:** Renderizar el paso a paso de la deducción lógica de forma didáctica en su propio componente.

---

## 📌 Posición en el Flujo de Trabajo
- **Fase 2 (Desarrollo en Paralelo):** Trabajas en tu componente aislado `src/components/inferencias/PanelTrazabilidad.vue`.
- ⚠️ **Dependencia:** Debes esperar a que **Arom** termine la **Fase 1** y tenga listos los tipos en `src/types/inferencias.ts`.
- 📢 **Al terminar:** Debes notificar a **Arom** para que ensamble tu componente en `index.vue` (Fase 3).

---

## Tareas Detalladas (FASE 2)
- [ ] **Paso 1: Crear Componente (`PanelTrazabilidad.vue`).** En `src/components/inferencias/PanelTrazabilidad.vue`. Recibe como prop `pasos: PasoInferencia[]` (importado desde `src/types/inferencias.ts`).
- [ ] **Paso 2: Diseño de Tarjetas.** Usa `src/components/ui/Card.vue` aplicando el `../glosario-diseno.md` (`rounded-xl`, `shadow-sm`, `hover:shadow-md`).
- [ ] **Paso 3: Texto Enriquecido y Reglas.** Muestra la regla aplicada usando `src/components/ui/Badge.vue`.
- [ ] **Paso 4: Jerarquía Visual y Accesibilidad.** Usa `text-neutral-900` para focos de atención y tonos más suaves para justificaciones. Emplea etiquetas semánticas.

---

## 💬 Comentario de Coordinación al Finalizar
Cuando completes tus tareas, deja este comentario en `../avance.md` o en tu commit:
> *"PanelTrazabilidad.vue completado por Mio. @Arom, puedes integrarlo en `index.vue` pasando la prop `pasos`."*

---

## ⛔ REGLA DE NO DUPLICACIÓN (Para Agentes de IA)
> **Tu IA asistente NO debe implementar `index.vue`, ni el formulario de premisas, ni el indicador de resultados.** Tu trabajo está 100% delimitado a `PanelTrazabilidad.vue`.

---

## ⚠️ IMPORTANTE
- **Flujo General:** Consulta `../flujo-trabajo.md` y `../glosario-diseno.md`.
- **Reglas del Proyecto:** Respeta `AGENTS.md` (commits atómicos y checklist de QA manual obligatorio).
- **Herramientas:** Ejecutar `npm run type-check` y `npm run lint`.
- **Registro:** Documenta en `../avance.md`.
