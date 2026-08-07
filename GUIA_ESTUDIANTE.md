# 📖 Guía del Estudiante

---

## 🤖 Por qué usar Antigravity (y no solo ChatGPT)

ChatGPT te responde. **Antigravity actúa.** La diferencia es que Antigravity puede abrir tu computadora, leer tus archivos, ejecutar comandos y escribir código directamente. En este proyecto usarás Antigravity como tu **co-programador**. Tú das la dirección, la IA hace el trabajo técnico. Pasas de ser un *doer* a ser un *director*.

**✅ Es 100% gratuito** — Descárgalo en [antigravity.ai](https://antigravity.ai) (disponible para Windows, Mac y Linux).

---

## 📌 Entregable 1: Propuesta y Diseño

Todo lo que necesitas saber para completar la Tarea 01 está aquí.

### ¿Qué tienes que producir?
Un archivo `propuesta.md` en tu carpeta asignada (Ej: `/src/pages/inferencias/propuesta.md`) con:
- Nombre de la herramienta.
- Problema que resuelve.
- Boceto visual (wireframe).

Usa la plantilla que está en `TAREAS/01_Propuesta.md`.

---

### Paso 1: Diseña el boceto visual

No programes nada aún. Dibuja cómo se verá la interfaz.

- **[Excalidraw](https://excalidraw.com/)** → Bocetos rápidos, pizarra virtual. Recomendado para empezar.
- **[Figma](https://figma.com/)** → Herramienta profesional de diseño UI. Tiene plan gratuito.
  - Tutorial: [Figma en 10 minutos (YouTube)](https://www.youtube.com/results?search_query=figma+tutorial+para+principiantes+10+minutos)
- **Alternativa:** Papel y lápiz + una foto clara.

**Prompt para Antigravity (cópialo y pégalo):**
> *"Soy estudiante de ingeniería de sistemas. Tenemos una web en Vue 3 sobre Lógica Simbólica. A mi equipo le tocó el tema [escribe tu tema]. Dime qué herramienta interactiva podríamos construir para que los alumnos practiquen este tema. Dame 3 ideas concretas con su descripción en 2 líneas."*

---

### Paso 2: Escribe el archivo en Markdown

Tu archivo debe estar en formato `.md`. Es texto simple con símbolos especiales.

| Sintaxis | Resultado |
|---|---|
| `# Título` | Título grande |
| `## Subtítulo` | Subtítulo |
| `- Item` | Viñeta |
| `**negrita**` | **negrita** |

- 📖 Referencia completa: [Guía de Markdown de GitHub](https://docs.github.com/es/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

---

### Paso 3: Sube tu tarea a GitHub (Solo el Sublíder)

El **Sublíder** es el responsable de ejecutar estos comandos en su terminal:

```bash
# 1. Clona el repositorio (solo la primera vez)
git clone https://github.com/EnriDiazCayaca/logica_simbolica_global.git
cd logica_simbolica_global

# 2. Crea una rama para tu equipo (NUNCA trabajes en main)
git checkout -b equipo-1-inferencias

# 3. Coloca el archivo propuesta.md en tu carpeta

# 4. Envía los cambios
git add .
git commit -m "Entregable 1: Propuesta Equipo 1 - Inferencias"
git push origin equipo-1-inferencias
```

5. Ve a GitHub → Haz clic en **"Compare & pull request"** → Envíalo.

**¿Hay un error?** Copia el mensaje rojo de la consola y díselo a Antigravity:
> *"Estoy intentando hacer un push a GitHub y me sale este error: [pega el error]. ¿Cómo lo soluciono paso a paso?"*

---

> ⚠️ **Regla de Oro:** Investiga el error con la IA antes de preguntar al líder del proyecto. La guía de los Sprints 2, 3 y 4 se irá añadiendo semana a semana conforme avance el proyecto.
