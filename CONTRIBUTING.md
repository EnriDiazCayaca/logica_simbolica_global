# Guía de Contribución para Estudiantes

¡Bienvenido al proyecto de Lógica Simbólica! Para mantener el código organizado y asegurar que no rompamos la página principal (`main`), todos debemos seguir estos pasos exactos para subir código.

## ⚠️ Reglas Generales
1. **NO programar en la rama `main`**.
2. **Solo modificar tu carpeta asignada** (`/src/app/tu-equipo`).
3. **Tu Sublíder es el único que puede hacer Pull Requests**.

## Paso 1: Obtener el Proyecto (Primera vez)
Abre tu terminal en la carpeta donde quieres guardar el proyecto y clónalo:
```bash
git clone https://github.com/EnriDiazCayaca/logica_simbolica_global.git
cd logica_simbolica_global
npm install
```

## Paso 2: Crear tu Rama de Trabajo
Antes de programar, crea una rama (branch) y muévete a ella. Nómbrala según tu equipo y tarea:
```bash
git checkout -b equipo-X-mi-tarea
```
*(Ejemplo: `git checkout -b equipo-2-generador-tablas`)*

## Paso 3: Programar (¡Usa IA!)
- Abre Cursor o VS Code.
- Modifica los archivos solo de tu carpeta asignada.
- Puedes arrancar el servidor de prueba para ver cómo queda escribiendo:
```bash
npm run dev
```

## Paso 4: Guardar y Subir (Commit & Push)
Cuando tu código funcione bien localmente, súbelo a GitHub:
```bash
# 1. Agrega todos tus archivos modificados
git add .

# 2. Guarda con un mensaje descriptivo
git commit -m "feat: agregué la sección de proposiciones simples"

# 3. Sube la rama a GitHub
git push -u origin tu-nombre-de-rama
```

## Paso 5: Crear el Pull Request (Solo Sublíderes)
1. Ve a la página del repositorio en GitHub.
2. Verás un botón verde que dice **"Compare & pull request"**. Dale clic.
3. Rellena la plantilla (checklist) asegurando que probaste tu código.
4. **Enri** revisará tu código. Si está perfecto, lo aprobará y se publicará automáticamente en Vercel.
