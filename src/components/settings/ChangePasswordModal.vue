<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="handleClose"
      >
        <!-- Overlay backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-xl transition-all"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 class="text-xl font-semibold text-gray-900">{{ $t('security.password.modalTitle') }}</h2>
              <button
                @click="handleClose"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fermer"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="px-6 py-4">
              <div class="space-y-4">
                <!-- Email (readonly) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('login.email') }}
                  </label>
                  <input
                    type="email"
                    :value="authStore.user?.email || ''"
                    disabled
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <!-- Ancien mot de passe -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('security.password.currentPassword') }}
                  </label>
                  <input
                    v-model="form.currentPassword"
                    type="password"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    :placeholder="$t('security.password.currentPasswordPlaceholder')"
                  />
                </div>

                <!-- Nouveau mot de passe -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('security.password.newPassword') }}
                  </label>
                  <input
                    v-model="form.newPassword"
                    type="password"
                    required
                    minlength="6"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    :placeholder="$t('security.password.newPasswordPlaceholder')"
                  />
                  <p class="text-xs text-gray-500 mt-1">{{ $t('security.password.passwordHint') }}</p>
                </div>

                <!-- Confirmation -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('security.password.confirmPassword') }}
                  </label>
                  <input
                    v-model="form.confirmPassword"
                    type="password"
                    required
                    minlength="6"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    :class="{ 'border-red-300': form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword }"
                    :placeholder="$t('security.password.confirmPasswordPlaceholder')"
                  />
                  <p
                    v-if="form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword"
                    class="text-xs text-red-600 mt-1"
                  >
                    {{ $t('security.password.passwordMismatch') }}
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  @click="handleClose"
                  class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting || (form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword)"
                  class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSubmitting ? $t('security.password.updating') : $t('security.password.updateButton') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'

const { t } = useI18n()
const authStore = useAuthStore()
const toastStore = useToastStore()

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const isSubmitting = ref(false)
const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleClose = () => {
  // Réinitialise le formulaire
  form.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  emit('close')
}

const handleSubmit = async () => {
  // Vérifie que les mots de passe correspondent
  if (form.value.newPassword !== form.value.confirmPassword) {
    if (toastStore) {
      toastStore.error(t('security.password.passwordMismatch'))
    }
    return
  }

  // Vérifie la longueur minimale
  if (form.value.newPassword.length < 6) {
    if (toastStore) {
      toastStore.error(t('security.password.passwordTooShort'))
    }
    return
  }

  isSubmitting.value = true

  try {
    // Met à jour le mot de passe via Supabase
    const { error } = await supabase.auth.updateUser({
      password: form.value.newPassword
    })

    if (error) {
      // Si erreur d'authentification, essaie de se reconnecter avec l'ancien mot de passe
      if (error.message.includes('password') || error.message.includes('credentials')) {
        // Supabase Auth ne nécessite pas l'ancien mot de passe pour updateUser
        // Mais on peut vérifier en se reconnectant d'abord
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: authStore.user?.email || '',
          password: form.value.currentPassword
        })

        if (signInError) {
          throw new Error(t('security.password.currentPasswordIncorrect'))
        }

        // Si la reconnexion réussit, on peut mettre à jour le mot de passe
        const { error: updateError } = await supabase.auth.updateUser({
          password: form.value.newPassword
        })

        if (updateError) {
          throw updateError
        }
      } else {
        throw error
      }
    }

    // Succès
    handleClose()
    emit('success')
    
    if (toastStore) {
      toastStore.success(t('security.password.changedSuccess'))
    }
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error)
    if (toastStore) {
      toastStore.error(error.message || t('security.password.changeError'))
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

