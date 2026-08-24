# LogiLearn — Página de Inicio

Landing page de LogiLearn convertida desde el diseño de Figma, construida con **Vue 3 + TypeScript + Vite** usando Single File Components (.vue).

## Estructura de componentes

```
src/
├── App.vue                  # Componente raíz, compone la página
├── main.ts                  # Punto de entrada
├── assets/
│   ├── main.css              # Tokens de diseño (colores, tipografías, spacing)
│   └── hero-illustration.png # Ilustración del hero
└── components/
    ├── NavBar.vue             # Barra de navegación superior
    ├── HeroSection.vue        # Sección principal (título, CTA, badges, ilustración)
    ├── FeaturesSection.vue    # Sección "Todo lo que necesitas..."
    └── FeatureCard.vue        # Card reutilizable (usada 4 veces con distintas props)
```

## Cómo correrlo

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # build de producción
npm run preview   # previsualizar el build
```

## Notas de fidelidad al diseño

- Colores extraídos por muestreo de píxeles directamente de la captura del diseño (navy `#0F2D8D`, azul botón `#3558CE`, badges `#C4DFFC`, etc.), definidos como CSS variables en `assets/main.css`.
- Tipografía: `Poppins` para títulos (peso 700/800) e `Inter` para texto de cuerpo, cargadas desde Google Fonts — la fuente exacta usada en el diseño de Figma no pudo confirmarse sin acceso al archivo, así que se eligió el par tipográfico visualmente más cercano.
- Layout responsive: el grid de 4 columnas del hero de features colapsa a 2 columnas en tablet y 1 en móvil; el hero pasa a una sola columna en pantallas angostas.
- Ícono del logo y de las 4 feature cards son SVG inline (no se usó la imagen original) para que sean editables y ligeros.
