<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-7xl mx-auto px-6 pt-16 pb-8 md:px-10 md:pt-10 md:pb-10">
        <!-- En-tête avec barre verte -->
        <div class="mb-8 animate-fade-in">
          <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ $t('stats.title') }}</h1>
          <div class="flex items-center gap-4 mb-4">
            <div class="border-b-2 border-primary-500 w-20"></div>
            <p class="text-gray-600">{{ $t('stats.subtitle') }}</p>
          </div>
        </div>

        <!-- État de chargement -->
        <div v-if="analyticsStore.loading" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow-sm border border-gray-100 p-5 animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div class="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
            <p class="text-gray-500">{{ $t('stats.loading') }}</p>
          </div>
        </div>

        <!-- Erreur -->
        <div v-else-if="analyticsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-fade-in">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-700 font-medium">{{ $t('stats.error') }}: {{ analyticsStore.error }}</p>
          </div>
        </div>

        <!-- Contenu principal -->
        <div v-else class="space-y-6 animate-fade-in">
          <!-- KPIs (4 cartes) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              :label="$t('stats.kpi.totalRevenue')"
              :value="analyticsStore.totalRevenue"
              :formatter="formatCurrency"
              icon="money"
              icon-color="text-green-500"
              icon-bg-color="bg-green-50"
              :tooltip="$t('stats.kpi.totalRevenueTooltip')"
            />
            
            <KpiCard
              :label="$t('stats.kpi.occupancyRate')"
              :value="analyticsStore.occupancyRate"
              :formatter="(val) => `${val}%`"
              icon="home"
              icon-color="text-blue-500"
              icon-bg-color="bg-blue-50"
              :tooltip="$t('stats.kpi.occupancyRateTooltip')"
            />
            
            <KpiCard
              :label="$t('stats.kpi.latePayments')"
              :value="analyticsStore.latePayments"
              icon="clock"
              :icon-color="analyticsStore.latePayments > 0 ? 'text-orange-500' : 'text-gray-500'"
              :icon-bg-color="analyticsStore.latePayments > 0 ? 'bg-orange-50' : 'bg-gray-50'"
              :value-color="analyticsStore.latePayments > 0 ? 'text-orange-600' : 'text-gray-900'"
              :tooltip="$t('stats.kpi.latePaymentsTooltip')"
            />
            
            <KpiCard
              :label="$t('stats.kpi.averageRent')"
              :value="analyticsStore.averageRent"
              :formatter="formatCurrency"
              icon="chart"
              icon-color="text-purple-500"
              icon-bg-color="bg-purple-50"
              :tooltip="$t('stats.kpi.averageRentTooltip')"
            />
          </div>

          <!-- Graphiques - Ligne 1 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Revenus mensuels -->
            <ChartCard
              :title="$t('stats.charts.monthlyRevenue.title')"
              :description="$t('stats.charts.monthlyRevenue.description')"
              :loading="analyticsStore.loading"
            >
              <BaseChart
                type="bar"
                :height="350"
              :series="analyticsStore.revenueChartSeries"
              :options="revenueChartOptionsWithColors"
              :loading="analyticsStore.loading"
            />
            </ChartCard>

            <!-- Répartition des statuts de paiement -->
            <ChartCard
              v-if="analyticsStore.paymentStatusBreakdown.paid + analyticsStore.paymentStatusBreakdown.pending + analyticsStore.paymentStatusBreakdown.late > 0"
              :title="$t('stats.charts.paymentStatus.title')"
              :description="$t('stats.charts.paymentStatus.description')"
              :loading="analyticsStore.loading"
            >
              <BaseChart
                type="donut"
                :height="350"
                :series="analyticsStore.paymentStatusChartSeries"
                :options="paymentStatusChartOptionsWithColors"
                :loading="analyticsStore.loading"
              />
            </ChartCard>
          </div>

          <!-- Graphiques - Ligne 2 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Revenus par bien -->
            <ChartCard
              v-if="analyticsStore.revenueByProperty.length > 0"
              :title="$t('stats.charts.revenueByProperty.title')"
              :description="$t('stats.charts.revenueByProperty.description')"
              :loading="analyticsStore.loading"
            >
              <BaseChart
                type="bar"
                :height="350"
                :series="analyticsStore.revenueByPropertyChartSeries"
                :options="revenueByPropertyChartOptionsWithColors"
                :loading="analyticsStore.loading"
              />
            </ChartCard>

            <!-- Taux d'occupation -->
            <ChartCard
              :title="$t('stats.charts.occupancyRate.title')"
              :description="$t('stats.charts.occupancyRate.description')"
              :loading="analyticsStore.loading"
            >
              <BaseChart
                type="radialBar"
                :height="350"
                :series="[{ name: 'Occupation', data: [analyticsStore.occupancyRate] }]"
                :options="occupancyChartOptions"
                :loading="analyticsStore.loading"
              />
            </ChartCard>
          </div>

          <!-- Section détaillée des retards -->
          <div
            v-if="analyticsStore.latePayments > 0"
            class="bg-orange-50 border border-orange-200 rounded-lg p-6 animate-fade-in"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-orange-900 mb-2">
                  ⚠️ {{ $t('stats.alerts.latePayments.title') }}
                </h3>
                <p class="text-orange-700">
                  {{ $t('stats.alerts.latePayments.message', { count: analyticsStore.latePayments }) }}
                  <router-link
                    to="/paiements"
                    class="underline hover:no-underline font-medium ml-1"
                  >
                    {{ $t('stats.alerts.latePayments.link') }}
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Sidebar from '../components/Sidebar.vue'
import BaseChart from '../components/charts/BaseChart.vue'
import KpiCard from '../components/stats/KpiCard.vue'
import ChartCard from '../components/stats/ChartCard.vue'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { formatCurrency } from '@/utils/formatters'

const { t } = useI18n()
const analyticsStore = useAnalyticsStore()

// Options du graphique de taux d'occupation avec couleur verte MyBI
const occupancyChartOptions = computed(() => ({
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
          color: '#22c55e',
          formatter: (val) => `${val}%`
        }
      },
      track: {
        background: '#e5e7eb'
      }
    }
  },
  labels: [t('stats.charts.occupancyRate.label')],
  colors: ['#22c55e'],
  chart: {
    toolbar: {
      show: false
    }
  }
}))

// Options du graphique de revenus mensuels avec couleur verte MyBI
const revenueChartOptionsWithColors = computed(() => ({
  ...analyticsStore.revenueChartOptions,
  colors: ['#22c55e']
}))

// Options du graphique de revenus par bien avec couleur verte MyBI
const revenueByPropertyChartOptionsWithColors = computed(() => ({
  ...analyticsStore.revenueByPropertyChartOptions,
  colors: ['#22c55e']
}))

// Options du graphique de statut des paiements avec couleurs harmonisées
const paymentStatusChartOptionsWithColors = computed(() => ({
  ...analyticsStore.paymentStatusChartOptions,
  colors: ['#22c55e', '#fbbf24', '#ef4444'] // Vert (payé), Orange (en attente), Rouge (en retard)
}))

/**
 * Charge les statistiques au montage
 */
onMounted(async () => {
  await analyticsStore.fetchAnalytics()
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}

/* Supprime le titre du BaseChart puisqu'on utilise ChartCard */
:deep(.card h2) {
  display: none;
}
</style>
