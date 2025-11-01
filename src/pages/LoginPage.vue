<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 px-4">
    <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-100">
      <!-- Logo / Titre -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary-600 mb-2">MyBI</h1>
        <p class="text-gray-600">Gestion immobilière intelligente</p>
      </div>

      <!-- Formulaire de connexion -->
      <div v-if="!showSignUp">
      <h2 class="text-2xl font-semibold mb-6 text-center text-gray-900">Connexion</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="votre@email.com"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            :class="{ 'border-red-300': authStore.error }"
          />
        </div>

        <!-- Mot de passe -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            :class="{ 'border-red-300': authStore.error }"
          />
        </div>

        <!-- Lien mot de passe oublié -->
        <div class="flex items-center justify-end">
          <button
            type="button"
            @click="handleForgotPassword"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Mot de passe oublié ?
          </button>
        </div>

        <!-- Message d'erreur -->
        <div v-if="authStore.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ authStore.error }}</p>
        </div>

        <!-- Bouton de connexion -->
        <button
          type="submit"
          :disabled="authStore.loading || oauthLoading || !form.email || !form.password"
          class="w-full btn-primary flex items-center justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            v-if="authStore.loading"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ authStore.loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <!-- Séparateur OAuth -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-gray-500 font-medium">{{ $t('login.or') }}</span>
        </div>
      </div>

      <!-- Boutons OAuth -->
      <div class="space-y-3">
        <!-- Bouton Google -->
        <button
          type="button"
          @click="handleGoogleLogin"
          :disabled="authStore.loading || oauthLoading"
          class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <svg
            v-if="oauthProvider === 'google' && oauthLoading"
            class="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg
            v-else
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>{{ oauthProvider === 'google' && oauthLoading ? $t('login.oauthLoading') : $t('login.loginWithGoogle') }}</span>
        </button>

        <!-- Bouton Apple -->
        <button
          type="button"
          @click="handleAppleLogin"
          :disabled="authStore.loading || oauthLoading"
          class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <svg
            v-if="oauthProvider === 'apple' && oauthLoading"
            class="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg
            v-else
            class="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          <span>{{ oauthProvider === 'apple' && oauthLoading ? $t('login.oauthLoading') : $t('login.loginWithApple') }}</span>
        </button>
      </div>

        <!-- Lien d'inscription -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Pas encore de compte ?
          <button
            type="button"
            @click="showSignUp = true"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Créer un compte
          </button>
        </p>
        </div>
      </div>

      <!-- Formulaire d'inscription -->
      <div v-else>
        <h2 class="text-2xl font-semibold mb-6 text-center text-gray-900">Créer un compte</h2>

        <form @submit.prevent="handleSignUp" class="space-y-4">
          <!-- Nom complet -->
          <div>
            <label for="signup-fullname" class="block text-sm font-medium text-gray-700 mb-2">
              Nom complet <span class="text-red-500">*</span>
            </label>
            <input
              id="signup-fullname"
              v-model="signUpForm.fullName"
              type="text"
              required
              placeholder="Jean Dupont"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              :class="{ 'border-red-300': authStore.error }"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="signup-email" class="block text-sm font-medium text-gray-700 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="signup-email"
              v-model="signUpForm.email"
              type="email"
              required
              placeholder="votre@email.com"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              :class="{ 'border-red-300': authStore.error }"
            />
          </div>

          <!-- Téléphone (optionnel) -->
          <div>
            <label for="signup-phone" class="block text-sm font-medium text-gray-700 mb-2">
              Téléphone <span class="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <input
              id="signup-phone"
              v-model="signUpForm.phone"
              type="tel"
              placeholder="06 12 34 56 78"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="signup-password" class="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="signup-password"
              v-model="signUpForm.password"
              type="password"
              required
              placeholder="••••••••"
              minlength="6"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              :class="{ 'border-red-300': authStore.error }"
            />
            <p class="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
          </div>

          <!-- Confirmation mot de passe -->
          <div>
            <label for="signup-password-confirm" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="signup-password-confirm"
              v-model="signUpForm.passwordConfirm"
              type="password"
              required
              placeholder="••••••••"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              :class="{ 'border-red-300': signUpForm.password !== signUpForm.passwordConfirm && signUpForm.passwordConfirm }"
            />
          </div>

          <!-- Message d'erreur -->
          <div v-if="authStore.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ authStore.error }}</p>
          </div>

          <!-- Bouton d'inscription -->
          <button
            type="submit"
            :disabled="authStore.loading || !signUpForm.fullName || !signUpForm.email || !signUpForm.password || signUpForm.password !== signUpForm.passwordConfirm"
            class="w-full bg-green-600 text-white font-medium rounded-lg px-4 py-3 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg
              v-if="authStore.loading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ authStore.loading ? 'Création...' : 'Créer un compte' }}
          </button>
        </form>

        <!-- Lien retour connexion -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Déjà un compte ?
            <button
              type="button"
              @click="showSignUp = false"
              class="text-primary-600 hover:text-primary-700 font-medium"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

const form = ref({
  email: '',
  password: ''
})

const signUpForm = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: ''
})

const showSignUp = ref(false)
const oauthLoading = ref(false)
const oauthProvider = ref(null)

/**
 * Gère la connexion
 */
const handleLogin = async () => {
  const result = await authStore.login(form.value.email, form.value.password)

  if (result.success) {
    // Redirige vers la page demandée ou le dashboard par défaut
    const redirectTo = route.query.redirect || '/dashboard'
    router.push(redirectTo)
  }
}

/**
 * Gère l'inscription
 */
const handleSignUp = async () => {
  // Vérification de la correspondance des mots de passe
  if (signUpForm.value.password !== signUpForm.value.passwordConfirm) {
    authStore.error = 'Les mots de passe ne correspondent pas'
    return
  }

  const result = await authStore.signUp(
    signUpForm.value.email, 
    signUpForm.value.password,
    {
      fullName: signUpForm.value.fullName,
      phone: signUpForm.value.phone || null
    }
  )

  if (result.success) {
    // Si confirmation email requise, redirige vers login avec message
    if (result.requiresConfirmation) {
      // Le toast est déjà affiché par le store
      showSignUp.value = false
      // Réinitialise le formulaire
      signUpForm.value = {
        fullName: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: ''
      }
    } else {
      // Connexion automatique, redirige vers dashboard
      const redirectTo = route.query.redirect || '/dashboard'
      router.push(redirectTo)
    }
  }
}

/**
 * Gère la demande de réinitialisation de mot de passe
 */
const handleForgotPassword = async () => {
  if (!form.value.email) {
    toastStore.info('Veuillez saisir votre email d\'abord')
    return
  }

  const result = await authStore.resetPassword(form.value.email)

  if (result.success) {
    toastStore.success(`Un email de réinitialisation a été envoyé à ${form.value.email}`)
  }
}

/**
 * Gère la connexion avec Google
 */
const handleGoogleLogin = async () => {
  oauthLoading.value = true
  oauthProvider.value = 'google'
  
  try {
    const redirectTo = route.query.redirect || '/dashboard'
    await authStore.loginWithGoogle(redirectTo)
    // La redirection se fait automatiquement par Supabase
  } catch (error) {
    console.error('Erreur connexion Google:', error)
    oauthLoading.value = false
    oauthProvider.value = null
  }
}

/**
 * Gère la connexion avec Apple
 */
const handleAppleLogin = async () => {
  oauthLoading.value = true
  oauthProvider.value = 'apple'
  
  try {
    const redirectTo = route.query.redirect || '/dashboard'
    await authStore.loginWithApple(redirectTo)
    // La redirection se fait automatiquement par Supabase
  } catch (error) {
    console.error('Erreur connexion Apple:', error)
    oauthLoading.value = false
    oauthProvider.value = null
  }
}

/**
 * Vérifie si l'utilisateur est déjà connecté
 * Gère aussi le callback OAuth depuis l'URL
 */
onMounted(async () => {
  // Vérifie s'il y a un token OAuth dans l'URL (callback)
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const accessToken = hashParams.get('access_token')
  const error = hashParams.get('error')
  
  if (error) {
    toastStore.error(`Erreur d'authentification : ${error}`)
    // Nettoie l'URL
    window.history.replaceState({}, document.title, window.location.pathname)
  } else if (accessToken) {
    // L'utilisateur revient de l'OAuth
    // Supabase gère automatiquement la session via initAuthListener
    // On attend un peu pour que la session soit restaurée
    setTimeout(async () => {
      const user = await authStore.fetchUser()
      if (user) {
        const redirectTo = route.query.redirect || '/dashboard'
        router.push(redirectTo)
        toastStore.success(t('login.oauthSuccess'))
      }
    }, 500)
  }
  
  // Si l'utilisateur est déjà connecté, redirige vers le dashboard
  if (authStore.user || await authStore.fetchUser()) {
    router.push('/dashboard')
  }
})
</script>

