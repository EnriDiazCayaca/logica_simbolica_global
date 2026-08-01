# 📖 Manual de Supervivencia (Guía de Autonomía)

Si es tu primera vez trabajando con programación, repositorios o Vue 3, **respira**. Este proyecto está diseñado para que lo logres usando Inteligencia Artificial. No tienes que saber todo de memoria, pero sí debes saber **cómo pedirlo**. 

Esta guía te da total autonomía para que puedas avanzar sin depender de preguntar constantemente al líder del proyecto (Enri).

---

## 1. 🤖 Herramientas Permitidas y Necesarias
1. **GitHub:** Para descargar y subir código.
2. **Node.js (NPM):** Para instalar las dependencias del proyecto.
3. **Editor de Código:** Se recomienda encarecidamente usar herramientas asistidas por IA como **Cursor**, **Windsurf** o tener abierto **Google Antigravity/Gemini** a un lado.

---

## 2. 💻 Comandos Básicos de GitHub (Terminal)

Para empezar a trabajar en tu computadora, abre tu terminal y usa estos comandos en orden:

1. **Clonar (Descargar) el repositorio por primera vez:**
   ```bash
   git clone https://github.com/EnriDiazCayaca/logica_simbolica_global.git
   ```
2. **Entrar a la carpeta del proyecto:**
   ```bash
   cd logica_simbolica_global
   ```
3. **Crear una rama para tu equipo (MUY IMPORTANTE):** Nunca trabajes en `main`. (Solo los sublíderes hacen esto)
   ```bash
   git checkout -b equipo-1-fundamentos
   ```
4. **Guardar tus cambios y enviarlos (Para Sublíderes):**
   ```bash
   git add .
   git commit -m "Añadiendo el boceto inicial"
   git push origin equipo-1-fundamentos
   ```

---

## 3. 🟢 Comandos de Vue 3 (Para levantar el servidor local)

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

## 4. 🧠 Cómo hablarle a la IA (El secreto de este proyecto)

Si no sabes programar en TypeScript o Vue, tu trabajo real es **saber darle buenas instrucciones a la IA**. Aquí tienes Prompts de ejemplo exactos que puedes copiar y pegar en tu IA para resolver problemas:

### Prompt para crear Lógica (Semana 2)
> "Actúa como un experto en Lógica Simbólica y TypeScript. Necesito crear una función pura que reciba una expresión de Modus Ponens y valide si está correcta. No hagas interfaz gráfica todavía. Solo dame el código de la función lógica con sus tipos de datos y explícame dónde colocarlo dentro de mi proyecto Vue 3."

### Prompt para crear Interfaz (Semana 3)
> "Analiza la ruta `src/pages/tablas/index.vue`. Quiero agregar un componente interactivo usando Vue 3 (`<script setup lang="ts">`) y Tailwind CSS v4. Necesito una tabla bonita con fondo oscuro y bordes redondeados que muestre los valores de Verdad de una proposición 'p'. Dame el código exacto."

### Prompt cuando hay un error
> "He intentado correr `npm run dev` pero la consola me arroja este error rojo: [Copia y pega el error aquí]. Explícame paso a paso cómo lo soluciono en mi sistema operativo."

---

## ⚠️ Regla de Oro
**Investiga primero.** Si tienes un problema, copia el error y pégalo en la IA. Si la IA no puede resolverlo después de varios intentos, recién escala el problema en las reuniones de equipo. ¡Conviértete en un Ingeniero Solucionador!
