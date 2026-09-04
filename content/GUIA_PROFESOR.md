# Guía para el Profesor — Editar textos sin tocar código

> **Tiempo estimado:** 10 minutos. **No necesitas GitHub, ni instalar nada.** Solo navegador (Excel, Google Sheets o LibreOffice).

## ¿Qué es este archivo?
`EDITAR_PROFESOR.xlsx` es la **única** fuente que debes editar. Contiene **todos** los textos visibles de la plataforma: página principal, y cada submódulo (Tablas, Cuantificadores, Conjuntos, Inferencias, Aprender, Leyes).

Si no puedes abrir Excel, usa el fallback `EDITAR_PROFESOR.md` (mismo contenido en texto plano).

## Paso a paso (solo navegador)

1. **Abre `EDITAR_PROFESOR.xlsx`**  
   - Con doble clic si tienes Excel.  
   - O súbelo a Google Drive → Abrir con Google Sheets.  
   - O usa LibreOffice (gratis).

2. **Ve hoja por hoja** (`00_Config`, `01_Home`, `02_Aprender`, `03_Tablas`, `04_Cuantificadores`, `05_Conjuntos`, `06_Inferencias`, `07_Leyes`, `08_Global`).  
   Cada fila es: `Clave | Ubicación | Texto actual | Texto propuesto ← EDITAR AQUÍ | Notas`.

3. **Edita SOLO la columna D "Texto propuesto (EDITAR AQUÍ)"**  
   - Deja vacío si **no** quieres cambiar ese texto.  
   - Escribe tu versión con el rigor matemático que quieres.  
   - Ejemplo `04_Cuantificadores` — fila `cuantificadores.header.subtituloLiteral`:  
     Actual: `Evalúa cuantificadores ∀ y ∃ sobre dominios finitos`  
     Propuesto: `Evalúa cuantificadores para todo y existe sobre dominios finitos`

4. **Hoja `00_Config` — elige símbolos o literal por módulo**  
   Esta hoja controla si un módulo muestra símbolos (∀, →, ∧) o palabras (para todo, entonces, y).  
   - `false` = muestra símbolos.  
   - `true` = muestra literal.  
   - Ejemplo: poner `cuantificadores.modoLiteral = true` hace que la tarjeta diga "Evalúa **para todo** y **existe**" en vez de "∀ y ∃".  
   - Puedes poner `true` solo en los módulos que quieras (ej: cuantificadores y aprender sí, tablas no).

5. **Guarda y envía**  
   Guarda el Excel y envíalo a **Enrique** por Drive, Email o WhatsApp.  
   > No se publica automáticamente. Enrique lo revisará antes.

6. **¿Dudas?** Escribe en la columna E "Notas" tu duda (ej: "¿esta definición es suficientemente rigurosa? Iff?") y Enrique la ve.

## Ejemplos concretos que pediste

| Dónde | Clave en Excel | Qué cambiar | Ejemplo |
|---|---|---|---|
| Tarjeta Cuantificadores | `home.modulos.cuantificadores.desc` | Descripción de la tarjeta | De `Evalúa ∀ y ∃...` a `Evalúa para todo y existe...` (o activa `cuantificadores.modoLiteral=true` para que lo haga automático) |
| Definiciones Aprender | `aprender.conectores.c-condicional.definicion` | Definición de condicional/bicondicional | De coloquial a formal: `p → q ≡ ¬p ∨ q; falsa solo si p≡V y q≡F` |
| Inferencias titulo | `inferencias.titulo` / `inferencias.tituloLiteral` | "Demostrador" vs "Validador" | Cambia `Demostrador de Inferencias` a `Validador` o activa `inferencias.modoLiteral=true` para que muestre `Validador` |
| Hero descripción | `home.hero.descripcion` | Párrafo grande del inicio | Ajusta el tono académico |

## Flujo con aprobación (como pediste)

```
Tú editas Excel → Envías a Enrique → Enrique ejecuta: npm run content:apply + valida + abre Pull Request → Te manda captura → Tú das OK por chat → Enrique hace merge → se publica en 2 min en GitHub Pages
```

- Tú **no necesitas** GitHub ni preview en tu PC.  
- Enrique valida antes de publicar (rigor, ortografía, fórmulas).  
- Historial: cada cambio queda en Pull Request para revisar.

## Consejos de rigor matemático

- Usa "si y solo si (iff)", "para toda proposición p", "V/F", "D ⊂ ℤ" cuando corresponda.  
- Para fórmulas, mantén símbolos estándar: `¬, ∧, ∨, →, ↔, ≡, ∀, ∃`. Si prefieres literal, activa `modoLiteral` o escribe la versión literal en la columna D.  
- Separador de fórmulas en leyes: usa ` | ` (ej: `p ∧ p ≡ p | p ∨ p ≡ p`).

## Fallback sin Excel

Si no puedes abrir `.xlsx`, abre `EDITAR_PROFESOR.md`, busca la sección, y escribe tu texto en la columna "Propuesto" (mismo flujo, pero Excel es más cómodo).

## Soporte

Cualquier duda: escribe en columna E o contacta a Enrique (EnriDiazCayaca). No borres filas ni columnas A-C.

---

*Archivo generado automáticamente desde `src/content/site.json`. No edites `site.json` directamente; edita siempre el Excel.*
