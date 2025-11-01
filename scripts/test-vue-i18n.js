#!/usr/bin/env node

/**
 * Test de validation Vue I18n
 * Vérifie que les fichiers de traduction peuvent être chargés sans erreur
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const LOCALES_DIR = join(rootDir, 'src', 'locales', 'i18n')

/**
 * Teste le chargement d'un fichier de locale avec Vue I18n
 */
function testVueI18nLoading() {
  console.log('\n🧪 TEST DE VALIDATION VUE I18N\n')
  console.log('═'.repeat(60))
  
  const localeFiles = ['fr.json', 'en.json']
  const results = []
  
  localeFiles.forEach(fileName => {
    const filePath = join(LOCALES_DIR, fileName)
    
    if (!existsSync(filePath)) {
      console.log(`\n❌ Fichier non trouvé : ${fileName}`)
      return
    }
    
    console.log(`\n📄 Test de ${fileName}...`)
    
    try {
      // Lit et parse le JSON
      const content = readFileSync(filePath, 'utf-8')
      const messages = JSON.parse(content)
      
      console.log(`   ✅ JSON valide`)
      
      // Teste quelques clés importantes
      const testKeys = [
        'auth.login.title',
        'auth.signup.title',
        'login.oauthSuccess',
        'login.oauthError'
      ]
      
      let allKeysExist = true
      testKeys.forEach(key => {
        const keys = key.split('.')
        let current = messages
        let found = true
        
        for (const k of keys) {
          if (current && typeof current === 'object' && k in current) {
            current = current[k]
          } else {
            found = false
            break
          }
        }
        
        if (found) {
          console.log(`   ✅ Clé "${key}" existe : "${typeof current === 'string' ? current.substring(0, 50) : 'OK'}"`)
        } else {
          console.log(`   ⚠️  Clé "${key}" manquante`)
          allKeysExist = false
        }
      })
      
      // Recherche les caractères problématiques potentiels
      const problematicPatterns = [
        { pattern: /@:/g, name: 'Références @:' },
        { pattern: /\{.*\{/g, name: 'Interpolations imbriquées' },
        { pattern: /✅|❌|⚠️/g, name: 'Emojis Unicode' }
      ]
      
      function findInObject(obj, path = '') {
        const found = []
        
        for (const key in obj) {
          const currentPath = path ? `${path}.${key}` : key
          const value = obj[key]
          
          if (typeof value === 'string') {
            problematicPatterns.forEach(({ pattern, name }) => {
              if (pattern.test(value)) {
                found.push({
                  path: currentPath,
                  value: value.substring(0, 80),
                  type: name
                })
              }
            })
          } else if (typeof value === 'object' && value !== null) {
            found.push(...findInObject(value, currentPath))
          }
        }
        
        return found
      }
      
      const problematic = findInObject(messages)
      
      if (problematic.length > 0) {
        console.log(`\n   ⚠️  Caractères spéciaux détectés :`)
        problematic.forEach(item => {
          console.log(`      • ${item.path} : ${item.type}`)
        })
      } else {
        console.log(`   ✅ Aucun caractère problématique détecté`)
      }
      
      results.push({
        fileName,
        valid: true,
        allKeysExist,
        problematic: problematic.length,
        testKeys
      })
      
    } catch (error) {
      console.log(`   ❌ Erreur : ${error.message}`)
      results.push({
        fileName,
        valid: false,
        error: error.message
      })
    }
  })
  
  console.log('\n' + '═'.repeat(60))
  
  // Résumé
  const allValid = results.every(r => r.valid)
  if (allValid) {
    console.log('\n✅ Tous les fichiers sont valides pour Vue I18n\n')
  } else {
    console.log('\n❌ Certains fichiers ont des erreurs\n')
  }
  
  return results
}

// Exécution
try {
  testVueI18nLoading()
  process.exit(0)
} catch (error) {
  console.error('\n❌ Erreur lors du test:', error.message)
  console.error(error.stack)
  process.exit(1)
}

