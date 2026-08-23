# Glosario de Diseño "Duolingo Vibe"

Este glosario define los tokens visuales y directrices de UI que todo el equipo debe seguir.

## 🎨 1. Colores y Semántica
Mantenemos una paleta estricta usando las utilidades base de Tailwind v4:

- **Fondo Principal:** `bg-slate-50` (o neutral muy claro).
- **Tarjetas y Paneles:** `bg-white` con bordes sutiles `border-slate-200` y sombras suaves `shadow-sm`.
- **Texto Principal:** `text-slate-900`.
- **Texto Secundario (Mutado):** `text-slate-500`.

### Estados Semánticos (Indicadores y Trazabilidad)
Basados en la implementación de 4 estados:
- **Pendiente / Neutro:** Oculto o tonos `slate-400`.
- **Éxito (Inferencia Válida):** `text-green-600` / `bg-green-50`.
- **Advertencia (Inferencia Inválida):** `text-orange-600` / `bg-orange-50` (Ej. La lógica falló pero la sintaxis está bien).
- **Error Crítico (Error de Sintaxis):** `text-red-600` / `bg-red-50` (Ej. El motor no puede parsear la entrada)..
- **Texto Secundario:** `neutral-600`.
- **Iconos (Solo SVG):** Usar la librería `lucide-vue-next`.

## 📐 Estructura y Formas
- **Tarjetas:** `rounded-xl`.
- **Botones y Badges:** `rounded-full`.
- **Sombras:** `shadow-sm` por defecto, `hover:shadow-md`.

## 🔤 Tipografía y Jerarquía
- **Familia:** `font-sans` (System UI).
- Títulos/Resultados principales: `text-2xl font-bold` a `text-4xl font-extrabold`.

## ♿ Accesibilidad y Polish
- Etiquetas semánticas y `<label>` con `for`/`id` en formularios.
- Usar `role="status"` o `aria-live="polite"` en alertas dinámicas.
- Emplear `<Transition>` para animaciones de entrada.
