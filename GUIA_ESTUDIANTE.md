# 📖 Guía del Estudiante

Esta guía te da total autonomía para que puedas avanzar sin depender de preguntar constantemente al líder del proyecto (Enri). Si es tu primera vez trabajando con programación, repositorios o Vue 3, **respira**. Este proyecto está diseñado para que lo logres usando Inteligencia Artificial. No tienes que saber todo de memoria, pero sí debes saber **cómo pedirlo**.

---

## 🤖 Por qué usar Antigravity (y no solo ChatGPT)

ChatGPT te responde. **Antigravity actúa.** La diferencia es que Antigravity puede abrir tu computadora, leer tus archivos, ejecutar comandos y escribir código directamente. En este proyecto usarás Antigravity como tu **co-programador**. Tú das la dirección, la IA hace el trabajo técnico. Pasas de ser un *doer* a ser un *director*.

**✅ Es 100% gratuito** — Descárgalo en [antigravity.ai](https://antigravity.ai) (disponible para Windows, Mac y Linux).

---

## 📌 Equipos y Temas

| # | Equipo | Carpeta | Tema |
|---|---|---|---|
| 1 | Sinergia | `src/pages/tablas/` | Tablas de Verdad |
| 2 | Los Hijos de Linus | `src/pages/inferencias/` | Inferencias Lógicas |
| 3 | Modus Innova | `src/pages/cuantificadores/` | Cuantificadores |
| 4 | Linus | `src/pages/conjuntos/` | Conjuntos y Venn |

---

## 🟢 Comandos de Vue 3 (Para levantar el servidor local)

Para ver la página web funcionando en tu computadora:

1. **Instalar dependencias (Hazlo solo la primera vez o si alguien agregó una nueva librería):**
   ```bash
   npm install
   ```
2. **Arrancar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   *Esto te dará un enlace local, normalmente `http://localhost:5173`. Haz ctrl+click para abrirlo en tu navegador.*

---

## 📌 Entregable 1: Propuesta y Diseño (Semana 1) ✅

Todo lo que necesitas saber para completar la Tarea 01 está aquí.

### ¿Qué tienes que producir?
Un archivo `propuesta.md` en tu carpeta asignada (Ej: `TAREAS/01_Propuesta/sinergia/propuesta.md`) con:
- Nombre de la herramienta.
- Problema que resuelve.
- Boceto visual (wireframe).

Usa la plantilla que está en `TAREAS/01_Propuesta.md`.

### Paso 1: Diseña el boceto visual
No programes nada aún. Dibuja cómo se verá la interfaz.

- **[Excalidraw](https://excalidraw.com/)** → Bocetos rápidos, pizarra virtual. Recomendado para empezar.
- **[Figma](https://figma.com/)** → Herramienta profesional de diseño UI. Tiene plan gratuito.
- **Alternativa:** Papel y lápiz + una foto clara.

### Paso 2: Sube tu tarea a GitHub (Solo el Sublíder)
```bash
git checkout -b equipo-1-sinergia-propuesta
git add .
git commit -m "Entregable 1: Propuesta del Equipo Sinergia"
git push origin equipo-1-sinergia-propuesta
```
Luego crea el Pull Request en GitHub.

---

## 🔧 Entregable 2: Motor Lógico (Semana 2)

### 📚 Recursos y Manuales
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/handbook/
- **Vitest (tests):** https://vitest.dev/guide/
- **Referencia viva:** Explorar `src/lib/solver/` — motor de inferencias ya funcional
- **Keith Schwarz CS103:** https://web.stanford.edu/class/cs103/ (inspiración para motores lógicos)

### ¿Qué tienes que producir?
Archivos `.ts` con la lógica matemática de tu tema + tests unitarios.

| Equipo | Qué crear | Archivos |
|---|---|---|
| Sinergia | Evaluator de tablas de verdad | `src/lib/truth-table/evaluator.ts` + tests |
| Hijos de Linus | Expandir solver con forward-chaining | `src/lib/solver/solver.ts` + tests |
| Modus Innova | Evaluator de cuantificadores (∀, ∃) | `src/lib/quantifiers/evaluator.ts` + tests |
| Linus | Operaciones con conjuntos | `src/lib/sets/operations.ts` + tests |

### Prompt para Antigravity
> *"Actúa como un experto en Lógica Simbólica y TypeScript. Necesito crear una función pura que [describe tu necesidad]. No hagas interfaz gráfica todavía. Solo dame el código de la función lógica con sus tipos de datos y explícame dónde colocarlo dentro de mi proyecto Vue 3."*

### Sube tu tarea
```bash
git checkout -b equipo-X-nombre-motor
git add .
git commit -m "feat(sprint-2): motor lógico del equipo X"
git push origin equipo-X-nombre-motor
```

---

## 🎨 Entregable 3: Interfaz Visual (Semana 3)

### 📚 Recursos y Manuales
- **Vue 3 Composition API:** https://vuejs.org/guide/extras/composition-api-faq.html
- **`<script setup>`:** https://vuejs.org/api/sfc-script-setup.html
- **Tailwind CSS v4:** https://tailwindcss.com/docs
- **Componentes Vue:** https://vuejs.org/guide/components/registration.html

### 🎨 Branding — Vibe Duolingo (Azul)
- **Color primario:** `blue-600` (#2563eb)
- **Fondo:** `neutral-50`
- **Texto:** `neutral-900`
- **Bordes:** `rounded-xl` para tarjetas, `rounded-full` para badges
- **Sombras:** `shadow-sm` → `hover:shadow-md`
- **Componentes:** Usar `Button.vue`, `Card.vue`, `Badge.vue` de `src/components/ui/`

### ¿Qué tienes que producir?
Un componente `.vue` funcional en tu `src/pages/{equipo}/index.vue` conectado al motor.

### Prompt para Antigravity
> *"Analiza la ruta `src/pages/tablas/index.vue`. Quiero agregar un componente interactivo usando Vue 3 (`<script setup lang="ts">`) y Tailwind CSS v4. Conéctalo a mi motor en `src/lib/`. Dame el código exacto."*

### Sube tu tarea
```bash
git checkout -b equipo-X-nombre-ui
git add .
git commit -m "feat(sprint-3): UI del equipo X"
git push origin equipo-X-nombre-ui
```

---

## 🚀 Entregable 4: Pruebas y Despliegue (Semana 4)

### 📚 Recursos y Manuales
- **GitHub Pages:** https://docs.github.com/en/pages
- **Vite Build:** https://vitejs.dev/guide/build.html
- **Vitest:** https://vitest.dev/guide/

### ¿Qué tienes que producir?
- Verificar que tu módulo funciona en la app completa.
- Escribir al menos 1 test básico por función principal.
- Documentar uso de tu módulo.

### Deploy
El deploy es automático a GitHub Pages cuando se hace merge a `main`. Verifica que `npm run build` funcione correctamente.

---

## 🛡️ Reglas de Oro

1. **Investiga primero.** Si tienes un problema, copia el error y pégalo en la IA.
2. **Solo toca tu carpeta.** Nunca modifiques archivos fuera de `src/pages/tu-equipo/` o `src/lib/`.
3. **Prueba antes de enviar.** Ejecuta `npm run dev` y `npm run type-check`.
4. **El Sublíder es el único que hace PRs.** Los miembros le envían su código por WhatsApp/Discord.
5. **Usa el branding.** Colores azul, bordes redondeados, sombras sutiles.

---

## 📁 Comandos Útiles

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
