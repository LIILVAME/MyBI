/**
 * Utilitaire pour le tracking analytics
 * Supporte Google Analytics 4 et Plausible Analytics
 */

// Configuration - À définir dans les variables d'environnement
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN
const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'

/**
 * Initialise Google Analytics 4
 */
export function initGoogleAnalytics() {
  if (!GA4_MEASUREMENT_ID || !ENABLE_ANALYTICS) {
    console.log('📊 Google Analytics désactivé (pas de MEASUREMENT_ID ou ENABLE_ANALYTICS=false)')
    return
  }

  // Injecte le script Google Analytics
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`
  document.head.appendChild(script1)

  // Configure gtag
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', GA4_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  })

  window.gtag = gtag
  console.log('✅ Google Analytics 4 initialisé')
}

/**
 * Initialise Plausible Analytics
 */
export function initPlausible() {
  if (!PLAUSIBLE_DOMAIN || !ENABLE_ANALYTICS) {
    console.log('📊 Plausible Analytics désactivé (pas de DOMAIN ou ENABLE_ANALYTICS=false)')
    return
  }

  const script = document.createElement('script')
  script.defer = true
  script.setAttribute('data-domain', PLAUSIBLE_DOMAIN)
  script.src = 'https://plausible.io/js/script.js'
  document.head.appendChild(script)
  console.log('✅ Plausible Analytics initialisé')
}

/**
 * Track un événement personnalisé (Google Analytics 4)
 */
export function trackEvent(eventName, eventParams = {}) {
  if (!ENABLE_ANALYTICS || !window.gtag) return

  window.gtag('event', eventName, {
    ...eventParams,
    event_category: eventParams.category || 'general',
    event_label: eventParams.label || eventName
  })
}

/**
 * Track une page view (Google Analytics 4)
 */
export function trackPageView(path, title) {
  if (!ENABLE_ANALYTICS || !window.gtag) return

  window.gtag('config', GA4_MEASUREMENT_ID, {
    page_path: path,
    page_title: title
  })
}

/**
 * Track un événement Plausible
 */
export function trackPlausibleEvent(eventName, props = {}) {
  if (!ENABLE_ANALYTICS || !window.plausible) return

  window.plausible(eventName, {
    props: props
  })
}

/**
 * Événements de tracking spécifiques à Doogoo
 */
export const DoogooEvents = {
  // Authentification
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',

  // Biens immobiliers
  PROPERTY_ADDED: 'property_added',
  PROPERTY_UPDATED: 'property_updated',
  PROPERTY_DELETED: 'property_deleted',

  // Paiements
  PAYMENT_ADDED: 'payment_added',
  PAYMENT_UPDATED: 'payment_updated',
  PAYMENT_DELETED: 'payment_deleted',

  // Langue et devise
  LANGUAGE_CHANGED: 'language_changed',
  CURRENCY_CHANGED: 'currency_changed',

  // Pages visitées
  PAGE_VIEWED: 'page_viewed'
}

/**
 * Track un événement Doogoo avec les paramètres par défaut
 */
export function trackDoogooEvent(eventName, additionalParams = {}) {
  const eventParams = {
    app_name: 'Doogoo',
    ...additionalParams
  }

  // Track avec Google Analytics 4
  trackEvent(eventName, eventParams)

  // Track avec Plausible (si disponible)
  trackPlausibleEvent(eventName, eventParams)
}

