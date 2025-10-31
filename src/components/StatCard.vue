<template>
  <div class="stat-card">
    <div class="flex items-center justify-between mb-4">
      <div class="p-3 rounded-lg" :class="iconBgClass">
        <component :is="icon" class="w-6 h-6" :class="iconColorClass" />
      </div>
      <span v-if="trend" class="text-sm font-medium" :class="trendColorClass">
        {{ trend }}
      </span>
    </div>
    <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ value }}</h3>
    <p class="text-sm text-gray-600">{{ label }}</p>
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
    type: Object,
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

