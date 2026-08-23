# Uso del Módulo: Demostrador de Inferencias Lógicas

**Equipo:** Hijos de Linus (Arom, Morocho, Mio, Alex)  
**Módulo:** Demostración Formal de Reglas de Inferencia y Trazabilidad Pedagógica (`/inferencias`)

---

## 📖 Cómo funciona

El módulo permite ingresar un conjunto de premisas lógicas y una conclusión objetivo en lenguaje formal o simbólico para:
1. **Validar y Demostrar Deducciones:** Aplica un motor deductivo (*Forward Chaining*) que evalúa sistemáticamente reglas de inferencia (Modus Ponens, Modus Tollens, Silogismo Disyuntivo, Silogismo Hipotético, Simplificación, Conjunción, Dilema Constructivo y Bicondicionales).
2. **Trazabilidad Pedagógica y Desglose Particionado:** En lugar de mostrar solo el resultado final, genera un desglose paso a paso donde cada inferencia muestra:
   - **Premisas Base:** Con su número de línea y rol lógico (ej. *Condicional base*, *Antecedente afirmado*).
   - **Regla Aplicada y Justificación:** Explicación semántica basada en valores de verdad y necesidad lógica.
   - **Deducción Resultante:** Proposición obtenida formalmente en ese paso.
3. **Diagnóstico Estructurado de Inferencias Inválidas:** Si el argumento no es válido o incurre en una falacia formal (como la Afirmación del Consecuente o Negación del Antecedente), el panel derecho se transforma en un **Analizador y Diagnóstico de la Demostración**, explicando:
   - *Análisis de las premisas analizadas.*
   - *Por qué falla el razonamiento.*
   - *Cómo corregirlo o deducirlo válidamente.*
4. **Traductor Bidireccional a Lenguaje Natural:** Pestaña complementaria que interpreta las fórmulas simbólicas a proposiciones en lenguaje natural inteligible.

---

## 🧪 Ejemplos

### Ejemplo 1: Modus Ponendo Ponens (MPP)
* **Premisas:**
  ```text
  P ENTONCES Q
  P
  ```
* **Conclusión:** `Q`
* **Resultado:** `Inferencia válida`
* **Trazabilidad generada:**
  - *Paso 1 (MPP):* A partir de Línea 1 (`P → Q`) y Línea 2 (`P`), aplicando Modus Ponendo Ponens se deduce necesariamente que `Q` es verdadero.

### Ejemplo 2: Cadena Multi-paso (Silogismo Hipotético + Modus Ponens)
* **Premisas:**
  ```text
  P ENTONCES Q
  Q ENTONCES R
  P
  ```
* **Conclusión:** `R`
* **Resultado:** `Inferencia válida`
* **Trazabilidad generada:**
  - *Paso 1 (MPP):* De Línea 1 (`P → Q`) y Línea 3 (`P`) se deduce Línea 4: `Q`.
  - *Paso 2 (MPP):* De Línea 2 (`Q → R`) y Línea 4 (`Q`) se deduce la conclusión final: `R`.

### Ejemplo 3: Modus Ponens Bicondicional
* **Premisas:**
  ```text
  P SI_Y_SOLO_SI Q
  P
  ```
* **Conclusión:** `Q`
* **Resultado:** `Inferencia válida`
* **Trazabilidad generada:**
  - *Paso 1 (MPB):* Al ser `P ↔ Q` un bicondicional y conocerse `P`, se concluye de forma directa `Q`.

### Ejemplo 4: Diagnóstico de Falacia (Afirmación del Consecuente)
* **Premisas:**
  ```text
  P ENTONCES Q
  Q
  ```
* **Conclusión:** `P`
* **Resultado:** `Inferencia inválida`
* **Diagnóstico en Panel:**
  - **Tipo de Fallo:** Falacia de Afirmación del Consecuente.
  - **Por qué falla:** Tener `P → Q` y afirmar `Q` no garantiza `P`. El condicional indica qué pasa si `P` ocurre, pero `Q` podría ser verdadero por otras causas independientes.
  - **Sugerencia:** Afirmar el antecedente `P` para obtener `Q` o proporcionar la premisa condicional inversa `Q → P`.

---

## ⚙️ Operadores Soportados

| Operador | Símbolo | Sintaxis Aceptada |
|---|---|---|
| Conjunción (Y) | $\wedge$ | `Y`, `^`, `&`, `\land` |
| Disyunción (O) | $\vee$ | `O`, `v`, `V`, `\|`, `\lor` |
| Negación (NO) | $\neg$ | `NO`, `~`, `!`, `\neg` |
| Condicional (ENTONCES) | $\rightarrow$ | `ENTONCES`, `->`, `=>`, `\to` |
| Bicondicional (SI Y SOLO SI) | $\leftrightarrow$ | `SI_Y_SOLO_SI`, `<->`, `<=>`, `\leftrightarrow` |

---

## ⚠️ Limitaciones y Alcance
- **Lógica Proposicional:** El motor está enfocado en lógica proposicional de primer orden con conectivos estándar. Las fórmulas con cuantificadores de predicados ($\forall, \exists$) pertenecen al módulo hermano de *Modus Innova*.
- **Profundidad de Búsqueda:** El demostrador ejecuta hasta 12 iteraciones de encadenamiento hacia adelante exhaustivo (*Forward Chaining*), suficiente para cualquier ejercicio deductivo formal de la asignatura.
- **Formato de Variables:** Admite identificadores alfanuméricos simples (ej. `P`, `Q`, `R`, `S`, `p1`, `q_2`).

---

## ✅ Verificación de Calidad y Tests
- **Tests Unitarios y de Integración:** 91 pruebas automatizadas pasando con Vitest (`npm test`).
- **Verificación Estricta de Tipos:** TypeScript 0 errores (`npm run type-check`).
- **Build de Producción:** Validado exitosamente con Vite (`npm run build`).
