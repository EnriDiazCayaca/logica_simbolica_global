# 🐞 Reporte de Errores — Módulo de Inferencias

| | |
|---|---|
| **Proyecto** | Lógica Simbólica — Equipo "Hijos de Linus" |
| **Página** | https://logicasimbolicaglobal.netlify.app/inferencias |
| **Reportado por** | Mio |
| **Fecha** | 23/08/2026 |
| **Componente afectado** | Motor lógico / Solver (búsqueda de la demostración) |

---

## 📌 Resumen ejecutivo

| # | Error | Tipo | ¿Afecta la validez de la conclusión? |
|---|-------|------|:---:|
| 1 | Paso redundante al demostrar `R` desde `P→Q, Q→R, P` | Camino de demostración no óptimo | No |
| 2 | Pasos redundantes/duplicados al demostrar `Q` desde 4 premisas | Camino de demostración no óptimo | No |

**Patrón detectado:** el motor lógico no siempre elige el camino más corto hacia la conclusión pedida, y en algunos casos deriva dos veces el mismo resultado (una vez normal y otra con los operandos conmutados).

---

## Error 1 — Paso redundante en la demostración

**Premisas:**

```
1. P → Q
2. Q → R
3. P
```

**Se pide demostrar:** `R`

<table>
<tr><th>✅ Camino óptimo esperado (2 pasos)</th><th>⚠️ Camino actual del sistema</th></tr>
<tr valign="top">
<td>

```
4. P → R      (SH, de 1 y 2)
5. R          (MPP, de 3 y 4)
```

</td>
<td>

```
4. Q          (MPP, de 1 y 3)   ← paso de más
5. P → R      (SH, de 1 y 2)
6. R          (MPP, de 3 y 5)
```

</td>
</tr>
</table>

**Impacto:** la demostración sigue siendo válida, pero el paso 4 (`Q`) no es necesario para llegar a `R` por el camino más corto. Afecta la claridad del procedimiento mostrado al usuario.

---

## Error 2 — Pasos redundantes y duplicados (caso con 4 premisas)

**Premisas:**

```
1. P → Q
2. R → S
3. P ∨ R
4. ¬S
```

**Se pide demostrar:** `Q`

<table>
<tr><th>✅ Camino óptimo esperado (2 pasos)</th><th>⚠️ Camino actual del sistema (5 pasos)</th></tr>
<tr valign="top">
<td>

```
5. Q ∨ S     (DC, de 1, 2 y 3)
6. Q         (MTP, de 5 y 4)
```

</td>
<td>

```
5. ¬R        (MTT, de 2 y 4)
6. P         (MTP, de 3 y 5)
7. Q ∨ S     (DC, de 1, 2 y 3)
8. S ∨ Q     (DC de nuevo)   ← duplicado de la línea 7
9. Q         (MPP, de 1 y 6)
```

</td>
</tr>
</table>

**Problemas identificados:**
- El paso `S ∨ Q` es **redundante**: es la misma disyunción que `Q ∨ S`, solo con los operandos invertidos. No aporta información nueva.
- El camino completo (hallar `¬R`, luego `P`, y recién después el dilema constructivo) es mucho más largo que ir directo por `DC` + `MTP`.

> **Observación adicional a verificar:** en la captura de pantalla original, los números de los pasos mostrados en pantalla no coinciden exactamente con los números de "Línea" que el propio sistema usa para referenciarse a sí mismo en pasos posteriores (desfase de 1). No se pudo confirmar la causa con el código revisado — ver sección técnica más abajo.

---

## 🔧 Sugerencia técnica para resolver el problema

### Sobre el código revisado

Se revisaron `solver.ts`, `parser.ts`, `types.ts`, `index.ts`, `descriptionGenerator.ts`, `astRenderer.ts`, `translations.ts` y los tests de integración. Un punto importante:

> **`solver.ts` actual es un stub/esqueleto**, no el motor que genera las demostraciones vistas en producción. Su función `demostrarConclusion()` solo tiene un caso *hardcodeado* para 2 premisas resolviendo Modus Ponendo Ponens (es la base para que pasen los tests iniciales). No contiene todavía la lógica de búsqueda que aplica Silogismo Hipotético, Dilema Constructivo, MTT, MTP, etc., ni la que decide en qué orden probar las reglas — que es justo donde vive el bug reportado. Es decir: **el bug no está en los archivos que se compartieron**; hace falta el módulo real de búsqueda/generación del árbol de inferencia (probablemente una versión más avanzada de `demostrarConclusion` o un archivo aparte tipo `buscarDemostracion.ts`) para localizar la causa exacta.

Dicho esto, la arquitectura ya definida en `types.ts` (`PasoDemostracion`, `ResultadoDemostracion`, `ReglaLogica`) es perfectamente compatible con la solución que se propone abajo — no hace falta rediseñar los tipos, solo completar/reescribir el algoritmo de búsqueda dentro de esa misma estructura.

### La causa raíz más probable

Por el patrón de los dos errores (pasos de más + resultados duplicados y conmutados), lo más probable es que el algoritmo actual:

1. Aplica las reglas en **orden de prioridad fijo** (o recorrido tipo DFS) sin comparar cuántos pasos toma cada camino, en vez de buscar explícitamente el camino más corto.
2. No tiene una **forma canónica** para comparar expresiones: trata `Q ∨ S` y `S ∨ Q` como hechos distintos porque compara el AST tal cual (ver `sonNodosIguales` en `solver.ts`, que compara `izquierdo`/`derecho` en orden estricto), en lugar de reconocer que son la misma proposición.

### Solución propuesta

**1. Búsqueda por niveles (BFS) en vez de aplicación en orden fijo**

Reemplazar la generación de pasos por una búsqueda en anchura sobre el "espacio de hechos derivables":

- **Nivel 0:** las premisas originales.
- **Nivel k:** todos los hechos nuevos que se pueden derivar combinando hechos de niveles `0..k-1` con una sola regla de inferencia.
- En cuanto la conclusión aparece en algún nivel, se detiene la búsqueda y se reconstruye el camino más corto hacia atrás (usando referencias tipo "de qué hechos salió cada uno", que ya existe como concepto en `lineasInvolucradas`).

Esto garantiza automáticamente el camino más corto: como en el Error 1, tanto `Q` (por MPP) como `P→R` (por SH) están en el mismo nivel (nivel 1), pero solo `P→R` está en el camino que realmente lleva a `R` en 2 pasos, así que el algoritmo nunca necesita expandir el hecho `Q` si no es necesario para el objetivo.

**2. Forma canónica para detectar hechos ya conocidos (evita duplicados)**

Agregar una función `normalizarNodo(nodo: NodoExpresion): string` que:

- Para operadores conmutativos (`Y`, `O`, `O_EXCLUSIVA`, `SI_Y_SOLO_SI`, `NI`, `INCOMPATIBLE`), ordena `izquierdo` y `derecho` de forma determinística (ej. alfabéticamente por su propia forma canónica) antes de serializar.
- Para operadores no conmutativos (`ENTONCES`) y `NO`, serializa respetando el orden original.
- Produce un string único por proposición lógicamente equivalente en su forma (no hace falta resolver equivalencias complejas tipo De Morgan, solo conmutatividad).

Con esa función, se mantiene un `Set<string>` (o `Map<string, PasoDemostracion>`) de "hechos ya derivados" usando la clave canónica. Antes de agregar un nuevo paso al árbol de búsqueda, se verifica si su forma canónica ya existe en el set — si existe, se descarta ese paso por completo (no se muestra ni se cuenta como parte de la demostración). Esto elimina directamente el caso `S ∨ Q` duplicando `Q ∨ S`.

**3. Dónde ubicarlo en el código actual**

- La lógica de comparación estructural que ya existe (`sonNodosIguales` en `solver.ts`) se puede mantener para comparaciones exactas, pero conviene agregar `normalizarNodo` como función nueva (en `solver.ts` o un archivo utilitario aparte) específicamente para la deduplicación de hechos derivados.
- La función `demostrarConclusion` necesita pasar de ser un caso hardcodeado a implementar el algoritmo BFS descrito arriba, devolviendo igual un `ResultadoDemostracion` con `pasos: PasoDemostracion[]` — la interfaz pública no cambia, así que `index.ts`, `descriptionGenerator.ts` y `astRenderer.ts` no deberían necesitar modificaciones.

**4. Sobre el posible desfase de numeración (Error 2, nota adicional)**

En el código revisado, `index.ts` calcula la línea de cada paso como `premisas.length + indice + 1`, lo cual es consistente y no debería producir el desfase visto en la captura. Esto refuerza que el desfase observado probablemente viene del mismo módulo de búsqueda no incluido en los archivos compartidos — valdría la pena revisarlo ahí una vez que se ubique ese archivo.

---

## ✅ Casos de prueba sugeridos

Para agregar a `solver.test.ts` (o a `integracion_motor.test.ts` si se prueba el flujo completo) una vez implementada la corrección:

```typescript
describe('Camino óptimo de demostración', () => {

  it('Caso 1: P→Q, Q→R, P ⊢ R debe resolverse en 2 pasos (SH + MPP), sin derivar Q de más', () => {
    const p_q = parsearExpresion('P ENTONCES Q');
    const q_r = parsearExpresion('Q ENTONCES R');
    const p = parsearExpresion('P');
    const r = parsearExpresion('R');

    const resultado = demostrarConclusion([p_q, q_r, p], r);

    expect(resultado.esValido).toBe(true);
    expect(resultado.pasos.length).toBe(2);
    expect(resultado.pasos[0].idPaso).toBe('SILOGISMO_HIPOTETICO');
    expect(resultado.pasos[1].idPaso).toBe('MODUS_PONENDO_PONENS');
  });

  it('Caso 2: P→Q, R→S, P∨R, ¬S ⊢ Q debe resolverse en 2 pasos (DC + MTP), sin duplicar Q∨S como S∨Q', () => {
    const p_q = parsearExpresion('P ENTONCES Q');
    const r_s = parsearExpresion('R ENTONCES S');
    const p_o_r = parsearExpresion('P O R');
    const no_s = parsearExpresion('NO S');
    const q = parsearExpresion('Q');

    const resultado = demostrarConclusion([p_q, r_s, p_o_r, no_s], q);

    expect(resultado.esValido).toBe(true);
    expect(resultado.pasos.length).toBe(2);
    expect(resultado.pasos[0].idPaso).toBe('DILEMA_CONSTRUCTIVO');
    expect(resultado.pasos[1].idPaso).toBe('SILOGISMO_DISYUNTIVO'); // alias MTP

    // Ningún paso debe repetir una expresión ya derivada en forma conmutada
    const expresionesCanonicas = resultado.pasos.map(p => normalizarNodo(p.expresionResultante));
    expect(new Set(expresionesCanonicas).size).toBe(expresionesCanonicas.length);
  });

});
```

*(`normalizarNodo` es la función nueva sugerida en la sección técnica — habría que exportarla desde `solver.ts` para poder testearla directamente.)*
