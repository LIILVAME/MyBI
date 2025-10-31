import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from './authStore'
import { useToastStore } from './toastStore'
import { PROPERTY_STATUS } from '@/utils/constants'

/**
 * Store Pinia pour gérer les biens immobiliers
 * Connecté à Supabase pour la persistance et synchronisation en temps réel
 */
export const usePropertiesStore = defineStore('properties', () => {
  // State
  const properties = ref([])
  const loading = ref(false)
  const error = ref(null)
  let realtimeChannel = null
  let isRealtimeInitialized = false
  let lastFetchTime = 0
  const FETCH_CACHE_MS = 5000 // Cache de 5 secondes pour éviter les requêtes multiples

  /**
   * Récupère toutes les propriétés de l'utilisateur depuis Supabase
   */
  const fetchProperties = async (force = false) => {
    // Évite les requêtes multiples si déjà en cours
    if (loading.value && !force) {
      console.log('⏸️ fetchProperties déjà en cours, skip')
      return
    }

    // Cache de 5 secondes pour éviter les requêtes trop fréquentes
    const now = Date.now()
    if (!force && now - lastFetchTime < FETCH_CACHE_MS && properties.value.length > 0) {
      console.log('⏸️ fetchProperties: données récentes, skip (cache)')
      return
    }

    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('User not authenticated')
      }

      const { data, error: fetchError } = await supabase
        .from('properties')
        .select(`
          *,
          tenants (*)
        `)
        .eq('user_id', authStore.user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      lastFetchTime = Date.now()

      // Transforme les données Supabase pour correspondre au format attendu
      properties.value = data.map(prop => ({
        id: prop.id,
        name: prop.name,
        address: prop.address || '',
        city: prop.city,
        status: prop.status,
        rent: Number(prop.rent),
        tenant: prop.tenants && prop.tenants.length > 0
          ? {
              id: prop.tenants[0].id,
              name: prop.tenants[0].name,
              entryDate: prop.tenants[0].entry_date,
              exitDate: prop.tenants[0].exit_date || null,
              rent: Number(prop.tenants[0].rent),
              status: prop.tenants[0].status || 'on_time'
            }
          : null,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' // Image par défaut
      }))

      loading.value = false
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error fetching properties:', err)
    }
  }

  /**
   * Ajoute un nouveau bien dans Supabase
   * @param {Object} propertyData - Données du bien à ajouter
   * @returns {Object} Le bien créé avec son ID
   */
  const addProperty = async (propertyData) => {
    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('User not authenticated')
      }

      // Insère le bien dans Supabase
      const { data, error: insertError } = await supabase
        .from('properties')
        .insert([
          {
            name: propertyData.name,
            address: propertyData.address || '',
            city: propertyData.city,
            rent: Number(propertyData.rent),
            status: propertyData.status,
            user_id: authStore.user.id
          }
        ])
        .select()
        .single()

      if (insertError) throw insertError

      // Si le bien est occupé et qu'un locataire est fourni, créer le locataire
      if (propertyData.status === PROPERTY_STATUS.OCCUPIED && propertyData.tenant) {
        const { data: tenantData, error: tenantError } = await supabase
          .from('tenants')
          .insert([
            {
              property_id: data.id,
              name: propertyData.tenant.name,
              entry_date: propertyData.tenant.entryDate,
              rent: Number(propertyData.rent),
              status: propertyData.tenant.status || 'on_time'
            }
          ])
          .select()
          .single()

        if (!tenantError && tenantData) {
          data.tenant = {
            id: tenantData.id,
            name: tenantData.name,
            entryDate: tenantData.entry_date,
            exitDate: tenantData.exit_date || null,
            rent: Number(tenantData.rent),
            status: tenantData.status
          }
        }
      }

      // Transforme pour le format attendu
      const newProperty = {
        id: data.id,
        name: data.name,
        address: data.address || '',
        city: data.city,
        status: data.status,
        rent: Number(data.rent),
        tenant: data.tenant || null,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
      }

      properties.value.unshift(newProperty)
      
      const toast = useToastStore()
      toast.success(`Bien "${newProperty.name}" ajouté avec succès`)
      
      loading.value = false

      return newProperty
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error adding property:', err)
      
      const toast = useToastStore()
      toast.error(`Erreur lors de l'ajout du bien : ${err.message}`)
      
      throw err
    }
  }

  /**
   * Met à jour un bien existant dans Supabase
   * @param {string} id - ID UUID du bien à mettre à jour
   * @param {Object} updates - Données à mettre à jour
   */
  const updateProperty = async (id, updates) => {
    loading.value = true
    error.value = null

    try {
      // Prépare les données pour Supabase
      const supabaseUpdates = {
        name: updates.name,
        address: updates.address,
        city: updates.city,
        rent: Number(updates.rent),
        status: updates.status,
        updated_at: new Date().toISOString()
      }

      const { data, error: updateError } = await supabase
        .from('properties')
        .update(supabaseUpdates)
        .eq('id', id)
        .select(`
          *,
          tenants (*)
        `)
        .single()

      if (updateError) throw updateError

      // Gère le locataire si nécessaire
      if (updates.status === PROPERTY_STATUS.OCCUPIED && updates.tenant) {
        // Vérifie si un locataire existe déjà
        const existingTenant = data.tenants && data.tenants.length > 0 ? data.tenants[0] : null

        if (existingTenant) {
          // Met à jour le locataire existant
          const { error: tenantError } = await supabase
            .from('tenants')
            .update({
              name: updates.tenant.name,
              entry_date: updates.tenant.entryDate,
              rent: Number(updates.rent),
              status: updates.tenant.status || 'on_time',
              updated_at: new Date().toISOString()
            })
            .eq('id', existingTenant.id)

          if (tenantError) throw tenantError
        } else {
          // Crée un nouveau locataire
          const { error: tenantError } = await supabase
            .from('tenants')
            .insert([
              {
                property_id: id,
                name: updates.tenant.name,
                entry_date: updates.tenant.entryDate,
                rent: Number(updates.rent),
                status: updates.tenant.status || 'on_time'
              }
            ])

          if (tenantError) throw tenantError
        }
      } else if (updates.status === PROPERTY_STATUS.VACANT) {
        // Supprime le locataire si le bien devient libre
        if (data.tenants && data.tenants.length > 0) {
          await supabase
            .from('tenants')
            .delete()
            .eq('property_id', id)
        }
      }

      // Recharge les propriétés pour avoir les données à jour
      await fetchProperties()

      const toast = useToastStore()
      toast.success(`Bien modifié avec succès`)

      loading.value = false
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error updating property:', err)
      
      const toast = useToastStore()
      toast.error(`Erreur lors de la mise à jour : ${err.message}`)
      
      throw err
    }
  }

  /**
   * Supprime un bien dans Supabase
   * @param {string} id - ID UUID du bien à supprimer
   */
  const removeProperty = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Supprime de la liste locale
      properties.value = properties.value.filter(p => p.id !== id)
      
      const toast = useToastStore()
      toast.success('Bien supprimé avec succès')
      
      loading.value = false
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error deleting property:', err)
      
      const toast = useToastStore()
      toast.error(`Erreur lors de la suppression : ${err.message}`)
      
      throw err
    }
  }

  /**
   * Computed : Nombre total de biens
   */
  const totalProperties = computed(() => properties.value.length)

  /**
   * Computed : Nombre de biens occupés
   */
  const occupiedProperties = computed(() => 
    properties.value.filter(p => p.status === PROPERTY_STATUS.OCCUPIED).length
  )

  /**
   * Computed : Nombre de biens libres
   */
  const vacantProperties = computed(() => 
    properties.value.filter(p => p.status === PROPERTY_STATUS.VACANT).length
  )

  /**
   * Computed : Total des loyers mensuels
   */
  const totalRent = computed(() => 
    properties.value.reduce((sum, p) => sum + (p.rent || 0), 0)
  )

  /**
   * Initialise l'abonnement temps réel pour les propriétés
   * Écoute les changements INSERT/UPDATE/DELETE sur la table properties
   */
  const initRealtime = () => {
    // Se désabonne si déjà abonné
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
      realtimeChannel = null
    }

    const toast = useToastStore()
    const authStore = useAuthStore()

    // Vérifie que l'utilisateur est authentifié
    if (!authStore.user) {
      console.warn('Cannot init realtime: user not authenticated')
      return
    }

    realtimeChannel = supabase
      .channel('public:properties')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
          filter: `user_id=eq.${authStore.user.id}` // Seulement les biens de l'utilisateur
        },
        async (payload) => {
          const { eventType, new: rowNew, old: rowOld } = payload

          if (eventType === 'INSERT') {
            // Charge les données complètes avec le tenant si présent
            const { data, error: fetchError } = await supabase
              .from('properties')
              .select(`
                *,
                tenants (*)
              `)
              .eq('id', rowNew.id)
              .single()

            if (!fetchError && data) {
              // Transforme pour le format attendu
              const newProperty = {
                id: data.id,
                name: data.name,
                address: data.address || '',
                city: data.city,
                status: data.status,
                rent: Number(data.rent),
                tenant: data.tenants && data.tenants.length > 0
                  ? {
                      id: data.tenants[0].id,
                      name: data.tenants[0].name,
                      entryDate: data.tenants[0].entry_date,
                      exitDate: data.tenants[0].exit_date || null,
                      rent: Number(data.tenants[0].rent),
                      status: data.tenants[0].status || 'on_time'
                    }
                  : null,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
              }

              // Ajoute seulement s'il n'existe pas déjà
              if (!properties.value.find(p => p.id === newProperty.id)) {
                properties.value.unshift(newProperty)
                toast.info(`Nouveau bien : ${newProperty.name}`)
              }
            }
          }

          if (eventType === 'UPDATE') {
            // Recharge la propriété avec ses relations
            const { data, error: fetchError } = await supabase
              .from('properties')
              .select(`
                *,
                tenants (*)
              `)
              .eq('id', rowNew.id)
              .single()

            if (!fetchError && data) {
              const updatedProperty = {
                id: data.id,
                name: data.name,
                address: data.address || '',
                city: data.city,
                status: data.status,
                rent: Number(data.rent),
                tenant: data.tenants && data.tenants.length > 0
                  ? {
                      id: data.tenants[0].id,
                      name: data.tenants[0].name,
                      entryDate: data.tenants[0].entry_date,
                      exitDate: data.tenants[0].exit_date || null,
                      rent: Number(data.tenants[0].rent),
                      status: data.tenants[0].status || 'on_time'
                    }
                  : null,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
              }

              const index = properties.value.findIndex(p => p.id === updatedProperty.id)
              if (index !== -1) {
                properties.value[index] = updatedProperty
                toast.info(`Bien mis à jour : ${updatedProperty.name}`)
              }
            }
          }

          if (eventType === 'DELETE') {
            properties.value = properties.value.filter(p => p.id !== rowOld.id)
            toast.info('Bien supprimé')
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime subscribed to properties')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime error for properties')
          isRealtimeInitialized = false // Réinitialise pour permettre une nouvelle tentative
          realtimeChannel = null
          // Ne pas afficher d'erreur toast pour éviter le spam
          // Le Realtime est optionnel, l'application fonctionne sans
        } else if (status === 'CLOSED') {
          console.log('🔌 Realtime channel closed for properties')
          isRealtimeInitialized = false
          realtimeChannel = null
        }
      })
  }

  /**
   * Arrête l'abonnement temps réel
   */
  const stopRealtime = () => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
      realtimeChannel = null
      isRealtimeInitialized = false
      console.log('🔌 Realtime unsubscribed from properties')
    }
  }

  return {
    // State
    properties,
    loading,
    error,
    // Actions
    fetchProperties,
    addProperty,
    updateProperty,
    removeProperty,
    initRealtime,
    stopRealtime,
    // Getters
    totalProperties,
    occupiedProperties,
    vacantProperties,
    totalRent
  }
})

