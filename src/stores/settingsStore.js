import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

/**
 * Store Pinia pour gérer les paramètres utilisateur
 * Gère la langue (FR/EN) et la devise (EUR/USD/GBP/XOF)
 * Persiste les préférences dans localStorage
 */
export const useSettingsStore = defineStore('settings', () => {
  // State
  const language = ref('fr')
  const currency = ref('EUR')
  const theme = ref('light')
  const alertThreshold = ref(5)
  const notifications = ref({
    email: true,
    payments: true,
    reminders: false,
    maintenance: false
  })

  // Clés localStorage
  const STORAGE_KEY = 'mybi-settings'

  /**
   * Charge les paramètres depuis localStorage
   */
  const loadSettings = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.language) language.value = parsed.language
        if (parsed.currency) currency.value = parsed.currency
        if (parsed.theme) theme.value = parsed.theme
        if (parsed.alertThreshold !== undefined) alertThreshold.value = parsed.alertThreshold
        if (parsed.notifications) notifications.value = { ...notifications.value, ...parsed.notifications }
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des paramètres depuis localStorage:', error)
    }
  }

  /**
   * Sauvegarde les paramètres dans localStorage
   */
  const saveSettings = () => {
    try {
      const settings = {
        language: language.value,
        currency: currency.value,
        theme: theme.value,
        alertThreshold: alertThreshold.value,
        notifications: notifications.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des paramètres dans localStorage:', error)
    }
  }

  /**
   * Change la langue
   * @param {string} lang - Code langue ('fr' ou 'en')
   */
  const setLanguage = (lang) => {
    if (['fr', 'en'].includes(lang) && lang !== language.value) {
      language.value = lang
      saveSettings()
      
      // Met à jour i18n immédiatement
      try {
        const i18n = require('@/i18n').default
        if (i18n && i18n.global) {
          i18n.global.locale.value = lang
        }
      } catch (error) {
        console.warn('Impossible de mettre à jour i18n:', error)
      }
      
      // Recharger la page pour appliquer la nouvelle langue partout
      // (nécessaire car certains composants sont déjà rendus)
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    }
  }

  /**
   * Change la devise
   * @param {string} curr - Code devise ('EUR', 'USD', 'GBP', 'XOF')
   */
  const setCurrency = (curr) => {
    if (['EUR', 'USD', 'GBP', 'XOF'].includes(curr)) {
      currency.value = curr
      saveSettings()
    }
  }

  /**
   * Change le thème
   * @param {string} newTheme - Thème ('light', 'dark', 'auto')
   */
  const setTheme = (newTheme) => {
    if (['light', 'dark', 'auto'].includes(newTheme)) {
      theme.value = newTheme
      saveSettings()
      // TODO: Appliquer le thème (à implémenter si nécessaire)
    }
  }

  /**
   * Met à jour les notifications
   * @param {Object} newNotifications - Objet de notifications
   */
  const setNotifications = (newNotifications) => {
    notifications.value = { ...notifications.value, ...newNotifications }
    saveSettings()
  }

  /**
   * Met à jour le seuil d'alerte
   * @param {number} threshold - Nombre de jours
   */
  const setAlertThreshold = (threshold) => {
    if (typeof threshold === 'number' && threshold >= 0) {
      alertThreshold.value = threshold
      saveSettings()
    }
  }

  // Charge les paramètres au démarrage
  if (typeof window !== 'undefined') {
    loadSettings()
  }

  // Sauvegarde automatique quand les valeurs changent
  watch([language, currency, theme, alertThreshold, notifications], () => {
    saveSettings()
  }, { deep: true })

  return {
    // State
    language,
    currency,
    theme,
    alertThreshold,
    notifications,
    // Actions
    setLanguage,
    setCurrency,
    setTheme,
    setNotifications,
    setAlertThreshold,
    loadSettings,
    saveSettings
  }
})

