// Validation schemas have been moved to their respective page files:
// - signInSchema -> app/(auth)/sign-in.tsx
// - signUpSchema -> app/(auth)/sign-up.tsx
// - forgotPasswordSchema -> app/(auth)/forgot-password.tsx
// - resetPasswordSchema -> app/(auth)/reset-password.tsx
import { z } from 'zod'

// Diary Lock Validation Schemas

export const passwordLockSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must be less than 50 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const pinLockSchema = z
  .object({
    pin: z
      .string()
      .min(1, 'PIN is required')
      .length(4, 'PIN must be exactly 4 digits')
      .regex(/^\d+$/, 'PIN must contain only numbers'),
    confirmPin: z.string().min(1, 'Please confirm your PIN'),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: 'PINs do not match',
    path: ['confirmPin'],
  })

export const unlockPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export const unlockPinSchema = z.object({
  pin: z
    .string()
    .min(1, 'PIN is required')
    .length(4, 'PIN must be exactly 4 digits')
    .regex(/^\d+$/, 'PIN must contain only numbers'),
})

export const securityQuestionSchema = z.object({
  question: z
    .string()
    .min(1, 'Security question is required')
    .min(10, 'Security question must be at least 10 characters')
    .max(200, 'Security question must be less than 200 characters'),
  answer: z
    .string()
    .min(1, 'Security answer is required')
    .min(3, 'Security answer must be at least 3 characters')
    .max(100, 'Security answer must be less than 100 characters'),
})

export const securityAnswerSchema = z.object({
  answer: z.string().min(1, 'Security answer is required'),
})

export const recoveryEmailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

export const lockSetupSchema = z
  .object({
    lockType: z.enum(['password', 'pin']),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    pin: z.string().optional(),
    confirmPin: z.string().optional(),
    securityQuestion: z.string().optional(),
    securityAnswer: z.string().optional(),
    recoveryEmail: z
      .string()
      .email('Invalid email address')
      .optional()
      .or(z.literal('')),
    enableBiometric: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.lockType === 'password') {
        return (
          data.password &&
          data.password.length >= 6 &&
          data.password === data.confirmPassword
        )
      }
      if (data.lockType === 'pin') {
        return (
          data.pin &&
          data.pin.length === 4 &&
          /^\d+$/.test(data.pin) &&
          data.pin === data.confirmPin
        )
      }
      return false
    },
    {
      message: 'Password or PIN validation failed',
      path: ['lockType'],
    }
  )

export type PasswordLockFormData = z.infer<typeof passwordLockSchema>
export type PinLockFormData = z.infer<typeof pinLockSchema>
export type UnlockPasswordFormData = z.infer<typeof unlockPasswordSchema>
export type UnlockPinFormData = z.infer<typeof unlockPinSchema>
export type SecurityQuestionFormData = z.infer<typeof securityQuestionSchema>
export type SecurityAnswerFormData = z.infer<typeof securityAnswerSchema>
export type RecoveryEmailFormData = z.infer<typeof recoveryEmailSchema>
export type LockSetupFormData = z.infer<typeof lockSetupSchema>
