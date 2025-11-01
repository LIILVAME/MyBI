# ✅ Checklist de Déploiement Vercel - Doogoo v0.2.2

**Date** : 2025-11-01  
**Version** : v0.2.2  
**Statut** : Production Ready

---

## 🔧 Configuration Vercel

### Build Command
Dans Vercel Dashboard → Settings → Git → Build & Development Settings :

```
npm run test:i18n && npm run build
```

**Important** : Ceci garantit que le test i18n s'exécute avant chaque build et bloque le déploiement en cas d'erreur.

### Variables d'Environnement Requises

Vérifier dans Vercel Dashboard → Settings → Environment Variables :

- ✅ `VITE_SUPABASE_URL` : URL de votre projet Supabase
- ✅ `VITE_SUPABASE_ANON_KEY` : Clé anonyme Supabase
- ✅ `VITE_ADMIN_EMAIL` : Email administrateur (optionnel)
- ⚠️ `VITE_SENTRY_DSN` : DSN Sentry (optionnel, pour monitoring)
- ⚠️ `VITE_APP_NAME` : Nom de l'application (optionnel)

---

## 🚀 Déploiement

### Étape 1 : Vérifier la Configuration
1. Ouvrir [https://vercel.com](https://vercel.com)
2. Sélectionner le projet **Doogoo**
3. Aller dans **Settings → Git → Build & Development Settings**
4. Vérifier que **Build Command** contient : `npm run test:i18n && npm run build`
5. Sauvegarder si modification

### Étape 2 : Force Redeploy
1. Dans le Dashboard Vercel, ouvrir le dernier déploiement
2. Cliquer sur **⋮** (trois points) → **Redeploy**
3. Sélectionner **Force Redeploy**
4. Choisir la branche **main**
5. Confirmer le redéploiement

### Étape 3 : Vérifier les Logs
1. Pendant le déploiement, surveiller les logs
2. Vérifier que `npm run test:i18n` s'exécute et passe ✅
3. Vérifier que `npm run build` se termine sans erreur
4. Vérifier que le déploiement réussit

---

## ✅ Validation Post-Déploiement

### 1. Tests Fonctionnels
Visiter [https://doogoo.vercel.app/login](https://doogoo.vercel.app/login)

- [ ] Page de login s'affiche correctement
- [ ] Aucune erreur dans la console (F12)
- [ ] Aucune erreur `Invalid linked format`
- [ ] Formulaire de connexion fonctionnel

### 2. Tests i18n
- [ ] Changer la langue en FR → Textes en français
- [ ] Changer la langue en EN → Textes en anglais
- [ ] Préférence de langue persistée après refresh
- [ ] Tous les textes traduits correctement

### 3. Tests Responsive
- [ ] Mobile (iPhone/Android) : Interface adaptée
- [ ] Tablette : Interface adaptée
- [ ] Desktop : Interface complète

### 4. Tests PWA
- [ ] Installation en tant qu'application (mobile)
- [ ] Fonctionnement hors ligne (Service Worker)
- [ ] Icône et manifest corrects

---

## 🔍 Vérifications Console

Ouvrir la console navigateur (F12) et vérifier :

### Erreurs à Éviter
- ❌ `SyntaxError: Invalid linked format`
- ❌ `Uncaught TypeError`
- ❌ `Failed to load resource`
- ❌ `Network request failed`

### Messages Normaux
- ✅ `✅ Service Worker enregistré`
- ✅ `✅ Application prête hors ligne`
- ✅ `✅ i18n initialisé`

---

## 📊 Monitoring

### Logs Vercel
- Vérifier les logs de build pour s'assurer que le test i18n passe
- Vérifier les logs de runtime pour détecter les erreurs

### Sentry (si configuré)
- Vérifier que les erreurs critiques sont capturées
- Surveiller les erreurs i18n en production

---

## 🐛 Dépannage

### Le build échoue avec une erreur i18n
1. Exécuter localement : `npm run test:i18n`
2. Corriger les erreurs détectées
3. Commit et push
4. Redéployer

### L'erreur "Invalid linked format" persiste
1. Vérifier que tous les emojis sont supprimés : `grep -r "📄\|📧\|✅\|❌\|⚠️" src/locales/i18n/`
2. Vérifier la configuration i18n dans `src/i18n.js`
3. Vérifier les logs Vercel pour voir quelle traduction cause l'erreur
4. Corriger et redéployer

### Les traductions ne s'affichent pas
1. Vérifier que les fichiers JSON sont valides : `npm run lint:i18n`
2. Vérifier que la langue est bien définie dans `settingsStore`
3. Vérifier la console pour les erreurs de chargement

---

## 📝 Notes

- Le test i18n bloque automatiquement le déploiement si une erreur est détectée
- Tous les emojis ont été supprimés pour éviter les erreurs de parsing
- La configuration i18n est optimisée pour la production
- Le système est prêt pour l'ajout de nouvelles langues

---

## ✅ Checklist Finale

- [ ] Build Command configuré dans Vercel
- [ ] Variables d'environnement définies
- [ ] Force Redeploy effectué
- [ ] Tests fonctionnels passés
- [ ] Tests i18n passés
- [ ] Tests responsive passés
- [ ] Aucune erreur console
- [ ] Application stable en production

**Date de validation** : _______________  
**Validé par** : _______________

