# lucide-react

## Installation

```sh
npm install lucide-react
```

## Basic Usage

```jsx
import { Camera, Home, Settings } from 'lucide-react';

const App = () => (
  <Camera color="red" size={48} />
);
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

For CMS-driven or dynamic icon names:

```jsx
import { DynamicIcon } from 'lucide-react/dynamic';

<DynamicIcon name="camera" color="red" size={48} />
```

## Custom / Lab Icons

```jsx
import { Icon } from 'lucide-react';
import { coconut } from '@lucide/lab';

<Icon iconNode={coconut} />
```

## Accessibility

Icons are hidden from screen readers by default (`aria-hidden="true"`).

```jsx
<Camera aria-label="Take photo" />
```
