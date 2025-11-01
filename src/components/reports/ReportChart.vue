<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h3>
      <p class="text-sm text-gray-600">{{ description }}</p>
    </div>
    
    <div class="bg-gray-50 rounded-lg p-3">
      <BaseChart
        :type="chartType"
        :series="series"
        :options="chartOptions"
        :show-title="false"
      />
    </div>
  </div>
</template>

<script setup>
import BaseChart from '@/components/charts/BaseChart.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  chartType: {
    type: String,
    default: 'bar'
  },
  series: {
    type: Array,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({})
  }
})
</script>

