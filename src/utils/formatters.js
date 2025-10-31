/**
 * Utilitaires de formatage pour l'application MyBI
 * Évite la duplication de code entre les composants
 */

/**
 * Formate un montant selon la devise sélectionnée dans settingsStore
 * @param {number} amount - Montant à formater
 * @param {Object} options - Options de formatage
 * @param {string} options.currency - Devise à utiliser (optionnel, utilise celle du store par défaut)
 * @param {string} options.locale - Locale pour le formatage (optionnel)
 * @returns {string} Montant formaté
 */
export function formatCurrency(amount, options = {}) {
  if (amount === null || amount === undefined) {
    return '-'
  }

  // Récupère le store settings de manière dynamique (évite les imports circulaires)
  let currency = options.currency || 'EUR'
  let locale = options.locale || 'fr-FR'

  try {
    // Import dynamique pour éviter les problèmes de circular dependency
    const { useSettingsStore } = require('@/stores/settingsStore')
    const settingsStore = useSettingsStore()
    currency = options.currency || settingsStore.currency || 'EUR'
    
    // Détermine la locale selon la devise
    // Pour XOF (CFA), on utilise fr-FR mais avec la devise XOF
    if (currency === 'XOF') {
      locale = 'fr-FR'
    } else if (currency === 'USD') {
      locale = 'en-US'
    } else if (currency === 'GBP') {
      locale = 'en-GB'
    } else {
      locale = options.locale || 'fr-FR'
    }
  } catch (error) {
    // Si le store n'est pas disponible, utilise les valeurs par défaut
    console.warn('Impossible de récupérer la devise depuis settingsStore:', error)
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    ...options
  }).format(amount)
}

/**
 * Formate une date au format français
 * @param {string|Date} dateString - Date à formater (ISO string ou Date)
 * @param {Object} options - Options de formatage
 * @returns {string} Date formatée (ex: "15 déc. 2024")
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '-'
  
  const date = dateString instanceof Date 
    ? dateString 
    : new Date(dateString)
  
  // Vérifier si la date est valide
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', dateString)
    return '-'
  }
  
  const defaultOptions = {
    day: 'numeric',
    month: options.shortMonth ? 'short' : 'long',
    year: 'numeric',
    ...options
  }
  
  return date.toLocaleDateString('fr-FR', defaultOptions)
}

/**
 * Formate une date relative (ex: "Il y a 2 jours")
 * @param {string|Date} dateString - Date à formater
 * @returns {string} Date relative formatée
 */
export function formatRelativeDate(dateString) {
  if (!dateString) return '-'
  
  const date = dateString instanceof Date 
    ? dateString 
    : new Date(dateString)
  
  if (isNaN(date.getTime())) return '-'
  
  const now = new Date()
  const diffInMs = now - date
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return "Aujourd'hui"
  if (diffInDays === 1) return 'Hier'
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`
  if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`
  return `Il y a ${Math.floor(diffInDays / 365)} ans`
}

/**
 * Formate un numéro de téléphone français
 * @param {string} phone - Numéro de téléphone
 * @returns {string} Numéro formaté (ex: "06 12 34 56 78")
 */
export function formatPhone(phone) {
  if (!phone) return '-'
  
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '')
  
  // Formater selon le format français
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
  }
  
  return phone
}

