# Reglas y Convenciones del Proyecto (Antigravity AI)

## Stack Tecnológico
- **Framework:** Vue 3 (Composition API con `<script setup lang="ts">`)
- **Lenguaje:** TypeScript (Strict mode activado)
- **Bundler / Dev Server:** Vite
- **Estilos:** Tailwind CSS v4
- **Testing:** Vitest
- **Type Checker / LSP:** `vue-tsc`, `@vue/language-server` (Volar), `typescript-language-server`

## Comandos Esenciales
- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run type-check`: Ejecuta la verificación estricta de tipos de TypeScript y componentes Vue (`vue-tsc --noEmit`). **Ejecutar siempre para validar cambios.**
- `npm test`: Ejecuta las pruebas unitarias con Vitest (`vitest run`).
- `npm run build`: Compila la aplicación para producción validando tipos previamente.

## Directrices para Agentes de IA
1. **TypeScript Estricto:** Evitar el uso de `any`. Definir siempre interfaces y tipos claros en `src/types/` o archivos de módulo correspondientes.
2. **Vue 3 Composition API:** Usar siempre `<script setup lang="ts">`. No usar Options API.
3. **Verificación de Errores:** Al crear o modificar código, verificar que no existan errores de tipos ejecutando `npm run type-check`.
4. **Arquitectura Modular:** Mantener los componentes UI totalmente desacoplados de los motores lógicos subyacentes.
5. **No Duplicación y Respeto de Roles:** NINGÚN agente de IA debe implementar, simular o duplicar componentes o módulos asignados a otro integrante. Si se necesita un componente ajeno, se debe esperar o usar los tipos compartidos (`src/types/`) sin crear versiones paralelas.
6. **Commits Atómicos:** Todo cambio generado debe estar encapsulado en commits pequeños, atómicos y descriptivos (ej. `feat: create Layout`).
7. **Verificación Manual Obligatoria (QA Humano):** Todo agente de IA que asista en UI debe proporcionar al desarrollador un "Checklist de Verificación Manual" al final de su código, listando pruebas físicas irreplicables por la IA (ej. navegación mediante 'Tab', comprobación de contrastes en monitor, lectores de pantalla, o redimensionamiento manual).
