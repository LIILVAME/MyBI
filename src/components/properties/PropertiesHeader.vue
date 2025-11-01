<template>
  <div class="mb-8">
    <!-- Titre et bouton -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">{{ $t('properties.myProperties') }}</h1>
        <p class="text-gray-600">{{ $t('properties.subtitle') }}</p>
      </div>
      <button 
        @click="$emit('add-property')"
        class="btn-primary flex items-center justify-center shrink-0"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ $t('properties.addProperty') }}
      </button>
    </div>

    <!-- Statistiques globales -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Total -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 mb-1">{{ $t('common.all') }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalProperties }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Occupés -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 mb-1">{{ $t('properties.occupied') }}</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.occupiedProperties }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Libres -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 mb-1">{{ $t('properties.free') }}</p>
            <p class="text-2xl font-bold text-gray-600">{{ stats.vacantProperties }}</p>
          </div>
          <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Loyers totaux -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 mb-1">{{ $t('dashboard.monthlyRent') }}</p>
            <p class="text-xl font-bold text-gray-900">{{ formatCurrency(stats.totalRent) }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9.001 9.001 0 11-18 0 9.001 9.001 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatters'

defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      totalProperties: 0,
      occupiedProperties: 0,
      vacantProperties: 0,
      totalRent: 0
    })
  }
})

defineEmits(['add-property'])
</script>

