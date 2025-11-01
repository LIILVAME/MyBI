import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable pour implémenter le pull-to-refresh sur mobile/PWA
 * @param {Function} onRefresh - Fonction appelée lors du rafraîchissement
 * @param {Object} options - Options de configuration
 * @returns {Object} Références et méthodes pour le composant
 */
export function usePullToRefresh(onRefresh, options = {}) {
  const {
    threshold = 80, // Distance en pixels à atteindre pour déclencher le refresh
    resistance = 2.5, // Résistance du pull (plus élevé = plus difficile à tirer)
    disabled = false // Désactiver le pull-to-refresh
  } = options

  const isPulling = ref(false)
  const pullDistance = ref(0)
  const isRefreshing = ref(false)
  const startY = ref(0)
  const currentY = ref(0)
  const element = ref(null)

  let touchStartY = 0
  let touchCurrentY = 0
  let touchElement = null

  /**
   * Gère le début du touch
   */
  const handleTouchStart = (e) => {
    if (disabled || isRefreshing.value) return

    // Vérifie que l'utilisateur est en haut de la page (scrollTop === 0)
    const scrollContainer = touchElement || window
    const scrollTop = scrollContainer === window 
      ? window.pageYOffset || document.documentElement.scrollTop
      : scrollContainer.scrollTop

    if (scrollTop > 0) return

    touchStartY = e.touches[0].clientY
    touchCurrentY = touchStartY
    startY.value = touchStartY
  }

  /**
   * Gère le mouvement du touch
   */
  const handleTouchMove = (e) => {
    if (disabled || isRefreshing.value || touchStartY === 0) return

    touchCurrentY = e.touches[0].clientY
    currentY.value = touchCurrentY

    const deltaY = touchCurrentY - touchStartY

    // Ne permet le pull que vers le bas
    if (deltaY > 0) {
      // Vérifie que l'utilisateur est toujours en haut de la page
      const scrollContainer = touchElement || window
      const scrollTop = scrollContainer === window
        ? window.pageYOffset || document.documentElement.scrollTop
        : scrollContainer.scrollTop

      if (scrollTop === 0) {
        e.preventDefault() // Empêche le scroll normal

        // Calcule la distance avec résistance
        pullDistance.value = Math.min(deltaY / resistance, threshold * 1.5)
        isPulling.value = pullDistance.value > 10 // Déclenche visuellement à partir de 10px
      }
    }
  }

  /**
   * Gère la fin du touch
   */
  const handleTouchEnd = async () => {
    if (disabled || touchStartY === 0) return

    // Si on a dépassé le seuil, déclencher le refresh
    if (pullDistance.value >= threshold && !isRefreshing.value) {
      isRefreshing.value = true
      isPulling.value = false
      pullDistance.value = threshold

      try {
        // Appelle la fonction de rafraîchissement
        if (onRefresh && typeof onRefresh === 'function') {
          await onRefresh()
        }
      } catch (error) {
        console.error('Erreur lors du rafraîchissement:', error)
      } finally {
        // Réinitialise après un court délai
        setTimeout(() => {
          isRefreshing.value = false
          pullDistance.value = 0
        }, 300)
      }
    } else {
      // Réinitialise sans rafraîchir
      isPulling.value = false
      pullDistance.value = 0
    }

    // Réinitialise les valeurs
    touchStartY = 0
    touchCurrentY = 0
    startY.value = 0
    currentY.value = 0
  }

  /**
   * Initialise les écouteurs d'événements
   */
  const init = (el = null) => {
    touchElement = el || document.documentElement
    
    touchElement.addEventListener('touchstart', handleTouchStart, { passive: false })
    touchElement.addEventListener('touchmove', handleTouchMove, { passive: false })
    touchElement.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  /**
   * Nettoie les écouteurs d'événements
   */
  const cleanup = () => {
    const el = touchElement || document.documentElement
    
    el.removeEventListener('touchstart', handleTouchStart)
    el.removeEventListener('touchmove', handleTouchMove)
    el.removeEventListener('touchend', handleTouchEnd)
  }

  onMounted(() => {
    // Initialise avec le document par défaut
    init(document.documentElement)
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    isPulling,
    pullDistance,
    isRefreshing,
    element,
    init,
    cleanup
  }
}

