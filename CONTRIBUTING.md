# Guía de Contribución para Estudiantes

¡Bienvenido al proyecto de Lógica Simbólica! Para mantener el código organizado y asegurar que no rompamos la página principal (`main`), todos debemos seguir estos pasos exactos para subir código.

## ⚠️ Reglas Generales
1. **NO programar en la rama `main`**.
2. **Solo modificar tu carpeta asignada** (`/src/pages/tu-equipo/`).
3. **Tu Sublíder es el único que puede hacer Pull Requests**.

## Equipos y sus Carpetas

| # | Equipo | Carpeta | Tema |
|---|---|---|---|
| 1 | Sinergia | `src/pages/tablas/` | Tablas de Verdad |
| 2 | Los Hijos de Linus | `src/pages/inferencias/` | Inferencias Lógicas |
| 3 | Modus Innova | `src/pages/cuantificadores/` | Cuantificadores |
| 4 | Linus | `src/pages/conjuntos/` | Conjuntos y Venn |

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
git checkout -b equipo-X-nombre-tarea
```
**Convención de nombres:**
- `equipo-1-sinergia-tablas`
- `equipo-2-linus-inferencias-motor`
- `equipo-3-modus-innova-cuantificadores-ui`
- `equipo-4-linus-conjuntos-venn`

## Paso 3: Programar (¡Usa IA!)
- Abre Cursor o VS Code.
- Modifica los archivos **solo de tu carpeta asignada**.
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
4. **Enri** revisará tu código. Si está perfecto, lo aprobará.

## Checklist del PR
- [ ] ¿Qué sprint? (Motor / UI / Deploy)
- [ ] ¿Qué equipo? (Sinergia / Hijos de Linus / Modus Innova / Linus)
- [ ] ¿Qué archivos cambiaron?
- [ ] Código compila sin errores (`npm run type-check`)
- [ ] Tests pasan (`npm test`)
- [ ] Documentation actualizada
