# 🌳 Equipo «Los Hijos de Linus» — Módulo Parser / AST

> **Estado:** ✅ Avance completado (parser analizado, visualizador de árbol AST implementado y tercera pestaña añadida).
> **Responsable:** Agente de IA (análisis + implementación de UI).
> **Fecha de avance:** 2026-08-29

## 📌 Resumen del avance

1. **Análisis profundo** del módulo de parseo AST (`src/lib/solver/parser.ts`) y sus tipos (`src/lib/solver/types.ts`).
2. **Nuevo componente de visualización** `ArbolAST.vue` + `NodoArbol.vue` que dibuja el árbol de nodos de cualquier proposición.
3. **Tercera pestaña** «Árbol de Nodos» añadida junto a «Lenguaje Natural» en el demostrador de inferencias (`src/pages/inferencias/index.vue`).
4. **Mejora de diseño** del módulo: segmented control con iconos, encabezado con insignia, leyenda de operadores y estadísticas por árbol.
5. **Núcleo reutilizable** `src/lib/solver/astVisual.ts` con metadatos de operadores (símbolo, nombre, color, aridad) y utilidades de recorrido.

## 📂 Archivos creados/modificados

| Archivo | Acción | Propósito |
|---|---|---|
| `src/lib/solver/astVisual.ts` | **Nuevo** | Metadatos de operadores + utilidades (`hijosDeNodo`, `contarNodos`, `profundidadNodo`, `estadisticasNodo`). |
| `src/components/inferencias/NodoArbol.vue` | **Nuevo** | Nodo recursivo del árbol (chip con conectivo/variable + ramas). |
| `src/components/inferencias/ArbolAST.vue` | **Nuevo** | Bosque de árboles: parsea premisas/conclusión y renderiza el AST. |
| `src/pages/inferencias/index.vue` | **Modificado** | Añade la pestaña «Árbol de Nodos» y mejora el diseño general. |

## 🧭 Cómo probar el avance

1. `npm run dev` y abrir el demostrador de inferencias.
2. Escribir premisas (ej. `P → Q`, `P`) y conclusión (`Q`).
3. Cambiar a la pestaña **🌳 Árbol de Nodos** para ver la estructura jerárquica.
4. Verificar `npm run type-check` y `npm test` (ambos en verde).

## 📝 Checklist de verificación manual (QA humano)

- [ ] La pestaña «Árbol de Nodos» aparece entre «Lenguaje Natural» y el borde del control.
- [ ] Las ramas (líneas) conectan correctamente padres e hijos sin solaparse.
- [ ] El color de cada nodo/rama coincide con su conectivo (¬ rojo, ∧ azul, → índigo, etc.).
- [ ] La conclusión se resalta con borde índigo.
- [ ] Con paréntesis `NO (P → Q)` la raíz es `NO` y `→` es hijo (se respeta precedencia).
- [ ] Navegación por `Tab` llega a los botones de pestaña y al formulario.
- [ ] Redimensionar en móvil no rompe el árbol (scroll horizontal dentro de cada tarjeta).
