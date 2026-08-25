import { computed, reactive, watch } from 'vue'
import { ejercicios, etiquetasTema, claveTemaParaEjercicio, type ClaveTema } from '@/data/exercises'

const STORAGE_PREFIX = 'logilearn:progress:'

export const totalEjercicios = ejercicios.length

interface EstadisticaTema {
  correctas: number
  total: number
}

interface EntradaActividad {
  fecha: string
  etiqueta: string
  correcta: boolean
}

interface RegistroDiario {
  fecha: string
  correctas: number
  total: number
}

interface EstadoProgreso {
  idsCompletados: string[]
  respuestasCorrectas: number
  totalRespuestas: number
  estadisticasTema: Partial<Record<ClaveTema, EstadisticaTema>>
  puntos: number
  racha: number
  ultimaFechaActiva: string | null
  registroDiario: RegistroDiario[]
  actividadReciente: EntradaActividad[]
}

const MAX_REGISTRO_DIARIO = 14
const MAX_ACTIVIDAD = 8
const PUNTOS_CORRECTA = 10
const PUNTOS_INCORRECTA = 2

function claveAlmacenamiento(username: string | null): string {
  return `${STORAGE_PREFIX}${username ?? 'guest'}`
}

function hoyIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function estadoVacio(): EstadoProgreso {
  return {
    idsCompletados: [],
    respuestasCorrectas: 0,
    totalRespuestas: 0,
    estadisticasTema: {},
    puntos: 0,
    racha: 0,
    ultimaFechaActiva: null,
    registroDiario: [],
    actividadReciente: [],
  }
}

function estadoDemo(): EstadoProgreso {
  const muestra = ejercicios.slice(0, 13)
  const state = estadoVacio()
  muestra.forEach((ex) => {
    state.idsCompletados.push(ex.id)
    const tema = claveTemaParaEjercicio(ex)
    const stat = state.estadisticasTema[tema] ?? { correctas: 0, total: 0 }
    stat.total += 1
    stat.correctas += 1
    state.estadisticasTema[tema] = stat
  })
  state.respuestasCorrectas = 20
  state.totalRespuestas = 24
  state.puntos = 20 * PUNTOS_CORRECTA + 4 * PUNTOS_INCORRECTA
  state.racha = 2
  state.ultimaFechaActiva = hoyIso()
  return state
}

function cargarEstado(key: string): EstadoProgreso {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<EstadoProgreso>
      return { ...estadoVacio(), ...parsed }
    }
  } catch {
    // ignorar errores de almacenamiento
  }
  return key === claveAlmacenamiento(null) ? estadoDemo() : estadoVacio()
}

let claveActiva = claveAlmacenamiento(null)
const state = reactive<EstadoProgreso>(cargarEstado(claveActiva))
let persistenciaHabilitada = true

watch(
  state,
  (value) => {
    if (!persistenciaHabilitada) return
    try {
      localStorage.setItem(claveActiva, JSON.stringify(value))
    } catch {
      // ignorar
    }
  },
  { deep: true },
)

export function cambiarUsuario(username: string | null) {
  claveActiva = claveAlmacenamiento(username)
  const siguiente = cargarEstado(claveActiva)
  persistenciaHabilitada = false
  state.idsCompletados = siguiente.idsCompletados
  state.respuestasCorrectas = siguiente.respuestasCorrectas
  state.totalRespuestas = siguiente.totalRespuestas
  state.estadisticasTema = siguiente.estadisticasTema
  state.puntos = siguiente.puntos
  state.racha = siguiente.racha
  state.ultimaFechaActiva = siguiente.ultimaFechaActiva
  state.registroDiario = siguiente.registroDiario
  state.actividadReciente = siguiente.actividadReciente
  persistenciaHabilitada = true
}

function actualizarRacha() {
  const hoy = hoyIso()
  if (state.ultimaFechaActiva === hoy) return
  if (state.ultimaFechaActiva) {
    const anterior = new Date(state.ultimaFechaActiva)
    const diffDias = Math.round((new Date(hoy).getTime() - anterior.getTime()) / (1000 * 60 * 60 * 24))
    state.racha = diffDias === 1 ? state.racha + 1 : 1
  } else {
    state.racha = 1
  }
  state.ultimaFechaActiva = hoy
}

function actualizarRegistroDiario(correcta: boolean) {
  const hoy = hoyIso()
  let entrada = state.registroDiario.find((d) => d.fecha === hoy)
  if (!entrada) {
    entrada = { fecha: hoy, correctas: 0, total: 0 }
    state.registroDiario.push(entrada)
    if (state.registroDiario.length > MAX_REGISTRO_DIARIO) state.registroDiario.shift()
  }
  entrada.total += 1
  if (correcta) entrada.correctas += 1
}

export function registrarRespuesta(tema: ClaveTema, correcta: boolean) {
  state.totalRespuestas += 1
  if (correcta) state.respuestasCorrectas += 1

  const stat = state.estadisticasTema[tema] ?? { correctas: 0, total: 0 }
  stat.total += 1
  if (correcta) stat.correctas += 1
  state.estadisticasTema[tema] = stat

  state.puntos += correcta ? PUNTOS_CORRECTA : PUNTOS_INCORRECTA

  state.actividadReciente.unshift({ fecha: hoyIso(), etiqueta: etiquetasTema[tema], correcta })
  if (state.actividadReciente.length > MAX_ACTIVIDAD) state.actividadReciente.pop()

  actualizarRegistroDiario(correcta)
  actualizarRacha()
}

export function marcarEjercicioCompletado(ejercicioId: string, tema: ClaveTema, fueCorrecta: boolean) {
  if (!state.idsCompletados.includes(ejercicioId)) {
    state.idsCompletados.push(ejercicioId)
  }
  registrarRespuesta(tema, fueCorrecta)
}

export function marcarQuizCompletado(ejercicioId: string) {
  if (!state.idsCompletados.includes(ejercicioId)) {
    state.idsCompletados.push(ejercicioId)
  }
}

export function reiniciarProgreso() {
  const nuevo = estadoVacio()
  state.idsCompletados = nuevo.idsCompletados
  state.respuestasCorrectas = nuevo.respuestasCorrectas
  state.totalRespuestas = nuevo.totalRespuestas
  state.estadisticasTema = nuevo.estadisticasTema
  state.puntos = nuevo.puntos
  state.racha = nuevo.racha
  state.ultimaFechaActiva = nuevo.ultimaFechaActiva
  state.registroDiario = nuevo.registroDiario
  state.actividadReciente = nuevo.actividadReciente
}

export const conteoCompletados = computed(() => state.idsCompletados.length)

export const porcentajeProgreso = computed(() =>
  totalEjercicios === 0 ? 0 : Math.min(100, Math.round((conteoCompletados.value / totalEjercicios) * 100)),
)

export const porcentajePrecision = computed(() =>
  state.totalRespuestas === 0 ? 0 : Math.round((state.respuestasCorrectas / state.totalRespuestas) * 100),
)

export function estaEjercicioCompletado(ejercicioId: string): boolean {
  return state.idsCompletados.includes(ejercicioId)
}

export interface ProgresoTema {
  clave: ClaveTema
  etiqueta: string
  correctas: number
  total: number
  precision: number
  ejerciciosTotal: number
  ejerciciosCompletados: number
  estado: 'completado' | 'en-progreso' | 'pendiente'
}

const TODOS_TEMAS = Object.keys(etiquetasTema) as ClaveTema[]

export const progresoPorTema = computed<ProgresoTema[]>(() =>
  TODOS_TEMAS.map((clave) => {
    const stat = state.estadisticasTema[clave] ?? { correctas: 0, total: 0 }
    const temaEjercicios = ejercicios.filter((ex) => claveTemaParaEjercicio(ex) === clave)
    const completados = temaEjercicios.filter((ex) => state.idsCompletados.includes(ex.id)).length
    const estado: ProgresoTema['estado'] =
      completados === 0 ? 'pendiente' : completados >= temaEjercicios.length ? 'completado' : 'en-progreso'
    return {
      clave,
      etiqueta: etiquetasTema[clave],
      correctas: stat.correctas,
      total: stat.total,
      precision: stat.total === 0 ? 0 : Math.round((stat.correctas / stat.total) * 100),
      ejerciciosTotal: temaEjercicios.length,
      ejerciciosCompletados: completados,
      estado,
    }
  }),
)

export const temasDebiles = computed<ProgresoTema[]>(() =>
  progresoPorTema.value
    .filter((t) => t.total >= 2 && t.precision < 70)
    .sort((a, b) => a.precision - b.precision),
)

export const temasDominados = computed<ProgresoTema[]>(() =>
  progresoPorTema.value.filter((t) => t.total >= 3 && t.precision >= 85),
)

export const temaRecomendado = computed<ProgresoTema | null>(() => {
  if (temasDebiles.value.length > 0) return temasDebiles.value[0]
  const pendiente = progresoPorTema.value.find((t) => t.estado === 'pendiente')
  if (pendiente) return pendiente
  const enProgreso = progresoPorTema.value.find((t) => t.estado === 'en-progreso')
  return enProgreso ?? null
})

export const nivel = computed(() => {
  if (porcentajeProgreso.value >= 80) return { numero: 4, etiqueta: 'Avanzado' }
  if (porcentajeProgreso.value >= 55) return { numero: 3, etiqueta: 'Intermedio' }
  if (porcentajeProgreso.value >= 25) return { numero: 2, etiqueta: 'Básico' }
  return { numero: 1, etiqueta: 'Principiante' }
})

export interface Logro {
  id: string
  icono: string
  titulo: string
  descripcion: string
  desbloqueado: boolean
}

export const logros = computed<Logro[]>(() => [
  {
    id: 'primer-paso',
    icono: '🎯',
    titulo: 'Primer paso',
    descripcion: 'Completa tu primer ejercicio.',
    desbloqueado: conteoCompletados.value >= 1,
  },
  {
    id: '10-ejercicios',
    icono: '📚',
    titulo: 'Constancia',
    descripcion: 'Completa 10 ejercicios.',
    desbloqueado: conteoCompletados.value >= 10,
  },
  {
    id: 'racha-3',
    icono: '🔥',
    titulo: 'Racha de 3 días',
    descripcion: 'Practica 3 días seguidos.',
    desbloqueado: state.racha >= 3,
  },
  {
    id: 'precision-90',
    icono: '🏆',
    titulo: 'Precisión de experto',
    descripcion: 'Alcanza 90% de precisión (mínimo 10 respuestas).',
    desbloqueado: state.totalRespuestas >= 10 && porcentajePrecision.value >= 90,
  },
  {
    id: 'tablas-verdad',
    icono: '▦',
    titulo: 'Maestro de tablas',
    descripcion: 'Domina el tema de Tablas de verdad.',
    desbloqueado: progresoPorTema.value.some((t) => t.clave === 'tablas-verdad' && t.total >= 3 && t.precision >= 85),
  },
  {
    id: 'todos-temas',
    icono: '⭐',
    titulo: 'Todo terreno',
    descripcion: 'Responde al menos una vez en cada tema.',
    desbloqueado: progresoPorTema.value.every((t) => t.total > 0),
  },
])

export const estadoProgreso = state
