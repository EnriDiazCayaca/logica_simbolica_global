# 📋 Informe de Mejora — Visualizador de Árbol AST (Equipo «Los Hijos de Linus»)

> **Alcance:** Documentación completa de todas las mejoras implementadas en el módulo de
> inferencias lógicas: análisis del parser AST, nuevo componente de visualización, nueva
> pestaña «Árbol de Nodos», rediseño del módulo y buenas prácticas de programación aplicadas.
>
> **Fecha:** 2026-08-29 · **Estado:** ✅ Completado y validado

---

## 1. Objetivo

Dotar al demostrador de inferencias de una forma de **inspeccionar visualmente la
estructura interna** de las proposiciones (el AST), además de las vistas existentes de
simbología formal y lenguaje natural, y mejorar el diseño general siguiendo buenas
prácticas de programación.

---

## 2. Análisis del módulo Parser / AST

El motor lógico «Arom» transforma texto en un **Árbol de Sintaxis Abstracta** en dos fases
(`src/lib/solver/parser.ts`):

### 2.1. Fase léxica — `tokenizar`
Separa el texto en tokens (`VARIABLE`, `OPERADOR`, `PARENTESIS_IZQ`, `PARENTESIS_DER`).
Los operadores válidos se mapean a la enumeración `Operador`; cualquier otro fragmento se
asume variable.

### 2.2. Fase sintáctica — `construirAST` (descenso recursivo)
La clase `ASTParser` recorre los tokens con un puntero de posición y construye el árbol
respetando la **precedencia**:

```
ENTONCES / SI_Y_SOLO_SI  →  O / O_EXCLUSIVA / NI / INCOMPATIBLE
→  Y  →  NO (unario)  →  ( ) y variables
```

### 2.3. Nodos y ramas (`src/lib/solver/types.ts`)
- **`NodoVariable`** = *hoja* (sin hijos).
- **`NodoOperacion`** = *rama* con `izquierdo`/`derecho`. `NO` es unario (sólo `derecho`).

Ejemplo `NO (P ENTONCES Q)`:

```
        NO (¬)
         │
     ENTONCES (→)
     /        \
    P          Q
```

---

## 3. Mejoras implementadas

### 3.1. Núcleo reutilizable — `src/lib/solver/astVisual.ts` (nuevo)
Centraliza metadatos y utilidades, evitando duplicar lógica en la UI:

| Utilidad | Propósito |
|---|---|
| `META_OPERADOR` | Símbolo, nombre, abreviatura, color y aridad por operador (fuente única de verdad). |
| `COLOR_NODO` / `COLOR_RAMA` | Paletas de Tailwind por familia de operador (clases literales → Tailwind las detecta). |
| `hijosDeNodo(n)` | Devuelve `[izquierdo, derecho]` filtrando nulos. |
| `contarNodos(n)` / `profundidadNodo(n)` | Métricas del subárbol. |
| `estadisticasNodo(n)` | `{ nodos, profundidad, variables, operadores }`. |

### 3.2. Componente nodo recursivo — `src/components/inferencias/NodoArbol.vue` (nuevo)
Renderiza un nodo y, si tiene hijos, se invoca **recursivamente** para dibujar las ramas.
Cada nodo es un *chip* con el conectivo/variable y su etiqueta («raíz», «izq», «der», «hijo»).

### 3.3. Bosque visual — `src/components/inferencias/ArbolAST.vue` (nuevo)
- Parsea cada premisa y la conclusión con `try/catch` (no rompe la UI si hay error de sintaxis).
- Muestra por árbol: etiqueta (`P1`, `∴ Conclusión`), fórmula canónica (`renderizarNodo`),
  estadísticas y el árbol visual con scroll horizontal.
- Incluye **leyenda** de los 8 operadores y resalta la conclusión con borde índigo.

### 3.4. Nueva pestaña — `src/pages/inferencias/index.vue` (modificado)
Se añadió la pestaña **🌳 Árbol de Nodos** (`TreePine`) junto a «Simbología Formal» y
«Lenguaje Natural», dentro de un *segmented control* rediseñado con iconos.

### 3.5. Rediseño del módulo (buenas prácticas de UI)
- Encabezado con insignia de gradiente e icono (`Network`).
- *Segmented control* accesible, con estados activo/inactivo y `whitespace-nowrap`.
- Colores semánticos por conectivo (¬ rojo, ∧ azul, → índigo, etc.) coherentes en todo el árbol.

### 3.6. Pruebas — `src/lib/solver/astVisual.test.ts` (nuevo)
4 casos que validan conteo de nodos, aridad de `NO`, precedencia con paréntesis y estadísticas.

---

## 4. Buenas prácticas de programación aplicadas

1. **Separación de responsabilidades (modularidad).** La lógica de metadatos/recorrido vive
   en `astVisual.ts` (motor), desacoplada de la presentación (`ArbolAST.vue` / `NodoArbol.vue`).
2. **Componente recursivo reutilizable.** `NodoArbol` se auto-referencia, evitando bucles
   manuales y duplicación de marcado para cada nivel de profundidad.
3. **Tipado estricto (TypeScript).** Sin `any`; tipos derivados de `NodoExpresion` /
   `Operador` ya existentes. `estadisticasNodo` devuelve un tipo explícito `EstadisticasAST`.
4. **Fuente única de verdad.** `META_OPERADOR` y las paletas de color se definen una vez y se
   consumen en leyenda, nodos y ramas.
5. **Clases Tailwind literales.** Las paletas se escriben como cadenas completas
   (`'bg-blue-50 border-blue-300 text-blue-700'`) para que el escáner de Tailwind v4 las genere.
6. **Manejo defensivo de errores.** `ArbolAST` captura excepciones del parser y muestra el
   mensaje en lugar de romper la vista.
7. **Accesibilidad y responsividad.** Botones con `cursor-pointer`, `whitespace-nowrap`,
   scroll horizontal en árboles anchos y `:deep()` correcto para que los conectores CSS
   alcancen los `<ul>` renderizados dentro del componente hijo.
8. **Pruebas automatizadas.** Cobertura de la nueva lógica pura (`astVisual`) con Vitest.

---

## 5. Validación

| Comando | Resultado |
|---|---|
| `npm run type-check` (`vue-tsc --noEmit`) | ✅ Sin errores |
| `npm test` (Vitest) | ✅ 117 tests (incluye los 4 nuevos) |
| `npm run build` | ✅ Build de producción exitoso |

---

## 6. Checklist de verificación manual (QA humano)

- [ ] La pestaña «Árbol de Nodos» aparece entre «Lenguaje Natural» y el borde del control.
- [ ] Las ramas conectan padres e hijos sin solaparse.
- [ ] El color de cada nodo/rama coincide con su conectivo.
- [ ] La conclusión se resalta con borde índigo.
- [ ] Con `NO (P → Q)` la raíz es `NO` y `→` es hijo (precedencia correcta).
- [ ] Navegación por `Tab` alcanza los botones de pestaña y el formulario.
- [ ] Redimensionar en móvil no rompe el árbol (scroll horizontal dentro de cada tarjeta).
- [ ] Una fórmula con sintaxis inválida muestra un aviso en rojo sin colapsar la página.

---

## 7. Archivos involucrados

| Archivo | Acción |
|---|---|
| `src/lib/solver/astVisual.ts` | **Nuevo** — metadatos y utilidades de recorrido. |
| `src/components/inferencias/NodoArbol.vue` | **Nuevo** — nodo recursivo del árbol. |
| `src/components/inferencias/ArbolAST.vue` | **Nuevo** — bosque de árboles + leyenda + stats. |
| `src/lib/solver/astVisual.test.ts` | **Nuevo** — pruebas de la lógica visual. |
| `src/pages/inferencias/index.vue` | **Modificado** — 3.ª pestaña + rediseño. |
| `TAREAS/hijos-de-linus/README.md` | **Nuevo** — estado y checklist del equipo. |
| `TAREAS/hijos-de-linus/ANALISIS_AST.md` | **Nuevo** — análisis técnico del parser. |
| `TAREAS/hijos-de-linus/INFORME_MEJORAS.md` | **Nuevo** — este informe. |

---

## 8. Correcciones de bugs (iteración posterior)

Durante la validación manual se detectó que la pestaña no mostraba el gráfico. Se
corrigieron **dos causas**:

### 8.1. Entrada no normalizada → árbol de error en vez de árbol
El formulario emite el texto **crudo** (`update:modelValue`), que suele contener símbolos
(`→`, `∧`, `¬`…). `ArbolAST` llamaba a `parsearExpresion` con ese texto sin procesar, el
parser no reconocía los símbolos y lanzaba excepción, mostrando solo el mensaje de error.

**Solución:** se creó `normalizarExpresion()` en `src/lib/solver/parser.ts` (única fuente de
verdad) que traduce notación matemática a palabras clave del motor, y `ArbolAST` la aplica
antes de parsear. El formulario ahora reutiliza esa misma función (DRY).

### 8.2. Pestaña vacía al abrir la página
Sin premisas ingresadas, `ArbolAST` no renderizaba nada útil.

**Solución:** cuando no hay contenido, se muestra un **árbol de ejemplo demostrativo**
(`P → Q`, `P ⊢ Q`) con un aviso, de modo que la pestaña siempre presenta una jerarquía
visual. Al escribir en «Simbología Formal», el árbol se actualiza reactivamente.

### 8.3. Conectores CSS no aplicados en profundidad (scoped)
El componente `NodoArbol` es recursivo; los `<li>/<ul>` hijos no heredaban el atributo de
ámbito de `ArbolAST`, por lo que las reglas de ramas no se aplicaban a profundidad. Se pasó
el CSS del árbol a `<style>` **global** (clases `.arbol-*` únicas) y se oscureció el color
de las ramas para mejor contraste.

**Validación final:** `type-check` ✅ · `build` ✅ · `test` (122) ✅, incluidos casos que
verifican normalización de `P → Q`, precedencia y el ejemplo por defecto.

---

## 9. Mejora: diagrama único y explicación para no expertos

Se solicitó unir los árboles independientes (uno por premisa/conclusión) en **un solo
diagrama jerárquico** y hacerlo comprensible para quienes no conocen los árboles AST,
sin afectar el resto del proyecto.

### Cambios
- `ArbolAST.vue` ahora construye **un único árbol**: una raíz «Demostración» de la que
  cuelgan cada premisa (etiquetadas `P1`, `P2`…) y la conclusión (`∴ Conclusión`), cada
  una descompuesta en sus conectivos/variables. Ya no hay tarjetas separadas.
- `NodoArbol.vue` ganó soporte para una **raíz global** (`tituloRaiz` + `hijos`
  etiquetados) sin tocar la lógica recursiva de los nodos normales.
- Se añadió una **guía visual** («¿Cómo leer este diagrama?») y estadísticas globales del
  diagrama (proposiciones, nodos, profundidad, variables, conectivos).
- El manejo de errores ahora es **tolerante**: una proposición inválida se reporta en una
  alerta y el resto del árbol se sigue dibujando.

### Alcance (sin regresiones)
Solo se modificaron `ArbolAST.vue` y `NodoArbol.vue`, componentes usados **exclusivamente**
por la pestaña «Árbol de Nodos». El parser, `astVisual`, el solver, las otras pestañas y el
resto del proyecto permanecen intactos.

**Validación:** `type-check` ✅ · `build` ✅ · `test` (123) ✅, incluyendo un caso que verifica
que existe **exactamente un** `ul.arbol-raiz` con la raíz «Demostración» y ramas `P1` / `∴ Conclusión`.
