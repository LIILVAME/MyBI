<template>
  <div class="mb-8">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-bold text-gray-900">Mes appartements</h3>
      <!-- Bouton hybride : Modal en v0.1.0, redirection en v0.2.0 -->
      <button 
        @click="handleAddClick"
        class="btn-primary flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un bien
      </button>
      
      <!-- TODO v0.2.0 : Remplacer par redirection vers /biens?mode=add -->
      <!--
      <button 
        @click="$emit('redirect-to-add')"
        class="btn-primary flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un bien
      </button>
      -->
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PropertyCard
        v-for="property in properties"
        :key="property.id"
        :property="property"
      />
    </div>
  </div>
</template>

<script setup>
import PropertyCard from '../PropertyCard.vue'

const props = defineProps({
  properties: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add-click'])

/**
 * Gère le clic sur le bouton "Ajouter un bien"
 * Émet un événement pour ouvrir le modal (v0.1.0)
 * TODO v0.2.0 : Remplacer par redirection vers /biens?mode=add
 */
const handleAddClick = () => {
  emit('add-click')
}
</script>

