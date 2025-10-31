import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useToastStore } from '@/stores/toastStore'

/**
 * Store Pinia pour gérer l'authentification
 * Synchronisé avec Supabase Auth pour la persistance de session
 */
export const useAuthStore = defineStore('auth', () => {

  // State
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const session = ref(null)
  const profile = ref(null)
  let lastProfileFetchTime = 0
  let profileFetchInProgress = false
  const PROFILE_CACHE_MS = 5000 // Cache de 5 secondes

  /**
   * Computed : Vérifie si l'utilisateur est connecté
   */
  const isAuthenticated = computed(() => user.value !== null)

  /**
   * Connexion avec email et mot de passe
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   */
  const login = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        error.value = authError.message
        loading.value = false
        return { success: false, error: authError.message }
      }

      user.value = data.user
      session.value = data.session
      loading.value = false

      return { success: true, user: data.user }
    } catch (err) {
      error.value = err.message
      loading.value = false
      return { success: false, error: err.message }
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @param {Object} metadata - Métadonnées utilisateur (fullName, phone, etc.)
   */
  const signUp = async (email, password, metadata = {}) => {
    loading.value = true
    error.value = null
    const toastStore = useToastStore()

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: metadata.fullName || '',
            phone: metadata.phone || null
          }
        }
      })

      if (authError) {
        error.value = authError.message
        toastStore.error(`Erreur d'inscription : ${authError.message}`)
        loading.value = false
        return { success: false, error: authError.message }
      }

      // Si l'utilisateur est créé
      if (data?.user) {
        // Le trigger PostgreSQL créera automatiquement le profil dans la table profiles
        // On peut aussi mettre à jour manuellement si nécessaire
        if (data.session) {
          // Connexion automatique - met à jour le profil immédiatement si possible
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              user_id: data.user.id,
              full_name: metadata.fullName || '',
              phone: metadata.phone || null
            }, {
              onConflict: 'user_id'
            })
          } catch (profileError) {
            // Le trigger devrait déjà avoir créé le profil, donc cette erreur n'est pas critique
            console.warn('Erreur lors de la mise à jour du profil:', profileError)
      }

      user.value = data.user
      session.value = data.session
          toastStore.success('Compte créé avec succès !')
        } else {
          // Confirmation email requise - le trigger créera le profil à la confirmation
          toastStore.success('Compte créé ! Vérifie ton email pour confirmer ton compte.')
        }
        loading.value = false
        return { success: true, user: data.user, requiresConfirmation: !data.session }
      }

      loading.value = false
      return { success: false, error: 'Aucune donnée utilisateur retournée' }
    } catch (err) {
      error.value = err.message
      toastStore.error(`Erreur d'inscription : ${err.message}`)
      console.error('Erreur signup Supabase:', err)
      loading.value = false
      return { success: false, error: err.message }
    }
  }

  /**
   * Déconnexion
   */
  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      // Nettoie les abonnements Realtime AVANT de se déconnecter
      try {
        const { usePropertiesStore } = await import('@/stores/propertiesStore')
        const { usePaymentsStore } = await import('@/stores/paymentsStore')
        const propertiesStore = usePropertiesStore()
        const paymentsStore = usePaymentsStore()
        
        propertiesStore.stopRealtime()
        paymentsStore.stopRealtime()
      } catch (cleanupError) {
        console.warn('Erreur lors du nettoyage Realtime (non bloquant):', cleanupError)
      }

      // Réinitialise le profil avant de se déconnecter
      profile.value = null

      const { error: authError } = await supabase.auth.signOut()

      if (authError) {
        error.value = authError.message
        loading.value = false
        return { success: false, error: authError.message }
      }

      user.value = null
      session.value = null
      loading.value = false

      // La redirection vers /login sera gérée automatiquement
      // par le router guard (beforeEach) qui détecte authStore.user === null

      return { success: true }
    } catch (err) {
      error.value = err.message
      loading.value = false
      return { success: false, error: err.message }
    }
  }

  /**
   * Récupère l'utilisateur actuel depuis Supabase
   * Utilisé pour restaurer la session au chargement de l'app
   */
  const fetchUser = async () => {
    loading.value = true

    try {
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()

      if (authError) {
        error.value = authError.message
        user.value = null
        session.value = null
        loading.value = false
        return null
      }

      user.value = currentUser

      // Récupère également la session
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      session.value = currentSession

      // Charge le profil utilisateur si disponible (ne bloque pas en cas d'erreur)
      if (currentUser) {
        try {
          await fetchProfile()
        } catch (err) {
          console.warn('Impossible de charger le profil (non bloquant):', err)
        }
      }

      loading.value = false
      return currentUser
    } catch (err) {
      error.value = err.message
      user.value = null
      session.value = null
      loading.value = false
      return null
    }
  }

  /**
   * Réinitialise le mot de passe
   * @param {string} email - Email pour recevoir le lien de réinitialisation
   */
  const resetPassword = async (email) => {
    loading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (authError) {
        error.value = authError.message
        loading.value = false
        return { success: false, error: authError.message }
      }

      loading.value = false
      return { success: true }
    } catch (err) {
      error.value = err.message
      loading.value = false
      return { success: false, error: err.message }
    }
  }

  /**
   * Récupère le profil utilisateur depuis Supabase
   */
  const fetchProfile = async (force = false) => {
    // Évite les requêtes multiples si déjà en cours
    if (profileFetchInProgress && !force) {
      return profile.value
    }

    // Cache de 5 secondes
    const now = Date.now()
    if (!force && now - lastProfileFetchTime < PROFILE_CACHE_MS && profile.value !== undefined) {
      return profile.value
    }

    try {
      if (!user.value) {
        profile.value = null
        return null
      }

      profileFetchInProgress = true

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.value.id)
        .maybeSingle()

      // maybeSingle() retourne null au lieu d'erreur si aucun résultat
      if (profileError) {
        console.error('Error fetching profile:', profileError)
        profile.value = null
        profileFetchInProgress = false
        return null
      }

      profile.value = data || null
      lastProfileFetchTime = Date.now()
      profileFetchInProgress = false
      return data || null
    } catch (err) {
      console.error('Error fetching profile:', err)
      profile.value = null
      profileFetchInProgress = false
      return null
    }
  }

  /**
   * Met à jour le profil utilisateur dans Supabase
   * @param {Object} profileData - Données du profil à mettre à jour
   */
  const updateProfile = async (profileData) => {
    if (!user.value) {
      throw new Error('User not authenticated')
    }

    const toastStore = useToastStore()

    try {
      // Met à jour le profil dans la table profiles
      const { data, error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.value.id,
          user_id: user.value.id,
          full_name: profileData.fullName || profileData.name,
          phone: profileData.phone || null,
          company: profileData.company || null,
          avatar_url: profileData.avatar_url || null
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (updateError) throw updateError

      profile.value = data

      // Met également à jour l'email dans auth.users si changé
      if (profileData.email && profileData.email !== user.value.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileData.email
        })

        if (emailError) {
          console.warn('Error updating email:', emailError)
          // Ne pas bloquer si l'email ne peut pas être mis à jour
        }
      }

      toastStore.success('Profil mis à jour avec succès')
      return { success: true, profile: data }
    } catch (err) {
      console.error('Error updating profile:', err)
      toastStore.error(`Erreur lors de la mise à jour : ${err.message}`)
      throw err
    }
  }

  /**
   * Initialise les écouteurs d'événements Supabase Auth
   * Écoute les changements de session (login/logout)
   */
  const initAuthListener = () => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        user.value = session?.user ?? null
        session.value = session
        // Charge le profil après connexion (ne bloque pas en cas d'erreur)
        if (session?.user) {
          try {
            await fetchProfile()
          } catch (err) {
            console.warn('Impossible de charger le profil après connexion (non bloquant):', err)
          }
        }
      } else if (event === 'SIGNED_OUT') {
        // Nettoie proprement lors de la déconnexion
        try {
          // Réinitialise l'état de manière sécurisée
          if (user.value !== null) user.value = null
          if (session.value !== null) session.value = null
          if (profile.value !== null) profile.value = null
          
          // Arrête les abonnements Realtime si les stores sont disponibles
          try {
            const { usePropertiesStore } = await import('@/stores/propertiesStore')
            const { usePaymentsStore } = await import('@/stores/paymentsStore')
            const propertiesStore = usePropertiesStore()
            const paymentsStore = usePaymentsStore()
            
            propertiesStore.stopRealtime()
            paymentsStore.stopRealtime()
          } catch (cleanupError) {
            // Ignore les erreurs de nettoyage (stores peuvent être déjà nettoyés)
          }
        } catch (err) {
          console.warn('Erreur lors du nettoyage après SIGNED_OUT (non bloquant):', err)
        }
      }
    })
  }

  return {
    // State
    user,
    loading,
    error,
    session,
    profile,
    // Getters
    isAuthenticated,
    // Actions
    login,
    signUp,
    logout,
    fetchUser,
    resetPassword,
    initAuthListener,
    fetchProfile,
    updateProfile
  }
})

