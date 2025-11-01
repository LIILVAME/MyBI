#!/usr/bin/env node

/**
 * Script de test de connectivité Supabase en production
 * Teste que l'application déployée peut se connecter à Supabase
 */

import fetch from 'node-fetch'
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

const PROD_URL = 'https://doogoo.vercel.app'

/**
 * Teste si l'application répond
 */
async function testAppAvailability() {
  try {
    console.log(`\n🌐 Test de disponibilité: ${PROD_URL}...`)
    const response = await fetch(`${PROD_URL}/login`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Doogoo-Connectivity-Test/1.0'
      },
      timeout: 10000
    })
    
    const html = await response.text()
    const status = response.status
    
    return {
      success: status === 200,
      status,
      hasContent: html.length > 0,
      hasAppMount: html.includes('id="app"') || html.includes('id=\'app\''),
      htmlLength: html.length,
      error: status !== 200 ? `HTTP ${status}` : null
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: null
    }
  }
}

/**
 * Teste si les variables d'environnement sont accessibles
 * En analysant le JavaScript généré
 */
async function testEnvVarsInBundle() {
  try {
    console.log(`\n📦 Test des variables d'environnement dans le bundle...`)
    
    // Tente de charger le fichier principal JS
    const response = await fetch(`${PROD_URL}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Doogoo-Connectivity-Test/1.0'
      }
    })
    
    const html = await response.text()
    
    // Cherche les scripts JS
    const scriptMatches = html.match(/<script[^>]+src="([^"]+\.js)"[^>]*>/g) || []
    const scriptUrls = scriptMatches.map(match => {
      const urlMatch = match.match(/src="([^"]+)"/)
      return urlMatch ? urlMatch[1] : null
    }).filter(Boolean)
    
    // Prend le premier script principal
    const mainScript = scriptUrls.find(url => url.includes('assets') && url.includes('.js')) || scriptUrls[0]
    
    if (!mainScript) {
      return {
        success: false,
        error: 'Aucun script JavaScript trouvé dans la page',
        scriptsFound: scriptUrls.length
      }
    }
    
    // Charge le script
    const scriptUrl = mainScript.startsWith('http') ? mainScript : `${PROD_URL}${mainScript}`
    const scriptResponse = await fetch(scriptUrl, {
      headers: {
        'User-Agent': 'Doogoo-Connectivity-Test/1.0'
      }
    })
    
    const scriptContent = await scriptResponse.text()
    
    // Cherche les références aux variables d'environnement
    const hasSupabaseUrl = scriptContent.includes('VITE_SUPABASE_URL') || 
                          scriptContent.includes('supabase.co') ||
                          scriptContent.includes('SUPABASE_URL')
    
    const hasSupabaseKey = scriptContent.includes('VITE_SUPABASE_ANON_KEY') ||
                          scriptContent.includes('eyJhbGci') // Format JWT typique
    
    // Cherche les erreurs potentielles
    const hasUndefinedError = scriptContent.includes('undefined') && 
                              (scriptContent.includes('SUPABASE') || scriptContent.includes('supabase'))
    
    return {
      success: hasSupabaseUrl && hasSupabaseKey && !hasUndefinedError,
      hasSupabaseUrl,
      hasSupabaseKey,
      hasUndefinedError,
      scriptSize: scriptContent.length,
      scriptUrl: mainScript
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Teste la connectivité Supabase directement
 * En simulant une requête depuis le front
 */
async function testSupabaseConnection(supabaseUrl, supabaseKey) {
  try {
    console.log(`\n🔌 Test de connexion Supabase...`)
    
    // Teste l'endpoint auth de Supabase
    const authUrl = `${supabaseUrl}/auth/v1/health`
    const response = await fetch(authUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })
    
    const status = response.status
    
    return {
      success: status === 200 || status === 204,
      status,
      endpoint: authUrl,
      error: status !== 200 && status !== 204 ? `HTTP ${status}` : null
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Génère le rapport de connectivité
 */
async function generateConnectivityReport() {
  const report = {
    timestamp: new Date().toISOString(),
    productionUrl: PROD_URL,
    tests: {}
  }
  
  // Test 1: Disponibilité de l'app
  console.log('\n' + '═'.repeat(60))
  console.log('🧪 TESTS DE CONNECTIVITÉ SUPABASE')
  console.log('═'.repeat(60))
  
  const appTest = await testAppAvailability()
  report.tests.appAvailability = appTest
  
  // Test 2: Variables d'environnement dans le bundle
  const envTest = await testEnvVarsInBundle()
  report.tests.envVarsInBundle = envTest
  
  // Test 3: Si on a les variables localement, test Supabase direct
  // (Ce test nécessite les variables d'environnement)
  const envPath = join(rootDir, '.env')
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8')
    const supabaseUrlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/)
    const supabaseKeyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)
    
    if (supabaseUrlMatch && supabaseKeyMatch) {
      const supabaseUrl = supabaseUrlMatch[1].trim().replace(/['"]/g, '')
      const supabaseKey = supabaseKeyMatch[1].trim().replace(/['"]/g, '')
      
      const supabaseTest = await testSupabaseConnection(supabaseUrl, supabaseKey)
      report.tests.supabaseDirect = supabaseTest
    } else {
      report.tests.supabaseDirect = {
        skipped: true,
        reason: 'Variables VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY non trouvées dans .env'
      }
    }
  } else {
    report.tests.supabaseDirect = {
      skipped: true,
      reason: 'Fichier .env non trouvé'
    }
  }
  
  // Résumé
  const allTestsPassed = 
    report.tests.appAvailability?.success &&
    report.tests.envVarsInBundle?.success &&
    (report.tests.supabaseDirect?.success !== false)
  
  report.summary = {
    allTestsPassed,
    totalTests: 3,
    passedTests: [
      report.tests.appAvailability?.success,
      report.tests.envVarsInBundle?.success,
      report.tests.supabaseDirect?.success !== false
    ].filter(Boolean).length
  }
  
  // Affiche les résultats
  console.log('\n📊 RÉSULTATS:')
  console.log('\n1. Disponibilité de l\'application:')
  console.log(`   ${appTest.success ? '✅' : '❌'} ${appTest.success ? 'OK' : appTest.error || `HTTP ${appTest.status}`}`)
  if (appTest.success) {
    console.log(`   - Contenu HTML: ${appTest.hasContent ? '✅' : '❌'} (${appTest.htmlLength} bytes)`)
    console.log(`   - #app mount point: ${appTest.hasAppMount ? '✅' : '❌'}`)
  }
  
  console.log('\n2. Variables d\'environnement dans le bundle:')
  console.log(`   ${envTest.success ? '✅' : '❌'} ${envTest.success ? 'OK' : envTest.error || 'Variables non trouvées'}`)
  if (envTest.success !== false) {
    console.log(`   - VITE_SUPABASE_URL: ${envTest.hasSupabaseUrl ? '✅' : '❌'}`)
    console.log(`   - VITE_SUPABASE_ANON_KEY: ${envTest.hasSupabaseKey ? '✅' : '❌'}`)
    if (envTest.hasUndefinedError) {
      console.log(`   - ⚠️  Erreurs 'undefined' détectées dans le bundle`)
    }
  }
  
  console.log('\n3. Connexion Supabase directe:')
  if (report.tests.supabaseDirect.skipped) {
    console.log(`   ⚪ ${report.tests.supabaseDirect.reason}`)
  } else {
    const supabaseTest = report.tests.supabaseDirect
    console.log(`   ${supabaseTest.success ? '✅' : '❌'} ${supabaseTest.success ? 'OK' : supabaseTest.error || `HTTP ${supabaseTest.status}`}`)
  }
  
  console.log('\n' + '═'.repeat(60))
  console.log(`\n📊 RÉSUMÉ: ${report.summary.allTestsPassed ? '✅ TOUS LES TESTS PASSENT' : '⚠️  CERTAINS TESTS ÉCHOUENT'}`)
  console.log(`   Tests réussis: ${report.summary.passedTests}/${report.summary.totalTests}\n`)
  
  // Génère le rapport Markdown
  const docsDir = join(rootDir, 'docs')
  if (!existsSync(docsDir)) {
    mkdirSync(docsDir, { recursive: true })
  }
  
  let markdown = `# 🌐 Rapport de Connectivité Supabase - Production\n\n`
  markdown += `**Date** : ${report.timestamp}\n`
  markdown += `**URL de production** : ${PROD_URL}\n\n`
  
  markdown += `## 📊 Résumé\n\n`
  markdown += `- **Statut global** : ${report.summary.allTestsPassed ? '✅ **SUCCÈS**' : '❌ **ÉCHEC**'}\n`
  markdown += `- **Tests réussis** : ${report.summary.passedTests}/${report.summary.totalTests}\n\n`
  
  markdown += `## 🧪 Détails des Tests\n\n`
  
  markdown += `### 1. Disponibilité de l'Application\n\n`
  markdown += `- **Statut** : ${appTest.success ? '✅ OK' : '❌ ÉCHEC'}\n`
  if (appTest.status) markdown += `- **HTTP Status** : ${appTest.status}\n`
  if (appTest.hasContent !== undefined) markdown += `- **Contenu HTML** : ${appTest.hasContent ? '✅ Présent' : '❌ Vide'} (${appTest.htmlLength} bytes)\n`
  if (appTest.hasAppMount !== undefined) markdown += `- **Point de montage #app** : ${appTest.hasAppMount ? '✅ Trouvé' : '❌ Non trouvé'}\n`
  if (appTest.error) markdown += `- **Erreur** : ${appTest.error}\n`
  markdown += `\n`
  
  markdown += `### 2. Variables d'Environnement dans le Bundle\n\n`
  if (envTest.error) {
    markdown += `- **Statut** : ❌ Erreur\n`
    markdown += `- **Erreur** : ${envTest.error}\n`
  } else {
    markdown += `- **Statut** : ${envTest.success ? '✅ OK' : '⚠️  PARTIEL'}\n`
    markdown += `- **VITE_SUPABASE_URL** : ${envTest.hasSupabaseUrl ? '✅ Trouvée' : '❌ Non trouvée'}\n`
    markdown += `- **VITE_SUPABASE_ANON_KEY** : ${envTest.hasSupabaseKey ? '✅ Trouvée' : '❌ Non trouvée'}\n`
    if (envTest.hasUndefinedError) {
      markdown += `- **⚠️  Erreurs 'undefined'** : Détectées dans le bundle (problème probable)\n`
    }
    if (envTest.scriptUrl) {
      markdown += `- **Script analysé** : ${envTest.scriptUrl}\n`
    }
  }
  markdown += `\n`
  
  markdown += `### 3. Connexion Supabase Directe\n\n`
  if (report.tests.supabaseDirect.skipped) {
    markdown += `- **Statut** : ⚪ Ignoré\n`
    markdown += `- **Raison** : ${report.tests.supabaseDirect.reason}\n`
  } else {
    const supabaseTest = report.tests.supabaseDirect
    markdown += `- **Statut** : ${supabaseTest.success ? '✅ OK' : '❌ ÉCHEC'}\n`
    if (supabaseTest.endpoint) markdown += `- **Endpoint testé** : ${supabaseTest.endpoint}\n`
    if (supabaseTest.status) markdown += `- **HTTP Status** : ${supabaseTest.status}\n`
    if (supabaseTest.error) markdown += `- **Erreur** : ${supabaseTest.error}\n`
  }
  markdown += `\n`
  
  if (!report.summary.allTestsPassed) {
    markdown += `## 💡 Recommandations\n\n`
    
    if (!appTest.success) {
      markdown += `### ❌ Application non disponible\n\n`
      markdown += `- Vérifier que l'application est bien déployée sur Vercel\n`
      markdown += `- Vérifier les logs de déploiement dans Vercel Dashboard\n`
      markdown += `- Vérifier que le domaine est correctement configuré\n\n`
    }
    
    if (!envTest.success || !envTest.hasSupabaseUrl || !envTest.hasSupabaseKey) {
      markdown += `### ⚠️  Variables d'environnement manquantes\n\n`
      markdown += `- Vérifier dans Vercel Dashboard → Settings → Environment Variables\n`
      markdown += `- Assurer que \`VITE_SUPABASE_URL\` et \`VITE_SUPABASE_ANON_KEY\` sont présentes\n`
      markdown += `- **IMPORTANT** : Cocher "Included in Build" pour chaque variable\n`
      markdown += `- Redéployer après modification des variables\n\n`
    }
    
    if (envTest.hasUndefinedError) {
      markdown += `### ⚠️  Erreurs 'undefined' dans le bundle\n\n`
      markdown += `- Les variables d'environnement ne sont probablement pas injectées correctement\n`
      markdown += `- Vérifier que "Included in Build" est coché dans Vercel\n`
      markdown += `- Forcer un nouveau build en faisant un commit vide\n\n`
    }
  }
  
  const reportPath = join(docsDir, 'SUPABASE_CONNECTIVITY_LOG.md')
  writeFileSync(reportPath, markdown, 'utf-8')
  console.log(`✅ Rapport sauvegardé: ${reportPath}\n`)
  
  // Sauvegarde aussi le JSON
  const jsonPath = join(docsDir, 'SUPABASE_CONNECTIVITY_LOG.json')
  writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8')
  
  return report
}

// Exécution
generateConnectivityReport().catch(error => {
  console.error('\n❌ Erreur lors du test de connectivité:', error.message)
  console.error(error.stack)
  process.exit(1)
})

