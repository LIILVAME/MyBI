<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-7xl mx-auto px-6 pt-16 pb-8 md:px-10 md:pt-10 md:pb-10">
        <!-- Header avec statistiques -->
        <TenantsHeader 
          :stats="stats"
          @add-tenant="isModalOpen = true"
        />

        <!-- Filtres -->
        <div class="mb-6 flex flex-wrap items-center gap-4">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors text-sm',
              activeFilter === filter.value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>

        <!-- État de chargement -->
        <div v-if="propertiesStore.loading && tenants.length === 0" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p class="text-gray-500">{{ $t('tenants.loading') }}</p>
        </div>
        
        <!-- Loader inline si données déjà chargées -->
        <div v-else-if="propertiesStore.loading" class="text-center py-8">
          <InlineLoader />
        </div>
        
        <!-- Liste des locataires -->
        <TenantsList
          v-else
          :tenants="filteredTenants"
          :has-filters="hasActiveFilters"
          @edit-tenant="handleEditTenant"
          @delete-tenant="handleDeleteTenant"
          @clear-filters="clearFilters"
        />
      </div>
    </main>

    <!-- Modal d'ajout de locataire -->
    <AddTenantModal
      :isOpen="isModalOpen"
      @close="isModalOpen = false"
      @submit="handleAddTenant"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/composables/useLingui'
import Sidebar from '../components/Sidebar.vue'
import TenantsHeader from '../components/tenants/TenantsHeader.vue'
import TenantsList from '../components/tenants/TenantsList.vue'
import AddTenantModal from '../components/tenants/AddTenantModal.vue'
import InlineLoader from '../components/common/InlineLoader.vue'
import { useTenantsStore } from '@/stores/tenantsStore'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { PAYMENT_STATUS } from '@/utils/constants'

const { t } = useI18n()
const tenantsStore = useTenantsStore()
const propertiesStore = usePropertiesStore()

/**
 * Charge les propriétés depuis Supabase au montage (les locataires sont dérivés des propriétés)
 * Initialise le temps réel pour les mises à jour automatiques
 */
onMounted(async () => {
  await propertiesStore.fetchProperties()
  propertiesStore.initRealtime() // Les locataires suivent les changements de propriétés
})

/**
 * Arrête le temps réel au démontage (optionnel)
 */
onUnmounted(() => {
  // propertiesStore.stopRealtime()
})

// Utilise les locataires du store Pinia (synchronisé avec propertiesStore)
const tenants = computed(() => tenantsStore.tenants)

// État local pour filtres et modal
const activeFilter = ref('all')
const isModalOpen = ref(false)

/**
 * Statistiques globales depuis le store
 */
const stats = computed(() => ({
  totalTenants: tenants.value.length,
  onTimeTenants: tenantsStore.onTimeTenants.length,
  lateTenants: tenantsStore.lateTenants.length,
  totalRent: tenantsStore.totalTenantsRent
}))

/**
 * Filtres disponibles
 */
const filters = computed(() => [
  { label: t('common.all'), value: 'all' },
  { label: t('status.onTime'), value: PAYMENT_STATUS.ON_TIME },
  { label: t('status.late'), value: PAYMENT_STATUS.LATE }
])

/**
 * Vérifie si des filtres sont actifs
 */
const hasActiveFilters = computed(() => {
  return activeFilter.value !== 'all'
})

/**
 * Filtre les locataires selon le filtre actif
 */
const filteredTenants = computed(() => {
  if (activeFilter.value === 'all') {
    return tenants.value
  }
  return tenants.value.filter(tenant => tenant.status === activeFilter.value)
})

/**
 * Réinitialise tous les filtres
 */
const clearFilters = () => {
  activeFilter.value = 'all'
}

/**
 * Gère l'ajout d'un nouveau locataire via le store Pinia (Supabase)
 */
        const handleAddTenant = async (newTenant) => {
          try {
            const result = await tenantsStore.addTenant(newTenant)
            isModalOpen.value = false
            // Le toast est géré dans le store
          } catch (error) {
            // Le toast d'erreur est géré dans le store
            console.error('Erreur lors de l\'ajout du locataire:', error)
          }
        }

/**
 * Gère l'édition d'un locataire
 * TODO v0.2.0 : Ouvrir un modal d'édition ou rediriger vers une page de détail
 */
const handleEditTenant = (tenant) => {
  // TODO v0.2.0 : Implémenter l'édition
  // Exemple : ouvrir un modal EditTenantModal avec les données du locataire
  // const isEditModalOpen = ref(true)
  // const selectedTenant = ref(tenant)
}

        /**
         * Gère la suppression d'un locataire (libère le bien) via Supabase
         * TODO v0.2.0 : Utiliser un composant de confirmation (modal) au lieu de confirm()
         */
        const handleDeleteTenant = async (tenantId) => {
          if (window.confirm('Êtes-vous sûr de vouloir supprimer ce locataire ? Le bien sera libéré.')) {
            try {
              await tenantsStore.removeTenant(tenantId)
              // Le toast est géré dans le store
            } catch (error) {
              // Le toast d'erreur est géré dans le store
              console.error('Erreur lors de la suppression du locataire:', error)
            }
          }
        }
</script>

