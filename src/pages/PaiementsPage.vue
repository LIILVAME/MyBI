<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-7xl mx-auto px-6 pt-16 pb-8 md:px-10 md:pt-10 md:pb-10">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Suivi des paiements</h1>
              <p class="text-gray-600">Gérez tous vos paiements locatifs en un seul endroit</p>
            </div>
            <button
              @click="isModalOpen = true"
              class="btn-primary flex items-center justify-center shrink-0"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un paiement
            </button>
          </div>
        </div>

        <!-- Résumé des paiements -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">À venir</p>
                <p class="text-2xl font-bold text-gray-900">{{ pendingPayments.length }}</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">En retard</p>
                <p class="text-2xl font-bold text-red-600">{{ latePayments.length }}</p>
              </div>
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">Payés ce mois</p>
                <p class="text-2xl font-bold text-green-600">{{ paidPayments.length }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

                <!-- État de chargement -->
                <div v-if="paymentsStore.loading && paymentsStore.payments.length === 0" class="text-center py-16">
                  <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                  <p class="text-gray-500">Chargement des paiements...</p>
                </div>
                
                <!-- Loader inline si données déjà chargées -->
                <div v-else-if="paymentsStore.loading" class="text-center py-8">
                  <InlineLoader />
                </div>

                <!-- Erreur -->
                <div v-else-if="paymentsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-red-700 font-medium">Erreur : {{ paymentsStore.error }}</p>
                  </div>
                </div>

                <!-- Liste complète des paiements -->
                <PaymentsSection v-else :payments="payments" :show-view-all="false" />
      </div>
    </main>

    <!-- Modal d'ajout de paiement -->
    <AddPaymentModal
      :isOpen="isModalOpen"
      @close="isModalOpen = false"
      @submit="handleAddPayment"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import PaymentsSection from '../components/dashboard/PaymentsSection.vue'
import AddPaymentModal from '../components/payments/AddPaymentModal.vue'
import InlineLoader from '../components/common/InlineLoader.vue'
import { usePaymentsStore } from '@/stores/paymentsStore'
import { TRANSACTION_STATUS } from '@/utils/constants'

const paymentsStore = usePaymentsStore()

/**
 * Charge les paiements depuis Supabase au montage
 * Initialise le temps réel pour les mises à jour automatiques
 */
onMounted(async () => {
  await paymentsStore.fetchPayments()
  paymentsStore.initRealtime()
})

/**
 * Arrête le temps réel au démontage (optionnel)
 */
onUnmounted(() => {
  // paymentsStore.stopRealtime() // Décommenter si nécessaire
})

// Utilise les paiements du store Pinia (synchronisé avec DashboardPage)
const payments = computed(() => paymentsStore.payments)

// État du modal
const isModalOpen = ref(false)

/**
 * Paiements en attente
 */
const pendingPayments = computed(() => {
  return paymentsStore.pendingPayments
})

/**
 * Paiements en retard
 */
const latePayments = computed(() => {
  return paymentsStore.latePayments
})

/**
 * Paiements effectués
 */
const paidPayments = computed(() => {
  return paymentsStore.paidPayments
})

        /**
         * Gère l'ajout d'un nouveau paiement via le store Pinia (Supabase)
         */
        const handleAddPayment = async (newPayment) => {
          try {
            await paymentsStore.addPayment(newPayment)
            isModalOpen.value = false
            // Le toast est géré dans le store
          } catch (error) {
            // Le toast d'erreur est géré dans le store
            console.error('Erreur lors de l\'ajout du paiement:', error)
          }
        }
</script>

