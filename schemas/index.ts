import { msg } from '@lingui/core/macro'
import { z } from 'zod'

import { MAX_FILE_SIZE } from '@/constants'
import { i18n } from '@/lib/i18n'

const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / 1024 / 1024

export const imageSchema = ({ required }: { required: boolean }) =>
  z
    .any()
    .refine((file) => (required ? !!file : true), {
      message: i18n._(msg`Image is required`),
    })
    .refine(
      (file) =>
        !file ||
        (file instanceof File
          ? file.size <= MAX_FILE_SIZE
          : typeof file === 'string'),
      {
        message: i18n._(msg`Image must be under ${MAX_FILE_SIZE_MB}MB`),
      }
    )

export const emailSchema = z
  .string()
  .min(1, { message: i18n._(msg`Email is required`) })
  .email({ message: i18n._(msg`Please enter a valid email address`) })

export const passwordSchema = z
  .string()
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: i18n._(
      msg`Password must be at least 8 characters and include uppercase, lowercase, number, and special character`
    ),
  })
