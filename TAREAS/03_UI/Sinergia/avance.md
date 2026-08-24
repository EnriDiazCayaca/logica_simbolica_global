# Tarea 03 — Interfaz Visual: Sinergia

## Qué hicimos

Se adaptó la interfaz de tablas de verdad desarrollada en LogiLearn v3 a `src/pages/tablas/index.vue`.

La interfaz permite:

- Introducir una fórmula lógica.
- Insertar operadores lógicos frecuentes.
- Generar la tabla de verdad.
- Mostrar las variables detectadas.
- Mostrar los pasos de evaluación de la fórmula.
- Mostrar la clasificación como tautología, contradicción o contingencia.
- Usar diseño responsive y los componentes UI compartidos del repositorio.

## Conexión con el motor

La página consume directamente la API del motor:

```ts
import { generarTabla } from '@/lib/truth-table/evaluator'
```

## Archivo modificado/creado

- `src/pages/tablas/index.vue`

## Cómo probarlo

1. Abrir la sección de Tablas de Verdad.
2. Escribir una fórmula, por ejemplo `p AND q`.
3. Pulsar **Generar tabla**.
4. Comprobar las combinaciones V/F y la clasificación.

## Qué falta

Realizar la integración final con la rama principal y tomar las capturas de pantalla solicitadas por el entregable una vez ejecutada la aplicación dentro del repositorio oficial.
