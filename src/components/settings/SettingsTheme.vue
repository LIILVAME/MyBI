<template>
  <div class="space-y-6">
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('settings.sections.theme') }}</h3>
      
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            v-for="themeOption in themeOptions"
            :key="themeOption.value"
            @click="selectTheme(themeOption.value)"
            :class="[
              'p-6 rounded-xl border-2 transition-all duration-200 text-left relative',
              settingsStore.theme === themeOption.value
                ? 'border-primary-500 bg-green-50 dark:bg-green-900/20 dark:border-green-500'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md'
            ]"
          >
            <div class="flex items-center mb-3">
              <div :class="[
                'w-4 h-4 rounded-full mr-3 transition-colors',
                settingsStore.theme === themeOption.value 
                  ? 'bg-primary-500 ring-2 ring-primary-300 dark:ring-primary-600' 
                  : 'bg-gray-300 dark:bg-gray-600'
              ]"></div>
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ themeOption.label }}</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ themeOption.description }}</p>
            
            <!-- Indicateur de sélection -->
            <div
              v-if="settingsStore.theme === themeOption.value"
              class="absolute top-2 right-2"
            >
              <svg class="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import { useToastStore } from '@/stores/toastStore'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const toastStore = useToastStore()

const themeOptions = computed(() => [
  {
    value: 'light',
    label: t('settings.light'),
    description: t('settings.themeLightDescription')
  },
  {
    value: 'dark',
    label: t('settings.dark'),
    description: t('settings.themeDarkDescription')
  },
  {
    value: 'system',
    label: t('settings.auto'),
    description: t('settings.themeAutoDescription')
  }
])

const selectTheme = (theme) => {
  try {
    // Normalise 'auto' en 'system' pour la cohérence
    const normalizedTheme = theme === 'auto' ? 'system' : theme
    settingsStore.setTheme(normalizedTheme)
    
    if (toastStore) {
      toastStore.success(t('settings.preferencesSaved'))
    }
  } catch (error) {
    console.error('Erreur lors du changement de thème:', error)
    if (toastStore) {
      toastStore.error('Erreur lors du changement de thème')
    }
  }
}
</script>

