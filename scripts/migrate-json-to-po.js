import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Convertit un objet JSON en entrées de traduction PO
 * @param {Object} obj - Objet JSON
 * @param {string} prefix - Préfixe pour les clés (ex: "common.loading")
 */
function flattenJSON(obj, prefix = '') {
  const entries = []
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof value === 'string') {
      // Échappe les caractères spéciaux pour le format PO
      const escapedKey = fullKey.replace(/"/g, '\\"')
      const escapedValue = value.replace(/"/g, '\\"').replace(/\n/g, '\\n')
      
      entries.push({
        key: fullKey,
        value: value,
        msgid: escapedKey,
        msgstr: escapedValue
      })
    } else if (typeof value === 'object' && value !== null) {
      entries.push(...flattenJSON(value, fullKey))
    }
  }
  
  return entries
}

/**
 * Génère un fichier PO à partir d'un objet JSON
 */
function generatePOFile(locale, translations) {
  const entries = flattenJSON(translations)
  
  let poContent = `# Translations for ${locale.toUpperCase()}\n`
  poContent += `# Generated from JSON migration\n`
  poContent += `msgid ""\n`
  poContent += `msgstr ""\n`
  poContent += `"Language: ${locale}\\n"\n`
  poContent += `"Content-Type: text/plain; charset=UTF-8\\n"\n`
  poContent += `\n`
  
  for (const entry of entries) {
    poContent += `msgid "${entry.msgid}"\n`
    poContent += `msgstr "${entry.msgstr}"\n`
    poContent += `\n`
  }
  
  return poContent
}

/**
 * Convertit les fichiers JSON en PO
 */
function migrateJSONToPO() {
  const locales = ['fr', 'en']
  const sourceDir = path.join(__dirname, '..', 'src', 'locales', 'i18n')
  const targetDir = path.join(__dirname, '..', 'src', 'locales')
  
  // Crée les dossiers de destination
  locales.forEach(locale => {
    const localeDir = path.join(targetDir, locale)
    if (!fs.existsSync(localeDir)) {
      fs.mkdirSync(localeDir, { recursive: true })
    }
  })
  
  locales.forEach(locale => {
    const jsonPath = path.join(sourceDir, `${locale}.json`)
    const poPath = path.join(targetDir, locale, 'messages.po')
    
    if (!fs.existsSync(jsonPath)) {
      console.warn(`⚠️  Fichier JSON non trouvé: ${jsonPath}`)
      return
    }
    
    try {
      const jsonContent = fs.readFileSync(jsonPath, 'utf-8')
      const translations = JSON.parse(jsonContent)
      
      const poContent = generatePOFile(locale, translations)
      
      fs.writeFileSync(poPath, poContent, 'utf-8')
      console.log(`✅ Migré ${locale}.json → ${locale}/messages.po`)
    } catch (error) {
      console.error(`❌ Erreur lors de la migration de ${locale}:`, error.message)
    }
  })
  
  console.log('\n✅ Migration JSON → PO terminée!')
  console.log('\n📝 Prochaines étapes:')
  console.log('   1. Vérifiez les fichiers .po générés')
  console.log('   2. Exécutez: npx lingui compile')
  console.log('   3. Les fichiers .js seront générés automatiquement')
}

migrateJSONToPO()

