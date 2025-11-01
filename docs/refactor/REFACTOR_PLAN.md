# 🔁 Plan de Refactorisation — Doogoo v0.2.2 → v0.3.0

**Date de début** : 2025-01-28  
**Objectif** : Rendre Doogoo plus propre, robuste et évolutif sans casser le produit actuel

---

## ✅ Étape 1 — Audit & Nettoyage (TERMINÉE)

### Actions réalisées
- [x] Audit complet du projet (105 fichiers analysés)
- [x] Identification des fichiers obsolètes
- [x] Suppression des pages de debug obsolètes :
  - `LoginPageDebug.vue` (route `/login-debug` supprimée)
  - `LoginPageFallback.vue`
  - `LoginPageSimple.vue`
- [x] Suppression du composant dupliqué :
  - `PropertyCard.vue` (doublon de `properties/PropertyCard.vue`)
  - Correction de l'import dans `dashboard/PropertiesList.vue`
- [x] Création du rapport d'audit : `docs/refactor/AUDIT_CLEANUP.md`
- [x] Validation : Build production réussi ✅

### Fichiers conservés (justification)
- `mockData.js` : Utilisé par `LandingPage.vue` pour les témoignages
- `TestSupabase.vue` : Accessible via `/diagnostics` pour le debug en production

---

## ⏳ Étape 2 — Architecture & Typage

### 2.1 Préparer la migration TypeScript
- [ ] Créer `tsconfig.json` avec configuration Vue 3 + Vite
- [ ] Configurer `tsconfig.json` pour permettre migration progressive (.js + .ts)
- [ ] Ajouter `@vue/tsconfig` comme devDependency
- [ ] Documenter la stratégie de migration dans `docs/refactor/TYPESCRIPT_MIGRATION.md`

### 2.2 Migration progressive des fichiers critiques
- [ ] Renommer `stores/` en `.ts` (un par un, avec tests)
- [ ] Renommer `api/` en `.ts` avec typage strict
- [ ] Ajouter types pour `ApiResponse<T>` et erreurs API
- [ ] Renommer `utils/` en `.ts` progressivement

### 2.3 Configuration ESLint + Prettier
- [ ] Installer `@typescript-eslint/parser` et `eslint-plugin-vue`
- [ ] Créer `.eslintrc.cjs` pour Vue 3 + TypeScript
- [ ] Créer `.prettierrc` avec règles cohérentes
- [ ] Installer `husky` + `lint-staged` pour pre-commit hooks
- [ ] Ajouter script `lint:fix` dans `package.json`

### 2.4 Documenter l'architecture
- [ ] Créer `docs/refactor/ARCHITECTURE_NEW.md` :
  - Structure des dossiers feature-based
  - Conventions de nommage
  - Règles de typage
  - Patterns recommandés

**Estimation** : 2-3 jours

---

## ⏳ Étape 3 — API Layer & Stores

### 3.1 Vérifier couche API unifiée
- [ ] Auditer tous les stores Pinia :
  - Vérifier qu'ils utilisent uniquement `/api/*`
  - Identifier les appels directs à Supabase (si existants)
- [ ] Documenter dans `docs/refactor/API_LAYER_AUDIT.md`

### 3.2 Ajouter résilience API
- [ ] Intégrer `retry` dans toutes les fonctions API
- [ ] Ajouter timeout (ex: 10s) pour chaque requête
- [ ] Implémenter circuit breaker pattern :
  - Détecter les erreurs répétées
  - Activer mode dégradé automatiquement
- [ ] Centraliser gestion d'erreurs dans `apiErrorHandler.js`

### 3.3 Typage API
- [ ] Créer types TypeScript pour `ApiResponse<T>`
- [ ] Typer toutes les fonctions API (ex: `createProperty`, `updatePayment`)
- [ ] Ajouter validation Zod côté client (déjà présent dans certains formulaires)

**Estimation** : 2 jours

---

## ⏳ Étape 4 — Tests & Qualité

### 4.1 Configurer Vitest + Vue Test Utils
- [ ] Vérifier configuration existante (`vitest.config.js`)
- [ ] Créer tests pour stores (ex: `propertiesStore.test.ts`)
- [ ] Créer tests pour utils (ex: `formatters.test.ts`)
- [ ] Créer tests pour composants UI de base (modals, toasts, loaders)

### 4.2 Configurer GitHub Actions
- [ ] Créer workflow `.github/workflows/ci.yml` :
  - Lint (ESLint)
  - Tests unitaires (Vitest)
  - Build production
  - Échec si tests échouent

### 4.3 Couverture de code
- [ ] Objectif : 60% global, 80% sur stores/api
- [ ] Ajouter script `test:coverage` dans `package.json`
- [ ] Configurer seuil minimum dans `vitest.config.js`

**Estimation** : 3-4 jours

---

## ⏳ Étape 5 — Sécurité

### 5.1 Audit policies Supabase
- [ ] Vérifier RLS sur toutes les tables :
  - `properties` → `auth.uid()`
  - `payments` → `auth.uid()`
  - `tenants` → `auth.uid()`
  - `profiles` → `auth.uid()`
- [ ] Documenter dans `docs/refactor/SECURITY_REVIEW.md`

### 5.2 Masquer informations sensibles
- [ ] Supprimer logs contenant emails, tokens
- [ ] Utiliser `console.warn` au lieu de `console.log` en production
- [ ] Ajouter filtres Sentry pour exclure données sensibles

### 5.3 Headers de sécurité
- [ ] Configurer `vercel.json` avec headers :
  - `X-Frame-Options: DENY`
  - `Content-Security-Policy`
  - `Strict-Transport-Security`
- [ ] Tester avec [securityheaders.com](https://securityheaders.com)

**Estimation** : 1-2 jours

---

## ⏳ Étape 6 — Performance & UX

### 6.1 Optimiser chargement
- [ ] Lazy load routes (déjà fait partiellement)
- [ ] Lazy load composants lourds (modals, charts)
- [ ] Ajouter pagination sur `BiensPage` et `PaiementsPage` (50 items/page)
- [ ] Optimiser images (lazy-loading déjà présent)

### 6.2 PWA
- [ ] Vérifier registration Service Worker
- [ ] Générer icônes 72x72 → 512x512 (script existe : `npm run pwa:icons`)
- [ ] Tester offline mode
- [ ] Documenter dans `docs/PWA_VALIDATION_REPORT.md`

### 6.3 Lighthouse
- [ ] Objectif : Score > 90 (Perf, SEO, Best Practices, PWA)
- [ ] Script existant : `npm run audit:lighthouse`
- [ ] Corriger problèmes identifiés

**Estimation** : 2-3 jours

---

## ⏳ Étape 7 — Internationalisation

### 7.1 Stabiliser i18n
- [ ] Vérifier cohérence des clés FR/EN
- [ ] Supprimer emojis ou caractères problématiques
- [ ] S'assurer que toutes les clés sont présentes dans `fr.json` et `en.json`
- [ ] Script de validation : `npm run lint:i18n` (existe déjà)

### 7.2 Préparer migration Tolgee (optionnel)
- [ ] Documenter dans `docs/refactor/I18N_PLAN.md`
- [ ] Évaluer coûts/bénéfices

**Estimation** : 1 jour

---

## ⏳ Étape 8 — DevOps & Delivery

### 8.1 Environnements
- [ ] Séparer staging / production sur Vercel
- [ ] Cloner projet Supabase pour staging
- [ ] Variables d'environnement distinctes

### 8.2 Versionning
- [ ] Créer tags Git : `v0.2.2`, `v0.3.0`, etc.
- [ ] Générer automatiquement `CHANGELOG.md` avec [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)

### 8.3 CI/CD complet
- [ ] Workflow GitHub Actions :
  - Tests → Build → Deploy staging
  - Tests → Build → Deploy production (sur tag)
  - Intégrer `test:i18n` avant build

**Estimation** : 1-2 jours

---

## ⏳ Étape 9 — Monitoring & Diagnostics

### 9.1 Améliorer diagnosticStore
- [ ] Ajouter taux d'erreur API par minute
- [ ] Ajouter durée moyenne de réponse
- [ ] Visualisation sur `/diagnostics` avec graphiques

### 9.2 Sentry
- [ ] Vérifier DSN configuré
- [ ] Ajouter tags contextuels (`user_id`, `route`, `environment`)
- [ ] Configurer alertes email pour erreurs critiques

**Estimation** : 1 jour

---

## ⏳ Étape 10 — Documentation & Onboarding

### 10.1 Réécrire README.md
- [ ] Structure claire avec stack, env, setup rapide
- [ ] Ajouter badges (version, Vue, Supabase, etc.)
- [ ] Liens vers documentation complète

### 10.2 Créer docs/ONBOARDING.md
- [ ] Installation locale
- [ ] Configuration Supabase
- [ ] Tests et build
- [ ] Déploiement

### 10.3 Script d'installation
- [ ] Créer `scripts/setup.js` :
  - Installe dépendances
  - Vérifie variables d'environnement
  - Teste connexion Supabase
- [ ] Ajouter `npm run setup` dans `package.json`

**Estimation** : 1-2 jours

---

## ⏳ Étape 11 — Release v0.3.0

### 11.1 Tests finaux
- [ ] `npm run test && npm run build`
- [ ] Vérifier version déployée sur Vercel
- [ ] Tester toutes les fonctionnalités critiques

### 11.2 Créer tag et release
- [ ] `git tag -a v0.3.0 -m "Refactor complet - Doogoo stable"`
- [ ] `git push origin main --tags`
- [ ] Créer release GitHub avec notes

### 11.3 Documenter release
- [ ] `docs/reports/RELEASE_v0.3.0.md` :
  - Liste des changements
  - Breaking changes (s'il y en a)
  - Guide de migration (si nécessaire)

**Estimation** : 1 jour

---

## 📊 Estimation totale

- **Temps estimé** : 15-20 jours
- **Priorité** : Modulaire (peut être fait sprint par sprint)
- **Risque** : Faible (approche incrémentale)

---

## 🎯 Critères de succès

- [ ] Architecture feature-based + typage partiel TS
- [ ] CI/CD complète avec tests
- [ ] Couche API 100% unifiée et résiliente
- [ ] Sécurité Supabase renforcée
- [ ] Performance optimisée (Lighthouse > 90)
- [ ] i18n stabilisé
- [ ] PWA validée
- [ ] Documentation claire
- [ ] Monitoring prêt production
- [ ] App plus robuste, maintenable et scalable

---

## 📝 Notes importantes

### ⚠️ Précautions
1. **Approche incrémentale** : Chaque étape garde l'app fonctionnelle
2. **Tests avant/après** : Valider à chaque étape
3. **Commits atomiques** : Un commit par changement logique
4. **Rollback possible** : Tags Git à chaque étape majeure

### ✅ Validation continue
- Build production après chaque étape
- Tests unitaires passent
- Aucune régression fonctionnelle

---

**Statut global** : 🔄 En cours (Étape 1 terminée)  
**Prochaine étape** : Étape 2 — Architecture & Typage

