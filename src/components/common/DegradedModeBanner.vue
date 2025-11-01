<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-full"
  >
    <div
      v-if="diagnosticStore.isDegradedMode"
      class="fixed top-12 left-0 right-0 w-full z-40 text-center py-2 text-sm font-medium bg-yellow-50 text-yellow-700 border-b border-yellow-200 shadow-sm"
    >
      <div class="flex items-center justify-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ $t('degradedMode.message') }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useDiagnosticStore } from '@/stores/diagnosticStore'

const diagnosticStore = useDiagnosticStore()
</script>

