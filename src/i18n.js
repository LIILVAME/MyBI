import { createI18n } from 'vue-i18n'
import fr from './locales/i18n/fr.json'
import en from './locales/i18n/en.json'

/**
 * Configuration i18n pour l'application Doogoo
 * Supporte FR et EN
 */
const i18n = createI18n({
  legacy: false, // Utilise l'API Composition (Vue 3)
  locale: 'fr', // Langue par défaut
  fallbackLocale: 'en', // Langue de secours
  messages: {
    fr,
    en
  },
  // Mode global pour permettre l'utilisation dans les templates et composants
  globalInjection: true,
  // Désactive l'échappement HTML par défaut pour éviter les problèmes de parsing
  escapeParameter: false,
  // Mode silencieux pour les clés manquantes (évite les erreurs de console)
  missingWarn: false,
  fallbackWarn: false,
  // Désactive les warnings de traduction silencieux (production)
  silentTranslationWarn: true,
  silentFallbackWarn: true
})

export default i18n

