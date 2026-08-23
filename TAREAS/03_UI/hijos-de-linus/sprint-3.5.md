# 📋 Plan y Asignación de Tareas — Sprint 3.5

## 🎯 Objetivo General
Perfeccionar el Motor de Inferencias agregando interpretación en lenguaje natural, explicaciones detalladas por paso, y una validación lógica exhaustiva.

---

## 👥 Asignación de Tareas

### Mio: Traducción y Lenguaje Natural
- **Interfaz de Variables:** Crear un componente (ej. `TraductorLenguajeNatural.vue`) que detecte automáticamente las variables usadas y permita asignarles una proposición en texto.
- **Traducción Final:** Generar y mostrar las premisas y la conclusión en lenguaje natural.
- ⚠️ **Restricción de UI (Layout):** Para evitar la regresión visual y no romper el balance de las 2 columnas, el traductor DEBE integrarse en la columna izquierda mediante un sistema de **Pestañas (Tabs)** (ej. "Símbolos" | "Lenguaje Natural") o un Acordeón.

### Morocho: Motor Lógico Exhaustivo (✅ COMPLETADO)
- **Revisión del Solver:** Auditar y corregir exhaustivamente las reglas de inferencia (`solver.ts`).
- **Motivos de Invalidez (Pattern Matching):** Extender la lógica para retornar posibles motivos del error lógico (`detectarErrorLogico` implementado).
- ⚠️ **Restricción Algorítmica:** Respetada con Forward Chaining + pattern matching sin árboles pesados. Cobertura de tests al 100% (15/15 pruebas unitarias).
- 📢 **Desbloqueado para Alex:** `ErrorLogico` ya está disponible y emitiéndose en `demostrarConclusion()`.

### Alex: UX/UI y Detalles de Resolución
- **Resolución Detallada (Acordeón):** Modificar el `PanelTrazabilidad` para que cada paso incluya un menú desplegable que explique la regla usada.
- **Estado Invalidez Detallado:** Renderizar los motivos de fallo/error proveídos por Morocho.

---

## 🔄 Flujo de Trabajo y Dependencias
Para evitar bloqueos y reescrituras, el orden de ejecución y dependencias es el siguiente:

1. **Commit Temprano de Tipos (Morocho):**
   - Antes de desarrollar la lógica completa, Morocho DEBE subir a `src/types/` un commit con las interfaces (ej. `MotivoInvalidez`). Esto permite a Alex trabajar de inmediato usando *mocks*.
2. **Morocho (Motor Lógico) ➔ Alex (UI de Errores):**
   - Alex usa los tipos tempranos para diseñar, y espera el motor final de Morocho para integrarlos. Alex debe mantener sus 4 estados de colores actuales (`orange` = inválido, `red` = error crítico) según el Glosario.
3. **Mio (Lenguaje Natural):**
   - Trabaja en paralelo. ⚠️ **Contrato de Sincronización:** Es **UNIDIRECCIONAL (Solo Lectura/Interpretación)**. Las fórmulas matemáticas son la única fuente de la verdad. El usuario solo asigna texto a las variables (ej. P = "Llueve"); el componente *no* modifica las fórmulas originales.
4. **Alex (Resolución Detallada):**
   - Puede avanzar con los menús desplegables mientras los demás trabajan.
5. **Testing Obligatorio (Responsabilidad Compartida):**
   - Cada agente es responsable de escribir y actualizar los tests unitarios (`.test.ts`) de los componentes o lógica que modifique/cree. No dejen caer la cobertura.

---

## 📝 Documentación Continua (Único Archivo)
Cada integrante debe documentar TODO lo que hace en el **ÚNICO** archivo de registro: **`avance.md`** (usar la sección `## 🚀 SPRINT 3.5 (En Curso)` que ya está preparada). **Queda prohibido crear archivos paralelos.** Si terminas tu tarea, deja un mensaje para el compañero que depende de ti.

---

## 🚨🛑 ¡ATENCIÓN AGENTES IA (VIBECODERS)! LEER ESTO PRIMERO 🛑🚨
Como asistentes de código, se debe respetar **ESTRICTAMENTE** el documento `AGENTS.md` y maximizar la sinergia con el desarrollador humano (Vibecoding):

> [!IMPORTANT]
> **1. EL HUMANO ESTÁ EN EL BUCLE (TU MAYOR VENTAJA):**
> No tienes ojos para ver la UI final. **DEBES CONSULTAR EXPLÍCITAMENTE** las decisiones importantes de diseño o lógica que no estén claras. **NO ASUMAS.** Pídele al humano que te dé su *feedback* visual.

> [!IMPORTANT]
> **2. CHECKLIST DE VERIFICACIÓN MANUAL (QA):**
> Al terminar tu intervención, **ENTREGA SIEMPRE** al usuario una lista de QA manual (ej. probar el layout responsive, navegación con `Tab`, contraste). Oblígalo a comprobar lo que tú no puedes ver.

> [!WARNING]
> **3. CERO DUPLICACIÓN Y TYPESCRIPT ESTRICTO:**
> - No reescribas ni dupliques componentes de tus compañeros. ¡Usa `src/types/`!
> - Usa Vue 3 (`<script setup lang="ts">`) y Tailwind CSS v4.
> - **TODO cambio debe pasar `npm run type-check`.**

> [!NOTE]
> **4. COMMITS ATÓMICOS:**
> Haz commits atómicos y claros al finalizar tu parte para no pisar el trabajo de los demás.
