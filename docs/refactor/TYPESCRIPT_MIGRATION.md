# 📘 Migration TypeScript — Doogoo v0.2.2 → v0.3.0

**Date** : 2025-01-28  
**Objectif** : Migration progressive vers TypeScript sans casser l'application

---

## ✅ Configuration initiale (TERMINÉE)

### Fichiers créés

- [x] `tsconfig.json` : Configuration TypeScript principale
- [x] `tsconfig.node.json` : Configuration pour les fichiers Node (Vite, scripts)
- [x] `.eslintrc.cjs` : Configuration ESLint pour Vue 3 + TypeScript
- [x] `.prettierrc` : Configuration Prettier
- [x] `.prettierignore` : Fichiers ignorés par Prettier
- [x] `src/types/api.d.ts` : Types pour la couche API
- [x] `src/types/env.d.ts` : Types pour les variables d'environnement

### Dépendances installées

- [x] `typescript` : Compilateur TypeScript
- [x] `@typescript-eslint/parser` : Parser ESLint pour TypeScript
- [x] `@typescript-eslint/eslint-plugin` : Plugin ESLint pour TypeScript
- [x] `@vue/tsconfig` : Configuration TypeScript pour Vue
- [x] `eslint` : Linter JavaScript/TypeScript
- [x] `eslint-plugin-vue` : Plugin ESLint pour Vue
- [x] `prettier` : Formateur de code
- [x] `husky` : Hooks Git
- [x] `lint-staged` : Lint sur fichiers staged

### Scripts ajoutés

- [x] `npm run lint` : Lint et fix automatique
- [x] `npm run lint:check` : Vérification lint sans fix
- [x] `npm run format` : Format avec Prettier
- [x] `npm run format:check` : Vérification format sans modification

---

## 📋 Stratégie de migration

### Approche progressive

1. **Phase 1** : Configuration (✅ TERMINÉE)
   - Ajouter TypeScript, ESLint, Prettier
   - Créer types de base (`api.d.ts`, `env.d.ts`)

2. **Phase 2** : Types globaux
   - Créer types pour stores, composables, utils
   - Permettre `.js` et `.ts` en parallèle

3. **Phase 3** : Migration fichiers critiques
   - `api/*.js` → `api/*.ts` (un par un)
   - `stores/*.js` → `stores/*.ts` (un par un)
   - `utils/*.js` → `utils/*.ts` (un par un)

4. **Phase 4** : Composants Vue
   - Ajouter `<script setup lang="ts">` progressivement
   - Typer les props et emits

5. **Phase 5** : Finalisation
   - Activer `strict: true` dans `tsconfig.json`
   - Migrer tous les fichiers `.js` restants

---

## 📁 Types créés

### `src/types/api.d.ts`

Types pour :

- `ApiResponse<T>` : Réponse standardisée API
- `ApiError` : Erreur API standardisée
- `Property` : Propriété immobilière
- `Tenant` : Locataire
- `Payment` : Paiement
- `UserProfile` : Profil utilisateur
- `UserSettings` : Paramètres utilisateur

### `src/types/env.d.ts`

Types pour :

- Variables d'environnement (`VITE_*`)
- Auto-complétion dans le code

---

## 🔧 Configuration TypeScript

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true, // Activé pour nouveaux fichiers
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Caractéristiques

- ✅ Compatible avec `.js` et `.ts` en parallèle
- ✅ Support Vue 3 SFC (Single File Components)
- ✅ Path aliases (`@/`) configurés
- ✅ Strict mode activé (peut être désactivé temporairement si nécessaire)

---

## 🎯 Ordre de migration recommandé

### Priorité 1 : Couche API (haute valeur)

1. `api/properties.js` → `api/properties.ts`
2. `api/payments.js` → `api/payments.ts`
3. `api/tenants.js` → `api/tenants.ts`

### Priorité 2 : Utils (haute réutilisation)

1. `utils/formatters.js` → `utils/formatters.ts`
2. `utils/constants.js` → `utils/constants.ts`
3. `utils/validators.js` → `utils/validators.ts`
4. `utils/retry.js` → `utils/retry.ts`
5. `utils/apiErrorHandler.js` → `utils/apiErrorHandler.ts`

### Priorité 3 : Stores (logique métier)

1. `stores/authStore.js` → `stores/authStore.ts`
2. `stores/propertiesStore.js` → `stores/propertiesStore.ts`
3. `stores/paymentsStore.js` → `stores/paymentsStore.ts`
4. `stores/tenantsStore.js` → `stores/tenantsStore.ts`
5. `stores/settingsStore.js` → `stores/settingsStore.ts`

### Priorité 4 : Composables

1. `composables/useSEO.js` → `composables/useSEO.ts`
2. `composables/usePullToRefresh.js` → `composables/usePullToRefresh.ts`
3. `composables/useLingui.js` → `composables/useLingui.ts`

### Priorité 5 : Composants Vue

- Ajouter `<script setup lang="ts">` progressivement
- Typer les props et emits

---

## ✅ Checklist migration d'un fichier

Pour chaque fichier migré :

- [ ] Renommer `.js` → `.ts`
- [ ] Ajouter types pour toutes les fonctions exportées
- [ ] Typer les paramètres et valeurs de retour
- [ ] Vérifier imports/exports
- [ ] Lancer `npm run lint` et corriger les erreurs
- [ ] Lancer `npm run format` pour formater
- [ ] Tester que le fichier fonctionne
- [ ] Vérifier que le build passe (`npm run build`)
- [ ] Commit avec message descriptif

---

## 🚨 Règles importantes

### Compatibilité .js / .ts

- Les fichiers `.js` peuvent importer des fichiers `.ts`
- Les fichiers `.ts` peuvent importer des fichiers `.js` (avec types partiels)
- Vue SFC peuvent utiliser `<script setup lang="ts">` ou `<script setup>` selon le fichier

### Strict mode

- Actuellement `strict: true` dans `tsconfig.json`
- Si un fichier `.js` cause des erreurs, on peut temporairement désactiver strict pour ce fichier
- Objectif : Tous les fichiers `.ts` doivent respecter strict mode

### Types génériques

- Utiliser `ApiResponse<T>` pour toutes les réponses API
- Utiliser `Partial<T>` pour les updates
- Utiliser `Pick<T, K>` ou `Omit<T, K>` pour sélectionner des champs

---

## 📊 Progression

### Configuration

- [x] TypeScript configuré
- [x] ESLint configuré
- [x] Prettier configuré
- [x] Husky + lint-staged configurés
- [x] Types de base créés

### Migration fichiers

- [ ] API layer (0/3)
- [ ] Utils (0/6)
- [ ] Stores (0/10)
- [ ] Composables (0/5)
- [ ] Composants Vue (0/X)

---

## 🔍 Exemple de migration

### Avant (`utils/formatters.js`)

```javascript
export function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(amount)
}
```

### Après (`utils/formatters.ts`)

```typescript
export function formatCurrency(
  amount: number,
  currency: 'EUR' | 'USD' | 'GBP' | 'XOF' = 'EUR'
): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(amount)
}
```

---

**Statut** : ✅ Configuration terminée  
**Prochaine étape** : Migration de `api/properties.js` → `api/properties.ts`
