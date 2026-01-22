// Validation schemas have been moved to their respective page files:
// - signInSchema -> app/(auth)/sign-in.tsx
// - signUpSchema -> app/(auth)/sign-up.tsx
// - forgotPasswordSchema -> app/(auth)/forgot-password.tsx
// - resetPasswordSchema -> app/(auth)/reset-password.tsx
import { z } from 'zod'

// Diary Lock Validation Schemas

export const getPasswordLockSchema = (
  t: (template: TemplateStringsArray, ...args: any[]) => string
) =>
  z
    .object({
      password: z
        .string()
        .min(1, t`Password is required`)
        .min(6, t`Password must be at least 6 characters`)
        .max(50, t`Password must be less than 50 characters`),
      confirmPassword: z.string().min(1, t`Please confirm your password`),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t`Passwords do not match`,
      path: ['confirmPassword'],
    })

export const getPinLockSchema = (
  t: (template: TemplateStringsArray, ...args: any[]) => string
) =>
  z
    .object({
      pin: z
        .string()
        .min(1, t`PIN is required`)
        .length(4, t`PIN must be exactly 4 digits`)
        .regex(/^\d+$/, t`PIN must contain only numbers`),
      confirmPin: z.string().min(1, t`Please confirm your PIN`),
    })
    .refine((data) => data.pin === data.confirmPin, {
      message: t`PINs do not match`,
      path: ['confirmPin'],
    })

export const getUnlockPasswordSchema = (
  t: (template: TemplateStringsArray, ...args: any[]) => string
) =>
  z.object({
    password: z.string().min(1, t`Password is required`),
  })

export const getUnlockPinSchema = (
  t: (template: TemplateStringsArray, ...args: any[]) => string
) =>
  z.object({
    pin: z
      .string()
      .min(1, t`PIN is required`)
      .length(4, t`PIN must be exactly 4 digits`)
      .regex(/^\d+$/, t`PIN must contain only numbers`),
  })

export const getSecurityQuestionSchema = (
  t: (template: TemplateStringsArray, ...args: any[]) => string
) =>
  z.object({
    question: z
      .string()
      .min(1, t`Security question is required`)
      .min(10, t`Security question must be at least 10 characters`)
      .max(200, t`Security question must be less than 200 characters`),
    answer: z
      .string()
      .min(1, t`Security answer is required`)
      .min(3, t`Security answer must be at least 3 characters`)
      .max(100, t`Security answer must be less than 100 characters`),
  })

export const getSecurityAnswerSchema = (
  t: (template: TemplateStringsArray, ...args: any[]) => string
) =>
  z.object({
    answer: z.string().min(1, t`Security answer is required`),
  })

export const getRecoveryEmailSchema = (
  t: (template: TemplateStringsArray, ...args: any[]) => string
) =>
  z.object({
    email: z
      .string()
      .min(1, t`Email is required`)
      .email(t`Invalid email address`),
  })

export const getLockSetupSchema = (
  t: (template: TemplateStringsArray, ...args: any[]) => string
) =>
  z
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
        .email(t`Invalid email address`)
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
        message: t`Password or PIN validation failed`,
        path: ['lockType'],
      }
    )

export type PasswordLockFormData = z.infer<
  ReturnType<typeof getPasswordLockSchema>
>
export type PinLockFormData = z.infer<ReturnType<typeof getPinLockSchema>>
export type UnlockPasswordFormData = z.infer<
  ReturnType<typeof getUnlockPasswordSchema>
>
export type UnlockPinFormData = z.infer<ReturnType<typeof getUnlockPinSchema>>
export type SecurityQuestionFormData = z.infer<
  ReturnType<typeof getSecurityQuestionSchema>
>
export type SecurityAnswerFormData = z.infer<
  ReturnType<typeof getSecurityAnswerSchema>
>
export type RecoveryEmailFormData = z.infer<
  ReturnType<typeof getRecoveryEmailSchema>
>
export type LockSetupFormData = z.infer<ReturnType<typeof getLockSetupSchema>>
