import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'
// Note: Si glob n'est pas disponible, on utilisera fs.readdirSync récursif

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Migre les imports vue-i18n vers le nouveau système
 */
async function migrateImports() {
  const srcDir = path.join(__dirname, '..', 'src')
  
  // Trouve tous les fichiers .vue et .js dans src
  const files = await glob('**/*.{vue,js}', {
    cwd: srcDir,
    absolute: true,
    ignore: ['node_modules/**', 'dist/**', '**/*.test.js', '**/*.spec.js']
  })
  
  let migratedCount = 0
  
  for (const filePath of files) {
    try {
      let content = fs.readFileSync(filePath, 'utf-8')
      let modified = false
      
      // Remplace l'import vue-i18n
      if (content.includes("from 'vue-i18n'") || content.includes('from "vue-i18n"')) {
        content = content.replace(
          /import\s+(\{[^}]*useI18n[^}]*\}|\w+)\s+from\s+['"]vue-i18n['"]/g,
          (match) => {
            modified = true
            return match.replace('vue-i18n', '@/composables/useLingui')
          }
        )
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8')
        console.log(`✅ Migré: ${path.relative(srcDir, filePath)}`)
        migratedCount++
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la migration de ${filePath}:`, error.message)
    }
  }
  
  console.log(`\n✅ Migration terminée: ${migratedCount} fichier(s) migré(s)`)
}

migrateImports().catch(console.error)

