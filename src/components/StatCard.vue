<template>
  <div class="stat-card">
    <div class="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
      <div class="p-2 sm:p-2.5 lg:p-3 rounded-lg" :class="iconBgClass">
        <component :is="icon" class="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" :class="iconColorClass" />
      </div>
      <span v-if="trend" class="text-xs sm:text-sm font-medium" :class="trendColorClass">
        {{ trend }}
      </span>
    </div>
    <h3 class="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-1">{{ value }}</h3>
    <p class="text-xs sm:text-sm text-gray-600 line-clamp-2">{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: [Object, Function],
    required: true
  },
  iconBgClass: {
    type: String,
    default: 'bg-primary-100'
  },
  iconColorClass: {
    type: String,
    default: 'text-primary-600'
  },
  trend: {
    type: String,
    default: null
  },
  trendColorClass: {
    type: String,
    default: 'text-green-600'
  }
})
</script>

