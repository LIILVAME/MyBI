# 🏗️ Architecture — Doogoo v0.3.0

**Date** : 2025-01-28  
**Objectif** : Documenter la nouvelle architecture et les conventions du projet

---

## 📁 Structure des dossiers

```
src/
├── api/               # Couche API Supabase (unifiée)
│   ├── index.js       # Exports et helpers communs
│   ├── properties.js  # API des biens immobiliers
│   ├── payments.js    # API des paiements
│   └── tenants.js     # API des locataires
│
├── components/
│   ├── ui/            # Composants UI réutilisables (à créer)
│   │   ├── Button.vue
│   │   ├── Modal.vue
│   │   ├── Input.vue
│   │   └── ...
│   │
│   ├── features/      # Composants métier (à créer)
│   │   ├── properties/
│   │   ├── payments/
│   │   └── ...
│   │
│   ├── auth/          # Authentification
│   ├── common/        # Composants communs (Toast, Loader, etc.)
│   ├── dashboard/     # Dashboard spécifique
│   ├── payments/      # Paiements
│   ├── properties/    # Biens immobiliers
│   ├── settings/      # Paramètres
│   ├── stats/         # Statistiques
│   ├── tenants/       # Locataires
│   └── reports/       # Rapports
│
├── composables/       # Composables Vue réutilisables
│   ├── useSEO.js
│   ├── usePullToRefresh.js
│   ├── useLingui.js
│   └── ...
│
├── stores/            # Stores Pinia
│   ├── authStore.js
│   ├── propertiesStore.js
│   ├── paymentsStore.js
│   └── ...
│
├── types/             # Types TypeScript (nouveau)
│   ├── api.d.ts       # Types API
│   └── env.d.ts       # Types variables d'environnement
│
├── utils/             # Utilitaires
│   ├── formatters.js
│   ├── validators.js
│   ├── retry.js
│   └── ...
│
├── locales/           # Traductions i18n
│   ├── i18n/          # Fichiers JSON source
│   ├── compiled/      # Fichiers compilés (auto-générés)
│   └── ...
│
├── router/            # Vue Router
│   └── index.js
│
├── lib/               # Bibliothèques externes configurées
│   └── supabaseClient.js
│
├── layouts/           # Layouts Vue
│   └── AuthLayout.vue
│
├── pages/             # Pages de l'application
│   ├── DashboardPage.vue
│   ├── BiensPage.vue
│   └── ...
│
└── App.vue            # Composant racine
```

---

## 🎯 Conventions de nommage

### Fichiers

- **Composants Vue** : PascalCase (`PropertyCard.vue`)
- **Pages** : PascalCase avec suffixe `Page` (`DashboardPage.vue`)
- **Stores** : camelCase avec suffixe `Store` (`authStore.js`)
- **Composables** : camelCase avec préfixe `use` (`useSEO.js`)
- **Utils** : camelCase (`formatters.js`)
- **Types TypeScript** : camelCase avec suffixe `.d.ts` (`api.d.ts`)

### Variables et fonctions

- **Composants** : PascalCase (`<PropertyCard />`)
- **Variables/constantes** : camelCase (`const isLoading = ref(false)`)
- **Fonctions** : camelCase (`const fetchProperties = async () => {})`)
- **Types/Interfaces** : PascalCase (`interface ApiResponse<T>`)

### Routes

- **Paths** : kebab-case (`/biens`, `/paiements`)
- **Noms** : PascalCase (`name: 'Dashboard'`)

---

## 📘 Typage TypeScript

### Stratégie de migration

1. **Phase actuelle** : `.js` et `.ts` cohabitent
2. **Migration progressive** : Un fichier à la fois
3. **Strict mode** : Activé pour nouveaux fichiers `.ts`

### Types standardisés

#### `ApiResponse<T>`

```typescript
interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
```

#### Utilisation dans les stores

```typescript
const result: ApiResponse<Property> = await propertiesApi.createProperty(data)
if (result.success && result.data) {
  // ...
}
```

---

## 🔧 Règles ESLint

### Vue

- `vue/multi-word-component-names`: `off` (ex: `Toast`, `Sidebar`)
- `vue/require-explicit-emits`: `warn` (forcé pour clarté)
- `vue/no-v-html`: `warn` (sécurité)

### TypeScript

- `@typescript-eslint/no-unused-vars`: `warn` (avec exceptions `_*`)
- `@typescript-eslint/no-explicit-any`: `warn`

### Général

- `no-console`: `off` en dev, `warn` en prod
- `no-debugger`: `warn` en dev, `error` en prod
- `prefer-const`: `warn`
- `no-var`: `error`

---

## 🎨 Formatage Prettier

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "none",
  "arrowParens": "avoid"
}
```

---

## 🏪 Stores Pinia

### Structure standard

```javascript
export const useMyStore = defineStore('myStore', () => {
  // State (ref)
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const total = computed(() => items.value.length)

  // Actions
  const fetchItems = async () => {
    // ...
  }

  return {
    // State
    items,
    loading,
    error,
    // Computed
    total,
    // Actions
    fetchItems
  }
})
```

### Règles

- ✅ Toujours passer par `/api/*` (jamais Supabase direct)
- ✅ Gérer `loading` et `error` states
- ✅ Utiliser `ApiResponse<T>` pour typage (quand migré en TS)

---

## 🌐 Internationalisation (i18n)

### Structure

- **Source** : `src/locales/i18n/{fr,en}.json`
- **Compilé** : `src/locales/compiled/{fr,en}.js` (auto-généré)

### Utilisation

```vue
<script setup>
import { useI18n } from '@/composables/useLingui'
const { t } = useI18n()
</script>

<template>
  <h1>{{ $t('dashboard.title') }}</h1>
  <p>{{ t('common.welcome', { name: 'John' }) }}</p>
</template>
```

### Clés de traduction

- Format : `feature.section.key` (ex: `auth.login.title`)
- Noms cohérents entre FR et EN
- Support interpolation : `{{ count }} items`

---

## 🔐 Sécurité

### Variables d'environnement

- Préfixe `VITE_*` pour variables publiques
- Jamais de secrets dans le code
- Types définis dans `src/types/env.d.ts`

### Supabase RLS

- Toutes les tables protégées par `auth.uid()`
- Policies documentées dans Supabase Dashboard

---

## 📦 Imports

### Alias `@/`

```javascript
import { useAuthStore } from '@/stores/authStore'
import PropertyCard from '@/components/properties/PropertyCard.vue'
import { formatCurrency } from '@/utils/formatters'
```

### Ordre des imports

1. Vue core
2. Vue Router / Pinia
3. Composants externes
4. Composants locaux (`@/components`)
5. Stores (`@/stores`)
6. Utils (`@/utils`)
7. Types (`@/types`)
8. CSS

---

## ✅ Checklist avant commit

- [ ] `npm run lint` passe sans erreur
- [ ] `npm run format` appliqué
- [ ] `npm run build` réussit
- [ ] Tests passent (si applicable)
- [ ] Types TypeScript corrects (si fichier `.ts`)

---

## 🔄 Migration progressive

### Ordre recommandé

1. ✅ Configuration TypeScript, ESLint, Prettier
2. ⏳ Types globaux (`types/*.d.ts`)
3. ⏳ API layer (`api/*.js` → `api/*.ts`)
4. ⏳ Utils (`utils/*.js` → `utils/*.ts`)
5. ⏳ Stores (`stores/*.js` → `stores/*.ts`)
6. ⏳ Composables (`composables/*.js` → `composables/*.ts`)
7. ⏳ Composants Vue (ajouter `<script setup lang="ts">`)

---

**Statut** : 📋 Documenté  
**Prochaine étape** : Migration `api/properties.js` → `api/properties.ts`
