<template>
  <section class="card">
    <h2 class="text-lg font-semibold text-gray-900 mb-6">{{ title }}</h2>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

