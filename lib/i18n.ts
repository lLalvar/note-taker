import { useEffect, useState } from 'react'

import { i18n } from '@lingui/core'

import { type Locale, useLanguageStore } from '@/store/language-store'

import { messages as enMessages } from '../locales/en/messages'
import { messages as ruMessages } from '../locales/ru/messages'

const catalogs: Record<Locale, typeof enMessages | typeof ruMessages> = {
  en: enMessages,
  ru: ruMessages,
}

i18n.loadAndActivate({ locale: 'en', messages: catalogs.en })

export async function loadCatalog(locale: Locale) {
  try {
    const messages = catalogs[locale]
    if (!messages) {
      throw new Error(`No catalog found for locale: ${locale}`)
    }
    i18n.loadAndActivate({ locale, messages })
  } catch (error) {
    console.error(`Failed to load catalog for locale ${locale}:`, error)
    i18n.loadAndActivate({ locale: 'en', messages: catalogs.en })
  }
}

export function useI18n() {
  const { locale, initialize } = useLanguageStore()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let mounted = true

    initialize().then(() => {
      if (!mounted) return
      loadCatalog(locale).then(() => {
        if (mounted) {
          setIsReady(true)
        }
      })
    })

    return () => {
      mounted = false
    }
  }, [initialize, locale])

  useEffect(() => {
    if (isReady) {
      loadCatalog(locale)
    }
  }, [locale, isReady])

  return { locale, isReady }
}

export { i18n }
