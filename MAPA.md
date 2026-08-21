# 🗺️ MAPA DEL REPOSITORIO

Guía rápida para encontrar cualquier cosa en el proyecto.

---

## 📁 Raíz del Proyecto

| Archivo | Para qué sirve |
|---|---|
| `README.md` | Presentación del proyecto: equipos, reglas, rúbrica de evaluación. |
| `CRONOGRAMA.md` | Fechas exactas de los 4 sprints y qué entregar en cada uno. |
| `GUIA_ESTUDIANTE.md` | Manual de herramientas y paso a paso por entregable. |
| `CONTRIBUTING.md` | Reglas para hacer un buen Pull Request. |
| `MAPA.md` | Este archivo. Índice de todo el repositorio. |

---

## 📁 `/TAREAS`

| Archivo | Para qué sirve |
|---|---|
| `01_Propuesta.md` | Instrucciones y plantilla para el Entregable 1 (Diseño). |

*(Se irán añadiendo `02_Motor.md`, `03_UI.md`, `04_Deploy.md` según avancen los sprints.)*

---

## 📁 `/src/pages` — El Código

Cada carpeta pertenece a un equipo. Ahí vive todo su código Vue.

## 🗺️ Mapa de Rutas (Páginas del Proyecto)

La estructura web del proyecto se divide en 4 módulos interactivos, uno por equipo:

1. **Equipo Sinergia** 
   - `src/pages/tablas/` 
   - Tema: *Fundamentos, Conectivos y Tablas de Verdad*
2. **Equipo Los hijos de Linus** 
   - `src/pages/inferencias/` 
   - Tema: *Inferencias Lógicas y Validaciones*
3. **Equipo 3** 
   - `src/pages/cuantificadores/` 
   - Tema: *Cuantificadores y Lógica de Predicados*
4. **Equipo Linus**
   - `src/pages/conjuntos/` 
   - Tema: *Teoría de Conjuntos y Diagramas*

---

## 📁 `/src/components`

Componentes Vue reutilizables compartidos entre todos los equipos (botones, tablas, layout, etc.).

---

## 📁 `/src/router`

`index.ts` — Define las rutas URL de la app (qué página aparece en qué URL).
