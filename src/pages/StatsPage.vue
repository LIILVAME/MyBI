<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-7xl mx-auto px-6 pt-16 pb-8 md:px-10 md:pt-10 md:pb-10">
        <!-- En-tête avec barre verte -->
        <div class="mb-6 sm:mb-8 animate-fade-in">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">{{ $t('stats.title') }}</h1>
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
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
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
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 overflow-x-auto">
            <!-- Revenus mensuels -->
            <ChartCard
              :title="$t('stats.charts.monthlyRevenue.title')"
              :description="$t('stats.charts.monthlyRevenue.description')"
              :loading="analyticsStore.loading"
            >
              <BaseChart
                :show-title="false"
                type="bar"
                :height="chartHeight"
                :series="analyticsStore.revenueChartSeries"
                :options="revenueChartOptionsWithColorsMobile"
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
                :show-title="false"
                type="donut"
                :height="chartHeight"
                :series="analyticsStore.paymentStatusChartSeries"
                :options="paymentStatusChartOptionsWithColors"
                :loading="analyticsStore.loading"
              />
            </ChartCard>
          </div>

          <!-- Graphiques - Ligne 2 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 overflow-x-auto">
            <!-- Revenus par bien -->
            <ChartCard
              v-if="analyticsStore.revenueByProperty.length > 0"
              :title="$t('stats.charts.revenueByProperty.title')"
              :description="$t('stats.charts.revenueByProperty.description')"
              :loading="analyticsStore.loading"
            >
              <BaseChart
                :show-title="false"
                type="bar"
                :height="chartHeight"
                :series="analyticsStore.revenueByPropertyChartSeries"
                :options="revenueByPropertyChartOptionsWithColorsMobile"
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
                :show-title="false"
                type="radialBar"
                :height="chartHeight"
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
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Sidebar from '../components/Sidebar.vue'
import BaseChart from '../components/charts/BaseChart.vue'
import KpiCard from '../components/stats/KpiCard.vue'
import ChartCard from '../components/stats/ChartCard.vue'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatCurrency } from '@/utils/formatters'

const { t } = useI18n()
const analyticsStore = useAnalyticsStore()
const settingsStore = useSettingsStore()

// Hauteur dynamique des graphiques selon la taille d'écran
const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth < 640 : false)
const chartHeight = computed(() => isMobile.value ? 220 : 350)

const updateMobileStatus = () => {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  updateMobileStatus()
  window.addEventListener('resize', updateMobileStatus)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateMobileStatus)
})

// Options du graphique de taux d'occupation avec couleur verte Vylo
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

// Options du graphique de revenus mensuels (desktop)
const revenueChartOptionsWithColors = computed(() => ({
  ...analyticsStore.revenueChartOptions,
  colors: ['#22c55e'],
  chart: {
    type: 'bar',
    toolbar: {
      show: false
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    },
    sparkline: {
      enabled: false
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
      columnWidth: '60%',
      dataLabels: {
        position: 'top'
      },
      distributed: false,
      horizontal: false,
      barHeight: '100%',
      rangeBarOverlap: true,
      rangeBarGroupRows: false
    }
  },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: {
      fontSize: '12px',
      fontWeight: 600,
      colors: ['#059669']
    },
    formatter: (val) => {
      if (val === 0) return ''
      const currency = settingsStore.currency || 'EUR'
      const locale = currency === 'USD' ? 'en-US' : currency === 'GBP' ? 'en-GB' : 'fr-FR'
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(val)
    }
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 3,
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    },
    padding: {
      top: 0,
      right: 10,
      bottom: 0,
      left: 10
    }
  },
  tooltip: {
    theme: 'light',
    style: {
      fontSize: '13px',
      fontFamily: 'inherit'
    },
    x: {
      formatter: (val) => `Mois : ${val}`
    },
    y: {
      formatter: (val) => {
        const currency = settingsStore.currency || 'EUR'
        const locale = currency === 'USD' ? 'en-US' : currency === 'GBP' ? 'en-GB' : 'fr-FR'
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(val)
      },
      title: {
        formatter: () => 'Revenus'
      }
    },
    marker: {
      show: true
    },
    fixed: {
      enabled: false,
      position: 'topRight',
      offsetX: 0,
      offsetY: 0
    }
  },
  xaxis: {
    categories: analyticsStore.revenueChartOptions.xaxis?.categories || [],
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px',
        fontWeight: 500,
        fontFamily: 'inherit'
      },
      rotate: -45,
      rotateAlways: false,
      hideOverlappingLabels: true
    },
    axisBorder: {
      show: true,
      color: '#e5e7eb',
      height: 1,
      width: '100%',
      offsetX: 0,
      offsetY: 0
    },
    axisTicks: {
      show: true,
      color: '#e5e7eb',
      height: 6,
      offsetX: 0,
      offsetY: 0
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px',
        fontWeight: 500
      },
      formatter: (val) => {
        const currency = settingsStore.currency || 'EUR'
        const locale = currency === 'USD' ? 'en-US' : currency === 'GBP' ? 'en-GB' : 'fr-FR'
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          notation: 'compact',
          maximumFractionDigits: 0
        }).format(val)
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.3,
      gradientToColors: ['#16a34a'],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 0.8,
      stops: [0, 100],
      colorStops: [
        {
          offset: 0,
          color: '#22c55e',
          opacity: 1
        },
        {
          offset: 100,
          color: '#16a34a',
          opacity: 0.8
        }
      ]
    }
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['#16a34a']
  }
}))

// Options du graphique de revenus mensuels (mobile - labels cachés)
const revenueChartOptionsWithColorsMobile = computed(() => ({
  ...revenueChartOptionsWithColors.value,
  xaxis: {
    ...revenueChartOptionsWithColors.value.xaxis,
    labels: {
      ...revenueChartOptionsWithColors.value.xaxis?.labels,
      show: !isMobile.value
    }
  }
}))

// Options du graphique de revenus par bien améliorées (horizontal)
const revenueByPropertyChartOptionsWithColors = computed(() => ({
  ...analyticsStore.revenueByPropertyChartOptions,
  colors: ['#22c55e'],
  chart: {
    type: 'bar',
    toolbar: {
      show: false
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      borderRadiusApplication: 'end',
      horizontal: true,
      barHeight: '70%',
      dataLabels: {
        position: 'right'
      }
    }
  },
  dataLabels: {
    enabled: true,
    offsetX: 10,
    style: {
      fontSize: '12px',
      fontWeight: 600,
      colors: ['#059669']
    },
    formatter: (val) => {
      if (val === 0) return ''
      const currency = settingsStore.currency || 'EUR'
      const locale = currency === 'USD' ? 'en-US' : currency === 'GBP' ? 'en-GB' : 'fr-FR'
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(val)
    }
  },
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
        show: false
      }
    },
    padding: {
      top: 0,
      right: 10,
      bottom: 0,
      left: 10
    }
  },
  tooltip: {
    theme: 'light',
    style: {
      fontSize: '13px',
      fontFamily: 'inherit'
    },
    y: {
      formatter: (val, { dataPointIndex }) => {
        const property = analyticsStore.revenueByProperty[dataPointIndex]
        return property?.name || 'Bien'
      },
      title: {
        formatter: () => 'Bien'
      }
    },
    x: {
      formatter: (val) => {
        const currency = settingsStore.currency || 'EUR'
        const locale = currency === 'USD' ? 'en-US' : currency === 'GBP' ? 'en-GB' : 'fr-FR'
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(val)
      },
      title: {
        formatter: () => 'Revenus'
      }
    },
    marker: {
      show: true
    }
  },
  xaxis: {
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px',
        fontWeight: 500
      },
      formatter: (val) => {
        const currency = settingsStore.currency || 'EUR'
        const locale = currency === 'USD' ? 'en-US' : currency === 'GBP' ? 'en-GB' : 'fr-FR'
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          notation: 'compact',
          maximumFractionDigits: 0
        }).format(val)
      }
    },
    axisBorder: {
      show: true,
      color: '#e5e7eb',
      height: 1
    },
    axisTicks: {
      show: true,
      color: '#e5e7eb',
      height: 6
    }
  },
  yaxis: {
    categories: analyticsStore.revenueByPropertyChartOptions.xaxis?.categories || [],
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px',
        fontWeight: 500,
        fontFamily: 'inherit'
      },
      maxWidth: 120,
      trim: true
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'horizontal',
      shadeIntensity: 0.3,
      gradientToColors: ['#16a34a'],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 0.8,
      stops: [0, 100]
    }
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['#16a34a']
  }
}))

// Options du graphique de revenus par bien (mobile - labels cachés)
const revenueByPropertyChartOptionsWithColorsMobile = computed(() => ({
  ...revenueByPropertyChartOptionsWithColors.value,
  yaxis: {
    ...revenueByPropertyChartOptionsWithColors.value.yaxis,
    labels: {
      ...revenueByPropertyChartOptionsWithColors.value.yaxis?.labels,
      show: !isMobile.value
    }
  }
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
