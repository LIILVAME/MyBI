<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-2xl font-bold mb-4 text-gray-900">Doogoo</h1>
      <p class="text-gray-600 mb-6">Page de connexion</p>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full px-4 py-2 border rounded"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          class="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Se connecter
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  try {
    const result = await authStore.login(email.value, password.value)
    if (result.success) {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Erreur login:', error)
  }
}
</script>

