# Tareas de Alex: Indicador de Resultados y Feedback Visual

**Objetivo:** Mostrar clara e inequívocamente el estado de la inferencia (válida, inválida o error) en su propio componente.

---

## 📌 Posición en el Flujo de Trabajo
- **Fase 2 (Desarrollo en Paralelo):** Trabajas en tu componente aislado `src/components/inferencias/IndicadorResultado.vue`.
- ⚠️ **Dependencia:** Debes esperar a que **Arom** termine la **Fase 1** y tenga listos los tipos en `src/types/inferencias.ts`.
- 📢 **Al terminar:** Debes notificar a **Arom** para que ensamble tu indicador en `index.vue` (Fase 3).

---

## Tareas Detalladas (FASE 2)
- [ ] **Paso 1: Crear Componente (`IndicadorResultado.vue`).** En `src/components/inferencias/IndicadorResultado.vue`. Define props tipadas: `resultado: ResultadoInferencia` y `mensaje?: string` (importando `ResultadoInferencia` de `src/types/inferencias.ts`).
- [ ] **Paso 2: Estados e Iconografía.** Importa iconos desde `lucide-vue-next` (ej: `import { Check, X, AlertTriangle } from 'lucide-vue-next'`).
    - *Válido:* Verde semántico (`green-600`), icono `<Check />`, texto afirmativo.
    - *Inválido:* Rojo/naranja semántico, icono `<X />`.
    - *Error:* Rojo semántico (`red-600`), icono `<AlertTriangle />`, muestra `mensaje`.
    - *Vacío/Pendiente:* Estado inicial neutral o invisible.
- [ ] **Paso 3: Accesibilidad.** Añade `role="status"` o `aria-live="polite"` al contenedor principal para lectores de pantalla.
- [ ] **Paso 4: Animación y Jerarquía.** Usa `<Transition>` para aparición suave. Títulos destacados en `text-2xl` o `text-4xl font-bold`.

---

## 💬 Comentario de Coordinación al Finalizar
Cuando completes tus tareas, deja este comentario en `../avance.md` o en tu commit:
> *"IndicadorResultado.vue completado por Alex. @Arom, puedes integrarlo en `index.vue` pasando las props `:resultado` y `:mensaje`."*

---

## ⛔ REGLA DE NO DUPLICACIÓN (Para Agentes de IA)
> **Tu IA asistente NO debe implementar `index.vue`, ni el formulario, ni el motor de inferencias.** Tu trabajo está 100% delimitado a `IndicadorResultado.vue`.

---

## ⚠️ IMPORTANTE
- **Flujo General:** Consulta `../flujo-trabajo.md` y `../glosario-diseno.md`.
- **Reglas del Proyecto:** Respeta `AGENTS.md` (commits atómicos y checklist de QA manual obligatorio).
- **Herramientas:** Ejecutar `npm run type-check` y `npm run lint`.
- **Registro:** Documenta en `../avance.md`.
