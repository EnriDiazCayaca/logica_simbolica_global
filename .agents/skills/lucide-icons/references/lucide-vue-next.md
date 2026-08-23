# lucide-vue-next

## Installation

```sh
npm install lucide-vue-next
```

## Basic Usage

```vue
<script setup>
import { Camera } from 'lucide-vue-next';
</script>

<template>
  <Camera color="red" :size="32" />
</template>
```

## Props

| name                  | type      | default      |
| --------------------- | --------- | ------------ |
| `size`                | number    | 24           |
| `color`               | string    | currentColor |
| `stroke-width`        | number    | 2            |
| `absoluteStrokeWidth` | boolean   | false        |
| `default-class`       | string    | lucide-icon  |

Also accepts all SVG presentation attributes as props.

## Dynamic Icon Component

```vue
<script setup>
import { computed } from 'vue';
import * as icons from 'lucide-vue-next';

const props = defineProps({ name: String });
const icon = computed(() => icons[props.name]);
</script>

<template>
  <component :is="icon" />
</template>
```

## Custom / Lab Icons

```vue
<script setup>
import { Icon } from 'lucide-vue-next';
import { baseball } from '@lucide/lab';
</script>

<template>
  <Icon :iconNode="baseball" />
</template>
```

## Accessibility

```vue
<template>
  <Camera aria-label="Take photo" />
</template>
```
