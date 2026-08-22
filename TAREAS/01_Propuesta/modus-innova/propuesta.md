# Validador y Tutor Interactivo de Cuantificadores y Silogismos Lógicos (QuantifiWeb)

**Equipo:** Equipo 4 — Modus Innova (QuantifiTech)  
**Integrantes:** Cristian (Sublíder), Danuska, Marlon, Guillermo, Noemí  
**Tema Asignado:** Cuantificadores Lógicos, Lógica de Predicados y Silogismos / Inferencias  

---

### 1. Descripción del Problema
En el aprendizaje de la Lógica Simbólica y Predicados, a los estudiantes universitarios les resulta especialmente difícil enfrentarse a dos conceptos fundamentales:

1. **Cuantificadores Lógicos ($\forall$ Universal y $\exists$ Existencial):**
   A los alumnos les cuesta evaluar el valor de verdad ($\text{Verdadero}$ o $\text{Falso}$) de proposiciones cuantificadas sobre un **Dominio de Discurso** finito (ej. $D = \{1, 2, 3, 4, 5\}$). Además, suelen confundirse al aplicar las **Leyes de Negación de Cuantificadores (De Morgan)**:
   $$\neg (\forall x P(x)) \equiv \exists x \neg P(x)$$
   $$\neg (\exists x P(x)) \equiv \forall x \neg P(x)$$
   y en comprender cómo un solo elemento en el dominio puede actuar como contraejemplo que invalide una afirmación universal.

2. **Inferencias Lógicas y Silogismos:**
   Les resulta difícil identificar si un argumento (compuesto por varias premisas y una conclusión) es **formalmente válido o es una falacia**. Asimismo, al intentar resolver ejercicios manuscritos, frecuentemente se confunden sobre **qué Regla de Inferencia aplicar** (*Modus Ponens*, *Modus Tollens*, *Silogismo Hipotético*, *Silogismo Disyuntivo*) y cómo justificar cada paso formal para llegar a la conclusión.

---

### 2. ¿Qué hará nuestro componente?
Nuestra herramienta web **QuantifiWeb** será una interfaz visual interactiva que integrará dos módulos funcionales explicativos y aplicativos en tiempo real:

1. **Módulo de Cuantificadores Lógicos (Lógica de Predicados):**
   * **Definición de Dominio y Predicados (Inputs):** El usuario ingresa un conjunto universo $D$ (ej. `1, 2, 3, 4, 5`) y la condición de su predicado $P(x)$ (ej. `"x es par"`).
   * **Evaluación en Dominio con Trazabilidad:** Al presionar **"🚀 Evaluar Cuantificador"**, el sistema evalúa la fórmula elemento por elemento dentro del dominio $D$, mostrando la tabla de trazabilidad ($P(1)=\text{F}$, $P(2)=\text{V}$, etc.), el resultado global (🟢 **VERDADERO** o 🔴 **FALSO**) y el contraejemplo o caso de éxito.
   * **Asistente de Negación (De Morgan):** Botón **"🔄 Negar Expresión"** que calcula automáticamente la proposición equivalente con el cuantificador opuesto y su negación interna.

2. **Módulo de Inferencias Lógicas y Silogismos:**
   * **Ingreso del Argumento (Inputs):** El usuario verá dos cajas de texto principales para ingresar la **Premisa 1** (ej. `p → q`) y la **Premisa 2** (ej. `p`), además de una caja de texto para la **Conclusión** (ej. `q`).
   * **Barra de Teclado Rápido de Símbolos:** Contará con una barra de **botones rápidos de símbolos lógicos** (`→`, `∧`, `∨`, `¬`, `∴`, `∀`, `∃`, `∈`) para facilitar la escritura sin cometer errores de tipeo.
   * **Verificación e Interacción Paso a Paso:** Al hacer clic en el botón **"🚀 Validar Inferencia"**:
     * **Si la inferencia es VÁLIDA:** El panel se iluminará en verde, mostrará un mensaje destacado como `🟢 ¡Argumento Válido!` y desplegará la explicación paso a paso indicando la regla exacta utilizada (ej. *"Se aplicó la regla Modus Ponens [MP] a partir de la Premisa 1 y Premisa 2"*).
     * **Si la inferencia es INVÁLIDA (Falacia):** El panel se pondrá de color rojo alertando `🔴 Argumento Inválido (Falacia)`, y mostrará un ejemplo de la vida real (contraejemplo) explicando por qué las premisas no garantizan esa conclusión.

3. **Modo Didáctico de Práctica ("Cargar Ejemplo"):**
   * Incluirá un botón de **"🎲 Cargar Ejemplo"** para que los alumnos que no tengan ejercicios a la mano puedan probar casos preescritos de Modus Ponens, Modus Tollens, Silogismos y Cuantificadores.

---

### 3. Boceto Visual (Wireframe)

A continuación se presenta la distribución estructurada de pantallas, componentes, entradas y paneles de resultado de la herramienta:

```
+-----------------------------------------------------------------------------------+
|  🧠 LÓGICA SIMBÓLICA GLOBAL  |  Equipo 3: Modus Innova — QuantifiWeb             |
+-----------------------------------------------------------------------------------+
|  [ 📘 1. APRENDE (Teoría Interactiva) ]   [ ✏️ 2. PRACTICA Y COMPRUEBA (Evaluador) ] |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  SECCIÓN SELECCIONADA: ✏️ PRACTICA Y COMPRUEBA                                     |
|                                                                                   |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │ 1. CONFIGURACIÓN DE CUANTIFICADORES Y DOMINIO D                             │  |
|  │ Dominio (D):    [ 1, 2, 3, 4, 5                                         ] │  |
|  │ Predicado P(x): [ x es número par                                       ] │  |
|  │ Fórmula:        [ ∀x P(x)                                               ] │  |
|  │ Símbolos:       [ ∀ ] [ ∃ ] [ ∈ ] [ → ] [ ∧ ] [ ∨ ] [ ¬ ] [ ∴ ] [ ≡ ]      │  |
|  │                                                                             │  |
|  │ [ 🚀 Evaluar Cuantificador ]  [ 🔄 Negar Expresión ]  [ 🎲 Cargar Ejemplo ] │  |
|  └─────────────────────────────────────────────────────────────────────────────┘  |
|                                                                                   |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │ 2. EVALUACIÓN Y TRAZABILIDAD PASO A PASO                                    │  |
|  │ STATUS: 🔴 PROPOSICIÓN FALSA                                                │  |
|  │ Detalle por Elemento en D = {1, 2, 3, 4, 5}:                                 │  |
|  │ - Para x = 1: P(1) es Falso (1 no es par) ❌ [CONTRAEJEMPLO HALLADO]         │  |
|  │ - Para x = 2: P(2) es Verdadero (2 es par) ✅                               │  |
|  │ - Para x = 3: P(3) es Falso (3 no es par) ❌                                 │  |
|  │ - Para x = 4: P(4) es Verdadero (4 es par) ✅                               │  |
|  │ Explicación: El cuantificador ∀ exige cumplimiento en el 100% del dominio.   │  |
|  │ Equivalente Negado (De Morgan): ∃x ¬P(x) ≡ "Existe al menos un x que NO es par"│
|  └─────────────────────────────────────────────────────────────────────────────┘  |
|                                                                                   |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │ 3. INGRESO Y VALIDADOR DE INFERENCIAS LÓGICAS (SILOGISMOS)                  │  |
|  │ Premisa 1 (P1):  [ p → q                                                  ] │  |
|  │ Premisa 2 (P2):  [ p                                                      ] │  |
|  │ Conclusión (∴):  [ q                                                      ] │  |
|  │ Símbolos:        [ → ] [ ∧ ] [ ∨ ] [ ¬ ] [ ∴ ]                              │  |
|  │                                                                             │  |
|  │ [ 🚀 Validar Inferencia ]                             [ 🎲 Cargar Ejemplo ] │  |
|  └─────────────────────────────────────────────────────────────────────────────┘  |
|                                                                                   |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │ 4. PANEL DE RESULTADO Y DEMOSTRACIÓN DE LA INFERENCIA                       │  |
|  │ STATUS: 🟢 ¡ARGUMENTO VÁLIDO!                                               │  |
|  │ Explicación Paso a Paso:                                                    │  |
|  │ - Paso 1: Tienes la implicación 'p → q' (Premisa 1).                        │  |
|  │ - Paso 2: Ocurre el antecedente 'p' (Premisa 2).                            │  |
|  │ - Regla Aplicada: MODUS PONENDO PONENS (MP).                                │  |
|  │ - Conclusión: Se deduce obligatoriamente 'q'.                               │  |
|  └─────────────────────────────────────────────────────────────────────────────┘  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```
