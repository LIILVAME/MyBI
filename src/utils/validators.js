import { z } from 'zod'

/**
 * Schémas de validation Zod pour tous les formulaires de l'application
 * Centralise toutes les validations pour une sécurité renforcée
 */

/**
 * Schéma de validation pour un bien immobilier
 */
export const propertySchema = z.object({
  name: z.string()
    .min(2, 'Le nom du bien doit contenir au moins 2 caractères')
    .max(100, 'Le nom du bien ne peut pas dépasser 100 caractères'),
  address: z.string()
    .max(200, 'L\'adresse ne peut pas dépasser 200 caractères')
    .optional()
    .nullable(),
  city: z.string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(100, 'La ville ne peut pas dépasser 100 caractères'),
  rent: z.number()
    .min(0, 'Le loyer doit être positif')
    .max(1000000, 'Le loyer ne peut pas dépasser 1 000 000'),
  status: z.enum(['occupied', 'vacant'], {
    errorMap: () => ({ message: 'Le statut doit être "occupied" ou "vacant"' })
  }),
  tenant: z.object({
    name: z.string().min(2, 'Le nom du locataire doit contenir au moins 2 caractères'),
    entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format YYYY-MM-DD'),
    exitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format YYYY-MM-DD').nullable().optional(),
    rent: z.number().min(0, 'Le loyer du locataire doit être positif'),
    status: z.enum(['on_time', 'late', 'unpaid']).optional()
  }).optional().nullable()
})

/**
 * Schéma de validation pour un locataire
 */
export const tenantSchema = z.object({
  name: z.string()
    .min(2, 'Le nom du locataire doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  propertyId: z.string().uuid('L\'ID du bien doit être un UUID valide'),
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format YYYY-MM-DD'),
  exitDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format YYYY-MM-DD')
    .nullable()
    .optional(),
  rent: z.number()
    .min(0, 'Le loyer doit être positif')
    .max(1000000, 'Le loyer ne peut pas dépasser 1 000 000'),
  status: z.enum(['on_time', 'late', 'unpaid']).optional().default('on_time')
})

/**
 * Schéma de validation pour un paiement
 */
export const paymentSchema = z.object({
  propertyId: z.string().uuid('L\'ID du bien doit être un UUID valide'),
  amount: z.number()
    .min(0.01, 'Le montant doit être supérieur à 0')
    .max(1000000, 'Le montant ne peut pas dépasser 1 000 000'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format YYYY-MM-DD'),
  status: z.enum(['pending', 'paid', 'late', 'unpaid'], {
    errorMap: () => ({ message: 'Le statut doit être "pending", "paid", "late" ou "unpaid"' })
  }).optional().default('pending')
})

/**
 * Schéma de validation pour la connexion
 */
export const loginSchema = z.object({
  email: z.string()
    .email('Format d\'email invalide')
    .min(5, 'L\'email doit contenir au moins 5 caractères'),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})

/**
 * Schéma de validation pour l'inscription
 */
export const signupSchema = z.object({
  email: z.string()
    .email('Format d\'email invalide')
    .min(5, 'L\'email doit contenir au moins 5 caractères'),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  fullName: z.string()
    .min(2, 'Le nom complet doit contenir au moins 2 caractères')
    .max(100, 'Le nom complet ne peut pas dépasser 100 caractères'),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Format de téléphone invalide')
    .optional()
    .nullable()
})

/**
 * Schéma de validation pour le changement de mot de passe
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
  newPassword: z.string()
    .min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  confirmPassword: z.string().min(1, 'La confirmation du mot de passe est requise')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
})

/**
 * Fonction helper pour valider et formater les erreurs Zod
 * @param {ZodSchema} schema - Le schéma Zod à utiliser
 * @param {Object} data - Les données à valider
 * @returns {Object} { success: boolean, data?: Object, errors?: Array<string> }
 */
export function validate(schema, data) {
  try {
    const validated = schema.parse(data)
    return {
      success: true,
      data: validated
    }
  } catch (error) {
    if (error instanceof z.ZodError && error.errors && Array.isArray(error.errors)) {
      const errors = error.errors.map(err => {
        const path = Array.isArray(err.path) ? err.path.join('.') : String(err.path || '')
        return `${path ? `${path}: ` : ''}${err.message || 'Erreur de validation'}`
      })
      
      return {
        success: false,
        errors,
        error: errors.join('; ')
      }
    }
    
    return {
      success: false,
      errors: [error?.message || 'Erreur de validation'],
      error: error?.message || 'Erreur de validation'
    }
  }
}

/**
 * Fonction helper pour valider de manière sécurisée (safe parse)
 * @param {ZodSchema} schema - Le schéma Zod à utiliser
 * @param {Object} data - Les données à valider
 * @returns {Object} { success: boolean, data?: Object, error?: ZodError }
 */
export function safeValidate(schema, data) {
  const result = schema.safeParse(data)
  return result
}

