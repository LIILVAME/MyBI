<template>
  <div
    v-if="isPulling || isRefreshing"
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-300"
    :style="{
      transform: `translateY(${Math.max(0, pullDistance - 20)}px)`,
      opacity: Math.min(1, pullDistance / threshold),
      height: `${Math.min(80, pullDistance)}px`
    }"
  >
    <div class="flex flex-col items-center justify-center">
      <div
        v-if="!isRefreshing"
        class="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full transition-transform duration-300"
        :style="{
          transform: `rotate(${(pullDistance / threshold) * 360}deg)`
        }"
      ></div>
      <div
        v-else
        class="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"
      ></div>
      <p
        v-if="isRefreshing"
        class="mt-2 text-xs text-gray-600 font-medium"
      >
        {{ $t('common.refreshing') || 'Actualisation...' }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isPulling: {
    type: Boolean,
    default: false
  },
  pullDistance: {
    type: Number,
    default: 0
  },
  isRefreshing: {
    type: Boolean,
    default: false
  },
  threshold: {
    type: Number,
    default: 80
  }
})
</script>

