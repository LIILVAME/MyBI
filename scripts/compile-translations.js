import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Compile les fichiers JSON de traduction en modules ES6
 * Compatible avec l'API vue-i18n mais compilé à build-time
 */
function compileTranslations() {
  const sourceDir = path.join(__dirname, '..', 'src', 'locales', 'i18n')
  const outputDir = path.join(__dirname, '..', 'src', 'locales', 'compiled')
  
  // Crée le dossier de sortie
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  const locales = ['fr', 'en']
  
  locales.forEach(locale => {
    const jsonPath = path.join(sourceDir, `${locale}.json`)
    const outputPath = path.join(outputDir, `${locale}.js`)
    
    if (!fs.existsSync(jsonPath)) {
      console.warn(`⚠️  Fichier JSON non trouvé: ${jsonPath}`)
      return
    }
    
    try {
      const jsonContent = fs.readFileSync(jsonPath, 'utf-8')
      const translations = JSON.parse(jsonContent)
      
      // Génère un module ES6 avec export default
      const jsContent = `// Auto-generated translation file for ${locale.toUpperCase()}
// DO NOT EDIT - This file is generated from src/locales/i18n/${locale}.json
// Regenerate with: npm run i18n:compile

export default ${JSON.stringify(translations, null, 2)}
`
      
      fs.writeFileSync(outputPath, jsContent, 'utf-8')
      console.log(`✅ Compilé ${locale}.json → compiled/${locale}.js`)
    } catch (error) {
      console.error(`❌ Erreur lors de la compilation de ${locale}:`, error.message)
    }
  })
  
  console.log('\n✅ Compilation terminée!')
}

compileTranslations()

