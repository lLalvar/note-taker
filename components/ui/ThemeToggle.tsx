import { MoonStar, Sun } from 'lucide-react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { getDefaultThemeId } from '@/lib/theme-registry'
import { useThemeStore } from '@/store/theme-store'

export function ThemeToggle() {
  const { setTheme, getCategory } = useThemeStore()

  const handleToggle = () => {
    // Get current category
    const currentCategory = getCategory()

    // Toggle between light and dark categories
    if (currentCategory === 'light') {
      setTheme(getDefaultThemeId('dark'))
    } else if (currentCategory === 'dark') {
      setTheme(getDefaultThemeId('light'))
    }
  }

  // Determine icon based on effective theme category
  const effectiveCategory = getCategory()
  const isDark = effectiveCategory === 'dark'

  return (
    <Button
      onPressIn={handleToggle}
      size='icon'
      variant='ghost'
      className='ios:size-9 rounded-full web:mx-4'
    >
      <Icon as={isDark ? MoonStar : Sun} />
    </Button>
  )
}
