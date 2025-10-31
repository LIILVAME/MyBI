<template>
  <router-view />
  <Toast />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import Toast from '@/components/common/Toast.vue'

/**
 * Initialise l'authentification au démarrage de l'application
 * - Restaure la session depuis Supabase si présente
 * - Initialise l'écouteur d'événements Supabase Auth
 */
onMounted(async () => {
  try {
  const authStore = useAuthStore()
  
  // Initialise l'écouteur d'événements Supabase (déconnexion automatique, refresh token, etc.)
  authStore.initAuthListener()
  
  // Restaure la session utilisateur si elle existe
  await authStore.fetchUser()
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'application:', error)
    // Ne pas bloquer le rendu même en cas d'erreur
  }
})
</script>

