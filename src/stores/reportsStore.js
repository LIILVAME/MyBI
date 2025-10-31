import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from './authStore'
import { formatCurrency, formatDate } from '@/utils/formatters'

/**
 * Store Pinia pour gérer les rapports et exports
 */
export const useReportsStore = defineStore('reports', () => {
  const loading = ref(false)
  const error = ref(null)
  const recentReports = ref([])

  /**
   * Génère les données pour un rapport mensuel
   * @param {string} month - Format "YYYY-MM" ou "janv. 2025"
   * @returns {Promise<Object>} Données du rapport
   */
  const generateMonthlyReport = async (month) => {
    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('User not authenticated')
      }

      // Parse le mois (format "janv. 2025" ou "YYYY-MM")
      let startDate, endDate
      if (month.includes('-')) {
        // Format "YYYY-MM"
        const [year, monthNum] = month.split('-')
        startDate = new Date(year, parseInt(monthNum) - 1, 1)
        endDate = new Date(year, parseInt(monthNum), 0, 23, 59, 59)
      } else {
        // Format "janv. 2025"
        const [monthName, year] = month.split(' ')
        const monthMap = {
          'janv.': 0, 'févr.': 1, 'mars': 2, 'avr.': 3, 'mai': 4, 'juin': 5,
          'juil.': 6, 'août': 7, 'sept.': 8, 'oct.': 9, 'nov.': 10, 'déc.': 11
        }
        startDate = new Date(year, monthMap[monthName] || 0, 1)
        endDate = new Date(year, (monthMap[monthName] || 0) + 1, 0, 23, 59, 59)
      }

      // Récupère les paiements du mois
      const { data: payments, error: paymentsError } = await supabase
        .from('payments_view')
        .select(`
          *,
          properties (id, name, city),
          tenants (id, name)
        `)
        .eq('user_id', authStore.user.id)
        .gte('due_date', startDate.toISOString().split('T')[0])
        .lte('due_date', endDate.toISOString().split('T')[0])
        .order('due_date', { ascending: false })

      if (paymentsError) throw paymentsError

      // Récupère les propriétés
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', authStore.user.id)

      if (propertiesError) throw propertiesError

      // Calcule les statistiques
      const paidPayments = payments?.filter(p => p.status === 'paid') || []
      const latePayments = payments?.filter(p => p.status === 'late') || []
      const totalRevenue = paidPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
      const occupiedProperties = properties?.filter(p => p.status === 'occupied').length || 0
      const occupancyRate = properties?.length > 0 
        ? Math.round((occupiedProperties / properties.length) * 100) 
        : 0

      // Format les paiements pour le rapport
      const formattedPayments = (payments || []).map(p => ({
        property: p.properties?.name || 'N/A',
        tenant: p.tenants?.name || 'N/A',
        amount: Number(p.amount),
        dueDate: p.due_date,
        status: p.status
      }))

      const reportData = {
        month,
        properties: properties || [],
        payments: formattedPayments,
        statistics: {
          totalRevenue,
          occupancyRate,
          paidPayments: paidPayments.length,
          latePayments: latePayments.length,
          totalPayments: payments?.length || 0
        }
      }

      loading.value = false
      return reportData
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error generating monthly report:', err)
      throw err
    }
  }

  /**
   * Récupère les rapports récents
   */
  const fetchRecentReports = async () => {
    // Pour l'instant, retourne une liste vide
    // TODO v0.3.0+ : Stocker les rapports générés dans Supabase
    recentReports.value = []
  }

  return {
    loading,
    error,
    recentReports,
    generateMonthlyReport,
    fetchRecentReports
  }
})

