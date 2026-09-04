// Tipos centrales para todo el contenido editable por el profesor.
// Cada módulo tiene su flag `modoLiteral` para decidir si muestra símbolos (∀, →, ∧)
// o la versión literal ("para todo", "entonces", "y").

export interface NavLink {
  label: string
  to: string
}

export interface GlobalContent {
  marca: {
    titulo: string // ej "LogiLearn"
    tituloResaltado: string // ej "Learn" (parte en negrita)
    subtitulo: string // ej "Leyes lógicas y tablas de verdad"
  }
  nav: NavLink[]
  footer: string
}

export interface HomeModulo {
  id: string
  nombre: string
  desc: string
}

export interface HomeEquipo {
  nombre: string
  sub: string
  miembros: string
  tema: string
}

export interface HomeContent {
  modoLiteral: boolean
  hero: {
    badge: string
    titulo: string
    descripcion: string
    ctaPrimario: { label: string; to: string }
    ctaSecundario: { label: string; to: string }
    stats: Array<{ valor: string; label: string }>
  }
  explora: {
    titulo: string
    subtitulo: string
    textoAbrir: string
  }
  sobreNosotros: {
    titulo: string
    subtitulo: string
    marcoTitulo: string
    marco: {
      universidad: string
      escuela: string
      curso: string
      semestre: string
      creditos: string
      docente: string
    }
    equiposTitulo: string
    equipos: HomeEquipo[]
    infoExtra: {
      liderLabel: string
      liderValor: string
      docenteLabel: string
      docenteValor: string
      contribuidoresNota: string
      repoUrl: string
      repoLabel: string
    }
  }
  footer: string
  modulos: HomeModulo[]
}

export interface ConectorEditable {
  id: string
  titulo: string
  simbolo: string // símbolo formal: ¬, ∧, ∨, →
  simboloLiteral: string // versión literal: "no", "y", "o", "entonces"
  definicion: string
  definicionFormal?: string // opcional rigor matemático extra
  proposicion: string
  proposicionLiteral: string // ej "p y q" vs "p ∧ q"
}

export interface AprenderContent {
  modoLiteral: boolean
  titulo: string
  subtitulo: string
  etiquetasGrupo: Record<string, string>
  pasos: string[] // ["Definición","Ejemplo","Ejercicio","Solución"]
  repaso: {
    titulo: string
    recomendacionPrefix: string
    precisionLabel: string
    reforzarPrefix: string
    practicarBtn: string
  }
  lista: {
    vistoLabel: string
  }
  detalle: {
    notacionLabel: string
  }
  emptyLeyes: string
  conectores: ConectorEditable[]
}

export interface TablasContent {
  modoLiteral: boolean
  header: { titulo: string; subtitulo: string }
  input: { label: string; placeholder: string; boton: string; errorFallback: string }
  operadores: Array<{ simbolo: string; literal: string; etiqueta: string }>
  info: {
    variablesTitulo: string
    variablesVacio: string
    operadoresTitulo: string
    clasificacionTitulo: string
    clasificacionPrefijo: string
    verdaderasEn: string // "Es verdadera (V) en"
    combinaciones: string
  }
  clasificacion: Record<string, { etiqueta: string; explicacion: string }>
  tablaTitulo: string
  explicacion: {
    titulo: string
    verBtn: string
    ocultarBtn: string
    detalle: string
    vacio: string
    footer: string
  }
}

export interface CuantificadoresContent {
  modoLiteral: boolean
  header: { titulo: string; subtitulo: string; subtituloLiteral: string; icono: string }
  pestanas: { cuantificadores: string; cuantificadoresLiteral: string; leyes: string }
  panelCuantificador: {
    titulo: string
    universal: string
    universalLiteral: string
    existencial: string
    existencialLiteral: string
  }
  dominio: {
    titulo: string
    badge: string
    placeholder: string
    ayuda: string
    errorPrefix: string
  }
  predicado: {
    titulo: string
    libreLabel: string
    placeholder: string
    ayuda: string
  }
  simbolosTitulo: string
  simbolos: string[]
  simbolosLiteral: string[]
  botones: { evaluar: string; ejemploSimple: string; ejemploRango: string }
  resultado: {
    verdadero: string
    falso: string
    contraejemplo: string
    testigo: string
    formulaUniversal: string
    formulaExistencial: string
    formulaUniversalLiteral: string
    formulaExistencialLiteral: string
  }
  trazabilidad: { titulo: string; elemento: string; evaluacion: string; resultado: string }
  deMorgan: { titulo: string }
  resolutor: { titulo: string }
  leyesHeader: {
    titulo: string
    badge: string
    descripcion: string
    placeholder: string
    botonResolver: string
    botonEjemplo: string
    vacio: string
    resultadoFinal: string
  }
}

export interface ConjuntosContent {
  modoLiteral: boolean
  navegacion: { volver: string; badge: string }
  header: { titulo: string; subtitulo: string }
  define: {
    titulo: string
    universo: string
    conjuntoA: string
    conjuntoB: string
    placeholders: { universo: string; a: string; b: string }
  }
  operaciones: {
    titulo: string
    selectorPotenciaLabel: string
    items: Array<{ key: string; label: string; labelLiteral: string; desc: string }>
    potenciaOpciones: Array<{ key: string; label: string; labelLiteral: string; desc: string }>
  }
  diagrama: { titulo: string }
  resultado: {
    titulo: string
    totalSubconjuntos: string
    subconjuntosLabel: string
    advertenciaPotencia: string
  }
  propiedades: { titulo: string; items: Array<{ key: string; label: string; labelLiteral: string }> }
  pertenencia: { titulo: string; placeholder: string }
}

export interface InferenciasContent {
  modoLiteral: boolean
  badge: string
  titulo: string
  tituloLiteral: string
  subtitulo: string
  pestanas: {
    simbolos: string
    simbolosLiteral: string
    lenguaje: string
    arbol: string
  }
  historial: {
    botonMostrar: string
    botonOcultar: string
    titulo: string
    limpiar: string
    valida: string
    validaInd: string
    invalida: string
  }
  trazabilidad: {
    tituloValida: string
    tituloInvalida: string
    cargando: string
  }
}

export interface LeyesPageContent {
  modoLiteral: boolean
  titulo: string
  subtitulo: string
  placeholder: string
  empty: string
}

export interface LeyLogicaEditable {
  id: number
  nombre: string
  nombreLiteral?: string
  descripcion: string
  descripcionFormal?: string
  formulas: string[]
  formulasLiteral?: string[]
}

export interface SiteContent {
  global: GlobalContent
  home: HomeContent
  aprender: AprenderContent
  tablas: TablasContent
  cuantificadores: CuantificadoresContent
  conjuntos: ConjuntosContent
  inferencias: InferenciasContent
  leyesPage: LeyesPageContent
  leyes: LeyLogicaEditable[]
}
