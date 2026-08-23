# lucide-react-native

## Installation

Requires `react-native-svg` (version 12–15):

```sh
npm install react-native-svg
npm install lucide-react-native
```

## Basic Usage

```jsx
import { Camera } from 'lucide-react-native';

const App = () => <Camera color="red" size={48} />;
```

## Props

| name                  | type      | default      |
| --------------------- | --------- | ------------ |
| `size`                | number    | 24           |
| `color`               | string    | currentColor |
| `strokeWidth`         | number    | 2            |
| `absoluteStrokeWidth` | boolean   | false        |

Also accepts all SVG attributes as props.

## Dynamic Icon Component

```tsx
import * as icons from 'lucide-react-native/icons';

interface IconProps { name: keyof typeof icons; color?: string; size?: number; }

const Icon = ({ name, color, size }: IconProps) => {
  const LucideIcon = icons[name];
  return <LucideIcon color={color} size={size} />;
};

// Usage: <Icon name="House" />
```

> Note: Icon names in `lucide-react-native/icons` are PascalCase.

## Custom / Lab Icons

```jsx
import { Icon } from 'lucide-react-native';
import { coconut } from '@lucide/lab';

const App = () => <Icon iconNode={coconut} />;
```
