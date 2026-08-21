# 📊 Estado de los Equipos — Contexto para Agentes de Guía

> **Fecha de revisión:** 21 de Agosto 2026  
> **Objetivo:** Dar contexto a cada equipo y su agente de guía sobre el estado real del proyecto.

---

## 🗺️ Distribución del Sílabo (4 Equipos)

| # | Equipo | Tema | Carpeta |
|---|---|---|---|
| 1 | Sinergia | Fundamentos, Conectivos y Tablas de Verdad | `src/pages/tablas` |
| 2 | Los Hijos de Linus | Inferencias Lógicas y Validaciones | `src/pages/inferencias` |
| 3 | Modus Innova | Cuantificadores y Lógica de Predicados | `src/pages/cuantificadores` |
| 4 | Linus | Teoría de Conjuntos y Diagramas | `src/pages/conjuntos` |

---

## 📈 Estado por Equipo

### Equipo 1 — Sinergia (Tablas de Verdad)
| Aspecto | Estado | Detalle |
|---|---|---|
| **Sprint 1 (Propuesta)** | ✅ Completado | Propuesta "LogiLearn" con wireframes en Figma |
| **Sprint 2 (Motor)** | ❌ No iniciado | No hay evaluator de verdad ni generador de tablas |
| **Sprint 3 (UI)** | ❌ Stub | Solo título y descripción placeholder |
| **Sprint 4 (Pruebas)** | ❌ No iniciado | — |
| **Motor disponible** | `src/lib/solver/parser.ts` puede reusarse para parsear fórmulas, pero falta `evaluar(nodo, asignación): boolean` |
| **Archivos de referencia** | `TAREAS/01_Propuesta/sinergia/propuesta.md` |

### Equipo 2 — Los Hijos de Linus (Inferencias Lógicas)
| Aspecto | Estado | Detalle |
|---|---|---|
| **Sprint 1 (Propuesta)** | ✅ Completado | Propuesta con 2 módulos (resolver + practicar) |
| **Sprint 2 (Motor)** | ✅ Completado | Parser, solver (MPP), validator, transcription, trazabilidad + tests |
| **Sprint 3 (UI)** | ❌ Stub | Solo título y descripción placeholder |
| **Sprint 4 (Pruebas)** | ⚠️ Parcial | Tests unitarios en `src/lib/` pasan |
| **Motor disponible** | `src/lib/solver/`, `src/lib/validator/`, `src/lib/transcription/`, `src/lib/trazabilidad/` |
| **Archivos de referencia** | `TAREAS/01_Propuesta/los-hijos-de-linus/propuesta.md`, `TAREAS/sprint-2/hijos-de-linus/avance.md` |

### Equipo 3 — Modus Innova (Cuantificadores)
| Aspecto | Estado | Detalle |
|---|---|---|
| **Sprint 1 (Propuesta)** | ✅ Completado | Propuesta "QuantifiWeb" con cuantificadores + inferencias |
| **Sprint 2 (Motor)** | ❌ No iniciado | No hay motor para cuantificadores (∀, ∃) |
| **Sprint 3 (UI)** | ❌ Stub | Solo título y descripción placeholder |
| **Sprint 4 (Pruebas)** | ❌ No iniciado | — |
| **Motor disponible** | Ninguno específico. Nota: la propuesta incluye inferencias que se superponen con equipo 2 |
| **Archivos de referencia** | `TAREAS/01_Propuesta/cuantificadores/propuesta.md` |

### Equipo 4 — Linus (Conjuntos)
| Aspecto | Estado | Detalle |
|---|---|---|
| **Sprint 1 (Propuesta)** | ✅ Completado | Propuesta con calculadora de conjuntos + Venn |
| **Sprint 2 (Motor)** | ❌ No iniciado | No hay motor para operaciones con conjuntos |
| **Sprint 3 (UI)** | ❌ Stub | Solo título y descripción placeholder |
| **Sprint 4 (Pruebas)** | ❌ No iniciado | — |
| **Motor disponible** | Ninguno. Necesita: union, intersección, diferencia, complemento, diagrama de Venn |
| **Archivos de referencia** | `TAREAS/01_Propuesta/linus/propuesta.md` |

---

## ⚠️ Observaciones Importantes

1. **Sobreposición de temas:** La propuesta de Modus Innova (equipo 3) incluye un módulo de "Inferencias Lógicas y Silogismos" que se superpone con el tema asignado a Los Hijos de Linus (equipo 2). Definir si esta superposición es intencional o si Modus Innova debe enfocarse solo en cuantificadores.

2. **Motor compartido:** El motor en `src/lib/` fue construido principalmente por Los Hijos de Linus (equipo 2). Los otros equipos pueden reutilizar el parser (`src/lib/solver/parser.ts`) para parsear fórmulas lógicas, pero necesitarán crear sus propios evaluadores para sus temas específicos.

3. **UI stubs:** Las 4 páginas (`src/pages/*/index.vue`) son placeholders con solo un título. Ninguna tiene interactividad funcional. La UI debe construirse para el martes 25/08.

4. **Deploy:** No hay workflow de GitHub Pages configurado. Necesita `base: '/logica_simbolica_global/'` en `vite.config.ts` y un workflow en `.github/workflows/`.

---

## 🎯 Entregables por Sprint (Referencia)

| Sprint | Entregable | Fecha |
|---|---|---|
| Sprint 1 | Propuesta + Bocetos | ✅ Completado |
| Sprint 2 | Motor Lógico (TypeScript) | ⚠️ Solo equipo 2 |
| Sprint 3 | Interfaz Visual (Vue 3) | ❌ Pendiente — cierre 21/08 |
| Sprint 4 | Pruebas + Deploy | ❌ Pendiente — cierre 25/08 (presentación) |

---

## 📁 Stack Tecnológico

- **Framework:** Vue 3 + Vite
- **Enrutamiento:** Vue Router
- **Estilos:** Tailwind CSS v4
- **Lenguaje:** TypeScript
- **Tests:** Vitest
- **Deploy:** GitHub Pages (pendiente configurar)

---

## 🔧 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Tests
npm run test

# Type check
npm run type-check
```
