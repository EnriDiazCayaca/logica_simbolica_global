# Tarea 02 — Motor Lógico: Sinergia

## Qué hicimos

Se adaptó el motor de lógica proposicional desarrollado en la versión v3 de LogiLearn a la estructura solicitada por el repositorio colaborativo.

El motor permite:

- Parsear proposiciones con variables y paréntesis.
- Evaluar `NOT`, `AND`, `OR`, `IMPLIES` e `IFF`.
- Detectar las variables de una fórmula.
- Generar todas las combinaciones de valores de verdad.
- Evaluar subexpresiones y resultado final.
- Clasificar una proposición como tautología, contradicción o contingencia.

## Archivos creados

- `src/lib/truth-table/evaluator.ts`
- `src/lib/truth-table/evaluator.test.ts`

## API principal

```ts
export function evaluar(nodo: NodoExpresion, asignacion: Map<string, boolean>): boolean
export function generarTabla(formula: string): ResultadoTabla
```

También se exportan `parseProposition`, `collectVariables` y los tipos utilizados por la interfaz.

## Ejemplos

- `p AND q` → contingencia.
- `p OR NOT p` → tautología.
- `p AND NOT p` → contradicción.
- `p IMPLIES q` → contingencia.

## Qué falta

La integración final depende del merge de esta contribución con la rama principal del proyecto y de ejecutar las pruebas dentro de la configuración definitiva del repositorio.
