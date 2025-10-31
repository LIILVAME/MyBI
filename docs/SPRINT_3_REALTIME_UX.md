# 🚀 Sprint 3 : Temps réel + UX (Toasts, Loaders, Skeletons)

## ✅ Fonctionnalités implémentées

### 1. **Système de toasts**
- ✅ `toastStore.js` : Store Pinia pour gérer les notifications
- ✅ `Toast.vue` : Composant UI avec animations et 3 types (success, error, info)
- ✅ Intégration dans `App.vue` (affichage global)
- ✅ Helpers : `toast.success()`, `toast.error()`, `toast.info()`
- ✅ Auto-dismiss après timeout configurable (4s par défaut, 6s pour erreurs)
- ✅ Support des actions cliquables dans les toasts

### 2. **Skeletons et loaders**
- ✅ `SkeletonCard.vue` : Skeleton pour les cartes de propriétés
- ✅ `InlineLoader.vue` : Loader inline réutilisable
- ✅ Intégration dans toutes les pages CRUD :
  - Skeletons lors du chargement initial (liste vide)
  - Loader inline lors des refresh (données déjà chargées)

### 3. **Temps réel Supabase**
- ✅ `useRealtime.js` : Composable pour s'abonner aux changements
- ✅ `propertiesStore.initRealtime()` : Écoute INSERT/UPDATE/DELETE sur `properties`
- ✅ `paymentsStore.initRealtime()` : Écoute INSERT/UPDATE/DELETE sur `payments`
- ✅ Locataires : synchronisés via `propertiesStore` (pas de table séparée)
- ✅ Filtrage par `user_id` pour la sécurité
- ✅ Notifications toast automatiques lors des changements en temps réel

### 4. **Gestion d'erreurs améliorée**
- ✅ Toasts d'erreur dans tous les stores (add, update, delete)
- ✅ Toasts de succès pour toutes les actions CRUD
- ✅ Messages d'erreur affichés dans les templates
- ✅ Logs console pour le debugging

---

## 📁 Fichiers créés/modifiés

### Nouveaux fichiers

#### Composables
- `src/composables/useRealtime.js`

#### Composants communs
- `src/components/common/Toast.vue`
- `src/components/common/SkeletonCard.vue`
- `src/components/common/InlineLoader.vue`

#### Stores
- `src/stores/toastStore.js`

### Fichiers modifiés

#### Stores
- `src/stores/propertiesStore.js` : Ajout de `initRealtime()` et toasts
- `src/stores/paymentsStore.js` : Ajout de `initRealtime()` et toasts
- `src/stores/tenantsStore.js` : Ajout de toasts dans les actions

#### Pages
- `src/pages/DashboardPage.vue` : Skeletons, loaders, realtime
- `src/pages/BiensPage.vue` : Skeletons, loaders, realtime
- `src/pages/PaiementsPage.vue` : Loaders, realtime
- `src/pages/LocatairesPage.vue` : Loaders, realtime

#### Composants
- `src/App.vue` : Ajout du composant `Toast`

---

## 🎯 Utilisation

### Toasts

```js
import { useToastStore } from '@/stores/toastStore'

const toast = useToastStore()

// Succès
toast.success('Bien ajouté avec succès')

// Erreur
toast.error('Erreur lors de l\'ajout')

// Info
toast.info('Nouveau bien : Appartement T2')

// Avec action
toast.success('Bien ajouté', {
  action: {
    label: 'Voir le bien',
    onClick: () => router.push('/biens')
  }
})
```

### Temps réel

```js
// Dans un composant
import { usePropertiesStore } from '@/stores/propertiesStore'

const propertiesStore = usePropertiesStore()

onMounted(async () => {
  await propertiesStore.fetchProperties()
  propertiesStore.initRealtime() // S'abonne aux changements
})

onUnmounted(() => {
  // propertiesStore.stopRealtime() // Optionnel
})
```

### Skeletons

```vue
<template>
  <div v-if="store.loading && store.items.length === 0" class="grid grid-cols-3 gap-6">
    <SkeletonCard v-for="n in 6" :key="n" />
  </div>
  
  <div v-else-if="store.loading">
    <InlineLoader />
  </div>
  
  <div v-else>
    <!-- Contenu normal -->
  </div>
</template>
```

---

## 🔄 Flux temps réel

### Properties (Biens)
1. **INSERT** : Nouveau bien ajouté → toast info + ajout dans la liste
2. **UPDATE** : Bien modifié → toast info + mise à jour dans la liste
3. **DELETE** : Bien supprimé → toast info + suppression de la liste

### Payments (Paiements)
1. **INSERT** : Nouveau paiement → toast info + ajout dans la liste
2. **UPDATE** : Paiement modifié → toast info + mise à jour
3. **DELETE** : Paiement supprimé → toast info + suppression

### Tenants (Locataires)
- Synchronisés automatiquement via `propertiesStore` (pas d'abonnement séparé)
- Les changements de locataires sont détectés lors des UPDATE sur `properties`

---

## ✨ Améliorations UX

### Avant
- Pas de feedback visuel lors des actions
- Chargement : spinner simple
- Pas de synchronisation entre onglets
- Erreurs silencieuses

### Après
- ✅ **Toasts visuels** pour toutes les actions
- ✅ **Skeletons** pour un chargement plus fluide
- ✅ **Temps réel** : changements visibles instantanément sur toutes les pages
- ✅ **Gestion d'erreurs** avec messages clairs
- ✅ **Feedback immédiat** pour chaque action CRUD

---

## 🔒 Sécurité

- **Filtrage par user_id** dans les abonnements temps réel
- **RLS activé** sur toutes les tables (properties, tenants, payments)
- **Vérification d'authentification** avant d'initialiser realtime
- **Gestion des erreurs** de connexion realtime

---

## 📝 Notes importantes

1. **Realtime channels** : Les canaux restent actifs globalement (non désabonnés au démontage)
   - ✅ Avantage : Synchronisation continue même si on change de page
   - ℹ️ Optionnel : Décommenter `stopRealtime()` dans `onUnmounted()` si besoin

2. **Locataires** : Pas d'abonnement séparé car dérivés des propriétés
   - Les changements de locataires sont détectés via les UPDATE sur `properties`

3. **Toasts** : Auto-dismiss après timeout
   - Success/Info : 4s
   - Error : 6s
   - Configurable via `timeout` option

4. **Performance** : Les skeletons sont affichés uniquement lors du chargement initial
   - Loader inline pour les refresh/update
   - Évite le flash de contenu lors des mises à jour

---

## 🚀 Prochaines étapes (v0.3.0+)

- [ ] Pagination avec skeletons pour les grandes listes
- [ ] Optimistic UI pour les actions (update immédiat avant confirmation serveur)
- [ ] Retry automatique en cas d'erreur réseau
- [ ] Toast avec actions personnalisées (ex: "Annuler la suppression")
- [ ] Notifications push pour les événements importants
- [ ] Indicateur de connexion temps réel (icône verte/rouge)

