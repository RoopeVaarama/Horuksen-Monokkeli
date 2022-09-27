import { useState, createContext } from 'react'
import { IntlProvider } from 'react-intl'
import * as locale_en from '../../translation/en.json'

export interface Locales {
  [key: string]: string
}

export interface IntlCtx {
  locale: string
  locales: Locales
  changeLanguage: (newLocale: string) => void
}

const DEFAULT_LOCALE = 'fi'
const LOCALES: Locales = {
  en: 'English',
  fi: 'Suomi'
}

export const IntlContext = createContext<IntlCtx | undefined>(undefined)

const LanguageContainer = ({ children }: { children: JSX.Element }) => {
  const [locale, setLocale] = useState(DEFAULT_LOCALE)

  const changeLanguage = (newLocale: string) => {
    setLocale(newLocale)
  }

  const changeMessages = (lang: string) => {
    switch (lang) {
      case 'en':
        return locale_en
      default:
        // Finnish (fi) is the default language so the messages are defined in the components
        // themselves as "defaultMessage" instead of using an external locale file
        return undefined
    }
  }

  return (
    <IntlContext.Provider value={{ locale, locales: LOCALES, changeLanguage }}>
      <IntlProvider
        key={locale}
        defaultLocale={DEFAULT_LOCALE}
        locale={locale}
        messages={changeMessages(locale)}
      >
        {children}
      </IntlProvider>
    </IntlContext.Provider>
  )
}

export default LanguageContainer
