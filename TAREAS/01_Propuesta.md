# 🎯 TAREA 01: Propuesta de Funcionalidad

Bienvenidos a la primera tarea oficial del proyecto Lógica Simbólica Global. 
Cada equipo tiene asignado un tema del sílabo. Su misión en esta tarea NO es programar todavía, sino **diseñar** qué herramienta interactiva van a construir para aportar a la plataforma web.

## 📌 Asignación de Temas por Equipo
- **Equipo 1 (Sublíder: Aarón):** Fundamentos del Lenguaje (Ruta: `/src/pages/fundamentos`)
- **Equipo 2 (Sublíder: Por definir):** Conectivos y Tablas de Verdad (Ruta: `/src/pages/tablas`)
- **Equipo 3 (Sublíder: Por definir):** Transformaciones Condicionales (Ruta: `/src/pages/condicionales`)
- **Equipo 4 (Sublíder: Por definir):** Inferencias Lógicas Básicas (Ruta: `/src/pages/inferencias`)
- **Equipo 5 (Sublíder: Por definir):** Validaciones y Derivaciones (Ruta: `/src/pages/derivaciones`)
- **Equipo 6 (Sublíder: Por definir):** Teoría de Conjuntos (Ruta: `/src/pages/conjuntos`)

---

## 🛠️ Instrucciones de la Tarea

1. Reúnanse con su equipo y discutan una idea de **software interactivo** que explique y aplique el tema que les tocó.
2. Creen un archivo llamado `propuesta.md` dentro de la carpeta asignada a su equipo. (Ejemplo para el Equipo 1: `/src/pages/fundamentos/propuesta.md`).
3. El archivo debe seguir la **Estructura Requerida** (ver abajo).
4. El Sublíder debe subir los cambios a GitHub mediante un **Pull Request**.

> ⏱️ **Fecha Límite:** El Pull Request debe ser enviado antes del Viernes a las 4:00 PM.

---

## 📄 Estructura Requerida para `propuesta.md`

Copien este esquema y llénenlo con su propia idea:

```md
# Título de nuestra herramienta interactiva

**Equipo:** [Número de equipo y nombre de los integrantes]
**Tema Asignado:** [El tema del sílabo]

### 1. Descripción del Problema
¿Qué problema matemático o de aprendizaje vamos a resolver? (Ej. "A los alumnos les cuesta entender cómo funciona el operador condicional").

### 2. ¿Qué hará nuestro componente?
Describan paso a paso qué verá el usuario en la pantalla y cómo interactuará.

### 3. Boceto Visual (Wireframe)
Pueden añadir una imagen de un dibujo hecho a mano, o un diseño hecho en Figma/Excalidraw mostrando cómo se verá la interfaz (botones, inputs, tablas).
*(Suban la imagen a su carpeta y referéncienla aquí)*.
```

---

## 💡 Ejemplo para inspirarlos

Si les hubiera tocado el tema de "Modus Ponens", una propuesta perfecta sería:

> **Título:** Validador Interactivo de Modus Ponens
> 
> **Problema:** Los estudiantes no saben identificar las premisas P y Q.
> 
> **Solución:** Haremos una interfaz con dos cajas de texto (Inputs). En la caja 1, el usuario escribe la Premisa Mayor (P -> Q). En la caja 2, la Premisa Menor (P). Al presionar el botón "Validar", nuestro motor lógico en Vue verificará si la conclusión resultante es exactamente "Q". Si es correcto, el botón se pondrá verde y lloverá confetti en la pantalla usando CSS. Si es falso, saldrá una alerta roja explicando el error.
> 
> **Boceto:** [Link al diseño de cómo se verán los inputs y botones hechos en Tailwind CSS]
