<template>
  <div class="card cursor-pointer hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ property.name }}</h3>
        <p class="text-sm text-gray-500 mb-3">{{ property.city }}</p>
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="statusClass"
        >
          {{ statusText }}
        </span>
      </div>
      <!-- Indicateur de retard de paiement -->
      <div v-if="property.tenant && property.tenant.status === 'late'" class="relative">
        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Informations locatives -->
    <div class="mt-4">
      <div class="flex items-center justify-between mb-3">
        <p class="text-xs text-gray-500">Loyer mensuel</p>
        <p class="text-xl font-bold text-gray-900">{{ formatCurrency(property.rent) }}</p>
      </div>
      
      <!-- Informations locataire -->
      <TenantInfo :tenant="property.tenant" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TenantInfo from './dashboard/TenantInfo.vue'
import { formatCurrency } from '@/utils/formatters'
import { PROPERTY_STATUS, STATUS_LABELS, STATUS_CLASSES } from '@/utils/constants'

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

/**
 * Classe CSS selon le statut d'occupation
 */
const statusClass = computed(() => {
  return STATUS_CLASSES[props.property.status] || STATUS_CLASSES[PROPERTY_STATUS.VACANT]
})

/**
 * Texte du statut d'occupation
 */
const statusText = computed(() => {
  return STATUS_LABELS[props.property.status] || STATUS_LABELS[PROPERTY_STATUS.VACANT]
})
</script>

