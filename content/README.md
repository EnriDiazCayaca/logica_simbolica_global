# Contenido editable — LogiLearn

Esta carpeta es el **punto de edición para el profesor** (sin tocar código).

- **`EDITAR_PROFESOR.xlsx`** — Archivo principal que edita el profesor (solo columna D). Una hoja por módulo + `00_Config` para elegir símbolos vs literal por módulo. Abrir con Excel / Google Sheets / LibreOffice en navegador.
- **`EDITAR_PROFESOR.md`** — Fallback texto plano si no tiene Excel (mismo contenido).
- **`GUIA_PROFESOR.md`** — Instrucciones de 1 página para el profesor (cómo editar, ejemplos, flujo con aprobación).
- **`../src/content/site.json`** — Fuente de verdad que consume la app. **No editar a mano**; se genera/aplica vía scripts.

## Scripts (para el estudiante / mantenedor)

```bash
npm run content:gen       # regenera EDITAR_PROFESOR.xlsx/md desde src/content/site.json
npm run content:validate  # valida rigor básico y modoLiteral por módulo
npm run content:apply     # aplica content/EDITAR_PROFESOR.xlsx -> src/content/site.json (solo celdas con propuesta)
npm run content:apply -- content/OTRO.xlsx  # aplica otro archivo
```

## Flujo con aprobación (como acordado)

1. Profesor edita `EDITAR_PROFESOR.xlsx` (solo columna D) y envía por Drive/Email/WhatsApp.
2. Estudiante:
   ```bash
   npm run content:apply          # aplica cambios
   npm run content:validate
   npm run type-check && npm test
   git checkout -b content/profesor-YYYY-MM-DD
   git add src/content/site.json content/EDITAR_PROFESOR.xlsx
   git commit -m "content: aplica correcciones profesor YYYY-MM-DD"
   gh pr create --fill
   ```
3. Profesor da OK por chat tras ver captura/preview del PR.
4. Merge a `main` → deploy automático a GitHub Pages (~2 min).

## Modo literal por módulo

Cada módulo tiene `modoLiteral` booleano en `src/content/site.json` y en hoja `00_Config`:
- `false` = muestra símbolos formales (∀, ∃, →, ∧, ∨, ↔)
- `true` = muestra versión literal ("para todo", "existe", "entonces", "y", "o", "si y solo si")

El profesor elige por módulo. Ej: `cuantificadores.modoLiteral=true` hace que la tarjeta y el header digan "para todo / existe" en vez de "∀ / ∃".

## Estructura site.json

```json
{
  "global": { "marca", "nav", "footer" },
  "home": { "hero", "explora", "sobreNosotros", "modulos", "modoLiteral" },
  "aprender": { "titulo", "conectores": [{ "id","titulo","simbolo","simboloLiteral","definicion","proposicionLiteral" }], "modoLiteral" },
  "tablas": { "header","operadores","clasificacion", "modoLiteral" },
  "cuantificadores": { "header","pestanas","panelCuantificador","dominio", "modoLiteral" },
  "conjuntos": { "header","operaciones","propiedades", "modoLiteral" },
  "inferencias": { "titulo","tituloLiteral","subtitulo","pestanas", "modoLiteral" },
  "leyesPage": { "titulo","subtitulo", "modoLiteral" },
  "leyes": [{ "id","nombre","descripcion","formulas","formulasLiteral" }]
}
```

`src/data/logicLaws.ts` re-exporta `site.leyes` para compatibilidad: `import { LEYES_LOGICAS } from '@/data/logicLaws'` sigue funcionando.

## Inventario rápido de claves editables

- **Home:** `home.hero.*`, `home.modulos.<id>.desc`, `home.sobreNosotros.*` (marco académico, equipos)
- **Aprender:** `aprender.conectores.<c-*.>.definicion`, `proposicionLiteral`, etc. + leyes vía `leyes[*]`
- **Cuantificadores:** `cuantificadores.header.subtituloLiteral`, `pestanas`, `panelCuantificador.*Literal`, `simbolos`
- **Inferencias:** `inferencias.titulo` vs `tituloLiteral`, `subtitulo`, `pestanas.*`
- **Tablas/Conjuntos/Leyes:** headers, explicaciones, operaciones, diagramas

Para ver lista completa: abre `EDITAR_PROFESOR.xlsx` o `src/content/types.ts`.
