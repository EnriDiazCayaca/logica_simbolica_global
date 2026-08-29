# Análisis del Módulo Parser / AST (Arom)

Este documento explica cómo funciona el **Análisis Sintáctico** del motor lógico: desde
el texto plano hasta el **Árbol de Sintaxis Abstracta (AST)** que alimenta al solver y,
ahora, a la visualización de nodos.

---

## 1. ¿Qué es el AST?

Un **AST (Abstract Syntax Tree)** es una representación en forma de árbol de una
expresión lógica. A diferencia del texto original, el árbol hace explícita la
**estructura** y la **precedencia** de los operadores.

Existen dos tipos de nodos (`src/lib/solver/types.ts`):

```ts
interface NodoVariable extends NodoBase {
  tipo: 'variable'
  nombre: string          // "P", "Q"...
}

interface NodoOperacion extends NodoBase {
  tipo: 'operacion'
  operador: Operador      // Y, O, NO, ENTONCES, ...
  izquierdo?: NodoExpresion  // Rama izquierda (binarios)
  derecho?: NodoExpresion    // Rama derecha (binarios y unarios)
}
```

- **Nodo variable** = *hoja* del árbol (sin hijos).
- **Nodo operación** = *rama* interna con uno o dos hijos.
  - `NO` es **unario**: sólo usa `derecho`.
  - El resto son **binarios**: usan `izquierdo` y `derecho`.

---

## 2. Fase 1 — Análisis Léxico (`tokenizar`)

El texto se limpia y se separa en **tokens** (`parser.ts:27`):

1. Se añaden espacios alrededor de `(` y `)` para facilitar el corte.
2. Se divide por espacios (`split(/\s+/)`).
3. Cada fragmento se clasifica en `VARIABLE`, `OPERADOR`, `PARENTESIS_IZQ` o `PARENTESIS_DER`.

Los operadores válidos se mapean a la enumeración `Operador` (líneas 13-22). Cualquier
palabra que no sea operador ni paréntesis se asume **variable** (línea 50).

```ts
tokenizar("P ENTONCES (Q O R)")
// → VARIABLE(P), OPERADOR(ENTONCES), PARENTESIS_IZQ,
//   VARIABLE(Q), OPERADOR(O), VARIABLE(R), PARENTESIS_DER
```

---

## 3. Fase 2 — Análisis Sintáctico (`construirAST` / `ASTParser`)

Se usa **descenso recursivo** con un puntero de posición (`posicion`) sobre la lista de
tokens (`parser.ts:64`). Las reglas siguen el orden de **precedencia** (menor a mayor):

```
1. ENTONCES  / SI_Y_SOLO_SI   (implicación / bicondicional)
2. O / O_EXCLUSIVA / NI / INCOMPATIBLE  (disyunciones)
3. Y                          (conjunción)
4. NO                         (negación, unaria y anidada)
5. ( ... )  y  variables      (átomos)
```

Cada método `parsearX` consume un nodo y, si el siguiente token es del operador de su
nivel, construye un `NodoOperacion` cuyo hijo izquierdo es lo ya parseado y el derecho
es una nueva llamada recursiva. Así se garantiza la asociatividad y precedencia sin
necesidad de una tabla separada.

### Ejemplo: `NO P ENTONCES Q`

```
parsearImplicacionBicondicional
  └─ parsearDisyunciones → parsearConjunciones → parsearNegacion
        reconoce NO  ⇒  NodoOperacion(NO, der: P)
  token = ENTONCES   ⇒  NodoOperacion(ENTONCES,
                            izq: NO(P),
                            der: Q)
```

Resultado (AST):

```
        ENTONCES (→)
        /        \
     NO (¬)       Q
      |
      P
```

### Ejemplo con paréntesis: `NO (P ENTONCES Q)`

El paréntesis fuerza a `parsearPrimario` a reiniciar desde
`parsearImplicacionBicondicional` dentro de él, de modo que `NO` queda como raíz:

```
        NO (¬)
         |
      ENTONCES (→)
      /        \
     P          Q
```

---

## 4. Ramas, hojas y recorrido

- **Hojas**: `NodoVariable` (sin hijos).
- **Ramas**: `NodoOperacion` con `izquierdo`/`derecho`.
- El recorrido natural es **preorden** (visitar la raíz, luego subárbol izquierdo, luego
  el derecho), que es exactamente como se construye.

Las utilidades de `src/lib/solver/astVisual.ts` recorren el árbol:
- `hijosDeNodo(n)` → devuelve `[izquierdo, derecho]` filtrando nulos.
- `contarNodos(n)` → total de nodos (hojas + ramas).
- `profundidadNodo(n)` → altura máxima (raíz = 1).
- `estadisticasNodo(n)` → `{ nodos, profundidad, variables, operadores }`.

---

## 5. Visualización (nuevocomponente `ArbolAST.vue`)

`ArbolAST.vue` toma las premisas y la conclusión, intenta `parsearExpresion` sobre cada
una (con `try/catch` para mostrar errores de sintaxis sin romper la UI) y dibuja un
**bosque** de árboles. Cada árbol usa `NodoArbol.vue` de forma **recursiva**:

- Un nodo operación renderiza un *chip* con el símbolo (¬, ∧, ∨, →, ↔, △, ↓, ↑), su
  nombre y su abreviatura, y luego un `<ul>` con sus hijos.
- Un nodo variable renderiza una hoja gris.
- Las **ramas** son líneas CSS (`::before`/`::after`) cuyo color hereda del operador
  padre mediante `currentColor`, de modo que cada nivel del árbol se distingue por color.

### Metadatos por operador (`META_OPERADOR`)

| Operador | Símbolo | Nombre | Color | Aridad |
|---|---|---|---|---|
| `Y` | ∧ | Conjunción | azul | 2 |
| `O` | ∨ | Disyunción | esmeralda | 2 |
| `O_EXCLUSIVA` | △ | Disyunción Exclusiva | ámbar | 2 |
| `NO` | ¬ | Negación | rojo | 1 |
| `ENTONCES` | → | Implicación | índigo | 2 |
| `SI_Y_SOLO_SI` | ↔ | Bicondicional | cian | 2 |
| `NI` | ↓ | Nor | fucsia | 2 |
| `INCOMPATIBLE` | ↑ | Nand | naranja | 2 |

---

## 6. Integración con el resto del motor

```
 texto ──tokenizar──▶ tokens ──construirAST──▶ AST
                                              │
                       ┌──────────────────────┼───────────────────────┐
                       ▼                      ▼                       ▼
                 demostrarConclusion   renderizarNodo (símbolos)  traducirNodoANatural
                 (solver.ts)           (astRenderer.ts)          (naturalTranslator.ts)
                                               │
                                               ▼
                                      ArbolAST.vue (visualización)
```

El AST es la **fuente única de verdad**: el solver lo evalúa, el traductor lo vuelve
lenguaje natural y el nuevo visualizador lo dibuja como árbol.
