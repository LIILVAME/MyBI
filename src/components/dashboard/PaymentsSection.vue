<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-900">Paiements</h3>
      <router-link 
        v-if="showViewAllLink"
        to="/paiements" 
        class="text-sm text-primary-600 hover:text-primary-700"
      >
        Voir tout
      </router-link>
    </div>
    
    <div v-if="payments.length === 0" class="text-center py-8 text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9.001 9.001 0 11-18 0 9.001 9.001 0 0118 0z" />
      </svg>
      <p>Aucun paiement enregistré</p>
    </div>
    
    <div v-else class="space-y-3">
      <div
        v-for="payment in payments"
        :key="payment.id"
        class="relative flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div class="flex-1">
          <p class="font-semibold text-gray-900">{{ payment.tenant }}</p>
          <p class="text-sm text-gray-600">{{ payment.property }}</p>
          <p class="text-xs text-gray-500 mt-1">Échéance: {{ formatDate(payment.dueDate, { shortMonth: false }) }}</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-lg font-bold text-gray-900 mb-1">{{ formatCurrency(payment.amount) }}</p>
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusClass(payment.status)"
            >
              {{ getStatusText(payment.status) }}
            </span>
          </div>
          <!-- Bouton d'actions pour télécharger la facture -->
          <div class="flex-shrink-0">
            <PaymentActions :payment="payment" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { TRANSACTION_STATUS, STATUS_LABELS, STATUS_CLASSES } from '@/utils/constants'
import { useRoute } from 'vue-router'
import PaymentActions from '@/components/payments/PaymentActions.vue'

const route = useRoute()

const props = defineProps({
  payments: {
    type: Array,
    required: true
  },
  showViewAll: {
    type: Boolean,
    default: true
  }
})

/**
 * Affiche le lien "Voir tout" seulement si on n'est pas déjà sur la page paiements
 */
const showViewAllLink = computed(() => {
  return props.showViewAll && route.path !== '/paiements'
})

/**
 * Classe CSS selon le statut de paiement
 */
const getStatusClass = (status) => {
  return STATUS_CLASSES[status] || STATUS_CLASSES[TRANSACTION_STATUS.PENDING]
}

/**
 * Texte du statut de paiement
 */
const getStatusText = (status) => {
  return STATUS_LABELS[status] || 'Inconnu'
}
</script>

