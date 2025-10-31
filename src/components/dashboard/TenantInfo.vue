<template>
  <div v-if="tenant" class="tenant-info">
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <p class="text-xs text-gray-500 mb-1">Locataire</p>
        <p class="font-semibold text-gray-900">{{ tenant.name }}</p>
      </div>
      <span 
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="statusClass"
      >
        {{ statusText }}
      </span>
    </div>
    
    <div class="grid grid-cols-2 gap-3 text-sm">
      <div>
        <p class="text-xs text-gray-500 mb-1">Entrée</p>
        <p class="font-medium text-gray-900">{{ formatDate(tenant.entryDate, { shortMonth: true }) }}</p>
      </div>
      <div v-if="tenant.exitDate">
        <p class="text-xs text-gray-500 mb-1">Sortie</p>
        <p class="font-medium text-gray-900">{{ formatDate(tenant.exitDate, { shortMonth: true }) }}</p>
      </div>
      <div v-else>
        <p class="text-xs text-gray-500 mb-1">Sortie</p>
        <p class="font-medium text-gray-400">En cours</p>
      </div>
    </div>
  </div>
  
  <div v-else class="tenant-info">
    <p class="text-sm text-gray-500 italic">Aucun locataire</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate } from '@/utils/formatters'
import { PAYMENT_STATUS, STATUS_LABELS, STATUS_CLASSES } from '@/utils/constants'

const props = defineProps({
  tenant: {
    type: Object,
    default: null
  }
})

/**
 * Classe CSS selon le statut de paiement
 */
const statusClass = computed(() => {
  if (!props.tenant) return STATUS_CLASSES[PAYMENT_STATUS.PENDING]
  return STATUS_CLASSES[props.tenant.status] || STATUS_CLASSES[PAYMENT_STATUS.PENDING]
})

/**
 * Texte du statut de paiement
 */
const statusText = computed(() => {
  if (!props.tenant) return STATUS_LABELS[PAYMENT_STATUS.PENDING]
  return STATUS_LABELS[props.tenant.status] || STATUS_LABELS[PAYMENT_STATUS.PENDING]
})
</script>

<style scoped>
.tenant-info {
  @apply mt-4 pt-4 border-t border-gray-100;
}
</style>

