# 🎯 TAREA 02: Motor Lógico (TypeScript)

**Objetivo:** Programar la lógica matemática de tu tema SIN interfaz gráfica.
**Fecha límite:** Viernes 22/08, 4-6 PM (PR)

---

## 📚 Recursos y Manuales

| Recurso | Link | Para qué sirve |
|---|---|---|
| TypeScript Handbook | https://www.typescriptlang.org/docs/handbook/ | Aprender tipos, interfaces, generics |
| Vitest | https://vitest.dev/guide/ | Escribir y correr tests unitarios |
| Motor de Inferencias (ref.) | `src/lib/solver/` | Ejemplo vivo de cómo se estructura un motor |
| Keith Schwarz CS103 | https://web.stanford.edu/class/cs103/ | Inspiración para motores lógicos |
| Vue Test Utils | https://test-utils.vuejs.org/ | Tests de componentes Vue |

---

## 📌 Por Equipo — Qué Crear

### Equipo 1 — Sinergia (Tablas de Verdad)

**Crear:** `src/lib/truth-table/evaluator.ts`

```typescript
// Función principal a implementar
export function evaluar(nodo: NodoExpresion, asignacion: Map<string, boolean>): boolean
export function generarTabla(formula: string): ResultadoTabla
```

**Tests:** `src/lib/truth-table/evaluator.test.ts`
- Probar con: `p AND q`, `p OR NOT q`, `p IMPLIES q`
- Verificar tautologías, contradicciones, contingencias

**Reusar:** Parser de `src/lib/solver/parser.ts` para parsear fórmulas.

---

### Equipo 2 — Los Hijos de Linus (Inferencias Lógicas)

**Estado:** Motor ya existe en `src/lib/solver/` ✅

**Mejora:** Expandir `demostrarConclusion()` con forward-chaining
- Agregar detección de Modus Tollens, Silogismo Hipotético
- Agregar más reglas de inferencia

**Tests:** Agregar más casos en `src/lib/solver/solver.test.ts`

---

### Equipo 3 — Modus Innova (Cuantificadores)

**Crear:** `src/lib/quantifiers/evaluator.ts`

```typescript
// Funciones a implementar
export function evaluarCuantificador(formula: string, dominio: any[]): ResultadoCuantificador
export function negarCuantificador(formula: string): string  // De Morgan
export function verificarContraejemplo(formula: string, dominio: any[]): Contraejemplo | null
```

**Tests:** `src/lib/quantifiers/evaluator.test.ts`
- Probar con: `∀x P(x)`, `∃x P(x)`, negaciones
- Dominios finitos: `{1, 2, 3, 4, 5}`

---

### Equipo 4 — Linus (Conjuntos)

**Crear:** `src/lib/sets/operations.ts`

```typescript
// Funciones a implementar
export function union(a: Set<any>, b: Set<any>): Set<any>
export function interseccion(a: Set<any>, b: Set<any>): Set<any>
export function diferencia(a: Set<any>, b: Set<any>): Set<any>
export function complemento(universo: Set<any>, a: Set<any>): Set<any>
export function potencia(a: Set<any>): Set<Set<any>>
export function verificarPertenencia(elemento: any, conjunto: Set<any>): boolean
export function sonDisjuntos(a: Set<any>, b: Set<any>): boolean
export function esSubconjunto(a: Set<any>, b: Set<any>): boolean
```

**Tests:** `src/lib/sets/operations.test.ts`
- Probar con conjuntos numéricos y de strings
- Verificar propiedades: `A ∪ B = B ∪ A`, `A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)`

---

## 🛠️ Instrucciones de Entrega

1. Crear carpeta `TAREAS/02_Motor/{tu-equipo}/`
2. Crear `avance.md` con:
   - Qué hiciste
   - Qué falta
   - Archivos creados
   - Cómo usar tu motor (ejemplos)
3. El código va en `src/lib/` (NO en `src/pages/`)
4. PR antes del viernes 4-6 PM

---

## ✅ Checklist

- [ ] Código en TypeScript estricto (sin `any`)
- [ ] Tests pasan con `npm test`
- [ ] `npm run type-check` sin errores
- [ ] `avance.md` describe la API
- [ ] Funciones exportadas y documentadas
