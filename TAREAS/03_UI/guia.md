# 🎯 TAREA 03: Interfaz Visual (Vue 3)

**Objetivo:** Conectar tu motor del Sprint 2 con una interfaz interactiva.
**Fecha límite:** Viernes 29/08, 4-6 PM (PR)

---

## 📚 Recursos y Manuales

| Recurso | Link | Para qué sirve |
|---|---|---|
| Vue 3 Composition API | https://vuejs.org/guide/extras/composition-api-faq.html | Entender `<script setup>` |
| `<script setup>` | https://vuejs.org/api/sfc-script-setup.html | Sintaxis de componentes |
| Tailwind CSS v4 | https://tailwindcss.com/docs | Clases de diseño |
| Componentes Vue | https://vuejs.org/guide/components/registration.html | Crear y usar componentes |
| Button.vue (ref.) | `src/components/ui/Button.vue` | Componente de botón con branding |
| Card.vue (ref.) | `src/components/ui/Card.vue` | Componente de tarjeta |
| Badge.vue (ref.) | `src/components/ui/Badge.vue` | Componente de etiqueta |

---

## 🎨 Branding — Vibe Duolingo (Azul)

| Elemento | Estilo |
|---|---|
| Color primario | `blue-600` (#2563eb) — botones, acentos |
| Fondo | `neutral-50` — claro, limpio |
| Texto | `neutral-900` — alto contraste |
| Bordes tarjetas | `rounded-xl` |
| Bordes badges | `rounded-full` |
| Sombras | `shadow-sm` → `hover:shadow-md` |
| Cards | fondo blanco, borde `neutral-200`, hover `border-blue-400` |
| Botones | `Button.vue` con variant primary/secondary |
| Font | system-ui (ya configurado) |

---

## 📌 Por Equipo — Qué Crear

### Equipo 1 — Sinergia (Tablas)

**Modificar:** `src/pages/tablas/index.vue`

**Componentes a crear:**
- Input para fórmula lógica (ej: `p Y q -> r`)
- Botón "Generar Tabla"
- Tabla de verdad renderizada
- Indicador: Tautología ✅ / Contradicción ❌ / Contingencia ⚠️

**Conectar:**
```typescript
import { evaluar, generarTabla } from '@/lib/truth-table/evaluator'
```

---

### Equipo 2 — Hijos de Linus (Inferencias)

**Modificar:** `src/pages/inferencias/index.vue`

**Componentes a crear:**
- Input de premisas (una por línea)
- Input de conclusión
- Botón "Demostrar"
- Panel de pasos paso a paso (trazabilidad)
- Indicador: Válido ✅ / Inválido ❌

**Conectar:**
```typescript
import { demostrarConclusion } from '@/lib/solver/solver'
import { construirTrazabilidad } from '@/lib/trazabilidad'
```

---

### Equipo 3 — Modus Innova (Cuantificadores)

**Modificar:** `src/pages/cuantificadores/index.vue`

**Componentes a crear:**
- Input de dominio (ej: `1, 2, 3, 4, 5`)
- Input de predicado (ej: `x es par`)
- Input de fórmula (ej: `∀x P(x)`)
- Botón "Evaluar"
- Trazabilidad elemento por elemento
- Botón "Negar Expresión" (De Morgan)
- Indicador: Verdadero 🟢 / Falso 🔴

**Conectar:**
```typescript
import { evaluarCuantificador, negarCuantificador } from '@/lib/quantifiers/evaluator'
```

---

### Equipo 4 — Linus (Conjuntos)

**Modificar:** `src/pages/conjuntos/index.vue`

**Componentes a crear:**
- Input de Universo U
- Input de conjuntos A, B (y opcionalmente C)
- Selector de operación (Unión, Intersección, Diferencia, Complemento, Potencia)
- Diagrama de Venn (SVG interactivo)
- Resultado de la operación
- Verificación de propiedades (subconjunto, disjuntos, igualdad)

**Conectar:**
```typescript
import { union, interseccion, diferencia, potencia } from '@/lib/sets/operations'
```

---

## 🛠️ Instrucciones de Entrega

1. Modificar `src/pages/{tu-equipo}/index.vue`
2. Crear carpeta `TAREAS/03_UI/{tu-equipo}/`
3. Crear `avance.md` con:
   - Screenshots de la interfaz
   - Qué falta
   - Cómo probar tu módulo
4. PR antes del viernes 4-6 PM

---

## ✅ Checklist

- [ ] `<script setup lang="ts">` (no Options API)
- [ ] Conectado al motor de `src/lib/`
- [ ] Responsive (mobile friendly)
- [ ] Sigue el branding azul/Duolingo
- [ ] `npm run type-check` sin errores
- [ ] Botones usan `Button.vue` de `src/components/ui/`
