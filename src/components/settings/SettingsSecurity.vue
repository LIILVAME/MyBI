<template>
  <div class="space-y-6">
    <SecuritySettings @change-password="handleChangePassword" />
  </div>
</template>

<script setup>
import SecuritySettings from './SecuritySettings.vue'

const handleChangePassword = () => {
  // TODO: Implémenter le modal de changement de mot de passe
}
</script>

