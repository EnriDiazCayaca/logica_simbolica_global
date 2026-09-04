# EDITAR_PROFESOR — Textos editables (fallback sin Excel)

> Si no puedes abrir el Excel, edita este .md y envíalo. Pero preferible usar el .xlsx.

Instrucciones: cambia solo el campo "propuesto" y envía.

## 00_Config (modoLiteral por módulo)
- **home** actual=`false` → propuesto: `` (notas: Afecta a tarjetas y hero)
- **aprender** actual=`false` → propuesto: `` (notas: Conectores: si true muestra "y/o/entonces" en vez de ∧∨→)
- **tablas** actual=`false` → propuesto: `` (notas: Operadores)
- **cuantificadores** actual=`false` → propuesto: `` (notas: Si true, "Evalúa para todo y existe" en vez de ∀∃)
- **conjuntos** actual=`false` → propuesto: `` (notas: Operaciones A ∪ B vs A unión B)
- **inferencias** actual=`false` → propuesto: `` (notas: Demostrador vs Validador, Simbología vs Notación formal)
- **leyesPage** actual=`false` → propuesto: `` (notas: Fórmulas con símbolos vs literales)

## 01_Home
| Clave | Texto actual | Propuesto |
|---|---|---|
| home.hero.badge | LogiLearn · Lógica Simbólica Global |  |
| home.hero.titulo | Aprende Lógica Simbólica de forma visual e interactiva |  |
| home.hero.descripcion | Una plataforma colaborativa, gratuita y de código abierto donde cualquier persona construye, practica y domina la lógica proposicional, los cuantificadores y la teoría de conjuntos con motores reales, ejercicios y seguimiento de progreso. |  |
| home.hero.ctaPrimario.label | Empezar a aprender |  |
| home.hero.ctaSecundario.label | Probar tablas de verdad |  |
| home.hero.stats[0].label | Módulos interactivos |  |
| home.hero.stats[1].label | Leyes lógicas |  |
| home.hero.stats[2].label | Ejercicios |  |
| home.hero.stats[3].label | Sílabo cubierto |  |
| home.explora.titulo | Explora la plataforma |  |
| home.explora.subtitulo | Cada módulo es un motor real que evalúa tus fórmulas. |  |
| home.modulos.tablas.desc | Genera tablas de verdad, clasifica tautologías, contradicciones y contingencias. |  |
| home.modulos.inferencias.desc | Valida reglas de inferencia con trazabilidad y diagnóstico paso a paso. |  |
| home.modulos.cuantificadores.desc | Evalúa ∀ y ∃, aplica De Morgan y resuelve fórmulas de predicados. |  |
| home.modulos.conjuntos.desc | Operaciones de teoría de conjuntos y diagramas de Venn interactivos. |  |
| home.modulos.aprender.desc | Recorrido guiado por conceptos con verificación en vivo. |  |
| home.modulos.progreso.desc | Sigue tu avance, precisión y temas recomendados. |  |
| home.modulos.tablas.nombre | Tablas de Verdad |  |
| home.modulos.inferencias.nombre | Inferencias |  |
| home.modulos.cuantificadores.nombre | Cuantificadores |  |
| home.modulos.conjuntos.nombre | Conjuntos |  |
| home.modulos.aprender.nombre | Aprender |  |
| home.modulos.progreso.nombre | Progreso |  |
| home.sobreNosotros.titulo | Sobre Nosotros |  |
| home.sobreNosotros.subtitulo | Proyecto construido colaborativamente por el aula, para el aula. |  |
| home.sobreNosotros.marcoTitulo | Marco académico |  |
| home.sobreNosotros.marco.universidad | Nacional Pedro Ruiz Gallo |  |
| home.sobreNosotros.marco.escuela | Ingeniería de Sistemas |  |
| home.sobreNosotros.marco.curso | Lógica Simbólica (MATG1001) |  |
| home.sobreNosotros.marco.semestre | 2026 I · II Ciclo |  |
| home.sobreNosotros.marco.creditos | 3 |  |
| home.sobreNosotros.marco.docente | Dr. Mardo Victor Gonzales Herrera |  |
| home.sobreNosotros.equipos[0].tema | Tablas de Verdad |  |
| home.sobreNosotros.equipos[1].tema | Inferencias |  |
| home.sobreNosotros.equipos[2].tema | Cuantificadores |  |
| home.sobreNosotros.equipos[3].tema | Conjuntos |  |
| home.footer | LogiLearn · Proyecto de Aula 2026 · Universidad Nacional Pedro Ruiz Gallo |  |

## 02_Aprender
| Clave | Texto actual | Propuesto |
|---|---|---|
| aprender.titulo | Aprender |  |
| aprender.subtitulo | Explora un concepto paso a paso: definición → ejemplo → ejercicio → solución. |  |
| aprender.conectores.c-negacion.titulo | Negación |  |
| aprender.conectores.c-negacion.definicion | Invierte el valor de verdad de una proposición. Si p es verdadera, ¬p es falsa, y viceversa. |  |
| aprender.conectores.c-negacion.definicionFormal | ¬p es verdadera iff p es falsa. |  |
| aprender.conectores.c-negacion.proposicion | ¬p |  |
| aprender.conectores.c-negacion.proposicionLiteral | no p |  |
| aprender.conectores.c-conjuncion.titulo | Conjunción |  |
| aprender.conectores.c-conjuncion.definicion | Une dos proposiciones y solo es verdadera cuando ambas lo son. Basta con que una sea falsa para que toda la conjunción sea falsa. |  |
| aprender.conectores.c-conjuncion.definicionFormal | p ∧ q ≡ V iff p ≡ V y q ≡ V. |  |
| aprender.conectores.c-conjuncion.proposicion | p ∧ q |  |
| aprender.conectores.c-conjuncion.proposicionLiteral | p y q |  |
| aprender.conectores.c-disyuncion.titulo | Disyunción |  |
| aprender.conectores.c-disyuncion.definicion | Une dos proposiciones y es verdadera si al menos una de ellas lo es. Solo es falsa cuando ambas son falsas. |  |
| aprender.conectores.c-disyuncion.definicionFormal | p ∨ q ≡ F iff p ≡ F y q ≡ F. |  |
| aprender.conectores.c-disyuncion.proposicion | p ∨ q |  |
| aprender.conectores.c-disyuncion.proposicionLiteral | p o q |  |
| aprender.conectores.c-condicional.titulo | Condicional |  |
| aprender.conectores.c-condicional.definicion | Expresa "si p entonces q". Solo es falsa cuando el antecedente (p) es verdadero y el consecuente (q) es falso. |  |
| aprender.conectores.c-condicional.definicionFormal | p → q ≡ ¬p ∨ q; falsa solo si p ≡ V y q ≡ F. |  |
| aprender.conectores.c-condicional.proposicion | p → q |  |
| aprender.conectores.c-condicional.proposicionLiteral | si p entonces q |  |
| aprender.conectores.c-bicondicional.titulo | Bicondicional |  |
| aprender.conectores.c-bicondicional.definicion | Expresa "p si y solo si q". Es verdadera cuando ambas proposiciones tienen el mismo valor de verdad. |  |
| aprender.conectores.c-bicondicional.definicionFormal | p ↔ q ≡ (p → q) ∧ (q → p); V iff p ≡ q. |  |
| aprender.conectores.c-bicondicional.proposicion | p ↔ q |  |
| aprender.conectores.c-bicondicional.proposicionLiteral | p si y solo si q |  |

## 03_Tablas
| Clave | Texto actual | Propuesto |
|---|---|---|
| tablas.header.titulo | Tablas de Verdad |  |
| tablas.header.subtitulo | Analiza expresiones de lógica proposicional |  |
| tablas.input.label | Ingresa una proposición lógica |  |
| tablas.input.placeholder | Ej: P ∧ Q → R |  |
| tablas.input.boton | Generar tabla |  |
| tablas.info.clasificacionTitulo | Clasificación |  |
| tablas.clasificacion.tautologia.etiqueta | TAUTOLOGÍA |  |
| tablas.clasificacion.contradiccion.etiqueta | CONTRADICCIÓN |  |
| tablas.clasificacion.contingencia.etiqueta | CONTINGENCIA |  |
| tablas.clasificacion.tautologia.explicacion | Es verdadera (V) en absolutamente todas las combinaciones posibles de valores de verdad. |  |
| tablas.clasificacion.contradiccion.explicacion | Es falsa (F) en absolutamente todas las combinaciones posibles de valores de verdad. |  |
| tablas.clasificacion.contingencia.explicacion | Su valor de verdad depende de la combinación: en algunas es V y en otras es F. |  |
| tablas.explicacion.titulo | ¿Cómo se resolvió? |  |
| tablas.explicacion.detalle | Primero se evalúan las subexpresiones más internas y luego se combinan siguiendo la precedencia: ¬ > ∧ > ∨ > → > ↔. Cada fila de la tabla repite este proceso con una combinación distinta de valores de verdad para las variables activas. |  |

## 04_Cuantificadores
| Clave | Texto actual | Propuesto |
|---|---|---|
| cuantificadores.header.titulo | Cuantificadores Lógicos |  |
| cuantificadores.header.subtitulo | Evalúa cuantificadores ∀ y ∃ sobre dominios finitos |  |
| cuantificadores.header.subtituloLiteral | Evalúa cuantificadores para todo y existe sobre dominios finitos |  |
| cuantificadores.pestanas.cuantificadores | ∀∃ Cuantificadores |  |
| cuantificadores.pestanas.cuantificadoresLiteral | Cuantificadores (para todo / existe) |  |
| cuantificadores.pestanas.leyes | ⇔ Distribución y Leyes |  |
| cuantificadores.panelCuantificador.universal | Universal |  |
| cuantificadores.panelCuantificador.universalLiteral | Para todo |  |
| cuantificadores.panelCuantificador.existencial | Existencial |  |
| cuantificadores.panelCuantificador.existencialLiteral | Existe |  |
| cuantificadores.dominio.titulo | Dominio de Discurso D |  |
| cuantificadores.dominio.ayuda | Lista: 1, 2, 3 · Rango: 0 < x < 9 · Solo enteros ℤ |  |
| cuantificadores.predicado.titulo | Predicado P(x) |  |
| cuantificadores.botones.evaluar | Evaluar Cuantificador |  |
| cuantificadores.simbolos[0] | ∀ |  |
| cuantificadores.simbolos[1] | ∃ |  |
| cuantificadores.simbolos[2] | ∈ |  |
| cuantificadores.simbolos[3] | → |  |
| cuantificadores.simbolos[4] | ∧ |  |
| cuantificadores.simbolos[5] | ∨ |  |
| cuantificadores.simbolos[6] | ¬ |  |
| cuantificadores.simbolos[7] | ≡ |  |
| cuantificadores.simbolos[8] | ∴ |  |
| cuantificadores.simbolos[9] | Δ |  |
| cuantificadores.simbolos[10] | ⊕ |  |

## 05_Conjuntos
| Clave | Texto actual | Propuesto |
|---|---|---|
| conjuntos.header.titulo | Teoría de Conjuntos y Diagramas de Venn |  |
| conjuntos.header.subtitulo | Calculadora Interactiva de Operaciones y Propiedades |  |
| conjuntos.define.titulo | Define tus conjuntos |  |
| conjuntos.operaciones.union.label | A ∪ B |  |
| conjuntos.operaciones.interseccion.label | A ∩ B |  |
| conjuntos.operaciones.diferencia.label | A − B |  |
| conjuntos.operaciones.diferencia-ba.label | B − A |  |
| conjuntos.operaciones.complemento-a.label | A' |  |
| conjuntos.operaciones.complemento-b.label | B' |  |
| conjuntos.operaciones.potencia.label | P( ... ) |  |
| conjuntos.diagrama.titulo | Diagrama de Venn |  |
| conjuntos.resultado.titulo | Resultado |  |
| conjuntos.propiedades.titulo | Propiedades |  |
| conjuntos.pertenencia.titulo | Verificar pertenencia |  |

## 06_Inferencias
| Clave | Texto actual | Propuesto |
|---|---|---|
| inferencias.titulo | Demostrador de Inferencias Lógicas |  |
| inferencias.tituloLiteral | Validador de Inferencias Lógicas |  |
| inferencias.subtitulo | Ingresa premisas formales, visualiza el árbol sintáctico (AST), traduce a lenguaje natural y valida deducciones paso a paso. |  |
| inferencias.pestanas.simbolos | Simbología Formal |  |
| inferencias.pestanas.simbolosLiteral | Notación formal |  |
| inferencias.pestanas.lenguaje | Lenguaje Natural |  |
| inferencias.pestanas.arbol | Árbol Sintáctico (AST) |  |
| inferencias.badge | Hijos de Linus |  |
| inferencias.trazabilidad.tituloValida | Trazabilidad de la Demostración |  |
| inferencias.trazabilidad.tituloInvalida | Análisis y Diagnóstico de la Demostración |  |

## 07_Leyes
| Clave | Texto actual | Propuesto |
|---|---|---|
| leyesPage.titulo | Leyes Lógicas |  |
| leyesPage.subtitulo | Consulta y aprende las reglas fundamentales de la lógica proposicional. |  |
| leyes[1].nombre | Ley de Idempotencia |  |
| leyes[1].descripcion | Cualquier proposición operada consigo misma (mediante conjunción o disyunción) es equivalente a la proposición original. |  |
| leyes[1].descripcionFormal | Para toda proposición p: p ∧ p ≡ p y p ∨ p ≡ p. |  |
| leyes[1].formulas | p ∧ p ≡ p \| p ∨ p ≡ p |  |
| leyes[2].nombre | Ley Asociativa |  |
| leyes[2].descripcion | Cuando tienes tres o más proposiciones unidas por el mismo operador lógico, el orden en el que agrupes las operaciones usando paréntesis no altera el valor de verdad final. |  |
| leyes[2].descripcionFormal | Para todo p,q,r: (p ∧ q) ∧ r ≡ p ∧ (q ∧ r). |  |
| leyes[2].formulas | (p ∧ q) ∧ r ≡ p ∧ (q ∧ r) \| (p ∨ q) ∨ r ≡ p ∨ (q ∨ r) \| (p ↔ q) ↔ r ≡ p ↔ (q ↔ r) |  |
| leyes[3].nombre | Ley Conmutativa |  |
| leyes[3].descripcion | El orden en el que se combinan dos proposiciones mediante los operadores de conjunción (Y), disyunción (O) o disyunción fuerte no altera el valor de verdad de la proposición final. |  |
| leyes[3].descripcionFormal | p ∧ q ≡ q ∧ p. |  |
| leyes[3].formulas | p ∧ q ≡ q ∧ p \| p ∨ q ≡ q ∨ p \| p ↔ q ≡ q ↔ p |  |
| leyes[4].nombre | Ley Distributiva |  |
| leyes[4].descripcion | Un operador lógico fuera de un paréntesis se distribuye sobre cada uno de los elementos dentro de él. |  |
| leyes[4].descripcionFormal | p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r). |  |
| leyes[4].formulas | p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r) \| p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r) \| p → (q ∧ r) ≡ (p → q) ∧ (p → r) \| p → (q ∨ r) ≡ (p → q) ∨ (p → r) |  |
| leyes[5].nombre | Ley de Absorción |  |
| leyes[5].descripcion | Una proposición combinada mediante conjunción y disyunción con otra proposición repetida se reduce simplemente a esta última. |  |
| leyes[5].descripcionFormal | p ∧ (p ∨ q) ≡ p. |  |
| leyes[5].formulas | p ∧ (p ∨ q) ≡ p \| p ∨ (p ∧ q) ≡ p |  |
| leyes[6].nombre | Ley de Complemento |  |
| leyes[6].descripcion | Al combinar una proposición con su negación se obtiene un valor absoluto. |  |
| leyes[6].descripcionFormal | p ∧ ¬p ≡ F; p ∨ ¬p ≡ V; ¬¬p ≡ p. |  |
| leyes[6].formulas | ¬¬p ≡ p \| p ∧ ¬p ≡ F ≡ ¬p ∧ p \| p ∨ ¬p ≡ V ≡ ¬p ∨ p \| p → p ≡ V, p ↔ p ≡ V \| ¬(p ∧ ¬p) ≡ V \| ¬V ≡ F, ¬F ≡ V |  |
| leyes[7].nombre | Ley de Identidad |  |
| leyes[7].descripcion | Al combinar una proposición con un valor de verdad constante, esta conserva su valor original o se absorbe por la constante. |  |
| leyes[7].descripcionFormal | p ∧ V ≡ p; p ∨ F ≡ p. |  |
| leyes[7].formulas | p ∧ V ≡ p ≡ V ∧ p \| p ∧ F ≡ F ≡ F ∧ p \| p ∨ V ≡ V ≡ V ∨ p \| p ∨ F ≡ p ≡ F ∨ p |  |
| leyes[8].nombre | Ley de Morgan |  |
| leyes[8].descripcion | La negación de una operación lógica cambia los operadores al distribuirse. |  |
| leyes[8].descripcionFormal | ¬(p ∧ q) ≡ ¬p ∨ ¬q. |  |
| leyes[8].formulas | ¬(p ∧ q) ≡ ¬p ∨ ¬q \| ¬(p ∨ q) ≡ ¬p ∧ ¬q |  |
| leyes[9].nombre | Ley de Expansión Booleana |  |
| leyes[9].descripcion | Puedes añadir una variable cualquiera a una proposición sin alterar su valor original, sumando su versión verdadera y su versión falsa. |  |
| leyes[9].descripcionFormal | p ≡ p ∧ (q ∨ ¬q). |  |
| leyes[9].formulas | p ≡ p ∧ (q ∨ ¬q) \| p ≡ p ∨ (q ∧ ¬q) |  |
| leyes[10].nombre | Ley de Trasposición |  |
| leyes[10].descripcion | Una implicación condicional equivale a invertir el orden de las proposiciones negándolas ambas. |  |
| leyes[10].descripcionFormal | p → q ≡ ¬q → ¬p. |  |
| leyes[10].formulas | p → q ≡ ¬q → ¬p |  |
| leyes[11].nombre | Ley de Exportación |  |
| leyes[11].descripcion | Tener dos condiciones juntas para lograr un resultado es lo mismo que cumplir la primera y que esta te condicione a cumplir la segunda. |  |
| leyes[11].descripcionFormal | (p ∧ q) → r ≡ p → (q → r). |  |
| leyes[11].formulas | (p ∧ q) → r ≡ p → (q → r) |  |
| leyes[12].nombre | Leyes de Definición |  |
| leyes[12].descripcion | Reglas para traducir operadores complejos en combinaciones equivalentes de los conectores básicos. |  |
| leyes[12].descripcionFormal | p → q ≡ ¬p ∨ q; p ↔ q ≡ (p → q) ∧ (q → p). |  |
| leyes[12].formulas | p → q ≡ ¬p ∨ q \| p ↔ q ≡ (p → q) ∧ (q → p) \| p ↔ q ≡ (¬p ∨ q) ∧ (¬q ∨ p) \| p ▲ q ≡ (p ∨ q) ∧ ¬(p ∧ q) |  |

## 08_Global
| Clave | Texto actual | Propuesto |
|---|---|---|
| global.marca.titulo | Logi |  |
| global.marca.subtitulo | Leyes lógicas y tablas de verdad |  |
| global.nav[0].label | Inicio |  |
| global.nav[1].label | Aprender |  |
| global.nav[2].label | Tablas de verdad |  |
| global.nav[3].label | Leyes lógicas |  |
| global.nav[4].label | Ejercicios |  |
| global.nav[5].label | Progreso |  |
| global.footer | LogiLearn · Proyecto de Aula 2026 · Universidad Nacional Pedro Ruiz Gallo |  |
