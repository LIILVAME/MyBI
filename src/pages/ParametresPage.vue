<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-5xl mx-auto px-6 pt-16 pb-8 md:px-10 md:pt-10 md:pb-10">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
          <p class="text-gray-600">Gérez vos préférences et informations personnelles</p>
        </div>

        <!-- Sections de paramètres -->
        <div class="space-y-6">
          <!-- Profil utilisateur -->
          <ProfileSettings />

          <!-- Préférences de l'application -->
          <AppPreferences />

          <!-- Sécurité et sauvegarde -->
          <SecuritySettings @change-password="handleChangePassword" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
import ProfileSettings from '../components/settings/ProfileSettings.vue'
import AppPreferences from '../components/settings/AppPreferences.vue'
import SecuritySettings from '../components/settings/SecuritySettings.vue'

/**
 * Gère le changement de mot de passe
 * TODO v0.2.0 : Ouvrir un modal de changement de mot de passe
 */
const handleChangePassword = () => {
  // TODO v0.2.0 : Implémenter le modal de changement de mot de passe
  // Exemple : ouvrir un modal ChangePasswordModal avec validation
  // const isPasswordModalOpen = ref(true)
  // const passwordModal = {
  //   currentPassword: '',
  //   newPassword: '',
  //   confirmPassword: ''
  // }
  // await apiService.changePassword(passwordModal)
}
</script>

