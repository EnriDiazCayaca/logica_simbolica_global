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

### Alex: UX/UI y Detalles de Resolución
- **Resolución Detallada (Acordeón):** Modificar el `PanelTrazabilidad` para que cada paso inferido incluya un menú desplegable. Este debe explicar de forma explícita qué hace la regla usada y cómo se aplicó específicamente a esas líneas.
- **Estado Invalidez Detallado:** Mejorar la UI del `IndicadorResultado` para renderizar de forma amigable los motivos de fallo/error proveídos por Morocho.

---

## 🤖 Directrices Obligatorias para Agentes IA (Vibecoders)
Como asistentes de código, se debe respetar estrictamente el documento central `AGENTS.md` y maximizar la sinergia con el desarrollador humano:

1. **Protocolo Vibecoder (El Humano en el Bucle):**
   - **Feedback y Decisiones:** La principal ventaja de esta colaboración es que el humano puede dar retroalimentación visual y de UX. **Consulta explícitamente las decisiones importantes de diseño o lógica** que no estén detalladas en el prompt. No asumas.
   - **Checklist de Comprobaciones Manuales:** Al terminar tu intervención, entrega siempre al usuario una lista de QA manual (ej. probar el layout, navegación con `Tab`, lectores de pantalla, etc.) para que verifique aquello que la IA no puede ver ni emular.
2. **Estándares de Código:**
   - Usar Vue 3 (`<script setup lang="ts">`) y Tailwind CSS v4.
   - Todo debe pasar la validación estricta de tipos (`npm run type-check`).
3. **No Duplicación:** No reescribas o dupliques componentes de tus compañeros. Usa los tipos compartidos (`src/types/`) y respeta el rol de cada uno.
4. **Commits:** Asegúrate de hacer commits atómicos y claros con tus cambios.
