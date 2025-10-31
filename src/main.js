import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Gestion d'erreur globale pour éviter l'écran blanc
app.config.errorHandler = (err, instance, info) => {
  console.error('Erreur Vue globale:', err, info)
  // Ne pas bloquer le rendu
}

app.mount('#app')

// Initialise la langue depuis le store settings après le montage de Pinia
// Utilise setTimeout pour s'assurer que Pinia est complètement initialisé
setTimeout(() => {
  try {
    const { useSettingsStore } = require('@/stores/settingsStore')
    const settingsStore = useSettingsStore()
    if (i18n.global.locale.value !== settingsStore.language) {
      i18n.global.locale.value = settingsStore.language
    }
  } catch (error) {
    console.warn('Impossible de charger settingsStore pour i18n:', error)
  }
}, 0)

