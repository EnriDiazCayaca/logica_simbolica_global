# 📋 Plan y Tareas Pendientes — Sprint 3.5

## 🎯 Objetivo General
Extender el módulo de Inferencias Lógicas con un sistema completo y avanzado de **Interpretación y Traducción a Lenguaje Natural**, permitiendo narrar demostraciones deductivas complejas como argumentos en prosa cotidiana.

---

## 📝 Tareas Planificadas para Sprint 3.5

### 1. Sistema de Variables y Semántica
- [ ] Permitir asociar enunciados en lenguaje natural completos a cualquier variable proposicional (ej. `P = "El cielo está nublado"`, `Q = "Lloverá por la tarde"`).
- [ ] Soporte para inferencia de polaridad gramatical en negaciones (ej. convertir `P = "Está lloviendo"` con `NO P` a `"No está lloviendo"` en vez de `"No es cierto que está lloviendo"`).

### 2. Narración Paso a Paso de la Trazabilidad
- [ ] Traducir cada paso deducido en el `PanelTrazabilidad` a una explicación en prosa argumentativa conectada con las premisas del usuario.
- [ ] Exportación del argumento en formato texto / PDF para reportes académicos.

### 3. Polish y Accesibilidad
- [ ] Lectura por síntesis de voz (Text-To-Speech) del argumento demostrado.
- [ ] Pruebas unitarias completas en `TraductorLenguajeNatural.test.ts`.
