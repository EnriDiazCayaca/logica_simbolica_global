#!/usr/bin/env node
/**
 * Genera content/EDITAR_PROFESOR.xlsx a partir de src/content/site.json
 * Una hoja por módulo + hoja Instrucciones + hoja Config (modoLiteral por módulo)
 * Uso: npm run content:gen
 */
import fs from 'node:fs'
import path from 'node:path'
import ExcelJS from 'exceljs'

const sitePath = path.resolve('src/content/site.json')
const outXlsx = path.resolve('content/EDITAR_PROFESOR.xlsx')
const outMd = path.resolve('content/EDITAR_PROFESOR.md')

const site = JSON.parse(fs.readFileSync(sitePath, 'utf-8'))

// Helper para aplanar contenido en filas editables
// Cada fila: Clave | Ubicación | Texto actual | Texto propuesto (vacío) | Notas | Modo literal afecta?
function filasParaHoja() {
  const sheets = []

  // Config sheet: modoLiteral por módulo
  sheets.push({
    name: '00_Config',
    headers: ['Módulo', 'Clave modoLiteral', 'Valor actual (true=literal, false=símbolos)', 'Cambiar a (dejar vacío si no cambia)', 'Notas'],
    rows: [
      ['home', 'home.modoLiteral', String(site.home.modoLiteral), '', 'Afecta a tarjetas y hero'],
      ['aprender', 'aprender.modoLiteral', String(site.aprender.modoLiteral), '', 'Conectores: si true muestra "y/o/entonces" en vez de ∧∨→'],
      ['tablas', 'tablas.modoLiteral', String(site.tablas.modoLiteral), '', 'Operadores'],
      ['cuantificadores', 'cuantificadores.modoLiteral', String(site.cuantificadores.modoLiteral), '', 'Si true, "Evalúa para todo y existe" en vez de ∀∃'],
      ['conjuntos', 'conjuntos.modoLiteral', String(site.conjuntos.modoLiteral), '', 'Operaciones A ∪ B vs A unión B'],
      ['inferencias', 'inferencias.modoLiteral', String(site.inferencias.modoLiteral), '', 'Demostrador vs Validador, Simbología vs Notación formal'],
      ['leyesPage', 'leyesPage.modoLiteral', String(site.leyesPage.modoLiteral), '', 'Fórmulas con símbolos vs literales'],
    ]
  })

  // Home
  sheets.push({
    name: '01_Home',
    headers: ['Clave', 'Ubicación', 'Texto actual', 'Texto propuesto (EDITAR AQUÍ)', 'Notas para rigor'],
    rows: [
      ['home.hero.badge', 'Home > Hero badge', site.home.hero.badge, '', ''],
      ['home.hero.titulo', 'Home > Hero título', site.home.hero.titulo, '', 'Título principal, pide rigor si aplica'],
      ['home.hero.descripcion', 'Home > Hero descripción', site.home.hero.descripcion, '', 'Descripción larga, aquí quieres rigor matemático?'],
      ['home.hero.ctaPrimario.label', 'Home > Botón primario', site.home.hero.ctaPrimario.label, '', ''],
      ['home.hero.ctaSecundario.label', 'Home > Botón secundario', site.home.hero.ctaSecundario.label, '', ''],
      ...site.home.hero.stats.map((s, i) => [`home.hero.stats[${i}].label`, `Home > Stat ${s.valor}`, s.label, '', '']),
      ['home.explora.titulo', 'Home > Explora título', site.home.explora.titulo, '', ''],
      ['home.explora.subtitulo', 'Home > Explora subtitulo', site.home.explora.subtitulo, '', ''],
      ...site.home.modulos.map(m => [`home.modulos.${m.id}.desc`, `Home > Módulo ${m.nombre}`, m.desc, '', m.id === 'cuantificadores' ? 'Aquí estaba "Evalúa ∀ y ∃" — cambia a literal si modoLiteral=true' : '']),
      ...site.home.modulos.map(m => [`home.modulos.${m.id}.nombre`, `Home > Módulo ${m.id} nombre`, m.nombre, '', '']),
      ['home.sobreNosotros.titulo', 'Home > Sobre Nosotros título', site.home.sobreNosotros.titulo, '', ''],
      ['home.sobreNosotros.subtitulo', 'Home > Sobre Nosotros subtitulo', site.home.sobreNosotros.subtitulo, '', ''],
      ['home.sobreNosotros.marcoTitulo', 'Home > Marco académico título', site.home.sobreNosotros.marcoTitulo, '', ''],
      ...Object.entries(site.home.sobreNosotros.marco).map(([k,v]) => [`home.sobreNosotros.marco.${k}`, `Home > Marco ${k}`, v, '', '']),
      ...site.home.sobreNosotros.equipos.map((eq,i) => [`home.sobreNosotros.equipos[${i}].tema`, `Home > Equipo ${eq.nombre} tema`, eq.tema, '', '']),
      ['home.footer', 'Home > Footer', site.home.footer, '', ''],
    ]
  })

  // Aprender conectores
  sheets.push({
    name: '02_Aprender',
    headers: ['Clave', 'Ubicación', 'Texto actual (símbolo)', 'Texto propuesto (EDITAR AQUÍ)', 'Notas / Rigor'],
    rows: [
      ['aprender.titulo', 'Aprender > Título', site.aprender.titulo, '', ''],
      ['aprender.subtitulo', 'Aprender > Subtítulo', site.aprender.subtitulo, '', ''],
      ...site.aprender.conectores.flatMap(c => [
        [`aprender.conectores.${c.id}.titulo`, `Conector ${c.titulo} > título`, c.titulo, '', ''],
        [`aprender.conectores.${c.id}.definicion`, `Conector ${c.titulo} > definición`, c.definicion, '', 'Aquí pide rigor: definición formal opcional en columna Notas'],
        [`aprender.conectores.${c.id}.definicionFormal`, `Conector ${c.titulo} > def. formal`, c.definicionFormal ?? '', '', 'Ej: "p ∧ q ≡ V iff ..."'],
        [`aprender.conectores.${c.id}.proposicion`, `Conector ${c.titulo} > notación`, c.proposicion, '', `Literal: ${c.proposicionLiteral}`],
        [`aprender.conectores.${c.id}.proposicionLiteral`, `Conector ${c.titulo} > literal`, c.proposicionLiteral, '', `Símbolo: ${c.simbolo}`],
      ]),
    ]
  })

  // Tablas
  sheets.push({
    name: '03_Tablas',
    headers: ['Clave', 'Ubicación', 'Texto actual', 'Texto propuesto', 'Notas'],
    rows: [
      ['tablas.header.titulo', 'Tablas > Título', site.tablas.header.titulo, '', ''],
      ['tablas.header.subtitulo', 'Tablas > Subtítulo', site.tablas.header.subtitulo, '', ''],
      ['tablas.input.label', 'Tablas > Input label', site.tablas.input.label, '', ''],
      ['tablas.input.placeholder', 'Tablas > Placeholder', site.tablas.input.placeholder, '', ''],
      ['tablas.input.boton', 'Tablas > Botón', site.tablas.input.boton, '', ''],
      ['tablas.info.clasificacionTitulo', 'Tablas > Clasificación título', site.tablas.info.clasificacionTitulo, '', ''],
      ...Object.entries(site.tablas.clasificacion).map(([k,v]) => [`tablas.clasificacion.${k}.etiqueta`, `Clasificación ${k} etiqueta`, v.etiqueta, '', '']),
      ...Object.entries(site.tablas.clasificacion).map(([k,v]) => [`tablas.clasificacion.${k}.explicacion`, `Clasificación ${k} explicación`, v.explicacion, '', 'Aquí rigor: tautología vs contingencia']),
      ['tablas.explicacion.titulo', 'Tablas > Explicación título', site.tablas.explicacion.titulo, '', ''],
      ['tablas.explicacion.detalle', 'Tablas > Explicación detalle', site.tablas.explicacion.detalle, '', 'Precedencia ¬ > ∧ > ∨ > → > ↔'],
    ]
  })

  // Cuantificadores - foco profesor
  sheets.push({
    name: '04_Cuantificadores',
    headers: ['Clave', 'Ubicación', 'Texto actual', 'Texto propuesto', 'Notas (literal vs símbolo)'],
    rows: [
      ['cuantificadores.header.titulo', 'Cuant > Título', site.cuantificadores.header.titulo, '', ''],
      ['cuantificadores.header.subtitulo', 'Cuant > Subtítulo (símbolos)', site.cuantificadores.header.subtitulo, '', 'Se muestra si modoLiteral=false'],
      ['cuantificadores.header.subtituloLiteral', 'Cuant > Subtítulo literal', site.cuantificadores.header.subtituloLiteral, '', 'Se muestra si modoLiteral=true — EJEMPLO: "Evalúa para todo y existe..."'],
      ['cuantificadores.pestanas.cuantificadores', 'Cuant > Pestaña simbólica', site.cuantificadores.pestanas.cuantificadores, '', ''],
      ['cuantificadores.pestanas.cuantificadoresLiteral', 'Cuant > Pestaña literal', site.cuantificadores.pestanas.cuantificadoresLiteral, '', ''],
      ['cuantificadores.pestanas.leyes', 'Cuant > Pestaña leyes', site.cuantificadores.pestanas.leyes, '', ''],
      ['cuantificadores.panelCuantificador.universal', 'Cuant > Universal', site.cuantificadores.panelCuantificador.universal, '', ''],
      ['cuantificadores.panelCuantificador.universalLiteral', 'Cuant > Para todo', site.cuantificadores.panelCuantificador.universalLiteral, '', ''],
      ['cuantificadores.panelCuantificador.existencial', 'Cuant > Existencial', site.cuantificadores.panelCuantificador.existencial, '', ''],
      ['cuantificadores.panelCuantificador.existencialLiteral', 'Cuant > Existe', site.cuantificadores.panelCuantificador.existencialLiteral, '', ''],
      ['cuantificadores.dominio.titulo', 'Cuant > Dominio título', site.cuantificadores.dominio.titulo, '', ''],
      ['cuantificadores.dominio.ayuda', 'Cuant > Dominio ayuda', site.cuantificadores.dominio.ayuda, '', ''],
      ['cuantificadores.predicado.titulo', 'Cuant > Predicado título', site.cuantificadores.predicado.titulo, '', ''],
      ['cuantificadores.botones.evaluar', 'Cuant > Botón evaluar', site.cuantificadores.botones.evaluar, '', ''],
      ...site.cuantificadores.simbolos.map((s,i) => [`cuantificadores.simbolos[${i}]`, `Símbolo ${s}`, s, '', `Literal: ${site.cuantificadores.simbolosLiteral[i]}`]),
    ]
  })

  // Conjuntos
  sheets.push({
    name: '05_Conjuntos',
    headers: ['Clave', 'Ubicación', 'Texto actual', 'Texto propuesto', 'Notas'],
    rows: [
      ['conjuntos.header.titulo', 'Conjuntos > Título', site.conjuntos.header.titulo, '', ''],
      ['conjuntos.header.subtitulo', 'Conjuntos > Subtítulo', site.conjuntos.header.subtitulo, '', ''],
      ['conjuntos.define.titulo', 'Conjuntos > Define título', site.conjuntos.define.titulo, '', ''],
      ...site.conjuntos.operaciones.items.map(o => [`conjuntos.operaciones.${o.key}.label`, `Op ${o.key}`, o.label, '', `Literal: ${o.labelLiteral}`]),
      ['conjuntos.diagrama.titulo', 'Conjuntos > Diagrama', site.conjuntos.diagrama.titulo, '', ''],
      ['conjuntos.resultado.titulo', 'Conjuntos > Resultado título', site.conjuntos.resultado.titulo, '', ''],
      ['conjuntos.propiedades.titulo', 'Conjuntos > Propiedades título', site.conjuntos.propiedades.titulo, '', ''],
      ['conjuntos.pertenencia.titulo', 'Conjuntos > Pertenencia título', site.conjuntos.pertenencia.titulo, '', ''],
    ]
  })

  // Inferencias - foco profesor
  sheets.push({
    name: '06_Inferencias',
    headers: ['Clave', 'Ubicación', 'Texto actual', 'Texto propuesto', 'Notas'],
    rows: [
      ['inferencias.titulo', 'Inferencias > Título (símbolos)', site.inferencias.titulo, '', 'Ej: Demostrador — se muestra si modoLiteral=false'],
      ['inferencias.tituloLiteral', 'Inferencias > Título literal', site.inferencias.tituloLiteral, '', 'Ej: Validador — se muestra si modoLiteral=true'],
      ['inferencias.subtitulo', 'Inferencias > Subtítulo', site.inferencias.subtitulo, '', 'Gran parte aquí quiere cambiarlo el profesor'],
      ['inferencias.pestanas.simbolos', 'Inferencias > Pestaña simbología', site.inferencias.pestanas.simbolos, '', ''],
      ['inferencias.pestanas.simbolosLiteral', 'Inferencias > Pestaña literal', site.inferencias.pestanas.simbolosLiteral, '', ''],
      ['inferencias.pestanas.lenguaje', 'Inferencias > Pestaña lenguaje', site.inferencias.pestanas.lenguaje, '', ''],
      ['inferencias.pestanas.arbol', 'Inferencias > Pestaña AST', site.inferencias.pestanas.arbol, '', ''],
      ['inferencias.badge', 'Inferencias > Badge', site.inferencias.badge, '', ''],
      ['inferencias.trazabilidad.tituloValida', 'Inferencias > Trazabilidad válida', site.inferencias.trazabilidad.tituloValida, '', ''],
      ['inferencias.trazabilidad.tituloInvalida', 'Inferencias > Trazabilidad inválida', site.inferencias.trazabilidad.tituloInvalida, '', ''],
    ]
  })

  // Leyes
  sheets.push({
    name: '07_Leyes',
    headers: ['Clave', 'Ubicación', 'Texto actual', 'Texto propuesto', 'Notas rigor'],
    rows: [
      ['leyesPage.titulo', 'Leyes > Título', site.leyesPage.titulo, '', ''],
      ['leyesPage.subtitulo', 'Leyes > Subtítulo', site.leyesPage.subtitulo, '', ''],
      ...site.leyes.flatMap(l => [
        [`leyes[${l.id}].nombre`, `Ley ${l.id} nombre`, l.nombre, '', ''],
        [`leyes[${l.id}].descripcion`, `Ley ${l.id} descripción`, l.descripcion, '', `Formal: ${l.descripcionFormal ?? ''}`],
        [`leyes[${l.id}].descripcionFormal`, `Ley ${l.id} desc. formal`, l.descripcionFormal ?? '', '', 'Si la llena, se muestra en modoLiteral'],
        [`leyes[${l.id}].formulas`, `Ley ${l.id} fórmulas`, l.formulas.join(' | '), '', `Literal: ${(l.formulasLiteral ?? []).join(' | ')}`],
      ]),
    ]
  })

  // Global nav
  sheets.push({
    name: '08_Global',
    headers: ['Clave', 'Ubicación', 'Texto actual', 'Texto propuesto', 'Notas'],
    rows: [
      ['global.marca.titulo', 'Nav > Marca Logi', site.global.marca.titulo, '', ''],
      ['global.marca.subtitulo', 'Nav > Subtítulo', site.global.marca.subtitulo, '', ''],
      ...site.global.nav.map((n,i) => [`global.nav[${i}].label`, `Nav > ${n.to}`, n.label, '', '']),
      ['global.footer', 'Footer', site.global.footer, '', ''],
    ]
  })

  return sheets
}

async function buildXlsx() {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'LogiLearn content generator'
  wb.created = new Date()

  // Hoja Instrucciones
  const ws0 = wb.addWorksheet('00_Instrucciones', { properties: { tabColor: { argb: 'FF0F2D8C' } } })
  ws0.columns = [{ width: 120 }]
  const instrucciones = [
    ['INSTRUCCIONES PARA EL PROFESOR — EDITAR TEXTOS (sin GitHub)'],
    [''],
    ['Este archivo es la ÚNICA fuente que debes editar. No toques código.'],
    ['1. Ve hoja por hoja (00_Config, 01_Home, 02_Aprender, ...).'],
    ['2. Edita SOLO la columna D "Texto propuesto (EDITAR AQUÍ)". Deja vacío si no quieres cambiar.'],
    ['3. Hoja 00_Config: elige por módulo si quieres símbolos (false) o literal (true). Ej: cuantificadores=true muestra "para todo" en vez de ∀.'],
    ['4. Columnas A-C están protegidas (clave, ubicación, texto actual). No las borres.'],
    ['5. Cuando termines, guarda y envía este Excel a Enrique por Drive/Email/WhatsApp. Él lo revisará antes de publicar (PR).'],
    ['6. No necesitas instalar nada: abre con Excel, Google Sheets o LibreOffice en el navegador.'],
    ['7. Consejos de rigor: usa definiciones formales "iff", "para toda p", notación "p ∧ q ≡ V iff ...", indica dominio D ⊂ ℤ, etc. La columna E es para notas.'],
    [''],
    ['Flujo: Tú editas → Enrique aplica con npm run content:apply → abre Pull Request → tú das OK por chat → se publica en 2 min.'],
    ['Soporte: si dudas, escribe en la columna E tu duda y Enrique la ve.'],
  ]
  instrucciones.forEach(r => ws0.addRow(r))
  ws0.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF0F2D8C' } }
  ws0.getRow(1).height = 22

  const sheets = filasParaHoja()
  for (const sh of sheets) {
    const ws = wb.addWorksheet(sh.name, { properties: { tabColor: { argb: 'FF2563EB' } } })
    // headers — definir columnas sin header para evitar duplicado (ExcelJS crea fila header si usas header:xxx)
    const widths = [28, 32, 60, 60, 36]
    ws.columns = sh.headers.map((h, i) => ({ key: `c${i}`, width: widths[i] ?? 30 }))
    const headerRow = ws.addRow(sh.headers)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F2D8C' } }
    headerRow.alignment = { vertical: 'middle', wrapText: true }
    headerRow.height = 22
    ws.views = [{ state: 'frozen', ySplit: 1 }]
    ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: sh.headers.length } }

    for (const row of sh.rows) {
      const r = ws.addRow(row)
      // columna D editable (índice 3) en amarillo claro
      const cellD = r.getCell(4)
      cellD.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFDE7' } }
      cellD.border = { left: { style: 'thin', color: { argb: 'FFEAB308' } }, right: { style: 'thin', color: { argb: 'FFEAB308' } }, top: { style: 'thin', color: { argb: 'FFEAB308' } }, bottom: { style: 'thin', color: { argb: 'FFEAB308' } } }
      r.alignment = { vertical: 'top', wrapText: true }
      // columnas A-C gris claro (no editar)
      for (let i = 1; i <= 3; i++) {
        r.getCell(i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } }
        r.getCell(i).font = { color: { argb: 'FF475569' }, size: 9 }
      }
      r.getCell(4).font = { size: 10 }
      r.getCell(5).font = { size: 9, italic: true, color: { argb: 'FF64748B' } }
    }

    // Ajustar ancho de texto propuesto para que sea grande
    ws.getColumn(4).width = 70
    ws.getColumn(3).width = 60
  }

  await wb.xlsx.writeFile(outXlsx)
  console.log(`✓ Generado ${outXlsx}`)

  // También generar MD fallback (para quien no tenga Excel)
  let md = `# EDITAR_PROFESOR — Textos editables (fallback sin Excel)\n\n`
  md += `> Si no puedes abrir el Excel, edita este .md y envíalo. Pero preferible usar el .xlsx.\n\n`
  md += `Instrucciones: cambia solo el campo "propuesto" y envía.\n\n`
  md += `## 00_Config (modoLiteral por módulo)\n`
  for (const row of sheets[0].rows) {
    md += `- **${row[0]}** actual=\`${row[2]}\` → propuesto: \`\` (notas: ${row[4]})\n`
  }
  for (const sh of sheets.slice(1)) {
    md += `\n## ${sh.name}\n`
    md += `| Clave | Texto actual | Propuesto |\n|---|---|---|\n`
    for (const r of sh.rows) {
      const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ')
      md += `| ${esc(r[0])} | ${esc(r[2])} |  |\n`
    }
  }
  fs.writeFileSync(outMd, md)
  console.log(`✓ Generado ${outMd}`)
}

buildXlsx().catch(e => { console.error(e); process.exit(1) })
