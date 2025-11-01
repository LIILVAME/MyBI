<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-2xl font-bold mb-4 text-gray-900">Debug Login</h1>
      
      <div class="space-y-4 text-sm">
        <div>
          <strong>AuthStore.loadingSession:</strong> 
          <span :class="authStore.loadingSession ? 'text-red-600' : 'text-green-600'">
            {{ authStore.loadingSession }}
          </span>
        </div>
        
        <div>
          <strong>AuthStore.user:</strong> 
          <span :class="authStore.user ? 'text-green-600' : 'text-gray-600'">
            {{ authStore.user ? 'Connecté' : 'Non connecté' }}
          </span>
        </div>
        
        <div>
          <strong>Route:</strong> {{ $route.path }}
        </div>
        
        <div>
          <strong>i18n disponible:</strong> 
          <span class="text-green-600">✅</span>
        </div>
      </div>
      
      <button 
        @click="$router.push('/')" 
        class="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Retour à l'accueil
      </button>
      
      <button 
        @click="testComponents" 
        class="mt-4 ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tester composants
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const testComponents = async () => {
  console.log('🧪 Test des composants Auth...')
  
  try {
    // Test AuthLayout
    const AuthLayout = await import('@/layouts/AuthLayout.vue')
    console.log('✅ AuthLayout importé:', AuthLayout)
  } catch (err) {
    console.error('❌ Erreur import AuthLayout:', err)
  }
  
  try {
    // Test AuthInput
    const AuthInput = await import('@/components/auth/AuthInput.vue')
    console.log('✅ AuthInput importé:', AuthInput)
  } catch (err) {
    console.error('❌ Erreur import AuthInput:', err)
  }
  
  try {
    // Test AuthButton
    const AuthButton = await import('@/components/auth/AuthButton.vue')
    console.log('✅ AuthButton importé:', AuthButton)
  } catch (err) {
    console.error('❌ Erreur import AuthButton:', err)
  }
  
  try {
    // Test AuthOAuth
    const AuthOAuth = await import('@/components/auth/AuthOAuth.vue')
    console.log('✅ AuthOAuth importé:', AuthOAuth)
  } catch (err) {
    console.error('❌ Erreur import AuthOAuth:', err)
  }
}

onMounted(() => {
  console.log('🔵 LoginPageDebug monté')
  console.log('AuthStore:', {
    loadingSession: authStore.loadingSession,
    user: authStore.user,
    error: authStore.error
  })
})
</script>

