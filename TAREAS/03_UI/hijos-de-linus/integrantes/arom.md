# Tareas de Arom: Orquestación, Tipos y Estado Global (UI)

**Objetivo:** Definir los contratos de datos, estructurar el esqueleto, y finalmente ensamblar todos los componentes con el motor.

---

## 📌 Posición en el Flujo de Trabajo
- **Fase 1 (Inicio obligatorio):** Defines los tipos compartidos y el esqueleto base. **Los demás integrantes no pueden empezar hasta que termines la Fase 1.**
- **Fase 3 (Ensamble final):** Una vez que Morocho, Mio y Alex terminen la Fase 2, integras sus 3 componentes en `index.vue` y conectas el motor.

---

## Tareas Detalladas

### 🟢 FASE 1: Fundación y Contratos (Haz esto primero)
- [x] **Paso 0: Verificación Base y Tipos.**
  - Verifica que Tailwind esté configurado y si existen `Card.vue`, `Button.vue` y `Badge.vue` en `src/components/ui/`. Si no, créalos guiándote por `../glosario-diseno.md`.
  - Crea `src/types/inferencias.ts` exportando `InferenciaRequest`, `PasoInferencia` y `ResultadoInferencia` ('valida', 'invalida', 'error', 'pendiente').
  - Asegura que `src/pages/inferencias/index.vue` esté registrado en el router.
  - 📢 **Aviso de Desbloqueo:** Deja una nota en `avance.md` o en el commit: *"Fase 1 lista: tipos en `src/types/inferencias.ts`. Morocho, Mio y Alex pueden comenzar."*
- [x] **Paso 1: Maquetación principal (`index.vue`).** Crea el esqueleto base con placeholders donde irán los componentes hijos.

### 🟢 FASE 3: Integración y Ensamble (Tras finalizar Morocho, Mio y Alex)
- [ ] **Paso 2: Gestión de Estado.** Define: premisas, conclusión, resultado, pasos, `isLoading` (booleano) y `error` (string | null).
- [ ] **Paso 3: Integración del Motor.** En `procesarInferencia()`:
  - Activa `isLoading`. Envuélvela en `try/catch`. 
  - **Manejo de Respuestas:** Si es exitosa, actualiza `resultado` a `'valida'` o `'invalida'` y guarda el array en `pasos`.
  - **Manejo de Errores:** Si el motor lanza excepción (`catch`) O devuelve error (`{ ok: false }`), actualiza `resultado = 'error'` y `error = mensaje`.
- [ ] **Paso 4: Ensamble de Componentes Hijos.** Importa los componentes terminados por tus compañeros (`FormularioInferencia`, `PanelTrazabilidad`, `IndicadorResultado`). Pasa props (`isLoading`, `resultado`, `error`, `pasos`) y escucha `emits` del formulario.
- 📢 **Aviso a QA:** Notifica a Rennato: *"Página completa ensamblada y conectada al motor. Lista para auditoría y testing."*

---

## ⛔ REGLA DE NO DUPLICACIÓN (Para Agentes de IA)
> **Tu IA asistente NO debe crear los componentes internos de tus compañeros** (`FormularioInferencia`, `PanelTrazabilidad`, `IndicadorResultado`). Durante la Fase 1 solo debes dejar placeholders/slots simples. La implementación real la harán ellos en la Fase 2 y tú solo la ensamblarás en la Fase 3.

---

## ⚠️ IMPORTANTE
- **Flujo General:** Consulta `../flujo-trabajo.md` y `../glosario-diseno.md`.
- **Reglas del Proyecto:** Respeta `AGENTS.md` (commits atómicos y checklist de QA manual obligatorio).
- **Herramientas:** Ejecutar `npm run type-check` y `npm run lint`.
- **Registro:** Documenta en `../avance.md`.
