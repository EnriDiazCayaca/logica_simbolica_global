# lucide-angular

## Installation

```sh
npm install lucide-angular
```

## Setup

### Module-based

```ts
import { LucideAngularModule, File, House, Menu } from 'lucide-angular';

@NgModule({
  imports: [LucideAngularModule.pick({ File, House, Menu })]
})
export class AppModule {}
```

### Standalone Component

```ts
import { Component } from '@angular/core';
import { LucideAngularModule, FileIcon } from 'lucide-angular';

@Component({
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="FileIcon"></lucide-icon>`,
})
export class AppComponent {
  readonly FileIcon = FileIcon;
}
```

## Template Usage

```html
<!-- String-based (module approach) -->
<lucide-angular name="file" class="my-icon"></lucide-angular>
<lucide-icon name="house"></lucide-icon>
<i-lucide name="menu"></i-lucide>
<span-lucide name="user-check"></span-lucide>

<!-- Object-based (standalone approach) -->
<lucide-icon [img]="FileIcon"></lucide-icon>
```

## Props

| name                  | type      | default      |
| --------------------- | --------- | ------------ |
| `size`                | number    | 24           |
| `color`               | string    | currentColor |
| `strokeWidth`         | number    | 2            |
| `absoluteStrokeWidth` | boolean   | false        |

```html
<i-lucide name="house" [size]="48" color="red" [strokeWidth]="1"></i-lucide>
```

## Global Configuration

Inject `LucideIconConfig` in root component to set global defaults.

## Load All Icons (not recommended for production)

```ts
import { icons } from 'lucide-angular';
LucideAngularModule.pick(icons)
```

## Custom / Lab Icons

```ts
import { LucideAngularModule } from 'lucide-angular';
import { coconut } from '@lucide/lab';

@NgModule({
  imports: [LucideAngularModule.pick({ coconut })]
})
```
