# lucide (Vanilla JS)

## Installation

```sh
npm install lucide
```

## CDN

```html
<!-- Pin to a specific version (recommended) -->
<script src="https://unpkg.com/lucide@x.xxx.x/dist/umd/lucide.min.js"></script>

<!-- Latest (not recommended for production) -->
<script src="https://unpkg.com/lucide@latest"></script>
```

## Usage

### Via data-attribute + createIcons()

```html
<i data-lucide="volume-2" class="my-class"></i>
<i data-lucide="menu"></i>

<script src="https://unpkg.com/lucide@latest"></script>
<script>
  lucide.createIcons();
</script>
```

### ES Modules (tree-shakeable — recommended)

```html
<i data-lucide="menu"></i>
```

```js
// Import only what you need
import { createIcons, Menu, ArrowRight, Globe } from 'lucide';

createIcons({ icons: { Menu, ArrowRight, Globe } });

// Or all icons (caution: large bundle)
import { createIcons, icons } from 'lucide';
createIcons({ icons });
```

## createIcons() Options

```js
import { createIcons } from 'lucide';

createIcons({
  attrs: {
    class: ['my-icon'],
    'stroke-width': 1,
    stroke: '#333'
  },
  nameAttr: 'data-lucide', // attribute holding icon name
  root: shadowRootElement,  // custom DOM root (e.g., shadow DOM)
  inTemplates: true         // also replace icons inside <template> tags
});
```

## createElement()

Create SVG elements directly in JavaScript:

```js
import { createElement, Menu } from 'lucide';

const menuIcon = createElement(Menu, {
  class: ['my-icon'],
  'stroke-width': 1,
  stroke: '#333'
}); // Returns HTMLElement (svg)

document.getElementById('app').appendChild(menuIcon);
```

## Custom / Lab Icons

```js
import { createIcons } from 'lucide';
import { coconut } from '@lucide/lab';

createIcons({ icons: { coconut } });
```

## Accessibility

```html
<i data-lucide="house" aria-label="Home icon"></i>
<script>lucide.createIcons();</script>
```
