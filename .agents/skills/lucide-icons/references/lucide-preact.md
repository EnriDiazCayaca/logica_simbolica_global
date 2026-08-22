# lucide-preact

## Installation

```sh
npm install lucide-preact
```

## Basic Usage

```jsx
import { Camera } from 'lucide-preact';

const App = () => <Camera color="red" size={48} />;
```

## Props

| name                  | type      | default      |
| --------------------- | --------- | ------------ |
| `size`                | number    | 24           |
| `color`               | string    | currentColor |
| `strokeWidth`         | number    | 2            |
| `absoluteStrokeWidth` | boolean   | false        |

> **Note:** Preact doesn't transform SVG attributes, so use kebab-case for SVG props (e.g., `stroke-linejoin` not `strokeLinejoin`).

Also accepts all SVG presentation attributes as props.

## Dynamic Icon Component

```jsx
import { icons } from 'lucide-preact';

const Icon = ({ name, color, size }) => {
  const LucideIcon = icons[name];
  return <LucideIcon color={color} size={size} />;
};

// Usage: <Icon name="house" />
```

## Custom / Lab Icons

```jsx
import { Icon } from 'lucide-preact';
import { coconut } from '@lucide/lab';

const App = () => <Icon iconNode={coconut} />;
```
