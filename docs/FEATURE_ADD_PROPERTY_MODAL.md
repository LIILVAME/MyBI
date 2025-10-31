# ✨ Feature : Bouton "Ajouter un bien" Hybride

**Date** : Décembre 2024  
**Version** : v0.1.0 → v0.2.0 (préparation)  
**Statut** : ✅ **IMPLÉMENTÉ**

---

## 🎯 Objectif

Implémenter un bouton "Ajouter un bien" avec un **comportement hybride** :
- **v0.1.0** : Ouvre un modal local pour ajout rapide (mocké)
- **v0.2.0** : Redirige vers `/biens?mode=add` pour gestion complète via backend

---

## 📋 Fonctionnalités Implémentées

### ✅ Modal d'ajout (`AddPropertyModal.vue`)

**Fichier** : `src/components/dashboard/AddPropertyModal.vue`

**Fonctionnalités** :
- ✅ Formulaire complet avec validation HTML5
- ✅ Champs : Nom, Adresse, Ville, Loyer, Statut
- ✅ Design responsive et cohérent avec l'app
- ✅ Transitions fluides (fade in/out)
- ✅ Fermeture via bouton X ou clic sur overlay
- ✅ Réinitialisation automatique du formulaire

**Props** :
- `isOpen` (Boolean) : Contrôle la visibilité du modal

**Événements** :
- `@close` : Émis lors de la fermeture
- `@submit` : Émis lors de la soumission (avec données du formulaire)

---

### ✅ Intégration Dashboard (`DashboardPage.vue`)

**Fichier** : `src/pages/DashboardPage.vue`

**Fonctionnalités** :
- ✅ Gestion de l'état du modal (`isModalOpen`)
- ✅ Ajout de bien dans la liste locale (mocké)
- ✅ Mise à jour automatique des statistiques globales
- ✅ Génération d'ID temporaire pour v0.1.0
- ✅ TODO clairs pour migration v0.2.0

**Fonction `handleAddProperty`** :
```javascript
const handleAddProperty = (newProperty) => {
  // Génère un ID temporaire
  const newId = Math.max(...properties.value.map(p => p.id), 0) + 1
  
  // Crée le nouveau bien
  const property = {
    id: newId,
    name: newProperty.name,
    address: newProperty.address,
    city: newProperty.city,
    status: newProperty.status,
    rent: newProperty.rent,
    tenant: null,
    image: 'https://...' // Image par défaut
  }
  
  // Ajoute à la liste
  properties.value.push(property)
  
  // Met à jour les stats
  updateGlobalStats()
  
  // Ferme le modal
  isModalOpen.value = false
}
```

---

### ✅ Composant Liste (`PropertiesList.vue`)

**Fichier** : `src/components/dashboard/PropertiesList.vue`

**Fonctionnalités** :
- ✅ Bouton "Ajouter un bien" avec icône
- ✅ Émission d'événement `@add-click` vers le parent
- ✅ Code commenté pour redirection v0.2.0

---

## 🚀 Préparation v0.2.0

### Code Commenté Prêt

**Dans `PropertiesList.vue`** :
```vue
<!-- TODO v0.2.0 : Remplacer par redirection vers /biens?mode=add -->
<!--
<button 
  @click="$emit('redirect-to-add')"
  class="btn-primary flex items-center"
>
  ...
</button>
-->
```

**Dans `DashboardPage.vue`** :
```javascript
// TODO v0.2.0 : Rediriger vers /biens?mode=add au lieu d'ouvrir un modal local
// const handleAddPropertyClick = () => {
//   router.push({ path: '/biens', query: { mode: 'add' } })
// }

// TODO v0.2.0 : Remplacer par appel API via store Pinia
// const handleAddProperty = async (newProperty) => {
//   const property = await usePropertiesStore().addProperty(newProperty)
//   showToast('Bien ajouté avec succès !', { 
//     type: 'success',
//     action: { 
//       label: 'Voir dans mes biens', 
//       onClick: () => router.push('/biens') 
//     } 
//   })
// }
```

---

## 📊 Structure des Données

### Format d'entrée (Formulaire)
```javascript
{
  name: string,        // Ex: "Appartement T2 - Paris 15e"
  address: string,     // Ex: "45 Rue de Vaugirard, 75015 Paris"
  city: string,        // Ex: "Paris"
  rent: number,        // Ex: 950
  status: string       // "vacant" | "occupied"
}
```

### Format de sortie (Bien créé)
```javascript
{
  id: number,          // Généré automatiquement (v0.1.0) ou par API (v0.2.0)
  name: string,
  address: string,
  city: string,
  status: string,
  rent: number,
  tenant: null,        // Nouveau bien = pas de locataire
  image: string        // URL image par défaut
}
```

---

## 🎨 UX/UI

### Design
- ✅ Modal centré avec overlay sombre
- ✅ Formulaire clair avec labels et validations
- ✅ Boutons d'action cohérents (Annuler / Ajouter)
- ✅ Transitions fluides
- ✅ Responsive (mobile + desktop)

### Interactions
1. Clic sur "Ajouter un bien" → Ouvre le modal
2. Remplissage du formulaire → Validation HTML5
3. Clic sur "Ajouter" → Bien ajouté à la liste, stats mises à jour
4. Fermeture → Modal se ferme, formulaire réinitialisé

---

## ✅ Checklist de Validation

### Fonctionnalité ✅
- [x] Modal s'ouvre correctement
- [x] Formulaire valide les champs requis
- [x] Ajout de bien fonctionne (mocké)
- [x] Statistiques globales se mettent à jour
- [x] Modal se ferme après ajout
- [x] Formulaire se réinitialise

### Code ✅
- [x] Aucune erreur de linting
- [x] Code documenté avec commentaires JSDoc
- [x] TODO clairs pour v0.2.0
- [x] Imports cohérents
- [x] Props et événements bien définis

### UX/UI ✅
- [x] Design cohérent avec l'app
- [x] Responsive (mobile + desktop)
- [x] Transitions fluides
- [x] Validation claire (champs requis marqués)

### Préparation v0.2.0 ✅
- [x] Code commenté pour redirection
- [x] Structure prête pour API
- [x] TODO pour notifications toast
- [x] Router importé (prêt pour utilisation)

---

## 📝 Notes Techniques

### Téléportation du Modal
Le modal utilise `<Teleport to="body">` pour s'afficher au-dessus de tous les éléments, évitant les problèmes de z-index.

### Mise à jour des Statistiques
Les statistiques globales sont recalculées automatiquement après chaque ajout via `updateGlobalStats()`.

### Génération d'ID Temporaire
En v0.1.0, les IDs sont générés avec `Math.max(...properties.value.map(p => p.id), 0) + 1`.  
En v0.2.0, l'ID sera fourni par l'API backend.

---

## 🚀 Prochaines Étapes (v0.2.0)

1. **Créer la page `/biens?mode=add`** :
   - Formulaire complet avec validation avancée
   - Upload d'images
   - Gestion des erreurs API

2. **Implémenter le store Pinia** :
   ```javascript
   // stores/properties.js
   export const usePropertiesStore = defineStore('properties', {
     actions: {
       async addProperty(property) {
         const response = await api.post('/properties', property)
         this.properties.push(response.data)
         return response.data
       }
     }
   })
   ```

3. **Système de notifications toast** :
   - Utiliser une librairie (vue-toastification, sonner, etc.)
   - Afficher succès/erreur avec actions

4. **Migration progressive** :
   - Remplacer le modal par redirection
   - Tester avec données réelles
   - Supprimer le code mocké

---

**Document créé le** : Décembre 2024  
**Fonctionnalité validée** : ✅ **PRÊTE POUR v0.1.0**

