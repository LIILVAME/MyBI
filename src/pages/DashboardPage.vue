<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <div class="flex-1 ml-64">
      <div class="p-8">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p class="text-gray-600">Vue d'ensemble de vos biens immobiliers</p>
        </div>

        <!-- Global Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            :value="`${globalStats.averageTemp}°C`"
            label="Température moyenne"
            :icon="TempIcon"
            trend="+0.5°C"
          />
          <StatCard
            :value="`${globalStats.averageHumidity}%`"
            label="Humidité moyenne"
            :icon="HumidityIcon"
            trend="-2%"
            icon-bg-class="bg-blue-100"
            icon-color-class="text-blue-600"
          />
          <StatCard
            :value="globalStats.airQuality"
            label="Qualité de l'air"
            :icon="AirIcon"
            icon-bg-class="bg-purple-100"
            icon-color-class="text-purple-600"
          />
          <StatCard
            :value="`${globalStats.totalEnergy} kWh`"
            label="Consommation totale"
            :icon="EnergyIcon"
            trend="-5%"
            icon-bg-class="bg-yellow-100"
            icon-color-class="text-yellow-600"
          />
        </div>

        <!-- Properties Grid -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Mes biens immobiliers</h3>
            <button class="btn-primary flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un bien
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertyCard
              v-for="property in properties"
              :key="property.id"
              :property="property"
            />
          </div>
        </div>

        <!-- Payments & Security Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Upcoming Payments -->
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900">Paiements à venir</h3>
              <a href="#" class="text-sm text-primary-600 hover:text-primary-700">Voir tout</a>
            </div>
            <div class="space-y-4">
              <div
                v-for="payment in payments"
                :key="payment.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p class="font-semibold text-gray-900">{{ payment.property }}</p>
                  <p class="text-sm text-gray-500">{{ payment.tenant }}</p>
                  <p class="text-xs text-gray-400 mt-1">Échéance: {{ formatDate(payment.dueDate) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-gray-900">{{ payment.amount }}€</p>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    En attente
                  </span>
                </div>
              </div>
              <div v-if="payments.length === 0" class="text-center py-8 text-gray-500">
                Aucun paiement à venir
              </div>
            </div>
          </div>

          <!-- Security / Cameras -->
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900">Sécurité</h3>
              <a href="#" class="text-sm text-primary-600 hover:text-primary-700">Voir tout</a>
            </div>
            <div class="space-y-4">
              <div class="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center text-white">
                    <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p class="text-sm opacity-75">Aperçu caméra</p>
                  </div>
                </div>
                <div class="absolute top-2 right-2">
                  <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500 text-white">
                    En ligne
                  </span>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div class="aspect-video bg-gray-200 rounded flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="aspect-video bg-gray-200 rounded flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="aspect-video bg-gray-200 rounded flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div class="pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Caméras actives</span>
                  <span class="font-semibold text-gray-900">4/4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import StatCard from '../components/StatCard.vue'
import PropertyCard from '../components/PropertyCard.vue'
import { mockProperties, mockPayments, mockGlobalStats } from '../data/mockData'

const properties = ref(mockProperties)
const payments = ref(mockPayments)
const globalStats = ref(mockGlobalStats)

// Icônes pour les stats en tant que composants fonctionnels
const TempIcon = () => h('svg', { 
  fill: 'none', 
  stroke: 'currentColor', 
  viewBox: '0 0 24 24',
  class: 'w-full h-full'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
  })
])

const HumidityIcon = () => h('svg', { 
  fill: 'none', 
  stroke: 'currentColor', 
  viewBox: '0 0 24 24',
  class: 'w-full h-full'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z'
  })
])

const AirIcon = () => h('svg', { 
  fill: 'none', 
  stroke: 'currentColor', 
  viewBox: '0 0 24 24',
  class: 'w-full h-full'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343 5.657l-.707-.707m2.828-9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  })
])

const EnergyIcon = () => h('svg', { 
  fill: 'none', 
  stroke: 'currentColor', 
  viewBox: '0 0 24 24',
  class: 'w-full h-full'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M13 10V3L4 14h7v7l9-11h-7z'
  })
])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 1024px) {
  .ml-64 {
    margin-left: 0;
  }
  
  /* Sidebar devient un overlay sur mobile */
  aside {
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }
}
</style>

