# @lucide/svelte

> `@lucide/svelte` is for Svelte 5. For Svelte 4, use the `lucide-svelte` package.

## Installation

```sh
npm install @lucide/svelte
```

## Basic Usage

```svelte
<script>
  import { Camera } from '@lucide/svelte';
</script>

<Camera color="#ff3e98" />
```

For faster builds, import from the icons directory:

```svelte
<script>
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
</script>

<CircleAlert color="#ff3e98" />
```

## Props

| name                  | type      | default      |
| --------------------- | --------- | ------------ |
| `size`                | number    | 24           |
| `color`               | string    | currentColor |
| `strokeWidth`         | number    | 2            |
| `absoluteStrokeWidth` | boolean   | false        |

Also accepts all SVG presentation attributes as props.

## TypeScript — Typing Icon References

```svelte
<script lang="ts">
  import { Home, type Icon as IconType } from '@lucide/svelte';

  type MenuItem = {
    name: string;
    href: string;
    icon: typeof IconType;
  };
</script>
```

## Custom / Lab Icons

```svelte
<script>
  import { Icon } from '@lucide/svelte';
  import { pear } from '@lucide/lab';
</script>

<Icon iconNode={pear} />
```

## Accessibility

```svelte
<script>
  import { Check } from '@lucide/svelte';
</script>

<Check aria-label="Task completed" />
```
