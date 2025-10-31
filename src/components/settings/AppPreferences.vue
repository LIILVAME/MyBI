<template>
  <SettingsSection title="Préférences de l'application">
    <form @submit.prevent="savePreferences" class="space-y-6">
      <!-- Thème -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Thème
        </label>
        <select
          v-model="preferences.theme"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
        >
          <option value="light">Clair</option>
          <option value="dark">Sombre</option>
          <option value="auto">Automatique (système)</option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Choisissez le thème d'affichage de l'application</p>
      </div>

      <!-- Devise -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Devise principale
        </label>
        <select
          v-model="preferences.currency"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
        >
          <option value="EUR">€ Euro (EUR)</option>
          <option value="USD">$ Dollar US (USD)</option>
          <option value="GBP">£ Livre Sterling (GBP)</option>
          <option value="CHF">₣ Franc Suisse (CHF)</option>
        </select>
      </div>

      <!-- Langue -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Langue de l'interface
        </label>
        <select
          v-model="preferences.language"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      <!-- Seuil d'alerte -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Seuil d'alerte de retard de paiement (jours)
        </label>
        <input
          v-model.number="preferences.alertThreshold"
          type="number"
          min="0"
          max="30"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          placeholder="5"
        />
        <p class="text-xs text-gray-500 mt-1">Nombre de jours après l'échéance avant d'envoyer une alerte</p>
      </div>

      <!-- Notifications -->
      <div class="border-t border-gray-100 pt-4">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Notifications</h3>
        
        <div class="space-y-3">
          <label class="flex items-center cursor-pointer group">
            <input
              v-model="preferences.notifications.email"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span class="ml-3 text-sm text-gray-700 group-hover:text-gray-900">Recevoir les notifications par email</span>
          </label>

          <label class="flex items-center cursor-pointer group">
            <input
              v-model="preferences.notifications.payments"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span class="ml-3 text-sm text-gray-700 group-hover:text-gray-900">Alertes de paiements en retard</span>
          </label>

          <label class="flex items-center cursor-pointer group">
            <input
              v-model="preferences.notifications.reminders"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span class="ml-3 text-sm text-gray-700 group-hover:text-gray-900">Rappels de paiements à venir</span>
          </label>

          <label class="flex items-center cursor-pointer group">
            <input
              v-model="preferences.notifications.maintenance"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span class="ml-3 text-sm text-gray-700 group-hover:text-gray-900">Notifications de maintenance des biens</span>
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          :disabled="isSaving"
          class="btn-primary flex items-center"
        >
          <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? 'Sauvegarde...' : 'Enregistrer les préférences' }}
        </button>
      </div>
    </form>
  </SettingsSection>
</template>

<script setup>
import { ref } from 'vue'
import SettingsSection from './SettingsSection.vue'

const isSaving = ref(false)

const preferences = ref({
  theme: 'light',
  currency: 'EUR',
  language: 'fr',
  alertThreshold: 5,
  notifications: {
    email: true,
    payments: true,
    reminders: false,
    maintenance: false
  }
})

/**
 * Sauvegarde les préférences
 * TODO v0.2.0 : Relier au store settings + localStorage + backend API
 */
const savePreferences = async () => {
  isSaving.value = true
  
  // Simule une sauvegarde
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  isSaving.value = false
  
  // TODO v0.2.0 : Persister dans localStorage
  // localStorage.setItem('appPreferences', JSON.stringify(preferences.value))
  
  // TODO v0.2.0 : Appeler l'API pour sauvegarder les préférences
  // await settingsStore.updatePreferences(preferences.value)
  
  // TODO v0.2.0 : Appliquer le thème si changé
  // if (preferences.value.theme !== 'auto') {
  //   applyTheme(preferences.value.theme)
  // }
  
  // Version temporaire v0.1.0
  console.log('✅ Préférences sauvegardées (mock):', preferences.value)
  
  // TODO v0.2.0 : Remplacer par notification toast
  // showToast('Préférences enregistrées avec succès !', { type: 'success' })
}
</script>

