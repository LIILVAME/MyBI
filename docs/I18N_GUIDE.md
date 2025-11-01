# Guide i18n - Système de traduction Vylo

## 📋 Vue d'ensemble

Vylo utilise **vue-i18n** pour la gestion multilingue (FR 🇫🇷 / EN 🇺🇸).

Le système est centralisé dans :
- **Configuration** : `src/i18n.js`
- **Traductions FR** : `src/locales/i18n/fr.json`
- **Traductions EN** : `src/locales/i18n/en.json`

---

## 🎯 Utilisation dans les composants

### Dans les templates (recommandé)

```vue
<template>
  <h1>{{ $t('dashboard.title') }}</h1>
  <p>{{ $t('dashboard.subtitle') }}</p>
  <button>{{ $t('common.save') }}</button>
</template>
```

### Dans le script (composition API)

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const message = computed(() => t('login.error'))
</script>
```

### Avec des paramètres dynamiques

```vue
<template>
  <p>{{ $t('alerts.message', { count: 5 }) }}</p>
</template>
```

```vue
<script setup>
const { t } = useI18n()
const message = t('reports.summary.text', {
  startDate: '01/01/2025',
  endDate: '31/01/2025',
  revenue: '12 450 €',
  occupancy: 92
})
</script>
```

---

## 📁 Structure des fichiers de traduction

Les fichiers JSON sont organisés par **sections** :

```json
{
  "common": { ... },      // Textes communs (boutons, labels)
  "dashboard": { ... },   // Page Dashboard
  "properties": { ... },  // Page Biens
  "payments": { ... },    // Page Paiements
  "login": { ... },       // Page Login
  "settings": { ... },    // Page Paramètres
  ...
}
```

### Exemple de structure complète

```json
{
  "common": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "error": "Erreur"
  },
  "dashboard": {
    "title": "Tableau de bord",
    "subtitle": "Vue d'ensemble"
  }
}
```

---

## ➕ Ajouter une nouvelle traduction

### Étape 1 : Ajouter la clé dans `fr.json`

```json
{
  "properties": {
    "myNewKey": "Mon nouveau texte"
  }
}
```

### Étape 2 : Ajouter la traduction anglaise dans `en.json`

```json
{
  "properties": {
    "myNewKey": "My new text"
  }
}
```

### Étape 3 : Utiliser dans le composant

```vue
<template>
  <p>{{ $t('properties.myNewKey') }}</p>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
// Ou dans le script : const message = t('properties.myNewKey')
</script>
```

---

## 🔍 Structure des clés de traduction

Les clés sont organisées par **domaine fonctionnel** :

- `common.*` : Textes communs (boutons, labels, messages génériques)
- `sidebar.*` : Menu de navigation
- `dashboard.*` : Page tableau de bord
- `properties.*` : Gestion des biens immobiliers
- `payments.*` : Suivi des paiements
- `tenants.*` : Gestion des locataires
- `alerts.*` : Système d'alertes
- `settings.*` : Paramètres utilisateur
- `login.*` : Authentification
- `security.*` : Sécurité et mot de passe
- `stats.*` : Statistiques et analyses
- `reports.*` : Rapports et exports
- `landing.*` : Page d'accueil publique

---

## ✅ Checklist de traduction

Avant de marquer un composant comme "traduit" :

- [ ] Tous les textes statiques utilisent `$t()` ou `t()`
- [ ] `useI18n` est importé dans le `<script setup>`
- [ ] Les clés sont ajoutées dans `fr.json` et `en.json`
- [ ] Les clés suivent la structure hiérarchique (domaine.sous-domaine.clé)
- [ ] Pas de doublons dans les fichiers JSON
- [ ] Test du changement de langue dans l'interface

---

## 🐛 Dépannage

### La traduction ne s'affiche pas

1. Vérifier que la clé existe dans `fr.json` et `en.json`
2. Vérifier l'import de `useI18n` dans le composant
3. Vérifier la syntaxe : `{{ $t('domain.key') }}` (pas `$t(domain.key)`)
4. Vérifier dans la console les erreurs de traduction manquante

### Erreur : "Key 'xxx' not found"

- Vérifier l'orthographe exacte de la clé
- Vérifier que la clé existe dans les deux fichiers (fr.json et en.json)
- Vérifier la structure hiérarchique (point de séparation)

---

## 📊 État de la traduction (v1.0)

### ✅ Composants traduits

- ✅ `DashboardPage.vue`
- ✅ `BiensPage.vue`
- ✅ `PaiementsPage.vue`
- ✅ `LocatairesPage.vue`
- ✅ `AlertsPage.vue`
- ✅ `LoginPage.vue`
- ✅ `LandingPage.vue`
- ✅ `AddPropertyModal.vue`
- ✅ `AddPaymentModal.vue`
- ✅ `AddTenantModal.vue`
- ✅ `EditPaymentModal.vue`
- ✅ `EditPropertyModal.vue`
- ✅ `PaymentActions.vue`
- ✅ `PropertyCard.vue`
- ✅ `TenantCard.vue`
- ✅ `TenantInfo.vue`
- ✅ `PaymentsSection.vue`
- ✅ `PropertiesList.vue`
- ✅ `AppPreferences.vue`

### ⚠️ Composants partiellement traduits

- `SecuritySettings.vue` : Quelques textes dans des fonctions TODO non encore implémentées

---

## 🎯 Bonnes pratiques

1. **Utiliser des clés descriptives** : `properties.addProperty` plutôt que `add`
2. **Éviter les doublons** : Réutiliser `common.*` pour les textes génériques
3. **Respecter la hiérarchie** : `domain.subdomain.key` pour une organisation claire
4. **Traduire les placeholders** : Utiliser `:placeholder="$t('key')"` plutôt que du texte statique
5. **Tester dans les deux langues** : Vérifier que toutes les traductions sont présentes

---

## 🔄 Changer la langue de l'application

Le changement de langue se fait via le store `settingsStore` :

```vue
<script setup>
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()

// Changer la langue
settingsStore.setLanguage('en') // ou 'fr'
</script>
```

La langue est persistée dans `localStorage` et restaurée au chargement.

---

## 🌍 Ajouter une nouvelle langue

### Étape 1 : Créer le fichier de traduction

Créer `src/locales/i18n/es.json` (exemple pour l'espagnol) avec la même structure que `fr.json` et `en.json`.

### Étape 2 : Importer dans `src/i18n.js`

```javascript
import es from './locales/i18n/es.json'

const i18n = createI18n({
  // ...
  messages: {
    fr,
    en,
    es  // Nouvelle langue
  }
})
```

### Étape 3 : Ajouter dans le sélecteur de langue

Mettre à jour `SettingsLanguageCurrency.vue` et ajouter l'option "Español".

---

## 🚀 Tests

Pour tester le système i18n :

1. Démarrer l'app : `npm run dev`
2. Aller dans Paramètres → Langue & Devise
3. Changer la langue FR ↔ EN
4. Vérifier que tous les textes changent sur toutes les pages

---

## 📚 Ressources

- Documentation vue-i18n : https://vue-i18n.intlify.dev/
- Configuration actuelle : `src/i18n.js`
- Traductions : `src/locales/i18n/`

