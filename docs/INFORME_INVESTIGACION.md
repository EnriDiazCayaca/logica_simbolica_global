# Informe de Investigación: Plataforma LogiLearn de Lógica Simbólica

**Autores:** Equipos Sinergia, Los Hijos de Linus, Modus Innova y Linus — Curso Lógica Simbólica (MATG1001)
**Docente:** Dr. Mardo Victor Gonzales Herrera
**Institución:** Universidad Nacional Pedro Ruiz Gallo — Escuela Profesional de Ingeniería de Sistemas
**Semestre:** 2026 I · II Ciclo
**Fecha:** Agosto de 2026

---

## Resumen

El presente informe documenta el diseño, desarrollo y resultados de **LogiLearn**, una plataforma
web colaborativa construida como producto del curso de Lógica Simbólica (MATG1001). La plataforma
implementa funcionalmente el 100% de los temas del sílabo mediante motores reales de evaluación
lógica: tablas de verdad, inferencias, cuantificadores y teoría de conjuntos. Se describe el marco
tecnológico (Vue 3, Vite, Tailwind CSS, TypeScript, Vitest), la metodología de trabajo en cuatro
equipos de dominio con ramificaciones Git y Pull Requests, la arquitectura por módulo, un manual de
uso y la reflexión sobre los aprendizajes alcanzados respecto a los resultados de aprendizaje D1, D2
y D3 del sílabo.

**Palabras clave:** lógica simbólica, lógica proposicional, cuantificadores, teoría de conjuntos,
Vue, educación interactiva.

---

## 1. Introducción

La lógica simbólica constituye el fundamento del razonamiento formal en ingeniería. El curso
MATG1001 plantea como resultado de aprendizaje el desarrollo de la capacidad de "plantear estrategias
de solución a problemas de su entorno, usando el razonamiento lógico y analítico en diversos
contextos" (Sílabo, 2026). Sin embargo, la apropiación de conceptos como la validez de inferencias o
el alcance de los cuantificadores suele ser abstracta para el estudiante.

LogiLearn nace para cerrar esa brecha: una plataforma donde cada tema del sílabo es un motor
computacional verificable. El objetivo de este informe es documentar qué se construyó, cómo y qué
aprendizajes se derivaron, sirviendo a la vez de memoria académica y de manual de uso.

### 1.1 Resultados de aprendizaje del sílabo
- **D1:** Identifica y aplica las diversas definiciones, teorías y conceptos de la lógica proposicional.
- **D2:** Interpreta y aplica las definiciones, teorías y conceptos de la inferencia lógica.
- **D3:** Discute y analiza los conceptos de la teoría de conjuntos y lo aplica a la lógica simbólica.

---

## 2. Marco Tecnológico

La plataforma se construyó sobre un stack moderno, tipado y orientado a componentes:

| Tecnología | Rol | Versión |
|---|---|---|
| Vue 3 | Framework de componentes (SFC `.vue`) | 3.5+ |
| Vite | Bundler y servidor de desarrollo | 6.x |
| TypeScript | Tipado estático | 5.x |
| Tailwind CSS v4 | Estilos utilitarios | 4.x |
| Vue Router | Enrutamiento | 4.x |
| Vitest | Pruebas unitarias | 4.x |

El proyecto se despliega mediante **GitHub Pages** (producción) y **Netlify** (vistas previas de PR),
lo que garantiza integración continua y retroalimentación temprana.

---

## 3. Metodología

El trabajo se organizó en **cuatro equipos de dominio**, cada uno responsable de un módulo del sílabo:

| Equipo | Sublíder | Tema | Carpeta |
|---|---|---|---|
| Sinergia | Alexa | Tablas de Verdad | `src/pages/tablas` |
| Los Hijos de Linus | Arom | Inferencias | `src/pages/inferencias` |
| Modus Innova | Cristian | Cuantificadores | `src/pages/cuantificadores` |
| Linus | Jordy | Conjuntos | `src/pages/conjuntos` |

### 3.1 Ramificaciones y flujo Git
Se adoptó un modelo de ramas por funcionalidad. Cada equipo desarrolló en su rama y consolidó
mediante **Pull Requests (PR)** revisados por el líder de proyecto. La integración final se realizó
en la rama `feat/integrate-sinergia-modus` (PR #16), donde se unificaron motores, branding y pruebas.

### 3.2 Calidad
Cada motor cuenta con pruebas unitarias (Vitest). Al cierre, la suite suma **175 pruebas
funcionales** que validan parsers, evaluadores y leyes lógicas. El build de producción se verifica
con `vue-tsc` + `vite build`.

---

## 4. Arquitectura y Desarrollo

La lógica se aisló en `src/lib/` (motores compartidos) y la interfaz en `src/pages/` y
`src/components/ui/` (Button, Card, Badge, ToggleSwitch, OptionPill). A continuación se describen los
módulos.

### 4.1 Tablas de Verdad (Equipo Sinergia)
Motor que parsea proposiciones, recolecta variables, genera combinaciones y evalúa subexpresiones.
**D1.** Clasifica cada fórmula como tautología, contradicción o contingencia. Incluye 30+ ejercicios
(identificar, clasificar, leyes, quiz) y verificación en vivo.

### 4.2 Inferencias (Equipo Los Hijos de Linus)
Demostrador con trazabilidad y diagnóstico. Valida reglas como Modus Ponens, Modus Tollens y
Silogismo Hipotético, mostrando cada paso. **D2.** El estudiante interpreta y aplica la inferencia
lógica con retroalimentación inmediata.

### 4.3 Cuantificadores (Equipo Modus Innova)
Evalúa ∀ y ∃ sobre dominios finitos, con rangos encadenados (`0 < x < 90`), predicados libres
(`x % 2 === 0`), negación De Morgan profunda y un **resolutor paso a paso** (Bicondicional →
Implicación → De Morgan → Distribución). La pestaña "Distribución y Leyes" permite resolver
fórmulas de predicados automáticamente.

### 4.4 Conjuntos (Equipo Linus)
Operaciones básicas (unión, intersección, diferencia, complemento) y familia de conjuntos, con
diagramas de Venn interactivos. **D3.** Aplica la teoría de conjuntos a la lógica simbólica.

### 4.5 Aprender y Progreso
Vista de recorrido guiado por concepto (definición → ejemplo → ejercicio → solución) con
verificación en vivo, y un store de progreso con localStorage que sugiere temas débiles.

---

## 5. Manual de Uso

1. **Inicio:** la landing presenta los módulos y la información del curso.
2. **Tablas de Verdad:** escribe una fórmula (ej. `p ∧ q`), inserta conectivos y genera la tabla;
   revisa la clasificación.
3. **Inferencias:** introduce premisas y conclusión; el sistema valida la inferencia con trazabilidad.
4. **Cuantificadores:** elige ∀/∃, define dominio (lista o rango) y predicado; usa "Distribución y
   Leyes" para resolver fórmulas paso a paso.
5. **Conjuntos:** define conjuntos y aplica operaciones; observa el diagrama de Venn.
6. **Aprender:** sigue el recorrido guiado por conectores y leyes.
7. **Ejercicios / Progreso:** practica y consulta tu avance y recomendaciones.

---

## 6. Resultados y Aprendizajes

El proyecto cubrió el 100% del sílabo con motores funcionales y 175 pruebas. Los aprendizajes por
equipo fueron:

- **Sinergia:** diseño de parsers recursivos y clasificación de fórmulas.
- **Los Hijos de Linus:** trazabilidad de inferencias y manejo de errores.
- **Modus Innova:** cuantificadores, De Morgan y reescritura de fórmulas.
- **Linus:** modelado de conjuntos y visualización.

Estos resultados atañen directamente a **D1** (lógica proposicional), **D2** (inferencia) y **D3**
(conjuntos), demostrando que la construcción de software refuerza la comprensión teórica.

---

## 7. Conclusiones

LogiLearn demuestra que la implementación de una plataforma interactiva potencia el aprendizaje de la
lógica simbólica. La metodología por equipos y PRs fomentó trabajo colaborativo y calidad. Como
trabajo futuro se propone exportación LaTeX, más ejercicios y un modo profesor.

---

## Referencias

- Universidad Nacional Pedro Ruiz Gallo. (2026). *Sílabo de Lógica Simbólica* (MATG1001, 2026 I).
- Vue.js. (2026). *Documentación oficial*. https://vuejs.org
- Vite. (2026). *Documentación oficial*. https://vitejs.dev
- Tailwind CSS. (2026). *Documentación oficial*. https://tailwindcss.com
- Vitest. (2026). *Documentación oficial*. https://vitest.dev
- Copi, I. & Cohen, C. (2009). *Introducción a la lógica*. Pearson.
