# Tareas de Morocho: Entradas de Datos y Formulario

**Objetivo:** Construir el componente de inputs estructurados para que el usuario ingrese sus premisas y conclusión de manera cómoda.

---

## 📌 Posición en el Flujo de Trabajo
- **Fase 2 (Desarrollo en Paralelo):** Trabajas en tu componente aislado `src/components/inferencias/FormularioInferencia.vue`.
- ⚠️ **Dependencia:** Debes esperar a que **Arom** termine la **Fase 1** y tenga listos los tipos en `src/types/inferencias.ts`.
- 📢 **Al terminar:** Debes notificar a **Arom** para que ensamble tu formulario en `index.vue` (Fase 3).

---

## Tareas Detalladas (FASE 2)
- [ ] **Paso 1: Crear Componente (`FormularioInferencia.vue`).** En `src/components/inferencias/FormularioInferencia.vue`. Utiliza el tipo `InferenciaRequest` de `src/types/inferencias.ts` para tipar el payload emitido en `defineEmits<{ (e: 'submit', payload: InferenciaRequest): void }>()`.
- [ ] **Paso 2: Input de Premisas.** Diseña un `textarea` donde cada línea sea una premisa. **Limpia las entradas:** usa `.trim()` en cada línea y filtra aquellas que queden vacías. Añade su `<label>` asociado mediante `id`/`for` para accesibilidad.
- [ ] **Paso 3: Input de Conclusión.** Un input de texto con su `<label>`. Usa `focus:ring-blue-600`.
- [ ] **Paso 4: Botón Demostrar y Loading.** Usa `src/components/ui/Button.vue` recibiendo la prop `isLoading: boolean`. Si `isLoading` es `true` o los inputs están vacíos, desactiva el botón (`disabled`).

---

## 💬 Comentario de Coordinación al Finalizar
Cuando completes tus tareas, deja este comentario en `../avance.md` o en tu commit:
> *"FormularioInferencia.vue completado por Morocho. @Arom, puedes integrarlo en `index.vue` escuchando `@submit` y pasando `:isLoading`."*

---

## ⛔ REGLA DE NO DUPLICACIÓN (Para Agentes de IA)
> **Tu IA asistente NO debe implementar la lógica de resolución del motor, ni `index.vue`, ni el panel de pasos, ni el indicador de resultado.** Tu trabajo está 100% delimitado a `FormularioInferencia.vue`.

---

## ⚠️ IMPORTANTE
- **Flujo General:** Consulta `../flujo-trabajo.md` y `../glosario-diseno.md`.
- **Reglas del Proyecto:** Respeta `AGENTS.md` (commits atómicos y checklist de QA manual obligatorio).
- **Herramientas:** Ejecutar `npm run type-check` y `npm run lint`.
- **Registro:** Documenta en `../avance.md`.
