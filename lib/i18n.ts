import { useEffect, useState } from 'react'

import { i18n } from '@lingui/core'

import { useLanguageStore } from '@/store/languageStore'

import { messages as enMessages } from '../locales/en/messages'
import { messages as ruMessages } from '../locales/ru/messages'

const catalogs = {
  en: enMessages,
  ru: ruMessages,
} as const

export async function loadCatalog(locale: string) {
  try {
    const messages = catalogs[locale as keyof typeof catalogs]
    if (!messages) {
      throw new Error(`No catalog found for locale: ${locale}`)
    }
    i18n.load(locale, messages)
    i18n.activate(locale)
  } catch (error) {
    console.error(`Failed to load catalog for locale ${locale}:`, error)
    if (locale !== 'en') {
      i18n.load('en', catalogs.en)
      i18n.activate('en')
    }
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
