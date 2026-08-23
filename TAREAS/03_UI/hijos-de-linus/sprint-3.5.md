# 📋 Plan y Asignación de Tareas — Sprint 3.5

## 🎯 Objetivo General
Perfeccionar el Motor de Inferencias agregando interpretación en lenguaje natural, explicaciones detalladas por paso, y una validación lógica exhaustiva.

---

## 👥 Asignación de Tareas

### Mio: Traducción y Lenguaje Natural
- **Interfaz de Variables:** Crear un componente (ej. `TraductorLenguajeNatural.vue`) que detecte automáticamente las variables usadas (P, Q, etc.) y permita al usuario asignarles una proposición en texto real.
- **Traducción Final:** Generar y mostrar las premisas y la conclusión completamente redactadas en lenguaje natural (aprovechando el trabajo previo de traducción).

### Morocho: Motor Lógico Exhaustivo
- **Revisión del Solver:** Auditar, corregir y expandir exhaustivamente las reglas de inferencia (`solver.ts`). Asegurar que no haya "callejones sin salida" en deducciones válidas y que todas las reglas funcionen a la perfección.
- **Motivos de Invalidez:** Extender la lógica para que, cuando una inferencia sea inválida, el motor retorne posibles motivos o pistas del error lógico (ej. "Posible falacia de afirmación del consecuente", "Faltan premisas para conectar P con R").

---

## 🔄 Flujo de Trabajo y Dependencias
Para evitar bloqueos y reescrituras, el orden de ejecución y dependencias es el siguiente:

1. **Morocho (Motor Lógico) ➔ Alex (UI de Errores):**
   - Alex **no puede** diseñar los motivos de invalidez hasta que Morocho haya modificado los tipos (`src/types/`) y el motor para retornar dichos motivos.
2. **Mio (Lenguaje Natural) y Morocho (Reglas) pueden trabajar en paralelo:**
   - Mio trabaja en la nueva UI de la columna izquierda.
   - Morocho trabaja puramente en los archivos de `/lib/solver/`.
3. **Alex (Resolución Detallada):**
   - Puede avanzar con los menús desplegables del `PanelTrazabilidad` mientras los demás trabajan, usando las explicaciones ya existentes en `translations.ts`.

---

## 📝 Documentación Continua (Obligatorio)
Cada integrante debe documentar TODO lo que hace (interfaces modificadas, decisiones tomadas, qué falta) en el archivo **`avance.md`** (o crear un `avance-3.5.md`). **Si terminas tu tarea, debes dejar un comentario claro para el compañero del que dependes o que depende de ti.** ¡El contexto lo es todo para el siguiente agente!

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
