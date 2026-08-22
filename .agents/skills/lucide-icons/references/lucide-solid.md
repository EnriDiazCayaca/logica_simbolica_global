# lucide-solid

## Installation

```sh
npm install lucide-solid
```

## Basic Usage

```jsx
import { Camera } from 'lucide-solid';

const App = () => <Camera color="red" size={48} />;
```

For faster builds (avoids Vite dev server issues), import from icons directory:

```jsx
import Camera from 'lucide-solid/icons/camera';

const App = () => <Camera color="red" size={48} />;
```

## Props

| name                  | type      | default      |
| --------------------- | --------- | ------------ |
| `size`                | number    | 24           |
| `color`               | string    | currentColor |
| `strokeWidth`         | number    | 2            |
| `absoluteStrokeWidth` | boolean   | false        |

Also accepts all SVG presentation attributes as props.

## Dynamic Icon Component

```tsx
import { icons, type LucideProps } from 'lucide-solid';
import { splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

interface IconProps extends LucideProps { name: keyof typeof icons; }

const Icon = (props: IconProps) => {
  const [local, others] = splitProps(props, ['name']);
  return <Dynamic component={icons[local.name]} {...others} />;
};

// Usage: <Icon name="home" />
```

## Custom / Lab Icons

```jsx
import { Icon } from 'lucide-solid';
import { sausage } from '@lucide/lab';

const App = () => <Icon iconNode={sausage} color="red" />;
```
