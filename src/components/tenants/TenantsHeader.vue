<template>
  <div class="mb-8">
    <!-- Titre et bouton -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Gestion des locataires</h1>
        <p class="text-gray-600">Vue d'ensemble de tous les locataires actifs</p>
      </div>
      <button 
        @click="$emit('add-tenant')"
        class="btn-primary flex items-center justify-center shrink-0"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un locataire
      </button>
    </div>

    <!-- Statistiques globales -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Total -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 mb-1">Total</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalTenants }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- À jour -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 mb-1">À jour</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.onTimeTenants }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- En retard -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 mb-1">En retard</p>
            <p class="text-2xl font-bold text-red-600">{{ stats.lateTenants }}</p>
          </div>
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Loyers totaux -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 mb-1">Loyers totaux</p>
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
      totalTenants: 0,
      onTimeTenants: 0,
      lateTenants: 0,
      totalRent: 0
    })
  }
})

defineEmits(['add-tenant'])
</script>

