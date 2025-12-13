import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import dayjs, { getUserLocale } from './dayjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDateTime = (date: string | Date): string => {
  const dateObj = dayjs(date)
  return dateObj.locale(getUserLocale()).format('L LT')
}

export const formatDate = (date: string | Date): string => {
  const dateObj = dayjs(date)
  return dateObj.locale(getUserLocale()).format('L')
}

export const formatTime = (date: string | Date): string => {
  const dateObj = dayjs(date)
  return dateObj.locale(getUserLocale()).format('LT')
}

export function toHsla(hsl: string, alpha: number = 1): string {
  return hsl.replace(/hsl\(/, `hsla(`).replace(/\)$/, ` / ${alpha})`)
}
