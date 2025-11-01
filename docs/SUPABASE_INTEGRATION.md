# 🗄️ Intégration Supabase - Vylo

## ✅ Tables créées dans Supabase

### 1. Table `properties` (Biens)
- **Champs** : `id` (UUID), `name`, `address`, `city`, `rent`, `status` ('vacant'/'occupied'), `user_id`, `created_at`, `updated_at`
- **RLS activé** : ✅
- **Policies** : Utilisateurs peuvent uniquement voir/modifier/supprimer leurs propres biens

### 2. Table `tenants` (Locataires)
- **Champs** : `id` (UUID), `property_id` (FK vers properties), `name`, `entry_date`, `exit_date`, `rent`, `status` ('on_time'/'late'), `created_at`, `updated_at`
- **RLS activé** : ✅
- **Policies** : Utilisateurs peuvent gérer les locataires de leurs propres biens

### 3. Table `payments` (Paiements)
- **Champs** : `id` (UUID), `property_id` (FK vers properties), `tenant_id` (FK vers tenants), `amount`, `due_date`, `status` ('paid'/'pending'/'late'), `user_id`, `created_at`, `updated_at`
- **RLS activé** : ✅
- **Policies** : Utilisateurs peuvent uniquement voir/modifier/supprimer leurs propres paiements

---

## 🔄 Stores refactorisés

### `propertiesStore.js`
- ✅ `fetchProperties()` - Récupère les biens depuis Supabase avec leurs locataires
- ✅ `addProperty()` - Crée un bien + locataire si occupé
- ✅ `updateProperty()` - Met à jour un bien et son locataire
- ✅ `removeProperty()` - Supprime un bien (cascade vers tenants et payments)
- ✅ États : `loading`, `error`

### `paymentsStore.js`
- ✅ `fetchPayments()` - Récupère les paiements avec jointures properties/tenants
- ✅ `addPayment()` - Crée un paiement
- ✅ `updatePayment()` - Met à jour un paiement
- ✅ `removePayment()` - Supprime un paiement
- ✅ États : `loading`, `error`

### `tenantsStore.js`
- ✅ Utilise `propertiesStore` (dérivé des propriétés)
- ✅ `addTenant()` - Ajoute un locataire via `updateProperty`
- ✅ `updateTenant()` - Met à jour un locataire via `updateProperty`
- ✅ `removeTenant()` - Libère un bien (supprime le locataire)
- ✅ Les locataires utilisent maintenant `tenant.id` (UUID) au lieu de `property.id`

---

## 📄 Pages mises à jour

### `DashboardPage.vue`
- ✅ Appelle `fetchProperties()` et `fetchPayments()` au montage
- ✅ Gestion async des méthodes

### `BiensPage.vue`
- ✅ Appelle `fetchProperties()` au montage
- ✅ Méthodes CRUD async avec gestion d'erreur
- ✅ États de chargement/erreur (à afficher dans le template)

### `PaiementsPage.vue`
- ✅ Appelle `fetchPayments()` au montage
- ✅ Méthodes CRUD async avec gestion d'erreur

### `LocatairesPage.vue`
- ✅ Appelle `fetchProperties()` au montage (locataires dérivés)
- ✅ Méthodes async avec gestion d'erreur

---

## 🔧 Corrections apportées

### IDs UUID au lieu de nombres
- ✅ Tous les `Number(propertyId)` supprimés
- ✅ `AddPaymentModal.vue` : Utilise UUID directement
- ✅ `AddTenantModal.vue` : Utilise UUID directement
- ✅ `TenantCard` et `TenantsList` : Utilisent `tenant.id` (UUID)

---

## 🧹 Nettoyage

### Données mockées
- ⚠️ `src/data/mockData.js` : Toujours présent mais **non utilisé** par les stores principaux
- ℹ️ Seule référence restante : `LandingPage.vue` pour `mockTestimonials` (non critique)

### Actions à faire manuellement
1. **Optionnel** : Supprimer `src/data/mockData.js` si non utilisé ailleurs
2. **Ajouter les états de chargement** dans les templates des pages :
   ```vue
   <div v-if="propertiesStore.loading" class="text-center py-10">
     <p class="text-gray-500">Chargement des données...</p>
   </div>
   <div v-else-if="propertiesStore.error" class="text-center py-10">
     <p class="text-red-500">{{ propertiesStore.error }}</p>
   </div>
   ```

---

## 🎯 Fonctionnalités opérationnelles

✅ **CRUD complet** pour Biens, Locataires, Paiements
✅ **Synchronisation automatique** entre pages via les stores
✅ **RLS (Row-Level Security)** activé sur toutes les tables
✅ **Gestion d'erreurs** dans tous les stores
✅ **IDs UUID** partout (au lieu de nombres)

---

## 🚀 Prochaines étapes (v0.2.1+)

- [ ] Ajouter des notifications toast pour succès/erreurs
- [ ] Implémenter la pagination si > 100 éléments
- [ ] Ajouter des filtres avancés côté Supabase (RPC functions)
- [ ] Implémenter la recherche full-text sur les biens
- [ ] Ajouter la gestion des images de biens (Supabase Storage)
- [ ] Implémenter l'export des données (CSV, PDF)

---

## 📝 Notes importantes

1. **Format des dates** : Supabase utilise `date` (sans heure), les stores convertissent en `entryDate`/`exitDate` (camelCase) pour le front-end
2. **Relations** : Les locataires sont automatiquement supprimés si le bien est supprimé (cascade)
3. **Sécurité** : Toutes les opérations vérifient `user_id` via RLS, impossible d'accéder aux données d'autres utilisateurs
4. **Performance** : Les jointures sont faites côté Supabase avec `.select()` pour optimiser les requêtes

