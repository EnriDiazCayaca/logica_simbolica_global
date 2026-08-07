# Asistente e Intérprete de Inferencias Lógicas

**Equipo:** Los Hijos de Linus  
**Integrantes:** Espinoza Arom, Centurión Alex, Mio Arnold, Morocho Juan, Altamirano Renatto  
**Tema:** Inferencias Lógicas  

---

### 1. Problema a Resolver

El aprendizaje de las inferencias lógicas en estudiantes universitarios presenta dos dificultades principales:
1. **Dificultad en la resolución asistida y verificación:** A los estudiantes les cuesta comprobar de forma rápida si un razonamiento lógico es válido o inválido, así como visualizar la demostración formal mediante método directo o indirecto.
2. **Dificultad en el aprendizaje interactivo paso a paso:** Muchos estudiantes tienen problemas para identificar y aplicar correctamente las reglas de inferencia por sí mismos en el desarrollo de una prueba, cometiendo errores de deducción sin recibir retroalimentación inmediata sobre qué falla en su razonamiento.

---

### 2. Funcionalidad Propuesta

La herramienta consistirá en un sistema web interactivo compuesto por **dos interfases (módulos) principales**:

#### 🔵 2.1. Interfaz de Calcular y Resolver (Resolución Automática)
* **Ingreso de Datos:** El usuario ingresa un conjunto de premisas y la conclusión que se desea demostrar.
* **Selección de Método:** Permite elegir entre el **Método Directo** o el **Método Indirecto** (Reducción al absurdo).
* **Motor de Resolución:** El sistema reescribe las premisas utilizando equivalencias lógicas según sea conveniente y genera la demostración completa del razonamiento de manera automática.

#### 🟢 2.2. Interfaz de Practicar Ejercicios (Resolución Guiada e Interactiva)
* **Entorno de Práctica:** El estudiante inicia con las premisas y la conclusión del ejercicio a resolver.
* **Aplicación Manual de Reglas:** El usuario selecciona manualmente una regla de inferencia y especifica sobre qué líneas de premisas desea aplicarla.
* **Validación en Tiempo Real:** 
  * Si la aplicación es **correcta**, el sistema agrega automáticamente la nueva proposición derivada y habilita el siguiente paso.
  * Si la aplicación es **incorrecta**, la plataforma muestra un mensaje de retroalimentación indicando el error cometido.
* **Objetivo:** Acompañar el proceso de aprendizaje permitiendo al estudiante construir la demostración paso a paso hasta llegar a la conclusión.

---

### 3. Boceto Visual (Wireframe)

#### Módulo 1: Interfaz de Calcular y Resolver
![Interfaz de Calcular y Resolver](assets/interfaz-arnold.png)

#### Módulo 2: Interfaz de Practicar Ejercicios
![Interfaz de Practicar Ejercicios](assets/interfaz-mor.jpeg)

---

### Observación

La herramienta busca integrar tanto un componente utilitario de resolución automatizada como un componente pedagógico interactivo. Para un desarrollo eficiente, la plataforma dispondrá de un módulo centralizado de equivalencias y reglas de inferencia lógicas reutilizable en ambos sistemas.
