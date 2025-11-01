#!/usr/bin/env node

/**
 * Script pour corriger les formats invalides dans les traductions i18n
 * Détecte et corrige les problèmes qui causent "Invalid linked format"
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const LOCALES_DIR = join(rootDir, 'src', 'locales', 'i18n')

/**
 * Problèmes connus qui causent "Invalid linked format" :
 * 1. Emojis dans certaines configurations Vue I18n
 * 2. Références @: avec des caractères spéciaux
 * 3. Interpolations {} mal formées
 * 4. Caractères Unicode problématiques
 */

function fixLocaleFile(filePath) {
  console.log(`\n📄 Correction de ${filePath}...`)
  
  const content = readFileSync(filePath, 'utf-8')
  let json = JSON.parse(content)
  let modified = false
  const fixes = []
  
  /**
   * Fonction récursive pour parcourir et corriger les valeurs
   */
  function traverseAndFix(obj, path = '') {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key
      const value = obj[key]
      
      if (typeof value === 'string') {
        let newValue = value
        let fixed = false
        
        // Problème 1: Emojis dans les traductions peuvent causer des problèmes
        // On les remplace par du texte ou on les échappe
        // Solution: Garder les emojis mais s'assurer qu'ils sont bien encodés en UTF-8
        
        // Problème 2: Vérifier les références @: mal formées
        // Si @: est suivi d'un caractère invalide
        const invalidLinkedRef = /@:[^a-zA-Z0-9_.-]/
        if (invalidLinkedRef.test(newValue)) {
          // Remplace les références invalides par du texte simple
          newValue = newValue.replace(/@:[^a-zA-Z0-9_.-]+/g, (match) => {
            // Extrait la partie après @: et la met entre crochets
            const ref = match.substring(2)
            return `[${ref}]`
          })
          fixed = true
        }
        
        // Problème 3: Interpolations mal fermées
        // {variable sans } fermant
        const openBraces = (newValue.match(/\{/g) || []).length
        const closeBraces = (newValue.match(/\}/g) || []).length
        if (openBraces !== closeBraces) {
          console.log(`   ⚠️  Interpolation mal fermée dans ${currentPath}`)
          // Ferme les interpolations non fermées
          newValue = newValue.replace(/\{([^}]+)$/g, '{$1}')
          fixed = true
        }
        
        // Problème 4: Caractères de contrôle ou problèmes d'encodage
        // Supprime les caractères de contrôle (sauf espaces normaux)
        const hasControlChars = /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/.test(newValue)
        if (hasControlChars) {
          newValue = newValue.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
          fixed = true
        }
        
        // Problème 5: Espaces ou caractères invisibles problématiques
        // Normalise les espaces
        const normalized = newValue.normalize('NFC')
        if (normalized !== newValue) {
          newValue = normalized
          fixed = true
        }
        
        if (fixed) {
          obj[key] = newValue
          modified = true
          fixes.push({
            path: currentPath,
            oldValue: value,
            newValue: newValue
          })
          console.log(`   ✅ Corrigé: ${currentPath}`)
        }
      } else if (typeof value === 'object' && value !== null) {
        traverseAndFix(value, currentPath)
      }
    }
  }
  
  traverseAndFix(json)
  
  if (modified) {
    // Sauvegarde avec formatage propre
    const fixedContent = JSON.stringify(json, null, 2) + '\n'
    writeFileSync(filePath, fixedContent, 'utf-8')
    console.log(`   💾 Fichier sauvegardé avec ${fixes.length} correction(s)`)
  } else {
    console.log(`   ✅ Aucune correction nécessaire`)
  }
  
  return { modified, fixes }
}

/**
 * Solution spécifique : Échapper les emojis ou les remplacer
 * Vue I18n peut avoir des problèmes avec certains emojis dans certaines configurations
 */
function escapeEmojisInTranslations(filePath) {
  console.log(`\n🔧 Échappement des emojis dans ${filePath}...`)
  
  const content = readFileSync(filePath, 'utf-8')
  let json = JSON.parse(content)
  let modified = false
  
  function escapeEmojis(obj) {
    for (const key in obj) {
      const value = obj[key]
      
      if (typeof value === 'string') {
        // Remplace les emojis problématiques par des équivalents texte ou les échappe
        // On garde les emojis mais on s'assure qu'ils sont bien encodés
        // Pour le moment, on ne les modifie pas car ils sont normalement supportés
        // Si nécessaire, on pourrait les remplacer :
        // value = value.replace(/✅/g, '[OK]').replace(/❌/g, '[ERREUR]').replace(/⚠️/g, '[ATTENTION]')
      } else if (typeof value === 'object' && value !== null) {
        escapeEmojis(value)
      }
    }
  }
  
  // Pour l'instant, on ne modifie pas les emojis
  // Mais on pourrait les échapper si nécessaire
  
  return { modified }
}

/**
 * Solution alternative : Vérifier la configuration Vue I18n
 * Le problème pourrait venir de la configuration legacy vs Composition API
 */
function checkI18nConfig() {
  console.log('\n🔍 Vérification de la configuration i18n...')
  
  const i18nPath = join(rootDir, 'src', 'i18n.js')
  const content = readFileSync(i18nPath, 'utf-8')
  
  // Vérifie que legacy: false est bien défini
  if (!content.includes('legacy: false')) {
    console.log('   ⚠️  Configuration legacy non trouvée')
    return false
  }
  
  console.log('   ✅ Configuration correcte (legacy: false)')
  return true
}

function main() {
  console.log('\n🔧 CORRECTION DES FORMATS I18N INVALIDES\n')
  console.log('═'.repeat(60))
  
  const localeFiles = ['fr.json', 'en.json']
  const allFixes = []
  
  localeFiles.forEach(fileName => {
    const filePath = join(LOCALES_DIR, fileName)
    
    if (!existsSync(filePath)) {
      console.log(`\n⚠️  Fichier non trouvé : ${fileName}`)
      return
    }
    
    const result = fixLocaleFile(filePath)
    allFixes.push(...result.fixes)
  })
  
  // Vérifie la configuration i18n
  checkI18nConfig()
  
  console.log('\n' + '═'.repeat(60))
  console.log(`\n📊 Résumé :`)
  console.log(`   - Corrections appliquées : ${allFixes.length}`)
  
  if (allFixes.length > 0) {
    console.log(`\n✅ Les fichiers ont été corrigés`)
    console.log(`\n💡 Si l'erreur persiste :`)
    console.log(`   1. Vérifiez que le build de production utilise les fichiers corrigés`)
    console.log(`   2. Testez avec npm run build && npm run preview`)
    console.log(`   3. Vérifiez les logs de build pour d'autres erreurs`)
  } else {
    console.log(`\n✅ Aucune correction nécessaire dans les fichiers JSON`)
    console.log(`\n💡 Si l'erreur persiste, le problème pourrait venir :`)
    console.log(`   1. De la configuration Vue I18n (vérifiez src/i18n.js)`)
    console.log(`   2. Du build de production (minification/compression)`)
    console.log(`   3. D'une extension de navigateur qui modifie le DOM`)
  }
  
  console.log('')
  
  process.exit(0)
}

main()

