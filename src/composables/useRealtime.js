import { onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'

/**
 * Composable pour s'abonner aux changements en temps réel d'une table Supabase
 * 
 * @param {string} table - Nom de la table à écouter
 * @param {Object} handlers - Objets de callbacks : { onInsert, onUpdate, onDelete, onAny }
 * @returns {Object} - Objet avec méthodes pour gérer le channel
 */
export function useRealtime(table, handlers = {}) {
  let channel = null

  /**
   * Initialise l'abonnement au temps réel
   */
  const subscribe = () => {
    if (channel) {
      console.warn(`Channel already exists for table: ${table}`)
      return
    }

    channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table
        },
        (payload) => {
          const { eventType, new: rowNew, old: rowOld } = payload

          // Appelle les handlers spécifiques selon le type d'événement
          if (eventType === 'INSERT' && handlers.onInsert) {
            handlers.onInsert(rowNew, payload)
          }
          if (eventType === 'UPDATE' && handlers.onUpdate) {
            handlers.onUpdate(rowNew, payload)
          }
          if (eventType === 'DELETE' && handlers.onDelete) {
            handlers.onDelete(rowOld, payload)
          }

          // Handler générique pour tous les événements
          if (handlers.onAny) {
            handlers.onAny(payload)
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Realtime subscribed to table: ${table}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Realtime error for table: ${table}`)
        }
      })
  }

  /**
   * Se désabonne du canal
   */
  const unsubscribe = () => {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
      console.log(`🔌 Realtime unsubscribed from table: ${table}`)
    }
  }

  // S'abonne au montage
  onMounted(() => {
    subscribe()
  })

  // Se désabonne au démontage
  onUnmounted(() => {
    unsubscribe()
  })

  return {
    subscribe,
    unsubscribe,
    channel
  }
}

