import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from './authStore'
import { formatDate, formatRelativeDate, formatCurrency } from '@/utils/formatters'

/**
 * Store Pinia pour gérer les alertes automatiques
 */
export const useAlertsStore = defineStore('alerts', () => {
  const loading = ref(false)
  const error = ref(null)
  const alerts = ref([])

  /**
   * Types d'alertes
   */
  const ALERT_TYPES = {
    LATE_PAYMENT: 'late_payment',
    UPCOMING_LEASE_END: 'upcoming_lease_end',
    UNPAID_AFTER_DAYS: 'unpaid_after_days',
    LOW_OCCUPANCY: 'low_occupancy'
  }

  /**
   * Récupère toutes les alertes pour l'utilisateur
   */
  const fetchAlerts = async () => {
    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('User not authenticated')
      }

      const allAlerts = []

      // 1️⃣ Alertes de paiements en retard
      const { data: latePayments, error: paymentsError } = await supabase
        .from('payments_view')
        .select(`
          *,
          properties (id, name, city),
          tenants (id, name)
        `)
        .eq('user_id', authStore.user.id)
        .eq('status', 'late')
        .order('due_date', { ascending: true })

      if (!paymentsError && latePayments) {
        latePayments.forEach(payment => {
          const daysLate = Math.floor((new Date() - new Date(payment.due_date)) / (1000 * 60 * 60 * 24))
          allAlerts.push({
            id: `late-${payment.id}`,
            type: ALERT_TYPES.LATE_PAYMENT,
            severity: 'high',
            title: `Paiement en retard - ${payment.properties?.name || 'N/A'}`,
            message: `Le loyer de ${formatCurrency(payment.amount)} est en retard de ${daysLate} jour(s).`,
            propertyId: payment.property_id,
            paymentId: payment.id,
            date: payment.due_date,
            daysLate,
            actionUrl: '/paiements'
          })
        })
      }

      // 2️⃣ Alertes de paiements impayés après X jours (mais pas encore marqués "late")
      const { data: unpaidPayments, error: unpaidError } = await supabase
        .from('payments_view')
        .select(`
          *,
          properties (id, name, city),
          tenants (id, name)
        `)
        .eq('user_id', authStore.user.id)
        .eq('status', 'pending')
        .lt('due_date', new Date().toISOString().split('T')[0])
        .order('due_date', { ascending: true })

      if (!unpaidError && unpaidPayments) {
        unpaidPayments.forEach(payment => {
          const daysOverdue = Math.floor((new Date() - new Date(payment.due_date)) / (1000 * 60 * 60 * 24))
          if (daysOverdue >= 5) {
            allAlerts.push({
              id: `unpaid-${payment.id}`,
              type: ALERT_TYPES.UNPAID_AFTER_DAYS,
              severity: daysOverdue >= 10 ? 'high' : 'medium',
              title: `Paiement impayé - ${payment.properties?.name || 'N/A'}`,
              message: `Le paiement de ${formatCurrency(payment.amount)} est impayé depuis ${daysOverdue} jour(s).`,
              propertyId: payment.property_id,
              paymentId: payment.id,
              date: payment.due_date,
              daysOverdue,
              actionUrl: '/paiements'
            })
          }
        })
      }

      // 3️⃣ Alertes de fin de bail approchante (si exit_date est renseignée)
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          *,
          tenants (*)
        `)
        .eq('user_id', authStore.user.id)
        .eq('status', 'occupied')

      if (!propertiesError && properties) {
        properties.forEach(property => {
          if (property.tenants && property.tenants.length > 0) {
            const tenant = property.tenants[0]
            if (tenant.exit_date) {
              const exitDate = new Date(tenant.exit_date)
              const today = new Date()
              const daysUntilExit = Math.floor((exitDate - today) / (1000 * 60 * 60 * 24))

              if (daysUntilExit >= 0 && daysUntilExit <= 30) {
                allAlerts.push({
                  id: `lease-end-${property.id}`,
                  type: ALERT_TYPES.UPCOMING_LEASE_END,
                  severity: daysUntilExit <= 7 ? 'high' : 'medium',
                  title: `Fin de bail approchante - ${property.name}`,
                  message: `Le bail de ${tenant.name} se termine dans ${daysUntilExit} jour(s) (${formatDate(exitDate)}).`,
                  propertyId: property.id,
                  tenantId: tenant.id,
                  date: tenant.exit_date,
                  daysUntilExit,
                  actionUrl: '/locataires'
                })
              }
            }
          }
        })
      }

      // 4️⃣ Alerte de faible taux d'occupation
      const { data: allProperties, error: allPropsError } = await supabase
        .from('properties')
        .select('status')
        .eq('user_id', authStore.user.id)

      if (!allPropsError && allProperties && allProperties.length > 0) {
        const occupiedCount = allProperties.filter(p => p.status === 'occupied').length
        const occupancyRate = (occupiedCount / allProperties.length) * 100

        if (occupancyRate < 50 && allProperties.length >= 3) {
          allAlerts.push({
            id: 'low-occupancy',
            type: ALERT_TYPES.LOW_OCCUPANCY,
            severity: 'low',
            title: 'Taux d\'occupation faible',
            message: `Votre taux d'occupation est de ${Math.round(occupancyRate)}% (${occupiedCount}/${allProperties.length} biens occupés).`,
            occupancyRate: Math.round(occupancyRate),
            actionUrl: '/biens'
          })
        }
      }

      // Trie par sévérité (high > medium > low)
      const severityOrder = { high: 3, medium: 2, low: 1 }
      alerts.value = allAlerts.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity])

      loading.value = false
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error fetching alerts:', err)
    }
  }

  /**
   * Marque une alerte comme résolue (supprime de la liste)
   * TODO v0.3.0+ : Stocker dans Supabase pour persistance
   */
  const markAsResolved = (alertId) => {
    alerts.value = alerts.value.filter(a => a.id !== alertId)
  }

  /**
   * Computed : Nombre d'alertes par sévérité
   */
  const highSeverityAlerts = computed(() => 
    alerts.value.filter(a => a.severity === 'high')
  )
  const mediumSeverityAlerts = computed(() => 
    alerts.value.filter(a => a.severity === 'medium')
  )
  const lowSeverityAlerts = computed(() => 
    alerts.value.filter(a => a.severity === 'low')
  )

  return {
    loading,
    error,
    alerts,
    ALERT_TYPES,
    fetchAlerts,
    markAsResolved,
    highSeverityAlerts,
    mediumSeverityAlerts,
    lowSeverityAlerts
  }
})

