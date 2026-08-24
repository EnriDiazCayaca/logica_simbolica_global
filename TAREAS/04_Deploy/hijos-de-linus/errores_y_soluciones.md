# 🛠️ Registro de Errores, Diagnósticos y Soluciones — Los Hijos de Linus

**Equipo:** Hijos de Linus (Arom Espinoza, Juan Morocho, Arnold Mio, Alex Centurión, Renatto Altamirano)  
**Módulo:** Demostración Formal de Reglas de Inferencia y Trazabilidad Pedagógica (`/inferencias`)  
**Fecha de Actualización:** 23 de Agosto de 2026  
**Estado General:** ✅ **100% de Errores Documentados y Solucionados (111/111 Tests Pasando)**

---

## 📑 Resumen Ejecutivo

Durante las fases de integración, pruebas de estrés y validación con usuarios reales, se identificaron y resolvieron **8 incidencias críticas y de experiencia de usuario**. A continuación se detalla cada problema, su causa raíz, la solución implementada y su estado de verificación.

---

## 1. 🛑 Contradicción Semántica: Falso Positivo de "Inferencia Inválida" en Argumentos Válidos con Prueba Indirecta

* **Síntoma:** Al evaluar argumentos válidos que requieren demostración indirecta (Reducción al Absurdo / Prueba Condicional), el sistema mostraba el banner rojo *"Inferencia inválida"*, mientras que el diagnóstico interno contradecía diciendo *"El argumento es semánticamente válido pero no pudo derivarse por encadenamiento directo"*.
* **Causa Raíz:** El motor clasificaba binariamente todo lo que no pudiera derivar hacia adelante (*forward-chaining*) como "inválido", sin verificar la existencia real de contraejemplos.
* **Solución Implementada:**
  - Se implementó un solucionador semántico exhaustivo por tablas de verdad ($2^N$ combinaciones en `encontrarContraejemplo`).
  - Se separó el estado global del argumento en **3 estados claros e independientes**:
    1. `valida` (*Demostrada con reglas básicas* - Banner Verde).
    2. `no_demostrable_directa` (*Válida semánticamente, pero requiere método indirecto/RAA* - Banner Índigo).
    3. `invalida` (*Refutada formalmente por contraejemplo matemático* - Banner Rojo).
* **Estado:** ✅ **SOLUCIONADO** (`IndicadorResultado.vue`, `solver.ts`, `types/inferencias.ts`).

---

## 2. 🔍 Ausencia de Contraejemplos Formales en Argumentos Inválidos y Falacias

* **Síntoma:** Si un argumento era inválido (ej. Falacia del Dilema Inverso `(P → Q) ∧ (R → S), Q ∨ S ⊢ P ∨ R`), el sistema informaba que no era válido pero no explicaba por qué ni entregaba una prueba matemática.
* **Causa Raíz:** No existía un evaluador de modelos de satisfacción que extrajera una asignación de verdad concreta que hiciera verdaderas las premisas y falsa la conclusión.
* **Solución Implementada:**
  - Se diseñó la función `encontrarContraejemplo(premisas, conclusion)` que evalúa exhaustivamente el árbol de verdad.
  - En `PanelTrazabilidad.vue` se agregó una tarjeta de diagnóstico formal destacada en rojo con el contraejemplo exacto (ej. $P=F, Q=V, R=F, S=F$) y la verificación paso a paso de cada premisa y conclusión.
* **Estado:** ✅ **SOLUCIONADO** (`solver.ts`, `PanelTrazabilidad.vue`).

---

## 3. 🔺 Soporte y Semántica de la Disyunción Fuerte / Exclusiva (`△` / XOR)

* **Síntoma:** El sistema no soportaba el conectivo de disyunción fuerte ($\triangle$), impidiendo resolver silogismos exclusivos como $P \triangle Q, P \vdash \neg Q$.
* **Causa Raíz:** El parser y las reglas de inferencia solo contemplaban la disyunción inclusiva ($\lor$).
* **Solución Implementada:**
  - Se integró el operador `O_EXCLUSIVA` y la regla formal `SILOGISMO_DISYUNTIVO_EXCLUSIVO` ($A \triangle B, A \vdash \neg B$ y $A \triangle B, \neg A \vdash B$).
  - Se normalizaron símbolos de entrada: `△`, `∆`, `▲`, `⊕`, `⊻`.
  - Se agregaron las traducciones pedagógicas en `translations.ts` y `descriptionGenerator.ts`.
* **Estado:** ✅ **SOLUCIONADO** (`solver.ts`, `FormularioInferencia.vue`, `translations.ts`).

---

## 4. 📱 Desbordamiento y Botones Huérfanos en Teclado Móvil

* **Síntoma:** En pantallas móviles estrechas (360px–390px), el teclado virtual se desbordaba en 3 filas asimétricas, dejando un único botón huérfano en la segunda y tercera línea.
* **Causa Raíz:** Uso de contenedores flexibles con `flex-wrap` y anchos variables por botón.
* **Solución Implementada:**
  - Se estructuró el teclado en un **CSS Grid fijo estricto de exactamente 2 filas**:
    - **Fila 1 (Grid 8 columnas):** `¬`, `∧`, `∨`, `△`, `→`, `↔`, `(`, `)`. Es matemáticamente imposible que un botón desborde.
    - **Fila 2 (Flex horizontal):** `P, Q, R, S | A, B, C, D` a la izquierda y `↵ Salto` a la derecha.
* **Estado:** ✅ **SOLUCIONADO** (`FormularioInferencia.vue`).

---

## 5. ⌨️ Apertura Involuntaria del Teclado Nativo Móvil (Soft Keyboard)

* **Síntoma:** Al tocar cualquier botón del teclado virtual en Android o iOS, se forzaba el foco en el `<textarea>`, abriendo el teclado nativo del sistema operativo (Gboard/Samsung Keyboard) y tapando la interfaz.
* **Causa Raíz:** Llamada forzada a `inputEl.focus()` tras cada inserción de símbolo.
* **Solución Implementada:**
  - Se añadió detección táctil (`'ontouchstart' in window || navigator.maxTouchPoints > 0`).
  - En dispositivos móviles se actualiza la posición del cursor mediante `setSelectionRange()` **sin invocar `.focus()`**, manteniendo el teclado del teléfono oculto mientras se usan los botones virtuales.
* **Estado:** ✅ **SOLUCIONADO** (`FormularioInferencia.vue`).

---

## 6. 🔤 Espaciado Automático Inconsistente en Paréntesis y Variables

* **Síntoma:** Los paréntesis insertaban espacios automáticos indeseados (ej. `( P → Q )`), ensuciando las fórmulas.
* **Causa Raíz:** Una regla de espaciado genérica trataba a los paréntesis como conectores binarios con espacios antes y después.
* **Solución Implementada:**
  - Se definió una lista estricta `CONECTIVOS_CON_ESPACIO = ['∧', '∨', '△', '→', '↔']`.
  - Paréntesis `(`, `)`, negación `¬`, variables (`P`, `Q`, etc.) y salto de línea no insertan ningún espacio adicional.
  - Al escribir `(`, `P`, `→`, `Q`, `)` se genera limpiamente `(P → Q)`.
* **Estado:** ✅ **SOLUCIONADO** (`FormularioInferencia.vue`).

---

## 7. ⚠️ Desplazamiento Visual por Banner de Linter en Tiempo Real

* **Síntoma:** Un cuadro amarillo de "Aviso de sintaxis" aparecía dinámicamente mientras el usuario escribía fórmulas incompletas, empujando los botones hacia abajo y restando espacio.
* **Causa Raíz:** Renderizado condicional reactivo en tiempo real (`v-if="advertenciasSintaxis.length > 0"`).
* **Solución Implementada:**
  - Se eliminó el cuadro flotante intrusivo.
  - La validación de sintaxis ahora se realiza de forma limpia y consolidada al presionar **"Demostrar Inferencia"**, reportándose en el panel de resultados sin alterar el layout durante la edición.
* **Estado:** ✅ **SOLUCIONADO** (`FormularioInferencia.vue`).

---

## 8. 🔠 Escala y Redimensionamiento Dispar de Glifos Unicode en Android

* **Síntoma:** Los símbolos lógicos (`∧`, `∨`, `△`, `→`, `↔`) se veían diminutos o cambiaban de tamaño al añadir o quitar espacios.
* **Causa Raíz:** Inconsistencia de fallback de fuentes monoespaciadas en navegadores móviles (Roboto Mono carece de glifos matemáticos y caía en fuentes con diferente baseline y escala).
* **Solución Implementada:**
  - Estandarización a `text-base` (16px) con `leading-relaxed` y `font-mono` en los inputs, garantizando que todos los glifos Unicode mantengan escala uniforme y evitando el zoom automático en iOS/Android.
  - Botonera con tamaño fijo y `leading-none`.
* **Estado:** ✅ **SOLUCIONADO** (`FormularioInferencia.vue`).

---

## 📊 Matriz de Estado Final

| Incidencia / Característica | Módulo Afectado | Detección | Estado | Verificación |
|---|---|---|---|---|
| Falso positivo en pruebas indirectas | Motor / UI | Pruebas de integración | ✅ Resuelto | Test unitario en `IndicadorResultado.test.ts` |
| Falta de contraejemplos matemáticos | Motor / Trazabilidad | Casos de prueba | ✅ Resuelto | Test de modelo semántico en `solver.test.ts` |
| Soporte de Disyunción Fuerte (`△`) | Parser / Motor / UI | Requerimiento pedagógico | ✅ Resuelto | 3 tests específicos de SDE en `solver.test.ts` |
| Desbordamiento teclado móvil | UI | Pruebas en Android | ✅ Resuelto | CSS Grid 8 columnas validado |
| Popup de teclado nativo en móvil | UI | Pruebas táctiles | ✅ Resuelto | Detección táctil sin focus forzado |
| Espacios en paréntesis | UI | QA Humano | ✅ Resuelto | Reglas deterministas en `insertarSimbolo` |
| Desplazamiento por linter reactivo | UI | QA Humano | ✅ Resuelto | Validación en evento submit |
| Tamaño dispar de símbolos | UI | Pruebas móviles | ✅ Resuelto | Escala tipográfica normalizada (`text-base`) |
