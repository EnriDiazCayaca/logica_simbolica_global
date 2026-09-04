import raw from './site.json'
import type { SiteContent } from './types'

export const siteContent: SiteContent = raw as SiteContent

// Helpers para modo literal por módulo
export function displayTexto(valor: string, literal: string | undefined, modoLiteral: boolean): string {
  if (modoLiteral && literal) return literal
  return valor
}

// Leyes expuestas para compatibilidad con imports existentes
export type { LeyLogicaEditable as LeyLogica } from './types'
export const LEYES_DESDE_CONTENIDO = siteContent.leyes

// Helpers específicos
export function tituloHome(): string {
  return siteContent.home.hero.titulo
}
export function simboloConector(id: string): string {
  const c = siteContent.aprender.conectores.find(x => x.id === id)
  if (!c) return ''
  return siteContent.aprender.modoLiteral ? c.simboloLiteral : c.simbolo
}
export function tituloInferencias(): string {
  return siteContent.inferencias.modoLiteral ? siteContent.inferencias.tituloLiteral : siteContent.inferencias.titulo
}
export function subtituloCuantificadores(): string {
  return siteContent.cuantificadores.modoLiteral
    ? siteContent.cuantificadores.header.subtituloLiteral
    : siteContent.cuantificadores.header.subtitulo
}
