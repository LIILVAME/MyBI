/// <reference types="vite/client" />

/**
 * Types pour les variables d'environnement
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_GA4_MEASUREMENT_ID?: string
  readonly VITE_PLAUSIBLE_DOMAIN?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_BASE_PATH?: string
  readonly VITE_ADMIN_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
