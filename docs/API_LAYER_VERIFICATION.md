# ✅ Vérification de la Couche API Centralisée

## 📋 Résumé de la refactorisation

Tous les appels Supabase dans les stores Pinia ont été remplacés par des appels à la couche API centralisée (`src/api/`).

---

## ✅ Stores vérifiés

### `propertiesStore.js`

**Appels API utilisés :**
- ✅ `propertiesApi.getProperties(userId)` - Récupération des propriétés
- ✅ `propertiesApi.getPropertyById(id, userId)` - Récupération d'une propriété (Realtime callbacks)
- ✅ `propertiesApi.createProperty(data, userId)` - Création d'une propriété
- ✅ `propertiesApi.updateProperty(id, updates, userId)` - Mise à jour d'une propriété
- ✅ `propertiesApi.deleteProperty(id, userId)` - Suppression d'une propriété
- ✅ `tenantsApi.createTenant(data, userId)` - Création d'un locataire
- ✅ `tenantsApi.updateTenant(id, updates, userId)` - Mise à jour d'un locataire
- ✅ `tenantsApi.deleteTenant(id, userId)` - Suppression d'un locataire

**Appels Supabase restants (infrastructure uniquement) :**
- `supabase.channel()` - Création du canal Realtime (infrastructure)
- `supabase.removeChannel()` - Nettoyage du canal Realtime (infrastructure)

**Aucun appel CRUD direct à Supabase** ✅

---

### `paymentsStore.js`

**Appels API utilisés :**
- ✅ `paymentsApi.getPayments(userId)` - Récupération des paiements
- ✅ `paymentsApi.getPaymentById(id, userId)` - Récupération d'un paiement (Realtime callbacks)
- ✅ `paymentsApi.createPayment(data, userId)` - Création d'un paiement
- ✅ `paymentsApi.updatePayment(id, updates, userId)` - Mise à jour d'un paiement
- ✅ `paymentsApi.deletePayment(id, userId)` - Suppression d'un paiement

**Appels Supabase restants (infrastructure uniquement) :**
- `supabase.channel()` - Création du canal Realtime (infrastructure)
- `supabase.removeChannel()` - Nettoyage du canal Realtime (infrastructure)

**Aucun appel CRUD direct à Supabase** ✅

---

### `tenantsStore.js`

**Pas d'appels directs à Supabase** ✅

Ce store utilise `propertiesStore.updateProperty()` qui passe maintenant par la couche API.

---

## 🔍 Gestion d'erreurs

### Tous les appels API utilisent `withErrorHandling()`

Les fonctions dans `src/api/` utilisent toutes `withErrorHandling()` qui :
- ✅ Log les erreurs avec contexte
- ✅ Retourne `{ success: boolean, message?: string, data?: any }`
- ✅ Affiche automatiquement un toast d'erreur via `toastStore`
- ✅ Convertit les erreurs Supabase en messages utilisateur conviviaux

### Messages d'erreur conviviaux

Les erreurs communes sont mappées :
- `Network request failed` → "Erreur réseau. Vérifiez votre connexion internet."
- `JWT expired` → "Votre session a expiré. Veuillez vous reconnecter."
- `new row violates row-level security policy` → "Action non autorisée. Vous n'avez pas les droits nécessaires."
- etc.

---

## 🧪 Tests à effectuer

### 1. Création d'une propriété
```
1. Ouvrir la page Biens
2. Cliquer sur "Ajouter un bien"
3. Remplir le formulaire et valider
4. ✅ Vérifier : Toast de succès affiché
5. ✅ Vérifier : Le bien apparaît dans la liste
6. ✅ Vérifier : Pas d'erreur dans la console
```

### 2. Mise à jour d'une propriété
```
1. Cliquer sur "Modifier" sur un bien
2. Changer le nom ou le loyer
3. Valider
4. ✅ Vérifier : Toast de succès affiché
5. ✅ Vérifier : Les modifications sont visibles immédiatement
6. ✅ Vérifier : Pas d'erreur dans la console
```

### 3. Suppression d'une propriété
```
1. Cliquer sur "Supprimer" sur un bien
2. Confirmer la suppression
3. ✅ Vérifier : Toast de succès affiché
4. ✅ Vérifier : Le bien disparaît de la liste
5. ✅ Vérifier : Pas d'erreur dans la console
```

### 4. Création d'un paiement
```
1. Ouvrir la page Paiements
2. Cliquer sur "Ajouter un paiement"
3. Remplir le formulaire et valider
4. ✅ Vérifier : Toast de succès affiché
5. ✅ Vérifier : Le paiement apparaît dans la liste
6. ✅ Vérifier : Pas d'erreur dans la console
```

### 5. Mise à jour d'un paiement
```
1. Modifier le statut d'un paiement (ex: pending → paid)
2. ✅ Vérifier : Toast de succès affiché
3. ✅ Vérifier : Le statut est mis à jour immédiatement
4. ✅ Vérifier : Pas d'erreur dans la console
```

### 6. Suppression d'un paiement
```
1. Supprimer un paiement
2. Confirmer
3. ✅ Vérifier : Toast de succès affiché
4. ✅ Vérifier : Le paiement disparaît de la liste
5. ✅ Vérifier : Pas d'erreur dans la console
```

### 7. Test d'erreur réseau
```
1. Couper la connexion internet (ou utiliser DevTools → Network → Offline)
2. Tenter de créer/modifier/supprimer une entité
3. ✅ Vérifier : Toast d'erreur "Erreur réseau. Vérifiez votre connexion internet."
4. ✅ Vérifier : L'application ne crash pas
```

---

## ✅ Statut de la refactorisation

- [x] Tous les appels CRUD passent par la couche API
- [x] Tous les callbacks Realtime utilisent l'API
- [x] Gestion d'erreurs centralisée via `withErrorHandling()`
- [x] ToastStore limité à 1 toast visible à la fois
- [x] Messages d'erreur conviviaux pour l'utilisateur
- [x] Aucun appel Supabase direct dans les méthodes CRUD
- [x] Seuls les appels d'infrastructure (Realtime channels) utilisent Supabase directement

---

## 📝 Notes

- Les appels `supabase.channel()` et `supabase.removeChannel()` sont acceptables car ils sont nécessaires pour l'infrastructure Realtime
- Les appels Supabase Auth (`supabase.auth.*`) dans `authStore.js` sont également acceptables car l'authentification n'est pas gérée par la couche API actuelle
- L'architecture est prête pour l'ajout de fonctionnalités futures :
  - Cache de requêtes
  - Retry automatique en cas d'erreur réseau
  - Logging centralisé (Sentry, etc.)
  - Rate limiting
  - Support offline

