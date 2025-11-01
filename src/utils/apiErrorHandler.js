import { useToastStore } from '@/stores/toastStore'

/**
 * Gestionnaire d'erreur centralisé pour les appels API Supabase
 * @param {Error|Object} error - L'erreur retournée par Supabase ou une erreur JavaScript
 * @param {string} context - Contexte de l'erreur (ex: "fetchProperties", "createPayment")
 * @returns {Object} { success: false, message: string }
 */
export function handleApiError(error, context = '') {
  // Log l'erreur pour le debugging
  console.warn(`[API ERROR] ${context}`, error)

  // Détermine le message d'erreur
  let message = 'Erreur API inconnue'
  
  if (error?.message) {
    message = error.message
  } else if (typeof error === 'string') {
    message = error
  } else if (error?.error_description) {
    message = error.error_description
  }

  // Messages d'erreur plus conviviaux pour les cas courants
  const userFriendlyMessages = {
    'Network request failed': 'Erreur réseau. Vérifiez votre connexion internet.',
    'Failed to fetch': 'Erreur réseau. Vérifiez votre connexion internet.',
    'JWT expired': 'Votre session a expiré. Veuillez vous reconnecter.',
    'Invalid API key': 'Erreur de configuration. Contactez le support.',
    'new row violates row-level security policy': 'Action non autorisée. Vous n\'avez pas les droits nécessaires.',
    'duplicate key value violates unique constraint': 'Cette valeur existe déjà.',
    'foreign key constraint fails': 'Impossible de supprimer : des données sont liées.',
    'null value in column': 'Des champs obligatoires sont manquants.'
  }

  // Remplace par un message plus convivial si disponible
  const friendlyMessage = Object.keys(userFriendlyMessages).find(key => 
    message.toLowerCase().includes(key.toLowerCase())
  )
  
  if (friendlyMessage) {
    message = userFriendlyMessages[friendlyMessage]
  }

  // Affiche un toast d'erreur (si le toastStore est disponible)
  try {
    const toastStore = useToastStore()
    if (toastStore) {
      toastStore.error(message)
    }
  } catch (toastError) {
    // Si le toastStore n'est pas disponible, on continue sans toast
    console.warn('Impossible d\'afficher un toast:', toastError)
  }

  // TODO v0.4.0+ : Remonter les erreurs critiques vers Sentry
  // if (error.severity === 'critical') {
  //   Sentry.captureException(error, { tags: { context } })
  // }

  return {
    success: false,
    message,
    error
  }
}

/**
 * Wrapper pour les appels API avec gestion d'erreur automatique
 * @param {Function} apiCall - Fonction async qui retourne { data, error }
 * @param {string} context - Contexte pour les logs
 * @returns {Promise<Object>} { success: boolean, data?: any, error?: Error }
 */
export async function withErrorHandling(apiCall, context = '') {
  try {
    const result = await apiCall()
    
    if (result.error) {
      return handleApiError(result.error, context)
    }
    
    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    return handleApiError(error, context)
  }
}

