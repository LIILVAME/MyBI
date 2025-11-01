# 🔍 Audit & Nettoyage — Doogoo v0.2.2

**Date** : 2025-01-28  
**Objectif** : Identifier et supprimer les fichiers obsolètes, redondants ou inutilisés

---

## 📊 Statistiques du projet

- **Fichiers Vue** : 70 fichiers `.vue`
- **Fichiers JS** : 35 fichiers `.js`
- **Documentation** : 50+ fichiers dans `/docs`
- **Total fichiers src** : ~105 fichiers

---

## 🔴 Fichiers obsolètes identifiés

### Pages de debug/login alternatives

#### 1. `src/pages/LoginPageDebug.vue`
- **Statut** : ❌ Non référencé
- **Usage** : Page de debug pour résoudre des problèmes de login
- **Action** : ⚠️ À supprimer (garder uniquement `LoginPage.vue`)

#### 2. `src/pages/LoginPageFallback.vue`
- **Statut** : ❌ Non référencé
- **Usage** : Version fallback du login
- **Action** : ⚠️ À supprimer

#### 3. `src/pages/LoginPageSimple.vue`
- **Statut** : ❌ Non référencé
- **Usage** : Version simplifiée du login
- **Action** : ⚠️ À supprimer

### Composants de test/dev

#### 4. `src/components/dev/TestSupabase.vue`
- **Statut** : ⚠️ Composant de test
- **Usage** : Test de connexion Supabase (accessible via `/diagnostics`)
- **Action** : ⚠️ À vérifier si utilisé dans `DiagnosticPage.vue`, sinon supprimer

### Composants redondants

#### 5. `src/components/PropertyCard.vue`
- **Statut** : ⚠️ Dupliqué
- **Problème** : Il existe déjà `src/components/properties/PropertyCard.vue`
- **Action** : ⚠️ Vérifier usage, puis supprimer le doublon

### Données mockées

#### 6. `src/data/mockData.js`
- **Statut** : ⚠️ Probablement obsolète
- **Usage** : Données mockées pour développement
- **Action** : ⚠️ Vérifier si utilisé, sinon supprimer (Supabase est maintenant la source de vérité)

---

## ✅ Fichiers à conserver

### Pages principales
- ✅ `LoginPage.vue` (version principale)
- ✅ `SignupPage.vue`
- ✅ `DashboardPage.vue`
- ✅ `BiensPage.vue`
- ✅ `PaiementsPage.vue`
- ✅ `LocatairesPage.vue`
- ✅ `StatsPage.vue`
- ✅ `ReportsPage.vue`
- ✅ `AlertsPage.vue`
- ✅ `ParametresPage.vue`
- ✅ `ConfirmEmailPage.vue`
- ✅ `ResetPasswordPage.vue`
- ✅ `LandingPage.vue`
- ✅ `DiagnosticPage.vue` (pour le debug en production)

### Composants
- ✅ Tous les composants dans `/components/*/` sauf ceux listés ci-dessus
- ✅ `PropertyCard.vue` dans `/components/properties/` (version à conserver)

---

## 📁 Structure actuelle vs structure cible

### Structure actuelle
```
src/
├── components/
│   ├── PropertyCard.vue (DUPLIQUÉ)
│   └── ...
├── pages/
│   ├── LoginPage.vue ✅
│   ├── LoginPageDebug.vue ❌
│   ├── LoginPageFallback.vue ❌
│   ├── LoginPageSimple.vue ❌
│   └── ...
├── data/
│   └── mockData.js ⚠️
└── ...
```

### Structure cible (Étape 1)
```
src/
├── components/
│   ├── ui/              # À créer
│   ├── features/        # À créer
│   └── ...
├── pages/
│   └── LoginPage.vue ✅ (un seul)
└── ...
```

---

## 🧹 Actions de nettoyage

### Étape 1.1 — Supprimer les fichiers obsolètes

```bash
# Pages de debug obsolètes
rm src/pages/LoginPageDebug.vue
rm src/pages/LoginPageFallback.vue
rm src/pages/LoginPageSimple.vue

# Composant PropertyCard dupliqué (après vérification)
# rm src/components/PropertyCard.vue

# Données mockées (après vérification)
# rm src/data/mockData.js
```

### Étape 1.2 — Vérifier les imports non utilisés

- ✅ Fichiers identifiés : Aucun import évident vers les fichiers obsolètes
- ⚠️ À vérifier : Routes dans `router/index.js` référencent-elles les pages obsolètes ?

### Étape 1.3 — Réorganiser la structure (prochaine étape)

- Créer `/components/ui/` pour composants UI réutilisables
- Créer `/components/features/` pour composants métier
- Déplacer les composants dans leur catégorie appropriée

---

## 📝 Notes importantes

### ⚠️ Précautions avant suppression

1. **Vérifier les routes** : S'assurer que `router/index.js` ne référence pas les pages obsolètes
2. **Vérifier les imports** : Rechercher toute référence aux fichiers à supprimer
3. **Sauvegarder** : Commiter avant suppression (possibilité de rollback)
4. **Tester** : Vérifier que l'app fonctionne après suppression

### ✅ Validation après nettoyage

- [ ] L'app démarre sans erreur
- [ ] Toutes les routes fonctionnent
- [ ] Aucune erreur console
- [ ] Build production réussi (`npm run build`)

---

## 📊 Rapport de nettoyage

### Fichiers supprimés
- [ ] `LoginPageDebug.vue`
- [ ] `LoginPageFallback.vue`
- [ ] `LoginPageSimple.vue`
- [ ] `PropertyCard.vue` (dupliqué, après vérification)
- [ ] `mockData.js` (si non utilisé)

### Fichiers conservés
- ✅ `LoginPage.vue` (version principale)
- ✅ `DiagnosticPage.vue` (utile pour le debug en production)
- ✅ Tous les autres composants et pages

### Prochaines étapes
1. ✅ Créer ce rapport d'audit
2. ⏳ Vérifier les routes et imports
3. ⏳ Supprimer les fichiers obsolètes
4. ⏳ Réorganiser la structure des composants
5. ⏳ Tester et valider

---

**Statut** : 🔍 Audit en cours  
**Prochaine action** : Vérification des routes et imports avant suppression

