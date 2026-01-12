---
description: Styling guidelines for spacing, Tailwind usage, and icon patterns
alwaysApply: true
---

# Styling Guidelines

## Spacing

**Always use `gap` instead of `margin` for spacing between elements when possible.**

- Use `gap` with flex containers (`flex-row`, `flex-col`) to space child elements
- Prefer `gap-*` Tailwind classes over individual `margin` utilities
- Only use `margin` when `gap` is not applicable (e.g., spacing from parent container edges)

### Examples

```tsx
<View className='flex-row gap-4 items-center'>
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</View>

<View className='flex-col gap-2'>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>
```

## Tailwind Styles

**Always use Tailwind CSS classes (via NativeWind) when possible.**

- Prefer `className` prop with Tailwind utility classes over inline `style` prop
- Use Tailwind's design tokens and spacing scale
- Only use inline styles for dynamic values that can't be expressed in Tailwind

### Examples

```tsx
<View className='flex-1 rounded-lg bg-background px-4 py-2'>
  <Text className='text-lg font-semibold text-foreground'>Title</Text>
</View>
```

## Icons

**Always use the Icon component pattern for rendering icons.**

### Pattern

1. Import `Icon` from `@/components/ui/icon`
2. Import the icon component from `lucide-react-native`
3. Use the `as` prop to pass the icon component
4. Apply Tailwind classes via `className` prop

### Example

```tsx
import { Icon } from '@/components/ui/icon'
import { Menu, Search, ArrowRight } from 'lucide-react-native'

// Usage
<Icon as={Menu} />
<Icon as={Search} size={24} className='text-primary' />
<Icon as={ArrowRight} size={24} className='text-muted-foreground' />
```

### Guidelines

- Always use the `Icon` wrapper component, never render Lucide icons directly
- Use `className` for styling (size, color, etc.) instead of the `size` prop when possible
- Use semantic color classes: `text-primary`, `text-muted-foreground`, `text-foreground`

### Examples

```tsx
import { Menu } from 'lucide-react-native'

import { Icon } from '@/components/ui/icon'

;<Button>
  <Icon as={Menu} />
</Button>
```
