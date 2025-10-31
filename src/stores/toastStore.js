import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Store Pinia pour gérer les notifications toast
 * Centralise l'affichage des messages de succès, erreur et info
 */
export const useToastStore = defineStore('toasts', () => {
  const items = ref([])

  /**
   * Ajoute un nouveau toast
   * @param {Object} toast - { type: 'success'|'error'|'info', message: string, timeout?: number, action?: { label, onClick } }
   */
  const push = (toast) => {
    const id = crypto.randomUUID?.() || Date.now().toString() + Math.random().toString(36).substr(2, 9)
    
    const toastItem = {
      id,
      type: 'info',
      timeout: 4000,
      ...toast
    }

    items.value.push(toastItem)

    // Supprime automatiquement après le timeout
    if (toastItem.timeout > 0) {
      setTimeout(() => {
        remove(id)
      }, toastItem.timeout)
    }
  }

  /**
   * Supprime un toast par son ID
   * @param {string} id - ID du toast à supprimer
   */
  const remove = (id) => {
    const index = items.value.findIndex(t => t.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  /**
   * Supprime tous les toasts
   */
  const clear = () => {
    items.value = []
  }

  /**
   * Méthodes helper pour les types courants
   */
  const success = (message, options = {}) => {
    push({ type: 'success', message, ...options })
  }

  const error = (message, options = {}) => {
    push({ type: 'error', message, timeout: 6000, ...options })
  }

  const info = (message, options = {}) => {
    push({ type: 'info', message, ...options })
  }

  return {
    // State
    items,
    // Actions
    push,
    remove,
    clear,
    // Helpers
    success,
    error,
    info
  }
})

