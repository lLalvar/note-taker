# Theme System Guide

This guide explains how to add new themes to the app. The theme system supports multiple light and dark themes, making it easy to expand your theme collection.

## Architecture Overview

The theme system consists of three main parts:

1. **Theme Registry** (`lib/theme-registry.ts`) - Metadata about themes (name, description, icon, category)
2. **Theme Colors** (`lib/theme.ts`) - Actual color definitions for each theme
3. **Theme Store** (`store/theme-store.ts`) - State management and persistence

## Adding a New Theme

To add a new theme, follow these steps:

### Step 1: Add Theme Colors

Open `lib/theme.ts` and add your theme colors to the `THEME` object:

```typescript
export const THEME: Record<string, ThemeColors> = {
  // ... existing themes ...

  // Light Theme 2 (example)
  'light-2': {
    background: 'hsl(220 14.3% 95.9%)',
    foreground: 'hsl(220.9 39.3% 11%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(220.9 39.3% 11%)',
    // ... all other color properties
  },

  // Dark Theme 2 (example)
  'dark-2': {
    background: 'hsl(222.2 84% 4.9%)',
    foreground: 'hsl(210 40% 98%)',
    card: 'hsl(222.2 84% 4.9%)',
    cardForeground: 'hsl(210 40% 98%)',
    // ... all other color properties
  },
}
```

**Important:**

- Theme IDs must follow the pattern: `{category}-{number}` (e.g., `light-1`, `light-2`, `dark-1`, `dark-2`)
- All color properties are required
- Use HSL color format for consistency

### Step 2: Add Theme Metadata

Open `lib/theme-registry.ts` and add your theme to the `THEME_REGISTRY` array:

```typescript
export const THEME_REGISTRY: ThemeMetadata[] = [
  // ... existing themes ...

  {
    id: 'light-2',
    name: 'Light 2',
    description: 'Second light theme variant',
    category: 'light',
    icon: Sun,
    previewColor: 'hsl(220 14.3% 95.9%)', // Optional: primary color for preview
  },

  {
    id: 'dark-2',
    name: 'Dark 2',
    description: 'Second dark theme variant',
    category: 'dark',
    icon: MoonStar,
    previewColor: 'hsl(222.2 84% 4.9%)', // Optional: primary color for preview
  },
]
```

**Properties:**

- `id`: Must match the theme ID in `THEME` object
- `name`: Display name shown in the theme selector
- `description`: Short description of the theme
- `category`: `'light'`, `'dark'`, or `'system'`
- `icon`: Lucide icon component (usually `Sun` for light, `MoonStar` for dark)
- `previewColor`: Optional primary color used for theme preview swatch

### Step 3: Verify

1. The theme will automatically appear in the theme selection page
2. Themes are grouped by category (Light Themes, Dark Themes, System)
3. Users can select and persist their theme preference

## Theme Structure

Each theme must include all these color properties:

```typescript
{
  background: string // Main background color
  foreground: string // Main text color
  card: string // Card background
  cardForeground: string // Card text
  popover: string // Popover background
  popoverForeground: string // Popover text
  primary: string // Primary accent color
  primaryForeground: string // Text on primary
  secondary: string // Secondary accent
  secondaryForeground: string // Text on secondary
  muted: string // Muted background
  mutedForeground: string // Muted text
  accent: string // Accent color
  accentForeground: string // Text on accent
  destructive: string // Error/destructive color
  destructiveForeground: string // Text on destructive
  border: string // Border color
  input: string // Input border
  ring: string // Focus ring color
  radius: string // Border radius (e.g., '1.5rem')
  chart1: string // Chart color 1
  chart2: string // Chart color 2
  chart3: string // Chart color 3
  chart4: string // Chart color 4
  chart5: string // Chart color 5
}
```

## Example: Adding 5 Light Themes and 6 Dark Themes

### Light Themes

Add to `lib/theme.ts`:

```typescript
'light-1': { /* existing */ },
'light-2': { /* your colors */ },
'light-3': { /* your colors */ },
'light-4': { /* your colors */ },
'light-5': { /* your colors */ },
```

Add to `lib/theme-registry.ts`:

```typescript
{
  id: 'light-1',
  name: 'Light',
  description: 'Default light theme',
  category: 'light',
  icon: Sun,
  previewColor: 'hsl(...)',
},
{
  id: 'light-2',
  name: 'Light 2',
  description: 'Second light theme',
  category: 'light',
  icon: Sun,
  previewColor: 'hsl(...)',
},
// ... repeat for light-3, light-4, light-5
```

### Dark Themes

Add to `lib/theme.ts`:

```typescript
'dark-1': { /* existing */ },
'dark-2': { /* your colors */ },
'dark-3': { /* your colors */ },
'dark-4': { /* your colors */ },
'dark-5': { /* your colors */ },
'dark-6': { /* your colors */ },
```

Add to `lib/theme-registry.ts`:

```typescript
{
  id: 'dark-1',
  name: 'Dark',
  description: 'Default dark theme',
  category: 'dark',
  icon: MoonStar,
  previewColor: 'hsl(...)',
},
{
  id: 'dark-2',
  name: 'Dark 2',
  description: 'Second dark theme',
  category: 'dark',
  icon: MoonStar,
  previewColor: 'hsl(...)',
},
// ... repeat for dark-3 through dark-6
```

## Best Practices

1. **Consistent Naming**: Use descriptive names that help users understand the theme
2. **Preview Colors**: Always include `previewColor` for better visual selection
3. **Color Contrast**: Ensure sufficient contrast between foreground and background colors
4. **Accessibility**: Test themes for accessibility compliance (WCAG AA minimum)
5. **Testing**: Test each theme across different screens and components

## Theme Selection UI

Themes are automatically displayed in the theme selection page (`app/(app)/theme.tsx`) grouped by category:

- **System**: System preference theme
- **Light Themes**: All light themes
- **Dark Themes**: All dark themes

Each theme shows:

- Preview color swatch (if `previewColor` is provided)
- Theme name
- Theme description
- Selection indicator

## Migration

The theme system automatically migrates old theme preferences:

- `'light'` → `'light-1'` (first light theme)
- `'dark'` → `'dark-1'` (first dark theme)
- `'system'` → `'system'` (unchanged)

This ensures backward compatibility with existing user preferences.
