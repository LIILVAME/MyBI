<template>
  <div class="space-y-6">
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('settings.sections.theme') }}</h3>
      
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            v-for="themeOption in themeOptions"
            :key="themeOption.value"
            @click="selectTheme(themeOption.value)"
            :class="[
              'p-6 rounded-xl border-2 transition-all duration-200 text-left',
              localTheme === themeOption.value
                ? 'border-primary-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
            ]"
          >
            <div class="flex items-center mb-3">
              <div :class="[
                'w-4 h-4 rounded-full mr-3',
                localTheme === themeOption.value ? 'bg-primary-500' : 'bg-gray-300'
              ]"></div>
              <span class="font-medium text-gray-900">{{ themeOption.label }}</span>
            </div>
            <p class="text-xs text-gray-500">{{ themeOption.description }}</p>
          </button>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="saveTheme"
          :disabled="isSaving || localTheme === settingsStore.theme"
          class="btn-primary flex items-center"
        >
          <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? $t('settings.saving') : $t('common.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import { useToastStore } from '@/stores/toastStore'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const toastStore = useToastStore()

const isSaving = ref(false)
const localTheme = ref(settingsStore.theme)

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
    value: 'auto',
    label: t('settings.auto'),
    description: t('settings.themeAutoDescription')
  }
])

watch(() => settingsStore.theme, (newVal) => {
  localTheme.value = newVal
})

onMounted(() => {
  localTheme.value = settingsStore.theme
})

const selectTheme = (theme) => {
  localTheme.value = theme
}

const saveTheme = async () => {
  isSaving.value = true
  try {
    settingsStore.setTheme(localTheme.value)
    if (toastStore) {
      toastStore.success(t('settings.preferencesSaved'))
    }
  } catch (error) {
    console.error('Erreur:', error)
    if (toastStore) {
      toastStore.error('Erreur lors de la sauvegarde')
    }
  } finally {
    isSaving.value = false
  }
}
</script>

