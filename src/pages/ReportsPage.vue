<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-7xl mx-auto px-6 pt-16 pb-8 md:px-10 md:pt-10 md:pb-10">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('reports.title') }}</h1>
            <p class="text-gray-600">{{ $t('reports.subtitle') }}</p>
            <div class="border-b-2 border-green-500 w-20 mb-4 mt-3"></div>
          </div>
          
          <!-- Bouton d'action principal -->
          <button
            @click="handleExportPDF"
            :disabled="reportsStore.loading || !reportData"
            class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ $t('reports.actions.exportPDF') }}
          </button>
        </div>

        <!-- Filtres -->
        <ReportFilters
          :selected-month="selectedMonth"
          :report-type="reportType"
          :selected-property="selectedProperty"
          :properties="propertiesStore.properties"
          :available-months="availableMonths"
          :loading="reportsStore.loading"
          @update:period="selectedMonth = $event"
          @update:reportType="reportType = $event"
          @update:property="selectedProperty = $event"
          @refresh="loadReport"
        />

        <!-- KPIs Section -->
        <div v-if="reportData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard
            :label="$t('reports.kpi.totalRevenue')"
            :value="reportData.statistics.totalRevenue"
            icon="currency"
            icon-color="text-green-600"
            icon-bg-color="bg-green-50"
            :formatter="formatCurrency"
            :tooltip="$t('reports.kpi.totalRevenueTooltip')"
          />
          <KpiCard
            :label="$t('reports.kpi.rentCollected')"
            :value="reportData.statistics.totalRevenue"
            icon="currency"
            icon-color="text-blue-600"
            icon-bg-color="bg-blue-50"
            :formatter="formatCurrency"
            :tooltip="$t('reports.kpi.rentCollectedTooltip')"
          />
          <KpiCard
            :label="$t('reports.kpi.occupancyRate')"
            :value="reportData.statistics.occupancyRate"
            icon="home"
            icon-color="text-purple-600"
            icon-bg-color="bg-purple-50"
            :formatter="(val) => `${val}%`"
            :tooltip="$t('reports.kpi.occupancyRateTooltip')"
          />
          <KpiCard
            :label="$t('reports.kpi.delayedPayments')"
            :value="reportData.statistics.latePayments"
            icon="clock"
            icon-color="text-red-600"
            icon-bg-color="bg-red-50"
            :tooltip="$t('reports.kpi.delayedPaymentsTooltip')"
          />
        </div>

        <!-- Loading State -->
        <div v-if="reportsStore.loading && !reportData" class="text-center py-12">
          <InlineLoader />
          <p class="mt-4 text-gray-600">{{ $t('reports.loading') }}</p>
        </div>

        <!-- Chart and Table Section -->
        <div v-if="reportData" class="space-y-6">
          <!-- Chart -->
          <ReportChart
            :title="$t('reports.chart.revenue.title')"
            :description="$t('reports.chart.revenue.description')"
            chart-type="bar"
            :series="chartSeries"
            :chart-options="chartOptions"
          />

          <!-- Table -->
          <ReportTable :table-data="tableData" />
        </div>

        <!-- Empty State -->
        <div v-if="!reportsStore.loading && !reportData" class="text-center py-12 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-lg font-medium mb-2">{{ $t('reports.noData.title') }}</p>
          <p class="text-sm">{{ $t('reports.noData.message') }}</p>
        </div>

        <!-- Summary Section -->
        <ReportSummary
          v-if="reportData"
          :statistics="reportData.statistics"
          :period="reportPeriod"
          :loading="reportsStore.loading"
          @export-pdf="handleExportPDF"
          @send-email="handleSendEmail"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '@/composables/useLingui'
import Sidebar from '../components/Sidebar.vue'
import InlineLoader from '../components/common/InlineLoader.vue'
import KpiCard from '../components/stats/KpiCard.vue'
import ReportFilters from '../components/reports/ReportFilters.vue'
import ReportSummary from '../components/reports/ReportSummary.vue'
import ReportTable from '../components/reports/ReportTable.vue'
import ReportChart from '../components/reports/ReportChart.vue'
import { useReportsStore } from '@/stores/reportsStore'
import { usePaymentsStore } from '@/stores/paymentsStore'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { useToastStore } from '@/stores/toastStore'
import { exportMonthlyReport } from '@/utils/exportUtils'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { useSettingsStore } from '@/stores/settingsStore'

const { t } = useI18n()
const reportsStore = useReportsStore()
const paymentsStore = usePaymentsStore()
const propertiesStore = usePropertiesStore()
const toast = useToastStore()
const settingsStore = useSettingsStore()

// State
const reportType = ref('global')
const selectedProperty = ref('all')
const reportData = ref(null)
const selectedMonth = ref('')

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

// Période du rapport
const reportPeriod = computed(() => {
  if (!selectedMonth.value) return { startDate: new Date(), endDate: new Date() }
  
  // Parse le mois (format "janv. 2025")
  const [monthName, year] = selectedMonth.value.split(' ')
  const monthMap = {
    'janv.': 0, 'févr.': 1, 'mars': 2, 'avr.': 3, 'mai': 4, 'juin': 5,
    'juil.': 6, 'août': 7, 'sept.': 8, 'oct.': 9, 'nov.': 10, 'déc.': 11
  }
  const monthNum = monthMap[monthName] || 0
  
  const startDate = new Date(year, monthNum, 1)
  const endDate = new Date(year, monthNum + 1, 0, 23, 59, 59)
  
  return { startDate, endDate }
})

// Données du tableau
const tableData = computed(() => {
  if (!reportData.value) return []
  
  const properties = reportData.value.properties || []
  const payments = reportData.value.payments || []
  
  return properties.map(property => {
    const propertyPayments = payments.filter(p => p.property === property.name)
    const paidPayments = propertyPayments.filter(p => p.status === 'paid')
    const totalPaid = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    const delayed = propertyPayments.filter(p => p.status === 'late').length
    
    return {
      property: property.name,
      city: property.city || '-',
      rent: property.rent || 0,
      status: property.status || 'vacant',
      totalPaid,
      delayed,
      occupancy: property.status === 'occupied' ? 100 : 0
    }
  })
})

// Données du graphique
const chartSeries = computed(() => {
  if (!reportData.value || !reportData.value.payments) return [{ name: t('reports.chart.revenue.label'), data: [] }]
  
  const payments = reportData.value.payments || []
  const paidPayments = payments.filter(p => p.status === 'paid')
  
  if (paidPayments.length === 0) {
    return [{ name: t('reports.chart.revenue.label'), data: [] }]
  }
  
  // Groupe par semaine
  const grouped = {}
  const categories = []
  
  paidPayments.forEach(payment => {
    const date = new Date(payment.dueDate)
    const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`
    if (!grouped[weekKey]) {
      grouped[weekKey] = 0
      if (!categories.includes(weekKey)) {
        categories.push(weekKey)
      }
    }
    grouped[weekKey] += payment.amount || 0
  })
  
  // Trier les catégories et créer les données
  categories.sort()
  const data = categories.map(key => grouped[key] || 0)
  
  return [{
    name: t('reports.chart.revenue.label'),
    data: data
  }]
})

// Catégories pour le graphique
const chartCategories = computed(() => {
  if (!reportData.value || !reportData.value.payments) return []
  
  const payments = reportData.value.payments || []
  const paidPayments = payments.filter(p => p.status === 'paid')
  
  const categories = []
  paidPayments.forEach(payment => {
    const date = new Date(payment.dueDate)
    const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`
    if (!categories.includes(weekKey)) {
      categories.push(weekKey)
    }
  })
  
  return categories.sort()
})

const chartOptions = computed(() => {
  const currency = settingsStore.currency
  const locale = currency === 'USD' ? 'en-US' : currency === 'GBP' ? 'en-GB' : 'fr-FR'
  
  return {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%',
        dataLabels: {
          position: 'top',
          formatter: (val) => {
            if (val === 0) return ''
            return new Intl.NumberFormat(locale, {
              style: 'currency',
              currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(val)
          },
          style: {
            colors: ['#059669'],
            fontSize: '11px'
          }
        }
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: chartCategories.value,
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        },
        rotate: -45,
        rotateAlways: false
      }
    },
    yaxis: {
      labels: {
        formatter: (val) => {
          if (val === 0) return '0'
          return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(val)
        },
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      y: {
        formatter: (val) => {
          return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          }).format(val)
        }
      }
    },
    colors: ['#22c55e'],
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    }
  }
})

// Utilitaires
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

/**
 * Charge le rapport
 */
const loadReport = async () => {
  if (!selectedMonth.value) {
    selectedMonth.value = availableMonths.value[0]?.value || ''
  }
  
  try {
    const data = await reportsStore.generateMonthlyReport(selectedMonth.value)
    reportData.value = data
  } catch (error) {
    toast.error(`Erreur lors du chargement du rapport : ${error.message}`)
  }
}

/**
 * Exporte le rapport en PDF
 */
const handleExportPDF = async () => {
  if (!reportData.value) {
    toast.error('Aucun rapport à exporter')
    return
  }
  
  try {
    exportMonthlyReport(reportData.value)
    toast.success(t('reports.export.success'))
  } catch (error) {
    toast.error(`Erreur lors de l'export : ${error.message}`)
  }
}

/**
 * Envoie le rapport par email (TODO)
 */
const handleSendEmail = () => {
  toast.info(t('reports.actions.comingSoon'))
}

onMounted(async () => {
  // Charge les propriétés si nécessaire
  if (propertiesStore.properties.length === 0) {
    await propertiesStore.fetchProperties()
  }
  
  // Charge le rapport initial
  if (availableMonths.value.length > 0) {
    selectedMonth.value = availableMonths.value[0].value
    await loadReport()
  }
})
</script>
