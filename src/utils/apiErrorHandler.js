import { useToastStore } from '@/stores/toastStore'
import { isRetryableError } from './retry'

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
 * Wrapper pour les appels API avec gestion d'erreur automatique et retry
 * @param {Function} apiCall - Fonction async qui retourne { data, error }
 * @param {string} context - Contexte pour les logs
 * @returns {Promise<Object>} { success: boolean, data?: any, error?: Error, retries?: number }
 */
export async function withErrorHandling(apiCall, context = '') {
  const { retry } = await import('./retry')
  const { useConnectionStore } = await import('@/stores/connectionStore')
  const { useToastStore } = await import('@/stores/toastStore')
  
  const connectionStore = useConnectionStore()
  const toastStore = useToastStore()

  // Fonction wrapper pour le retry
  const wrappedApiCall = async () => {
    try {
      const result = await apiCall()
      
      if (result.error) {
        // Vérifie si l'erreur est réessayable
        if (isRetryableError(result.error)) {
          // Retourne un objet avec success: false pour déclencher le retry
          return {
            success: false,
            error: result.error,
            message: result.error.message || 'Network error'
          }
        }
        // Erreur non réessayable, retourne directement
        return handleApiError(result.error, context)
      }
      
      // Succès
      return {
        success: true,
        data: result.data
      }
    } catch (error) {
      // Erreur non réessayable, retourne directement
      if (!isRetryableError(error)) {
        return handleApiError(error, context)
      }
      // Erreur réessayable, retourne pour le retry
      return {
        success: false,
        error,
        message: error.message || 'Network error'
      }
    }
  }

  // Si on n'est pas en ligne, ne pas essayer
  if (!connectionStore.isOnline) {
    return {
      success: false,
      error: new Error('No internet connection'),
      message: 'Pas de connexion internet'
    }
  }

  // Affiche un toast de reconnexion si nécessaire
  let retryToastShown = false
  const showRetryToast = () => {
    if (!retryToastShown && toastStore) {
      toastStore.info('Tentative de reconnexion...')
      retryToastShown = true
    }
  }

  // Exécute avec retry pour les erreurs réseau
  const retryResult = await retry(wrappedApiCall, {
    maxRetries: 3,
    initialDelay: 500,
    maxDelay: 2000,
    shouldRetry: (error) => {
      // Réessaye seulement pour les erreurs réseau
      if (isRetryableError(error)) {
        showRetryToast()
        return true
      }
      return false
    }
  })

  // Si le retry a échoué après toutes les tentatives
  if (!retryResult.success && retryResult.retries > 0) {
    if (toastStore) {
      toastStore.error('Connexion perdue. Vérifiez votre réseau.')
    }
    connectionStore.setOnline(false)
  }

  // Si succès, met à jour la connexion
  if (retryResult.success) {
    connectionStore.setOnline(true)
    if (retryToastShown && toastStore) {
      // Le toast "reconnexion" sera automatiquement remplacé par le toast de succès de l'API
    }
  }

  return retryResult
}

