# Guía de Contenido — Flujo Profesor (sin GitHub, con aprobación)

Este documento es para el **mantenedor/estudiante** (Enrique). El profesor usa `content/GUIA_PROFESOR.md`.

## Resumen del sistema

- **Fuente de verdad:** `src/content/site.json` (tipada en `src/content/types.ts`, consumida vía `src/content/index.ts`).
- **Todos los textos visibles** están externalizados allí, por módulo, con flag `modoLiteral` independiente: `home`, `aprender`, `tablas`, `cuantificadores`, `conjuntos`, `inferencias`, `leyesPage`, `leyes`, `global`.
- **El profesor nunca toca código ni GitHub.** Edita `content/EDITAR_PROFESOR.xlsx` (solo columna D) en navegador (Excel/Sheets/LibreOffice) y te lo envía. Tú aplicas con script y abres PR para su OK.

## Por qué por módulos (literal vs símbolos)

El profesor pidió literal en algunos lugares (ej: tarjeta cuantificadores "para todo" no "∀", definiciones en Aprender, título inferencias "Validador" no "Demostrador"). En vez de global, cada módulo tiene `modoLiteral: boolean` en `00_Config`:

- `cuantificadores.modoLiteral=true` → header "Evalúa para todo y existe...", pestaña "Cuantificadores (para todo / existe)", botones "Para todo"/"Existe", fórmulas "para todo x, P(x)".
- `aprender.modoLiteral=true` → conectores muestran "y/o/entonces/si y solo si" en vez de ∧∨→↔.
- `inferencias.modoLiteral=true` → título "Validador..." y pestaña "Notación formal" vs "Simbología Formal".
- `home/leyes/tablas/conjuntos` similar.

## Comandos

```bash
# Regenerar Excel/MD desde site.json (tras editar site.json manualmente o tras cambios de schema)
npm run content:gen

# Validar rigor básico + modoLiteral
npm run content:validate

# Aplicar Excel del profesor a site.json (solo celdas con propuesta no vacía)
npm run content:apply
npm run content:apply -- content/EDITAR_PROFESOR.xlsx   # explícito
npm run content:apply -- /tmp/archivo_del_profesor.xlsx # otro archivo

# Luego siempre:
npm run type-check
npm test
npm run build # opcional
```

## Flujo paso a paso con aprobación (obligatorio)

1. **Entregar plantilla:** Envía al profesor `content/EDITAR_PROFESOR.xlsx` + `content/GUIA_PROFESOR.md` por Drive/Email. Indica que edite solo columna D.
2. **Recibir archivo:** Profesor devuelve `EDITAR_PROFESOR.xlsx` (o renombrado). Guárdalo como `content/EDITAR_PROFESOR_2026-09-03.xlsx` y también como `content/EDITAR_PROFESOR.xlsx` (sobrescribe).
3. **Aplicar:**
   ```bash
   npm run content:apply
   npm run content:validate
   npm run type-check && npm test
   ```
   Revisa `src/content/site.json` diff; si algo raro, corrige a mano o pide aclaración.
4. **Branch + PR:**
   ```bash
   git checkout -b content/profesor-2026-09-03
   git add src/content/site.json content/EDITAR_PROFESOR.xlsx content/EDITAR_PROFESOR.md
   git commit -m "content: aplica correcciones profesor 2026-09-03 (literal por módulos)"
   git push -u origin content/profesor-2026-09-03
   gh pr create --title "content: correcciones profesor 2026-09-03" --body "Aplica Excel del profesor. Cambios: ... . Validado: type-check OK, tests OK. Esperando OK del profesor."
   ```
5. **OK del profesor:** Mándale link del PR preview (Netlify/Vercel) o capturas. Que confirme por chat.
6. **Merge + deploy:** Merge a `main`, push, verifica GitHub Pages en 2 min (`https://EnriDiazCayaca.github.io/logica_simbolica_global/`).

## Qué se externalizó (inventario)

- `src/pages/Home.vue:18` → `home.modulos`, `home.hero`, `home.sobreNosotros`
- `src/components/layout/AppNavBar.vue:10` → `global.nav`, `global.marca`
- `src/pages/aprender/index.vue:28` → `aprender.conectores` (5) + leyes vía `src/data/logicLaws.ts` → `site.leyes`
- `src/pages/tablas/index.vue:1` → `tablas.*`
- `src/pages/cuantificadores/index.vue:28` → `cuantificadores.*` (incl. `simbolosLiteral`)
- `src/pages/conjuntos/index.vue:1` → `conjuntos.*`
- `src/pages/inferencias/index.vue:78` → `inferencias.*` (titulo vs tituloLiteral)
- `src/pages/leyes-logicas/index.vue:1` → `leyesPage.*` + `leyes`
- `src/data/logicLaws.ts:8` → `site.leyes` (12 leyes, con `formulasLiteral` opcional)

No se externalizaron (por ser lógica, no texto): ejercicios con fórmulas generadas (`src/data/exercises.ts`), motores (`src/lib/**`), traducciones internas (`src/lib/transcription/translations.ts` si en futuro quieres, añade a site.json).

## Añadir nueva clave editable

1. Añade campo en `src/content/types.ts` y en `src/content/site.json`.
2. Usa en componente: `import { siteContent } from '@/content'` + `siteContent.miModulo.miClave` o con `modoLiteral ? literal : simbolo`.
3. Regenera Excel: `npm run content:gen` y entrega nueva versión al profesor.

## Reparación del repo (histórico)

- `main` local estaba roto (solo `dist/` por sync gh-pages). Se reseteó a `origin/main` (`1dc32cb`) y se validó `type-check` y `189 tests`. Backup en `backup/main-pre-fix`.
- No se hizo `push --force` a `origin/main`; se deja para que hagas push cuando PR de contenido esté listo. Si necesitas forzar: `git push --force-with-lease origin main`.

## Troubleshooting

- Excel no abre: usa `EDITAR_PROFESOR.md` fallback o pide al profesor abrir en Google Sheets (File → Import).
- Cambios no se ven: `npm run content:apply` solo aplica columna D no vacía; verifica que no haya espacios. Revisa `site.json.bak-*`.
- Símbolos aparecen pese a `modoLiteral=true`: verifica que el componente use el ternario `modoLiteral ? literal : simbolo` (ver `src/pages/cuantificadores/index.vue`, `aprender`, `inferencias`, `conjuntos`).
- Validación falla: `npm run content:validate` indica qué módulo falta.
