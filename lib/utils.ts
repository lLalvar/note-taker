import { defineMessage } from '@lingui/core/macro'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { i18n } from './i18n'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type FormatDateOptions = {
  monthName?: boolean
  locale?: string
  dateOptions?: Intl.DateTimeFormatOptions
}

export const formatDate = (
  date: string | Date,
  options: FormatDateOptions = {}
) => {
  const { monthName = false, locale, dateOptions } = options

  const userLocale = locale || navigator.language || 'en-US'
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const formatOptions: Intl.DateTimeFormatOptions = dateOptions || {
    year: 'numeric',
    month: monthName ? 'short' : '2-digit',
    day: '2-digit',
  }

  return new Intl.DateTimeFormat(userLocale, formatOptions).format(dateObj)
}

export const formatTime = (date: string | Date) => {
  const userLocale = navigator.language || 'en-US'

  if (typeof date === 'string' && /^\d{1,2}:\d{2}(:\d{2})?$/.test(date)) {
    const today = new Date().toISOString().split('T')[0]
    const dateTime = new Date(`${today}T${date}`)

    return new Intl.DateTimeFormat(userLocale, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(dateTime)
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat(userLocale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(dateObj)
}

export const formatDateTime = (date: string | Date) => {
  const userLocale = navigator.language || 'en-US'
  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat(userLocale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  }).format(dateObj)
}

export function toHsla(hsl: string, alpha: number = 1): string {
  return hsl.replace(/hsl\(/, `hsla(`).replace(/\)$/, ` / ${alpha})`)
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error && error.name === 'EmailNotVerifiedError') {
    return error.message
  }

  let errorCode: string | undefined

  if (error && typeof error === 'object') {
    if ('code' in error) {
      errorCode = (error as any).code
    } else if (
      'message' in error &&
      typeof (error as any).message === 'string'
    ) {
      const match = (error as any).message.match(/\[(auth\/[\w-]+)\]/)
      if (match) {
        errorCode = match[1]
      }
    }
  }

  if (errorCode) {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return i18n._(
          defineMessage`This email is already registered. Please sign in instead or use a different email.`
        )
      case 'auth/invalid-email':
        return i18n._(
          defineMessage`The email address is invalid. Please check and try again.`
        )
      case 'auth/operation-not-allowed':
        return i18n._(
          defineMessage`Email/password accounts are not enabled. Please contact support.`
        )
      case 'auth/weak-password':
        return i18n._(
          defineMessage`The password is too weak. Please choose a stronger password.`
        )
      case 'auth/network-request-failed':
        return i18n._(
          defineMessage`Network error. Please check your connection and try again.`
        )
      case 'auth/too-many-requests':
        return i18n._(defineMessage`Too many attempts. Please try again later.`)
      case 'auth/user-disabled':
        return i18n._(
          defineMessage`This account has been disabled. Please contact support.`
        )
      case 'auth/user-not-found':
        return i18n._(
          defineMessage`No account found with this email. Please sign up first.`
        )
      case 'auth/wrong-password':
        return i18n._(defineMessage`Incorrect password. Please try again.`)
      case 'auth/invalid-credential':
        return i18n._(
          defineMessage`Invalid email or password. Please check your credentials.`
        )
      case 'auth/email-not-verified':
        return i18n._(
          defineMessage`Please verify your email address before signing in. Check your inbox for the verification email.`
        )
      case 'auth/expired-action-code':
        return i18n._(
          defineMessage`This reset link has expired. Please request a new one.`
        )
      case 'auth/invalid-action-code':
        return i18n._(
          defineMessage`This reset link is invalid. Please request a new one.`
        )
      case 'auth/invalid-verification-code':
        return i18n._(
          defineMessage`Invalid verification code. Please check and try again.`
        )
      case 'auth/code-expired':
        return i18n._(
          defineMessage`The verification code has expired. Please request a new one.`
        )
      case 'auth/quota-exceeded':
        return i18n._(defineMessage`Quota exceeded. Please try again later.`)
      case 'auth/missing-email':
        return i18n._(
          defineMessage`Email is required. Please check and try again.`
        )
      case 'auth/no-current-user':
        return i18n._(defineMessage`Session invalid. Please sign in again.`)
      default:
        return i18n._(defineMessage`Authentication failed. Please try again.`)
    }
  }

  return i18n._(defineMessage`An unexpected error occurred. Please try again.`)
}
