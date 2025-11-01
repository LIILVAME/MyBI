import { useDiagnosticStore } from '@/stores/diagnosticStore'

/**
 * Composable pour un logging unifié dans l'application
 * Centralise les logs et les enregistre dans le diagnosticStore
 */
export function useLogger() {
  const diagnosticStore = useDiagnosticStore()
  const isDevelopment = import.meta.env.MODE === 'development'

  /**
   * Log un événement info
   * @param {string} message - Message à logger
   * @param {Object} context - Contexte additionnel
   */
  const logInfo = (message, context = {}) => {
    if (isDevelopment) {
      console.group(`ℹ️ INFO: ${message}`)
      if (Object.keys(context).length > 0) {
        console.log('Context:', context)
      }
      console.groupEnd()
    }

    diagnosticStore.logEvent('info', message, context)
  }

  /**
   * Log un avertissement
   * @param {string} message - Message à logger
   * @param {Object} context - Contexte additionnel
   */
  const logWarning = (message, context = {}) => {
    if (isDevelopment) {
      console.group(`⚠️ WARNING: ${message}`)
      if (Object.keys(context).length > 0) {
        console.log('Context:', context)
      }
      console.groupEnd()
    }

    diagnosticStore.logEvent('warning', message, context)
  }

  /**
   * Log une erreur
   * @param {string} message - Message à logger
   * @param {Error|Object} error - L'erreur à logger
   * @param {Object} context - Contexte additionnel
   */
  const logError = (message, error = null, context = {}) => {
    const errorDetails = error ? {
      message: error?.message || error?.toString() || 'Unknown error',
      stack: error?.stack || null,
      ...context
    } : context

    if (isDevelopment) {
      console.group(`❌ ERROR: ${message}`)
      if (error) {
        console.error('Error:', error)
      }
      if (Object.keys(context).length > 0) {
        console.log('Context:', context)
      }
      console.groupEnd()
    }

    diagnosticStore.recordError(error || new Error(message), {
      ...errorDetails,
      logMessage: message
    })
  }

  /**
   * Log un succès
   * @param {string} message - Message à logger
   * @param {Object} context - Contexte additionnel
   */
  const logSuccess = (message, context = {}) => {
    if (isDevelopment) {
      console.group(`✅ SUCCESS: ${message}`)
      if (Object.keys(context).length > 0) {
        console.log('Context:', context)
      }
      console.groupEnd()
    }

    diagnosticStore.logEvent('success', message, context)
  }

  return {
    logInfo,
    logWarning,
    logError,
    logSuccess
  }
}

