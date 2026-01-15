# Multi-Theme System Guide

This guide explains how the multi-theme system works and how to add new themes.

## Overview

The app supports multiple light and dark themes (e.g., `light-1`, `light-2`, `dark-1`, `dark-2`). Themes are defined in three places:

1. **`lib/theme.ts`** - Theme color definitions and background images (source of truth)
2. **`lib/theme-registry.ts`** - Theme metadata (name, description, icon, category)
3. **`global.css`** - CSS variables for NativeWind classes (defaults for light-1 and dark-1)

CSS variables are automatically synced when themes change via `lib/theme-css-sync.ts`.

## How It Works

### 1. Theme Storage

- Themes are stored in Zustand store (`store/theme-store.ts`)
- Theme ID format: `{category}-{number}` (e.g., `light-1`, `dark-2`)
- Categories: `light`, `dark` (currently implemented)

### 2. CSS Variable Sync

- `use-theme.ts` hook calls `updateThemeCSSVariables()` when theme changes
- CSS variables on `:root` are updated dynamically based on the selected theme
- The `dark` class is added/removed from `document.documentElement` based on theme category
- NativeWind classes like `bg-background` automatically use the active theme
- Only color-related variables are passed to NativeWind's `vars()` function (shadows, fonts, etc. are handled by CSS)

### 3. Programmatic Access

- Use `useTheme()` hook to get theme colors programmatically
- Returns: `colors`, `navTheme`, `isDark`, `themeMetadata`, `cssVariables`, `category`, `colorScheme`, `storedThemeId`, `theme`
- Use `getThemeBackgroundImage(themeId)` to get the background image for a theme

## Adding a New Theme

### Step 1: Add Theme Colors to `lib/theme.ts`

Each theme must include all color properties, fonts, shadows, radius, and typography settings:

```typescript
export const THEME = {
  // ... existing themes ...

  'light-2': {
    // Color properties
    background: 'hsl(220 20% 95%)',
    foreground: 'hsl(220 10% 20%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(220 10% 20%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(220 10% 20%)',
    primary: 'hsl(220 70% 50%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(220 30% 90%)',
    secondaryForeground: 'hsl(220 10% 30%)',
    muted: 'hsl(220 20% 92%)',
    mutedForeground: 'hsl(220 8% 45%)',
    accent: 'hsl(220 40% 88%)',
    accentForeground: 'hsl(220 10% 20%)',
    destructive: 'hsl(0 93% 82%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(220 30% 90%)',
    input: 'hsl(220 30% 90%)',
    ring: 'hsl(220 70% 50%)',
    chart1: 'hsl(220 70% 50%)',
    chart2: 'hsl(240 70% 50%)',
    chart3: 'hsl(260 70% 50%)',
    chart4: 'hsl(280 70% 50%)',
    chart5: 'hsl(300 70% 50%)',
    // Sidebar properties
    sidebar: 'hsl(220 30% 92%)',
    sidebarForeground: 'hsl(220 10% 20%)',
    sidebarPrimary: 'hsl(220 70% 50%)',
    sidebarPrimaryForeground: 'hsl(0 0% 100%)',
    sidebarAccent: 'hsl(220 40% 88%)',
    sidebarAccentForeground: 'hsl(220 10% 20%)',
    sidebarBorder: 'hsl(220 30% 90%)',
    sidebarRing: 'hsl(220 70% 50%)',
    // Font properties
    fontSans: 'Open Sans, sans-serif',
    fontSerif: 'Source Serif 4, serif',
    fontMono: 'IBM Plex Mono, monospace',
    // Radius
    radius: '0.525rem',
    // Shadow properties
    shadowX: '0px',
    shadowY: '8px',
    shadowBlur: '16px',
    shadowSpread: '-4px',
    shadowOpacity: '0.08',
    shadowColor: '#1a1a1a',
    shadow2xs: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.04)',
    shadowXs: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.04)',
    shadowSm:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 1px 2px -5px hsl(0 0% 10.1961% / 0.08)',
    shadow:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 1px 2px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowMd:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 2px 4px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowLg:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 4px 6px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowXl:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 8px 10px -5px hsl(0 0% 10.1961% / 0.08)',
    shadow2xl: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.20)',
    // Typography
    trackingNormal: '0em',
    spacing: '0.25rem',
  },
}
```

### Step 2: Add Background Image to `lib/theme.ts`

Add the theme's background image to `THEME_BACKGROUND_IMAGES`:

```typescript
const bgLight2 = require('@/assets/images/bg/bg-light-2.png')

export const THEME_BACKGROUND_IMAGES: Record<string, any> = {
  // ... existing themes ...
  'light-2': bgLight2,
}
```

### Step 3: Add Theme Metadata to `lib/theme-registry.ts`

```typescript
export const THEME_REGISTRY: ThemeMetadata[] = [
  // ... existing themes ...

  {
    id: 'light-2',
    name: 'Light 2',
    description: 'Second light theme',
    category: 'light',
    icon: Sun,
    isFree: true,
  },
]
```

### Step 4: CSS Variables Are Auto-Synced

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
import { ImageBackground, StyleSheet, Text, View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'
import { getThemeBackgroundImage } from '@/lib/theme'

export function MyComponent() {
  const { colors, theme } = useTheme()
  const backgroundImage = getThemeBackgroundImage(theme)

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.foreground }]}>Hello</Text>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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

```text
lib/
  ├── theme.ts              # Theme color definitions, background images, and helper functions
  ├── theme-registry.ts     # Theme metadata (name, icon, category) and registry functions
  ├── theme-css-sync.ts     # CSS variable sync utility
hooks/
  └── use-theme.ts          # Main theme hook (syncs CSS + returns colors, metadata, etc.)
store/
  └── theme-store.ts        # Zustand store for theme state (with MMKV persistence)
global.css                  # CSS variables (defaults for light-1/dark-1, auto-updated)
scripts/
  └── sync-theme-css.js     # Utility script to verify/generate CSS for themes
```

## Key Functions

### `updateThemeCSSVariables(themeId: string)`

Updates CSS variables on `document.documentElement` based on the selected theme. Only runs in web environments. Also adds/removes the `dark` class on the document element based on theme category.

### `getThemeColors(themeId: string)`

Returns theme color object from `THEME` object. Includes all properties: colors, fonts, shadows, radius, typography.

### `getNavTheme(themeId: string)`

Returns React Navigation theme object for the given theme ID. Automatically determines if it's a dark theme based on the theme ID prefix.

### `getThemeBackgroundImage(themeId: string)`

Returns the background image for a theme. Falls back to default light/dark images if theme-specific image not found.

### `isValidThemeId(themeId: string)`

Checks if a theme ID exists in the `THEME` object.

### `useTheme()`

Main hook that:

- Syncs CSS variables when theme changes
- Returns theme colors, metadata, navigation theme, CSS variables, category, and more
- Updates NativeWind color scheme
- Filters CSS variables to only pass color-related ones to NativeWind's `vars()` function

### Theme Registry Functions

- `getThemeMetadata(themeId: string)` - Get metadata for a specific theme
- `getThemesByCategory(category: ThemeCategory)` - Get all themes in a category
- `getLightThemes()` - Get all light themes
- `getDarkThemes()` - Get all dark themes
- `getNewThemes()` - Get all themes with new themes first, then defaults
- `getDefaultThemeId(category: ThemeCategory)` - Get default theme ID for a category
- `isValidThemeId(themeId: string)` - Check if theme ID exists in registry

## Notes

- CSS variables are updated dynamically, so you don't need to manually edit `global.css` for new themes
- The default values in `global.css` (`:root` and `.dark`) match `light-1` and `dark-1`
- All color values must follow the HSL format: `'hsl(hue saturation% lightness%)'`
- Theme IDs must match the pattern: `{category}-{number}` (e.g., `light-1`, `dark-2`)
- Theme categories are: `light`, `dark` (currently implemented)
- The theme store automatically migrates old theme IDs (`light`, `dark`, `system`) to the new format
- Background images are optional but recommended for visual consistency
- Shadow properties use CSS string format (e.g., `'0px 8px 16px -4px hsl(...)'`)
- Font properties use CSS font-family format (e.g., `'Open Sans, sans-serif'`)
- Only color-related CSS variables are passed to NativeWind's `vars()` function; other properties (shadows, fonts, etc.) are handled by CSS
