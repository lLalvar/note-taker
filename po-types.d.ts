declare module '*.po' {
  import type { Messages } from '@lingui/core'
  export const messages: Messages
}

declare module '*.pot' {
  import type { Messages } from '@lingui/core'
  export const messages: Messages
}
