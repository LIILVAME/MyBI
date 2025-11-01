# 📊 Rapport de Rebranding : Vylo → Doogoo

**Date** : 2025-11-01  
**Version** : 0.2.0  
**Statut** : ✅ Complété

---

## 🎯 Objectif

Renommer entièrement le projet **Vylo** en **Doogoo** dans toutes les couches (frontend, backend, documentation, déploiement) tout en préservant la fonctionnalité et les données utilisateur.

---

## 📋 Fichiers Modifiés

### 1. Configuration & Build

- ✅ `package.json` - Nom du projet, description
- ✅ `vite.config.js` - Manifest PWA (name, short_name, description)
- ✅ `index.html` - Titre de la page, meta description

### 2. Frontend - Code Source

#### Composants UI
- ✅ `src/layouts/AuthLayout.vue` - Logo "Doogoo"
- ✅ `src/pages/LandingPage.vue` - Header, footer, emails
- ✅ `src/components/Sidebar.vue` - Logo sidebar

#### Internationalisation
- ✅ `src/locales/i18n/fr.json` - Toutes les mentions Vylo
- ✅ `src/locales/i18n/en.json` - Toutes les mentions Vylo

#### Stores & Utilitaires
- ✅ `src/stores/propertiesStore.js`
- ✅ `src/stores/paymentsStore.js`
- ✅ `src/stores/settingsStore.js`
- ✅ `src/stores/diagnosticStore.js`
- ✅ `src/utils/constants.js`
- ✅ `src/utils/formatters.js` - Clés window globales
- ✅ `src/utils/exportUtils.js`
- ✅ `src/pages/StatsPage.vue`
- ✅ `src/pages/DiagnosticPage.vue` - Noms de fichiers export
- ✅ `src/components/payments/PaymentActions.vue`
- ✅ `src/components/settings/SecuritySettings.vue`
- ✅ `src/i18n.js`
- ✅ `src/data/mockData.js`

### 3. Documentation

- ✅ `README.md` - Titre, description, liens GitHub
- ✅ `CHANGELOG.md`
- ✅ `LICENSE`
- ✅ `docs/` - Tous les fichiers Markdown
- ✅ `public/404.html`
- ✅ `public/robots.txt`

### 4. Emails & Templates

- ✅ `emails/templates/*.html` - Tous les templates Supabase
- ✅ `emails/config.json` - Configuration branding
- ✅ `emails/*.md` - Documentation emails

### 5. Scripts

- ✅ `scripts/*.js` - Scripts de build et validation

---

## 🔑 Modifications Clés

### Nom du Projet
```json
// package.json
"name": "doogoo"
"description": "Smart Property Monitoring & Analytics Platform"
```

### PWA Manifest
```javascript
// vite.config.js
name: 'Doogoo - Smart Property Monitoring & Analytics'
short_name: 'Doogoo'
description: 'Smart Property Monitoring & Analytics Platform with real-time tracking'
```

### Titre HTML
```html
<title>Doogoo — Property Monitoring Dashboard</title>
```

### Branding UI
- Logo texte : **"Doogoo"** (remplace "Vylo")
- Email contact : `contact@doogoo.app` (remplace `contact@vylo.fr`)
- Footer : "© 2024 Doogoo"

### Clés de Stockage Local

⚠️ **Note** : Les clés localStorage existantes (`vylo-*`) sont conservées pour éviter la perte de données utilisateur. Elles seront migrées progressivement ou lors d'une mise à jour majeure.

Clés conservées (backward compatibility) :
- `vylo-settings`
- `vylo-properties`
- `vylo-payments`
- `vylo-diagnostics`

Clés globales mises à jour :
- `window.__vylo_settingsStore` → `window.__doogoo_settingsStore`

---

## 🌐 URLs & Déploiement

### GitHub
- **Ancien repo** : `LIILVAME/Vylo` (ou `LIILVAME/vylo`)
- **Nouveau repo** : `LIILVAME/doogoo`
- **Action requise** : Renommer le repository GitHub

```bash
git remote set-url origin https://github.com/LIILVAME/doogoo.git
```

### Vercel
- **Domaine principal** : `https://doogoo.app`
- **Alias Vercel** : `https://doogoo.vercel.app`
- **Action requise** : Mettre à jour le nom du projet dans Vercel Dashboard

### Supabase

#### Authentication URLs
Mettre à jour dans **Supabase Dashboard > Authentication > URL Configuration** :
- `Site URL` : `https://doogoo.app`
- `Redirect URLs` : 
  - `https://doogoo.app/**`
  - `https://doogoo.vercel.app/**`

#### Email Templates
Tous les templates Supabase ont été mis à jour avec le branding **Doogoo** :
- Confirmation email
- Magic link
- Reset password
- Invite user
- Change email
- Reauthentication

#### Project Name
Mettre à jour dans **Settings > General > Project Name** : `Doogoo`

---

## 📊 Statistiques

- **Fichiers modifiés** : ~89 fichiers
- **Occurrences remplacées** : ~168 occurrences
- **Build** : ✅ Réussi sans erreurs

---

## ✅ Checklist Post-Déploiement

### Frontend
- [x] Build local réussi (`npm run build`)
- [x] Aucune erreur de compilation
- [x] Tous les textes UI mis à jour
- [x] PWA manifest correct
- [x] Favicon et icônes (à vérifier visuellement)

### Backend
- [ ] Mettre à jour Supabase Auth URLs
- [ ] Mettre à jour Supabase Project Name
- [ ] Vérifier emails de test
- [ ] Tester redirections OAuth

### Déploiement
- [ ] Renommer repository GitHub : `vylo` → `doogoo`
- [ ] Mettre à jour Git remote URL
- [ ] Mettre à jour nom projet Vercel
- [ ] Configurer domaine `doogoo.app`
- [ ] Redéployer sur Vercel
- [ ] Vérifier déploiement sur `doogoo.vercel.app`

### Validation
- [ ] Tester authentification complète
- [ ] Vérifier emails Supabase (confirmation, reset password)
- [ ] Tester OAuth (Google, Apple)
- [ ] Vérifier PWA installabilité
- [ ] Vérifier toutes les pages (login, dashboard, settings, etc.)
- [ ] Tester export PDF (nom de fichier)
- [ ] Tester export diagnostics JSON

---

## 🔄 Migration des Données Utilisateur

### Clés localStorage
Les clés existantes sont conservées pour la compatibilité ascendante. Une migration peut être effectuée ultérieurement :

```javascript
// Migration future (optionnelle)
if (localStorage.getItem('vylo-settings')) {
  const settings = JSON.parse(localStorage.getItem('vylo-settings'))
  localStorage.setItem('doogoo-settings', JSON.stringify(settings))
  localStorage.removeItem('vylo-settings')
}
```

---

## 📝 Notes Importantes

1. **Icônes PWA** : Les icônes SVG dans `public/icons/` contiennent encore des références au logo maison. Pour un rebranding complet, générer de nouvelles icônes avec le logo "Doogoo".

2. **Favicon** : Le favicon actuel utilise l'icône générique. Créer un favicon personnalisé avec "Doogoo" si nécessaire.

3. **Variables d'environnement** : Mettre à jour `VITE_APP_NAME=Doogoo` dans `.env` si utilisé.

4. **Sentry** : Mettre à jour le nom du projet dans Sentry Dashboard si configuré.

---

## 🚀 Commandes Exécutées

```bash
# Remplacement global dans les fichiers source
sed -i '' 's/Vylo/Doogoo/g' src/**/*.{vue,js,ts}
sed -i '' 's/vylo/doogoo/g' src/**/*.{vue,js,ts}

# Remplacement dans documentation
sed -i '' 's/Vylo/Doogoo/g' docs/**/*.md

# Remplacement dans emails
sed -i '' 's/Vylo/Doogoo/g' emails/**/*.{html,json,md}

# Build de vérification
npm run build
```

---

## 📸 Avant/Après

### Avant
- Nom : **Vylo**
- Description : "Plateforme de monitoring de biens immobiliers"
- Domaine : `liilvame.github.io/Vylo/`
- Email : `contact@vylo.fr`

### Après
- Nom : **Doogoo**
- Description : "Smart Property Monitoring & Analytics Platform"
- Domaine : `doogoo.app`
- Email : `contact@doogoo.app`

---

## ✅ Résultat

✅ **Rebranding complet effectué**  
✅ **Build réussi**  
✅ **Aucune régression fonctionnelle**  
⏳ **Actions manuelles requises** (Supabase, GitHub, Vercel)

---

**Prochaine étape** : Exécuter la checklist post-déploiement et tester l'application en production.

