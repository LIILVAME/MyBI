<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-7xl mx-auto px-6 pt-16 pb-8 md:px-10 md:pt-10 md:pb-10">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Rapports</h1>
          <p class="text-gray-600">Générez et exportez vos rapports mensuels et données</p>
        </div>

        <!-- Actions rapides -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <!-- Rapport mensuel -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Rapport mensuel</h3>
            <p class="text-sm text-gray-600 mb-4">Générez un rapport PDF complet pour un mois donné</p>
            <div class="flex gap-2">
              <select
                v-model="selectedMonth"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option v-for="month in availableMonths" :key="month.value" :value="month.value">
                  {{ month.label }}
                </option>
              </select>
              <button
                @click="generateMonthlyReport"
                :disabled="reportsStore.loading"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {{ reportsStore.loading ? 'Génération...' : 'Générer PDF' }}
              </button>
            </div>
          </div>

          <!-- Export paiements -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Export paiements</h3>
            <p class="text-sm text-gray-600 mb-4">Exportez tous vos paiements en Excel</p>
            <button
              @click="exportPayments"
              class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
            >
              Exporter en Excel
            </button>
          </div>

          <!-- Export biens -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Export biens</h3>
            <p class="text-sm text-gray-600 mb-4">Exportez la liste de vos biens en Excel</p>
            <button
              @click="exportProperties"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Exporter en Excel
            </button>
          </div>
        </div>

        <!-- Rapports récents -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Rapports récents</h2>
          <div v-if="reportsStore.loading" class="text-center py-8">
            <InlineLoader />
          </div>
          <div v-else-if="reportsStore.recentReports.length === 0" class="text-center py-8 text-gray-500">
            <p>Aucun rapport généré récemment</p>
            <p class="text-sm mt-2">Générez un rapport mensuel pour commencer</p>
          </div>
          <div v-else class="space-y-3">
            <!-- TODO v0.3.0+ : Afficher les rapports récents depuis Supabase -->
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import InlineLoader from '../components/common/InlineLoader.vue'
import { useReportsStore } from '@/stores/reportsStore'
import { usePaymentsStore } from '@/stores/paymentsStore'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { useToastStore } from '@/stores/toastStore'
import { exportToPDF, exportToExcel, exportMonthlyReport } from '@/utils/exportUtils'
import { formatCurrency } from '@/utils/formatters'

const router = useRouter()
const reportsStore = useReportsStore()
const paymentsStore = usePaymentsStore()
const propertiesStore = usePropertiesStore()
const toast = useToastStore()

// Génère les 12 derniers mois
const availableMonths = computed(() => {
  const months = []
  const monthNames = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
  
  for (let i = 0; i < 12; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    months.push({
      label: monthKey,
      value: monthKey
    })
  }
  
  return months
})

const selectedMonth = ref(availableMonths.value[0]?.value || '')

/**
 * Génère un rapport mensuel en PDF
 */
const generateMonthlyReport = async () => {
  if (!selectedMonth.value) return

  try {
    const reportData = await reportsStore.generateMonthlyReport(selectedMonth.value)
    exportMonthlyReport(reportData)
    toast.success('Rapport mensuel généré avec succès')
  } catch (error) {
    toast.error(`Erreur lors de la génération : ${error.message}`)
  }
}

/**
 * Exporte les paiements en Excel
 */
const exportPayments = async () => {
  try {
    if (paymentsStore.payments.length === 0) {
      await paymentsStore.fetchPayments()
    }

    const exportData = paymentsStore.payments.map(p => ({
      'Bien': p.property,
      'Locataire': p.tenant,
      'Montant': p.amount,
      'Date d\'échéance': p.dueDate,
      'Statut': p.status === 'paid' ? 'Payé' : p.status === 'pending' ? 'En attente' : 'En retard'
    }))

    exportToExcel('paiements', exportData, 'Paiements')
    toast.success('Export des paiements réussi')
  } catch (error) {
    toast.error(`Erreur lors de l'export : ${error.message}`)
  }
}

/**
 * Exporte les biens en Excel
 */
const exportProperties = async () => {
  try {
    if (propertiesStore.properties.length === 0) {
      await propertiesStore.fetchProperties()
    }

    const exportData = propertiesStore.properties.map(p => ({
      'Nom': p.name,
      'Adresse': p.address,
      'Ville': p.city,
      'Loyer': p.rent,
      'Statut': p.status === 'occupied' ? 'Occupé' : 'Libre',
      'Locataire': p.tenant?.name || '-',
      'Date d\'entrée': p.tenant?.entryDate || '-',
      'Loyer locataire': p.tenant?.rent || '-'
    }))

    exportToExcel('biens', exportData, 'Biens')
    toast.success('Export des biens réussi')
  } catch (error) {
    toast.error(`Erreur lors de l'export : ${error.message}`)
  }
}

onMounted(async () => {
  await reportsStore.fetchRecentReports()
})
</script>

