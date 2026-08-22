# Avance de Interfaz Visual - Equipo Linus (Conjuntos)

## Qué hicimos
Creamos la interfaz interactiva completa en Vue 3 con `<script setup lang="ts">` para la Teoría de Conjuntos, siguiendo el branding Duolingo (azul) del proyecto.

### Funcionalidades implementadas:
- **Inputs de conjuntos:** Campos para definir Universo U, Conjunto A y Conjunto B.
- **Selector de operaciones:** Botones para Unión, Intersección, Diferencia (A−B y B−A), Complemento (A' y B'), y Conjunto Potencia P(A).
- **Diagrama de Venn (SVG):** Se ilumina en tiempo real según la operación seleccionada, mostrando los elementos en cada región.
- **Panel de resultado:** Muestra el resultado de la operación seleccionada.
- **Verificación de propiedades:** Comprueba automáticamente si A⊆B, B⊆A, A=B, o si son disjuntos.
- **Verificar pertenencia:** Input para comprobar si un elemento pertenece a A, B o U.

### Componentes reutilizados:
- `Button.vue` (variant primary/secondary)
- `Card.vue` (contenedores con bordes redondeados)
- `Badge.vue` (etiquetas verde/roja para indicadores)

## Archivos Modificados
- `src/pages/conjuntos/index.vue`: Interfaz completa conectada al motor de `src/lib/sets/operations.ts`.

## Qué falta
- Para el Entregable 4: Deploy final del proyecto.

## Cómo probar el módulo
1. Ejecutar `npm run dev` en la raíz del proyecto.
2. Navegar a `http://localhost:5173/conjuntos`.
3. Ingresar valores en los campos de Universo, A y B.
4. Hacer clic en los botones de operaciones para ver el diagrama y los resultados.
