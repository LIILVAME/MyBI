import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import persistedState from '@/plugins/piniaPersistedState'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

// Ajoute le plugin de persistance Pinia
pinia.use(persistedState)

app.use(pinia)
app.use(router)
app.use(i18n)

// Gestion d'erreur globale pour éviter l'écran blanc
app.config.errorHandler = (err, instance, info) => {
  console.error('Erreur Vue globale:', err, info)
  // Ne pas bloquer le rendu
}

app.mount('#app')

// Initialise la langue et le thème depuis le store settings après le montage de Pinia
// Utilise nextTick pour s'assurer que Pinia est complètement initialisé
nextTick(() => {
  try {
    const settingsStore = useSettingsStore()
    
    // Initialise la langue
    if (i18n.global.locale.value !== settingsStore.language) {
      i18n.global.locale.value = settingsStore.language
    }
    
    // Initialise le thème (le store le fait déjà dans loadSettings, mais on s'assure ici)
    settingsStore.applyTheme(settingsStore.theme)
  } catch (error) {
    console.warn('Impossible de charger settingsStore (non bloquant):', error)
  }
})

