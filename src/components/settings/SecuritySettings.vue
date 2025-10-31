<template>
  <SettingsSection title="Sécurité et sauvegarde">
    <div class="space-y-6">
      <!-- Sauvegarde -->
      <div class="border-b border-gray-100 pb-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Sauvegarde des données</h3>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-gray-900">Dernière sauvegarde</p>
              <p class="text-xs text-gray-500 mt-1">
                {{ lastBackup }}
              </p>
            </div>
            <button
              @click="handleBackup"
              :disabled="isBackingUp"
              class="btn-secondary flex items-center"
            >
              <svg v-if="isBackingUp" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {{ isBackingUp ? 'Sauvegarde...' : 'Sauvegarder maintenant' }}
            </button>
          </div>
          
          <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <input
              v-model="autoBackup"
              type="checkbox"
              id="auto-backup"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label for="auto-backup" class="flex-1 cursor-pointer">
              <span class="text-sm font-medium text-gray-900 block">Sauvegarde automatique</span>
              <span class="text-xs text-gray-500">Sauvegarde automatique toutes les 24 heures</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Mot de passe -->
      <div class="border-b border-gray-100 pb-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Sécurité du compte</h3>
        
        <button
          @click="$emit('change-password')"
          class="btn-secondary flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Changer le mot de passe
        </button>
      </div>

      <!-- Actions dangereuses -->
      <div>
        <h3 class="text-sm font-semibold text-red-600 mb-3">Zone de danger</h3>
        
        <div class="space-y-3">
          <button
            @click="handleResetSettings"
            class="w-full px-4 py-3 text-left bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors group"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-red-900">Réinitialiser les paramètres</p>
                <p class="text-xs text-red-700 mt-1">Restaure tous les paramètres par défaut</p>
              </div>
              <svg class="w-5 h-5 text-red-600 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </button>

          <button
            @click="handleDeleteAccount"
            class="w-full px-4 py-3 text-left bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors group"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-red-900">Supprimer le compte</p>
                <p class="text-xs text-red-700 mt-1">Cette action est irréversible</p>
              </div>
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatDate } from '@/utils/formatters'
import SettingsSection from './SettingsSection.vue'

defineEmits(['change-password'])

const isBackingUp = ref(false)
const autoBackup = ref(false)

/**
 * Date de dernière sauvegarde (mock)
 */
const lastBackup = computed(() => {
  const date = new Date()
  return formatDate(date.toISOString(), { shortMonth: true }) + ' à ' + 
         date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
})

/**
 * Gère la sauvegarde manuelle
 * TODO v0.2.0 : Implémenter la sauvegarde réelle (export JSON, API, etc.)
 */
const handleBackup = async () => {
  isBackingUp.value = true
  
  // Simule une sauvegarde
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  isBackingUp.value = false
  
  // TODO v0.2.0 : Implémenter l'export des données
  // const data = {
  //   properties: propertiesStore.properties,
  //   payments: paymentsStore.payments,
  //   tenants: tenantsStore.tenants,
  //   settings: settingsStore.preferences
  // }
  // downloadJSON(data, `mybi-backup-${Date.now()}.json`)
  
  // TODO v0.2.0 : Remplacer par notification toast
  // showToast('Sauvegarde effectuée avec succès !', { type: 'success' })
  console.log('✅ Sauvegarde effectuée (mock)')
}

/**
 * Réinitialise les paramètres
 * TODO v0.2.0 : Confirmation modal + réinitialisation réelle
 */
const handleResetSettings = () => {
  // TODO v0.2.0 : Remplacer par modal de confirmation
  if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.')) {
    // TODO v0.2.0 : Réinitialiser les stores et localStorage
    // settingsStore.resetToDefaults()
    // localStorage.clear()
    // showToast('Paramètres réinitialisés', { type: 'success' })
    console.log('⚠️ Paramètres réinitialisés (mock)')
  }
}

/**
 * Supprime le compte
 * TODO v0.2.0 : Confirmation modal + appel API
 */
const handleDeleteAccount = () => {
  // TODO v0.2.0 : Remplacer par modal de confirmation avec saisie du mot de passe
  if (window.confirm('Êtes-vous absolument sûr de vouloir supprimer votre compte ? Toutes vos données seront définitivement perdues. Cette action est irréversible.')) {
    // TODO v0.2.0 : Appeler l'API pour supprimer le compte
    // await userStore.deleteAccount()
    // router.push('/login')
    console.log('⚠️ Compte supprimé (mock)')
  }
}
</script>

