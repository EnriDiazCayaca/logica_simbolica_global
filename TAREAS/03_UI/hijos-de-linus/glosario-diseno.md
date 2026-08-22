# Glosario de Diseño "Duolingo Vibe"

Este glosario define los tokens visuales y directrices de UI que todo el equipo debe seguir.

## 🎨 Paleta de Colores e Iconografía
*(Nota: Los emojis en esta documentación son meramente ilustrativos. En el código fuente de UI están estrictamente prohibidos los emojis planos).*
- **Fondo General:** `neutral-50`.
- **Fondo de Tarjetas:** `white`.
- **Acento Primario:** `blue-600`.
- **Éxito (Válido):** `green-600`.
- **Error (Inválido):** `red-600`.
- **Texto Principal:** `neutral-900`.
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
