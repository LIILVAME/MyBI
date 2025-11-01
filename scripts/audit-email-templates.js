import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TEMPLATES_DIR = path.join(__dirname, '..', 'emails', 'templates')
const CONFIG_FILE = path.join(__dirname, '..', 'emails', 'config.json')
const AUDIT_REPORT = path.join(__dirname, '..', 'emails', 'EMAIL_AUDIT.md')

const REQUIRED_TEMPLATES = [
  'confirmation.html',
  'magic_link.html',
  'reset_password.html',
  'invite_user.html',
  'change_email.html',
  'reauthentication.html'
]

const REQUIRED_VARIABLES = {
  'confirmation.html': ['{{ .ConfirmationURL }}', '{{ .SiteURL }}'],
  'magic_link.html': ['{{ .ConfirmationURL }}', '{{ .SiteURL }}'],
  'reset_password.html': ['{{ .ConfirmationURL }}', '{{ .SiteURL }}'],
  'invite_user.html': ['{{ .ConfirmationURL }}', '{{ .InvitedBy }}', '{{ .SiteURL }}'],
  'change_email.html': ['{{ .ConfirmationURL }}', '{{ .Email }}', '{{ .SiteURL }}'],
  'reauthentication.html': ['{{ .ConfirmationURL }}', '{{ .SiteURL }}']
}

const REQUIRED_ELEMENTS = [
  'Vylo',
  '#2ECC71',
  'button',
  'logo',
  'footer'
]

console.log('🔍 Audit des Templates Email Vylo')
console.log('==================================\n')

let globalStatus = '✅'
const errors = []
const warnings = []
const validations = []

// 1. Vérifier l'existence du dossier
if (!fs.existsSync(TEMPLATES_DIR)) {
  errors.push(`❌ Dossier templates introuvable : ${TEMPLATES_DIR}`)
  globalStatus = '❌'
} else {
  validations.push(`✅ Dossier templates trouvé : ${TEMPLATES_DIR}`)
}

// 2. Vérifier la configuration
if (!fs.existsSync(CONFIG_FILE)) {
  warnings.push(`⚠️  Fichier config.json introuvable`)
} else {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
    validations.push(`✅ Configuration chargée : ${config.company_name}`)
    
    if (config.primary_color !== '#2ECC71') {
      warnings.push(`⚠️  Couleur principale différente de #2ECC71 : ${config.primary_color}`)
    }
  } catch (e) {
    errors.push(`❌ Erreur lecture config.json : ${e.message}`)
    globalStatus = '❌'
  }
}

// 3. Vérifier chaque template
REQUIRED_TEMPLATES.forEach(templateName => {
  const templatePath = path.join(TEMPLATES_DIR, templateName)
  
  if (!fs.existsSync(templatePath)) {
    errors.push(`❌ Template manquant : ${templateName}`)
    globalStatus = '❌'
    return
  }
  
  validations.push(`✅ Template trouvé : ${templateName}`)
  
  try {
    const content = fs.readFileSync(templatePath, 'utf-8')
    
    // Vérifier les variables requises
    const requiredVars = REQUIRED_VARIABLES[templateName] || []
    const missingVars = requiredVars.filter(v => !content.includes(v))
    
    if (missingVars.length > 0) {
      errors.push(`❌ ${templateName} : Variables manquantes : ${missingVars.join(', ')}`)
      globalStatus = '❌'
    } else {
      validations.push(`   ✅ Toutes les variables requises présentes`)
    }
    
    // Vérifier les éléments essentiels
    REQUIRED_ELEMENTS.forEach(element => {
      if (!content.includes(element)) {
        warnings.push(`⚠️  ${templateName} : Élément "${element}" non trouvé`)
      }
    })
    
    // Vérifier le HTML valide (structure de base)
    if (!content.includes('<!DOCTYPE html>')) {
      warnings.push(`⚠️  ${templateName} : DOCTYPE HTML manquant`)
    }
    
    if (!content.includes('<html')) {
      errors.push(`❌ ${templateName} : Balise <html> manquante`)
      globalStatus = '❌'
    }
    
    // Vérifier les boutons
    const buttonCount = (content.match(/class="button"/g) || []).length
    if (buttonCount === 0) {
      warnings.push(`⚠️  ${templateName} : Aucun bouton trouvé`)
    }
    
    // Vérifier le responsive
    if (!content.includes('@media') && !content.includes('max-width')) {
      warnings.push(`⚠️  ${templateName} : Media queries responsive manquantes`)
    }
    
  } catch (e) {
    errors.push(`❌ ${templateName} : Erreur lecture : ${e.message}`)
    globalStatus = '❌'
  }
})

// 4. Générer le rapport
const report = `# 📊 Rapport d'Audit - Templates Email Vylo

**Date** : ${new Date().toISOString().split('T')[0]}  
**Statut global** : ${globalStatus}

---

## ✅ Validations

${validations.map(v => `- ${v}`).join('\n')}

---

## ⚠️  Avertissements

${warnings.length > 0 ? warnings.map(w => `- ${w}`).join('\n') : '- Aucun avertissement'}

---

## ❌ Erreurs

${errors.length > 0 ? errors.map(e => `- ${e}`).join('\n') : '- Aucune erreur ✅'}

---

## 📋 Templates Vérifiés

${REQUIRED_TEMPLATES.map(t => `- [ ] ${t}`).join('\n')}

---

## 🔍 Détails par Template

${REQUIRED_TEMPLATES.map(templateName => {
  const templatePath = path.join(TEMPLATES_DIR, templateName)
  if (!fs.existsSync(templatePath)) return `### ${templateName}\n- ❌ Fichier introuvable\n`
  
  try {
    const content = fs.readFileSync(templatePath, 'utf-8')
    const size = (content.length / 1024).toFixed(2)
    const varCount = (content.match(/\{\{ \.(\w+) \}\}/g) || []).length
    const buttonCount = (content.match(/class="button"/g) || []).length
    
    return `### ${templateName}
- 📏 Taille : ${size} KB
- 🔗 Variables : ${varCount}
- 🔘 Boutons : ${buttonCount}
- ✅ Statut : ${errors.some(e => e.includes(templateName)) ? '❌ Erreurs détectées' : '✅ Valide'}
`
  } catch (e) {
    return `### ${templateName}\n- ❌ Erreur : ${e.message}\n`
  }
}).join('\n')}

---

## 📝 Recommandations

${warnings.length > 0 || errors.length > 0 ? `
1. **Corriger les erreurs** : ${errors.length} erreur(s) à résoudre
2. **Réviser les avertissements** : ${warnings.length} avertissement(s) à vérifier
3. **Tester les templates** : Valider chaque template dans Supabase Dashboard
4. **Vérifier le rendu** : Tester sur Gmail, Outlook, Apple Mail
` : `
✅ **Tous les templates sont valides !**

Prochaines étapes :
1. Intégrer les templates dans Supabase Dashboard
2. Tester l'envoi pour chaque type d'email
3. Vérifier le rendu sur différents clients email
`}

---

**Généré automatiquement par** : \`scripts/audit-email-templates.js\`  
**Voir** : [EMAIL_TEMPLATES_GUIDE.md](./docs/EMAIL_TEMPLATES_GUIDE.md) pour plus de détails
`

fs.writeFileSync(AUDIT_REPORT, report)

console.log('\n📊 Résultats de l\'audit:\n')
console.log(`✅ Validations : ${validations.length}`)
console.log(`⚠️  Avertissements : ${warnings.length}`)
console.log(`❌ Erreurs : ${errors.length}`)
console.log(`\n📄 Rapport généré : ${AUDIT_REPORT}`)

if (errors.length > 0) {
  console.log('\n❌ Erreurs détectées :')
  errors.forEach(e => console.log(`   ${e}`))
  process.exit(1)
}

if (warnings.length > 0) {
  console.log('\n⚠️  Avertissements :')
  warnings.forEach(w => console.log(`   ${w}`))
}

console.log(`\n${globalStatus} Audit terminé !`)

