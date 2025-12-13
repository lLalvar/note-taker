# Multi-Theme System Guide

This guide explains how the multi-theme system works and how to add new themes.

## Overview

The app supports multiple light and dark themes (e.g., `light-1`, `light-2`, `dark-1`, `dark-2`). Themes are defined in two places:

1. **`lib/theme.ts`** - Theme color definitions (source of truth)
2. **`global.css`** - CSS variables for NativeWind classes

CSS variables are automatically synced when themes change via `lib/theme-css-sync.ts`.

## How It Works

### 1. Theme Storage

- Themes are stored in Zustand store (`store/theme-store.ts`)
- Theme ID format: `{category}-{number}` (e.g., `light-1`, `dark-2`)
- Categories: `light`, `dark`, `hot`

### 2. CSS Variable Sync

- `use-theme.ts` hook calls `updateThemeCSSVariables()` when theme changes
- CSS variables on `:root` (light) and `.dark:root` (dark) are updated dynamically
- NativeWind classes like `bg-background` automatically use the active theme

### 3. Programmatic Access

- Use `useTheme()` hook to get theme colors programmatically
- Returns: `colors`, `navTheme`, `isDark`, `themeMetadata`, etc.

## Adding a New Theme

### Step 1: Add Theme Colors to `lib/theme.ts`

```typescript
export const THEME = {
  // ... existing themes ...

  'light-2': {
    background: 'hsl(220 20% 95%)',
    foreground: 'hsl(220 10% 20%)',
    card: 'hsl(0 0% 100%)',
    // ... all other color properties
  },
}
```

### Step 2: Add Theme Metadata to `lib/theme-registry.ts`

```typescript
export const THEME_REGISTRY: ThemeMetadata[] = [
  // ... existing themes ...

  {
    id: 'light-2',
    name: 'Light 2',
    description: 'Second light theme',
    category: 'light',
    icon: Sun,
    previewColor: 'hsl(220 70% 50%)',
    isFree: true,
  },
]
```

### Step 3: CSS Variables Are Auto-Synced

CSS variables in `global.css` are automatically updated when the theme is selected. The default values in `global.css` match `light-1` and `dark-1`, but they update dynamically via JavaScript.

**Optional**: To verify CSS output, run:

```bash
node scripts/sync-theme-css.js light-2
```

## Usage Examples

### Using NativeWind Classes (Recommended)

```tsx
import { Text, View } from 'react-native'

export function MyComponent() {
  return (
    <View className='bg-background p-4'>
      <Text className='text-foreground'>Hello</Text>
      <View className='rounded-lg border border-border bg-card'>
        <Text className='text-card-foreground'>Card content</Text>
      </View>
    </View>
  )
}
```

### Using Theme Colors Programmatically

```tsx
import { StyleSheet, Text, View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

export function MyComponent() {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.foreground }]}>Hello</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    fontSize: 16,
  },
})
```

### Switching Themes

```tsx
import { useThemeStore } from '@/store/theme-store'

export function ThemeSelector() {
  const { setTheme } = useThemeStore()

  return <Button onPress={() => setTheme('light-2')}>Switch to Light 2</Button>
}
```

## File Structure

```
lib/
  ├── theme.ts              # Theme color definitions (source of truth)
  ├── theme-registry.ts     # Theme metadata (name, icon, etc.)
  ├── theme-css-sync.ts     # CSS variable sync utility
hooks/
  └── use-theme.ts          # Main theme hook (syncs CSS + returns colors)
store/
  └── theme-store.ts        # Zustand store for theme state
global.css                  # CSS variables (auto-updated)
```

## Key Functions

### `updateThemeCSSVariables(themeId: string)`

Updates CSS variables on `document.documentElement` based on the selected theme. Only runs in web environments.

### `getThemeColors(themeId: string)`

Returns theme color object from `THEME` object.

### `getNavTheme(themeId: string)`

Returns React Navigation theme object for the given theme ID.

### `useTheme()`

Main hook that:

- Syncs CSS variables when theme changes
- Returns theme colors, metadata, and navigation theme
- Updates NativeWind color scheme

## Notes

- CSS variables are updated dynamically, so you don't need to manually edit `global.css` for new themes
- The default values in `global.css` (`:root` and `.dark:root`) match `light-1` and `dark-1`
- All themes must follow the HSL format: `'hsl(hue saturation% lightness%)'`
- Theme IDs must match the pattern: `{category}-{number}`
