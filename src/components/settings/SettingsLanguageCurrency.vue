<template>
  <div class="space-y-6">
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('settings.sections.languageCurrency') }}</h3>
      
      <div class="space-y-6">
        <!-- Langue -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('settings.language') }}
          </label>
          <select
            :value="settingsStore.language"
            @change="handleLanguageChange"
            class="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          >
            <option value="fr">🇫🇷 {{ $t('language.fr') }}</option>
            <option value="en">🇺🇸 {{ $t('language.en') }}</option>
          </select>
          <p class="text-xs text-gray-500 mt-2">{{ $t('settings.languageDescription') }}</p>
        </div>

        <!-- Devise -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('settings.currency') }}
          </label>
          <select
            v-model="localCurrency"
            @change="handleCurrencyChange"
            class="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          >
            <option value="EUR">{{ $t('currency.EUR') }}</option>
            <option value="USD">{{ $t('currency.USD') }}</option>
            <option value="GBP">{{ $t('currency.GBP') }}</option>
            <option value="XOF">{{ $t('currency.XOF') }}</option>
          </select>
          <p class="text-xs text-gray-500 mt-2">{{ $t('settings.currencyDescription') }}</p>
        </div>

        <!-- Aperçu en direct -->
        <div class="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm font-medium text-green-900 mb-2">{{ $t('settings.preview') }}</p>
          <p class="text-sm text-green-700">
            {{ $t('settings.previewExample') }}: <span class="font-semibold">{{ formatCurrency(1200) }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatCurrency } from '@/utils/formatters'

const { t } = useI18n()
const settingsStore = useSettingsStore()

const localCurrency = ref(settingsStore.currency)

watch(() => settingsStore.currency, (newVal) => {
  localCurrency.value = newVal
})

onMounted(() => {
  localCurrency.value = settingsStore.currency
})

const handleLanguageChange = (event) => {
  settingsStore.setLanguage(event.target.value)
}

const handleCurrencyChange = () => {
  settingsStore.setCurrency(localCurrency.value)
}
</script>

