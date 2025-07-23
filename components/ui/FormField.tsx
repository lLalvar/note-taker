import { cn } from '@/lib/utils'
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native'

interface FormFieldProps extends TextInputProps {
  label: string
  error?: string
  rightIcon?: React.ReactNode
  onRightIconPress?: () => void
}

export function FormField({
  label,
  error,
  rightIcon,
  onRightIconPress,
  className,
  ...props
}: FormFieldProps) {
  return (
    <View className='space-y-2'>
      <Text className='text-sm font-medium text-gray-900 dark:text-gray-100'>
        {label}
      </Text>
      <View className='relative'>
        <TextInput
          className={cn(
            'h-12 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100',
            error && 'border-red-500',
            rightIcon && 'pr-12',
            className
          )}
          placeholderTextColor='#9CA3AF'
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            className='absolute right-3 top-1/2 -translate-y-1/2'
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className='text-sm text-red-500'>{error}</Text>}
    </View>
  )
}
