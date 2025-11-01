<template>
  <AuthLayout>
    <div class="text-center">
      <!-- Icône de succès -->
      <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <!-- Titre -->
      <h2 class="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">{{ $t('auth.confirm.title') }}</h2>

      <!-- Message -->
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        {{ $t('auth.confirm.message') }}
      </p>

      <!-- Bouton vers la connexion -->
      <AuthButton
        :label="$t('auth.confirm.cta')"
        @click="$router.push('/login')"
      />
    </div>
  </AuthLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthButton from '@/components/auth/AuthButton.vue'

const router = useRouter()
</script>

