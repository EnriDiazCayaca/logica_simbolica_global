# Uso del Módulo: Demostrador de Inferencias Lógicas

**Equipo:** Hijos de Linus (Arom Espinoza, Juan Morocho, Arnold Mio, Alex Centurión, Renatto Altamirano)  
**Módulo:** Demostración Formal de Reglas de Inferencia, Trazabilidad Pedagógica y Diagnóstico con Contraejemplos (`/inferencias`)  
**Fecha:** 23 de Agosto de 2026

---

## 📖 Cómo funciona

El módulo permite ingresar un conjunto de premisas lógicas y una conclusión objetivo en notación simbólica formal o estándar para:

1. **Validar y Demostrar Deducciones (Forward Chaining + SAT Evaluator):**
   - Evalúa sistemáticamente las 11 reglas de deducción natural: Modus Ponendo Ponens, Modus Tollendo Tollens, Silogismo Disyuntivo, Silogismo Hipotético, Simplificación, Conjunción, Dilema Constructivo, Bicondicionales y **Silogismo Disyuntivo Exclusivo con Disyunción Fuerte (`△`)**.
   - Integra un evaluador semántico de combinaciones de verdad ($2^N$) para validar argumentos y detectar modelos de satisfacción.

2. **Diferenciación Rigurosa de 3 Estados de Validez:**
   - 🟢 **Inferencia válida (Demostrada):** Se completó la deducción mediante reglas formales directas.
   - 🔵 **Inferencia válida (Método indirecto requerido):** El argumento es semánticamente válido ($0$ contraejemplos), pero requiere derivación indirecta (Reducción al Absurdo o Prueba Condicional).
   - 🔴 **Inferencia inválida (Refutada por contraejemplo):** Se encontró una asignación de verdad concreta que hace verdaderas las premisas y falsa la conclusión.

3. **Trazabilidad Pedagógica y Desglose Particionado:**
   - Genera una enumeración formal $(1), (2), \dots \therefore (N)$ con badges de reglas.
   - Cada paso cuenta con un acordeón colapsable que explica:
     - **Premisas Base:** Con número de línea y rol lógico (ej. *Condicional base*, *Antecedente afirmado*).
     - **Regla Aplicada y Justificación:** Explicación semántica y causal.
     - **Deducción Resultante:** Proposición obtenida formalmente.

4. **Diagnóstico con Contraejemplos Matemáticos:**
   - Si el argumento es inválido o incurre en una falacia formal (Afirmación del Consecuente, Negación del Antecedente, Dilema Inverso), el sistema despliega el **contraejemplo exacto** (ej. $P=F, Q=V, R=F, S=F$) con la comprobación de verdad de cada premisa y la conclusión.

5. **Herramientas Académicas (Exportación & Historial):**
   - **Exportación en 1 Clic:** Botones rápidos para copiar la demostración formal en **LaTeX (`\begin{aligned} ... \end{aligned}`)** o **Markdown**.
   - **Historial Persistente (`localStorage`):** Almacenamiento local de las últimas demostraciones con restauración inmediata.

6. **Traductor a Lenguaje Natural:**
   - Pestaña complementaria para asociar enunciados cotidianos a las variables proposicionales ($P, Q, R, \dots$) y generar el argumento continuo en español.

---

## 🧪 Ejemplos

### Ejemplo 1: Cadena Multi-Paso (Transitividad y Conjunción)
* **Premisas:**
  ```text
  (P → Q) ∧ (Q → R)
  P
  ```
* **Conclusión:** `R`
* **Resultado:** `Inferencia válida (Demostrada)`
* **Demostración generada:**
  - *(3)* `P → Q` — Simplificación de (1)
  - *(4)* `Q → R` — Simplificación de (1)
  - *(5)* `P → R` — Silogismo Hipotético de (3, 4)
  - *(6)* `R` — Modus Ponendo Ponens de (5, 2)

### Ejemplo 2: Disyunción Fuerte / Exclusiva (`△`)
* **Premisas:**
  ```text
  P △ Q
  P
  ```
* **Conclusión:** `¬Q`
* **Resultado:** `Inferencia válida (Demostrada)`
* **Demostración generada:**
  - *(3)* `¬Q` — Silogismo Disyuntivo Exclusivo de (1, 2)

### Ejemplo 3: Dilema Constructivo Clásico
* **Premisas:**
  ```text
  P → Q
  R → S
  P ∨ R
  ```
* **Conclusión:** `Q ∨ S`
* **Resultado:** `Inferencia válida (Demostrada)`
* **Demostración generada:**
  - *(4)* `Q ∨ S` — Dilema Constructivo de (1, 2, 3)

### Ejemplo 4: Falacia del Dilema Inverso (Refutación por Contraejemplo)
* **Premisas:**
  ```text
  (P → Q) ∧ (R → S)
  Q ∨ S
  ```
* **Conclusión:** `P ∨ R`
* **Resultado:** `Inferencia inválida (Refutada por contraejemplo)`
* **Contraejemplo matemático:** $P = F, \ Q = V, \ R = F, \ S = F$
  - Premisa 1: $(F \to V) \land (F \to F) = V$
  - Premisa 2: $V \lor F = V$
  - Conclusión: $F \lor F = F$

---

## ⚙️ Operadores Soportados

| Operador | Símbolo | Sintaxis y Normalización Aceptada |
|---|---|---|
| Conjunción (Y) | $\wedge$ | `∧`, `^`, `&&`, `Y`, `\land` |
| Disyunción Inclusiva (O) | $\vee$ | `∨`, `\|\|`, `O`, `v`, `\lor` |
| Disyunción Fuerte / Exclusiva | $\triangle$ | `△`, `∆`, `▲`, `⊕`, `⊻`, `O_EXCLUSIVA` |
| Negación (NO) | $\neg$ | `¬`, `~`, `!`, `NO`, `\neg` |
| Condicional (ENTONCES) | $\rightarrow$ | `→`, `->`, `=>`, `⟹`, `ENTONCES`, `\to` |
| Bicondicional (SI Y SOLO SI) | $\leftrightarrow$ | `↔`, `<->`, `<=>`, `⟺`, `SI_Y_SOLO_SI`, `\leftrightarrow` |

---

## ⚠️ Limitaciones y Alcance
- **Dominio:** Lógica proposicional de primer orden con conectivos clásicos y disyunción exclusiva. Los cuantificadores de predicados ($\forall, \exists$) corresponden al módulo de *Modus Innova*.
- **Profundidad:** El demostrador ejecuta hasta 12 iteraciones de *Forward Chaining* exhaustivo. Si un argumento es válido pero requiere suposiciones auxiliares, el sistema lo identifica como `no_demostrable_directa` en lugar de clasificarlo erróneamente como inválido.

---

## ✅ Verificación de Calidad y Tests
- **Tests Automatizados:** **111 tests pasando al 100%** en Vitest (`npm test`).
- **Verificación Estricta de Tipos:** TypeScript estricto con `vue-tsc --noEmit` (**0 errores**).
- **Build de Producción:** Compilación optimizada con Vite (**0 warnings**).
