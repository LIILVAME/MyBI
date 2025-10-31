<template>
  <div class="card cursor-pointer hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ property.name }}</h3>
        <p class="text-sm text-gray-500 mb-3">{{ property.address }}</p>
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="statusClass"
        >
          {{ statusText }}
        </span>
      </div>
      <div v-if="property.alerts > 0" class="relative">
        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
          {{ property.alerts }}
        </span>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-4 mt-4">
      <div>
        <p class="text-xs text-gray-500 mb-1">Température</p>
        <p class="text-lg font-semibold text-gray-900">{{ property.temperature }}°C</p>
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1">Humidité</p>
        <p class="text-lg font-semibold text-gray-900">{{ property.humidity }}%</p>
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1">Qualité air</p>
        <p class="text-lg font-semibold text-gray-900">{{ property.airQuality }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1">Énergie</p>
        <p class="text-lg font-semibold text-gray-900">{{ property.energyConsumption }} kWh</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const statusClass = computed(() => {
  return props.property.status === 'occupied' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-gray-100 text-gray-800'
})

const statusText = computed(() => {
  return props.property.status === 'occupied' ? 'Occupé' : 'Libre'
})
</script>

