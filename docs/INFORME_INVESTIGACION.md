# Informe de Investigación: Plataforma LogiLearn de Lógica Simbólica

**Autores:** Equipos Sinergia, Los Hijos de Linus, Modus Innova y Linus — Curso Lógica Simbólica (MATG1001)
**Docente:** Dr. Mardo Victor Gonzales Herrera
**Institución:** Universidad Nacional Pedro Ruiz Gallo — Escuela Profesional de Ingeniería de Sistemas
**Semestre:** 2026 I · II Ciclo
**Fecha:** Agosto de 2026
**Repositorio:** https://github.com/EnriDiazCayaca/logica_simbolica_global

---

## Resumen

El presente informe documenta el diseño, desarrollo, validación y resultados de **LogiLearn**, una
plataforma web colaborativa construida como producto del curso de Lógica Simbólica (MATG1001). La
plataforma implementa funcionalmente el 100% de los temas del sílabo mediante **motores reales de
evaluación lógica**: tablas de verdad, inferencias, cuantificadores y teoría de conjuntos. Se
describe el marco tecnológico (Vue 3, Vite, Tailwind CSS v4, TypeScript, Vitest), la metodología de
trabajo en cuatro equipos de dominio con ramificaciones Git y Pull Requests, la arquitectura por
módulo, la estrategia de pruebas (175 pruebas funcionales), un manual de uso y la reflexión sobre los
aprendizajes alcanzados respecto a los resultados de aprendizaje D1, D2 y D3 del sílabo. Los
resultados evidencian que la construcción de software verificable refuerza la comprensión teórica de
la lógica simbólica.

**Palabras clave:** lógica simbólica, lógica proposicional, cuantificadores, teoría de conjuntos,
Vue, educación interactiva, ingeniería de software educativa.

---

## 1. Introducción

La lógica simbólica constituye el fundamento del razonamiento formal en ingeniería de sistemas. El
curso MATG1001 plantea como resultado de aprendizaje el desarrollo de la capacidad de "plantear
estrategias de solución a problemas de su entorno, usando el razonamiento lógico y analítico en
diversos contextos" (Sílabo, 2026). Sin embargo, la apropiación de conceptos como la validez de
inferencias o el alcance de los cuantificadores suele ser abstracta para el estudiante cuando se
aborda únicamente desde la teoría.

LogiLearn nace para cerrar esa brecha: una plataforma donde cada tema del sílabo es un motor
computacional verificable. El objetivo de este informe es (a) documentar qué se construyó, (b) cómo
se construyó y (c) qué aprendizajes se derivaron, sirviendo a la vez de memoria académica y de manual
de uso.

### 1.1 Resultados de aprendizaje del sílabo
- **D1:** Identifica y aplica las diversas definiciones, teorías y conceptos de la lógica proposicional.
- **D2:** Interpreta y aplica las definiciones, teorías y conceptos de la inferencia lógica.
- **D3:** Discute y analiza los conceptos de la teoría de conjuntos y lo aplica a la lógica simbólica.

### 1.2 Formulación del problema
Los estudiantes enfrentan tres barreras: (i) dificultad para verificar manualmente tablas de verdad
de más de tres variables; (ii) ausencia de retroalimentación inmediata al aplicar reglas de
inferencia; y (iii) falta de herramientas para practicar cuantificadores y conjuntos en español.
LogiLearn aborda las tres con motores automatizados.

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
lo que garantiza integración continua y retroalimentación temprana. El tipado estático (TypeScript)
fue decisivo para reducir errores en los motores lógicos.

---

## 3. Marco Teórico

### 3.1 Lógica proposicional
Una proposición es una afirmación con valor de verdad V o F. Los conectivos son negación (¬),
conjunción (∧), disyunción (∨), implicación (→) y bicondicional (↔). Una fórmula es **tautología**
si es V para toda asignación, **contradicción** si es F para toda asignación, y **contingencia** en
otro caso.

### 3.2 Inferencia lógica
Una inferencia es válida si, siendo verdaderas las premisas, la conclusión es necesariamente verdadera
(regla de separación o *Modus Ponens*: p, p→q ⊢ q). Otras reglas: *Modus Tollens* (¬q, p→q ⊢ ¬p) y
*Silogismo Hipotético* (p→q, q→r ⊢ p→r).

### 3.3 Cuantificadores
El cuantificador universal ∀x P(x) es verdadero si P(x) lo es para todo x en el dominio D; el
existencial ∃x P(x) lo es si hay al menos un testigo. Leyes de De Morgan para cuantificadores:
¬(∀x P(x)) ≡ ∃x ¬P(x) y ¬(∃x P(x)) ≡ ∀x ¬P(x).

### 3.4 Teoría de conjuntos
Operaciones básicas: unión (A∪B), intersección (A∩B), diferencia (A−B), complemento (Aᶜ) y
diferencia simétrica (A△B). La teoría de conjuntos se vincula con la lógica mediante las leyes de
De Morgan conjuntistas: (A∪B)ᶜ = Aᶜ∩Bᶜ y (A∩B)ᶜ = Aᶜ∪Bᶜ.

---

## 4. Metodología

El trabajo se organizó en **cuatro equipos de dominio**, cada uno responsable de un módulo del sílabo:

| Equipo | Sublíder | Tema | Carpeta |
|---|---|---|---|
| Sinergia | Alexa | Tablas de Verdad | `src/pages/tablas` |
| Los Hijos de Linus | Arom | Inferencias | `src/pages/inferencias` |
| Modus Innova | Cristian | Cuantificadores | `src/pages/cuantificadores` |
| Linus | Jordy | Conjuntos | `src/pages/conjuntos` |

### 4.1 Ramificaciones y flujo Git
Se adoptó un modelo de ramas por funcionalidad. Cada equipo desarrolló en su rama y consolidó
mediante **Pull Requests (PR)** revisados por el líder de proyecto. La integración final se realizó
en la rama `feat/integrate-sinergia-modus` (PR #16), donde se unificaron motores, branding y pruebas.
Las ramas de trabajo previas (PR #8, #14, #15) se cerraron al integrarse manualmente.

### 4.2 Calidad y pruebas
Cada motor cuenta con pruebas unitarias (Vitest). La suite final suma **175 pruebas funcionales**
que validan parsers, evaluadores, leyes lógicas y componentes. El build de producción se verifica
con `vue-tsc` + `vite build`. Distribución de pruebas por módulo:

| Módulo | Pruebas |
|---|---|
| Tablas de verdad | 39 |
| Inferencias | 24 |
| Cuantificadores | 30 |
| Conjuntos | 14 |
| Solver/parser | 22 |
| UI / integración | 46 |

### 4.3 Gestión de riesgos
- *Riesgo:* discrepancias de formato entre equipos → mitigado con componentes UI compartidos.
- *Riesgo:* errores en motores lógicos → mitigado con pruebas unitarias por cada ley.
- *Riesgo:* pérdida de avances → mitigado con PRs y revisión centralizada.

---

## 5. Arquitectura y Desarrollo

La lógica se aisló en `src/lib/` (motores compartidos) y la interfaz en `src/pages/` y
`src/components/ui/` (Button, Card, Badge, ToggleSwitch, OptionPill). A continuación se describen los
módulos.

### 5.1 Tablas de Verdad (Equipo Sinergia)
Motor que parsea proposiciones, recolecta variables, genera combinaciones y evalúa subexpresiones.
**D1.** Clasifica cada fórmula como tautología, contradicción o contingencia. Incluye 30+ ejercicios
(identificar, clasificar, leyes, quiz) y verificación en vivo.

### 5.2 Inferencias (Equipo Los Hijos de Linus)
Demostrador con trazabilidad y diagnóstico. Valida reglas como Modus Ponens, Modus Tollens y
Silogismo Hipotético, mostrando cada paso. **D2.** El estudiante interpreta y aplica la inferencia
lógica con retroalimentación inmediata.

### 5.3 Cuantificadores (Equipo Modus Innova)
Evalúa ∀ y ∃ sobre dominios finitos, con rangos encadenados (`0 < x < 90`), predicados libres
(`x % 2 === 0`), negación De Morgan profunda y un **resolutor paso a paso** (Bicondicional →
Implicación → De Morgan → Doble Negación → Distribución). La pestaña "Distribución y Leyes" permite
resolver fórmulas de predicados automáticamente.

### 5.4 Conjuntos (Equipo Linus)
Operaciones básicas (unión, intersección, diferencia, complemento, diferencia simétrica) y familia de
conjuntos, con diagramas de Venn interactivos. **D3.** Aplica la teoría de conjuntos a la lógica
simbólica.

### 5.5 Aprender y Progreso
Vista de recorrido guiado por concepto (definición → ejemplo → ejercicio → solución) con
verificación en vivo, y un store de progreso con localStorage que sugiere temas débiles.

---

## 6. Manual de Uso

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

## 7. Resultados y Aprendizajes

El proyecto cubrió el 100% del sílabo con motores funcionales y 175 pruebas. Los aprendizajes por
equipo fueron:

- **Sinergia:** diseño de parsers recursivos y clasificación de fórmulas; comprensión de validez.
- **Los Hijos de Linus:** trazabilidad de inferencias, manejo de errores y formalización de reglas.
- **Modus Innova:** cuantificadores, De Morgan y reescritura de fórmulas; pensamiento algorítmico.
- **Linus:** modelado de conjuntos y visualización; conexión conjuntos–lógica.

Estos resultados atañen directamente a **D1** (lógica proposicional), **D2** (inferencia) y **D3**
(conjuntos), demostrando que la construcción de software refuerza la comprensión teórica.

---

## 8. Limitaciones y Trabajo Futuro

**Limitaciones:** dominios finitos (no se evalúan cuantificadores sobre infinitos); predicados libres
restringidos a expresiones seguras; la inferencia valida reglas, no demuestra teoremas arbitrarios.

**Trabajo futuro:** (i) exportación LaTeX de tablas y demostraciones; (ii) más ejercicios y modo
profesor con calificación; (iii) soporte de lógica de primer orden completa; (iv) tutor adaptativo
basado en el store de progreso.

---

## 9. Conclusiones

LogiLearn demuestra que la implementación de una plataforma interactiva potencia el aprendizaje de la
lógica simbólica. La metodología por equipos y PRs fomentó trabajo colaborativo y calidad. La
cobertura del 100% del sílabo con 175 pruebas valida la robustez de los motores. Se recomienda la
adopción de enfoques similares en otros cursos de fundamentos.

---

## Referencias

- Universidad Nacional Pedro Ruiz Gallo. (2026). *Sílabo de Lógica Simbólica* (MATG1001, 2026 I).
- Copi, I. & Cohen, C. (2009). *Introducción a la lógica* (14.ª ed.). Pearson.
- Vue.js. (2026). *Documentación oficial*. https://vuejs.org
- Vite. (2026). *Documentación oficial*. https://vitejs.dev
- Tailwind CSS. (2026). *Documentación oficial*. https://tailwindcss.com
- Vitest. (2026). *Documentación oficial*. https://vitest.dev
