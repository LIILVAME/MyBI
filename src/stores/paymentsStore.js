import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from './authStore'
import { usePropertiesStore } from './propertiesStore'
import { useToastStore } from './toastStore'
import { TRANSACTION_STATUS } from '@/utils/constants'
import { formatCurrency } from '@/utils/formatters'

/**
 * Store Pinia pour gérer les paiements
 * Connecté à Supabase pour la persistance et synchronisation en temps réel
 */
export const usePaymentsStore = defineStore('payments', () => {
  // State
  const payments = ref([])
  const loading = ref(false)
  const error = ref(null)
  let realtimeChannel = null
  let isRealtimeInitialized = false
  let lastFetchTime = 0
  const FETCH_CACHE_MS = 5000 // Cache de 5 secondes pour éviter les requêtes multiples

  /**
   * Récupère tous les paiements de l'utilisateur depuis Supabase
   */
  const fetchPayments = async (force = false) => {
    // Évite les requêtes multiples si déjà en cours
    if (loading.value && !force) {
      console.log('⏸️ fetchPayments déjà en cours, skip')
      return
    }

    // Cache de 5 secondes pour éviter les requêtes trop fréquentes
    const now = Date.now()
    if (!force && now - lastFetchTime < FETCH_CACHE_MS && payments.value.length > 0) {
      console.log('⏸️ fetchPayments: données récentes, skip (cache)')
      return
    }

    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('User not authenticated')
      }

      const { data, error: fetchError } = await supabase
        .from('payments_view')
        .select(`
          *,
          properties (
            id,
            name,
            city
          ),
          tenants (
            id,
            name
          )
        `)
        .eq('user_id', authStore.user.id)
        .order('due_date', { ascending: false })

      lastFetchTime = Date.now()

      if (fetchError) throw fetchError

      // Transforme les données Supabase pour correspondre au format attendu
      payments.value = (data || []).map(payment => ({
        id: payment.id,
        propertyId: payment.property_id,
        property: payment.properties?.name || 'N/A',
        tenant: payment.tenants?.name || payment.properties?.name || 'N/A',
        amount: Number(payment.amount),
        dueDate: payment.due_date,
        status: payment.status
      }))

      loading.value = false
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error fetching payments:', err)
    }
  }

  /**
   * Ajoute un nouveau paiement dans Supabase
   * @param {Object} paymentData - Données du paiement à ajouter
   * @returns {Object} Le paiement créé avec son ID
   */
  const addPayment = async (paymentData) => {
    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('User not authenticated')
      }

      // Trouve le tenant_id si property_id est fourni
      let tenantId = null
      if (paymentData.propertyId) {
        const propertiesStore = usePropertiesStore()
        const property = propertiesStore.properties.find(p => p.id === paymentData.propertyId)
        if (property && property.tenant) {
          tenantId = property.tenant.id
        }
      }

      // Insère le paiement dans Supabase (table payments, colonne date)
      const { data, error: insertError } = await supabase
        .from('payments')
        .insert([
          {
            property_id: paymentData.propertyId || null,
            tenant_id: tenantId,
            amount: Number(paymentData.amount),
            date: paymentData.dueDate, // La table utilise 'date', pas 'due_date'
            status: paymentData.status || TRANSACTION_STATUS.PENDING,
            user_id: authStore.user.id // Le trigger va le remplir automatiquement si null
          }
        ])
        .select(`
          *,
          properties (
            id,
            name,
            city
          ),
          tenants (
            id,
            name
          )
        `)
        .single()

      if (insertError) throw insertError

      // Transforme pour le format attendu
      const newPayment = {
        id: data.id,
        propertyId: data.property_id,
        property: data.properties?.name || paymentData.property || 'N/A',
        tenant: data.tenants?.name || paymentData.tenant || 'N/A',
        amount: Number(data.amount),
        dueDate: data.due_date,
        status: data.status
      }

      payments.value.unshift(newPayment)
      
      const toast = useToastStore()
      toast.success(`Paiement de ${formatCurrency(newPayment.amount)} ajouté`)
      
      loading.value = false

      return newPayment
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error adding payment:', err)
      
      const toast = useToastStore()
      toast.error(`Erreur lors de l'ajout du paiement : ${err.message}`)
      
      throw err
    }
  }

  /**
   * Met à jour un paiement existant dans Supabase
   * @param {string} id - ID UUID du paiement à mettre à jour
   * @param {Object} updates - Données à mettre à jour
   */
  const updatePayment = async (id, updates) => {
    loading.value = true
    error.value = null

    try {
      const supabaseUpdates = {
        amount: updates.amount ? Number(updates.amount) : undefined,
        date: updates.dueDate || undefined, // La table utilise 'date', pas 'due_date'
        status: updates.status || undefined
        // updated_at est géré automatiquement par le trigger
      }

      // Supprime les propriétés undefined
      Object.keys(supabaseUpdates).forEach(key => {
        if (supabaseUpdates[key] === undefined) {
          delete supabaseUpdates[key]
        }
      })

      const { data, error: updateError } = await supabase
        .from('payments')
        .update(supabaseUpdates)
        .eq('id', id)
        .select(`
          *,
          properties (
            id,
            name,
            city
          ),
          tenants (
            id,
            name
          )
        `)
        .single()

      if (updateError) throw updateError

      // Met à jour dans la liste locale
      const index = payments.value.findIndex(p => p.id === id)
      if (index !== -1) {
        payments.value[index] = {
          id: data.id,
          propertyId: data.property_id,
          property: data.properties?.name || 'N/A',
          tenant: data.tenants?.name || 'N/A',
          amount: Number(data.amount),
          dueDate: data.due_date,
          status: data.status
        }
      }

      const toast = useToastStore()
      toast.success('Paiement mis à jour')
      
      loading.value = false
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error updating payment:', err)
      
      const toast = useToastStore()
      toast.error(`Erreur lors de la mise à jour : ${err.message}`)
      
      throw err
    }
  }

  /**
   * Supprime un paiement dans Supabase
   * @param {string} id - ID UUID du paiement à supprimer
   */
  const removePayment = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('payments')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Supprime de la liste locale
      payments.value = payments.value.filter(p => p.id !== id)
      
      const toast = useToastStore()
      toast.success('Paiement supprimé')
      
      loading.value = false
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error deleting payment:', err)
      
      const toast = useToastStore()
      toast.error(`Erreur lors de la suppression : ${err.message}`)
      
      throw err
    }
  }

  /**
   * Computed : Paiements en attente
   */
  const pendingPayments = computed(() =>
    payments.value.filter(p => p.status === TRANSACTION_STATUS.PENDING)
  )

  /**
   * Computed : Paiements en retard
   */
  const latePayments = computed(() =>
    payments.value.filter(p => p.status === TRANSACTION_STATUS.LATE)
  )

  /**
   * Computed : Paiements effectués
   */
  const paidPayments = computed(() =>
    payments.value.filter(p => p.status === TRANSACTION_STATUS.PAID)
  )

  /**
   * Initialise l'abonnement temps réel pour les paiements
   * Écoute les changements INSERT/UPDATE/DELETE sur la table payments
   */
  const initRealtime = () => {
    // Se désabonne si déjà abonné
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
      realtimeChannel = null
    }

    const toast = useToastStore()
    const authStore = useAuthStore()

    // Vérifie que l'utilisateur est authentifié
    if (!authStore.user) {
      console.warn('Cannot init realtime: user not authenticated')
      return
    }

    realtimeChannel = supabase
      .channel('public:payments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
          filter: `user_id=eq.${authStore.user.id}` // Seulement les paiements de l'utilisateur
        },
        async (payload) => {
          const { eventType, new: rowNew, old: rowOld } = payload

          if (eventType === 'INSERT') {
            // Charge les données complètes avec relations (via la vue pour avoir due_date)
            const { data, error: fetchError } = await supabase
              .from('payments_view')
              .select(`
                *,
                properties (
                  id,
                  name,
                  city
                ),
                tenants (
                  id,
                  name
                )
              `)
              .eq('id', rowNew.id)
              .single()

            if (!fetchError && data) {
              const newPayment = {
                id: data.id,
                propertyId: data.property_id,
                property: data.properties?.name || 'N/A',
                tenant: data.tenants?.name || data.properties?.name || 'N/A',
                amount: Number(data.amount),
                dueDate: data.due_date,
                status: data.status
              }

              // Ajoute seulement s'il n'existe pas déjà
              if (!payments.value.find(p => p.id === newPayment.id)) {
                payments.value.unshift(newPayment)
                toast.info(`Nouveau paiement : ${formatCurrency(newPayment.amount)}`)
              }
            }
          }

          if (eventType === 'UPDATE') {
            // Recharge le paiement avec ses relations (via la vue pour avoir due_date)
            const { data, error: fetchError } = await supabase
              .from('payments_view')
              .select(`
                *,
                properties (
                  id,
                  name,
                  city
                ),
                tenants (
                  id,
                  name
                )
              `)
              .eq('id', rowNew.id)
              .single()

            if (!fetchError && data) {
              const updatedPayment = {
                id: data.id,
                propertyId: data.property_id,
                property: data.properties?.name || 'N/A',
                tenant: data.tenants?.name || 'N/A',
                amount: Number(data.amount),
                dueDate: data.due_date,
                status: data.status
              }

              const index = payments.value.findIndex(p => p.id === updatedPayment.id)
              if (index !== -1) {
                payments.value[index] = updatedPayment
                toast.info(`Paiement mis à jour`)
              }
            }
          }

          if (eventType === 'DELETE') {
            payments.value = payments.value.filter(p => p.id !== rowOld.id)
            toast.info('Paiement supprimé')
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime subscribed to payments')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime error for payments')
          isRealtimeInitialized = false // Réinitialise pour permettre une nouvelle tentative
          realtimeChannel = null
          // Ne pas afficher d'erreur toast pour éviter le spam
          // Le Realtime est optionnel, l'application fonctionne sans
        } else if (status === 'CLOSED') {
          console.log('🔌 Realtime channel closed for payments')
          isRealtimeInitialized = false
          realtimeChannel = null
        }
      })
  }

  /**
   * Arrête l'abonnement temps réel
   */
  const stopRealtime = () => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
      realtimeChannel = null
      isRealtimeInitialized = false
      console.log('🔌 Realtime unsubscribed from payments')
    }
  }


  return {
    // State
    payments,
    loading,
    error,
    // Actions
    fetchPayments,
    addPayment,
    updatePayment,
    removePayment,
    initRealtime,
    stopRealtime,
    // Getters
    pendingPayments,
    latePayments,
    paidPayments
  }
})
