<template>
  <!-- Loader global pendant l'initialisation de la session -->
  <div v-if="authStore.loadingSession" class="flex justify-center items-center min-h-screen bg-gray-50">
    <div class="text-center">
      <div class="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement de l'application...</p>
    </div>
  </div>

  <!-- Application normale une fois la session initialisée -->
  <router-view v-else />
  <Toast />
</template>

<script setup>
import { onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/authStore'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { usePaymentsStore } from '@/stores/paymentsStore'
import Toast from '@/components/common/Toast.vue'

const authStore = useAuthStore()
const propertiesStore = usePropertiesStore()
const paymentsStore = usePaymentsStore()

/**
 * Initialise l'application de manière centralisée
 * - Étape 1 : Restaure la session Supabase
 * - Étape 2 : Charge les données si utilisateur connecté
 * - Étape 3 : Configure l'écouteur d'événements auth
 */
onMounted(async () => {
  try {
    // Étape 1 — Restaurer la session Supabase
    await authStore.initSession()

    // Étape 2 — Si session active, charger les données des stores
    if (authStore.user) {
      await Promise.all([
        propertiesStore.fetchProperties(),
        paymentsStore.fetchPayments()
      ])

      // Initialise le realtime après avoir chargé les données
      propertiesStore.initRealtime()
      paymentsStore.initRealtime()
    }

    // Étape 3 — Surveiller les changements de session (login, logout, token refresh)
    supabase.auth.onAuthStateChange(async (event, session) => {
      authStore.user = session?.user ?? null
      authStore.session = session

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Connexion ou rafraîchissement de token
        if (session?.user) {
          // Charge le profil après connexion
          try {
            await authStore.fetchProfile()
          } catch (err) {
            console.warn('Impossible de charger le profil après connexion (non bloquant):', err)
          }

          // Charge les données des stores
          await Promise.all([
            propertiesStore.fetchProperties(),
            paymentsStore.fetchPayments()
          ])

          // Réactive le realtime
          propertiesStore.initRealtime()
          paymentsStore.initRealtime()
        }
      } else if (event === 'SIGNED_OUT') {
        // Déconnexion : nettoie tous les stores
        try {
          // Arrête le realtime en premier
          propertiesStore.stopRealtime()
          paymentsStore.stopRealtime()

          // Réinitialise tous les stores (déjà fait dans logout(), mais on s'assure ici aussi)
          try {
            const { useTenantsStore } = await import('@/stores/tenantsStore')
            const { useAlertsStore } = await import('@/stores/alertsStore')
            const { useAnalyticsStore } = await import('@/stores/analyticsStore')
            const { useReportsStore } = await import('@/stores/reportsStore')
            
            const tenantsStore = useTenantsStore()
            const alertsStore = useAlertsStore()
            const analyticsStore = useAnalyticsStore()
            const reportsStore = useReportsStore()
            
            propertiesStore.$reset()
            paymentsStore.$reset()
            tenantsStore.$reset()
            alertsStore.$reset()
            analyticsStore.$reset()
            reportsStore.$reset()
          } catch (resetError) {
            // Si certains stores n'existent pas, continue quand même
            console.warn('Erreur lors de la réinitialisation des stores (non bloquant):', resetError)
          }

          // Réinitialise le profil
          authStore.profile = null
        } catch (err) {
          console.warn('Erreur lors du nettoyage après SIGNED_OUT (non bloquant):', err)
        }
      }
    })

    // Initialise aussi l'écouteur legacy pour compatibilité
    authStore.initAuthListener()
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'application:', error)
    // Ne pas bloquer le rendu même en cas d'erreur
    authStore.loadingSession = false
  }
})
</script>

