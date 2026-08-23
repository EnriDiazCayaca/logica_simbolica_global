# Matriz de Casos Borde y Pruebas (Módulo de Validación)

**Autor:** Renato (Hijos de Linus)  
**Objetivo:** Proteger el motor lógico y el pipeline de inferencia simbólica ante cualquier intento de ruptura, entradas maliciosas, caracteres no permitidos, errores de sintaxis y variaciones en la notación que los usuarios puedan ingresar en la interfaz gráfica o consola.

---

## 1. Clasificación y Matriz de Casos

| ID | Categoría | Entrada de Usuario (`Input`) | Comportamiento Esperado / Sanitización | Justificación Técnica |
|---|---|---|---|---|
| **CB-01** | Vacío / Nulo | `""` (cadena vacía) | Lanzar error: *"La entrada no puede estar vacía"* | Evita procesar tokens nulos en el AST Parser. |
| **CB-02** | Espacios en blanco | `"   \t   \n  "` | Lanzar error: *"La entrada no puede contener solo espacios"* | Limpieza previa de espacios redundantes. |
| **CB-03** | Espaciado irregular | `"  P   ENTONCES    Q  "` | Sanitizar a `"P ENTONCES Q"` | Normalización por regex de espacios múltiples a uno solo. |
| **CB-04** | Minúsculas / Mayúsculas | `"p entonces q"` | Sanitizar a `"P ENTONCES Q"` | Estandariza variables y operadores en mayúsculas. |
| **CB-05** | Operador Flecha (`->`, `=>`, `→`) | `"p -> q"` / `"p => q"` / `"p → q"` | Sanitizar a `"P ENTONCES Q"` | Soporte intuitivo para notaciones simbólicas populares. |
| **CB-06** | Operador Bicondicional (`<->`, `<=>`, `↔`) | `"p <-> q"` / `"p <=> q"` / `"p ↔ q"` | Sanitizar a `"P SI_Y_SOLO_SI Q"` | Soporte de doble flecha y símbolo Unicode. |
| **CB-07** | Conjunción (`^`, `&`, `&&`, `∧`) | `"p ^ q"` / `"p & q"` / `"p && q"` / `"p ∧ q"` | Sanitizar a `"P Y Q"` | Mapeo de conjunción estándar y de programación. |
| **CB-08** | Disyunción (`v`, `V`, `\|`, `\|\|`, `∨`) | `"p v q"` / `"p \| q"` / `"p ∨ q"` | Sanitizar a `"P O Q"` | Diferenciación contextual de la letra 'v' como 'O'. |
| **CB-09** | Negación (`~`, `!`, `¬`) | `"~p"` / `"!p"` / `"¬p"` / `"NO p"` | Sanitizar a `"NO P"` | Normalización de prefijos unarios de negación. |
| **CB-10** | Disyunción Exclusiva (`⊕`, `^`, `⊻`, `XOR`) | `"p ⊕ q"` / `"p XOR q"` / `"p ⊻ q"` | Sanitizar a `"P O_EXCLUSIVA Q"` | Compatibilidad con notación lógica avanzada. |
| **CB-11** | NOR / Barra de Nicod (`↓`, `NI`, `⊽`) | `"p ↓ q"` / `"p NI q"` | Sanitizar a `"P NI Q"` | Operador de incompatibilidad conjunta. |
| **CB-12** | NAND / Barra de Sheffer (`↑`, `⊼`, `NAND`) | `"p ↑ q"` / `"p NAND q"` | Sanitizar a `"P INCOMPATIBLE Q"` | Operador de negación alterna. |
| **CB-13** | Paréntesis pegados | `"P ENTONCES(Q O R)"` | Sanitizar a `"P ENTONCES ( Q O R )"` | Aislamiento léxico de paréntesis. |
| **CB-14** | Paréntesis desbalanceados (Apertura sin cierre) | `"(P ENTONCES Q"` | Lanzar error: *"Paréntesis desbalanceados: falta cerrar ')'"* | Validación sintáctica previa al parser. |
| **CB-15** | Paréntesis desbalanceados (Cierre sin apertura) | `"P ENTONCES Q)"` | Lanzar error: *"Paréntesis desbalanceados: ')' inesperado"* | Validación de orden de cierre de paréntesis. |
| **CB-16** | Paréntesis vacíos | `"P ENTONCES ()"` | Lanzar error: *"Expresión vacía dentro de paréntesis"* | Evita nodos hijos indefinidos en el AST. |
| **CB-17** | Caracteres prohibidos / Emojis | `"P 🚀 Q"` / `"P @ Q"` / `"P $ Q"` | Lanzar error: *"Caracteres inválidos o no reconocidos: [🚀, @, $]"* | Bloquea inyecciones y caracteres extraños. |
| **CB-18** | Inyección de código / Tags HTML | `"<script>alert(1)</script>"` | Lanzar error: *"Caracteres inválidos detectados: [<, >, /]"* | Previene XSS y problemas de renderizado en Vue. |
| **CB-19** | Variables con subíndices | `"P1 ENTONCES P2"` / `"p_1 Y p_2"` | Sanitizar a `"P1 ENTONCES P2"` / `"P_1 Y P_2"` | Soporte a proposiciones indexadas (`P1`, `Q2`, `R_1`). |
| **CB-20** | Operadores consecutivos inválidos | `"P Y Y Q"` / `"P ENTONCES O Q"` | Lanzar error: *"Operadores lógicos consecutivos sin proposición intermedia"* | Evita fallos críticos de evaluación en cascada. |
| **CB-21** | Negaciones múltiples anidadas | `"~~~P"` / `"NO NO NO P"` | Sanitizar a `"NO NO NO P"` | Soporte de simplificación y doble negación. |
| **CB-22** | Operador sin operandos | `"ENTONCES"` / `"Y"` / `"NO"` | Lanzar error: *"Expresión incompleta: falta operando"* | Validación de estructura mínima. |
| **CB-23** | Premisas repetidas o redundantes | Premisas: `["P -> Q", "P -> Q", "P"]` | Sanitizar a conjunto sin duplicados redundantes `["P ENTONCES Q", "P"]` | Optimización de memoria para el Solver. |
| **CB-24** | Conclusión idéntica a premisa | Premisas: `["P"]`, Conclusión: `"P"` | Sanitizar y validar como trivialmente demostrable en 0 pasos | Caso borde lógico básico. |
| **CB-25** | Conjunto de premisas vacío | Premisas: `[]`, Conclusión: `"P"` | Lanzar error: *"Se requiere al menos una premisa"* | Validación de parámetros para el motor de inferencia. |

---

## 2. Estrategia de Implementación
1. **Filtro de Entrada Pura:** `sanitizarEntrada(texto)` limpiará la cadena, aplicará los reemplazos de alias simbólicos mediante expresiones regulares seguras y normalizará mayúsculas.
2. **Validador Estructural Rápido:** `validarExpresion(texto)` retornará un objeto estructurado sin romper la ejecución con excepciones no controladas.
3. **Validador del Conjunto Completo:** `validarPremisasYConclusion(premisas, conclusion)` procesará tanto las premisas como la conclusión en un solo paso, eliminando duplicados y preparando los datos directamente para el `ASTParser` de Arom.
