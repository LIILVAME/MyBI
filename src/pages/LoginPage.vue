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
          :disabled="authStore.loading || !form.email || !form.password"
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
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'

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
 * Vérifie si l'utilisateur est déjà connecté
 */
onMounted(async () => {
  // Si l'utilisateur est déjà connecté, redirige vers le dashboard
  if (authStore.user || await authStore.fetchUser()) {
    router.push('/dashboard')
  }
})
</script>

