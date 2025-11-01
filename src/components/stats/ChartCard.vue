<template>
  <div class="bg-white rounded-lg shadow-none sm:shadow-sm border border-gray-100 p-3 sm:p-5">
    <div class="mb-3 sm:mb-4">
      <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-1">{{ title }}</h3>
      <p v-if="description" class="text-xs sm:text-sm text-gray-500">{{ description }}</p>
    </div>
    
    <div class="bg-gray-50 rounded-lg p-2 sm:p-3 overflow-x-auto">
      <div v-if="loading" class="flex items-center justify-center h-[300px]">
        <div class="animate-pulse space-y-3 w-full">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          <div class="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div v-else-if="error" class="flex items-center justify-center h-[300px] text-red-600">
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm font-medium">{{ error }}</p>
        </div>
      </div>
      <div v-else class="chart-container">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
.chart-container {
  min-height: 300px;
}
</style>

