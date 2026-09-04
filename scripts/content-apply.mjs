#!/usr/bin/env node
/**
 * Aplica content/EDITAR_PROFESOR.xlsx -> src/content/site.json
 * Solo aplica celdas donde "Texto propuesto" no está vacío.
 * Uso: npm run content:apply  (lee content/EDITAR_PROFESOR.xlsx)
 *      npm run content:apply -- content/OTRO.xlsx
 */
import fs from 'node:fs'
import path from 'node:path'
import ExcelJS from 'exceljs'

const inputXlsx = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve('content/EDITAR_PROFESOR.xlsx')
const sitePath = path.resolve('src/content/site.json')

if (!fs.existsSync(inputXlsx)) {
  console.error(`✗ No existe ${inputXlsx}. Genera uno con: npm run content:gen`)
  process.exit(1)
}
if (!fs.existsSync(sitePath)) {
  console.error(`✗ No existe ${sitePath}`)
  process.exit(1)
}

const site = JSON.parse(fs.readFileSync(sitePath, 'utf-8'))

// Mapa clave -> setter
function setByPath(obj, pathStr, value) {
  // pathStr como "home.hero.titulo" o "home.modulos.tablas.desc" o "leyes[1].nombre" o "aprender.conectores.c-negacion.titulo"
  // Soportamos notación simplificada usada en Excel: "home.hero.titulo", "home.modulos.tablas.desc", "aprender.conectores.c-negacion.titulo", "leyes[1].nombre"
  // Para arrays por id, hacemos lookup.

  // Caso especial: home.hero.stats[0].label -> no lo tenemos en mapa simple, lo manejamos genérico
  // Intentaremos parsear con regex

  // Si es leyes[ID].campo
  const leyesMatch = pathStr.match(/^leyes\[(\d+)\]\.(.+)$/)
  if (leyesMatch) {
    const id = Number(leyesMatch[1])
    const campo = leyesMatch[2] // nombre, descripcion, descripcionFormal, formulas
    const ley = site.leyes.find(l => l.id === id)
    if (!ley) { console.warn(`⚠ ley id=${id} no encontrada para ${pathStr}`); return }
    if (campo === 'formulas') {
      ley.formulas = value.split('|').map(s => s.trim()).filter(Boolean)
    } else {
      ley[campo] = value
    }
    return
  }

  // Si es home.modulos.<id>.<campo>
  const modMatch = pathStr.match(/^home\.modulos\.([^.]+)\.(.+)$/)
  if (modMatch) {
    const mid = modMatch[1]
    const campo = modMatch[2]
    const mod = site.home.modulos.find(m => m.id === mid)
    if (!mod) { console.warn(`⚠ modulo ${mid} no encontrado`); return }
    mod[campo] = value
    return
  }

  // Si es aprender.conectores.<id>.<campo>
  const conMatch = pathStr.match(/^aprender\.conectores\.([^.]+)\.(.+)$/)
  if (conMatch) {
    const cid = conMatch[1]
    const campo = conMatch[2]
    const c = site.aprender.conectores.find(x => x.id === cid)
    if (!c) { console.warn(`⚠ conector ${cid} no encontrado`); return }
    c[campo] = value
    return
  }

  // Si es cuantificadores.simbolos[ idx ] -> no editable individual, ignorar? Pero lo tenemos como lista
  // No lo usamos

  // Si es conjuntos.operaciones.<key>.label etc -> buscamos en items / potenciaOpciones
  const conjOpMatch = pathStr.match(/^conjuntos\.operaciones\.([^.]+)\.label$/)
  if (conjOpMatch) {
    const key = conjOpMatch[1]
    const item = site.conjuntos.operaciones.items.find(x => x.key === key)
    if (item) { item.label = value; return }
    const pot = site.conjuntos.operaciones.potenciaOpciones.find(x => x.key === key)
    if (pot) { pot.label = value; return }
  }

  // Genérico por puntos: a.b.c
  const parts = pathStr.split('.')
  let cur = site
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    // manejar stats[0] etc
    const arrMatch = p.match(/^(.+)\[(\d+)\]$/)
    if (arrMatch) {
      const arrName = arrMatch[1]
      const idx = Number(arrMatch[2])
      cur = cur[arrName][idx]
    } else {
      if (!(p in cur)) { console.warn(`⚠ path no encontrado: ${pathStr} (falta ${p})`); return }
      cur = cur[p]
    }
  }
  const last = parts[parts.length - 1]
  const arrLast = last.match(/^(.+)\[(\d+)\]$/)
  if (arrLast) {
    const arrName = arrLast[1]
    const idx = Number(arrLast[2])
    cur[arrName][idx] = value
  } else {
    if (!(last in cur) && typeof cur === 'object') {
      // permitir crear formulasLiteral etc
      cur[last] = value
    } else {
      cur[last] = value
    }
  }
}

async function apply() {
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(inputXlsx)

  let cambios = 0
  const cambiosLog = []

  // 00_Config
  const wsConfig = wb.getWorksheet('00_Config')
  if (wsConfig) {
    wsConfig.eachRow((row, rowNumber) => {
      if (rowNumber <= 1) return // header rows
      const modulo = row.getCell(1).value?.toString().trim()
      const clave = row.getCell(2).value?.toString().trim() // ej home.modoLiteral
      if (!clave || clave === 'Clave modoLiteral' || clave === 'Módulo') return
      const propuestoRaw = row.getCell(4).value
      if (propuestoRaw === null || propuestoRaw === undefined) return
      const propuesto = propuestoRaw.toString().trim()
      if (!propuesto) return
      if (propuesto === 'Cambiar a (dejar vacío si no cambia)') return
      const boolVal = propuesto.toLowerCase() === 'true'
      // clave es como "home.modoLiteral"
      const [mod, field] = clave.split('.')
      if (site[mod] && field === 'modoLiteral') {
        const old = site[mod][field]
        site[mod][field] = boolVal
        if (old !== boolVal) {
          cambios++
          cambiosLog.push(`${clave}: ${old} -> ${boolVal}`)
        }
      }
    })
  }

  // Otras hojas
  for (const ws of wb.worksheets) {
    if (ws.name === '00_Config' || ws.name === '00_Instrucciones') continue
    ws.eachRow((row, rowNumber) => {
      if (rowNumber <= 1) return // header único tras fix
      const claveRaw = row.getCell(1).value
      if (!claveRaw) return
      const clave = claveRaw.toString().trim()
      if (!clave || clave === 'Clave') return
      const propuesto = row.getCell(4).value
      if (propuesto === null || propuesto === undefined) return
      const propStr = propuesto.toString().trim()
      if (propStr === '' || propStr === 'Texto propuesto (EDITAR AQUÍ)' || propStr === 'Texto propuesto') return
      // Aplicar
      const before = JSON.stringify(site).length // dummy
      try {
        setByPath(site, clave, propStr)
        cambios++
        cambiosLog.push(`${clave} -> "${propStr.slice(0,60)}${propStr.length>60?'…':''}"`)
      } catch (e) {
        console.warn(`⚠ error aplicando ${clave}: ${e.message}`)
      }
    })
  }

  if (cambios === 0) {
    console.log('ℹ No se detectaron cambios (columna D vacía). Nada que aplicar.')
    return
  }

  // Backup
  const backupPath = sitePath + '.bak-' + new Date().toISOString().slice(0,10)
  fs.copyFileSync(sitePath, backupPath)
  console.log(`✓ Backup creado: ${backupPath}`)

  fs.writeFileSync(sitePath, JSON.stringify(site, null, 2) + '\n')
  console.log(`✓ Aplicados ${cambios} cambios a ${sitePath}`)
  console.log(cambiosLog.slice(0,50).join('\n'))
  if (cambiosLog.length > 50) console.log(`... y ${cambiosLog.length-50} más`)

  console.log('\nSiguiente paso: npm run content:validate && npm run type-check && npm test')
}

apply().catch(e => { console.error(e); process.exit(1) })
