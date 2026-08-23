# @lucide/astro

## Installation

```sh
npm install @lucide/astro
```

## Basic Usage

```astro
---
import { Camera } from '@lucide/astro';
---

<Camera color="#ff3e98" />
```

For faster builds, import from the icons directory:

```astro
---
import CircleAlert from '@lucide/astro/icons/circle-alert';
---

<CircleAlert color="#ff3e98" />
```

## Props

| name                  | type      | default      |
| --------------------- | --------- | ------------ |
| `size`                | number    | 24           |
| `color`               | string    | currentColor |
| `stroke-width`        | number    | 2            |
| `absoluteStrokeWidth` | boolean   | false        |

Also accepts all SVG presentation attributes as props.

## TypeScript — Typing Icon References

```astro
---
import { House, type Icon as IconType } from '@lucide/astro';

type MenuItem = { name: string; href: string; icon: typeof IconType; };
const menuItems: MenuItem[] = [{ name: 'Home', href: '/', icon: House }];
---

{menuItems.map((item) => (
  <a href={item.href}>
    <item.icon />
    <span>{item.name}</span>
  </a>
))}
```

## Custom / Lab Icons

```astro
---
import { Icon } from '@lucide/astro';
import { burger } from '@lucide/lab';
---

<Icon iconNode={burger} />
```

## Accessibility

```astro
---
import { Check } from '@lucide/astro';
---

<Check aria-label="Task completed" />
```
