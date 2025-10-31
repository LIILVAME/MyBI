<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-7xl mx-auto px-6 pt-16 pb-8 md:px-10 md:pt-10 md:pb-10">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Statistiques</h1>
          <p class="text-gray-600">Visualisation des données et analyses de vos biens immobiliers</p>
        </div>

        <!-- État de chargement -->
        <div v-if="analyticsStore.loading" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p class="text-gray-500">Chargement des statistiques...</p>
        </div>

        <!-- Erreur -->
        <div v-else-if="analyticsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-700 font-medium">Erreur : {{ analyticsStore.error }}</p>
          </div>
        </div>

        <!-- Contenu principal -->
        <template v-else>
          <!-- Actions rapides -->
          <div class="flex gap-4 mb-6">
            <button
              @click="exportStatsToPDF"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter en PDF
            </button>
            <button
              @click="exportStatsToExcel"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter en Excel
            </button>
          </div>

          <!-- Indicateurs clés (KPIs) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Revenu total -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Revenu total</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ formatCurrency(analyticsStore.totalRevenue) }}
                  </p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Taux d'occupation -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Taux d'occupation</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ analyticsStore.occupancyRate }}%
                  </p>
                </div>
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Retards de paiement -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Paiements en retard</p>
                  <p class="text-2xl font-bold" :class="analyticsStore.latePayments > 0 ? 'text-red-600' : 'text-gray-900'">
                    {{ analyticsStore.latePayments }}
                  </p>
                </div>
                <div class="w-12 h-12 rounded-full flex items-center justify-center" :class="analyticsStore.latePayments > 0 ? 'bg-red-100' : 'bg-gray-100'">
                  <svg class="w-6 h-6" :class="analyticsStore.latePayments > 0 ? 'text-red-600' : 'text-gray-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Loyer moyen -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Loyer moyen</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ formatCurrency(analyticsStore.averageRent) }}
                  </p>
                </div>
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Graphiques -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Revenus mensuels -->
            <BaseChart
              title="Revenus mensuels (12 derniers mois)"
              type="bar"
              :height="350"
              :series="analyticsStore.revenueChartSeries"
              :options="analyticsStore.revenueChartOptions"
              :loading="analyticsStore.loading"
            />

            <!-- Taux d'occupation -->
            <BaseChart
              title="Taux d'occupation"
              type="radialBar"
              :height="350"
              :series="[{ name: 'Occupation', data: [analyticsStore.occupancyRate] }]"
              :options="{
                plotOptions: {
                  radialBar: {
                    dataLabels: {
                      name: {
                        fontSize: '16px',
                        color: '#6B7280'
                      },
                      value: {
                        fontSize: '24px',
                        fontWeight: 600,
                        color: '#3B82F6',
                        formatter: (val) => `${val}%`
                      }
                    }
                  }
                },
                labels: ['Taux d\'occupation'],
                colors: ['#3B82F6']
              }"
              :loading="analyticsStore.loading"
            />

            <!-- Revenus par bien -->
            <BaseChart
              v-if="analyticsStore.revenueByProperty.length > 0"
              title="Revenus par bien"
              type="bar"
              :height="350"
              :series="analyticsStore.revenueByPropertyChartSeries"
              :options="analyticsStore.revenueByPropertyChartOptions"
              :loading="analyticsStore.loading"
            />

            <!-- Répartition des paiements -->
            <BaseChart
              v-if="analyticsStore.paymentStatusBreakdown.paid + analyticsStore.paymentStatusBreakdown.pending + analyticsStore.paymentStatusBreakdown.late > 0"
              title="Statut des paiements"
              type="donut"
              :height="350"
              :series="analyticsStore.paymentStatusChartSeries"
              :options="analyticsStore.paymentStatusChartOptions"
              :loading="analyticsStore.loading"
            />
          </div>

          <!-- Section détaillée des retards -->
          <div v-if="analyticsStore.latePayments > 0" class="bg-red-50 border border-red-200 rounded-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-red-900 mb-2">⚠️ Attention : Paiements en retard</h3>
                <p class="text-red-700">
                  Vous avez <strong>{{ analyticsStore.latePayments }}</strong> paiement(s) en retard.
                  <router-link to="/paiements" class="underline hover:no-underline font-medium">
                    Voir les détails
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import BaseChart from '../components/charts/BaseChart.vue'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { useToastStore } from '@/stores/toastStore'
import { formatCurrency } from '@/utils/formatters'
import { exportToPDF, exportToExcel } from '@/utils/exportUtils'

const analyticsStore = useAnalyticsStore()
const toast = useToastStore()

/**
 * Charge les statistiques au montage
 */
onMounted(async () => {
  await analyticsStore.fetchAnalytics()
})

/**
 * Exporte les statistiques en PDF
 */
const exportStatsToPDF = () => {
  try {
    const exportData = [
      ['Indicateur', 'Valeur'],
      ['Revenu total', formatCurrency(analyticsStore.totalRevenue)],
      ['Taux d\'occupation', `${analyticsStore.occupancyRate}%`],
      ['Paiements en retard', analyticsStore.latePayments],
      ['Loyer moyen', formatCurrency(analyticsStore.averageRent)]
    ]

    exportToPDF(
      'Statistiques MyBI',
      exportData.map(([indicator, value]) => ({ Indicateur: indicator, Valeur: value })),
      [
        { header: 'Indicateur', key: 'Indicateur' },
        { header: 'Valeur', key: 'Valeur' }
      ],
      'statistiques'
    )
    toast.success('Export PDF réussi')
  } catch (error) {
    toast.error(`Erreur lors de l'export : ${error.message}`)
  }
}

/**
 * Exporte les statistiques en Excel
 */
const exportStatsToExcel = () => {
  try {
    const exportData = [
      {
        'Indicateur': 'Revenu total',
        'Valeur': formatCurrency(analyticsStore.totalRevenue)
      },
      {
        'Indicateur': 'Taux d\'occupation',
        'Valeur': `${analyticsStore.occupancyRate}%`
      },
      {
        'Indicateur': 'Paiements en retard',
        'Valeur': analyticsStore.latePayments
      },
      {
        'Indicateur': 'Loyer moyen',
        'Valeur': formatCurrency(analyticsStore.averageRent)
      },
      {
        'Indicateur': 'Paiements payés',
        'Valeur': analyticsStore.paymentStatusBreakdown.paid
      },
      {
        'Indicateur': 'Paiements en attente',
        'Valeur': analyticsStore.paymentStatusBreakdown.pending
      }
    ]

    exportToExcel('statistiques', exportData, 'Statistiques')
    toast.success('Export Excel réussi')
  } catch (error) {
    toast.error(`Erreur lors de l'export : ${error.message}`)
  }
}
</script>

