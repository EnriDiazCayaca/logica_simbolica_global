<p align="center">
  <img src="public/assets/banner.jpg" alt="Banner Logica Simbolica">
</p>

# 🧠 Lógica Simbólica Global · LogiLearn

> **Estado del proyecto: ✅ COMPLETADO (100% del sílabo implementado funcionalmente)**

Plataforma web colaborativa, gratuita y de código abierto para aprender y aplicar Lógica Simbólica,
construida por el aula del curso MATG1001 (2026 I).

---

## 📚 Marco Académico
- **Universidad:** Nacional Pedro Ruiz Gallo
- **Escuela:** Ingeniería de Sistemas
- **Curso:** Lógica Simbólica (código **MATG1001**, Semestre **2026 I**, II Ciclo)
- **Créditos:** 3
- **Docente:** Dr. Mardo Victor Gonzales Herrera — mgonzalesh@unprg.edu.pe
- **Líder de proyecto:** Enrique (`EnriDiazCayaca`)

---

## ⚡ Stack Tecnológico
- **Framework:** Vue 3 (SFC `.vue`) + Vite 6
- **Enrutamiento:** Vue Router 4
- **Estilos:** Tailwind CSS v4
- **Lenguaje:** TypeScript
- **Pruebas:** Vitest (175 pruebas funcionales)
- **Deploy:** GitHub Pages (producción) + Netlify (vistas previas de PR)

---

## 👥 Equipos y Participantes
| Equipo | Sublíder | Integrantes | Tema |
|---|---|---|---|
| Sinergia | Alexa | Aldair, Smith, Miguel Velarde, Jesús Núñez | Tablas de Verdad |
| Los Hijos de Linus | Arom | Centurión, Morocho, Altamirano, Mio, **Mauricio** | Inferencias |
| Modus Innova | Cristian | Danuska, Marlon, Guillermo, Noemí, **Julio** | Cuantificadores |
| Linus | Jordy | Nio, Mike, Sergio, Fer, Alejandro | Conjuntos |

Lista completa en [`CONTRIBUTORS.md`](./CONTRIBUTORS.md).

---

## 🧩 Módulos (100% del sílabo)
| Ruta | Módulo | Equipo |
|---|---|---|
| `/` (Inicio) | Landing y "Sobre Nosotros" | Proyecto |
| `/tablas` | Tablas de Verdad (clasificación) | Sinergia |
| `/inferencias` | Inferencias con trazabilidad | Hijos de Linus |
| `/cuantificadores` | Cuantificadores ∀/∃ + Distribución y Leyes | Modus Innova |
| `/conjuntos` | Teoría de Conjuntos y Venn | Linus |
| `/leyes-logicas` | 12 Leyes Lógicas | Compartido |
| `/aprender` | Recorrido guiado por conceptos | Compartido |
| `/ejercicios` | Práctica (80 ejercicios) | Compartido |
| `/progreso` | Seguimiento y recomendaciones | Compartido |

---

## 🚀 Cómo ejecutar
```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción (vue-tsc + vite)
npm run test     # 175 pruebas funcionales
```

---

## 📑 Documentación
- [CONTRIBUTORS.md](./CONTRIBUTORS.md) — lista de participantes
- [docs/INFORME_INVESTIGACION.md](./docs/INFORME_INVESTIGACION.md) — informe de investigación (APA 7)
- [TAREAS/DELEGACION_P1.md](./TAREAS/DELEGACION_P1.md) — landing page
- [TAREAS/DELEGACION_P2.md](./TAREAS/DELEGACION_P2.md) — informe de investigación
- [TAREAS/DELEGACION_P3.md](./TAREAS/DELEGACION_P3.md) — depuración del repositorio

---

## 📁 Estructura
| Carpeta | Contenido |
|---|---|
| `src/pages/` | Vistas por módulo (tablas, inferencias, cuantificadores, conjuntos, leyes-logicas, aprender, ejercicios, progreso, Home) |
| `src/lib/` | Motores compartidos (tablas, inferencias, cuantificadores, conjuntos) |
| `src/components/ui/` | Button, Card, Badge, ToggleSwitch, OptionPill |
| `src/store/` | Store de progreso (localStorage) |
| `src/data/` | Catálogo de leyes y ejercicios |
