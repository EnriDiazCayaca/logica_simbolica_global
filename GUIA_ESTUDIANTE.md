# 📖 Guía del Estudiante

Esta guía te da total autonomía para que puedas avanzar sin depender de preguntar constantemente al líder del proyecto (Enri). Si es tu primera vez trabajando con programación, repositorios o Vue 3, **respira**. Este proyecto está diseñado para que lo logres usando Inteligencia Artificial. No tienes que saber todo de memoria, pero sí debes saber **cómo pedirlo**.

---

## 🤖 Por qué usar Antigravity (y no solo ChatGPT)

ChatGPT te responde. **Antigravity actúa.** La diferencia es que Antigravity puede abrir tu computadora, leer tus archivos, ejecutar comandos y escribir código directamente. En este proyecto usarás Antigravity como tu **co-programador**. Tú das la dirección, la IA hace el trabajo técnico. Pasas de ser un *doer* a ser un *director*.

**✅ Es 100% gratuito** — Descárgalo en [antigravity.ai](https://antigravity.ai) (disponible para Windows, Mac y Linux).

---

## 📌 Entregable 1: Propuesta y Diseño (Semana 1)

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

## 🧠 Prompts Avanzados para Entregables 2, 3 y 4

### Prompt para crear Lógica (Semana 2) - Entregable 2
En la semana 2 usarán Antigravity para programar la lógica matemática base de su tema, inspirándose en motores de código abierto como el de Keith Schwarz.
> *"Actúa como un experto en Lógica Simbólica y TypeScript. Necesito crear una función pura que reciba una expresión de Modus Ponens y valide si está correcta. No hagas interfaz gráfica todavía. Solo dame el código de la función lógica con sus tipos de datos y explícame dónde colocarlo dentro de mi proyecto Vue 3."*

### Prompt para crear Interfaz (Semana 3) - Entregable 3
> *"Analiza la ruta `src/pages/tablas/index.vue`. Quiero agregar un componente interactivo usando Vue 3 (`<script setup lang="ts">`) y Tailwind CSS v4. Necesito una tabla bonita con fondo oscuro y bordes redondeados que muestre los valores de Verdad de una proposición 'p'. Dame el código exacto."*

### Prompt cuando hay un error (En cualquier momento)
> *"He intentado correr `npm run dev` (o hacer un push a GitHub) pero la consola me arroja este error rojo: [Copia y pega el error aquí]. Explícame paso a paso cómo lo soluciono en mi sistema operativo."*

---

## ⚠️ Regla de Oro
**Investiga primero.** Si tienes un problema, copia el error y pégalo en la IA. Si la IA no puede resolverlo después de varios intentos, recién escala el problema en las reuniones de equipo. ¡Conviértete en un Ingeniero Solucionador!
