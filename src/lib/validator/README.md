# 🛡️ Módulo de Sanitización y Validación (`src/lib/validator`)

**Autor:** Renato (Equipo Hijos de Linus)  
**Sprint:** 2 · Motor Lógico & Calidad

Este módulo es la primera línea de defensa del motor lógico proposicional. Se encarga de limpiar, normalizar, validar y proteger el pipeline contra entradas maliciosas, errores sintácticos, paréntesis desbalanceados y diferencias de notación simbólica antes de enviar los datos al Parser o Solver.

---

## 🚀 Funciones Principales

### 1. `sanitizarEntrada(texto: string): string`
Limpia espacios extra, normaliza cualquier símbolo lógico estándar a las palabras clave en español en mayúsculas (`Y`, `O`, `NO`, `ENTONCES`, `SI_Y_SOLO_SI`, `O_EXCLUSIVA`, `NI`, `INCOMPATIBLE`), asegura el espaciado de paréntesis y valida variables.

Lanza una excepción `Error` descriptiva si la entrada es insalvable.

```typescript
import { sanitizarEntrada } from '@/lib/validator';

// Ejemplo con notación matemática
const limpia = sanitizarEntrada("p -> (q & ~r)");
console.log(limpia); // "P ENTONCES ( Q Y NO R )"

// Ejemplo con notación Unicode
const limpiaUnicode = sanitizarEntrada("p ↔ (q ∨ r)");
console.log(limpiaUnicode); // "P SI_Y_SOLO_SI ( Q O R )"
```

---

### 2. `validarExpresion(texto: string): ResultadoValidacion`
Función segura que **no lanza excepciones**. Retorna un objeto con el estado de validez, el texto limpio y el mensaje de error si no es válida. Especialmente diseñada para formularios reactivos en componentes de Vue 3 (Sprint 3).

```typescript
import { validarExpresion } from '@/lib/validator';

const resultado = validarExpresion("P Y (Q O R");
if (!resultado.esValida) {
  console.error(resultado.error); // "Paréntesis desbalanceados: falta cerrar ')'"
} else {
  console.log(resultado.textoSanitizado);
}
```

---

### 3. `validarPremisasYConclusion(premisas, conclusion, opciones?): ResultadoValidacionConjunto`
Procesa un arreglo completo de premisas y la conclusión deseada, eliminando premisas duplicadas y acumulando los errores detectados.

```typescript
import { validarPremisasYConclusion } from '@/lib/validator';

const res = validarPremisasYConclusion(
  ["p -> q", "p", "p -> q"], // Duplicado automático eliminado
  "q"
);

if (res.esValido) {
  console.log(res.premisasSanitizadas); // ["P ENTONCES Q", "P"]
  console.log(res.conclusionSanitizada); // "Q"
}
```

---

## 📋 Tabla de Símbolos y Mapeo de Operadores

| Operador | Símbolos Soportados | Token Estándar |
|---|---|---|
| **Condicional** | `->`, `=>`, `-->`, `→`, `⇒`, `entonces`, `implies` | `ENTONCES` |
| **Bicondicional** | `<->`, `<=>`, `<-->`, `↔`, `⇔`, `si y solo si`, `iff` | `SI_Y_SOLO_SI` |
| **Conjunción** | `&`, `&&`, `^`, `∧`, `·`, `*`, `y`, `and` | `Y` |
| **Disyunción** | `\|`, `\|\|`, `∨`, `+`, `v`, `o`, `or` | `O` |
| **Negación** | `~`, `¬`, `!`, `no`, `not` | `NO` |
| **Disyunción Exclusiva** | `⊕`, `⊻`, `xor`, `o exclusiva` | `O_EXCLUSIVA` |
| **NOR** | `↓`, `⊽`, `ni`, `nor` | `NI` |
| **NAND** | `↑`, `⊼`, `incompatible`, `nand` | `INCOMPATIBLE` |

---

## 🧪 Ejecución de Pruebas

Para ejecutar las pruebas unitarias y verificar la cobertura del módulo:

```powershell
npm test
```

Para verificar los tipos de TypeScript en modo estricto:

```powershell
npm run type-check
```
