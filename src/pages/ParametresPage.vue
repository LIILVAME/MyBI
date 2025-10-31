<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar principale -->
    <Sidebar />
    
    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div class="flex h-full">
        <!-- Sous-sidebar de navigation (desktop) -->
        <aside class="hidden md:block w-64 shrink-0">
          <SettingsSidebar 
            :active-section="activeSection" 
            @change-section="activeSection = $event"
          />
        </aside>

        <!-- Menu déroulant (mobile) -->
        <div class="md:hidden w-full">
          <div class="bg-white border-b border-gray-200 px-6 py-4">
            <select
              :value="activeSection"
              @change="activeSection = $event.target.value"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="general">{{ $t('settings.sections.general') }}</option>
              <option value="notifications">{{ $t('settings.sections.notifications') }}</option>
              <option value="security">{{ $t('settings.sections.security') }}</option>
              <option value="language-currency">{{ $t('settings.sections.languageCurrency') }}</option>
              <option value="theme">{{ $t('settings.sections.theme') }}</option>
              <option value="integrations">{{ $t('settings.sections.integrations') }}</option>
            </select>
          </div>
        </div>

        <!-- Zone de contenu -->
        <div class="flex-1 overflow-y-auto">
          <div class="max-w-4xl mx-auto px-6 pt-16 pb-8 md:px-10 md:pt-10 md:pb-10">
            <!-- Header -->
            <div class="mb-8">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('settings.title') }}</h1>
              <p class="text-gray-600">{{ $t('settings.subtitle') }}</p>
            </div>

            <!-- Contenu dynamique selon la section active -->
            <Transition
              name="fade"
              mode="out-in"
            >
              <component
                :is="activeComponent"
                :key="activeSection"
                class="transition-all duration-200"
              />
            </Transition>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onErrorCaptured } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import SettingsSidebar from '../components/settings/SettingsSidebar.vue'
import SettingsGeneral from '../components/settings/SettingsGeneral.vue'
import SettingsNotifications from '../components/settings/SettingsNotifications.vue'
import SettingsSecurity from '../components/settings/SettingsSecurity.vue'
import SettingsLanguageCurrency from '../components/settings/SettingsLanguageCurrency.vue'
import SettingsTheme from '../components/settings/SettingsTheme.vue'
import SettingsIntegrations from '../components/settings/SettingsIntegrations.vue'

// Capture les erreurs pour éviter que la page ne crash complètement
onErrorCaptured((err, instance, info) => {
  console.error('Erreur dans ParametresPage:', err, info)
  return false
})

const activeSection = ref('general')

const activeComponent = computed(() => {
  const components = {
    'general': SettingsGeneral,
    'notifications': SettingsNotifications,
    'security': SettingsSecurity,
    'language-currency': SettingsLanguageCurrency,
    'theme': SettingsTheme,
    'integrations': SettingsIntegrations
  }
  return components[activeSection.value] || SettingsGeneral
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
