import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase pour l'authentification et la gestion des données
 * Configuration via variables d'environnement
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables SUPABASE manquantes dans .env')
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

