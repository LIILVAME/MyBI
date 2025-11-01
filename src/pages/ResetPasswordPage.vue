<template>
  <AuthLayout>
    <div>
      <h2 class="text-2xl sm:text-3xl font-bold mb-2 text-center text-gray-900">{{ $t('auth.reset.title') }}</h2>
      <p class="text-center text-gray-500 text-sm mb-6">{{ $t('auth.reset.subtitle') }}</p>

      <!-- Formulaire de réinitialisation -->
      <form v-if="!emailSent" @submit.prevent="handleResetPassword" class="space-y-4">
        <AuthInput
          :label="$t('auth.reset.email')"
          type="email"
          v-model="form.email"
          :placeholder="$t('auth.reset.emailPlaceholder')"
          :error="emailError"
          required
        />

        <!-- Message d'erreur -->
        <transition name="slide-fade">
          <div v-if="authStore.error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-sm text-red-700 flex-1">{{ authStore.error }}</p>
            </div>
          </div>
        </transition>

        <AuthButton
          :label="$t('auth.reset.cta')"
          :loading="authStore.loading"
          type="submit"
          :disabled="!form.email"
        />

        <!-- Lien retour connexion -->
        <div class="mt-6 pt-6 border-t border-gray-200 text-center">
          <router-link
            to="/login"
            class="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors"
          >
            {{ $t('auth.reset.backToLogin') }}
          </router-link>
        </div>
      </form>

      <!-- Message de succès -->
      <transition name="slide-fade">
        <div v-if="emailSent" class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('auth.reset.successTitle') }}</h3>
          <p class="text-gray-600 mb-6">{{ $t('auth.reset.successMessage', { email: form.email }) }}</p>
          
          <AuthButton
            :label="$t('auth.reset.backToLogin')"
            @click="$router.push('/login')"
          />
        </div>
      </transition>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useLingui'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthInput from '@/components/auth/AuthInput.vue'
import AuthButton from '@/components/auth/AuthButton.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const form = ref({
  email: ''
})

const emailSent = ref(false)

const emailError = computed(() => {
  if (!form.value.email && authStore.error) return null
  return ''
})

/**
 * Gère la demande de réinitialisation
 */
const handleResetPassword = async () => {
  authStore.error = null
  const result = await authStore.resetPassword(form.value.email)

  if (result.success) {
    emailSent.value = true
    toastStore.success(t('auth.reset.successMessage', { email: form.value.email }))
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>

