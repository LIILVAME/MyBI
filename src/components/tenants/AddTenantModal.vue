<template>
  <!-- Overlay -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="handleClose"
      >
        <!-- Overlay backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-xl transition-all"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 class="text-xl font-semibold text-gray-900">Ajouter un locataire</h2>
              <button
                @click="handleClose"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fermer"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="px-6 py-4">
              <div class="space-y-4">
                <!-- Nom du locataire -->
                <div>
                  <label for="tenant-name" class="block text-sm font-medium text-gray-700 mb-2">
                    Nom du locataire <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="tenant-name"
                    v-model.trim="form.name"
                    type="text"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    placeholder="Ex: Jean Dupont"
                  />
                </div>

                <!-- Bien associé -->
                <div>
                  <label for="tenant-property" class="block text-sm font-medium text-gray-700 mb-2">
                    Bien associé <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="tenant-property"
                    v-model="form.propertyId"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    @change="handlePropertyChange"
                  >
                    <option value="">Sélectionner un bien</option>
                    <option
                      v-for="property in availableProperties"
                      :key="property.id"
                      :value="property.id"
                    >
                      {{ property.name }} - {{ property.city }}
                    </option>
                  </select>
                  <p v-if="form.propertyId && selectedProperty" class="text-xs text-gray-500 mt-1">
                    Loyer du bien : {{ formatCurrency(selectedProperty.rent) }}
                  </p>
                </div>

                <!-- Date d'entrée -->
                <div>
                  <label for="tenant-entry-date" class="block text-sm font-medium text-gray-700 mb-2">
                    Date d'entrée <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="tenant-entry-date"
                    v-model="form.entryDate"
                    type="date"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  />
                </div>

                <!-- Date de sortie (optionnelle) -->
                <div>
                  <label for="tenant-exit-date" class="block text-sm font-medium text-gray-700 mb-2">
                    Date de sortie <span class="text-gray-400 text-xs">(optionnelle)</span>
                  </label>
                  <input
                    id="tenant-exit-date"
                    v-model="form.exitDate"
                    type="date"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  />
                </div>

                <!-- Loyer -->
                <div>
                  <label for="tenant-rent" class="block text-sm font-medium text-gray-700 mb-2">
                    Loyer mensuel (€) <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="tenant-rent"
                    v-model.number="form.rent"
                    type="number"
                    required
                    min="0"
                    step="10"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    placeholder="950"
                  />
                </div>

                <!-- Statut de paiement -->
                <div>
                  <label for="tenant-status" class="block text-sm font-medium text-gray-700 mb-2">
                    Statut de paiement <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="tenant-status"
                    v-model="form.status"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  >
                    <option value="">Sélectionner un statut</option>
                    <option :value="PAYMENT_STATUS.ON_TIME">À jour</option>
                    <option :value="PAYMENT_STATUS.LATE">En retard</option>
                  </select>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  @click="handleClose"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  class="btn-primary flex items-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { PAYMENT_STATUS } from '@/utils/constants'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { formatCurrency } from '@/utils/formatters'
import { PROPERTY_STATUS } from '@/utils/constants'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const propertiesStore = usePropertiesStore()
const toastStore = useToastStore()

const form = ref({
  name: '',
  propertyId: '',
  entryDate: '',
  exitDate: '',
  rent: null,
  status: PAYMENT_STATUS.ON_TIME
})

const validationErrors = ref({})

/**
 * Liste des biens disponibles (libres ou occupés - on peut remplacer le locataire)
 */
const availableProperties = computed(() => {
  return propertiesStore.properties
})

/**
 * Bien sélectionné
 */
const selectedProperty = computed(() => {
  if (!form.value.propertyId) return null
  return propertiesStore.properties.find(p => p.id === form.value.propertyId)
})

/**
 * Réinitialise le formulaire
 */
const resetForm = () => {
  form.value = {
    name: '',
    propertyId: '',
    entryDate: '',
    exitDate: '',
    rent: null,
    status: PAYMENT_STATUS.ON_TIME
  }
}

/**
 * Ferme le modal
 */
const handleClose = () => {
  resetForm()
  emit('close')
}

/**
 * Gère le changement de sélection du bien
 * Pré-remplit le loyer si un bien est sélectionné
 */
const handlePropertyChange = () => {
  if (selectedProperty.value) {
    form.value.rent = selectedProperty.value.rent || null
  } else {
    form.value.rent = null
  }
}

/**
 * Soumet le formulaire avec validation Zod
 */
const handleSubmit = () => {
  validationErrors.value = {}
  
  // Prépare les données à soumettre
  const submitData = {
    name: form.value.name.trim(),
    propertyId: form.value.propertyId,
    entryDate: form.value.entryDate,
    exitDate: form.value.exitDate || null,
    rent: Number(form.value.rent),
    status: form.value.status || 'on_time'
  }
  
  // Validation avec Zod
  const validationResult = validate(tenantSchema, submitData)
  
  if (!validationResult.success) {
    // Affiche les erreurs de validation
    if (toastStore) {
      toastStore.error(`Validation échouée : ${validationResult.error}`)
    }
    
    // Mappe les erreurs par champ
    if (validationResult.errors) {
      validationResult.errors.forEach(error => {
        const match = error.match(/^([^.]+):/)
        if (match) {
          const field = match[1]
          if (!validationErrors.value[field]) {
            validationErrors.value[field] = []
          }
          validationErrors.value[field].push(error.replace(/^[^:]+:\s*/, ''))
        }
      })
    }
    
    return
  }
  
  // Ajoute les champs additionnels non validés par Zod mais nécessaires pour l'UI
  const finalData = {
    ...validationResult.data,
    property: selectedProperty.value?.name || ''
  }
  
  emit('submit', finalData)
  
  resetForm()
  emit('close')
}

/**
 * Réinitialise le formulaire quand le modal se ferme
 */
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})
</script>

<style scoped>
/* Transitions pour le modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .transform,
.modal-leave-active .transform {
  transition: transform 0.3s ease;
}

.modal-enter-from .transform,
.modal-leave-to .transform {
  transform: scale(0.95);
}
</style>

