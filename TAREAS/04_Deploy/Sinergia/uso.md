# Uso del Módulo: Tablas de Verdad

## Cómo funciona

El módulo recibe una fórmula de lógica proposicional, la analiza mediante el motor de tablas de verdad y genera todas las combinaciones posibles de sus variables.

Para cada combinación se calcula el valor de las subexpresiones y el resultado final. Con la columna final se determina si la proposición es una tautología, contradicción o contingencia.

## Ejemplos

### Ejemplo 1 — Tautología

**Entrada:**

```text
p OR NOT p
```

**Salida esperada:**

```text
TAUTOLOGÍA
```

### Ejemplo 2 — Contingencia

**Entrada:**

```text
p AND q
```

**Salida esperada:**

```text
CONTINGENCIA
```

### Ejemplo 3 — Contradicción

**Entrada:**

```text
p AND NOT p
```

**Salida esperada:**

```text
CONTRADICCIÓN
```

## Limitaciones

- El motor trabaja con lógica proposicional finita.
- Las variables se representan mediante letras.
- No evalúa cuantificadores ni lógica de predicados.
- La integración definitiva depende de la configuración del proyecto principal.
