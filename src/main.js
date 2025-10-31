import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Gestion d'erreur globale pour éviter l'écran blanc
app.config.errorHandler = (err, instance, info) => {
  console.error('Erreur Vue globale:', err, info)
  // Ne pas bloquer le rendu
}

app.mount('#app')

