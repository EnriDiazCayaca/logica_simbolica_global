# 📖 Guía del Estudiante (Enfocada en el Entregable 1)

Esta guía contiene **ESTRICTAMENTE** lo necesario para superar el Entregable de la Semana 1 (Entregar su archivo `propuesta.md` y su diseño).

---

## 1. 🎨 Herramientas para el Boceto (Wireframe)
No programen nada aún. Su objetivo es dibujar cómo se verá la interfaz web de su herramienta.

- **Opción A (Figma):** Herramienta profesional de diseño UI.
  - [Tutorial Básico de Figma (YouTube)](https://www.youtube.com/results?search_query=figma+tutorial+basico)
- **Opción B (Excalidraw):** Pizarra virtual para hacer bocetos rápidos que parecen dibujados a mano.
  - [Ir a Excalidraw](https://excalidraw.com/)
- **Opción C:** Lápiz, papel y una buena foto.

---

## 2. 📝 Cómo escribir en formato Markdown (`.md`)
Su entregable debe ser un archivo de texto con extensión `.md`. GitHub lee este formato para darle estilos.
- Para un título principal usen `# Título`
- Para un subtítulo usen `## Subtítulo`
- Para viñetas usen `- Item`
- **¿Dudas?** Revisen la [Guía rápida de Markdown (Oficial de GitHub)](https://docs.github.com/es/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).

---

## 3. 💻 Cómo subir su tarea (Tutorial de GitHub)

El **Sublíder** del equipo es el responsable de hacer estos pasos en la terminal de su computadora para subir la tarea al repositorio oficial:

1. **Clonar el proyecto:**
   ```bash
   git clone https://github.com/EnriDiazCayaca/logica_simbolica_global.git
   ```
2. **Entrar a la carpeta:**
   ```bash
   cd logica_simbolica_global
   ```
3. **Crear una rama para su equipo (NUNCA tocar `main`):**
   ```bash
   git checkout -b equipo-X-su-tema
   ```
4. **Guardar su archivo `propuesta.md` en su carpeta asignada.**
5. **Subir los cambios a GitHub:**
   ```bash
   git add .
   git commit -m "Añadiendo propuesta inicial del Equipo X"
   git push origin equipo-X-su-tema
   ```
6. Vayan a la página de GitHub del proyecto y hagan clic en el botón verde **"Compare & pull request"**.

> 💡 **Tip si hay errores:** Cópienle el error exacto que les salga en la consola a **ChatGPT/Gemini/Claude** diciendo: "Estoy intentando subir un Pull Request a GitHub y me sale este error: [Pegar Error]". Ellos les darán el comando exacto para solucionarlo.
