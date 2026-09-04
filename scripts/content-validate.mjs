#!/usr/bin/env node
/**
 * Valida src/content/site.json contra reglas de rigor y modoLiteral por módulo.
 * Uso: npm run content:validate
 */
import fs from 'node:fs'
import path from 'node:path'

const sitePath = path.resolve('src/content/site.json')

function fail(msg) {
  console.error(`✗ ${msg}`)
  process.exitCode = 1
}
function ok(msg) {
  console.log(`✓ ${msg}`)
}

if (!fs.existsSync(sitePath)) {
  fail(`No existe ${sitePath}`)
  process.exit(1)
}

const raw = fs.readFileSync(sitePath, 'utf-8')
let site
try {
  site = JSON.parse(raw)
} catch (e) {
  fail(`JSON inválido en site.json: ${e.message}`)
  process.exit(1)
}

// Validaciones básicas
const modulos = ['home', 'aprender', 'tablas', 'cuantificadores', 'conjuntos', 'inferencias', 'leyesPage']
for (const m of modulos) {
  if (!(m in site)) fail(`Falta módulo "${m}" en site.json`)
  else if (typeof site[m].modoLiteral !== 'boolean') fail(`"${m}.modoLiteral" debe ser boolean`)
  else ok(`módulo ${m} presente (modoLiteral=${site[m].modoLiteral})`)
}

// Home
if (!site.home?.hero?.titulo) fail('home.hero.titulo vacío')
if (!site.home?.modulos?.length) fail('home.modulos vacío')
else ok(`home.modulos: ${site.home.modulos.length} items`)

// Aprender conectores
if (!site.aprender?.conectores?.length) fail('aprender.conectores vacío')
else {
  for (const c of site.aprender.conectores) {
    if (!c.id || !c.titulo || !c.definicion) fail(`conector sin id/titulo/definicion: ${JSON.stringify(c).slice(0,120)}`)
    if (!c.simbolo || !c.simboloLiteral) fail(`conector ${c.id} sin simbolo/simboloLiteral`)
  }
  ok(`aprender.conectores: ${site.aprender.conectores.length} OK`)
}

// Cuantificadores: si modoLiteral, no debería contener símbolos en subtituloLiteral?
if (site.cuantificadores?.modoLiteral) {
  const sub = site.cuantificadores.header?.subtituloLiteral ?? ''
  const forbidden = ['∀','∃','→','∧','∨']
  for (const s of forbidden) {
    if (sub.includes(s)) fail(`cuantificadores.modoLiteral=true pero subtituloLiteral contiene "${s}": ${sub}`)
  }
  ok('cuantificadores modoLiteral chequeado')
}

// Leyes
if (!Array.isArray(site.leyes) || site.leyes.length < 12) fail(`leyes debe tener >=12, tiene ${site.leyes?.length}`)
else {
  const ids = new Set(site.leyes.map(l => l.id))
  if (ids.size !== site.leyes.length) fail('leyes con ids duplicados')
  else ok(`leyes: ${site.leyes.length} OK`)
  for (const l of site.leyes) {
    if (!l.nombre || !l.descripcion || !l.formulas?.length) fail(`ley id=${l.id} incompleta`)
  }
}

// Inferencias: titulo vs tituloLiteral
if (!site.inferencias?.titulo || !site.inferencias?.tituloLiteral) fail('inferencias.titulo/tituloLiteral requerido')
else ok('inferencias títulos OK')

// Conjuntos, tablas
if (!site.conjuntos?.header?.titulo) fail('conjuntos.header.titulo vacío')
if (!site.tablas?.header?.titulo) fail('tablas.header.titulo vacío')

if (process.exitCode) {
  console.error('\nValidación falló. Corrige src/content/site.json antes de hacer commit.')
} else {
  console.log('\n✓ Validación de contenido superada.')
}
