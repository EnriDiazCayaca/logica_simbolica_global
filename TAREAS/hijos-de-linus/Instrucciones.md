# Manual de Uso — Módulo de Validez de Inferencias Lógicas

**Equipo:** Hijos de Linus  
**Versión:** 1.3  
**Fecha:** Septiembre 2026

---

### Tabla de Contenidos

1. [¿Qué es este módulo?](#1-qué-es-este-módulo)
2. [¿Para qué sirve?](#2-para-qué-sirve)
3. [¿Cómo se accede?](#3-cómo-se-accede)
4. [Pantalla principal: descripción general](#4-pantalla-principal-descripción-general)
5. [Pestaña 1 — Simbología Formal](#5-pestaña-1--simbología-formal)
6. [Teclado Simbólico](#6-teclado-simbólico)
7. [Ejemplos Rápidos](#7-ejemplos-rápidos)
8. [Pestaña 2 — Lenguaje Natural](#8-pestaña-2--lenguaje-natural)
9. [Pestaña 3 — Árbol Sintáctico (AST)](#9-pestaña-3--árbol-sintáctico-ast)
10. [Como interpretar el diagrama de Árbol](#10-como-interpretar-el-diagrama-de-árbol)
11. [Resultado de la Inferencia](#11-resultado-de-la-inferencia)
12. [Panel de Trazabilidad (Paso a Paso)](#12-panel-de-trazabilidad-paso-a-paso)
13. [Exportación Académica (Markdown y LaTeX)](#13-exportación-académica-markdown-y-latex)
14. [Historial de Ejercicios](#14-historial-de-ejercicios)
15. [Los 8 Operadores Lógicos: Referencia Completa](#15-los-8-operadores-lógicos-referencia-completa)
16. [Las 11 Reglas de Inferencia](#16-las-11-reglas-de-inferencia)
17. [Preguntas Frecuentes (FAQ)](#17-preguntas-frecuentes-faq)
18. [Glosario de Términos](#18-glosario-de-términos)

---

## 1. ¿Qué es este módulo?

El módulo **"Validez de Inferencias Lógicas"** es una herramienta interactiva desarrollada por el equipo **Hijos de Linus** que permite:

- Escribir argumentos lógicos (premisas + conclusión) en un formulario.
- Verificar si la conclusión se deduce válidamente de las premisas.
- Visualizar la estructura interna del argumento como un árbol jerárquico.
- Traducir los símbolos formales a lenguaje natural (español).
- Obtener una demostración paso a paso con las reglas lógicas aplicadas.
- Exportar la demostración en formato académico (Markdown o LaTeX).

En palabras simples: **es una calculadora de lógica proposicional** que te dice si tu argumento es correcto o no, y te explica por qué paso a paso.

---

## 2. ¿Para qué sirve?

| Uso | Ejemplo |
|-----|---------|
| **Estudiar lógica proposicional** | Verificar si un argumento es válido antes de entregar una tarea |
| **Aprender reglas de inferencia** | Entender qué regla se aplica en cada paso de una demostración |
| **Visualizar la estructura de fórmulas** | Ver cómo se descompone jerárquicamente una expresión lógica |
| **Traducir símbolos a texto** | Convertir fórmulas como `P ∧ Q → R` a oraciones en español |
| **Generar demostraciones formales** | Exportar un paso a paso en LaTeX para un trabajo académico |
| **Detectar falacias lógicas** | Saber por qué un argumento inválido falla y cómo corregirlo |

---

## 3. ¿Cómo se accede?

### Paso 1: Iniciar el servidor de desarrollo

Si eres desarrollador, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
npm run dev
```

El servidor arrancará en `http://localhost:5173`.

### Paso 2: Abrir el navegador

Abre tu navegador web (Chrome, Firefox, Edge, Safari) y ve a:

```
http://localhost:5173
```

### Paso 3: Navegar al módulo

Desde la página principal, haz clic en la sección o tarjeta de **"Inferencias Lógicas"** (o navega directamente a la ruta `/inferencias`).

---

## 4. Pantalla principal: descripción general

Al abrir el módulo verás la siguiente estructura:

```
┌─────────────────────────────────────────────────────────┐
│  [Volver] [Hijos de Linus]              [Historial (N)] │
│                                                         │
│  ◉ Validez de Inferencias Lógicas                       │
│    Ingresa premisas formales, visualiza el árbol...     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Simbología Formal] [Lenguaje Natural] [Árbol AST]     │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────────┐   │
│  │                     │  │  Resultado de la        |   │
│  │  Contenido de la    │  │  Inferencia             |   │
│  │  pestaña activa     │  │                         |   │
│  │                     │  │  Trazabilidad paso a    |   │
│  │                     │  │  paso con explicaciones |   │
│  │                     │  │  y exportación          |   │
│  └─────────────────────┘  └─────────────────────────┘   |
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Zona izquierda:** Contiene las 3 pestañas para interactuar con el argumento.  
**Zona derecha:** Muestra el resultado (válida/inválida) y la demostración paso a paso.

---

## 5. Pestaña 1 — Simbología Formal

Esta es la pestaña principal donde **escribes tu argumento lógico**.

### 5.1 Escribir Premisas

Las **premisas** son las afirmaciones de las partes de las cuales quieres deducir algo. Cada premisa va en una línea separada.

**Ejemplo:** Si quieres expresar "Si llueve, la calle se moja" y "Llueve", escribes:

```
P ENTONCES Q
P
```

Esto significa:
- Línea 1: Si P, entonces Q (P → Q)
- Línea 2: P es verdadero

> **Nota:** El campo de premisas muestra números de línea a la izquierda (1, 2, 3...) para facilitar la referencia.

### 5.2 Escribir la Conclusión

La **conclusión** es lo que quieres demostrar que se deduce de las premisas. Va en un solo campo debajo de las premisas.

**Ejemplo:** Para concluir que "Q" (la calle se moja):

```
∴ Q
```

El símbolo `∴` (por lo tanto) aparece automáticamente a la izquierda del campo.

### 5.3 Dos formas de escribir

Puedes escribir de **dos maneras equivalentes**:

| Forma matemática | Forma con palabras clave |
|---|---|
| `P → Q` | `P ENTONCES Q` |
| `P ∧ Q` | `P Y Q` |
| `P ∨ Q` | `P O Q` |
| `¬P` | `NO P` |
| `P ↔ Q` | `P SI_Y_SOLO_SI Q` |

El sistema acepta **ambas formas**. Si escribes símbolos matemáticos (→, ∧, ∨, ¬, ↔, △, ↓, ↑), el sistema los convierte automáticamente al formato interno.

### 5.4 Botón "Demostrar Inferencia"

Una vez escrito el argumento, haz clic en el botón negro **"Demostrar Inferencia →"** en la parte inferior del formulario. El sistema procesará tu argumento y mostrará el resultado en la columna derecha.

---

## 6. Teclado Simbólico

Debajo del formulario de entrada encontrarás un **teclado virtual** con botones para insertar símbolos. Esto es especialmente útil si no tienes símbolos en tu teclado.

### 6.1 Fila superior — Conectivos lógicos

| Botón | Símbolo | Nombre | Ejemplo de uso |
|-------|---------|--------|----------------|
| `¬` | ¬ | Negación (NO) | `¬P` = "No P" |
| `∧` | ∧ | Conjunción (Y) | `P ∧ Q` = "P y Q" |
| `∨` | ∨ | Disyunción (O) | `P ∨ Q` = "P o Q" |
| `△` | △ | Disyunción Exclusiva (XOR) | `P △ Q` = "P o Q, pero no ambos" |
| `→` | → | Implicación (ENTONCES) | `P → Q` = "Si P entonces Q" |
| `↔` | ↔ | Bicondicional (SI Y SOLO SI) | `P ↔ Q` = "P si y solo si Q" |
| `(` | ( | Paréntesis de apertura | Para agrupar |
| `)` | ) | Paréntesis de cierre | Para agrupar |

### 6.2 Fila inferior — Variables y acciones

| Botón | Función |
|-------|---------|
| `P`, `Q`, `R`, `S` | Variables proposicionales (grupo 1) |
| `A`, `B`, `C`, `D` | Variables proposicionales (grupo 2) |
| `Borrar` ← | Borra el carácter anterior al cursor |
| `Salto` ↵ | Inserta un salto de línea (solo en premisas) |

### 6.3 Cómo funciona la inserción

- Haz clic en el campo de **premisas** o **conclusión** donde quieras escribir.
- El cursor se posicionará en ese campo.
- Haz clic en cualquier botón del teclado virtual: el símbolo se insertará en la posición del cursor.
- Los conectivos binarios (∧, ∨, △, →, ↔) se insertan **con espacios automáticos** alrededor para mantener la legibilidad.

---

## 7. Ejemplos Rápidos

En la parte superior del formulario encontrarás **4 ejemplos predefinidos** que puedes cargar con un solo clic:

### Ejemplos válidos (de color verde)

| Nombre | Premisas | Conclusión | Tipo |
|--------|----------|------------|------|
| **Modus Ponens** | P → Q, P | Q | Válido |
| **Silogismo Hipotético** | P → Q, Q → R | P → R | Válido |
| **Dilema Constructivo** | P → Q, R → S, P ∨ R | Q ∨ S | Válido |

### Ejemplo inválido (de color ámbar)

| Nombre | Premisas | Conclusión | Tipo |
|--------|----------|------------|------|
| **Falacia Afirm. Consecuente** | P → Q, Q | P | Falacia |

**Para usar un ejemplo:** Haz clic en el botón del ejemplo. Los campos de premisas y conclusión se llenarán automáticamente. Luego haz clic en "Demostrar Inferencia".

---

## 8. Pestaña 2 — Lenguaje Natural

Esta pestaña **traduce tus fórmulas lógicas a oraciones en español** para facilitar la comprensión.

### 8.1 Asignar significado a las variables

En la parte superior verás tarjetas con cada variable detectada (P, Q, R, S, etc.). Cada una tiene un campo editable donde puedes escribir qué significa esa variable en contexto real.

**Valores por defecto:**

| Variable | Significado por defecto |
|----------|------------------------|
| P | llueve |
| Q | la calle se moja |
| R | el suelo está resbaloso |
| S | hay tráfico |

**Para personalizar:** Haz clic en el campo de texto junto a la variable y escribe el significado que desees. Por ejemplo, podrías cambiar P a "estudia mucho" y Q a "aprueba el examen".

### 8.2 Ver la traducción

Una vez asignados los significados, en la parte inferior aparecerá el **"Argumento Traducido en Prosa"**:

**Ejemplo** con las premisas `P → Q` y `P`, y conclusión `Q`:

> **Premisa 1:** Si llueve, entonces la calle se moja.  
> **Premisa 2:** Llueve.  
> **∴ Conclusión:** Por lo tanto, la calle se moja.

Esto te permite leer el argumento como una oración normal en español, sin símbolos.

---

## 9. Pestaña 3 — Árbol Sintáctico (AST)

Esta pestaña muestra la **estructura jerárquica** de tu argumento como un árbol visual. Es la función principal implementada por **Hijos de Linus**.

### 9.1 ¿Qué es un AST?

**AST** significa **Árbol de Sintaxis Abstracta** (Abstract Syntax Tree). Es una representación visual que muestra cómo se "descompone" una fórmula lógica en sus partes componentes.

Piensa en ello como un **árbol genealógico de la fórmula**: la raíz es la operación principal, y las ramas son las sub-fórmulas que componen cada parte.

### 9.2 Descripción de los elementos del árbol

#### Nodo raíz: "Demostración"
- Es el nodo superior oscuro con icono de red.
- Representa la deducción completa (todas las premisas + conclusión).
- De él salen ramas hacia cada premisa y la conclusión.

#### Ramas principales
- Cada rama principal representa una **proposición individual**:
  - `P1`, `P2`, etc. = Premisas
  - `∴ Conclusión` = La conclusión

#### Nodos de operador
- Son los rectángulos coloreados con un símbolo (¬, ∧, ∨, →, etc.).
- Cada color corresponde a un tipo de operador.
- Si un nodo tiene **dos hijos**, es un operador binario (como ∧ o →).
- Si tiene **un solo hijo**, es un operador unario (como ¬).

#### Hojas (variables)
- Son los nodos grises al final de las ramas.
- Representan las variables proposicionales (P, Q, R, etc.).
- No tienen hijos: son los "elementos más pequeños" de la fórmula.

### 9.3 Colores de los operadores

| Color | Operador | Símbolo | Ejemplo |
|-------|----------|---------|---------|
| 🔴 Rojo | Negación | ¬ | `¬P` |
| 🔵 Azul | Conjunción | ∧ | `P ∧ Q` |
| 🟢 Esmeralda | Disyunción | ∨ | `P ∨ Q` |
| 🟡 Ámbar | Disyunción Exclusiva | △ | `P △ Q` |
| 🟣 Índigo | Implicación | → | `P → Q` |
| 🩵 Cian | Bicondicional | ↔ | `P ↔ Q` |
| 🩷 Fucsia | Nor | ↓ | `P ↓ Q` |
| 🟠 Naranja | Nand | ↑ | `P ↑ Q` |

### 9.4 Leyenda de operadores

En la parte superior del árbol verás una **leyenda** con todos los operadores y sus colores. Esto te ayuda a identificar rápidamente qué tipo de conexión representa cada nodo.

### 9.5 Guía de interpretación

Debajo de la leyenda hay un panel azul claro con la **"Interpretación del árbol"** que explica:

- **Nodo raíz:** representa la deducción completa.
- **Ramas principales:** premisas individuales (P1, P2…) y conclusión (∴).
- **Nodos y hojas:** operadores lógicos como conectores y letras como variables.

### 9.6 Estadísticas del árbol

Debajo de la leyenda verás **etiquetas con estadísticas** del árbol actual:

| Estadística | Significado |
|-------------|-------------|
| **N proposiciones** | Número total de premisas + conclusión |
| **N nodos** | Cantidad total de elementos en el árbol |
| **prof. máx N** | Profundidad máxima (cuántos niveles tiene el árbol) |
| **N variables** | Cantidad de letras variables (P, Q, R, etc.) |
| **N conectivos** | Cantidad de operadores lógicos |

---

## 10. Como interpretar el diagrama de Árbol

### Ejemplo: `P → Q`, `P` ⊢ `Q`

El árbol se ve así (esquema simplificado):

```
              Demostración
            /      |       \
          P1      P2     ∴ Conclusión
          |       |         |
          →       P         Q
         / \
        P   Q
```

**Explicación:**

1. **Raíz "Demostración"** (nodo oscuro arriba): representa todo el argumento.
2. **Rama P1** (Premisa 1: `P → Q`):
   - Nodo `→` (índigo): el operador principal es "ENTONCES".
   - Hijos: `P` (izquierda) y `Q` (derecha).
3. **Rama P2** (Premisa 2: `P`):
   - Nodo `P` (gris): es una variable directa, sin operador.
4. **Rama ∴ Conclusión** (Conclusión: `Q`):
   - Nodo `Q` (gris): es una variable directa.

### Reglas de lectura

- **De arriba a abajo:** desde la operación principal hasta las variables base.
- **De izquierda a derecha:** en operadores binarios, el hijo izquierdo es la primera parte y el derecho la segunda.
- **Colores:** ayudan a identificar el tipo de operación rápidamente.
- **Líneas:** conectan cada nodo padre con sus hijos directos.

---

## 11. Resultado de la Inferencia

Después de hacer clic en "Demostrar Inferencia", en la columna derecha aparecerá un indicador con el resultado. Hay **4 posibles estados**:

### 11.1 Inferencia válida (Demostrada) ✅

- **Color:** Verde
- **Icono:** ✓ (check)
- **Significado:** La conclusión se deduce correctamente de las premisas. El argumento es formalmente válido.
- **Acción:** Puedes ver la demostración paso a paso en el panel de Trazabilidad.

### 11.2 Inferencia inválida (Refutada) ❌

- **Color:** Rojo
- **Icono:** ✗ (cruz)
- **Significado:** El argumento **no es válido**. Se encontró un contraejemplo que refuta la inferencia.
- **Acción:** El panel de Trazabilidad mostrará el **diagnóstico del fallo** con:
  - Una descripción del error lógico.
  - Una explicación de por qué falla el razonamiento.
  - Un **contraejemplo** con valores de verdad (V/F) para cada variable.
  - Una **sugerencia de corrección**.

### 11.3 Inferencia válida (Método indirecto requerido) 🔵

- **Color:** Índigo (azul oscuro)
- **Icono:** Brújula
- **Significado:** El argumento es válido, pero no se pudo demostrar por métodos directos (forward chaining). Requiere métodos como **Reducción al absurdo** o **Prueba condicional**.
- **Acción:** No hay demostración directa disponible, pero el diagnóstico indica que el argumento es válido.

### 11.4 Error de sintaxis o procesamiento 🟡

- **Color:** Ámbar (amarillo)
- **Icono:** ⚠ (triángulo de advertencia)
- **Significado:** Hubo un problema al evaluar la expresión. Puede ser una fórmula mal escrita, paréntesis desbalanceados, o un operador no reconocido.
- **Acción:** Revisa la sintaxis de tus fórmulas. Asegúrate de que los paréntesis estén balanceados y que uses operadores válidos.

---

## 12. Panel de Trazabilidad (Paso a Paso)

Debajo del indicador de resultado se encuentra el **Panel de Trazabilidad**, que es el corazón de la demostración.

### 12.1 Cuando la inferencia es válida

El panel muestra una **lista de pasos numerados** que forman la demostración formal. Cada paso contiene:

#### Estructura de cada paso:

```
┌─────────────────────────────────────────────┐
│  [Número de paso]  Regla Aplicada           │
│                    [Línea X] [Línea Y]      │
│                                             │
│  ∴ Fórmula deducida                         │
│                                             │
│  [¿Cómo se deduce?] ▼                       │
└─────────────────────────────────────────────┘
```

- **Número de paso:** La línea global en la demostración (premisas + pasos comparten numeración).
- **Regla aplicada:** El nombre de la regla lógica usada (ej. "Modus Ponendo Ponens").
- **Líneas referenciadas:** Las líneas base de las cuales se deduce este paso.
- **Fórmula deducida:** La expresión resultante de aplicar la regla.
- **Botón "¿Cómo se deduce?":** Al hacer clic, se despliega una explicación detallada.

#### Contenido del acordeón desplegado:

Al hacer clic en **"¿Cómo se deduce?"** de un paso, se muestran 3 secciones:

1. **Premisas base utilizadas:** Las líneas originales que se usaron para deducir este paso, con su expresión y rol.
2. **Regla aplicada:** El nombre completo de la regla, su alias, y una explicación de cómo funciona.
3. **Resultado:** La conclusión obtenida de aplicar la regla.

### 12.2 Cuando la inferencia es inválida

En lugar de pasos de demostración, el panel muestra un **diagnóstico formal** con 4 secciones:

#### 1. Análisis del Problema
Descripción del error detectado en el argumento.

#### 2. ¿Por qué falla este razonamiento?
Explicación detallada de la falacia o error lógico.

#### 3. Contraejemplo que refuta la validez
Un conjunto de valores de verdad (V o F) para cada variable que:
- Hace **todas las premisas verdaderas**.
- Pero la **conclusión resulta falsa**.

Esto prueba formalmente que el argumento no es válido.

**Ejemplo de contraejemplo:**

| Variable | Valor |
|----------|-------|
| P | Falso (F) |
| Q | Verdadero (V) |

Con esta asignación, todas las premisas son V pero la conclusión es F → el argumento es inválido.

#### 4. Sugerencia de corrección
Una propuesta de cómo modificar el argumento para que sea válido.

---

## 13. Exportación Académica (Markdown y LaTeX)

Cuando la inferencia es válida, en la parte superior del panel de Trazabilidad aparece una **barra de exportación** con 4 botones:

### 13.1 Copiar Markdown (Copiar MD)

Copia al portapapeles la demostración en formato Markdown con símbolos Unicode legibles. Ideal para:
- Pegar en un documento de Google Docs o Word.
- Compartir en foros o chats.
- Crear notas en Obsidian, Notion, etc.

### 13.2 Descargar Markdown (.md)

Descarga un archivo `demostracion_logica.md` con la demostración completa en formato Markdown.

### 13.3 Copiar LaTeX (Copiar LaTeX)

Copia al portapapeles un **documento LaTeX completo y autocompilable**. Incluye:
- Preámbulo estándar (`\documentclass`, `amsmath`, `amssymb`, `babel` en español).
- Sección de argumento con premisas numeradas.
- Demostración en entorno `align*` con numeración global.
- Símbolos convertidos a comandos LaTeX (ej. `\rightarrow`, `\land`, `\neg`).

### 13.4 Descargar LaTeX (.tex)

Descarga un archivo `demostracion_logica.tex` listo para compilar en:
- **Overleaf** (editor online de LaTeX, la forma más fácil).
- **TeXstudio**, **TeXShop**, o cualquier compilador local.
- Soporta pdfLaTeX, XeLaTeX y LuaLaTeX.

### Formato de la exportación Markdown

```markdown
### Demostración Formal de Inferencia Lógica

**Premisas:**

1. P → Q
2. P

**Conclusión:** ∴ Q

**Deducción formal paso a paso:**

3. Q *[Modus Ponendo Ponens (Línea 1, Línea 2)]*
```

### Formato de la exportación LaTeX

```latex
\documentclass[11pt]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[spanish,es-noshorthands]{babel}
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage[a4paper,margin=2.5cm]{geometry}

\title{Demostración Formal de Inferencia Lógica}

\begin{document}
\maketitle

\section*{Argumento}
\begin{enumerate}
  \item $P \rightarrow Q$
  \item $P$
\end{enumerate}

\section*{Demostración formal}
\begin{align*}
(1) \quad & P \rightarrow Q && \text{Premisa} \\
(2) \quad & P && \text{Premisa} \\
\therefore (3) \quad & Q && \text{[Modus Ponendo Ponens (1, 2)]}
\end{align*}

\end{document}
```

---

## 14. Historial de Ejercicios

En la esquina superior derecha del encabezado hay un botón **"Historial (N)"** que muestra los últimos 6 ejercicios que has resuelto.

### 14.1 Cómo funciona

- Cada vez que haces clic en "Demostrar Inferencia", el ejercicio se guarda automáticamente.
- Se almacenan solo los **últimos 6** ejercicios (los más recientes reemplazan a los antiguos).
- Los ejercicios duplicados se eliminan automáticamente.

### 14.2 Cómo restaurar un ejercicio

Haz clic en la tarjeta del ejercicio en el historial. Los campos de premisas y conclusión se llenarán automáticamente con los valores anteriores, y se procesará la inferencia de nuevo.

### 14.3 Cómo limpiar el historial

Haz clic en **"Limpiar"** (con icono de papelera) en la parte superior del panel de historial. Esto eliminará todos los ejercicios guardados.

### 14.4 Indicadores de color en el historial

| Color de etiqueta | Significado |
|-------------------|-------------|
| Verde (`Válida`) | La inferencia demostrada era válida |
| Índigo (`Válida (Ind.)`) | Válida pero requiere método indirecto |
| Rojo (`Inválida`) | La inferencia era inválida |

---

## 15. Los 8 Operadores Lógicos: Referencia Completa

### 15.1 Negación (¬) — NOT

- **Símbolo:** ¬
- **Palabra clave:** NO
- **Tipo:** Unario (solo afecta a una variable)
- **Significado:** Invierte el valor de verdad. Si P es verdadero, ¬P es falso.
- **Ejemplo:** `¬P` = "No es el caso de P"

### 15.2 Conjunción (∧) — AND

- **Símbolo:** ∧
- **Palabra clave:** Y
- **Tipo:** Binario (conecta dos variables)
- **Significado:** Solo es verdadero cuando **ambas** partes son verdaderas.
- **Ejemplo:** `P ∧ Q` = "P y Q"

### 15.3 Disyunción (∨) — OR

- **Símbolo:** ∨
- **Palabra clave:** O
- **Tipo:** Binario
- **Significado:** Es verdadero cuando **al menos una** de las partes es verdadera.
- **Ejemplo:** `P ∨ Q` = "P o Q" (o ambas)

### 15.4 Disyunción Exclusiva (△) — XOR

- **Símbolo:** △
- **Palabra clave:** O_EXCLUSIVA
- **Tipo:** Binario
- **Significado:** Es verdadero cuando **exactamente una** de las partes es verdadera, pero no ambas.
- **Ejemplo:** `P △ Q` = "P o Q, pero no ambos"

### 15.5 Implicación (→) — IF...THEN

- **Símbolo:** →
- **Palabra clave:** ENTONCES
- **Tipo:** Binario
- **Significado:** Es falso **solo cuando** la primera parte es verdadera y la segunda es falsa.
- **Ejemplo:** `P → Q` = "Si P entonces Q"
- **Nota:** Si P es falso, la implicación es verdadera sin importar Q.

### 15.6 Bicondicional (↔) — IF AND ONLY IF

- **Símbolo:** ↔
- **Palabra clave:** SI_Y_SOLO_SI
- **Tipo:** Binario
- **Significado:** Es verdadero cuando **ambas partes tienen el mismo valor** (ambas verdaderas o ambas falsas).
- **Ejemplo:** `P ↔ Q` = "P si y solo si Q"

### 15.7 Nor (↓) — NOR

- **Símbolo:** ↓
- **Palabra clave:** NI
- **Tipo:** Binario
- **Significado:** Es verdadero **solo cuando ambas partes son falsas**. Equivale a ¬(P ∨ Q).
- **Ejemplo:** `P ↓ Q` = "Ni P ni Q"

### 15.8 Nand (↑) — NAND

- **Símbolo:** ↑
- **Palabra clave:** INCOMPATIBLE
- **Tipo:** Binario
- **Significado:** Es falso **solo cuando ambas partes son verdaderas**. Equivale a ¬(P ∧ Q).
- **Ejemplo:** `P ↑ Q` = "P y Q son incompatibles"

---

## 16. Las 11 Reglas de Inferencia

El motor lógico implementa **11 reglas de inferencia** que usa automáticamente para construir la demostración:

### 16.1 Modus Ponendo Ponens (MPP)
- **Si:** P → Q y P
- **Entonces:** Q
- **En palabras:** Si la implicación es verdadera y el antecedente es verdadero, el consecuente es verdadero.

### 16.2 Modus Tollendo Tollens (MTT)
- **Si:** P → Q y ¬Q
- **Entonces:** ¬P
- **En palabras:** Si la implicación es verdadera y el consecuente es falso, el antecedente es falso.

### 16.3 Silogismo Disyuntivo (SD)
- **Si:** P ∨ Q y ¬P
- **Entonces:** Q
- **En palabras:** Si una de dos opciones es verdadera y una es falsa, la otra es verdadera.

### 16.4 Silogismo Disyuntivo Exclusivo (SDE)
- **Si:** P △ Q y P
- **Entonces:** ¬Q
- **En palabras:** Si exactamente una de dos opciones es verdadera y una es verdadera, la otra es falsa.

### 16.5 Silogismo Hipotético (SH)
- **Si:** P → Q y Q → R
- **Entonces:** P → R
- **En palabras:** Si de P se sigue Q, y de Q se sigue R, entonces de P se sigue R.

### 16.6 Simplificación
- **Si:** P ∧ Q
- **Entonces:** P (o Q)
- **En palabras:** De una conjunción se puede extraer cualquiera de sus partes.

### 16.7 Doble Negación
- **Si:** ¬¬P
- **Entonces:** P
- **En palabras:** Negar dos veces un proposition equivale a la proposición original.

### 16.8 Conjunción
- **Si:** P y Q (por separado)
- **Entonces:** P ∧ Q
- **En palabras:** Si dos proposiciones son verdaderas, su conjunción también lo es.

### 16.9 Dilema Constructivo
- **Si:** P → Q, R → S y P ∨ R
- **Entonces:** Q ∨ S
- **En palabras:** Si de P se sigue Q, de R se sigue S, y una de las dos (P o R) es verdadera, entonces una de las dos (Q o S) es verdadera.

### 16.10 Eliminación Bicondicional
- **Si:** P ↔ Q y P
- **Entonces:** Q
- **En palabras:** Si P es equivalente a Q y P es verdadero, entonces Q es verdadero.

### 16.11 Modus Ponens Bicondicional
- **Si:** P ↔ Q y Q
- **Entonces:** P
- **En palabras:** Si P es equivalente a Q y Q es verdadero, entonces P es verdadero.

---

## 17. Preguntas Frecuentes (FAQ)

### ¿Qué pasa si escribo una fórmula con errores de sintaxis?

El sistema muestra un **aviso de advertencia** en la pestaña del Árbol, indicando qué proposiciones contienen errores. Los errores comunes son:
- Paréntesis desbalanceados: `(P → Q` (falta `)`)
- Operadores consecutivos sin operandos: `P ∧ ∧ Q`
- Operador al inicio sin operando izquierdo: `∧ P Q`

Corrige la fórmula y vuelve a intentar.

### ¿Puedo usar minúsculas?

El sistema es **insensible a mayúsculas** internamente, pero se recomienda usar mayúsculas para las variables (P, Q, R) para mantener consistencia con la notación lógica estándar.

### ¿Qué significado tiene "Método indirecto requerido"?

Significa que el argumento es válido, pero el motor de demostración directa (forward chaining) no pudo encontrar una derivación paso a paso. Esto ocurre con argumentos que requieren técnicas como:
- **Reducción al absurdo:** asumir la negación de la conclusión y llegar a una contradicción.
- **Prueba condicional:** asumir una hipótesis temporal para demostrar una implicación.

El sistema reconoce que el argumento es válido (no hay contraejemplo) pero no puede mostrar la demostración completa.

### ¿Puedo usar más de 4 variables?

Sí. El teclado virtual ofrece 8 variables (P, Q, R, S, A, B, C, D), pero puedes escribir cualquier letra mayúscula como variable directamente en el campo de premisas.

### ¿Qué pasa con los operadores ↓ (Nor) y ↑ (Nand)?

Aunque están disponibles en el teclado virtual y el árbol los muestra con sus colores correspondientes, el motor de demostración automática no tiene reglas de inferencia dedicadas para estos operadores. Si tu argumento solo usa ↓ o ↑, puede que el sistema lo clasifique como "no demostrable directamente" aunque sea válido.

### ¿Cómo funciona el zoom del árbol?

En la parte inferior del árbol hay controles de zoom:
- **−** (Zoom Out): Reduce el tamaño del árbol (mínimo 60%).
- **+** (Zoom In): Aumenta el tamaño del árbol (máximo 160%).
- **↻** (Restablecer): Vuelve al tamaño normal (100%).

### ¿Cómo ver el árbol en pantalla completa?

Haz clic en el botón **"Ver a pantalla completa"** debajo del árbol. Se abrirá un modal con el árbol expandido. Para cerrarlo:
- Haz clic en el botón **✕** (esquina superior derecha).
- Haz clic fuera del panel (en el fondo oscuro).
- Presiona la tecla **Escape** en tu teclado.

### ¿Se guarda mi trabajo automáticamente?

El **historial** de ejercicios se guarda automáticamente en el navegador (localStorage). Si cierras el navegador y lo vuelves a abrir, los últimos 6 ejercicios seguirán disponibles. Sin embargo, esto es solo en tu navegador; no se sincroniza con otros dispositivos.

### ¿Puedo exportar un argumento inválido?

No. La barra de exportación (Markdown y LaTeX) solo aparece cuando la inferencia es **válida**. Para un argumento inválido, el panel muestra el diagnóstico y contraejemplo, pero no una demostración exportable.

---

## 18. Glosario de Términos

| Término | Definición simple |
|---------|-------------------|
| **Proposición** | Una oración que puede ser verdadera o falsa (ej. "Llueve"). |
| **Variable proposicional** | Una letra que representa una proposición (P, Q, R...). |
| **Premisa** | Una afirmación de la cual se parte para razonar. |
| **Conclusión** | Lo que se quiere demostrar a partir de las premisas. |
| **Conectivo lógico** | Un operador que conecta proposiciones (∧, ∨, →, ¬...). |
| **Inferencia** | El proceso de derivar una conclusión a partir de premisas. |
| **Argumento** | Un conjunto de premisas más una conclusión. |
| **Argumento válido** | Un argumento donde la conclusión se sigue necesariamente de las premisas. |
| **Argumento inválido** | Un argumento donde la conclusión NO se sigue de las premisas. |
| **Contraejemplo** | Una asignación de valores que muestra que el argumento es inválido. |
| **Falacia** | Un error de razonamiento que parece válido pero no lo es. |
| **AST (Árbol de Sintaxis Abstracta)** | Representación visual de la estructura jerárquica de una fórmula. |
| **Trazabilidad** | El registro paso a paso de cómo se derivó la conclusión. |
| **Modus Ponens** | Regla: de P → Q y P, se deduce Q. |
| **Modus Tollens** | Regla: de P → Q y ¬Q, se deduce ¬P. |
| **Silogismo** | Regla que encadena implicaciones o disyunciones. |
| **Demostración formal** | Una secuencia de pasos lógicos que prueba la validez de un argumento. |
| **Forward chaining** | Estrategia de demostración que aplica reglas "hacia adelante" desde las premisas. |
| **LaTeX** | Sistema de tipografía usado en documentos académicos de matemáticas. |
| **Markdown** | Formato simple de escritura para documentos de texto. |

---

## Créditos

Este módulo fue diseñado e implementado por el equipo **Hijos de Linus** cuyos integrantes estan conformados por:

- Altamirano Astupiñan Renato 
- Centurión Llatas Alex 
- Espinoza Orrego Piero Arom
- Mio Caballero Arnold André
- Morocho Lumbre Juan

---

> **Nota para desarrolladores:** Este manual está dirigido a usuarios finales. Si necesitas información técnica sobre la arquitectura del código, consulta los archivos `ANALISIS_AST.md` e `INFORME_MEJORAS.md` en esta misma carpeta.

