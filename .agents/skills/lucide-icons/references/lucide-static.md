# lucide-static

> **Not recommended for production.** SVG sprites and icon fonts include all icons, significantly increasing bundle size. For production, use a tree-shakeable package instead.

Ideal for: icon fonts with plain CSS, embedding raw SVGs, CSS background images, Node.js CommonJS environments.

## Installation

```sh
npm install lucide-static
```

## SVG Files

### As Image

```html
<!-- Webpack -->
<img src="~lucide-static/icons/house.svg" />

<!-- CDN -->
<img src="https://unpkg.com/lucide-static@latest/icons/house.svg" />
```

### As CSS Background

```css
.house-icon { background-image: url(~lucide-static/icons/house.svg); }
```

### As String (for templating)

```js
// Vite
import arrowRightIcon from 'lucide-static/icons/arrow-right.svg?raw';

// Webpack
import arrowRightIcon from 'lucide-static/icons/arrow-right';
```

## SVG Sprite

```html
<svg width="24" height="24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <use href="#alert-triangle" />
</svg>
```

CSS helper approach:

```css
.lucide-icon {
  width: 24px; height: 24px;
  stroke: currentColor; fill: none;
  stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
}
```

## Icon Font

```css
/* Vite */
@import 'lucide-static/font/lucide.css';

/* CDN */
/* <link rel="stylesheet" href="https://unpkg.com/lucide-static@latest/font/lucide.css" /> */
```

```html
<div class="icon-house"></div>
```

Use kebab-case icon names with `icon-` prefix.

## Node.js

```js
// ESM
import { MessageSquare } from 'lucide-static';

// CommonJS
const { MessageSquare } = require('lucide-static');
```

> Icon names are PascalCase. Each import is an SVG string.
