# Uso del Módulo: Teoría de Conjuntos y Diagramas de Venn

## Cómo funciona

El módulo de Conjuntos del **Equipo Linus** permite al usuario definir un Universo y dos conjuntos (A y B), y luego realizar operaciones matemáticas sobre ellos. Los resultados se muestran en texto y se visualizan en un **Diagrama de Venn interactivo** que se ilumina según la operación seleccionada.

**Motor lógico:** `src/lib/sets/operations.ts`  
**Interfaz visual:** `src/pages/conjuntos/index.vue`

---

## Ejemplos

### Ejemplo 1: Unión de dos conjuntos
- **Entrada:** A = {1, 2, 3} y B = {3, 4, 5}
- **Operación:** Unión (A ∪ B)
- **Salida esperada:** {1, 2, 3, 4, 5}

### Ejemplo 2: Intersección de dos conjuntos
- **Entrada:** A = {1, 2, 3, 4} y B = {3, 4, 5, 6}
- **Operación:** Intersección (A ∩ B)
- **Salida esperada:** {3, 4}

### Ejemplo 3: Diferencia A − B
- **Entrada:** A = {1, 2, 3} y B = {2, 3}
- **Operación:** Diferencia (A − B)
- **Salida esperada:** {1}

### Ejemplo 4: Conjunto Potencia
- **Entrada:** A = {1, 2}
- **Operación:** Potencia P(A)
- **Salida esperada:** { {}, {1}, {2}, {1, 2} } → 4 subconjuntos

### Ejemplo 5: Verificación de propiedades
- **Entrada:** A = {1, 2} y B = {1, 2, 3, 4}
- **Resultado:** A ⊆ B → ✅ Sí | B ⊆ A → ❌ No | Disjuntos → ❌ No

---

## Cómo probar en la app

1. Ejecutar `npm run dev` en la raíz del proyecto.
2. Abrir `http://localhost:5173/conjuntos` en el navegador.
3. Escribir los elementos separados por comas en los campos de texto.
4. Hacer clic en los botones de operaciones para ver el resultado y el diagrama.

## Cómo correr los tests

```bash
npx vitest run src/lib/sets/operations.test.ts
```

---

## Limitaciones

- Solo soporta conjuntos finitos ingresados manualmente (separados por comas).
- Los elementos se tratan como texto (strings), no como números con orden matemático.
- El Diagrama de Venn solo soporta 2 conjuntos (A y B), no 3.
- El Conjunto Potencia puede ser lento con conjuntos de más de 15 elementos (2¹⁵ = 32,768 subconjuntos).
