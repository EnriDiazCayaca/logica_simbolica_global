# 🚀 Flujo de Trabajo y Orden de Ejecución — Sprint 3 (UI)

Para evitar bloqueos, código duplicado o conflictos de fusión (merge conflicts), el equipo **Hijos de Linus** debe seguir el siguiente orden secuencial y por fases:

---

## 🗺️ Mapa de Dependencias

```
[FASE 1: Contratos & Shell]
         Arom (Tipos + Componentes UI Base + Router)
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
[FASE 2: Componentes Hijos en Paralelo]
    Morocho                Mio                  Alex
 (Formulario)      (Panel Trazabilidad)      (Indicador)
       └────────────────────┬────────────────────┘
                            ▼
[FASE 3: Ensamble & Integración]
         Arom (Conexión Motor + Estado Global + Ensamble)
                            │
                            ▼
[FASE 4: Auditoría & QA Final]
        Rennato (Pruebas Vitest, E2E Mock, Responsive, Lint)
```

---

## ⏱️ Fases Detalladas de Ejecución

### 📍 FASE 1: Fundación y Contratos (Arom) — *Día 1 / Primer Paso*
- **Encargado:** Arom
- **Entregables:**
  1. `src/types/inferencias.ts` (Tipos compartidos: `InferenciaRequest`, `PasoInferencia`, `ResultadoInferencia`).
  2. Verificación de `src/components/ui/` (`Card.vue`, `Button.vue`, `Badge.vue`).
  3. Esqueleto de `src/pages/inferencias/index.vue` con la ruta en el router.
- 🛑 **Bloquea a:** Morocho, Mio, Alex y Rennato. Nadie debe programar antes de que Arom termine y suba la Fase 1.
- 📢 **Acción de salida:** Arom avisa en `avance.md` o commit: *"Tipos y componentes base listos en `src/types/inferencias.ts`. Morocho, Mio y Alex ya pueden trabajar."*

---

### 📍 FASE 2: Desarrollo Paralelo de Componentes Hijos — *Día 2*
Los 3 integrantes trabajan en **paralelo e independientemente** en sus respectivos componentes, sin tocar `index.vue` ni duplicar código de otros:

1. **Morocho:** Desarrolla `src/components/inferencias/FormularioInferencia.vue`
   - *Depende de:* Tipos de Arom (`InferenciaRequest`).
   - *Entrega:* Componente puro que emite `submit` y recibe `isLoading`.
   - *Aviso:* *"Formulario listo para integrar por Arom en `index.vue`"*.

2. **Mio:** Desarrolla `src/components/inferencias/PanelTrazabilidad.vue`
   - *Depende de:* Tipos de Arom (`PasoInferencia[]`) y `Card.vue` / `Badge.vue`.
   - *Entrega:* Componente puro que recibe `pasos` y renderiza las explicaciones.
   - *Aviso:* *"Panel de trazabilidad listo para integrar por Arom en `index.vue`"*.

3. **Alex:** Desarrolla `src/components/inferencias/IndicadorResultado.vue`
   - *Depende de:* Tipos de Arom (`ResultadoInferencia`).
   - *Entrega:* Componente puro con Lucide icons y accesibilidad (`role="status"`).
   - *Aviso:* *"Indicador de resultado listo para integrar por Arom en `index.vue`"*.

> ⚠️ **REGLA DE ORO FASE 2:** La IA de cada integrante NO debe simular ni crear los componentes de los otros compañeros. Solo trabaja en su propio archivo dentro de `src/components/inferencias/`.

---

### 📍 FASE 3: Ensamble e Integración (Arom) — *Día 3*
- **Encargado:** Arom
- **Entregables:**
  1. Importar `FormularioInferencia`, `PanelTrazabilidad` e `IndicadorResultado` dentro de `src/pages/inferencias/index.vue`.
  2. Implementar la reactividad y la función `procesarInferencia()` conectada a `src/lib/solver/` y `src/lib/trazabilidad/`.
  3. Manejar estados de carga (`isLoading`), errores (`error`) y éxito (`resultado`, `pasos`).
- 📢 **Acción de salida:** Arom avisa: *"Página `index.vue` integrada con motor y componentes. Lista para auditoría de Rennato."*

---

### 📍 FASE 4: Auditoría, Testing & QA Final (Rennato) — *Día 4*
- **Encargado:** Rennato
- **Entregables:**
  1. Tests unitarios para cada componente hijo en Vitest.
  2. Test de integración simulada (mock) en `index.vue`.
  3. Auditoría de accesibilidad (`labels`, `aria-live`), responsividad móvil y cero-emojis.
  4. Verificación estricta: `npm run type-check` y `npm run lint`.
