# Validador y Tutor Interactivo de Inferencias Lógicas

**Equipo:** Equipo 3 - *Modus Innova*  
**Integrantes:** Bernal, Olivera, Serrano, Llenque, Crisanto  
**Tema Asignado:** Inferencias Lógicas  

---

### 1. Descripción del Problema
A muchos estudiantes de Lógica Simbólica les resulta difícil identificar si un argumento (compuesto por varias premisas y una conclusión) es **formalmente válido o es una falacia**. Además, al intentar resolver ejercicios manuscritos, frecuentemente se confunden sobre **qué Regla de Inferencia aplicar** (Modus Ponens, Modus Tollens, Silogismo Hipotético, etc.) y cómo justificar cada paso para llegar a la conclusión.

---

### 2. ¿Qué hará nuestro componente?
Nuestra herramienta web será una interfaz visual interactiva que funcionará en dos fases paso a paso:

1. **Ingreso del Argumento (Inputs):**
   * El usuario verá dos cajas de texto principales para ingresar la **Premisa 1** (ej. `p → q`) y la **Premisa 2** (ej. `p`), además de una caja de texto para la **Conclusión** (ej. `q`).
   * Contará con una barra de **botones rápidos de símbolos lógicos** (`→`, `∧`, `∨`, `¬`, `∴`) para facilitar la escritura sin cometer errores de tipeo.

2. **Verificación e Interacción paso a paso:**
   * Al hacer clic en el botón **"🚀 Validar Inferencia"**:
     * **Si la inferencia es VÁLIDA:** El panel se iluminará en verde, mostrará un mensaje destacado como `🟢 ¡Argumento Válido!` y desplegará la explicación paso a paso indicando la regla exacta utilizada (ej. *"Se aplicó la regla Modus Ponens [MP] a partir de la Premisa 1 y Premisa 2"*).
     * **Si la inferencia es INVÁLIDA (Falacia):** El panel se pondrá de color rojo alertando `🔴 Argumento Inválido (Falacia)`, y mostrará un ejemplo de la vida real (contraejemplo) explicando por qué las premisas no garantizan esa conclusión.

3. **Modo Didáctico de Práctica ("Cargar Ejemplo"):**
   * Incluirá un botón de **"🎲 Cargar Ejemplo"** para que los alumnos que no tengan ejercicios a la mano puedan probar casos preescritos de Modus Ponens, Modus Tollens y Silogismos.

---

### 3. Boceto Visual (Wireframe)

A continuación se presenta el boceto gráfico de la interfaz de usuario diseñada para el componente web:

<img width="1376" height="768" alt="Interfaz" src="https://github.com/user-attachments/assets/140c355f-c9e3-4cb6-808e-85ce7251d2bf" />

+-----------------------------------------------------------------------------------+
|  🎯 PLATAFORMA LÓGICA SIMBÓLICA GLOBAL | Validador de Inferencias Lógicas        |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  1. INGRESA TUS PREMISAS Y CONCLUSIÓN                                             |
|                                                                                   |
|  Premisa 1:    [ p → q                                   ]                        |
|  Premisa 2:    [ p                                       ]                        |
|  Conclusión:   [ q                                       ]                        |
|                                                                                   |
|  Teclado Rápido:  [ → ]  [ ∧ ]  [ ∨ ]  [ ¬ ]  [ ∴ ]                               |
|                                                                                   |
|  [ 🚀 Validar Inferencia ]              [ 🎲 Cargar Ejemplo Didáctico ]           |
|                                                                                   |
| ================================================================================= |
|                                                                                   |
|  2. RESULTADO Y EXPLICACIÓN                                                       |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |  🟢 ¡ARGUMENTO VÁLIDO!                                                      |  |
|  |                                                                             |  |
|  |  Explicación Paso a Paso:                                                   |  |
|  |  - Paso 1: Tienes la relación condicional (p → q).                         |  |
|  |  - Paso 2: Se afirma el antecedente (p).                                   |  |
|  |  - Regla Aplicada: MODUS PONENS (MP).                                       |  |
|  |  - Resultado: La conclusión 'q' se deduce de forma obligatoria.            |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```
